// Explicit, local backup only. Normal readers and writers keep their existing keys.
window.STUDY_BACKUP = (() => {
  'use strict';

  const format = 'english-start-backup';
  const maxSize = 2 * 1024 * 1024;
  const course = 'english-start:course:1';
  const legacy = 'english-start:first-hello:1';
  const review = 'english-start:learned-review:1';
  const vocab = 'english-start:vocab:1';
  const papers = 'english-start:papers:1';
  const scores = 'english-start:2026-score:1';
  // Recognize the old paper ID for backup only. No question data ships with this edition.
  const archivedPaper = '2026';
  const groups = [course, legacy, review, vocab, papers, scores];
  const has = (object, key) => Object.hasOwn(object, key);
  const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const id = (value) => typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(value);
  const number = (value, max = Number.MAX_SAFE_INTEGER) => Number.isSafeInteger(value) && value >= 0 && value <= max;
  const optional = (value, valid) => value === undefined || valid(value);
  const flag = (value) => typeof value === 'boolean';
  const mapOf = (value, valid) => object(value) && Object.entries(value).every(([key, item]) => id(key) && valid(item));
  const screen = (item) => object(item) && ['example', 'build', 'transfer', 'done'].includes(item.screen)
    && optional(item.filled, (value) => Array.isArray(value) && value.length <= 100 && value.every(id))
    && [item.buildPassed, item.transferPassed, item.complete].every((value) => optional(value, flag));
  const answerMap = (value, valid) => object(value) && Object.entries(value).every(([key, item]) => /^[1-9][0-9]{0,2}$/.test(key) && valid(item));
  const answers = (value) => answerMap(value, (item) => typeof item === 'string' && item.length <= 1600);
  const score = (value, max) => Number.isFinite(value) && value >= 0 && value <= max;
  const attempt = (item) => object(item) && answers(item.answers)
    && optional(item.review, (value) => answerMap(value, (points) => score(points, 10)))
    && optional(item.at, (value) => number(value, 8_640_000_000_000_000));
  const paperRecord = (item) => object(item)
    && optional(item.draft, (draft) => object(draft) && answers(draft.answers) && optional(draft.section, number) && optional(draft.sheetOpen, flag))
    && optional(item.last, attempt)
    && optional(item.past, (value) => Array.isArray(value) && value.length <= 4 && value.every(attempt));
  const rules = {
    [course]: (item) => object(item) && mapOf(item.lessons, screen)
      && (item.active == null || (id(item.active) && has(item.lessons, item.active))),
    [legacy]: screen,
    [review]: (item) => mapOf(item, (record) => object(record)
      && [record.first, record.hinted, record.order].every((value) => optional(value, number))
      && (record.last === undefined || ['first', 'hinted'].includes(record.last)) && optional(record.seen, flag)),
    [vocab]: (item) => object(item) && mapOf(item.introduced, number)
      && mapOf(item.history, (record) => object(record) && Array.isArray(record.seen) && record.seen.length <= 100
        && record.seen.every((index) => number(index, 999))
        && [record.exposedAt, record.dueAt, record.independent].every((value) => optional(value, number))
        && (record.latest == null || ['first', 'hinted', 'delayed'].includes(record.latest))),
    [papers]: (item) => mapOf(item, paperRecord),
    [scores]: (item) => mapOf(item, (value) => score(value, 150)),
  };
  const ensure = (condition, message) => { if (!condition) throw new Error(message); };

  function parse(raw) {
    return JSON.parse(raw, (key, value) => {
      ensure(!['__proto__', 'constructor', 'prototype'].includes(key), '备份中含有不支持的字段。');
      return value;
    });
  }

  function checkRecords(records) {
    ensure(object(records), '备份缺少学习记录。');
    for (const [key, value] of Object.entries(records)) {
      ensure(groups.includes(key) && rules[key](value), '备份中含有未知类型或损坏的学习记录。');
    }
  }

  function exported(storage) {
    const records = {};
    for (const key of groups) {
      const raw = storage.getItem(key);
      if (raw !== null) records[key] = parse(raw);
    }
    checkRecords(records);
    const raw = JSON.stringify({ format, version: 1, exportedAt: new Date().toISOString(), records }, null, 2);
    ensure(new TextEncoder().encode(raw).length <= maxSize, '记录太大，超过 2 MB 备份上限。');
    return raw;
  }

  function decoded(raw) {
    ensure(typeof raw === 'string' && raw.length <= maxSize && new TextEncoder().encode(raw).length <= maxSize, '请选择不超过 2 MB 的备份。');
    const data = parse(raw.replace(/^\uFEFF/, ''));
    ensure(object(data) && data.format === format && data.version === 1, '这不是本站支持的备份格式。');
    checkRecords(data.records);
    return data.records;
  }

  function addedMap(current = {}, incoming = {}) {
    const missing = Object.entries(incoming).filter(([id]) => !has(current, id));
    return { value: { ...current, ...Object.fromEntries(missing) }, added: missing.length };
  }

  function checkCompatible(records) {
    const lessonIds = new Set(window.LESSONS.map((lesson) => lesson.id));
    const reviewIds = new Set(window.LEARNED_REVIEW.map((task) => task.reviewId));
    const words = new Map(window.VOCAB_WORDS.map((word) => [word.id, word.variants.length]));
    const paperIds = new Set(['mixed', window.EXAM_B?.id, archivedPaper]);
    const idsIn = (value, known) => Object.keys(value ?? {}).every((key) => known.has(key));
    ensure(idsIn(records[course]?.lessons, lessonIds) && idsIn(records[vocab]?.introduced, lessonIds)
      && idsIn(records[review], reviewIds) && idsIn(records[papers], paperIds)
      && Object.entries(records[vocab]?.history ?? {}).every(([id, record]) =>
        words.has(id) && record.seen.every((index) => index < words.get(id))),
    '备份含本版没有的课程、题目或例句。请用相同或较新的版本恢复。');
  }

  function preview(storage, records, migrateFirst) {
    checkRecords(records);
    checkCompatible(records);
    const snapshot = new Map();
    const changes = new Map();
    const counts = { lessons: 0, reviews: 0, vocab: 0, vocabDates: 0, drafts: 0, paperHistory: 0, scores: 0, archive: 0 };
    const oldPaper = records[papers]?.[archivedPaper];
    const includesArchive = Boolean(oldPaper?.draft || oldPaper?.last || oldPaper?.past?.length);
    function read(key) {
      const raw = storage.getItem(key);
      snapshot.set(key, raw);
      if (raw === null) return undefined;
      const value = parse(raw);
      ensure(rules[key](value), '本机对应记录格式异常。为免覆盖，未导入任何内容。');
      return value;
    }
    const put = (key, value) => changes.set(key, JSON.stringify(value));

    if (records[course] || records[legacy]) {
      const readLegacy = (item) => ({ active: 'first-hello', lessons: { 'first-hello': migrateFirst(item) } });
      let local = read(course);
      if (!local) {
        const old = read(legacy);
        local = old ? readLegacy(old) : { active: null, lessons: {} };
      }
      const incoming = records[course] ?? readLegacy(records[legacy]);
      const joined = addedMap(local.lessons, incoming.lessons);
      counts.lessons = joined.added;
      if (joined.added) put(course, { ...local, lessons: joined.value, active: local.active ?? incoming.active ?? null });
    }

    for (const [key, count] of [[review, 'reviews'], [scores, 'scores']]) {
      if (!records[key]) continue;
      const joined = addedMap(read(key), records[key]);
      counts[count] = joined.added;
      if (joined.added) put(key, joined.value);
    }

    if (records[vocab]) {
      const local = read(vocab);
      const dates = addedMap(local?.introduced, records[vocab].introduced);
      const history = addedMap(local?.history, records[vocab].history);
      counts.vocabDates = dates.added;
      counts.vocab = history.added;
      if (dates.added || history.added) put(vocab, { ...local, introduced: dates.value, history: history.value });
    }

    if (records[papers]) {
      const value = { ...read(papers) };
      for (const [id, incoming] of Object.entries(records[papers])) {
        const local = { ...value[id] };
        const archived = id === archivedPaper;
        const addDraft = !local.draft && Boolean(incoming.draft);
        const addHistory = !local.last && !local.past?.length && Boolean(incoming.last || incoming.past?.length);
        if (!addDraft && !addHistory) continue;
        if (addDraft) local.draft = incoming.draft;
        if (addHistory) {
          if (incoming.last) local.last = incoming.last;
          if (incoming.past?.length) local.past = incoming.past;
        }
        if (archived) {
          counts.archive = 1;
          value[id] = has(value, id) ? local : incoming;
        } else {
          counts.drafts += Number(addDraft);
          counts.paperHistory += Number(addHistory);
          value[id] = local;
        }
      }
      if (counts.drafts || counts.paperHistory || counts.archive) put(papers, value);
    }
    return { snapshot, changes, counts, includesArchive };
  }

  function restore(storage, plan) {
    for (const [key, before] of plan.snapshot) {
      ensure(storage.getItem(key) === before, '预览后本机记录有变化，请重新选择备份并预览。');
    }
    const written = [];
    try {
      for (const [key, after] of plan.changes) {
        storage.setItem(key, after);
        written.push(key);
        ensure(storage.getItem(key) === after, '写入未能验证。');
      }
    } catch {
      let reverted = true;
      for (const key of written.reverse()) {
        const before = plan.snapshot.get(key);
        try {
          if (storage.getItem(key) !== plan.changes.get(key)) { reverted = false; continue; }
          if (before === null) storage.removeItem(key);
          else storage.setItem(key, before);
          if (storage.getItem(key) !== before) reverted = false;
        } catch { reverted = false; }
      }
      throw new Error(reverted ? '浏览器没能保存导入，原有记录未变。' : '导入未完成，部分写入无法确认已还原。请保留备份，刷新后检查记录。');
    }
  }

  return Object.freeze({ maxSize, exported, decoded, preview, restore });
})();
