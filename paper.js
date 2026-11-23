/* Standalone paper flow; lesson and practice state are not imported. */
window.PAPER_MODE = (() => {
  'use strict';
  const key = 'english-start:papers:1';
  const text = (value) => String(value ?? '');
  const clean = (value) => text(value).normalize('NFKC').toLowerCase().trim().replace(/[‘’]/g, "'").replace(/\s+/g, ' ');
  const questions = (paper) => paper.sections.flatMap((section) => section.questions);
  const maxPoints = (paper) => questions(paper).reduce((acc, question) => acc + question.points, 0);
  const validScore = (score, max) => typeof score === 'number' && Number.isFinite(score) && score >= 0 && score <= max;
  const format = (value) => Number(value.toFixed(2));
  function scoreQuestion(question, result) {
    const answer = text(result.answers?.[question.id]).trim();
    if (!answer) return { score: 0, kind: 'blank' };
    if (question.options) return { score: answer === question.answer ? question.points : 0, kind: 'auto' };
    if (!question.manual && question.accepted?.some((item) => clean(item) === clean(answer))) return { score: question.points, kind: 'auto' };
    if (!question.manual && !question.reviewUnmatched && question.accepted?.length) return { score: 0, kind: 'auto' };
    const checked = result.review?.[question.id];
    return validScore(checked, question.points) ? { score: checked, kind: 'review' } : { score: 0, kind: 'pending' };
  }
  function summarize(paper, result) {
    const sections = paper.sections.map((section) => section.questions.reduce((summary, question) => {
      const item = scoreQuestion(question, result);
      summary.score += item.score;
      summary.max += question.points;
      if (item.kind === 'pending') summary.pending += question.points;
      return summary;
    }, { title: section.title, score: 0, max: 0, pending: 0 }));
    return sections.reduce((all, section) => ({ sections, score: all.score + section.score,
      max: all.max + section.max, pending: all.pending + section.pending }), { score: 0, max: 0, pending: 0 });
  }
  const totalLabel = (summary) => summary.pending
    ? `已计 ${format(summary.score)} / ${summary.max} 分 · 另有 ${summary.pending} 分待核对`
    : `本卷参考得分 ${format(summary.score)} / ${summary.max} 分`;

  function buildMixed(passageGroups) {
    let number = 0;
    const sets = [
      ['dialogue', 'Ⅰ 补全对话', [{ tasks: window.EXAM_BRIDGE }], 2],
      ['words', 'Ⅱ 词汇', [{ tasks: window.CONTEXT_WORDS }], 2],
      ['cloze', 'Ⅲ 完形填空', [window.CLOZE_INTRO], 2],
      ['reading', 'Ⅳ 阅读理解', passageGroups, 3],
      ['insert', 'Ⅳ 阅读 · 短文选句', [window.SENTENCE_INSERT], 3],
      ['grammar', 'Ⅴ 语法填空', [window.GRAMMAR_INTRO], 2],
      ['sentence', 'Ⅵ 完成句子', [{ tasks: window.SENTENCE_WRITING }], 3],
      ['email', 'Ⅶ 应用写作', [{ tasks: [window.EMAIL_WRITING] }], 10],
    ];
    return {
      id: 'mixed', title: '原创综合练习卷', note: '将本站备考练习整合成一次作答。部分题你可能见过，分数仅反映这份卷，不换算为高考分数。',
      sections: sets.flatMap(([id, name, groups, points]) => groups.map((group, index) => {
        const start = number + 1;
        const blanks = ['cloze', 'insert', 'grammar'].includes(id);
        const passage = group.lines?.map((line, i) => {
          const offset = group.tasks.findIndex((task) => task.blank === i);
          return blanks && offset >= 0 ? line.replace('____', `[${start + offset}] ____`) : line;
        }).join('\n\n');
        return { id: groups.length > 1 ? `${id}-${index + 1}` : id, title: group.title ? `${name} · ${group.title}` : name, passage,
          questions: group.tasks.map((task) => {
            const n = String(++number);
            let prompt = task.prompt;
            if (id === 'dialogue') prompt = task.dialogueLines.join('\n');
            if (id === 'words') prompt = `选出方括号中单词在此处的意思。\n${task.wordLine.map((part, i) => i === 1 ? `[${part}]` : part).join('')}`;
            if (blanks) prompt = `填第 ${n} 空。`;
            if (id === 'sentence') prompt = `${task.line}\n中文提示：${task.chinese}`;
            return { id: n, points, prompt, options: task.options?.map(({ id, label }) => ({ id, label })),
              answer: task.options ? task.answer : undefined,
              accepted: id === 'grammar' ? [task.answer] : task.accepted,
              reviewUnmatched: id === 'sentence', openEnded: id === 'email',
              reference: id === 'sentence' ? task.line.replace('____', task.answer) : id === 'email' ? task.example : id === 'grammar' ? task.answer : undefined,
              rubric: id === 'email' ? task.checks : undefined };
          }),
        };
      })),
    };
  }

  function create({ el, button, heading, card, render, storageUnavailable, suggestLesson, enterPaper }) {
    const entries = Object.create(null);
    try { Object.assign(entries, JSON.parse(localStorage.getItem(key)) || {}); } catch { /* Optional storage. */ }
    const a = buildMixed([window.READING_INTRO, window.READING_STORY, window.READING_GUIDE]);
    const forms = [a, window.EXAM_B].filter(Boolean);
    const papers = [...forms, window.EXAM_2026].filter(Boolean);
    const formLabel = (paper) => paper === a ? 'A 卷' : 'B 卷';
    const paperTitle = (paper) => paper === a ? `${a.title} · A 卷` : paper.title;
    let selected = null;
    let view = 'list';
    let sectionIndex = 0;
    let resultIndex = 0;
    const historyLimit = 5;
    const usableResult = (item) => item && typeof item === 'object' && item.answers && typeof item.answers === 'object' && !Array.isArray(item.answers);
    const attempts = (record) => [record.last, ...(Array.isArray(record.past) ? record.past : [])].filter(usableResult).slice(0, historyLimit);
    const attemptLabel = (item, index) => `${index === 0 ? '最近一次' : `往前第 ${index} 次`}${Number.isFinite(item.at) ? ` · ${new Date(item.at).toLocaleString('zh-CN', { hour12: false })}` : ' · 未记录时间'}`;
    const get = (paper) => {
      if (!entries[paper.id] || typeof entries[paper.id] !== 'object' || Array.isArray(entries[paper.id])) entries[paper.id] = {};
      return entries[paper.id];
    };
    const save = () => { try { localStorage.setItem(key, JSON.stringify(entries)); } catch { storageUnavailable(); } };
    const nextForm = () => {
      const drafts = forms.find((paper) => get(paper).draft);
      if (drafts) return drafts;
      const played = forms.filter((paper) => attempts(get(paper)).length);
      const fresh = forms.find((paper) => !played.includes(paper));
      if (fresh) return fresh;
      const recent = played.reduce((newest, paper) => {
        const at = attempts(get(paper))[0]?.at || 0;
        return !newest || at >= (attempts(get(newest))[0]?.at || 0) ? paper : newest;
      }, null);
      return forms[(forms.indexOf(recent) + 1) % forms.length];
    };
    const change = (next) => { view = next; render(true); };
    const promptNode = (q) => {
      const node = el('p', null, 'paper-text');
      q.prompt.split(/(\*\*[^*]+\*\*)/).forEach((part) => node.append(part.startsWith('**') && part.endsWith('**') ? el('u', part.slice(2, -2)) : part));
      return node;
    };
    const start = (paper) => {
      selected = paper;
      const record = get(paper);
      record.draft ||= { answers: {}, section: 0 };
      sectionIndex = Number.isInteger(record.draft.section) ? Math.min(paper.sections.length - 1, Math.max(0, record.draft.section)) : 0;
      save();
      change('work');
    };
    function openResults(paper) {
      selected = paper;
      resultIndex = 0;
      enterPaper?.();
      change('result');
    }
    function list() {
      heading('整卷作答 · 统一交卷', '试卷', '单独做题只是练习，不计入试卷成绩。这里可以按整卷作答，交卷后再看参考答案。');
      const mixed = el('section', null, 'paper-panel');
      const next = nextForm();
      const anySubmitted = forms.some((paper) => attempts(get(paper)).length);
      mixed.append(el('h2', '原创综合练习卷'), el('p', `${questions(a).length} 题 · 卷面 ${maxPoints(a)} 分 · 不计时`, 'note'),
        el('p', 'A、B 两套题型和分值相同，题目不同。先做没做过的一套，两套都做过后轮换。做了一半会回到原卷。', 'note'));
      mixed.append(button(get(next).draft ? `继续答卷（${formLabel(next)}）` : anySubmitted ? `换一套题（${formLabel(next)}）` : '开始答卷（A 卷）', 'btn primary', () => start(next)));
      for (const paper of forms) {
        const count = attempts(get(paper)).length;
        if (count) mixed.append(button(`查看 ${formLabel(paper)}成绩`, 'btn', () => openResults(paper)));
      }
      card.append(mixed);
      if (!window.EXAM_2026) return;
      const paper = window.EXAM_2026;
      const record = get(paper);
      const row = el('section', null, 'paper-panel');
      row.append(el('h2', paper.title), el('p', `${questions(paper).length} 题 · 卷面 ${maxPoints(paper)} 分 · 不计时`, 'note'), el('p', paper.note));
      row.append(button(record.draft ? '继续答卷' : record.last ? '重做原卷（题目不变）' : '开始答卷', 'btn primary', () => start(paper)));
      if (attempts(record).length) row.append(button('查看本卷成绩', 'btn', () => openResults(paper)));
      card.append(row);
    }
    function answered(question, draft) { return Boolean(text(draft.answers?.[question.id]).trim()); }
    const questionLabel = (question, draft) => `${question.id} ${answered(question, draft) ? '已答' : '未答'}`;
    function work() {
      const draft = get(selected).draft;
      const section = selected.sections[sectionIndex];
      heading(paperTitle(selected), section.title, '可以跳题和回改。卷内不提示对错；同浏览器可继续作答。');
      const moved = el('p', '', 'gate-note');
      moved.setAttribute('role', 'status');
      moved.hidden = true;
      if (section.id === 'insert') card.append(el('p', '每个选项最多用一次。同一句选到另一空时，原来的那空会清空。', 'gate-note'), moved);
      const status = el('p', '', 'note');
      status.id = 'paper-count';
      const shortcuts = new Map();
      const update = () => {
        status.textContent = `已答 ${questions(selected).filter((q) => answered(q, draft)).length} / ${questions(selected).length} 题`;
        for (const [q, item] of shortcuts) item.textContent = questionLabel(q, draft);
      };
      update();
      const nav = el('nav', null, 'paper-sections');
      nav.setAttribute('aria-label', '试卷题型');
      const go = (i, questionId = null) => {
        draft.section = sectionIndex = i;
        save(); render(true);
        if (questionId) {
          const field = document.getElementById(`paper-item-${questionId}`);
          field?.focus();
          field?.scrollIntoView({ block: 'start' });
        }
      };
      selected.sections.forEach((part, i) => {
        const next = button(part.title, 'btn', () => go(i));
        if (i === sectionIndex) next.setAttribute('aria-current', 'step');
        nav.append(next);
      });
      const sheet = el('details', null, 'paper-sheet');
      sheet.open = Boolean(draft.sheetOpen);
      sheet.addEventListener('toggle', () => { draft.sheetOpen = sheet.open; save(); });
      sheet.append(el('summary', '答题卡：按题号跳转'));
      const grid = el('div', null, 'paper-sheet-grid');
      selected.sections.forEach((part, i) => part.questions.forEach((q) => {
        const jump = button(questionLabel(q, draft), 'btn', () => {
          draft.sheetOpen = true;
          go(i, q.id);
        });
        shortcuts.set(q, jump);
        grid.append(jump);
      }));
      sheet.append(grid);
      card.append(status, nav, sheet);
      if (section.passage) card.append(el('div', section.passage, 'speech paper-text'));
      for (const q of section.questions) {
        const field = el('fieldset', null, 'paper-question');
        field.id = `paper-item-${q.id}`;
        field.tabIndex = -1;
        field.append(el('legend', `${q.id}.（${q.points} 分）`), promptNode(q));
        const store = (value) => {
          draft.answers ||= {};
          const replaced = [];
          if (section.id === 'insert') {
            for (const other of section.questions) {
              if (other.id !== q.id && draft.answers[other.id] === value) {
                delete draft.answers[other.id];
                replaced.push(other.id);
                const previous = card.querySelector(`input[name="paper-${other.id}"]:checked`);
                if (previous) previous.checked = false;
              }
            }
          }
          draft.answers[q.id] = value;
          if (replaced.length) {
            moved.hidden = false;
            moved.textContent = `这个选项移到了第 ${q.id} 题；第 ${replaced.join('、')} 题恢复为未答。`;
            field.append(moved);
          } else { moved.hidden = true; moved.textContent = ''; }
          save(); update();
        };
        if (q.options) {
          for (const [index, option] of q.options.entries()) {
            const label = el('label');
            const input = el('input');
            input.type = 'radio';
            input.name = `paper-${q.id}`;
            input.value = option.id;
            input.checked = option.id === draft.answers?.[q.id];
            input.addEventListener('change', () => store(option.id));
            label.append(input, el('span', `${String.fromCharCode(65 + index)}. ${option.label}`));
            field.append(label);
          }
        } else {
          const input = el(q.openEnded || q.rubric ? 'textarea' : 'input');
          if (input.tagName === 'INPUT') input.type = 'text';
          else input.rows = 5;
          input.setAttribute('aria-label', `第 ${q.id} 题答案`);
          input.autocomplete = 'off';
          input.spellcheck = false;
          input.maxLength = 1600;
          input.value = text(draft.answers?.[q.id]);
          input.addEventListener('input', () => store(input.value));
          field.append(input);
        }
        card.append(field);
      }
      const footer = el('div', null, 'actions');
      if (sectionIndex > 0) footer.append(button('上一部分', 'btn', () => go(sectionIndex - 1)));
      if (sectionIndex + 1 < selected.sections.length) footer.append(button('下一部分', 'btn', () => go(sectionIndex + 1)));
      footer.append(button('交卷', 'btn primary', () => change('confirm')));
      card.append(footer);
    }
    function confirm() {
      const record = get(selected);
      const blank = questions(selected).filter((q) => !answered(q, record.draft)).length;
      heading(paperTitle(selected), '确认交卷', `${blank ? `还有 ${blank} 题未答，交卷后这些题计 0 分。` : '所有题都已作答。'}交卷会锁定这次答案；提交后才显示参考答案。`);
      card.append(button('继续答题', 'btn', () => change('work')), button('确认交卷并查看成绩', 'btn primary', () => {
        record.past = attempts(record).slice(0, historyLimit - 1);
        record.last = { answers: { ...record.draft.answers }, review: {}, at: Date.now() };
        resultIndex = 0;
        delete record.draft;
        save();
        change('result');
      }));
    }
    function result() {
      const history = attempts(get(selected));
      const last = history[resultIndex];
      if (!last) return list();
      last.review ||= {};
      heading(paperTitle(selected), '整卷成绩', '这是本卷的参考得分，不是官方成绩，也不会折算到课程进度。开放题在参考答案旁核对。');
      const switcher = el('nav', null, 'paper-sections');
      switcher.setAttribute('aria-label', '同一试卷的交卷记录');
      const attemptButtons = history.map((item, index) => {
        const control = button('', 'btn', () => { resultIndex = index; change('result'); });
        if (resultIndex === index) control.setAttribute('aria-current', 'page');
        switcher.append(control);
        return control;
      });
      card.append(switcher);
      const comparison = el('p', '', 'note');
      comparison.setAttribute('role', 'status');
      const total = el('p', '', 'paper-total');
      total.setAttribute('role', 'status');
      card.append(total, comparison);
      const groupLabels = [];
      const followUps = [];
      function update() {
        for (const { section, followUp, lesson } of followUps) {
          followUp.hidden = !lesson || !section.questions.some((q) => {
            const mark = scoreQuestion(q, last);
            return mark.kind !== 'pending' && mark.score < q.points;
          });
        }
        const report = summarize(selected, last);
        total.textContent = totalLabel(report);
        const totals = history.map((attempt) => summarize(selected, attempt));
        attemptButtons.forEach((control, i) => { control.textContent = `${attemptLabel(history[i], i)} · ${totalLabel(totals[i])}`; });
        const previous = totals[resultIndex + 1];
        if (previous && !previous.pending && !report.pending) {
          const delta = format(report.score - previous.score);
          comparison.textContent = delta ? `与同卷上一次相比：${delta > 0 ? '+' : ''}${delta} 分。重做同卷不等于新卷也能拿这个分。` : '与同卷上一次得分相同。';
        } else comparison.textContent = previous ? '两次都完成核分后再比较，本次不把待核对当作零分。' : '';
        groupLabels.forEach((label, index) => {
          const part = report.sections[index];
          label.textContent = `${part.title} · ${format(part.score)} / ${part.max} 分${part.pending ? `（另 ${part.pending} 分待核对）` : ''}`;
        });
      }
      for (const section of selected.sections) {
        const panel = el('details', null, 'paper-panel');
        const followUp = el('div', null, 'paper-follow-up');
        const lesson = suggestLesson?.(section.id);
        if (lesson) followUp.append(el('p', '这部分有失分。可以先回看相关课，再回来对照原题。', 'note'), lesson);
        panel.append(followUp);
        followUps.push({ section, followUp, lesson });
        if (section.passage) {
          const original = el('details', null, 'paper-source');
          original.append(el('summary', '看这部分原文'), el('div', section.passage, 'speech paper-text'));
          panel.append(original);
        }
        const label = el('summary');
        panel.prepend(label);
        groupLabels.push(label);
        for (const q of section.questions) {
          const row = el('section', null, 'paper-question');
          const value = last.answers?.[q.id];
          const displayed = q.options?.find((o) => o.id === value)?.label || value || '未答';
          const ref = q.options?.find((o) => o.id === q.answer)?.label || q.reference || q.accepted?.[0];
          let mark = scoreQuestion(q, last);
          const status = el('strong', `第 ${q.id} 题 · ${mark.kind === 'pending' ? '待核对' : `${mark.score} / ${q.points} 分`}`);
          row.append(status, promptNode(q), el('p', `你的答案：${displayed}`, 'paper-text'));
          if (q.options && q.reference) row.append(el('p', q.reference, 'note'));
          if (ref) row.append(el('p', `参考答案：${ref}`, 'paper-text'));
          if (q.rubric) {
            const list = el('ul');
            for (const line of q.rubric) list.append(el('li', line));
            row.append(list);
          }
          if (mark.kind === 'pending' || mark.kind === 'review') {
            status.textContent += mark.kind === 'review' ? '（人工核对）' : '';
            const input = el('input');
            input.id = `paper-review-${q.id}`;
            input.type = 'number'; input.min = '0'; input.max = String(q.points); input.step = '0.5';
            if (mark.kind === 'review') input.value = String(mark.score);
            const label = el('label', `核对第 ${q.id} 题（0–${q.points} 分）`);
            label.htmlFor = input.id;
            const message = el('p', '', 'note');
            message.setAttribute('role', 'status');
            row.append(label, input, button('确认这题得分', 'btn', () => {
              const score = input.valueAsNumber;
              if (!validScore(score, q.points)) { message.textContent = '请按本题分值范围填写。'; return; }
              last.review[q.id] = score;
              status.textContent = `第 ${q.id} 题 · ${score} / ${q.points} 分（人工核对）`;
              message.textContent = '已计入整卷。';
              save();
              update();
            }), message);
          }
          panel.append(row);
        }
        card.append(panel);
      }
      update();
      card.append(button('返回试卷列表', 'btn', () => change('list')));
      if (forms.includes(selected)) {
        const paper = selected;
        const next = nextForm();
        if (next !== paper) card.append(button(get(next).draft ? `继续答卷（${formLabel(next)}）` : `换一套题（${formLabel(next)}）`, 'btn primary', () => start(next)));
        card.append(button(get(paper).draft ? `继续这套（${formLabel(paper)}）` : `重做本套（${formLabel(paper)}）`, 'btn', () => start(paper)));
      }
    }
    return {
      resetView() { view = 'list'; },
      show() { ({ list, work, confirm, result })[view](); },
      showResults(parent) {
        const reports = papers.filter((paper) => attempts(get(paper)).length);
        if (!reports.length) parent.append(el('p', '还没有整卷成绩。去「试卷」做完一份并交卷，这里就会显示。', 'note'));
        for (const paper of reports) {
          const history = attempts(get(paper));
          parent.append(el('p', `${paper.title}：${totalLabel(summarize(paper, history[0]))}`),
            button(`查看${paper.title}的记录（${history.length} 次）`, 'btn', () => openResults(paper)));
        }
      },
    };
  }
  return { create };
})();
