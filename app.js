(() => {
  'use strict';

  const lessons = window.LESSONS;
  const mainLessons = lessons.filter((item) => !item.practiceUnit);
  const unitPractice = lessons.filter((item) => item.practiceUnit);
  const practiceSets = {
    review: { tasks: window.REVIEW, title: '一分钟回练', label: '一分钟回练', done: '三句都接上了',
      subtitle: '今天先练到这里也行。明天回来，再试试不看示范能不能选对。', repeat: '再做一次回练', finish: '看回练小结' },
    bridge: { tasks: window.EXAM_BRIDGE, title: '备考入门 · 补全对话', label: '补全对话', done: '三段对话都补全了',
      subtitle: '记住这次用到的线索。下次碰到空格，先看看前后两句在说什么。', repeat: '再练一次补全对话', finish: '看练习小结' },
    context: { tasks: window.CONTEXT_WORDS, title: '备考入门 · 句中词义', label: '句中词义', done: '三句话都看懂了',
      subtitle: '同一个词，放进不同句子里可能换意思。先找句子里的线索。', repeat: '再练一次句中词义', finish: '看词义小结' },
    readingStart: { tasks: window.READING_START.tasks, title: '短阅读导学', label: '短阅读导学',
      done: '你找到了能证明答案的句子', subtitle: '先看题目问什么，再用原文里的动作核对。不要只认一个数字或物品名。' },
    reading: { tasks: window.READING_INTRO.tasks, passage: window.READING_INTRO,
      title: '备考入门 · 短阅读', label: '短阅读', done: '三道题都找到了原文依据',
      subtitle: '先看题在问什么，再回原文找一句能证明答案的话。', repeat: '再练一次短阅读', finish: '看阅读小结' },
    readingStory: { tasks: window.READING_STORY.tasks, passage: window.READING_STORY,
      title: '阅读进阶 · 校园故事', label: '校园故事', done: '故事阅读完成',
      subtitle: '把两段的信息连起来，再决定哪个选项最符合全文。', repeat: '再练一次校园故事', finish: '看故事小结' },
    readingGuide: { tasks: window.READING_GUIDE.tasks, passage: window.READING_GUIDE,
      title: '阅读进阶 · 午餐指南', label: '午餐指南', done: '指南阅读完成',
      subtitle: '看文章怎样说话，也看看陌生词旁边有没有解释。', repeat: '再练一次午餐指南', finish: '看指南小结' },
    cloze: { tasks: window.CLOZE_INTRO.tasks, passage: window.CLOZE_INTRO,
      title: '备考入门 · 微型完形', label: '微型完形', done: '三个空都填好了',
      subtitle: '先看搭配，再看前后句的关系；没把握时，往后找证据。', repeat: '再练一次微型完形', finish: '看完形小结' },
    insert: { tasks: window.SENTENCE_INSERT.tasks, passage: window.SENTENCE_INSERT, sharedOptions: true,
      title: '备考入门 · 短文选句', label: '短文选句', done: '三句话都接回了原文',
      subtitle: '整句放进空格后，前后都要读得通。', repeat: '再练一次短文选句', finish: '看选句小结' },
    grammar: { tasks: window.GRAMMAR_INTRO.tasks, passage: window.GRAMMAR_INTRO, written: true,
      title: '备考书写 · 语法填空', label: '语法填空', done: '三处语法空格都练完了',
      subtitle: '先看时间、数量或搭配，再决定要写什么。', repeat: '再练一次语法填空', finish: '看语法小结' },
    sentence: { tasks: window.SENTENCE_WRITING, written: true,
      title: '备考书写 · 完成句子', label: '完成句子', done: '三道补句都练完了',
      subtitle: '小结展示的是参考写法，不是唯一答案。', repeat: '再练一次完成句子', finish: '看补句小结' },
    sentenceBridge: { tasks: window.SENTENCE_WRITING_BRIDGE, written: true, guide: 'sentenceBridge',
      title: '备考书写 · 补句进阶', label: '补句进阶', done: '补句进阶练完了',
      subtitle: '重新连读空格两边，看看时间、语序和固定搭配有没有接上。', repeat: '再做一轮补句进阶', finish: '看补句进阶小结' },
    email: { tasks: [window.EMAIL_WRITING], title: '备考书写 · 短邮件', label: '短邮件' },
    learnedReview: { tasks: window.LEARNED_REVIEW, title: '按学过的内容练', label: '学过内容复习', done: '这轮复习做完了',
      subtitle: '只练已完成的课。做对一次不等于记牢，想复习时再回来。', repeat: '再练一轮', finish: '看复习小结' },
    noticeReview: { tasks: window.NOTICE_REVIEW, title: '按学过的内容练', label: '通知复习', done: '这轮复习做完了',
      subtitle: '这里只练已完成的通知课。做对一次不代表已经记牢。', repeat: '重新选题', finish: '看复习小结' },
  };
  const card = document.querySelector('#card');
  const returnHome = document.querySelector('#return-home');
  const progress = document.querySelector('#progress');
  const storageNote = document.querySelector('#storage-note');
  const key = 'english-start:course:1';
  const legacyKey = 'english-start:first-hello:1';
  const reviewKey = 'english-start:learned-review:1';
  const examScoreKey = 'english-start:2026-score:1';
  const readingSessionKey = 'english-start:reading-session:1';
  const readingModes = ['readingStart', 'reading', 'readingStory', 'readingGuide'];
  const writingSessionKey = 'english-start:writing-session:1';
  const writingLimits = { grammar: 40, sentence: 160, sentenceBridge: 160, email: 1600 };
  // 题型用于推荐课程；旧满分只用于显示以前手填的成绩。
  const examSections = [
    ['dialogue', '补全对话', 10, ['request-reply', 'conversation-purpose', 'service-borrow', 'service-directions', 'service-booking']],
    ['words', '词汇', 20, ['context-actions', 'phrases-in-context', 'vocab-borrow-lend', 'vocab-return-keep', 'vocab-library-reading']],
    ['cloze', '完形填空', 30, ['context-cloze', 'link-a-list', 'cloze-collocations', 'cloze-later-clue', 'cloze-read-back']],
    ['reading', '阅读理解', 30, ['notice-whole', 'reading-main-idea', 'reading-inference', 'reading-question-words', 'reading-paraphrase', 'reading-exceptions', 'notice-deadline', 'notice-condition', 'notice-change', 'reading-order', 'reading-examples', 'reading-purpose', 'past-story', 'future-notice', 'compare-direction', 'compare-quantity', 'compare-reading', 'reason-or-purpose', 'purpose-or-result', 'reason-purpose-reading', 'rules-can-must', 'rules-mustnt-optional', 'rules-who-reading', 'passive-roles', 'passive-no-agent', 'passive-notice', 'relative-people', 'relative-things', 'relative-notice', 'poster-signup', 'poster-no-experience', 'poster-compare']],
    ['insert', '短文选句', 15, ['reference-basics', 'link-a-sentence', 'insert-reference', 'insert-relation', 'insert-both-sides']],
    ['grammar', '语法填空', 20, ['noun-count', 'past-form', 'one-with-article', 'adjective-adverb', 'time-duration', 'own-things', 'after-ing', 'enough-to', 'present-routine', 'present-negative', 'present-questions', 'past-negative', 'past-questions', 'future-will', 'future-negative', 'gap-what', 'gap-word-job', 'gap-spend-ing']],
    ['sentence', '完成句子', 15, ['embedded-question', 'past-in-progress', 'advice-pride', 'sentence-past-phrase', 'sentence-location-question', 'sentence-proud-boundary']],
    ['email', '应用写作', 10, ['email-plan', 'email-use-details', 'email-specific-reason', 'email-revise']],
  ];
  const screens = ['example', 'build', 'transfer', 'done'];
  const defaultStepLabels = ['先看一句', '拼一句', '认一句'];
  const examTopics = window.EXAM_FOCUS || [];
  let activeAudio = null;
  let lesson = null;
  let state = null;
  let examFollowUp = null;
  const practiceDrafts = { ...loadReadingDrafts(), ...loadWritingDrafts() };
  let practiceMode = null;
  let directory = null;
  const course = load();
  const reviewHistory = loadReviewHistory();
  const vocab = window.VOCAB_REVIEW?.create({ words: window.VOCAB_WORDS || [], storage: () => window.localStorage,
    isComplete: (id) => course.lessons[id]?.complete, storageUnavailable });
  let vocabRound = null;
  const paperMode = window.PAPER_MODE.create({ el, button, heading, card, render, storageUnavailable, suggestLesson, reviewPractice,
    enterPaper: () => { directory = 'papers'; }, backToPrep: openExamPrep });

  const examSection = id => /^reading(?:-|$)/.test(id) ? 'reading' : id;

  function reviewPractice(sectionId, paperId) {
    const id = examSection(sectionId);
    const topic = examTopics.find((item) => item.sections[0].id === id);
    if (topic && topic.id !== paperId) return { label: `做同类题 · ${topic.title}`, run: () => paperMode.startTopic(topic) };
    const mode = { dialogue: 'bridge', words: 'context', reading: 'readingStory', cloze: 'cloze', insert: 'insert',
      grammar: 'grammar', sentence: 'sentenceBridge', email: 'email' }[id];
    if (mode) return { label: `去练${practiceSets[mode].label}`, run: () => openPractice(mode) };
  }

  function suggestLesson(sectionId, followUp) {
    const id = examSection(sectionId);
    const ids = examSections.find(([section]) => section === id)?.[3];
    if (!ids) return null;
    const target = lessons.find((item) => ids.includes(item.id) && !course.lessons[item.id]?.complete)
      || lessons.find((item) => item.id === ids[0]);
    if (!target) return null;
    return button(`${course.lessons[target.id]?.complete ? '回看' : '补课'}：${target.title}`, 'btn',
      () => openLesson(target, course.lessons[target.id]?.complete === true, followUp));
  }

  function loadReviewHistory() {
    const result = Object.create(null);
    try {
      const data = JSON.parse(window.localStorage.getItem(reviewKey));
      for (const task of practiceSets.learnedReview.tasks) {
        const record = task.reviewId && data?.[task.reviewId];
        if (!record || typeof record !== 'object') continue;
        const count = (value) => Number.isSafeInteger(value) && value >= 0 ? value : 0;
        const last = ['first', 'hinted'].includes(record.last) ? record.last : undefined;
        if (!last && record.seen !== true) continue;
        result[task.reviewId] = { seen: true, first: count(record.first), hinted: count(record.hinted), last, order: count(record.order) };
      }
    } catch { /* Learning still works without storage or with a broken review record. */ }
    return result;
  }

  function recordReviewAnswer(task, hinted) {
    if (!task.reviewId) return;
    const result = hinted ? 'hinted' : 'first';
    const record = reviewHistory[task.reviewId] || { first: 0, hinted: 0 };
    record[result] += 1;
    record.seen = true;
    record.last = result;
    record.order = 1 + Math.max(0, ...Object.values(reviewHistory).map((item) => item.order || 0));
    reviewHistory[task.reviewId] = record;
    saveReviewHistory();
  }

  function saveReviewHistory() {
    try { window.localStorage.setItem(reviewKey, JSON.stringify(reviewHistory)); }
    catch { storageUnavailable(); }
  }

  function markReviewSeen(task) {
    if (reviewHistory[task.reviewId]?.seen) return;
    reviewHistory[task.reviewId] = { first: 0, hinted: 0, seen: true, order: 0 };
    saveReviewHistory();
  }

  function fresh(complete = false) {
    return { screen: 'example', filled: [], buildPassed: false, transferPassed: false, complete };
  }

  function storageUnavailable() {
    storageNote.textContent = '这个浏览器不允许保存进度，关掉页面后可能需要重来。';
  }

  function loadReadingDrafts() {
    const drafts = {};
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(readingSessionKey));
      for (const mode of readingModes) {
        const draft = saved?.[mode];
        if (!Number.isInteger(draft?.index) || draft.index < 0 || draft.index >= practiceSets[mode].tasks.length) continue;
        drafts[mode] = {
          index: draft.index,
          answered: draft.answered === true,
          readingExampleSeen: mode === 'readingStart' && (draft.index > 0 || draft.readingExampleSeen === true),
        };
      }
    } catch { /* Reading remains available when browser storage is blocked. */ }
    return drafts;
  }

  function saveReadingDrafts(mode) {
    if (!readingModes.includes(mode)) return;
    const drafts = {};
    for (const readingMode of readingModes) {
      const draft = practiceDrafts[readingMode];
      if (draft && draft.index < practiceSets[readingMode].tasks.length) {
        const { index, answered, readingExampleSeen } = draft;
        drafts[readingMode] = { index, answered, readingExampleSeen };
      }
    }
    try { window.sessionStorage.setItem(readingSessionKey, JSON.stringify(drafts)); }
    catch { /* Keep the in-memory draft if this tab cannot store it. */ }
  }

  function normalizeWriting(text) {
    return text.normalize('NFKC').trim().toLowerCase();
  }

  function matchSentence(task, text) {
    const normalize = (value) => normalizeWriting(value).replace(/[‘’]/g, "'").replace(/\s+/g, ' ');
    const written = normalize(text);
    return task.accepted.find((answer) => normalize(answer) === written);
  }

  function loadWritingDrafts() {
    const drafts = {};
    try {
      const saved = JSON.parse(window.sessionStorage.getItem(writingSessionKey));
      for (const [mode, limit] of Object.entries(writingLimits)) {
        const draft = saved?.[mode];
        if (!Number.isInteger(draft?.index) || draft.index < 0) continue;
        const typed = typeof draft.typed === 'string' ? draft.typed.slice(0, limit) : '';
        const task = practiceSets[mode].tasks[draft.index];
        if (mode === 'email') {
          const hasEnglish = /[a-z]/i.test(normalizeWriting(typed));
          const checks = practiceSets.email.tasks[0].checks.map((_, i) => hasEnglish && draft.checks?.[i] === true);
          const index = draft.index === 1 && checks.every(Boolean) ? 1 : 0;
          drafts[mode] = { index, typed, checks, recheck: draft.recheck === true && !checks.every(Boolean) };
        } else if (task) {
          const matched = task.accepted && matchSentence(task, typed);
          const correct = mode === 'grammar' ? normalizeWriting(typed) === task.answer : Boolean(matched);
          drafts[mode] = { index: draft.index, typed, answered: draft.answered === true && correct,
            matched: draft.answered === true ? matched : '', compare: draft.compare === true };
        }
      }
    } catch { /* Writing remains available when this tab cannot store drafts. */ }
    return drafts;
  }

  function saveWritingDrafts(mode) {
    if (!Object.hasOwn(writingLimits, mode)) return;
    const drafts = {};
    for (const writingMode of Object.keys(writingLimits)) {
      const draft = practiceDrafts[writingMode];
      if (draft && (writingMode === 'email' || draft.index < practiceSets[writingMode].tasks.length)) {
        const { index, typed, answered, compare, checks, recheck } = draft;
        drafts[writingMode] = { index, typed, answered, compare, checks, recheck };
      }
    }
    try { window.sessionStorage.setItem(writingSessionKey, JSON.stringify(drafts)); }
    catch { /* Keep the in-memory draft if this tab cannot store it. */ }
  }

  function normalize(saved, item, legacy = false) {
    if (!saved || !screens.includes(saved.screen)) return fresh();
    const order = item.build.order;
    const filled = order && Array.isArray(saved.filled) && saved.filled.length <= order.length &&
      saved.filled.every((id, i) => id === order[i]) ? saved.filled : [];
    const buildPassed = order ? filled.length === order.length : saved.buildPassed === true;
    const transferPassed = buildPassed && saved.transferPassed === true;
    let screen = saved.screen;
    if (screen === 'done' && !transferPassed) screen = 'transfer';
    if (screen === 'transfer' && !buildPassed) screen = 'build';
    return { screen, filled, buildPassed, transferPassed, complete: screen === 'done' || (!legacy && saved.complete === true) };
  }

  function load() {
    const result = { active: null, lessons: {} };
    let raw, legacy;
    try {
      raw = window.localStorage.getItem(key);
      if (raw === null) legacy = window.localStorage.getItem(legacyKey);
    } catch {
      storageUnavailable();
      return result;
    }
    try {
      if (raw !== null) {
        const saved = JSON.parse(raw);
        for (const item of lessons) {
          const draft = saved?.lessons?.[item.id];
          if (draft && screens.includes(draft.screen)) result.lessons[item.id] = normalize(draft, item);
        }
        if (lessons.some((item) => item.id === saved?.active) && result.lessons[saved.active]) result.active = saved.active;
      } else if (legacy) {
        const old = JSON.parse(legacy);
        if (old && screens.includes(old.screen)) {
          const first = lessons[0];
          result.lessons[first.id] = normalize(old, first, true);
          result.active = first.id;
        }
      }
    } catch {
      // A broken save should not prevent opening the course.
    }
    return result;
  }

  function save() {
    try {
      window.localStorage.setItem(key, JSON.stringify(course));
    } catch {
      storageUnavailable();
    }
  }

  function openLesson(item, replay = false, followUp = null) {
    directory = null;
    practiceMode = null;
    lesson = item;
    examFollowUp = followUp;
    const previous = course.lessons[item.id];
    state = (!previous || replay) ? fresh(previous?.complete) : previous;
    course.lessons[item.id] = state;
    course.active = item.id;
    save();
    render(true);
  }

  function backToCourse() {
    lesson = null;
    state = null;
    practiceMode = null;
    directory = null;
    render(true);
  }

  function conversationDone() {
    return ['first-hello', 'ask-name', 'first-conversation'].every((id) => course.lessons[id]?.complete);
  }

  function practiceLabel(mode) {
    const draft = practiceDrafts[mode];
    const set = practiceSets[mode];
    if (mode === 'email' && draft?.index === 1) return '查看短邮件草稿';
    return `${draft && draft.index < practiceTasks(mode).length ? '继续' : '开始'}${set.label}`;
  }

  function reviewFingerprint(task) {
    const normalize = (value) => String(value).normalize('NFKC').toLowerCase().replace(/[\p{P}\p{Z}\s]+/gu, '');
    return JSON.stringify([normalize(task.prompt || ''), (task.dialogueLines || []).map(normalize), task.options.map((option) => normalize(option.label)).sort()]);
  }

  function eligibleReviewTasks(mode) {
    const unique = new Set();
    const ids = new Set();
    return practiceSets[mode].tasks.filter((task) => {
      if (!task.reviewId || ids.has(task.reviewId) || !task.requires.every((id) => course.lessons[id]?.complete)) return false;
      const fingerprint = reviewFingerprint(task);
      if (unique.has(fingerprint)) return false;
      unique.add(fingerprint);
      ids.add(task.reviewId);
      return true;
    });
  }

  function eligibleNoticeTasks() {
    return eligibleReviewTasks('noticeReview');
  }

  function nextLearnedTasks(previous, focus, repeatSeen) {
    const eligible = eligibleReviewTasks('learnedReview').filter((task) => !focus || task.requires.includes(focus));
    const pool = eligible.filter((task) => repeatSeen ? reviewHistory[task.reviewId]?.seen : !reviewHistory[task.reviewId]?.seen);
    const last = previous?.tasks.at(-1);
    const start = last && pool.length ? (pool.indexOf(last) + 1) % pool.length : 0;
    const rotated = pool.slice(start).concat(pool.slice(0, start));
    const skill = (task) => task.skill || task.requires.join();
    const recent = new Map();
    // Use the last result for the skill, so a later independent success retires the priority.
    for (const task of eligible) {
      const record = reviewHistory[task.reviewId];
      const previous = recent.get(skill(task));
      if (record?.last && (!previous || record.order >= previous.record.order)) recent.set(skill(task), { task, record });
    }
    const weak = [...recent.values()].filter(({ record }) => record.last === 'hinted').sort((a, b) => b.record.order - a.record.order);
    const preferred = [];
    for (const { task: missed } of weak) {
      const alternatives = rotated.filter((task) => task !== missed && skill(task) === skill(missed));
      const alternate = alternatives.find((task) => !previous?.tasks.includes(task)) || alternatives[0];
      if (alternate) preferred.push(alternate);
    }
    const remaining = rotated.filter((task) => !preferred.includes(task));
    return [...preferred, ...remaining].slice(0, 3);
  }

  function practiceTasks(mode) {
    return practiceDrafts[mode]?.tasks || practiceSets[mode].tasks;
  }

  function openPractice(mode, restart = false, focus = null, repeatSeen = false) {
    if (mode === 'review' && !conversationDone()) return;
    const draft = practiceDrafts[mode];
    if (restart || !draft || (mode !== 'email' && draft.index >= practiceTasks(mode).length)) {
      if (mode === 'noticeReview' || mode === 'learnedReview') {
        const tasks = mode === 'learnedReview' ? nextLearnedTasks(draft, focus, repeatSeen) : eligibleNoticeTasks().slice(0, 3);
        if (!tasks.length && mode !== 'learnedReview') return;
        practiceDrafts[mode] = { index: 0, answered: false, tasks, focus, repeatSeen };
      } else practiceDrafts[mode] = { index: 0, answered: false };
      saveReadingDrafts(mode);
      saveWritingDrafts(mode);
    }
    lesson = null;
    state = null;
    practiceMode = mode;
    render(true);
  }

  function el(tag, text, className) {
    const element = document.createElement(tag);
    if (text != null) element.textContent = text;
    if (className) element.className = className;
    return element;
  }

  function button(label, className, onClick) {
    const item = el('button', label, className);
    item.type = 'button';
    item.addEventListener('click', onClick);
    return item;
  }

  function english(element) {
    element.lang = 'en';
    return element;
  }

  function wordText(element, text, context = text, status) {
    const tokens = window.WORD_TOKENS?.scan(text, context) || [];
    const parts = [];
    let end = 0;
    for (const { word, start, key: wordKey } of tokens) {
      const src = window.WORD_AUDIO?.urlFor(wordKey);
      parts.push(text.slice(end, start));
      if (!src) parts.push(word);
      else {
        const control = english(button(word, 'word-sound', () => {
          speak(window.WORD_TOKENS.spoken(wordKey), status, { src, control, label: word });
        }));
        control.title = `听单词：${word}`;
        parts.push(control);
      }
      end = start + word.length;
    }
    element.replaceChildren(...parts, text.slice(end));
    return element;
  }

  function wordLine(tag, text, className, status) {
    return wordText(english(el(tag, null, className)), text, text, status);
  }

  function feedback(id) {
    const element = el('p', '', 'feedback');
    element.id = id;
    element.setAttribute('role', 'status');
    element.setAttribute('aria-atomic', 'true');
    return element;
  }

  function tell(element, message, tone) {
    if (tone) element.dataset.tone = tone;
    else delete element.dataset.tone;
    element.textContent = message;
  }

  function heading(tag, title, subtitle, target = card) {
    const titleNode = el('h1', title);
    titleNode.tabIndex = -1;
    if (tag) target.append(el('p', tag, 'tag'));
    target.append(titleNode, el('p', subtitle, 'lead'));
  }

  function go(next) {
    state.screen = next;
    if (next === 'done' && !state.complete) {
      state.complete = true;
      vocab?.taught(lesson.id);
    }
    save();
    render(true);
  }

  function actionRow(...children) {
    const row = el('div', null, 'actions');
    row.append(...children);
    return row;
  }

  function actions(...children) {
    card.append(actionRow(...children));
  }

  function soundButton(label, text, status) {
    const control = button(label, 'btn sound', () => speak(text, status));
    const ns = 'http://www.w3.org/2000/svg';
    const icon = document.createElementNS(ns, 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('aria-hidden', 'true');
    icon.setAttribute('fill', 'none');
    const shape = document.createElementNS(ns, 'path');
    shape.setAttribute('d', 'M3 9h4l5-4v14l-5-4H3z M16 9a4 4 0 0 1 0 6 M18 6a8 8 0 0 1 0 12');
    shape.setAttribute('stroke', 'currentColor');
    shape.setAttribute('stroke-width', '1.7');
    shape.setAttribute('stroke-linejoin', 'round');
    shape.setAttribute('stroke-linecap', 'round');
    icon.append(shape);
    control.prepend(icon);
    return control;
  }

  function audioFeedback(id = 'audio-feedback') {
    const node = feedback(id);
    node.dataset.audio = '';
    return node;
  }

  function stopAudio() {
    const previous = activeAudio;
    activeAudio = null;
    if (!previous) return;
    window.clearTimeout(previous.timer);
    if (previous.control) delete previous.control.dataset.playing;
    try { previous.cancel?.(); } catch { /* Audio must not block navigation. */ }
  }

  function speak(text, status, options = {}) {
    stopAudio();
    const word = Boolean(options.control);
    const note = status || card.querySelector(word ? '#word-audio-feedback' : '#audio-feedback');
    if (!word) card.querySelectorAll('[data-audio]').forEach((item) => tell(item, '', null));
    const report = (message, tone) => { if (note) tell(note, message, tone); };
    const unavailable = location.protocol === 'file:'
      ? '没能播放这段语音。请完整解压课程包，用浏览器打开首页。也可以看文字继续。'
      : '没能播放这段语音。请刷新再试；若从聊天里打开，可换系统浏览器。也可以看文字继续。';
    const started = (playback, message) => {
      if (activeAudio !== playback) return;
      window.clearTimeout(playback.timer);
      report(message, 'ok');
    };
    const release = (playback) => {
      if (playback.control) delete playback.control.dataset.playing;
    };
    const ended = (playback) => {
      if (activeAudio !== playback) return;
      window.clearTimeout(playback.timer);
      activeAudio = null;
      release(playback);
      report(word ? `「${options.label}」读完了。再点一次可以重听。` : '播放结束。想再听就点一次。', 'ok');
    };

    function speakLocally() {
      const synth = window.speechSynthesis;
      const playback = { timer: 0, control: options.control };
      const failed = () => {
        if (activeAudio !== playback) return;
        stopAudio();
        report(unavailable, 'hint');
      };
      activeAudio = playback;
      try {
        const voices = (synth?.getVoices() || []).filter((voice) => voice.localService && /^en(?:[-_]|$)/i.test(voice.lang));
        const voice = voices.find((item) => /^en[-_]us$/i.test(item.lang)) || voices[0];
        if (!voice || typeof window.SpeechSynthesisUtterance !== 'function') return failed();
        const phrase = new window.SpeechSynthesisUtterance(text);
        phrase.voice = voice;
        phrase.lang = voice.lang;
        phrase.rate = 0.84;
        phrase.onstart = () => started(playback, word ? `正在用设备的音色读「${options.label}」。` : '正在用设备的英语音色朗读。');
        phrase.onend = () => ended(playback);
        phrase.onerror = failed;
        playback.cancel = () => synth.cancel();
        playback.timer = window.setTimeout(failed, 5000);
        synth.speak(phrase);
      } catch { failed(); }
    }

    const src = options.src || window.LESSON_AUDIO?.urlFor(text);
    if (!src || typeof window.Audio !== 'function') return speakLocally();
    const playback = { timer: 0, control: options.control };
    const fallback = (error) => {
      if (activeAudio !== playback) return;
      stopAudio();
      if (error?.name === 'NotAllowedError') {
        report('浏览器拦住了播放。请再点一次；仍没声音，可以用系统浏览器打开。', 'hint');
      } else speakLocally();
    };
    activeAudio = playback;
    if (options.control) options.control.dataset.playing = '';
    report(word ? `正在读「${options.label}」…` : '正在载入语音…', null);
    try {
      const media = new window.Audio();
      playback.cancel = () => {
        media.pause();
        media.removeAttribute('src');
        media.load();
      };
      media.addEventListener('playing', () => started(playback, word ? `正在读「${options.label}」。` : '正在播放。'));
      media.addEventListener('ended', () => ended(playback), { once: true });
      media.addEventListener('error', fallback, { once: true });
      media.preload = 'none';
      media.src = src;
      playback.timer = window.setTimeout(fallback, 8000);
      // Call play during the tap; deferring it can lose the browser's user gesture.
      media.play()?.catch(fallback);
    } catch (error) { fallback(error); }
  }

  function recommendedLesson() {
    return lessons.find((item) => item.id === course.active && !course.lessons[item.id]?.complete)
      || mainLessons.find((item) => !course.lessons[item.id]?.complete);
  }

  function home() {
    const dialogueFinished = conversationDone();
    const nextLesson = recommendedLesson();
    const hero = el('section', null, 'home-hero');
    const intro = el('div', null, 'home-intro');
    heading(null, '3＋证书英语备考', nextLesson
      ? '先做一组题，找出容易丢分的题型。刚开始学英语，可以从基础课学起。'
      : '正课已学完。可以按题型查漏，也能从课程目录选做单元加练。', intro);
    const examStart = button('按题型备考', 'btn primary exam-start', openExamPrep);
    const reassurance = el('p', '基础课可以点读和点选。备考写作可以自己动笔。', 'note home-reassurance');
    reassurance.id = 'home-reassurance';
    if (!nextLesson) {
      const last = lessons.find((item) => item.id === 'first-conversation');
      intro.append(actionRow(examStart, button(practiceLabel('review'), 'btn', () => openPractice('review')),
        button('回练第三课', 'btn', () => openLesson(last, course.lessons[last.id]?.screen === 'done'))));
    } else {
      const saved = course.lessons[nextLesson.id];
      const start = button(`${saved ? '继续' : '开始'}${nextLesson.number}`, 'btn foundation-start', () => openLesson(nextLesson));
      const details = el('p', nextLesson.title, 'home-next');
      details.id = 'home-next';
      if (saved) {
        const step = screens.indexOf(saved.screen);
        const name = (nextLesson.stepLabels || defaultStepLabels)[step];
        if (name) details.append(el('span', `第 ${step + 1} 步 · ${name}`, 'home-step'));
      }
      start.setAttribute('aria-describedby', `${details.id} ${reassurance.id}`);
      intro.append(actionRow(examStart, start), details);
    }
    const arrow = el('span', '→', 'start-arrow');
    arrow.setAttribute('aria-hidden', 'true');
    examStart.append(arrow);
    intro.append(reassurance);
    hero.append(intro, document.querySelector('#intro-art').content.cloneNode(true));
    card.append(hero);
    studyNav(true);

    const learned = mainLessons.filter((item) => course.lessons[item.id]?.complete).length;
    const practiced = unitPractice.filter((item) => course.lessons[item.id]?.complete).length;
    const strip = el('div', null, 'home-progress-strip');
    const meter = el('progress');
    meter.max = mainLessons.length;
    meter.value = learned;
    meter.setAttribute('aria-label', '正课完成进度');
    strip.append(el('p', `已学完 ${learned} / ${mainLessons.length} 课 · 单元加练 ${practiced} / ${unitPractice.length} 节`, 'home-progress'), meter);
    card.append(strip);
    const words = vocab?.status();
    if (words?.learned) {
      const resume = vocabRound && vocabRound.index < vocabRound.tasks.length;
      actions(button(resume ? '继续词汇复习' : '复习几个词', 'btn', openVocab),
        el('p', resume ? '这一轮还没做完 · 选做'
          : words.due ? `有 ${words.due} 个已学词可复习 · 选做` : '只复习学过的词 · 选做', 'note'));
    }
    if (dialogueFinished && nextLesson) actions(button(practiceLabel('review'), 'btn', () => openPractice('review')), button('回练第三课', 'btn', () => {
      const conversation = lessons.find((item) => item.id === 'first-conversation');
      openLesson(conversation, course.lessons[conversation.id].screen === 'done');
    }));

    const list = el('section', null, 'course-list home-lessons');
    const title = el('h2', '先从这三小课起步');
    title.id = 'lessons-title';
    list.setAttribute('aria-labelledby', title.id);
    list.append(title, lessonRows(lessons.slice(0, 3)));
    card.append(list);
    if (eligibleReviewTasks('learnedReview').length) actions(button('按学过的内容练', 'btn', () => openPractice('learnedReview')),
      el('p', '只练已完成的课，每轮最多三题。', 'note'));
    if (eligibleNoticeTasks().length) actions(button(practiceLabel('noticeReview'), 'btn', () => openPractice('noticeReview')),
      el('p', '按你学完的通知课选题，最多三题。', 'note'));
  }

  function lessonRows(items) {
    const rows = el('ol', null, 'course-rows');
    items.forEach((item) => {
      const previous = course.lessons[item.id];
      const row = el('li');
      const control = button(null, 'lesson-link', () => openLesson(item));
      control.dataset.lesson = item.id;
      const num = el('span', String(lessons.indexOf(item) + 1).padStart(2, '0'), 'lesson-number');
      num.setAttribute('aria-hidden', 'true');
      const label = el('span', item.title, 'lesson-title');
      const status = el('span', previous?.complete ? '已完成' : previous ? '进行中' : '未开始', 'lesson-status');
      if (previous?.complete) status.dataset.complete = '';
      control.append(num, label, status);
      row.append(control);
      rows.append(row);
    });
    return rows;
  }

  function lessonDirectory() {
    const units = [
      ['见面和打招呼', 0, 3], ['看懂校园通知', 3, 7], ['读懂一句话', 7, 12],
      ['从句子读到短文', 12, 19], ['动笔前先学句式', 19, 31], ['词组和邮件审题', 31, 33],
      ['阅读细节进阶', 33, 36],
      ['办事通知：截止、条件和变更', 36, 39, '分清什么时候交、规则对谁生效、实际去哪儿。'],
      ['短邮件：细节、理由和检查', 39, 42, '从一句「我喜欢」写到有细节、有理由的正文。'],
      ['完形：搭配、线索和回读', 42, 45, '先读空格附近，再往后找证据，最后回填检查。'],
      ['校园服务：借用、问路和约时间', 45, 48, '先听明白对方要什么，再核对方向和最后的安排。'],
      ['把短文读成整体：顺序、例子和意图', 48, 51, '分清先后、观点与例子，再判断作者写这段是为了什么。'],
      ['一般现在时：习惯、否定与问答', 51, 54, '从 I read 到 Does she read?，分清变化跟着谁。'],
      ['一般过去时：否定、问答与故事', 54, 57, '从 didn’t 和 Did 问答，走到读懂过去发生的事。'],
      ['说将来：会做、不会做与通知变更', 57, 60, '从 will 和 won’t 读出下一步安排。'],
      ['读懂比较：谁更多、数字和范围', 60, 63, '看清 than 两边，读出数字界线，再按指定范围找证据。'],
      ['读懂原因、目的和结果', 63, 66, '分清为什么做、想做到什么，以及最后真的怎样。'],
      ['读懂校园规则：允许、必须和禁止', 66, 69, '分清必须、禁止和不必，再找出适用于自己的规定。'],
      ['读懂被动句：谁做的、什么变了', 69, 72, '先找受影响的人或物，再找原文有没有交代谁做的。'],
      ['长句先读主干：哪一批人、哪样东西', 72, 75, '用 who 或 that 后的描述找对人或物，再读动作和安排。'],
      ['场景词汇：借东西、留多久、什么时候还', 75, 78, '在句子里认出 borrow、lend、keep 和 return，不用单独默写。'],
      ['读社团招新海报：报名、条件与时间', 78, 81, '找准报名和集合地点，再按条件和时间挑活动。'],
      ['短文选句：看前面，也看后面', 81, 84, '找到代词指谁、句子怎样转折或举例，再放回原文核对。'],
      ['语法填空：先判断空里缺什么', 84, 87, '没括号先找缺的信息，有括号先看词在句子里做什么。'],
      ['完成句子：看两边，只补缺的部分', 87, 90, '用时间、语序和固定搭配核对要补的半句；课末可以选做书写。'],
      ['看时间表：按同一行的字段找信息', 90, 93, '先按星期几和几点定到一行，再用通知排掉被改过的旧信息。'],
      ['看报名表和回执：按栏名填、按状态走', 93, 96, '先按栏名把信息填进对应的一栏，再按回执状态决定下一步，最后只改更正通知点名的一项。'],
      ['看价签和优惠：单价、门槛和小票', 96, mainLessons.length, '先分清单价和成组价，再读清数量与对象门槛，最后拿两份材料核对小票上收费不符的那一项。'],
    ];
    const catalog = el('div', null, 'lesson-directory');
    const next = recommendedLesson();
    for (const [index, [label, start, end, goal]] of units.entries()) {
      const items = mainLessons.slice(start, end);
      const practice = unitPractice.find((item) => item.practiceUnit === index + 1);
      const complete = items.filter((item) => course.lessons[item.id]?.complete).length;
      const group = el('details', null, 'unit-group');
      group.open = items.includes(next) || next === practice;
      const toggle = el('summary');
      const number = el('span', String(index + 1).padStart(2, '0'), 'lesson-number unit-index');
      toggle.setAttribute('aria-label', `第 ${index + 1} 单元，${label}，已完成 ${complete} 节，共 ${items.length} 节`);
      toggle.append(number, el('strong', label), el('span', `${complete}/${items.length} 已完成`, 'lesson-status'));
      group.append(toggle, el('p', `第 ${start + 1}–${end} 课${goal ? ` · ${goal}` : ''}`, 'note'), lessonRows(items));
      if (practice) group.append(el('p', '单元加练（选做）', 'note'), lessonRows([practice]));
      catalog.append(group);
    }
    card.append(catalog);
  }

  const studyAreas = [
    ['lessons', '课程目录', '按单元找课', 'M4 5h6a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H4z M20 5h-6a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h6z'],
    ['choices', '点选练习', '不用打字', 'M4 5h16v14H4z M8 12l2.5 2.5L16 9'],
    ['writing', '书写练习', '选做填空与邮件', 'M13.5 6.5l4 4 M4 20l1-5L16 4l4 4L9 19z'],
    ['papers', '试卷', '限时模拟、看成绩', 'M6 3h8l4 4v14H6z M14 3v5h4 M9 12h6 M9 16h6'],
    ['progress', '学习进度', '查看已学课程', 'M4 20h16 M7 16v-4 M12 16V8 M17 16V4'],
  ];

  function openExamPrep() {
    lesson = null;
    state = null;
    practiceMode = null;
    examFollowUp = null;
    directory = 'exam';
    render(true);
  }

  function showExamPrep() {
    heading('广东中职 3＋证书', '按题型备考', '做题看失分，回课补方法，再换一组同类题。');
    card.setAttribute('aria-label', '按题型备考');
    const mock = paperMode.mockButton?.();
    if (mock) {
      const simulation = el('section', null, 'exam-diagnostic exam-simulation');
      simulation.append(el('h2', '限时模拟考'), el('p', '61 题 · 150 分 · 120 分钟。每套题目独立。'), mock);
      card.append(simulation);
    }
    const diagnostic = el('section', null, 'exam-diagnostic');
    const start = paperMode.diagnosticButton();
    start.classList.add('primary');
    diagnostic.append(el('h2', '先做诊断卷'), el('p', '原创 B 卷覆盖各题型，共 26 题。交卷后可以按失分回课。'), start);
    card.append(diagnostic);

    const headingTopics = el('h2', '直接练薄弱题型', 'exam-topic-heading');
    const grid = el('div', null, 'exam-topic-grid');
    const descriptions = {
      cloze: '读完整故事，练搭配、转折和后文线索。',
      insert: '用指代和段落关系，把五个句子放回去。',
      grammar: '在同一篇短文里补词，或写出括号词的正确形式。',
      sentence: '按中文提示写半句，检查空格两边。',
      email: '写一封约 40 词的邮件，再按要点自查。',
    };
    for (const topic of examTopics) {
      const section = topic.sections[0];
      const item = el('section', null, 'exam-topic-card');
      const title = el('h3', topic.title);
      const link = paperMode.topicButton(topic);
      item.append(title, el('p', descriptions[section.id]), el('span', `${section.questions.length} 题`, 'exam-topic-count'), link);
      grid.append(item);
    }
    card.append(headingTopics, grid);
    actions(button('更多点选练习', 'btn', () => { directory = 'choices'; render(true); }),
      button('查看练习成绩', 'btn', () => { directory = 'progress'; render(true); }));
  }

  function studyNav(detailed = false) {
    const nav = el('nav', null, detailed ? 'study-nav home-nav' : 'study-nav');
    nav.setAttribute('aria-label', '学习分区');
    for (const [id, title, description, shape] of studyAreas) {
      const item = button(title, 'btn', () => { directory = id; if (id === 'papers') paperMode.resetView(); render(true); });
      if (detailed) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('aria-hidden', 'true');
        const path = document.createElementNS(svg.namespaceURI, 'path');
        path.setAttribute('d', shape);
        svg.append(path);
        const caption = el('span', null, 'nav-caption');
        caption.append(el('strong', title), el('span', description, 'nav-description'));
        item.replaceChildren(svg, caption);
        item.setAttribute('aria-label', title);
      }
      if (directory === id) item.setAttribute('aria-current', 'page');
      nav.append(item);
    }
    card.append(nav);
  }

  function showLearningProgress() {
    const completed = (id) => Boolean(course.lessons[id]?.complete);
    const learned = mainLessons.filter((item) => completed(item.id)).length;
    const practiced = unitPractice.filter((item) => completed(item.id)).length;
    const started = mainLessons.filter((item) => course.lessons[item.id] && !completed(item.id)).length;
    heading('课程和试卷分开看', '学习进度', '你可以看学到哪儿、原创练习卷的成绩，或按题型找课。');
    card.setAttribute('aria-label', '学习进度');
    studyNav();
    const overview = el('section', null, 'course-list');
    overview.append(el('h2', `已学完 ${learned} / ${mainLessons.length} 课`));
    const bar = el('progress');
    bar.max = mainLessons.length;
    bar.value = learned;
    bar.setAttribute('aria-label', '已完成课程');
    overview.append(bar, el('p', `进行中 ${started} 课 · 未开始 ${mainLessons.length - learned - started} 课`, 'note'),
      el('p', `单元加练已完成 ${practiced} / ${unitPractice.length} 节`, 'note'));
    const next = recommendedLesson();
    if (next) overview.append(button(`${course.lessons[next.id] ? '继续' : '下一课：'}${next.title}`, 'btn primary', () => openLesson(next)));
    if (window.STUDY_BACKUP) overview.append(button('备份与恢复', 'btn', () => { directory = 'backup'; render(true); }));
    card.append(overview);

    const topics = el('section', null, 'course-list');
    topics.append(el('h2', '按题型找课'), el('p', '如果某一类题容易卡住，可以先回去学对应的方法。完成课程不等于已经拿到卷面分。', 'note'));
    const results = el('section', null, 'course-list');
    results.append(el('h2', '整卷成绩'));
    paperMode.showResults(results);
    results.append(button('去试卷', 'btn', () => { directory = 'papers'; paperMode.resetView(); render(true); }));
    let previous;
    try { previous = JSON.parse(window.localStorage.getItem(examScoreKey)); } catch { /* Optional older record. */ }
    const oldScores = examSections.filter(([id, , max]) => typeof previous?.[id] === 'number' && previous[id] >= 0 && previous[id] <= max);
    if (oldScores.length) {
      const archive = el('details');
      archive.append(el('summary', '以前手填的成绩（不计入整卷）'));
      for (const [id, title, max] of oldScores) archive.append(el('p', `${title}：${previous[id]} / ${max} 分`, 'note'));
      results.append(archive);
    }
    card.append(results);
    for (const [, title, , ids] of examSections) {
      const row = el('section', null, 'exam-score-row');
      row.append(el('h3', title), el('p', `对应正课：已完成 ${ids.filter(completed).length} / ${ids.length} 节`, 'note'));
      const pending = lessons.find((item) => ids.includes(item.id) && !completed(item.id));
      if (pending) row.append(button(`补课：${pending.title}`, 'btn', () => openLesson(pending)));
      topics.append(row);
    }
    card.append(topics);
  }

  function showStudyBackup() {
    const backup = window.STUDY_BACKUP;
    heading('留在你手上', '备份与恢复', '把学习记录存成一个本地文件。恢复只补本机没有的记录，不覆盖已有进度，不联网。');
    card.setAttribute('aria-label', '备份与恢复');
    const panel = el('section', null, 'course-list');
    const note = feedback('backup-feedback');
    const details = el('p', '', 'note');
    let plan;
    let selection = 0;
    panel.append(el('h2', '本地学习记录'), el('p', '包括课程、复习、整卷草稿与交卷记录。单项练习的临时草稿不在里面。文件可能含你写过的整卷答案，请不要公开分享。', 'note'),
      el('p', '同一课已打开过就保留本机进度；同一套试卷的草稿与历史，分别只在本机没有时补入。恢复前建议关闭其他正在使用本站的标签页。', 'note'));
    const download = button('下载备份文件', 'btn', () => {
      try {
        const data = backup.exported(window.localStorage);
        const url = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
        const link = el('a');
        link.href = url;
        link.download = `english-start-backup-${new Date().toISOString().slice(0, 10)}.json`;
        link.hidden = true;
        panel.append(link);
        link.click();
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        tell(note, '已请求浏览器下载。请在下载列表确认并保留文件。', 'ok');
      } catch (error) { tell(note, `无法下载备份：${error.message}`, 'hint'); }
    });
    const input = el('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.id = 'backup-file';
    const label = el('label', '选择本站备份文件（JSON）');
    label.htmlFor = input.id;
    const apply = button('补入缺少的记录并重新打开', 'btn primary', () => {
      if (!plan?.changes.size) return;
      try { backup.restore(window.localStorage, plan); }
      catch (error) {
        plan = null;
        input.value = '';
        apply.disabled = true;
        details.textContent = '';
        tell(note, error.message, 'hint');
        return;
      }
      window.location.reload();
    });
    apply.disabled = true;
    input.addEventListener('change', async () => {
      const current = ++selection;
      apply.disabled = true;
      details.textContent = '';
      plan = null;
      const file = input.files?.[0];
      if (!file) { tell(note, '', null); return; }
      tell(note, '正在读取，不会先写入学习记录。', null);
      try {
        if (file.size > backup.maxSize) throw new Error('请选择不超过 2 MB 的备份。');
        const records = backup.decoded(await file.text());
        if (current !== selection || !panel.isConnected) return;
        plan = backup.preview(window.localStorage, records, (old) => normalize(old, lessons[0], true));
        const count = plan.counts;
        const archiveNote = !plan.includesArchive ? '' : count.archive
          ? '另补入旧版 2026 年答卷的缺项，可再导出；本版不能续答或评分。'
          : '本机已有的旧版 2026 年答卷不会被覆盖；本版不能续答或评分。';
        if (!plan.changes.size) {
          details.textContent = archiveNote;
          tell(note, '没有可补入的记录。本机已有的条目不会被覆盖。', 'hint');
          return;
        }
        const currentRecords = `可补入：课程 ${count.lessons} 项、综合复习 ${count.reviews} 项、词汇 ${count.vocab} 项及复习起点 ${count.vocabDates} 项、原创卷草稿 ${count.drafts} 份、原创卷历史 ${count.paperHistory} 套、旧手填记录 ${count.scores} 项。`;
        details.textContent = archiveNote ? `${currentRecords} ${archiveNote}` : currentRecords;
        tell(note, '预览完成，尚未写入。确认后会刷新。本标签页的阅读和书写练习可以继续。', 'hint');
        apply.disabled = false;
      } catch (error) {
        if (current === selection && panel.isConnected) tell(note, `未导入：${error.message}`, 'hint');
      }
    });
    const controls = el('div', null, 'written-form');
    controls.append(label, input, details, note, apply);
    panel.append(download, controls);
    card.append(panel);
    actions(button('回学习进度', 'btn', () => { directory = 'progress'; render(true); }));
  }

  function openVocab() {
    if (!vocabRound || vocabRound.index >= vocabRound.tasks.length) {
      const tasks = vocab.round().map((task) => ({ ...task, reverse: Math.random() < 0.5 }));
      vocabRound = { tasks, index: 0, results: [], hinted: false };
    }
    directory = 'vocab';
    render(true);
  }

  function showVocab() {
    card.setAttribute('aria-label', '词汇复习');
    const { tasks, index, results } = vocabRound;
    const current = tasks[index];
    const labels = { first: '首次独立认对', hinted: '看提示后认对', delayed: '隔天在新句里独立认对' };
    if (!current) {
      const status = vocab.status();
      heading('已学词 · 选做', results.length ? '这轮词汇复习完成' : '今天先练到这里',
        status.due ? '还有已学词有新句子可练。想继续再开一轮。'
          : status.waiting ? '新的例句先留到下次。你可以现在继续上课。' : '已学词的原创例句都看完了，不会拿旧句凑数。');
      if (results.length) {
        const list = el('ul', null, 'review-summary');
        for (const { word, result } of results) {
          const item = el('li');
          item.append(english(el('strong', word.term)), document.createTextNode(` · ${labels[result]}`));
          list.append(item);
        }
        card.append(list);
      }
      card.append(el('p', `正课已学 ${status.learned} 项。按每项最近的结果：首次独立 ${status.first} 项、隔天独立 ${status.delayed} 项、提示后 ${status.hinted} 项。不是词汇量测验。`, 'note'));
      if (status.waiting) card.append(el('p', `${status.waiting} 项还没到下次复习时间。`, 'note'));
      if (status.exhausted) card.append(el('p', `${status.exhausted} 项的原创例句已用完。`, 'note'));
      actions(...(status.due ? [button('再复习几个词', 'btn', openVocab)] : []), button('回课程首页', 'btn', backToCourse));
      return;
    }
    vocab.seen(current);
    const { word, variantIndex } = current;
    const variant = word.variants[variantIndex];
    progress.hidden = false;
    progress.textContent = `词汇复习 · 第 ${index + 1} 项，共 ${tasks.length} 项`;
    const options = variant.options.map((label, i) => ({ id: String(i), label }));
    if (current.reverse) options.reverse();
    const hint = `${word.term}：${word.meaning}。再读一个短例子，然后回到上面这句试试。`;
    const reveal = () => {
      vocabRound.hinted = true;
      if (card.querySelector('.vocab-example')) return;
      const example = el('div', null, 'speech vocab-example');
      example.append(wordLine('p', word.example[0]), el('p', word.example[1]));
      card.querySelector('.options').before(example);
    };
    showChoice({ title: '在新句子里认词', prompt: variant.prompt, dialogueLines: variant.lines, glossary: variant.glossary,
      options: options.map((option) => ({ ...option, hint })), answer: '0', success: `${word.term}：${word.meaning}。` }, {
      id: 'vocab', nextLabel: index + 1 === tasks.length ? '看词汇小结' : '下一个词',
      passed: () => results.length > index,
      pass: () => results.push({ word, result: vocab.answer(current, vocabRound.hinted) }),
      advance: () => { vocabRound.index++; vocabRound.hinted = false; render(true); },
      backLabel: results.length > index ? null : '不认识，先看例子',
      back: () => { if (results.length > index) return; reveal(); tell(card.querySelector('#vocab-feedback'), hint, 'hint'); },
      onHint: reveal,
    });
    if (vocabRound.hinted && results.length === index) {
      reveal();
      tell(card.querySelector('#vocab-feedback'), hint, 'hint');
    }
  }

  function showDirectory() {
    if (directory === 'backup') return showStudyBackup();
    if (directory === 'vocab') return showVocab();
    if (directory === 'exam') return showExamPrep();
    if (directory === 'papers') {
      card.setAttribute('aria-label', '试卷');
      return paperMode.show();
    }
    if (directory === 'progress') return showLearningProgress();
    if (directory === 'lessons') {
      heading('英语起步 · 学习路线', '课程目录', '按主题找课。默认展开首页推荐课程所在的单元，也可以打开其他组。');
      card.setAttribute('aria-label', '课程目录');
      studyNav();
      lessonDirectory();
      return;
    }
    const writingMode = directory === 'writing';
    const title = writingMode ? '书写练习' : '点选练习';
    heading('广东中职 3＋证书 · 原创练习', title, writingMode
      ? '选做，可以从写一个词开始。同一标签页刷新后，在这里点「继续」续写。'
      : '补全对话、词义、阅读、完形和选句。都不用打字，选你想练的。');
    card.setAttribute('aria-label', title);
    studyNav();
    if (writingMode) writingDirectory();
    else choiceDirectory();
  }

  function choiceDirectory() {
    const choices = el('section', null, 'course-list');
    const choicesTitle = el('h2', '备考入门：先做点选题');
    choicesTitle.id = 'choice-practices-title';
    choices.setAttribute('aria-labelledby', choicesTitle.id);
    choices.append(choicesTitle, el('p', '不要求打字，从补全对话开始，也可以挑题型。以下都是原创练习。', 'note'));
    const bridge = el('section', null, 'course-list');
    const bridgeTitle = el('h3', practiceSets.bridge.title);
    bridgeTitle.id = 'bridge-title';
    bridge.setAttribute('aria-labelledby', bridgeTitle.id);
    bridge.append(bridgeTitle, el('p', '三道原创题，不是真题。先有中文提示，再试着只看英文。', 'note'),
      button(practiceLabel('bridge'), 'btn', () => openPractice('bridge')));
    choices.append(bridge);

    const context = el('section', null, 'course-list');
    const contextTitle = el('h3', practiceSets.context.title);
    contextTitle.id = 'context-title';
    context.setAttribute('aria-labelledby', contextTitle.id);
    context.append(contextTitle, el('p', '三道原创题，练在句子里猜词义，不要求拼写。', 'note'),
      button(practiceLabel('context'), 'btn', () => openPractice('context')));
    choices.append(context);

    const reading = el('section', null, 'course-list');
    const readingTitle = el('h3', practiceSets.reading.title);
    readingTitle.id = 'reading-title';
    reading.setAttribute('aria-labelledby', readingTitle.id);
    reading.append(readingTitle, el('p', '第一次读短文，可以从导学开始。同一标签页刷新后，在这里点「继续」接着做。', 'note'),
      actionRow(button(practiceLabel('readingStart'), 'btn', () => openPractice('readingStart')),
        button(practiceLabel('reading'), 'btn', () => openPractice('reading'))));
    for (const [mode, description] of [
      ['readingStory', '校园故事：把开头和结尾连起来，练主旨和人物推断。'],
      ['readingGuide', '午餐指南：从写法判断出处，用上下文猜词。'],
    ]) {
      const extra = el('div', null, 'reading-extra');
      extra.append(el('p', description, 'note'), button(practiceLabel(mode), 'btn', () => openPractice(mode)));
      reading.append(extra);
    }
    choices.append(reading);

    const cloze = el('section', null, 'course-list');
    const clozeTitle = el('h3', practiceSets.cloze.title);
    clozeTitle.id = 'cloze-title';
    cloze.setAttribute('aria-labelledby', clozeTitle.id);
    cloze.append(clozeTitle, el('p', '一篇原创短文，三个空。每空四选一，不用打字。', 'note'),
      button(practiceLabel('cloze'), 'btn', () => openPractice('cloze')));
    choices.append(cloze);

    const insert = el('section', null, 'course-list');
    const insertTitle = el('h3', practiceSets.insert.title);
    insertTitle.id = 'insert-title';
    insert.setAttribute('aria-labelledby', insertTitle.id);
    insert.append(insertTitle, el('p', '原创短文，三个空。练把整句接回文章，不是真题。', 'note'),
      button(practiceLabel('insert'), 'btn', () => openPractice('insert')));
    choices.append(insert);
    card.append(choices);
  }

  function writingDirectory() {
    const writing = el('section', null, 'course-list');
    const writingTitle = el('h2', '备考书写：想动笔时再来');
    writingTitle.id = 'writing-practices-title';
    writing.setAttribute('aria-labelledby', writingTitle.id);
    writing.append(writingTitle, el('p', '选做，不影响入门。建议从写一个词，到补半句，再写一封短邮件；不用录音，也不单独考拼写。', 'note'));
    const grammar = el('section', null, 'course-list');
    const grammarTitle = el('h3', practiceSets.grammar.title);
    grammarTitle.id = 'grammar-title';
    grammar.setAttribute('aria-labelledby', grammarTitle.id);
    grammar.append(grammarTitle, el('p', '三处原创书写题，每空写一个词。选做，不影响入门进度。', 'note'),
      button(practiceLabel('grammar'), 'btn', () => openPractice('grammar')));
    writing.append(grammar);
    const completion = el('section', null, 'course-list');
    completion.append(el('h3', practiceSets.sentence.title), el('p', '三道原创题，按中文提示写出空缺。选做，不影响入门进度。', 'note'),
      button(practiceLabel('sentence'), 'btn', () => openPractice('sentence')));
    completion.append(el('p', '第 88–90 课的延伸：识别时间、补地点问句，再核对空后已有的 of。', 'note'),
      button(practiceLabel('sentenceBridge'), 'btn', () => openPractice('sentenceBridge')));
    writing.append(completion);

    const email = el('section', null, 'course-list');
    email.append(el('h3', practiceSets.email.title), el('p', '一封原创短邮件，正文约 40 词。选做，写完自己对照，不自动评分。', 'note'),
      button(practiceLabel('email'), 'btn', () => openPractice('email')));
    writing.append(email);
    card.append(writing);
  }

  function exampleDetails(title, lines, className, note) {
    const details = el('details', null, className);
    const list = el('ul');
    for (const [phrase, translation] of lines) {
      const row = el('li');
      row.append(wordText(english(el('strong', null)), phrase), el('span', translation));
      list.append(row);
    }
    details.append(el('summary', title), list);
    if (note) details.append(el('p', note, 'note'));
    return details;
  }

  function showExample() {
    const example = lesson.example;
    heading(null, example.title || '先看一句', `${lesson.scene} ${lesson.goal}`);
    if (example.dialogue) {
      const dialogue = el('ol', null, 'dialogue');
      for (const line of example.dialogue) {
        const row = el('li', null, 'dialogue-line');
        row.dataset.dialogueLine = '';
        if (line.yours) row.dataset.yours = '';
        const status = audioFeedback(`line-audio-${dialogue.children.length + 1}`);
        row.append(el('p', line.speaker, 'speaker'), wordLine('p', line.english, 'line-en'),
          el('p', line.chinese, 'line-zh'), soundButton('听这句', line.english, status), status);
        row.querySelector('button').setAttribute('aria-label', `听这句：${line.speaker}，${line.english}`);
        dialogue.append(row);
      }
      card.append(dialogue);
    } else {
      const phrase = english(el('p', null, 'sentence'));
      if (example.parts) {
        example.parts.forEach((part, index) => {
          const span = el('span', null, index === 2 ? 'name' : undefined);
          wordText(span, part, example.english);
          phrase.append(span);
        });
      } else wordText(phrase, example.english);
      const speech = el('section', null, 'speech lesson-example');
      speech.append(el('h2', '示范例句', 'study-label'), phrase, el('p', example.chinese, 'translation'), soundButton('听一遍', example.english));
      if (phrase.querySelector('.word-sound')) speech.append(el('p', '点句子里的单词，可以单独听它。', 'note word-hint'));
      if (example.english.length > 64 || example.english.includes('\n')) phrase.classList.add('sentence-long');
      const meanings = el('ul', null, 'meanings');
      for (const part of example.meanings) {
        const item = el('li');
        item.append(english(el('strong', part.english)), el('span', part.chinese));
        meanings.append(item);
      }
      card.append(speech);
      if (meanings.children.length) {
        const wordBank = el('section', null, 'lesson-words');
        wordBank.append(el('h2', '这课的词和短语', 'study-label'), meanings);
        card.append(wordBank);
      }
    }
    if (lesson.letters) {
      const letters = el('details', null, 'alphabet');
      letters.append(el('summary', '字母还不熟？'), el('p', '这些字母就在上面那句里。点一下，可以听字母的名字。', 'note'));
      const letterButtons = el('div', null, 'letters');
      for (const letter of lesson.letters) {
        const item = english(button(`${letter.upper} ${letter.lower}`, 'btn', () => speak(letter.speech)));
        letterButtons.append(item);
      }
      letters.append(letterButtons);
      card.append(letters);
    }
    if (example.teaching) {
      const explanation = el('section', null, 'lesson-explanation');
      const steps = el('ol', null, 'teaching-steps');
      for (const step of example.teaching) steps.append(el('li', step));
      explanation.append(el('h2', '怎么读这句话', 'study-label'), steps);
      card.append(explanation);
    }
    const guidance = window.LESSON_GUIDANCE?.[lesson.id];
    if (guidance) {
      const walkthrough = el('section', null, 'lesson-explanation lesson-guidance');
      const steps = el('ol', null, 'teaching-steps');
      for (const step of guidance) steps.append(el('li', step));
      walkthrough.append(el('h2', '用例句走一遍', 'study-label'), steps);
      card.append(walkthrough);
    }
    if (example.extraExample) {
      const { title, lines } = example.extraExample;
      card.append(exampleDetails(title, lines, 'lesson-extra'));
    }
    card.append(audioFeedback());
    actions(button(example.next || '试着拼一句', 'btn primary', () => go('build')));
  }

  function build() {
    const task = lesson.build;
    if (task.options) {
      choice(task, 'build', 'buildPassed', task.next, 'transfer', task.backLabel || '回看对话', 'example');
      return;
    }
    const order = task.order;
    const tiles = new Map(task.tiles.map((tile) => [tile.id, tile]));
    heading(null, '点卡片，拼成一句', task.prompt);
    const builder = el('section', null, 'builder');
    const slots = el('div', null, 'slots');
    slots.setAttribute('role', 'group');
    slots.setAttribute('aria-label', '已经拼出的词');
    const controls = el('div', null, 'tiles');
    controls.setAttribute('role', 'group');
    controls.setAttribute('aria-label', '可以点的词卡');
    const note = feedback('build-feedback');
    const nextNote = feedback('next-feedback');
    const waiting = order.length === 3 ? '三张卡都放好就能往下走。' : '把卡片都放好就能往下走。';
    nextNote.classList.add('next-feedback', 'gate-note');
    const next = button(`下一步：${lesson.stepLabels?.[2] || '认一句'}`, 'btn primary', () => {
      if (state.filled.length < order.length) {
        tell(nextNote, waiting, 'hint');
        return;
      }
      go('transfer');
    });
    next.setAttribute('aria-describedby', nextNote.id);
    const buttons = new Map();

    function update() {
      slots.replaceChildren(...order.map((_, i) => {
        const tile = tiles.get(state.filled[i]);
        const slot = el('span', tile ? tile.text : '…', 'slot');
        if (tile) {
          slot.dataset.filled = '';
          english(slot);
        } else {
          slot.setAttribute('aria-hidden', 'true');
        }
        return slot;
      }));
      const all = state.filled.length === order.length;
      for (const [id, control] of buttons) {
        const used = state.filled.includes(id);
        control.tabIndex = used ? -1 : 0;
        if (used) control.setAttribute('aria-disabled', 'true');
        else control.removeAttribute('aria-disabled');
      }
      next.toggleAttribute('data-waiting', !all);
      nextNote.hidden = all;
      tell(nextNote, all ? '' : waiting, all ? null : 'hint');
    }

    for (const tile of task.tiles) {
      const control = english(button(tile.text, 'tile', () => {
        if (state.filled.includes(tile.id)) return;
        const expected = order[state.filled.length];
        if (tile.id !== expected) {
          tell(note, task.hints?.[state.filled.length] || tile.hint || '想想示范里哪个词放在前面。', 'hint');
          return;
        }
        const focusWasHere = document.activeElement === control;
        state.filled.push(tile.id);
        state.buildPassed = state.filled.length === order.length;
        save();
        update();
        if (state.filled.length === order.length) {
          tell(note, `拼好了！${lesson.example.english}`, 'ok');
          if (focusWasHere) next.focus();
        } else {
          tell(note, `${tile.text} 放好了。`, 'ok');
          if (focusWasHere) Array.from(buttons.values()).find((item) => item.tabIndex === 0)?.focus();
        }
      }));
      buttons.set(tile.id, control);
      controls.append(control);
    }
    update();
    if (state.filled.length === order.length) tell(note, `拼好了！${lesson.example.english}`, 'ok');
    builder.append(el('h2', '已经拼出的句子', 'study-label'), slots, el('h2', '可以点的词卡', 'study-label'), controls, note);
    card.append(builder);
    const reset = button('重拼', 'btn', () => {
      state.filled = [];
      state.buildPassed = false;
      state.transferPassed = false;
      save();
      update();
      tell(note, '可以重新点卡片了。', null);
    });
    const advance = el('div', null, 'next-action');
    advance.append(next, nextNote);
    actions(advance, button('回看例句', 'btn', () => go('example')), reset);
  }

  function checkTransfer() {
    choice(lesson.transfer, 'transfer', 'transferPassed', '完成这一课', 'done', lesson.build.guide ? '回看带读' : '回上一步', 'build');
  }

  function choice(task, id, field, nextLabel, nextScreen, backLabel, backScreen) {
    const attempt = state;
    showChoice(task, {
      id, nextLabel, backLabel,
      passed: () => attempt[field],
      pass: () => { attempt[field] = true; save(); },
      advance: () => go(nextScreen),
      back: () => go(backScreen),
    });
  }

  function showChoice(task, { id, nextLabel, backLabel, passed, pass, advance, back, waitingText, onHint }) {
    heading(null, task.title || '换个名字，还认得吗？', task.prompt);
    const evidenceLines = [];
    const evidenceIndexes = [].concat(task.evidence ?? []);
    let passageTitle;
    let readingJumps;
    let currentBlank;
    if (task.passage) {
      const passage = english(el('section', null, 'speech bridge-dialogue reading-passage'));
      passageTitle = el('h2', task.passage.title);
      passageTitle.tabIndex = -1;
      passage.append(passageTitle);
      task.passage.lines.forEach((line, index) => {
        const paragraph = el('p', line, 'line-en');
        if (task.blank !== undefined && line.includes('____')) {
          const [before, after] = line.split('____');
          const blankNumber = task.passage.tasks.findIndex((item) => item.blank === index);
          const completed = index < task.blank ? task.passage.tasks[blankNumber] : null;
          const value = completed?.options.find((option) => option.id === completed.answer)?.label;
          const slot = el('strong', value ?? `(${blankNumber + 1}) ____`, 'cloze-blank');
          slot.toggleAttribute('data-empty', value === undefined);
          if (index === task.blank) {
            slot.dataset.current = '';
            currentBlank = slot;
          }
          paragraph.replaceChildren(before, slot, after);
        } else wordText(paragraph, line);
        passage.append(paragraph);
        if (evidenceIndexes.includes(index)) {
          const labelText = evidenceIndexes.length > 1 ? `原文依据 ${evidenceLines.length + 1}` : '原文依据';
          const label = el('h3', labelText, 'reading-evidence-label');
          label.lang = 'zh-CN';
          label.hidden = true;
          label.tabIndex = -1;
          paragraph.before(label);
          evidenceLines.push({ paragraph, label });
        }
      });
      card.append(passage);
    } else if (task.wordLine) {
      const lines = english(el('div', null, 'speech bridge-dialogue'));
      const sentence = el('p', null, 'line-en');
      const context = task.wordLine.join('');
      task.wordLine.forEach((part, index) => {
        const span = el('span', null, index === 1 ? 'target-word' : undefined);
        wordText(span, part, context);
        sentence.append(span);
      });
      lines.append(sentence);
      card.append(lines);
    } else if (task.dialogueLines) {
      const lines = el('div', null, 'speech bridge-dialogue');
      lines.lang = task.linesLanguage || 'en';
      for (const line of task.dialogueLines) lines.append(wordLine('p', line, 'line-en'));
      card.append(lines);
    } else if (task.english) {
      const prompt = el('div', null, 'speech');
      prompt.append(wordLine('p', task.english, 'sentence'));
      if (task.englishOptions) {
        prompt.append(soundButton('听对方说', task.english), audioFeedback());
      }
      card.append(prompt);
    }
    if (task.glossary?.length) {
      const glossary = el('details', null, 'question-glossary');
      glossary.append(el('summary', '有词不认识？看看词义'));
      const list = el('ul', null, 'meanings');
      for (const [term, meaning] of task.glossary) {
        const item = el('li');
        item.append(english(el('strong', term)), document.createTextNode(meaning));
        list.append(item);
      }
      glossary.append(list);
      card.append(glossary);
    }
    if (task.guide) {
      const guide = el('section', null, 'guided-panel');
      guide.append(el('h2', '带着你找线索', 'study-label'), el('p', task.guide, 'guided-note'));
      card.append(guide);
    }
    if (task.conditionHelp) {
      const { title, examples, method } = task.conditionHelp;
      card.append(exampleDetails(title, examples, 'reading-help', method));
    }
    const options = el('div', null, 'options');
    options.setAttribute('role', 'group');
    options.setAttribute('aria-label', task.blank !== undefined ? (task.sentenceOptions ? '选择填入空格的整句' : '选择填入空格的词') : task.passage ? '选择阅读答案' : task.wordLine ? '选择画线词的意思' : task.englishOptions ? '选择要说的英语' : '选择句子的意思');
    const note = feedback(`${id}-feedback`);
    const finish = button(nextLabel, 'btn primary', () => {
      if (passed()) advance();
      else if (waitingText) tell(note, waitingText, 'hint');
    });
    const gate = el('p', waitingText || '先选一个答案，答对就能继续。', 'gate-note');
    gate.id = `${id}-gate`;
    finish.setAttribute('aria-describedby', `${gate.id} ${note.id}`);
    const controls = new Map();

    function focusReadingTarget(target) {
      target.focus({ preventScroll: true });
      target.scrollIntoView({ block: 'center' });
    }

    function showResult() {
      gate.hidden = passed();
      finish.disabled = !waitingText && !passed();
      finish.toggleAttribute('data-waiting', Boolean(waitingText) && !passed());
      if (!passed()) return;
      for (const [optionId, control] of controls) {
        control.setAttribute('aria-disabled', 'true');
        control.tabIndex = -1;
        if (optionId === task.answer) control.dataset.result = 'correct';
        else delete control.dataset.result;
      }
      if (currentBlank) {
        currentBlank.textContent = task.options.find((option) => option.id === task.answer).label;
        currentBlank.removeAttribute('data-empty');
      }
      for (const { paragraph, label } of evidenceLines) {
        paragraph.classList.add('reading-evidence');
        label.hidden = false;
      }
      if (evidenceLines.length) {
        // 答对后重建跳转条时保留「回看原文」，不能只留依据按钮。
        readingJumps.replaceChildren(button('回看原文', 'btn reading-jump', () => focusReadingTarget(passageTitle)),
          ...evidenceLines.map(({ label }, index) => {
            const text = evidenceLines.length === 1 ? '回看原文依据' : `回看依据 ${index + 1}`;
            return button(text, 'btn reading-jump', () => focusReadingTarget(label));
          }));
      }
      tell(note, task.success, 'ok');
    }

    for (const option of task.options) {
      const control = button(option.label, 'option', () => {
        if (passed()) return;
        if (option.id !== task.answer) {
          for (const item of controls.values()) delete item.dataset.result;
          control.dataset.result = 'retry';
          onHint?.();
          tell(note, task.hints?.[option.id] || option.hint || '再读一遍空格前后的句子。', 'hint');
          return;
        }
        const focusWasHere = document.activeElement === control;
        pass();
        showResult();
        if (focusWasHere) finish.focus();
      });
      if (task.englishOptions) english(control);
      controls.set(option.id, control);
      options.append(control);
    }
    if (passageTitle) {
      const toAnswers = button('到答题区', 'btn reading-jump', () => focusReadingTarget(passed() ? finish : options.firstElementChild));
      readingJumps = el('div', null, 'reading-jumps');
      readingJumps.append(button('回看原文', 'btn reading-jump', () => focusReadingTarget(passageTitle)));
      card.insertBefore(toAnswers, passageTitle.parentElement);
      card.append(readingJumps);
    }
    card.append(options, note, gate);
    if (backLabel) actions(finish, button(backLabel, 'btn', back));
    else actions(finish);
    showResult();
  }

  function draftNotice() {
    const notice = el('p', '草稿保存在当前标签页。刷新后可从「书写练习」接着写。', 'draft-notice');
    notice.id = 'written-draft-notice';
    return notice;
  }

  function writingGuide(mode, draft) {
    const guide = window.WRITING_GUIDES[mode];
    const section = el('details', null, 'writing-guide');
    section.open = draft.guideOpen ?? (draft.index === 0 && !draft.typed);
    section.addEventListener('toggle', () => { draft.guideOpen = section.open; });
    section.append(el('summary', guide.title));
    const list = el('ol');
    for (const [line, explanation] of guide.lines) {
      const row = el('li');
      row.append(english(el('strong', line)), el('p', explanation));
      list.append(row);
    }
    section.append(list, el('p', guide.bridge));
    card.append(section);
  }

  function showSentenceWriting(set, task, draft) {
    const mode = set.guide || 'sentence';
    heading(null, `第 ${draft.index + 1} 题：补全句子`, '根据中文提示，只写空格里的部分。');
    writingGuide(mode, draft);
    const prompt = el('div', null, 'speech bridge-dialogue');
    const sentence = english(el('p', null, 'line-en'));
    const [before, after] = task.line.split('____');
    const blank = el('strong', draft.matched || '____', 'cloze-blank');
    blank.dataset.current = '';
    sentence.append(before, blank, after);
    prompt.append(sentence, el('p', `中文提示：${task.chinese}`, 'note'));
    card.append(prompt);

    const form = el('form', null, 'written-form');
    const label = el('label', '写下空格里的英语');
    label.htmlFor = 'sentence-answer';
    const input = english(el('input'));
    input.id = label.htmlFor;
    input.type = 'text';
    input.autocomplete = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = false;
    input.maxLength = writingLimits[mode];
    input.value = draft.typed || '';
    input.readOnly = draft.answered;
    const note = feedback('sentence-feedback');
    input.setAttribute('aria-describedby', note.id);
    const compare = el('div', null, 'speech bridge-dialogue');
    compare.hidden = !draft.compare;
    compare.append(english(el('p', task.line.replace('____', task.answer), 'line-en')), el('p', task.takeaway, 'note'));
    const check = el('button', '检查答案', 'btn primary');
    check.type = 'submit';
    check.hidden = draft.answered;
    const reference = button('查看参考写法', 'btn', () => {
      draft.compare = true;
      saveWritingDrafts(mode);
      compare.hidden = false;
      selfCheck.hidden = false;
      tell(note, '参考写法不是唯一答案。你可以修改再检查，也可以对照后继续。', 'hint');
      selfCheck.focus();
    });
    reference.hidden = draft.answered || Boolean(draft.compare);
    const advance = () => {
      draft.index += 1;
      draft.answered = false;
      draft.typed = '';
      draft.matched = '';
      draft.compare = false;
      saveWritingDrafts(mode);
      render(true);
    };
    const final = draft.index === set.tasks.length - 1;
    const selfCheck = button(final ? '自查后看小结' : '自查后继续', 'btn', advance);
    selfCheck.hidden = !draft.compare || draft.answered;
    const next = button(final ? set.finish : '下一题', 'btn primary', advance);
    next.hidden = !draft.answered;
    if (draft.answered) tell(note, `这是一种参考范围内的写法。${task.takeaway}`, 'ok');
    else if (draft.compare) tell(note, '参考写法不是唯一答案。可以修改再检查，也可以对照后继续。', 'hint');
    input.addEventListener('input', () => {
      draft.typed = input.value;
      saveWritingDrafts(mode);
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.isComposing || event.keyCode === 229)) event.preventDefault();
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (draft.answered) return;
      draft.typed = input.value;
      if (!normalizeWriting(draft.typed)) return tell(note, '先写出空缺的部分，再检查。', 'hint');
      const matched = matchSentence(task, draft.typed);
      if (!matched) return tell(note, `没有匹配到已收录的写法，不一定错。${task.hint} 也可以查看参考写法。`, 'hint');
      draft.answered = true;
      draft.matched = matched;
      saveWritingDrafts(mode);
      blank.textContent = matched;
      input.readOnly = true;
      check.hidden = reference.hidden = selfCheck.hidden = true;
      next.hidden = false;
      tell(note, `这是一种参考范围内的写法。${task.takeaway}`, 'ok');
      next.focus();
    });
    form.append(draftNotice(), label, input, note, compare, check, reference, selfCheck, next);
    input.setAttribute('aria-describedby', `written-draft-notice ${note.id}`);
    card.append(form);
  }

  function showGrammar(set, task, draft) {
    heading(null, `第 ${draft.index + 1} 空：写一个词`, task.prompt);
    writingGuide('grammar', draft);
    const passage = english(el('section', null, 'speech bridge-dialogue reading-passage'));
    passage.append(el('h2', set.passage.title));
    let current;
    for (const [index, line] of set.passage.lines.entries()) {
      const [before, after] = line.split('____');
      const completed = index < draft.index || (index === draft.index && draft.answered);
      const slot = el('strong', completed ? set.tasks[index].answer : `(${index + 1}) ____`, 'cloze-blank');
      slot.toggleAttribute('data-empty', !completed);
      if (index === draft.index) { slot.dataset.current = ''; current = slot; }
      const row = el('p', null, 'line-en');
      row.append(before, slot, completed ? after.replace(/^ \([^)]*\)/, '') : after);
      passage.append(row);
    }
    card.append(passage);

    const form = el('form', null, 'written-form');
    const label = el('label', '写下你的答案（一个英语单词）');
    label.htmlFor = 'grammar-answer';
    const entryHint = el('p', '先写一个词，再检查。', 'gate-note');
    entryHint.id = 'grammar-entry-hint';
    entryHint.hidden = draft.answered;
    const input = english(el('input'));
    input.id = label.htmlFor;
    input.type = 'text';
    input.autocomplete = 'off';
    input.autocapitalize = 'none';
    input.spellcheck = false;
    input.maxLength = writingLimits.grammar;
    input.value = draft.typed || '';
    input.readOnly = draft.answered;
    const note = feedback('grammar-feedback');
    input.setAttribute('aria-describedby', note.id);
    const check = el('button', '检查答案', 'btn primary');
    check.type = 'submit';
    check.hidden = draft.answered;
    const next = button(draft.index === set.tasks.length - 1 ? set.finish : '下一题', 'btn primary', () => {
      if (!draft.answered) return;
      draft.index += 1;
      draft.answered = false;
      draft.typed = '';
      saveWritingDrafts('grammar');
      render(true);
    });
    next.hidden = !draft.answered;
    if (draft.answered) tell(note, task.takeaway, 'ok');
    input.addEventListener('input', () => {
      draft.typed = input.value;
      saveWritingDrafts('grammar');
    });
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && (event.isComposing || event.keyCode === 229)) event.preventDefault();
    });
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (draft.answered) return;
      draft.typed = input.value;
      const answer = normalizeWriting(draft.typed);
      if (!answer) return tell(note, '先写一个词，再检查。', 'hint');
      if (!/^[a-z]+$/.test(answer)) return tell(note, '这个空只填一个英语单词，不加标点。', 'hint');
      if (answer !== task.answer) return tell(note, task.hint, 'hint');
      draft.answered = true;
      saveWritingDrafts('grammar');
      entryHint.hidden = true;
      current.textContent = task.answer;
      current.removeAttribute('data-empty');
      current.nextSibling.textContent = current.nextSibling.textContent.replace(/^ \([^)]*\)/, '');
      input.readOnly = true;
      check.hidden = true;
      next.hidden = false;
      tell(note, task.takeaway, 'ok');
      next.focus();
    });
    form.append(draftNotice(), label, input, note, entryHint, check, next);
    input.setAttribute('aria-describedby', `written-draft-notice ${entryHint.id} ${note.id}`);
    card.append(form);
  }

  function showEmail(task, draft) {
    if (draft.index === 1) {
      heading(null, '短邮件自查完成', '这不代表考试得分。你可以回来再修改刚写的正文。');
      const body = english(el('p', draft.typed, 'speech email-draft'));
      card.append(body);
      actions(button('改刚才的邮件', 'btn primary', () => {
        draft.index = 0;
        saveWritingDrafts('email');
        render(true);
      }),
        button('回课程首页', 'btn', backToCourse));
      return;
    }
    heading(null, '写一封短邮件', task.prompt);
    writingGuide('email', draft);
    const form = el('form', null, 'written-form');
    const label = el('label', '邮件正文（只填中间这部分）');
    const input = english(el('textarea'));
    input.id = label.htmlFor = 'email-body';
    input.rows = 5;
    input.maxLength = writingLimits.email;
    input.spellcheck = false;
    input.value = draft.typed || '';
    const count = el('p', '', 'note');
    count.id = 'email-count';
    const status = feedback('email-feedback');
    const recheck = feedback('email-recheck');
    const showRecheck = () => {
      recheck.hidden = !draft.recheck;
      tell(recheck, draft.recheck ? '改了正文，请重新自查。' : '', draft.recheck ? 'hint' : null);
    };
    input.setAttribute('aria-describedby', `written-draft-notice ${count.id} ${status.id}`);
    const updateCount = () => {
      // Keep common contractions and hyphenated compounds together for this estimate.
      const words = input.value.normalize('NFKC').match(/[a-z]+(?:['’\-][a-z]+)*/gi) || [];
      count.textContent = `正文约 ${words.length} 个英语词。大概 40 个词就够，不是分数。`;
    };
    input.addEventListener('input', () => {
      if (draft.typed === input.value) return;
      draft.typed = input.value;
      if (draft.checks.some(Boolean)) draft.recheck = true;
      draft.checks = [];
      saveWritingDrafts('email');
      checklist.querySelectorAll('input').forEach((box) => { box.checked = false; });
      showRecheck();
      tell(status, '', null);
      updateCount();
    });
    updateCount();
    const checklist = el('fieldset', null, 'email-checklist');
    checklist.append(el('legend', '自己检查三件事'));
    draft.checks ||= [];
    task.checks.forEach((text, index) => {
      const row = el('label');
      const box = el('input');
      box.type = 'checkbox';
      box.checked = Boolean(draft.checks[index]);
      box.addEventListener('change', () => {
        draft.checks[index] = box.checked;
        if (task.checks.every((_, i) => draft.checks[i])) { draft.recheck = false; showRecheck(); }
        saveWritingDrafts('email');
      });
      row.append(box, el('span', text));
      checklist.append(row);
    });
    const reference = el('details', null, 'alphabet');
    reference.open = Boolean(draft.referenceOpen);
    reference.addEventListener('toggle', () => { draft.referenceOpen = reference.open; });
    reference.append(el('summary', '看看参考范文（不是唯一写法）'), english(el('p', task.example, 'speech')));
    const finish = el('button', '完成自查', 'btn primary');
    finish.type = 'submit';
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      draft.typed = input.value;
      if (!/[a-z]/i.test(normalizeWriting(draft.typed))) {
        tell(status, '先写一点英文正文，再做自查。', 'hint');
        input.focus();
        return;
      }
      if (!task.checks.every((_, i) => draft.checks[i])) {
        tell(status, '还有没检查的地方。可以先改正文，再勾完三项。', 'hint');
        return;
      }
      draft.index = 1;
      saveWritingDrafts('email');
      render(true);
    });
    form.append(draftNotice(), label, english(el('p', 'Dear Alex,', 'mail-frame')), input,
      count, english(el('p', 'Best wishes,\nLin', 'mail-frame')), recheck, checklist, reference, status, finish);
    showRecheck();
    card.append(form);
  }

  function showReadingStart(set, draft) {
    const example = window.READING_START.example;
    const task = set.tasks[draft.index];
    if (!task) {
      heading(set.title, set.done, set.subtitle);
      const recap = el('ul', null, 'review-summary');
      for (const item of set.tasks) {
        const row = el('li');
        row.append(wordText(english(el('strong', null)), item.passage.lines[item.evidence]), el('span', item.takeaway));
        recap.append(row);
      }
      card.append(recap);
      actions(button(practiceLabel('reading'), 'btn primary', () => openPractice('reading')),
        button('回课程首页', 'btn', backToCourse));
      return;
    }
    if (!draft.readingExampleSeen) {
      heading(set.title, '先看一题是怎么读的', '不用先翻译完一整篇。先弄清问题，再去通知里找能证明答案的那句。');
      card.append(english(el('p', example.question, 'guided-note')));
      const passage = el('section', null, 'speech bridge-dialogue reading-passage reading-demo');
      passage.append(english(el('h2', example.title)));
      for (const [index, [line, translation]] of example.lines.entries()) {
        const evidence = index === example.evidence;
        if (evidence) passage.append(el('p', '回答这道题的句子：', 'reading-evidence-label'));
        passage.append(wordLine('p', line, evidence ? 'line-en reading-evidence' : 'line-en'),
          el('p', translation, 'line-zh'));
      }
      card.append(passage);
      const steps = el('ol', null, 'teaching-steps');
      for (const step of example.steps) steps.append(el('li', step));
      card.append(steps);
      actions(button('跟着找一次', 'btn primary', () => {
        draft.readingExampleSeen = true;
        saveReadingDrafts('readingStart');
        render(true);
      }), button(practiceLabel('reading'), 'btn', () => openPractice('reading')));
      return;
    }
    const guided = draft.index === 0;
    showChoice(task, {
      id: 'reading-start', nextLabel: guided ? '下一步：换张通知自己找' : '看导学小结',
      backLabel: guided ? '回看示范' : undefined,
      passed: () => draft.answered,
      pass: () => {
        draft.answered = true;
        saveReadingDrafts('readingStart');
      },
      advance: () => {
        draft.index++;
        draft.answered = false;
        saveReadingDrafts('readingStart');
        render(true);
      },
      back: () => {
        draft.readingExampleSeen = false;
        saveReadingDrafts('readingStart');
        render(true);
      },
    });
  }

  function showPractice(mode) {
    const set = practiceSets[mode];
    const draft = practiceDrafts[mode];
    if (mode === 'email') return showEmail(set.tasks[0], draft);
    if (mode === 'readingStart') return showReadingStart(set, draft);
    const tasks = practiceTasks(mode);
    const task = tasks[draft.index];
    if (!task) {
      if (mode === 'learnedReview' && !tasks.length) {
        heading(set.title, '这组新题已经看完了', '不会自动重出见过的题。可以继续学课，等解锁新题；也可以主动复习旧题。');
        actions(button('回课程首页', 'btn primary', backToCourse), button('自愿复习旧题', 'btn', () => openPractice(mode, true, draft.focus, true)));
        if (draft.focus) actions(button('看看其他已学课程的新题', 'btn', () => openPractice(mode, true)));
        return;
      }
      heading(set.title, set.done, set.subtitle);
      const list = el('ul', null, 'review-summary');
      for (const item of tasks) {
        const row = el('li');
        const selected = set.written ? item.answer : item.options.find((option) => option.id === item.answer).label;
        const line = set.passage?.lines[set.written ? item.blank : item.evidence];
        if (Array.isArray(item.evidence)) {
          row.append(english(el('strong', selected)), el('span', item.takeaway));
          const sources = english(el('ul', null, 'reading-summary-sources'));
          for (const index of item.evidence) sources.append(el('li', set.passage.lines[index]));
          row.append(sources);
          list.append(row);
          continue;
        }
        const completed = item.line ? item.line.replace('____', selected)
          : set.written ? line.replace(/____(?: \([^)]*\))?/, selected) : line?.replace('____', selected);
        const answer = el('strong', completed ?? selected);
        const chineseAnswer = item.wordLine || mode === 'noticeReview' || (mode === 'learnedReview' && !item.englishOptions);
        row.append(chineseAnswer ? answer : english(answer), el('span', item.takeaway));
        list.append(row);
      }
      card.append(list);
      actions(button('回课程首页', 'btn primary', backToCourse),
        button(set.repeat, 'btn', () => openPractice(mode, true, draft.focus, draft.repeatSeen)));
      if (mode === 'reading') {
        const conditions = lessons.find((item) => item.id === 'reading-exceptions');
        if (conditions) actions(button('去第 36 课练「不必」和「不要」', 'btn', () => openLesson(conditions)));
      }
      if (mode === 'learnedReview' && draft.repeatSeen) actions(button('只看没见过的新题', 'btn', () => openPractice(mode, true, draft.focus)));
      const nextMode = { grammar: 'sentence', sentence: 'email' }[mode];
      if (nextMode) {
        const nextSet = practiceSets[nextMode];
        const nextLabel = nextMode === 'email' && practiceDrafts.email?.index === 1
          ? '查看短邮件草稿' : `下一项选做：${nextSet.label}`;
        actions(button(nextLabel, 'btn', () => openPractice(nextMode)));
      }
      return;
    }
    if (mode === 'learnedReview') markReviewSeen(task);
    if (task.accepted) return showSentenceWriting(set, task, draft);
    if (set.written) return showGrammar(set, task, draft);
    const final = draft.index === tasks.length - 1;
    const used = set.sharedOptions ? new Set(set.tasks.slice(0, draft.index).map((item) => item.answer)) : null;
    const conditionHelp = mode === 'reading' && final ? window.READING_CONDITION_HELP : undefined;
    showChoice({ ...task, options: used ? task.options.filter((option) => !used.has(option.id)) : task.options,
      passage: set.passage, conditionHelp, sentenceOptions: set.sharedOptions, englishOptions: mode === 'learnedReview' ? Boolean(task.englishOptions) : mode !== 'noticeReview' && !task.wordLine }, {
      id: mode, nextLabel: final ? set.finish : '下一题',
      passed: () => draft.answered,
      onHint: mode === 'learnedReview' ? () => { draft.hinted = true; } : undefined,
      pass: () => {
        if (mode === 'learnedReview') recordReviewAnswer(task, draft.hinted);
        draft.answered = true;
        saveReadingDrafts(mode);
      },
      advance: () => {
        draft.index += 1;
        draft.answered = false;
        draft.hinted = false;
        saveReadingDrafts(mode);
        render(true);
      },
      waitingText: mode === 'learnedReview' || mode === 'noticeReview' || task.wordLine || set.passage ? '先选一个答案，答对就能继续。' : '先点一句英语，答对就能继续。',
    });
  }

  function done() {
    const result = lesson.done;
    const next = lesson.practiceUnit ? null : mainLessons[mainLessons.indexOf(lesson) + 1];
    heading(`${lesson.number}完成`, result.title, result.subtitle);
    const practice = el('section', null, 'speech lesson-example');
    const phrase = wordLine('p', result.english, 'sentence');
    if (result.english.length > 64 || result.english.includes('\n')) phrase.classList.add('sentence-long');
    practice.append(el('h2', '这课记住一句', 'study-label'), phrase, el('p', result.practice, 'translation'),
      soundButton('再听示范', result.audio || lesson.example.english), audioFeedback());
    card.append(practice);
    if (examFollowUp) {
      const followUp = examFollowUp;
      actions(button(followUp.label, 'btn primary', followUp.run), button('回备考页', 'btn', openExamPrep));
      return;
    }
    const replay = button('再练一次', 'btn', () => openLesson(lesson, true));
    if (lesson.id === 'notice-whole') actions(button(practiceLabel('readingStart'), 'btn', () => openPractice('readingStart')),
      el('p', '选做：看一道阅读题怎么回通知里找依据。', 'note'));
    if (lesson.id === 'embedded-question') actions(button('去看选做书写练习', 'btn', () => {
      lesson = null;
      state = null;
      directory = 'writing';
      render(true);
    }));
    const practiceLink = {
      'request-reply': ['bridge', '去练补全对话'], 'conversation-purpose': ['bridge', '去练补全对话'],
      'context-actions': ['context', '去练句中词义'], 'context-cloze': ['cloze', '去练微型完形'],
      'reading-main-idea': ['readingStory', '去练校园故事'], 'reading-inference': ['reading', '去练短阅读'],
      'link-a-sentence': ['insert', '去练短文选句'], 'enough-to': ['grammar', '去练语法填空'],
      'advice-pride': ['sentence', '去练完成句子'], 'phrases-in-context': ['context', '去练句中词义'],
      'email-plan': ['email', '去写短邮件'], 'email-revise': ['email', '去写短邮件'],
      'notice-change': ['reading', '去练短阅读'], 'cloze-read-back': ['cloze', '去练微型完形'],
      'service-booking': ['bridge', '去练补全对话'], 'reading-purpose': ['readingGuide', '去练午餐指南'],
      'insert-both-sides': ['insert', '去练短文选句'], 'gap-spend-ing': ['grammar', '去练语法填空'],
      'sentence-proud-boundary': ['sentenceBridge', '去练补句进阶（选做）'],
    }[lesson.id];
    if (practiceLink) actions(button(practiceLink[1], 'btn', () => openPractice(practiceLink[0])));
    const lessonId = lesson.id;
    const currentReview = practiceDrafts.learnedReview;
    if ((!currentReview || currentReview.index >= currentReview.tasks.length)
      && eligibleReviewTasks('learnedReview').some((task) => task.requires.includes(lessonId))) {
      actions(button('练刚学的内容', 'btn', () => openPractice('learnedReview', true, lessonId)));
    }
    if (lesson.practiceUnit) actions(button('回课程目录', 'btn primary', () => {
      lesson = null;
      state = null;
      directory = 'lessons';
      render(true);
      const row = card.querySelector(`[data-lesson="${lessonId}"]`);
      row.closest('details').open = true;
      row.focus();
    }), replay);
    else if (next) actions(button(`下一课：${next.title}`, 'btn primary', () => openLesson(next)), replay,
      ...(lesson.id === 'first-conversation' && conversationDone() ? [button(practiceLabel('review'), 'btn', () => openPractice('review'))] : []),
      ...(lesson.id === 'notice-whole' && eligibleNoticeTasks().length ? [button(practiceLabel('noticeReview'), 'btn', () => openPractice('noticeReview'))] : []));
    else if (eligibleNoticeTasks().length) actions(button(practiceLabel('noticeReview'), 'btn primary', () => openPractice('noticeReview')),
      button('回课程首页', 'btn', backToCourse), replay);
    else if (conversationDone()) actions(button(practiceLabel('review'), 'btn primary', () => openPractice('review')),
      button('回课程首页', 'btn', backToCourse), replay);
    else actions(button('回课程首页', 'btn primary', backToCourse), replay);
  }

  function lessonTrack(index, names) {
    const list = el('ol', null, 'lesson-track');
    list.setAttribute('aria-label', '本课步骤（仅显示进度）');
    names.forEach((name, step) => {
      const item = el('li');
      const marker = el('span', String(step + 1), 'step-marker');
      marker.setAttribute('aria-hidden', 'true');
      if (step === index) item.setAttribute('aria-current', 'step');
      if (step < index) item.dataset.past = '';
      item.append(marker, el('span', name));
      list.append(item);
    });
    return list;
  }

  function render(moveFocus) {
    stopAudio();
    returnHome.hidden = !lesson && !practiceMode && !directory;
    returnHome.parentElement.classList.toggle('is-learning', !returnHome.hidden);
    returnHome.closest('.site').classList.toggle('is-home', returnHome.hidden);
    const inLesson = Boolean(lesson && !practiceMode && !directory);
    card.classList.toggle('lesson-page', inLesson);
    progress.classList.toggle('lesson-progress-text', inLesson);
    if (inLesson) progress.setAttribute('aria-hidden', 'true');
    else progress.removeAttribute('aria-hidden');
    card.replaceChildren();
    if (practiceMode) {
      const set = practiceSets[practiceMode];
      const { index } = practiceDrafts[practiceMode];
      const total = practiceTasks(practiceMode).length;
      progress.hidden = index >= total;
      progress.textContent = progress.hidden ? '' : practiceMode === 'readingStart' && !practiceDrafts.readingStart.readingExampleSeen
        ? `${set.label} · 先看示范` : `${set.label} · 第 ${index + 1} 题，共 ${total} 题`;
      card.setAttribute('aria-label', set.title);
      showPractice(practiceMode);
    } else if (directory) {
      progress.hidden = true;
      showDirectory();
    } else if (!lesson) {
      progress.hidden = true;
      card.setAttribute('aria-label', '课程首页');
      home();
    } else {
      const index = screens.indexOf(state.screen);
      const names = lesson.stepLabels || defaultStepLabels;
      progress.hidden = index >= names.length;
      progress.textContent = progress.hidden ? '' : `第 ${index + 1} 步，共 ${names.length} 步 · ${names[index]}`;
      card.setAttribute('aria-label', `${lesson.number}：${lesson.title}`);
      const chapter = el('div', null, 'lesson-heading');
      chapter.append(el('span', lesson.number, 'lesson-number'), el('p', lesson.title, 'lesson-context'));
      card.append(chapter, lessonTrack(index, names));
      ({ example: showExample, build, transfer: checkTransfer, done })[state.screen]();
    }
    if (card.querySelector('.word-sound') && !card.querySelector('#word-audio-feedback')) {
      const note = audioFeedback('word-audio-feedback');
      const row = card.querySelector('.actions');
      if (row) row.before(note);
      else card.append(note);
    }
    if (moveFocus) {
      card.querySelector('h1').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }

  returnHome.addEventListener('click', backToCourse);
  window.addEventListener('pagehide', stopAudio);
  save();
  render(false);
})();
