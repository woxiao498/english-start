/* Original practice. Each topic keeps its own draft and score history. */
window.EXAM_FOCUS = (() => {
  const paper = (id, title, questions, passage) => ({
    id: `focus-${id}`, title, sections: [{ id, title, questions, passage }],
  });
  const markers = text => text.trim().replace(/\[(\d+)\]/g, '[$1] ____');
  const choices = (rows, points, shared) => rows.map(([labels, correct, reference], i) => ({
    id: String(i + 1), points, prompt: `填第 ${i + 1} 空。`, reference,
    options: (shared || labels).map((label, index) => ({ id: 'ABCDE'[index], label })),
    answer: 'ABCDE'[correct],
  }));
  const written = (rows, points, reviewUnmatched = false) => rows.map(([prompt, accepted, reference], i) => ({
    id: String(i + 1), points, prompt, accepted, reference, reviewUnmatched,
  }));

  const cloze = paper('cloze', '长篇完形', choices([
    [['covered', 'noticed', 'washed', 'bought'], 1, '阿姨问他发现了什么，下一句指出瓶盖漏水。notice 是「注意到」。'],
    [['handle', 'label', 'lid', 'bottom'], 2, '下文说转紧后水就不再漏，只有 lid（盖子）和这个动作接得上。'],
    [['instead', 'already', 'outside', 'almost'], 0, 'Lin 想换新瓶，阿姨建议先仔细看看。instead 表示改做另一件事。'],
    [['but', 'so', 'unless', 'while'], 1, '先擦干瓶身是为了看清水从哪里漏出。so 后接这样做能达到的结果。'],
    [['heavier', 'cooler', 'cleaner', 'tighter'], 3, 'turn the lid tighter 表示把盖子拧得更紧。'],
    [['hoped', 'forgot', 'decided', 'refused'], 2, '看到水还在滴，他作出下一步决定。decide to do 表示决定做某事。'],
    [['dry', 'loose', 'round', 'new'], 1, '它本来应紧贴盖子，后来按回原位就止漏，说明这个圈先前松了。'],
    [['piece', 'pair', 'cup', 'line'], 0, 'a piece of paper 是一张纸，后文说这张纸仍然干着。'],
    [['busy', 'late', 'afraid', 'pleased'], 3, '修好以后，他很高兴不用再买新的。pleased 描述高兴的感受。'],
    [['held on to', 'looked after', 'threw away', 'picked up'], 2, '他回想自己以前把东西扔得太快。throw away 是「扔掉」。'],
    [['Although', 'Since', 'Before', 'If'], 2, '用 before 说明先检查，再考虑换新的。后面接的是两件事的先后。'],
    [['help', 'money', 'space', 'luck'], 0, '遇到自己修不好的情况就找懂的人帮忙。ask for help 是「求助」。'],
    [['choosing', 'borrowing', 'naming', 'sharing'], 3, '下文说他向同学演示怎么修，所以是分享学到的方法。'],
    [['bottle', 'idea', 'ticket', 'tool'], 1, '同学开始用同一个办法检查自己的物品，所以传出去的是这个主意。'],
    [['proud', 'nervous', 'sorry', 'sleepy'], 0, '看到一个小办法帮到大家，他为这次经历感到自豪。'],
  ], 2), markers(`
On a Saturday morning, Lin filled his water bottle before a bike ride. When he picked it up, his hand got wet. His aunt looked at the bottle and asked, “What have you [1]?” Lin checked it and saw water coming from the [2]. He wanted to buy a new bottle, but his aunt suggested taking a closer look [3].

First, Lin dried the outside [4] he could see where the water was coming from. Then he turned the lid [5]. A drop still fell onto the table. He [6] to take the lid off. Inside it was a small rubber ring. It was [7] and did not sit flat. After he pressed it back into place, he put a [8] of paper under the bottle and waited.

Ten minutes later, the paper was still dry. Lin felt [9] that he could keep using the bottle. He thought about other things he had [10] too quickly. “[11] you replace something,” his aunt said, “look for a simple problem first. Ask for [12] if you can’t fix it safely.”

On Monday, Lin told his classmates about the repair. By [13] what he had learned, he helped them see that a small check could save money. A classmate used the same [14] to check a lunch box. When Lin saw that his small repair had helped someone else, he felt [15] of what he had done.`));

  const insertOptions = [
    'Try practising one short part at a time.',
    'A phone recording can help you notice this.',
    'There are a few simple ways to get ready.',
    'A listener can tell you where your meaning is unclear.',
    'It also gives you a chance to check the room and equipment.',
  ];
  const insert = paper('insert', '短文选句', choices([
    [null, 2, '这一空接在提出困难之后，下一段开始列办法，需要一句总起句。'],
    [null, 0, '后文的开头、主体、结尾对应分成短段逐一练。'],
    [null, 1, 'this 指说得太快。下句 When you play it back 指回手机录音。'],
    [null, 3, '这里刚提到同学当听众，下一句接着说根据反馈改例子。'],
    [null, 4, 'it 指提前到场，后句也在核对设备能不能用。'],
  ], 3, insertOptions), markers(`
Giving a short talk in class can feel difficult. You may have good ideas but forget what to say when everyone looks at you. [1] These steps help you prepare a talk you can actually give.

First, write just a few key words on a small card. [2] Work on the opening first. When it feels easy, move on to the middle and then the ending. Finally, put the parts together.

When you know what to say, listen to how fast you speak. Some people talk much faster when they are nervous. [3] When you play it back, mark the places where you seem to run out of breath. Add a short pause in those places.

Next, give the talk to one classmate. [4] If your classmate has a question about an example, add a detail or choose a clearer example.

On the day of the talk, arrive a little early. [5] For example, make sure your slides open and the screen is easy to see. Then take a breath and start with the opening you have practised.`));

  const grammar = paper('grammar', '篇章语法填空', written([
    ['填第 1 空。', ['joined'], 'Last autumn 说明发生在过去。join 的过去式是 joined。'],
    ['填第 2 空。', ['an'], 'idea 的词首是元音，第一次提到一个主意用 an idea。'],
    ['填第 3 空。', ['tools'], 'several 后接可数名词复数。tool 加 s。'],
    ['填第 4 空。', ['because', 'as', 'since'], '后半句解释她紧张的原因，可以用 because。'],
    ['填第 5 空。', ['to turn'], 'how to do 是「怎样做」，这里写 how to turn。'],
    ['填第 6 空。', ['carefully'], '在句末修饰动作 measured，用副词 carefully。'],
    ['填第 7 空。', ['for', 'over'], 'for two weeks 表示持续两周。'],
    ['填第 8 空。', ['practising', 'practicing'], 'keep doing 表示持续做。两种拼法都收录。'],
    ['填第 9 空。', ['where', 'in which'], '前面是地点 place，从句缺「在那里」的信息，填 where。'],
    ['填第 10 空。', ['herself'], 'by oneself 表示独自完成。主语是 she，对应 herself。'],
  ], 2), markers(`
Last autumn, Jia [1] (join) a small woodworking club. At the first meeting she had [2] idea for a book stand. The teacher gave the class several [3] (tool) and showed everyone how to use them safely.

Jia was nervous [4] she had never worked with wood before. Her partner showed her how [5] (turn) a short piece of wood into the base of a stand. Before cutting it, Jia measured it [6] (careful).

The group worked on the stands [7] two weeks. Even after making a mistake, Jia kept [8] (practise) on spare pieces. At last, the teacher cleared a place [9] students could display their work. Jia was proud that she could now make a simple stand by [10] (she).`));
  const sentence = paper('sentence', '完成句子专项', written([
    ['Could you tell me ____?（报名地点在哪里）', ['where the sign-up desk is', 'where the registration desk is'], 'where the sign-up desk is。间接问句把地点放在 is 前面。'],
    ['We ____ when the lights went out.（正在准备海报）', ['were preparing the poster', 'were preparing posters', 'were preparing a poster', 'were making a poster', 'were making the poster', 'were getting the poster ready'], 'were preparing the poster。we 用 were，持续的动作写 preparing。'],
    ['It is ____ before you leave.（检查门窗很重要）', ['important to check the doors and windows', 'important to check the windows and doors'], 'important to check the doors and windows。按 important + to do 补全。'],
    ['____ every week, you will get better.（只要你每周练习）', ['as long as you practise', 'as long as you practice', 'so long as you practise', 'so long as you practice'], 'As long as you practise。every week 已经给出，空里只补条件和动作。'],
    ['My class is ____ the project.（为这个项目感到自豪）', ['proud of'], 'proud of。is 和 the project 已经写好，补 proud of 即可。'],
  ], 3, true));
  const email = paper('email', '应用写作专项', [{
    id: '1', points: 10, openEnded: true,
    prompt: '假设你是 Lin。交换生 Alex 想在学校参加一项活动。写一封英语邮件，推荐一次校内活动，说明可以做什么，以及推荐的理由。正文约 40 个英语单词，使用题目中的称呼和署名。',
    reference: 'Dear Alex,\n\nI recommend joining our school book swap. It takes place in the library on Friday. You can bring a book and choose another one to take home. It is a good way to find new stories and meet other readers.\n\nBest wishes,\nLin',
    rubric: ['内容：写出你推荐的活动、能做的事和推荐的理由。', '表达：动作和原因写清楚，检查拼写、时态和句子衔接。', '格式：有称呼、正文和署名；正文约 40 词。'],
  }]);

  function clozePractice(id, label, rows, passage) {
    return { ...paper(`cloze-${id}`, `完形复练 · ${label}`, choices(rows, 2), markers(passage)),
      clozeSkill: id, skillLabel: label };
  }

  return [cloze, insert, grammar, sentence, email,
    clozePractice('collocation', '固定搭配', [
      [['looked', 'asked', 'waited', 'arrived'], 1, '空后是 the teacher for help，用 ask someone for help 表示「向某人求助」。'],
      [['made', 'gave', 'took', 'put'], 2, 'take turns doing something 表示「轮流做某事」。这里大家轮流试话筒。'],
      [['away', 'up', 'out', 'off'], 0, '活动结束后把话筒放进储物柜，put something away 表示「把某物收好」。'],
    ], `
During a rehearsal, our microphone stopped working. I [1] the teacher for help. She showed the group which switch to press. Then we [2] turns testing the microphone, so each person had a chance to speak.

When we finished, we put the microphone [3] in a cupboard and turned off the lights.`),
    clozePractice('logic', '逻辑关系', [
      [['Because', 'Unless', 'If', 'Although'], 3, '零件很少，机器人却仍能走完路线。although 引出让步。'],
      [['because', 'unless', 'although', 'so'], 1, 'unless 表示「除非」。把开关拨到 ON 才能启动，不拨就无法启动。'],
      [['However', 'Otherwise', 'Therefore', 'Meanwhile'], 2, '有人看不懂原来的说明，于是小组补上图示。therefore 引出结果。'],
    ], `
Our group built a small robot for an open day. [1] it had only a few parts, it could still follow the whole track.

The robot won't start [2] you move the switch to ON. During practice, two visitors could not identify the switch from our written instructions. [3], we added a picture with an arrow pointing to the switch.`),
    clozePractice('context', '上下文线索', [
      [['lamp', 'clock', 'plant', 'bag'], 3, '下一句说她打开它、取出两块球拍，能装进球拍的是 bag。'],
      [['crack', 'label', 'colour', 'number'], 0, '后一句说按住边缘时木头沿细线分开，说明那道细线是一条裂缝。'],
      [['box', 'tray', 'bin', 'cupboard'], 1, '墙上的告示要求把坏球拍放入红色托盘。the tray 指前一句的 a red tray。'],
    ], `
Min carried a [1] into the gym. She opened it and took out two table tennis bats. One bat had a [2] she had not seen before. When she pressed the edge, the wood opened along a thin line.

A notice on the wall said that damaged bats should go in a red tray for repair. Min left the broken bat in the [3] and kept the other one for practice.`),
  ];
})();
