(() => {
  'use strict';
  // The browser and the offline audio generator use the same word boundaries.
  const pattern = /[ap]\.m\.|\d{1,2}:[0-5]\d|\d+(?:st|nd|rd|th)?|[a-z]+(?:['’\u2010\u2011-][a-z]+)*/gi;
  const digitNames = ['oh', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const voices = { use: 'yooz', close: 'cloze', read: 'reed', 'read:past': 'red', 'used:to': 'yoost', ok: 'okay' };
  // These fixed course lines use the past-tense pronunciation of read.
  const pastReadContexts = new Set([
    'read a book',
    'Later, he read a book at home.',
    'Yesterday, Lin went to Room 105. Later, she read a book there.',
    'Yesterday, Lin went to Room 105. Later, she read a book there. She didn’t play basketball.',
    'We read in the library ____ it was quiet.',
  ]);

  function scan(text, context = text) {
    return Array.from(text.matchAll(pattern), (match) => {
      const [word] = match;
      const start = match.index;
      let key = word.toLowerCase().replace(/’/g, "'").replace(/[\u2010\u2011]/g, '-');
      if (key === 'read' && pastReadContexts.has(context)) key = 'read:past';
      else if (key === 'used' && /^\s+to\b/i.test(text.slice(start + word.length))) key = 'used:to';
      else if (/^\d{3}$/.test(key) && /\broom\s+$/i.test(text.slice(0, start))) key += ':room';
      return { word, start, key };
    });
  }

  function spoken(key) {
    if (/^\d{3}:room$/.test(key)) return Array.from(key.slice(0, 3), n => digitNames[n]).join(' ');
    return Object.hasOwn(voices, key) ? voices[key] : key === 'i' ? 'I' : key;
  }

  window.WORD_TOKENS = Object.freeze({ scan, spoken });
})();
