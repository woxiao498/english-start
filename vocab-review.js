(() => {
  'use strict';

  const key = 'english-start:vocab:1';
  const day = 86_400_000;
  const timestamp = (value) => Number.isSafeInteger(value) && value > 0 ? value : 0;

  function create({ words, storage, isComplete, storageUnavailable, now = Date.now }) {
    const introduced = Object.create(null);
    const history = Object.create(null);
    try {
      const saved = JSON.parse(storage().getItem(key));
      for (const word of words) {
        const taught = timestamp(saved?.introduced?.[word.lesson]);
        if (taught) introduced[word.lesson] = taught;
        const record = saved?.history?.[word.id];
        if (!record || !Array.isArray(record.seen)) continue;
        const latest = ['first', 'hinted', 'delayed'].includes(record.latest) ? record.latest : null;
        const hasCount = Number.isSafeInteger(record.independent) && record.independent >= 0;
        const exposedAt = timestamp(record.exposedAt);
        // Old delayed may have been the first independent answer. Keep its evidence, not the stronger label.
        const oldDelayed = !hasCount && latest === 'delayed';
        history[word.id] = {
          seen: [...new Set(record.seen.filter((index) => Number.isInteger(index) && index >= 0 && index < word.variants.length))],
          exposedAt, dueAt: oldDelayed && exposedAt ? Math.min(timestamp(record.dueAt) || Infinity, exposedAt + 3 * day) : timestamp(record.dueAt),
          latest: oldDelayed ? 'first' : latest,
          independent: hasCount ? Math.min(record.independent, word.variants.length) : Number(latest === 'first' || oldDelayed),
        };
      }
    } catch { /* Review remains usable with unavailable or broken storage. */ }

    function save() {
      try { storage().setItem(key, JSON.stringify({ introduced, history })); }
      catch { storageUnavailable(); }
    }

    function taught(lesson) {
      if (introduced[lesson] || !words.some((word) => word.lesson === lesson)) return;
      introduced[lesson] = now();
      save();
    }

    function eligible() {
      return words.filter((word) => isComplete(word.lesson));
    }

    function dueAt(word) {
      return history[word.id]?.dueAt || (introduced[word.lesson] ? introduced[word.lesson] + day : 0);
    }

    function hasNew(word) {
      return (history[word.id]?.seen.length ?? 0) < word.variants.length;
    }

    function nextVariant(word, record) {
      const order = word.reviewOrder ?? word.variants.map((_, index) => index);
      return order.find((index) => !record?.seen.includes(index));
    }

    function status() {
      const pool = eligible();
      const current = now();
      const due = pool.filter((word) => hasNew(word) && dueAt(word) <= current);
      const waiting = pool.filter((word) => hasNew(word) && dueAt(word) > current);
      return { learned: pool.length, due: due.length, waiting: waiting.length,
        exhausted: pool.length - due.length - waiting.length,
        hinted: pool.filter((word) => history[word.id]?.latest === 'hinted').length,
        delayed: pool.filter((word) => history[word.id]?.latest === 'delayed').length,
        first: pool.filter((word) => history[word.id]?.latest === 'first').length };
    }

    function round() {
      const current = now();
      return eligible().filter((word) => hasNew(word) && dueAt(word) <= current)
        .sort((a, b) => Number(history[b.id]?.latest === 'hinted') - Number(history[a.id]?.latest === 'hinted') || dueAt(a) - dueAt(b))
        .slice(0, 5).map((word) => {
          const record = history[word.id];
          return { word, variantIndex: nextVariant(word, record), previousExposure: record?.exposedAt || 0 };
        });
    }

    function seen(task) {
      const { word, variantIndex } = task;
      const record = history[word.id] ??= { seen: [], latest: null, independent: 0 };
      if (record.seen.includes(variantIndex)) return;
      record.seen.push(variantIndex);
      record.exposedAt = now();
      record.dueAt = record.exposedAt + day;
      save();
    }

    function answer(task, hinted) {
      const record = history[task.word.id];
      const current = now();
      const delayed = record.independent > 0 && task.previousExposure > 0 && record.exposedAt - task.previousExposure >= day;
      record.latest = hinted ? 'hinted' : delayed ? 'delayed' : 'first';
      if (!hinted) record.independent = Math.min(task.word.variants.length, record.independent + 1);
      record.exposedAt = current;
      record.dueAt = current + day * (hinted ? 1 : delayed ? 7 : 3);
      save();
      return record.latest;
    }

    return { taught, status, round, seen, answer };
  }

  window.VOCAB_REVIEW = Object.freeze({ create });
})();
