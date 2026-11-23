/* Original B form. Do not modify its questions after release; add a new form instead. */
window.EXAM_B = (() => {
  let n = 0;
  const pick = (points, prompt, labels, correct) => ({ id: String(++n), points, prompt,
    options: labels.map((label, index) => ({ id: 'ABCD'[index], label })), answer: 'ABCD'[correct] });
  const write = (points, prompt, accepted, reference, reviewUnmatched = false) => ({ id: String(++n), points, prompt, accepted, reference, reviewUnmatched });
  const part = (id, title, questions, passage) => ({ id, title, questions, passage });
  const shared = ['We went to the art room instead.', 'It was on a high shelf.', 'The library was closed that morning.', 'We went home without doing any work.'];
  return { id: 'mixed-b', title: '原创综合练习卷 · B 卷', sections: [
    part('dialogue', 'Ⅰ 补全对话', [
      pick(2, '—Could you help me carry this box?\n—____ I have some time now.', ['Not at all.', 'Of course.', 'I don’t think so.', 'See you later.'], 1),
      pick(2, '—I’m afraid I won’t do well in the school play.\n—____ You have practised a lot.', ['Good luck next year.', 'I agree.', 'Don’t worry.', 'That’s the one.'], 2),
      pick(2, '—I got the job at the bookshop!\n—____', ['Glad to hear that!', 'I’m sorry to hear that.', 'Never mind.', 'It doesn’t matter.'], 0),
    ]),
    part('words', 'Ⅱ 词汇', [
      pick(2, '选出画线词的意思。\nCan you **pick up** the papers off the floor?', ['接人', '学会', '捡起', '加速'], 2),
      pick(2, '选出画线词的意思。\nThe lake is **still** today; nothing moves on its surface.', ['仍然', '平静的', '拥挤的', '浅的'], 1),
      pick(2, '选出画线词的意思。\nThe room was **bright** because the sun was shining through the windows.', ['明亮的', '聪明的', '安静的', '整洁的'], 0),
    ]),
    part('cloze', 'Ⅲ 完形填空', [
      pick(2, '填第 7 空。', ['lost', 'planned', 'painted', 'sold'], 0),
      pick(2, '填第 8 空。', ['because', 'if', 'but', 'or'], 2),
      pick(2, '填第 9 空。', ['gate', 'bag', 'desk', 'window'], 1),
    ], 'It was Monday morning. Mei could not find the key to the club room. She thought she had [7] ____ it. She looked on her desk, [8] ____ it was not there. Just then she remembered that she had put it beside her books. She checked her school [9] ____ and found it under her English book.'),
    part('reading-1', 'Ⅳ 阅读理解 · 修理社通知', [
      pick(3, 'When does the meeting begin?', ['2 p.m. on Saturday.', '3 p.m. on Monday.', '3 p.m. on Saturday.', '4 p.m. on Saturday.'], 2),
      pick(3, 'Where should students go?', ['Room 307.', 'The library.', 'The school gate.', 'Room 203.'], 0),
      pick(3, 'What does the club lend to students?', ['Bottles.', 'Old bags.', 'Notebooks.', 'Tools.'], 3),
    ], 'Repair Club\nThe club meets at 3 p.m. on Saturday in Room 307. Bring one small broken item, such as a toy or a bag. You do not need your own tools. The club will lend you tools and show you how to use them.'),
    part('reading-2', 'Ⅳ 阅读理解 · 海报故事', [
      pick(3, 'What is the story mainly about?', ['How Bo saved money on paper.', 'How Bo learned to share work with others.', 'How a school fair was cancelled.', 'How a poster was lost.'], 1),
      pick(3, 'Why did Bo ask his classmates for help?', ['He did not want a poster.', 'They needed to leave early.', 'He was running out of time.', 'They asked him to buy paper.'], 2),
    ], 'Bo wanted to make the school fair poster by himself. He drew all morning, but the poster was still half empty an hour before the fair. He asked two classmates for help. One drew the map and the other wrote the times. They finished just before the fair opened. The next time Bo made a poster, he asked his classmates to plan it with him from the start.'),
    part('reading-3', 'Ⅳ 阅读理解 · 校园地图指南', [
      pick(3, 'Where is this text most likely from?', ['A guide for new students.', 'A restaurant menu.', 'A student’s diary.', 'A storybook.'], 0),
      pick(3, 'What is a landmark in this text?', ['A person who shows you the way.', 'A place you can see and use to find your way.', 'A list of rooms.', 'A kind of map.'], 1),
    ], 'New to the school? Use these steps to find your classroom. First, open the map at the school gate. Next, look for a landmark, a place you can see and use to find your way. The library and the sports hall are good landmarks. Then follow the path to your building.'),
    part('insert', 'Ⅳ 阅读 · 短文选句', [
      pick(3, '填第 17 空。', shared, 2),
      pick(3, '填第 18 空。', shared, 0),
      pick(3, '填第 19 空。', shared, 1),
    ], 'On Saturday, we went to the library to work on our art project. [17] ____ The door was locked.\n\n[18] ____ Our art teacher was there and said we could use a table. We needed a box of coloured pencils. [19] ____ The teacher took it down for us, and we finished the project together.'),
    part('grammar', 'Ⅴ 语法填空', [
      write(2, '填第 20 空。', ['went'], 'went：last Sunday 提示过去，go 的过去式是 went。'),
      write(2, '填第 21 空。', ['boxes'], 'boxes：two 后接复数；box 变 boxes。'),
      write(2, '填第 22 空。', ['at'], 'at：用于具体时刻。'),
    ], 'Last Sunday, I [20] ____ (go) to the school fair. My classmates brought two [21] ____ (box) of books to sell. The sale started [22] ____ 10 a.m.'),
    part('sentence', 'Ⅵ 完成句子', [
      write(3, 'We ____ after class yesterday.（打了乒乓球）', ['played table tennis', 'played ping-pong', 'played ping pong'], 'We played table tennis after class yesterday.', true),
      write(3, 'Please tell me ____.（会议几点开始）', ['what time the meeting starts', 'what time the meeting will start', 'when the meeting starts', 'when the meeting will start'], 'Please tell me what time the meeting starts.', true),
      write(3, 'I ____ when Mei called.（正在读书）', ['was reading', 'was reading a book'], 'I was reading when Mei called.', true),
    ]),
    part('email', 'Ⅶ 应用写作', [{ id: String(++n), points: 10, openEnded: true,
      prompt: '假设你是 Mei。请给 Alex 写一封邮件，介绍一次你参加的校园活动：说清活动是什么、你做了什么，以及为什么愿意再参加。正文约 40 个英语单词，不写自己的真实姓名、学校或联系方式。',
      reference: 'Dear Alex,\n\nLast Friday, I went to our school book fair. I helped a friend put books on the tables. Later, I bought a short story. I would like to go again because I can find new books and spend time with friends.\n\nBest wishes,\nMei',
      rubric: ['交代一次活动、做过的事和愿意再参加的原因。', '过去的事用过去式，理由表达清楚。', '有称呼和落款，正文约 40 词，不写真实信息。'] }]),
  ] };
})();
