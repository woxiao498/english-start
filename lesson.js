// 课程内容与页面逻辑分开：以后加课，先从这里改。
function teachingLesson({ id, number, title, goal, example, chinese, terms, rule, extraExample, guided, walkthrough, guidedAnswers, independent, answers, recap, checkPrompt = goal, guidedLanguage = 'en', independentLanguage = 'en', transferGlossary }) {
  const task = (lines, choices) => ({
    dialogueLines: Array.isArray(lines) ? lines : [lines],
    options: choices.map(([label, hint], index) => ({ id: String(index), label, hint })),
    answer: String(choices.findIndex(([, hint]) => !hint)),
  });
  const guidedTask = task(guided, guidedAnswers);
  const independentTask = task(independent, answers);
  return {
    id, number, title, scene: '先看一个短例子。', goal,
    stepLabels: ['先看讲解', '跟着做', '自己试一次'],
    example: { english: example, chinese, teaching: [rule], next: '跟着做一次',
      meanings: terms.map(([english, chinese]) => ({ english, chinese })),
      ...(extraExample ? { extraExample } : {}) },
    build: { ...guidedTask, linesLanguage: guidedLanguage, title: '跟着看线索', prompt: '先看下面的拆解，再选一项。', guide: walkthrough,
      success: '对上了。', next: '下一步：自己试一次', backLabel: '回看讲解' },
    transfer: { ...independentTask, linesLanguage: independentLanguage, glossary: transferGlossary, title: '自己试一次', prompt: checkPrompt, success: recap },
    done: { title: '这一小课学完了', subtitle: goal, english: example, practice: recap },
  };
}

window.LESSONS = Object.freeze([{
  id: 'first-hello',
  number: '第一课',
  title: '和新同学打个招呼',
  scene: '实训课换了搭档，你们第一次见面。',
  goal: '用一句英语说自己的名字。',
  example: {
    english: 'Hi, I’m Lin.',
    parts: ['Hi, ', 'I’m ', 'Lin.'],
    meanings: [
      { english: 'Hi', chinese: '你好' },
      { english: 'I’m Lin', chinese: '我是 Lin' },
    ],
    chinese: '你好，我是 Lin。',
    teaching: ['Hi 先打招呼；I’m 后面接说话人自己的名字，不是对方的名字。换了人，前面不动，只换最后的名字。'],
    extraExample: {
      title: '换个人说，看看哪儿变了',
      lines: [['Hi, I’m Lin.', 'Lin 在自我介绍。'], ['Hi, I’m Jia.', '换成 Jia 在说，名字才跟着换。']],
    },
  },
  build: {
    prompt: '现在轮到你。假设你叫 Lin，点卡片拼出「你好，我是 Lin」。',
    tiles: [
      { id: 'name', text: 'Lin', hint: '人名放在 I’m 后面。准备好后，把 Lin 接上。' },
      { id: 'hi', text: 'Hi', hint: 'Hi 是打招呼，放在句子开头。' },
      { id: 'im', text: 'I’m', hint: 'I’m 是「我是」。先说 Hi，再点 I’m。' },
    ],
    order: ['hi', 'im', 'name'],
  },
  transfer: {
    english: 'Hi, I’m Chen.',
    prompt: '这次换了个人。对方在说什么？',
    options: [
      { id: 'other', label: '你好，我是 Lin。', hint: '前半句没变，但这次 I’m 后面是 Chen，不是 Lin。' },
      { id: 'self', label: '你好，我是 Chen。' },
      { id: 'question', label: '你好，你叫什么名字？', hint: '这句没有在问名字。I’m 是「我是」，对方是在说自己是谁。' },
    ],
    answer: 'self',
    success: '认对了！这次说话的人叫 Chen。',
  },
  letters: [
    { upper: 'H', lower: 'h', speech: 'aitch' },
    { upper: 'I', lower: 'i', speech: 'eye' },
    { upper: 'M', lower: 'm', speech: 'em' },
    { upper: 'L', lower: 'l', speech: 'ell' },
    { upper: 'N', lower: 'n', speech: 'en' },
  ],
  done: {
    title: '你可以用英语介绍自己了',
    subtitle: '见到新搭档时，先打招呼，再说自己的名字。',
    english: 'Hi, I’m …',
    practice: '把最后换成自己的名字。在心里默读就行，想说也可以。',
  },
}, {
  id: 'ask-name',
  number: '第二课',
  title: '问对方名字',
  scene: '你刚说完自己的名字，新搭档还没介绍自己。',
  goal: '用一句英语问对方叫什么。',
  stepLabels: ['先看一句', '拼一句', '选一句'],
  example: {
    english: 'What’s your name?',
    chinese: '你叫什么名字？',
    meanings: [
      { english: 'your name', chinese: '你的名字' },
      { english: 'What’s', chinese: '这里用来问「是什么」' },
    ],
    teaching: ['先用 What’s 开口问，再接 your name（你的名字）。your 说的是对方的，不是自己的。自己回答时，用 I’m 加自己的名字。'],
    extraExample: {
      title: '哪句是问，哪句是答？',
      lines: [['What’s your name?', '说话的人在问对方叫什么。'], ['I’m Tao.', 'Tao 在回答，用的是自己的名字。']],
    },
  },
  build: {
    prompt: '点卡片拼出「你叫什么名字？」。',
    tiles: [
      { id: 'name', text: 'name', hint: 'name 是「名字」。先用 What’s 来提问。' },
      { id: 'whats', text: 'What’s' },
      { id: 'your', text: 'your', hint: '先点 What’s，再说「你的名字」your name。' },
    ],
    order: ['whats', 'your', 'name'],
    hints: { 1: 'your name 是「你的名字」。先点 your，再点 name。' },
  },
  transfer: {
    title: '选一句来问名字',
    prompt: '新搭档还没说名字。选一句英语来问他。',
    options: [
      { id: 'ask', label: 'What’s your name?' },
      { id: 'intro', label: 'Hi, I’m Lin.', hint: '这句是在介绍自己。要问对方，可以找含有 your name（你的名字）的句子。' },
      { id: 'meet', label: 'Nice to meet you.', hint: '这句是「很高兴认识你」，没有问名字。' },
    ],
    answer: 'ask',
    success: '问对了！对方可以回答：I’m Chen.（我是 Chen。）',
    englishOptions: true,
  },
  done: {
    title: '你会问对方的名字了',
    subtitle: '说完自己的名字，再问对方叫什么。',
    english: 'What’s your name?',
    practice: '想象新搭档就坐在旁边，在心里问一句就行。',
  },
}, {
  id: 'first-conversation',
  number: '第三课',
  title: '聊完第一段对话',
  scene: '这次新搭档先开口。你叫 Lin，对方叫 Chen。',
  goal: '接上两句，跟新搭档聊完一小段。',
  stepLabels: ['看对话', '接一句', '换个场景'],
  example: {
    title: '先看一段对话',
    english: 'Hi, I’m Chen. What’s your name? Hi, I’m Lin. Nice to meet you. Nice to meet you, too.',
    dialogue: [
      { speaker: '搭档 · Chen', english: 'Hi, I’m Chen. What’s your name?', chinese: '你好，我是 Chen。你叫什么名字？' },
      { speaker: '你 · Lin', english: 'Hi, I’m Lin.', chinese: '你好，我是 Lin。', yours: true },
      { speaker: '搭档 · Chen', english: 'Nice to meet you.', chinese: '很高兴认识你。' },
      { speaker: '你 · Lin', english: 'Nice to meet you, too.', chinese: '我也很高兴认识你。', yours: true },
    ],
    teaching: [
      '先看对方在说什么：问名字，就说自己的名字，不用把问题原样问回去。',
      '刚交换过名字，对方说「很高兴认识你」，就不用再报名字。用同一句回应，句尾加 too（也）。',
    ],
    next: '试着接一句',
  },
  build: {
    title: '接上第一句',
    prompt: '搭档问你的名字。你叫 Lin，该怎么答？',
    english: 'Hi, I’m Chen. What’s your name?',
    options: [
      { id: 'ask', label: 'What’s your name?', hint: '这是在反问对方的名字。现在对方想知道你的名字。' },
      { id: 'chen', label: 'Hi, I’m Chen.', hint: 'Chen 是对方。你叫 Lin，把自己的名字放在 I’m 后面。' },
      { id: 'lin', label: 'Hi, I’m Lin.' },
    ],
    answer: 'lin',
    success: '接上了！你告诉了搭档自己的名字。',
    englishOptions: true,
    next: '换个场景',
  },
  transfer: {
    title: '对方说「很高兴认识你」',
    prompt: '另一位同学已经知道你的名字。他这样说，你怎么回？',
    english: 'Nice to meet you.',
    options: [
      { id: 'too', label: 'Nice to meet you, too.' },
      { id: 'ask', label: 'What’s your name?', hint: '这句是在问名字。对方是在说「很高兴认识你」。' },
      { id: 'intro', label: 'Hi, I’m Lin.', hint: '不用再介绍一遍。想说「我也很高兴认识你」，找句尾有 too（也）的那句。' },
    ],
    answer: 'too',
    success: '接对了。句尾的 too 表示「也」。',
    englishOptions: true,
  },
  done: {
    title: '你聊完了第一段英语对话',
    subtitle: '打招呼、说名字、问名字，再礼貌回一句。现在可以把两个人的名字换一换。',
    english: 'Nice to meet you, too.',
    practice: '可以在心里分角色读一遍。想开口的话，也可以找人一起说。',
    audio: 'Nice to meet you, too.',
  },
}, {
  id: 'notice-time',
  number: '第四课',
  title: '看懂通知里的时间',
  scene: '学校贴了一张英文通知。',
  goal: '先不用读懂每个词，只找活动星期几、几点开始。',
  stepLabels: ['先看讲解', '跟着找时间', '自己试一次'],
  example: {
    title: '先学怎么找时间',
    english: 'The meeting starts at 4 p.m. on Friday.',
    chinese: '会议星期五下午四点开始。',
    meanings: [
      { english: 'meeting', chinese: '会议' },
      { english: 'starts at', chinese: '在几点开始：后面跟时刻' },
      { english: 'a.m. / p.m.', chinese: '上午／下午或晚上：4 p.m. 是下午四点，9 a.m. 是上午九点' },
      { english: 'on Monday / on Friday', chinese: '在星期一／在星期五' },
    ],
    teaching: [
      '先找 starts at，后面的数字告诉你几点。别漏看 a.m.（上午）和 p.m.（下午／晚上）。',
      '再找 on 后面的星期。这里只用到 Friday（星期五）和 Monday（星期一），不用先背整张星期表。',
      '有时通知给两个时间。问活动开始，就先认 starts，再读它后面的时间；Doors open 说的是开门。',
    ],
    extraExample: {
      title: '同一张通知，开门和开始不是一回事',
      lines: [['Doors open at 8:20 a.m. on Friday.', '星期五上午 8:20 开门。'],
        ['The meeting starts at 8:40 a.m. on Friday.', '星期五上午 8:40 才开始。问开始，就看有 starts 的那行，不看哪个时间排在前面。']],
    },
    next: '跟着找一次',
  },
  build: {
    title: '跟着找时间',
    prompt: '先找几点，再找星期几。下面带你读一遍。',
    dialogueLines: ['The meeting starts at 9 a.m. on Monday.'],
    guide: '圈住 starts at 后面的 9 a.m.：上午九点。再看 on Monday：星期一。合起来就是星期一上午九点。',
    options: [
      { id: 'am', label: '星期一上午九点' },
      { id: 'pm', label: '星期一下午九点', hint: '这里写的是 a.m.，不是 p.m.，所以是上午。' },
    ],
    answer: 'am', success: '找到了：星期一上午九点。',
    next: '下一步：自己找时间', backLabel: '回看讲解',
  },
  transfer: {
    title: '自己找一次', prompt: '这次通知里有两个时间。只选活动几点开始、星期几。',
    dialogueLines: ['Doors open at 2:30 p.m. on Monday.', 'The club activity starts at 3 p.m. on Monday.'],
    glossary: [['club activity', '社团活动'], ['Doors open', '开门；这里指活动开始前可以进场']],
    options: [
      { id: 'monday', label: '星期一下午三点' },
      { id: 'friday', label: '星期五下午三点', hint: '几点找对了。再看 on 后面：Monday 是星期一。' },
      { id: 'doors', label: '星期一下午两点半', hint: '2:30 是开门时间；活动开始要找 starts at 后面的 3 p.m.。' },
    ],
    answer: 'monday', success: '3 p.m. 是活动开始；2:30 p.m. 只是开门；on Monday 是星期一。',
  },
  done: {
    title: '你找到了通知里的时间',
    subtitle: '下一次碰到英文通知，可以先找开始时间和星期，不用从头逐词翻译。',
    english: 'starts at 3 p.m. on Monday',
    practice: '先看 starts at 后面几点，再看 on 后面星期几。',
    audio: 'The club activity starts at 3 p.m. on Monday.',
  },
}, {
  id: 'notice-place', number: '第五课', title: '看懂通知里的地点',
  scene: '知道几点之后，还要知道去哪儿。', goal: '先学找集合地点，不用读懂整张通知。',
  stepLabels: ['先看讲解', '跟着找地点', '自己试一次'],
  example: {
    title: '找 Meet in 后面的地方', english: 'Meet in Room 203.', chinese: '在 203 室集合。',
    meanings: [{ english: 'Meet in', chinese: '在……集合' }, { english: 'Room 203', chinese: '203 室' }, { english: 'school library', chinese: '学校图书馆' }, { english: 'classroom', chinese: '教室' }, { english: 'computer lab', chinese: '计算机教室；机房' }],
    teaching: ['把 meet in 当成一组记。Meet in the school library 是在学校图书馆集合；Meet in the classroom 是在教室集合。换了地方，前面的 meet in 不变。', '前一课的 starts at 后面找时刻；这里的 Meet in 后面找地点。地点可以写房间号，也可以写名字，比如 computer lab。'], next: '跟着找一次',
  },
  build: {
    title: '跟着找地点', prompt: '只看地点这一行。', dialogueLines: ['Meet in the library.'],
    guide: '先认 Meet in（在……集合），再看后面的 the library（图书馆）。合起来：在图书馆集合。',
    options: [{ id: 'room', label: '203 室', hint: '这句没有 Room 或房间号。' }, { id: 'library', label: '图书馆' }],
    answer: 'library', success: '这次 Meet in 后面写的是图书馆。', next: '下一步：自己找地点', backLabel: '回看讲解',
  },
  transfer: {
    title: '自己找一次', prompt: '这次通知没有写房间号。去哪儿集合？',
    dialogueLines: ['The meeting starts at 4 p.m.', 'Meet in the computer lab.'],
    glossary: [['meeting', '会议']],
    options: [{ id: 'library', label: '图书馆', hint: '图书馆是 library。再认一下 computer lab。' }, { id: 'classroom', label: '普通教室', hint: '这里是 computer lab，不是 classroom。' }, { id: 'lab', label: '机房' }],
    answer: 'lab', success: 'Meet in 后是 the computer lab（机房）；4 p.m. 是开始时间。',
  },
  done: { title: '你找到了集合地点', subtitle: '时间和地点可以分开找。', english: 'Meet in the computer lab.', practice: '遇到不同的校园地点，还是可以先找 Meet in。', audio: 'Meet in the computer lab.' },
}, {
  id: 'notice-bring', number: '第六课', title: '看懂通知说要带什么',
  scene: '有的东西要自己带，有的学校会借。', goal: '分清是哪一边负责准备。',
  stepLabels: ['先看讲解', '跟着找物品', '自己试一次'],
  example: {
    title: '别只盯着物品名', english: 'Bring a notebook. The school will lend you a pen.', chinese: '带一本笔记本。学校会借你一支笔。',
    meanings: [{ english: 'bring', chinese: '带上' }, { english: 'lend you', chinese: '借给你' }, { english: 'pen', chinese: '笔' }, { english: 'pencil', chinese: '铅笔' }, { english: 'notebook', chinese: '笔记本' }],
    teaching: ['先把动作和物品一起读。Bring a notebook 是带笔记本；换一个物品，Bring a pencil 就是带铅笔。', 'lend you a pen 是借给你一支笔。笔会由学校借给你，不是另一件要自己带的东西。'], next: '跟着找一次',
  },
  build: {
    title: '跟着找要带的东西', prompt: '找 Bring，不是找第一个出现的物品。',
    dialogueLines: ['The school will lend you a notebook.', 'Bring a pencil.'],
    guide: '第一句是学校借笔记本。第二句才有 Bring，后面是 a pencil：你要带一支铅笔。',
    options: [{ id: 'notebook', label: '笔记本', hint: '笔记本是在 lend you 后面，是借给你的。' }, { id: 'pencil', label: '铅笔' }],
    answer: 'pencil', success: '你要带的是铅笔。', next: '下一步：自己找物品', backLabel: '回看讲解',
  },
  transfer: {
    title: '自己找一次', prompt: '这次要自己带什么？', dialogueLines: ['Bring a pen.', 'The school will lend you a pencil.'],
    glossary: [['pen', '笔'], ['pencil', '铅笔']],
    options: [{ id: 'pencil', label: '铅笔', hint: '铅笔放在 lend you 后面，是学校借给你的。' }, { id: 'pen', label: '笔' }, { id: 'both', label: '笔和铅笔', hint: '没有要求两样都带。只看 Bring 后面的东西。' }],
    answer: 'pen', success: 'Bring a pen：自己带一支笔。',
  },
  done: { title: '你分清了要带和会借的东西', subtitle: '看到物品名时，先看前面的动作。', english: 'Bring a pen.', practice: 'Bring 是自己带；lend you 是借给你。', audio: 'Bring a pen.' },
}, {
  id: 'notice-whole', number: '第七课', title: '读完一张校园通知',
  scene: '把前三课学到的线索放回一张短通知。', goal: '从不同的行里分别找时间、地点、物品。',
  stepLabels: ['先看讲解', '跟着整理', '自己试一次'],
  example: {
    title: '一张通知，分三行来读', english: 'The meeting starts at 9 a.m. on Monday. Meet in Room 105. Bring a notebook.',
    chinese: '会议星期一上午九点开始。在 105 室集合。带一本笔记本。',
    dialogue: [
      { speaker: '时间 · starts at / on', english: 'The meeting starts at 9 a.m. on Monday.', chinese: '星期一上午九点开始。' },
      { speaker: '地点 · Meet in', english: 'Meet in Room 105.', chinese: '在 105 室集合。' },
      { speaker: '自带物品 · Bring', english: 'Bring a notebook.', chinese: '带一本笔记本。' },
    ],
    teaching: ['把前三课的短语拿回来用：starts at 后找几点，Meet in 后找地点，Bring 后找要带的东西。', '这张通知的物品换成 notebook 也不用学新规则。先想自己需要哪条信息，再找对应短语。三条信息不一定按同样的顺序出现。'], next: '跟着整理一次',
  },
  build: {
    title: '跟着整理一张通知', prompt: '这次地点写在最前面。找齐三条信息。',
    dialogueLines: ['Meet in the library.', 'The meeting starts at 3 p.m. on Friday.', 'Bring a pencil.'],
    guide: 'Meet in → 图书馆；starts at 3 p.m. on Friday → 星期五下午三点；Bring → 铅笔。',
    options: [{ id: 'correct', label: '星期五下午三点 · 图书馆 · 带铅笔' }, { id: 'am', label: '星期五上午三点 · 图书馆 · 带铅笔', hint: 'p.m. 表示这里是下午，再核对时间。' }],
    answer: 'correct', success: '三条信息都对上了。', next: '下一步：自己读通知', backLabel: '回看讲解',
  },
  transfer: {
    title: '自己读一张新通知', prompt: '选一组和通知完全对得上的信息。',
    dialogueLines: ['Bring a pen. The school will lend you a notebook.', 'The meeting starts at 4 p.m. on Monday.', 'Meet in Room 203.'],
    glossary: [['pen', '笔'], ['notebook', '笔记本'], ['meeting', '会议']],
    options: [
      { id: 'borrow', label: '星期一下午四点 · 203 室 · 带笔记本', hint: '时间和地点对了。笔记本是学校 lend you（借给你）的。' },
      { id: 'correct', label: '星期一下午四点 · 203 室 · 带笔' },
      { id: 'place', label: '星期一下午四点 · 图书馆 · 带笔', hint: '再核对 Meet in 后面的地点。这次有房间号。' },
      { id: 'time', label: '星期一上午四点 · 203 室 · 带笔', hint: '地点和物品对了。时间写的是 p.m.，这里是下午四点。' },
    ],
    answer: 'correct', success: '你找齐了：星期一下午四点，在 203 室，自己带笔。',
  },
  done: {
    title: '你读完了一张校园通知', subtitle: '不用逐词翻译，也能从通知里找到要用的信息。',
    english: 'starts at · Meet in · Bring', practice: '这三个线索分别帮你找时间、地点、要带的东西。',
    audio: 'The meeting starts at four p.m. Meet in Room 203. Bring a pen.',
  },
}, teachingLesson({
  id: 'sentence-core', number: '第八课', title: '读一句：谁做了什么', goal: '从短句里找做事的人和做的事。',
  example: 'Mei reads a book.', chinese: 'Mei 读一本书。', terms: [['Mei', '人名'], ['reads', '读'], ['a book', '一本书'], ['writes a note', '写便条'], ['borrows a book', '借一本书'], ['school library', '学校图书馆']],
  rule: '先找是谁，再找动作。Mei 是做事的人，reads 是动作，a book 是读的东西。与其逐个词猜，不如按这三块一起看。动作也可以换：reads a book 是读书，borrows a book 是借书。',
  guided: 'Bo reads a book.', walkthrough: '先看到人名 Bo，再看到 reads a book，所以读书的人是 Bo。', guidedAnswers: [['Bo 读书'], ['书在读 Bo', 'book 是读的对象；做事的人是开头的 Bo。']],
  checkPrompt: '是谁做了什么？', independent: 'Mei borrows a book from the school library.', transferGlossary: [['from', '从……']],
  answers: [['Mei 在图书馆读书', 'borrows 是借，不是 reads（读）。'], ['Mei 从学校图书馆借书'], ['Bo 从学校图书馆借书', '这次句子开头的人名是 Mei。']],
  recap: '先找人（Mei），再找动作和对象（borrows a book），最后读书从哪里来（from the school library）。',
}), teachingLesson({
  id: 'be-state', number: '第九课', title: '读一句：描述一个状态', goal: '分清谁怎么样，不把 is 或 are 硬译成「是」。',
  example: 'The room is quiet.', chinese: '这个房间很安静。', terms: [['the room', '这个房间'], ['quiet', '安静的'], ['open', '这里表示开放；开着的'], ['closed', '这里表示不开放；关着的'], ['the doors', '这些门'], ['computer lab', '计算机教室；机房'], ['school library', '学校图书馆'], ['classroom', '教室']],
  rule: 'is 和 are 能把前面的人或东西和后面的状态连起来。这里 room 是一个房间，配 is；doors 是多扇门，配 are。',
  guided: 'The room is open.', walkthrough: 'room 是房间，open 是开着。is 把房间和它的状态连起来。', guidedAnswers: [['房间开着'], ['房间很安静', 'quiet 才是安静；这一句用的是 open。']],
  independent: ['The doors are open.', 'The computer lab is closed.'], checkPrompt: '机房现在是什么状态？',
  answers: [['机房开放', 'open 描述的是门。机房那句用了 closed。'], ['机房不开放'], ['机房很安静', '机房那句用的是 closed，不是 quiet。']],
  recap: '先找题目问的对象，再读同一句里 is / are 后面的状态。不要把门的状态套到机房。',
}), teachingLesson({
  id: 'time-verbs', number: '第十课', title: '看时间，分清平时和过去', goal: '用时间词读懂动作发生在平时还是过去。',
  example: 'I play basketball every day. I played basketball yesterday.', chinese: '我每天打篮球。我昨天打了篮球。', terms: [['play basketball', '打篮球'], ['every day', '每天'], ['yesterday', '昨天'], ['after class', '下课后'], ['study / studied', '学习／学习了'], ['classroom', '教室'], ['school library', '学校图书馆']],
  rule: 'every day 常说习惯；yesterday 明确在过去。play 变成 played 是这类动词的一种过去式变化，不是所有动词都加 -ed。',
  guided: 'I played basketball yesterday.', walkthrough: '先看到 yesterday，再核对 played。两处都指向过去。', guidedAnswers: [['昨天打了篮球'], ['每天都打篮球', '这一句是 yesterday，不是 every day。']],
  independent: ['I study in the classroom every day.', 'Yesterday, I studied in the school library.'], checkPrompt: '说话的人昨天在哪里学习？',
  answers: [['在教室', '教室跟着 every day，是平时的地点。'], ['在学校图书馆']],
  recap: '先按题目找 Yesterday，再从同一句读出地点。every day 说平时，不能拿那句回答昨天的事。',
}), teachingLesson({
  id: 'noun-count', number: '第十一课', title: '从 one、two 看单复数', goal: '从数字和词尾分清一件东西、几件东西。',
  example: 'I have one pen and two notebooks.', chinese: '我有一支笔和两本笔记本。', terms: [['have', '有'], ['one / two / three', '一／二／三'], ['pen', '笔'], ['notebook', '笔记本'], ['pencil', '铅笔'], ['lend you', '借给你'], ['a pen', '一支笔']],
  rule: 'one pen 和 a pen 都是一支笔；two notebooks 是两本笔记本，notebooks 末尾多了 s。用 and（和）分开两样，分别读「几个＋什么」。问自己带什么，就看 Bring 那句；lend you 那句说的是学校借给你的。',
  guided: ['The school will lend you two pencils.', 'Bring a pen and three notebooks.'],
  walkthrough: '要自己带哪两样？第一句的 lend you 表示学校借你两支铅笔，不算自带。看第二句的 Bring，把 and 两边分开：a pen 是一支笔，three notebooks 是三本笔记本。',
  guidedAnswers: [['一支笔和三本笔记本'], ['三支笔和一本笔记本', 'a 跟 pen，three 跟 notebooks。别把两个数量对调。'],
    ['两支铅笔和三本笔记本', '铅笔在 lend you 那句，是学校借给你的。只数 Bring 那句的两样东西。']],
  checkPrompt: '要自己带几支铅笔、几本笔记本？', independent: ['Bring two pencils and one notebook.', 'The school will lend you three pens.'], transferGlossary: [['the school', '学校']],
  answers: [['两本笔记本和一支铅笔', 'two 跟 pencils，one 跟 notebook。'], ['两支铅笔和一本笔记本'], ['三支笔和一本笔记本', '三支笔是学校借给你的，不是要自带的。']],
  recap: '先用 Bring 找到要自带的东西，再从左到右把每个数字跟物品配起来。',
}), teachingLesson({
  id: 'reference-basics', number: '第十二课', title: '读懂 it 指的是什么', goal: '遇到 it，回前一句找它指的东西。',
  example: 'I have a notebook. It is red.', chinese: '我有一本笔记本。它是红色的。', terms: [['it', '它，这里代替前面一个东西'], ['red', '红色的'], ['blue', '蓝色的'], ['bag', '包'], ['page', '页'], ['school library', '学校图书馆']],
  rule: '两句都在说同一个东西时，后一句可以用 it。前面有不止一个名词时，别只选离 it 最近的。先读 it 后面的描述，再把可能的东西换回去，看看哪一个接得通。',
  extraExample: {
    title: '前面有两个东西，把它们轮流换回去',
    lines: [['I have a notebook and a pen.', '我有一本笔记本和一支笔。前一句里有两样东西。'],
      ['It has 50 pages.', '它有 50 页。把「笔」换进去不通，换成「笔记本」就通了。虽然笔写在最后，It 指的还是笔记本。']],
  },
  guided: ['I put my bag on a chair.', 'It is full of books.'], walkthrough: '第一句说我把包放在椅子上。第二句说 It is full of books（装满了书）。把包和椅子分别换进去：能装书的是包，不是椅子。', guidedAnswers: [['包'], ['椅子', '椅子用来放包，不是装书的东西。']],
  checkPrompt: '第二句的 It 指什么？', independent: ['I borrowed a book from the school library.', 'It has 20 pages.'], transferGlossary: [['borrowed', '借了']],
  answers: [['学校图书馆', '图书馆虽然离 It 更近，但有 20 页的是书。'], ['书'], ['我', 'I 是说话的人。has 20 pages 描述的是书。']],
  recap: '把书和图书馆分别换回去读。能说「这本书有 20 页」，不能说「学校图书馆有 20 页」。',
}), teachingLesson({
  id: 'request-reply', number: '第十三课', title: '看懂请求，接对一句', goal: '先认出对方在请求帮忙，再用下一句核对回应。',
  example: 'Could you help me? — Of course. I have time.', chinese: '你能帮我吗？——当然可以。我有时间。',
  terms: [['Could you …?', '你能……吗？这里是礼貌请求'], ['Of course.', '当然可以。'], ['Sorry, I can’t.', '抱歉，我做不到。'], ['help me', '帮我'], ['open the door', '开门'], ['have time', '有时间'], ['busy', '忙']],
  rule: '看 Could you 开头，先判断是请求。再看后一句是否同意：I have time 表示有空，I’m busy 表示忙。',
  guided: ['Could you open the door?', '____ I have time.'], walkthrough: '有人请你开门；后一句说你有时间。选能和「有时间」配起来的答复。',
  guidedAnswers: [['Of course.'], ['Sorry, I can’t.', '这里有空，句子没有给出拒绝的理由。']],
  independent: ['Could you help me?', '____ I’m busy now.'], answers: [['Of course.', '后面说现在忙。选礼貌拒绝。'], ['Sorry, I can’t.']],
  recap: '同样是请求，后面的线索不同，回应也会变。',
}), teachingLesson({
  id: 'conversation-purpose', number: '第十四课', title: '看清对方在说什么', goal: '分清确认、好消息、建议和担心，别只选眼熟的套话。',
  example: 'I passed the test! — Glad to hear that.', chinese: '我通过考试了！——真为你高兴。',
  terms: [['I passed the test!', '我通过考试了！是好消息'], ['Glad to hear that.', '真为你高兴。回应好消息'], ['Yes, that’s the one.', '对，就是那个。用于确认'], ['I agree.', '我同意。用于回应观点或建议'], ['Don’t worry.', '别担心。用来安慰'], ['nervous', '紧张的'], ['speak in class', '在课上发言'], ['Is this your pen?', '这是你的笔吗？'], ['We should go now.', '我们该走了。']],
  rule: '先读前一句在做什么：Is this… 是请你确认，We should… 是给建议，I’m nervous 是在说担心。礼貌的话也要用在对的场合。',
  guided: 'Is this your pen? — ____', walkthrough: '对方不是在报道好消息，而是在问是不是这支笔。用确认的答复。',
  guidedAnswers: [['Yes, that’s the one.'], ['Glad to hear that.', '没人分享好消息，这是在确认物品。']],
  independent: 'I’m nervous about speaking in class. — ____', answers: [['I agree.', '对方没有提出建议，是在说自己紧张。'], ['Don’t worry.'], ['Yes, that’s the one.', '对方没有问是不是某一件物品。']],
  recap: 'nervous 是紧张；遇到担心，用 Don’t worry 安慰。',
}), teachingLesson({
  id: 'context-actions', number: '第十五课', title: '在句子里猜词义', goal: '看目标词后面跟着什么，不把一个中文义硬套进每句。',
  example: 'Please open the door. The door is open.', chinese: '请开门。门开着。',
  terms: [['open the door', '开门，open 是动作'], ['is open', '开着，open 是状态'], ['the shop', '这家店'], ['the window', '窗户'], ['at nine', '在九点']],
  rule: 'open 后面直接跟 the door 时是在做动作；放在 is 后面时可以描述状态。看它在句中的位置和对象。',
  guided: 'The window is open.', walkthrough: 'open 前面有 is，话在描述窗户现在怎么样，不是在叫人开窗。',
  guidedAnswers: [['窗户开着'], ['请开窗', 'is open 是状态，不是命令。']],
  independent: 'Please open the window.', answers: [['窗户开着', '这里没有 is，Please 提示请求做事。'], ['请开窗']],
  recap: '看词周围的线索；同一个 open 可以是动作，也可以是状态。',
}), teachingLesson({
  id: 'context-cloze', number: '第十六课', title: '完形：先读前后，再填空', goal: '用两件事的关系选连接词，不只看空格旁边。',
  example: 'It rained, but we still played. We played inside because it rained.', chinese: '下雨了，但我们还是玩了。因为下雨，我们在室内玩。',
  terms: [['but', '但是，前后有转折'], ['because', '因为，后面接原因'], ['still', '仍然'], ['inside', '在室内'], ['rained', '下雨了'], ['cold', '冷的'], ['went outside', '去了外面'], ['stayed inside', '留在室内']],
  rule: '先用中文读通两边：是「因为……所以……」，还是「虽然……但是……」？把选择放回去再读。',
  guided: 'We stayed inside ____ it rained.', walkthrough: '留下是结果，下雨是原因；because 后面正好是原因。',
  guidedAnswers: [['because'], ['but', '下雨让人留在室内，这里不是转折。']],
  independent: 'It was cold, ____ we still went outside.', answers: [['because', '不是因为去外面所以天气冷。still 提示前后转折。'], ['but']],
  recap: '很冷却还是出门：用 but 连起来。',
}), teachingLesson({
  id: 'reading-main-idea', number: '第十七课', title: '阅读：从细节找到整段意思', goal: '找一句能概括开头和结尾的意思，不选只讲一个细节的句子。',
  example: 'Bo was afraid to talk in class. He practised with a friend. Later, he spoke to the whole class.', chinese: 'Bo 不敢在课上说话。他和朋友一起练。后来他能对全班说了。',
  terms: [['was afraid to talk', '不敢说话'], ['practised', '练习了'], ['later', '后来'], ['the whole class', '全班'], ['could not swim', '不会游泳'], ['learned to swim', '学会了游泳'], ['every week', '每周']],
  rule: '故事可以按「一开始怎样 → 做了什么 → 后来怎样」读。概括要覆盖变化，不只挑一个在文里出现的词。',
  guided: 'Bo was afraid to talk in class. He practised with a friend. Later, he spoke to the whole class.', walkthrough: '开头害怕，后来敢面对全班。中间的练习解释了变化。',
  guidedAnswers: [['Bo 从不敢说到敢说'], ['Bo 有一位朋友', '朋友只是帮忙的细节，没概括开头和结尾的变化。']],
  independent: ['Mei could not swim.', 'She practised every week. Later, she learned to swim.'], answers: [['Mei 从不会游泳到练会了'], ['Mei 每周去上英语课', '短文说的是 swim（游泳），没有提英语课。'], ['Mei 一直不会游泳', 'Later 后面说她学会了。']],
  recap: '把「原来不会」和「练习后学会」连起来，别只盯一个时间词。',
}), teachingLesson({
  id: 'reading-inference', number: '第十八课', title: '阅读：推断要有原文撑着', goal: '把前后两条信息连起来，只选原文能支持的判断。',
  example: 'The meeting starts at 4 p.m. Bo arrives at 4:10 p.m.', chinese: '会议下午四点开始。Bo 下午四点十分到。',
  terms: [['starts at', '在某时开始'], ['arrives at', '在某时到'], ['late', '迟到的'], ['a.m.', '上午'], ['p.m.', '下午／晚上']],
  rule: '有时候原文不直接说 late。要把开始时间和到达时间比一比，较晚到才支持「迟到」。不知道的原因不要自己加。',
  guided: 'The meeting starts at 4 p.m. Bo arrives at 4:10 p.m.', walkthrough: '4:10 晚于 4:00，支持 Bo 迟到；原文没有交代他为什么晚到。',
  guidedAnswers: [['Bo 迟到了'], ['Bo 因为下雨迟到', '原文只支持迟到，没有提到下雨。']],
  independent: ['The meeting starts at 9 a.m.', 'Mei arrives at 8:50 a.m.'], answers: [['Mei 已经迟到了', '8:50 比 9:00 早。'], ['Mei 在会议开始前到了'], ['会议推迟了', '文中给了开始时间，没有改期信息。']],
  recap: '推断可以换一种说法，但每一步都要能回到原文。',
}), teachingLesson({
  id: 'link-a-sentence', number: '第十九课', title: '选句：让整句话接得上', goal: '找空格后面的代词，再检查空格前后是否连贯。',
  example: 'Mei has a bag. It is blue.', chinese: 'Mei 有一个包。它是蓝色的。',
  terms: [['it', '它，这里指刚提到的一件东西'], ['bag', '包'], ['pen', '笔'], ['red', '红色的'], ['blue', '蓝色的'], ['I need a pen.', '我需要一支笔。'], ['Bo gives me a pen.', 'Bo 给我一支笔。'], ['I can now write my name.', '我现在能写自己的名字了。']],
  rule: '选句不是只对一个词。先看空格前发生了什么，再看后面的 it 或 now 有没有接住前面的信息。放回短文，前后都读一遍。',
  guided: 'Mei has a bag. ____', walkthrough: '上一句只提到包。接「它是蓝色的」，it 有明确指向。',
  guidedAnswers: [['It is blue.'], ['I need a pen.', '这句突然换了人和物品，没有接上前面的包。']],
  independent: ['I need a pen. ____', 'I can now write my name.'], answers: [['The room is blue.', '房间的颜色解释不了为什么现在能写字。'], ['Bo gives me a pen.'], ['It rained yesterday.', '昨天的天气和能不能写字没有衔接。']],
  recap: '前面缺笔，后面能写字；「有人给我笔」把两边接起来了。',
}), teachingLesson({
  id: 'action-now', number: '第二十课', title: '现在正在做：be + ing', goal: '用 now 和 be + ing 辨认正在发生的动作。',
  example: 'Mei reads every day. Mei is reading now.', chinese: 'Mei 每天读书。Mei 现在正在读书。',
  terms: [['now', '现在'], ['every day', '每天'], ['reading', '读'], ['writing a note', '写便条']],
  rule: '说平时习惯可以用 reads；说现在正在做，用 be（am、is 或 are）加 -ing。Mei 是一个人，用 is。',
  guided: 'Mei is reading now.', walkthrough: 'now 是现在；is reading 合起来表示正在读。',
  guidedAnswers: [['Mei 现在正在读书'], ['Mei 昨天读了书', '这里是 now，不是 yesterday。']],
  independent: 'Bo is writing a note now.', checkPrompt: 'Bo 现在在做什么？',
  answers: [['Bo 每天读书', 'writing a note 是写便条；now 是现在。'], ['Bo 正在写便条']],
  recap: '不要漏掉 be：Bo is writing 表示 Bo 正在写。',
}), teachingLesson({
  id: 'past-form', number: '第二十一课', title: '动词的过去式不都加 -ed', goal: '先找时间线索，再决定动词用哪种过去式。',
  example: 'I play after class. Yesterday, I played after class. Yesterday, I went home at five.',
  chinese: '我下课后玩。昨天我下课后玩了。昨天我五点回家了。',
  terms: [['play → played', '玩 → 玩了'], ['go → went', '去 → 去了'], ['go home', '回家'], ['at five', '在五点']],
  rule: 'yesterday 表示过去。play 的过去式是 played，但 go 的过去式是 went。碰到没学过的变化，先对照词形表，不靠猜拼写。',
  guided: 'Yesterday, I ____ (play) after class.', walkthrough: '看到 Yesterday，这里需要过去式；刚学过 play 变 played。',
  guidedAnswers: [['played'], ['play', 'Yesterday 指已经发生的动作。']],
  independent: 'Yesterday, I ____ (go) home at five.', checkPrompt: '哪种词形能放进昨天发生的句子？',
  answers: [['go', 'go 是原形。这里说昨天。'], ['goed', 'go 是不规则动词，不直接加 -ed。'], ['went']],
  recap: '过去时间决定要找过去式；go 的过去式是 went。',
}), teachingLesson({
  id: 'one-with-article', number: '第二十二课', title: '用 a / an 说一个', goal: '选 a 还是 an，听后面词开头的音。',
  example: 'I have a pen and an apple.', chinese: '我有一支笔和一个苹果。',
  terms: [['a pen', '一支笔，pen 开头是辅音'], ['an apple', '一个苹果，apple 开头是元音'], ['egg', '鸡蛋，开头是元音'], ['bag', '包，开头是辅音']],
  rule: '第一次提到一个可数物品，可以用 a 或 an。看紧跟在后面的词开头是什么音。现在只练 pen、apple、egg 和 bag。',
  guided: 'I have ____ bag.', walkthrough: 'bag 的 b 是辅音开头，选 a。', guidedAnswers: [['a'], ['an', 'an 用在元音开头的词之前。']],
  independent: 'I have ____ egg.', checkPrompt: '鸡蛋前面用 a 还是 an？', answers: [['a', 'egg 开头是元音。'], ['an']],
  recap: 'a bag；an egg。a / an 都可以表示一个。',
}), teachingLesson({
  id: 'adjective-adverb', number: '第二十三课', title: '描述东西，还是描述怎么做', goal: '从位置看这里需要形容词还是副词。',
  example: 'Mei is careful. Mei writes carefully.', chinese: 'Mei 很仔细。Mei 写得很仔细。',
  terms: [['careful', '仔细的'], ['carefully', '仔细地'], ['writes', '写'], ['reads', '读']],
  rule: '说 Mei 怎么样，用 is careful。说她怎么写，用 writes carefully。这里是从 careful 变 carefully，不是所有副词都加 -ly。',
  guided: 'Bo is ____. (careful)', walkthrough: 'is 后在说 Bo 本人怎么样，所以用 careful。',
  guidedAnswers: [['careful'], ['carefully', '这是描述人，不是在说动作怎么做。']],
  independent: 'Bo reads ____. (careful)', checkPrompt: '这里要说明 Bo 怎么读，选哪个？', answers: [['careful', '试着问「读得怎么样」，找表示动作方式的词。'], ['carefully']],
  recap: 'is careful 描述人；reads carefully 描述读的方式。',
}), teachingLesson({
  id: 'embedded-question', number: '第二十四课', title: '把一个问题接在 tell me 后', goal: '在 tell me 后按「疑问词＋谁／什么＋动作」补句。',
  example: 'When does the meeting start? Please tell me when the meeting starts.',
  chinese: '会议什么时候开始？请告诉我会议什么时候开始。',
  terms: [['when', '什么时候'], ['tell me', '告诉我'], ['the meeting starts', '会议开始'], ['where', '在哪里'], ['the library is', '图书馆在……']],
  rule: '前一句是自己直接问；接到 tell me 后，when 不变，先说 the meeting，再说 starts，不把 does 整段搬进去。',
  guided: 'Please tell me ____.（会议什么时候开始）', walkthrough: '先放 when，再按「会议＋开始」排成 the meeting starts。',
  guidedAnswers: [['when the meeting starts'], ['when does the meeting start', '这是直接问句的顺序。']],
  independent: 'Please tell me ____.（图书馆在哪里）', checkPrompt: '选能放进 tell me 后面的部分。',
  answers: [['where is the library', '直接问才把 is 放在 the library 前面。'], ['where the library is']],
  recap: '接到 tell me 后：where + the library + is。',
}), teachingLesson({
  id: 'link-a-list', number: '第二十五课', title: '把几件事列在一起', goal: '看出一连串并列动作，找到最后一项前的 and。',
  example: 'After class, I read, write and draw.', chinese: '下课后，我读书、写字和画画。',
  terms: [['after class', '下课后'], ['read / write / draw', '读／写／画'], ['and', '和，也连接并列动作'], ['because', '因为'], ['but', '但是']],
  rule: '三件事都是同一个人做，read、write、draw 并列。英语常在最后一项前放 and。先分清是列举，还是解释原因或表示转折。',
  guided: 'I read, draw ____ write.', walkthrough: 'read、draw、write 都是我做的事，没有因果或转折，最后一项前用 and。',
  guidedAnswers: [['and'], ['because', 'write 不是前面两件事的原因。']],
  independent: 'After class, I draw, write ____ read.', checkPrompt: '空格是连接清单的最后一项。该选哪个？',
  answers: [['but', '这里没有「画、写，却还读」的转折。'], ['and'], ['because', '这里是在列举，不是给理由。']],
  recap: '三个动作并列时，常用逗号分开，最后一项前加 and。',
}), teachingLesson({
  id: 'time-duration', number: '第二十六课', title: '分清几点和多久', goal: '具体时刻用 at，持续多久用 for。',
  example: 'I read at two. I read for one hour.', chinese: '我在两点读书。我读了一个小时。',
  terms: [['at two', '在两点'], ['for one hour', '持续一个小时'], ['ten minutes', '十分钟'], ['at three', '在三点']],
  rule: '「几点」是时间上的一个点，用 at。「读了多久」是一段时间，用 for。看到数字，不要急着选介词，先判断是哪种时间。',
  guided: 'I read ____ one hour.', walkthrough: '一个小时不是钟上的几点，表示长度，所以用 for。',
  guidedAnswers: [['for'], ['at', 'at 能接具体时刻，不接这里表示长度的 one hour。']],
  independent: 'I read ____ three. I read for ten minutes.', checkPrompt: '第一空表达「在三点」，填哪个？',
  answers: [['for', 'for ten minutes 才是持续多久。'], ['at']],
  recap: 'at three 是三点；for ten minutes 是十分钟。',
}), teachingLesson({
  id: 'own-things', number: '第二十七课', title: '说清是谁自己的', goal: '用 my、her、his + own 表示某人自己的东西。',
  example: 'Mei makes a poster of her own.', chinese: 'Mei 做了一张她自己的海报。',
  terms: [['make a poster', '做海报'], ['of her own', '她自己的'], ['of his own', '他自己的'], ['of my own', '我自己的'], ['she / he', '她／他']],
  rule: 'she 是「她」，her own 才能在这里表示「她自己的」。表示归属要看是谁：I → my，she → her，he → his。',
  guided: 'I make a poster of ____ own.', walkthrough: '句子开头是 I，是我做自己的海报，所以选 my。',
  guidedAnswers: [['my'], ['I', 'I 表示「我」，这里缺「我的」。']],
  independent: 'Bo makes a poster of ____ own.', checkPrompt: 'Bo 是男生，这里说他自己的海报。',
  answers: [['her', 'her own 指她自己的。'], ['he', 'he 是「他」，这里要表达归属。'], ['his']],
  recap: 'of his own 表示「他自己的」。不要把 he 或 she 直接塞在 own 前面。',
}), teachingLesson({
  id: 'after-ing', number: '第二十八课', title: '介词后写动作：用 -ing', goal: '在 after 或 before 后只接动作时，识别要用 -ing。',
  example: 'After reading, I write a note.', chinese: '读完后，我写一张便条。',
  terms: [['after reading', '读完后'], ['before drawing', '画之前'], ['read → reading', '读'], ['draw → drawing', '画']],
  rule: 'after 或 before 当介词、后面直接接一个动作时，这里写 -ing：after reading。也可以写 after I read，但那是有主语的另一种结构。',
  guided: 'After ____ (read), I draw.', walkthrough: '空格前是 after，后面没放新的主语，直接说「读完之后」，所以是 reading。',
  guidedAnswers: [['reading'], ['read', '不是 after I read；这里只有一个动作形式。']],
  independent: 'Before ____ (draw), I read a note.', checkPrompt: '空格里只有 draw 的一种形式，选哪种？',
  answers: [['draw', '这里不是 before I draw，before 直接接动作。'], ['drawing']],
  recap: 'before drawing 和 after reading 一样：介词后面直接写动作时用 -ing。',
}), teachingLesson({
  id: 'past-in-progress', number: '第二十九课', title: '过去那一刻，正在做什么', goal: '分清过去正在做的事和中途发生的一件事。',
  example: 'I was reading when the phone rang.', chinese: '电话响时，我正在看书。',
  terms: [['was reading', '（过去那时）正在看书'], ['when', '当……时'], ['the phone rang', '电话响了'], ['were drawing', '（过去那时）正在画画'], ['the bell rang', '铃响了']],
  rule: '现在正在做可以说 am / is / are + -ing。说过去那一刻正在做，用 was / were + -ing。句子里，铃响或电话响是用来确定那一刻的事件。',
  guided: 'I was reading when the phone rang.', walkthrough: '先找响起来的那一刻：the phone rang。再回去看那时我在做什么：was reading。',
  guidedAnswers: [['电话响时我正在看书'], ['看完书之后电话才响', 'was reading 表示那时还在看。']],
  independent: 'We were drawing when the bell rang.', checkPrompt: '铃响时，我们在做什么？',
  answers: [['已经画完了', 'were drawing 表示当时还在画。'], ['正在画画']],
  recap: '先找过去的时点，再用 was / were + -ing 读那时正在做的事。',
}), teachingLesson({
  id: 'enough-to', number: '第三十课', title: '用 enough to 说足够做到', goal: '认出「足够……，可以做……」的顺序。',
  example: 'The room is quiet enough to read in.', chinese: '这个房间够安静，可以在里面读书。',
  terms: [['quiet enough', '足够安静'], ['old enough', '年龄够大'], ['to read', '去读，这里接动作'], ['join the club', '加入社团']],
  rule: '这里的顺序是「形容词 + enough + to + 动词原形」。quiet 描述安静，enough 表示够，to read 说明够安静之后能做什么。',
  guided: 'The room is quiet enough ____ (read) in.', walkthrough: '够安静，能读书。enough 后用 to read，不用 reading。',
  guidedAnswers: [['to read'], ['reading', '这里已经有 enough，接 to + 原形。']],
  independent: 'Mei is old enough ____ the club.', checkPrompt: '选能表示「年龄够大，可以加入社团」的部分。',
  answers: [['joining', 'enough 后面不接这里的 -ing。'], ['to join']],
  recap: 'old enough to join：形容词 + enough + to + 原形。',
}), teachingLesson({
  id: 'advice-pride', number: '第三十一课', title: '给建议和说感受：看句型后面接什么', goal: '分清 had better + 动作和 be proud of + 人或事。',
  example: 'You had better read the notice. I am proud of our class.', chinese: '你最好看一下通知。我为我们班感到自豪。',
  terms: [['had better', '最好，给建议'], ['read the notice', '看通知'], ['be proud of', '为……感到自豪'], ['our class', '我们班'], ['our team', '我们的队伍']],
  rule: 'had better 后直接接动词原形，比如 read。be proud of 后可以接人或事，比如 our class；I 后用 am。',
  guided: 'You had better ____ the notice.', walkthrough: '这是建议。had better 后直接写 read，不加 to。',
  guidedAnswers: [['read'], ['to read', 'had better 后直接用动词原形。']],
  independent: 'I am ____ our team.', checkPrompt: '选能表示「我为我们的队伍感到自豪」的部分。',
  answers: [['proud', '后面接我们的队伍，中间还需要 of。'], ['proud of']],
  recap: '给建议：had better + 动作。说为谁自豪：be proud of + 人或事。',
}), teachingLesson({
  id: 'phrases-in-context', number: '第三十二课', title: '翻译画线词组：几个词一起看', goal: '把画线词组当成一个意思，再回句子核对。',
  example: 'Bo looks for his pen. He finds it in his bag.', chinese: 'Bo 在找他的笔。他在包里找到了。',
  terms: [['looks for', '寻找'], ['finds', '找到了，这里用来核对前句'], ['his pen', '他的笔'], ['bag', '包'], ['puts on', '穿上'], ['coat', '外套'], ['cold', '冷的']],
  rule: '只看 look 容易想到「看」，但 look for 要放在一起读成「寻找」。第二句的 finds（找到）也说明前一句正在找东西。',
  guided: 'Bo looks for his pen. He finds it in his bag.', walkthrough: '先把 looks for 圈作一块，再读后面的 finds。先找、后找到，两个动作能接上。',
  guidedAnswers: [['寻找'], ['盯着看', '这句话不只是看；后一句说他找到了笔。']],
  independent: 'It is cold. Mei puts on her coat.', checkPrompt: 'puts on 在这里是什么意思？',
  answers: [['把外套放在桌上', '前面说冷，后面说外套，也没有提到桌子。'], ['穿上外套'], ['寻找外套', '找东西可用 look for，这里用了 puts on。']],
  recap: 'puts on 和 coat 放在一起、再看前面的 cold：她穿上外套。',
}), teachingLesson({
  id: 'email-plan', number: '第三十三课', title: '写邮件前，先找题目要你说什么', goal: '认出收件人、主题和必须交代的内容，再写英语。',
  example: 'Dear Bo,\nMy favorite school event is Sports Day. We run and play games. I like it because we work together.\nBest wishes,\nMei',
  chinese: '写给 Bo。正文依次说：喜欢运动会、参加哪些活动、为什么喜欢。署名用虚构名字。',
  terms: [['Dear Bo,', '称呼，不是正文'], ['My favorite … is …', '我最喜欢的……是……'], ['I like it because …', '我喜欢它，因为……'], ['Best wishes,', '结束问候，不是正文']],
  rule: '打开题干先找写给谁、写什么、要交代哪几点。例子给了主题、做法、原因三个句子作为提纲，不是要求背这封信。之后按实际题干把正文展开到所需篇幅。',
  guidedLanguage: 'zh-CN', independentLanguage: 'zh-CN',
  guided: ['题目：给 Bo 写邮件，说你喜欢的校园活动、在活动里做什么、为什么喜欢。'],
  walkthrough: '收件人是 Bo。「活动／做什么／原因」都要写；不用额外编老师的姓名或联系方式。',
  guidedAnswers: [['活动名称、做法和原因'], ['只写原因', '还没说是什么活动，也没说怎么参加。']],
  independent: ['新题目：写给 Alex，介绍一个你喜欢的节日，说明为什么喜欢它。'], checkPrompt: '哪个提纲把新题目的必写内容都圈出来了？',
  answers: [['写给 Bo，只写节日名称', '收件人换成了 Alex，而且原因不能漏。'], ['写给 Alex，介绍节日，再说为什么喜欢'], ['写给 Alex，只列日期和地点', '题目要介绍节日并说明喜欢的原因。']],
  recap: '先照新题目列要点，再组织正文。称呼和落款不算正文，不写自己的真实信息。',
}), teachingLesson({
  id: 'reading-question-words', number: '第三十四课', title: '读题先看在问什么', goal: '用 When、Where、What 判断该找时间、地点还是东西。',
  example: 'When does the meeting start? Where do we meet? What should we bring?',
  chinese: '会议几点开始？我们在哪儿集合？我们该带什么？',
  terms: [['When', '什么时候'], ['Where', '在哪里'], ['What', '什么'], ['should we bring', '我们该带']],
  rule: '先看问词，再看后半句限制了什么。When 让你找时间，Where 让你找地点；What should we bring 才问要带的东西。',
  guided: ['Where do we meet?', 'The meeting starts at 4 p.m. Meet in Room 203.'],
  walkthrough: 'Where 问在哪里，回到 Meet in 这一句，不选 4 p.m.。',
  guidedAnswers: [['203 室'], ['下午四点', '这是时间，回答的是 When。']],
  independent: ['What should we bring?', 'Meet in the library. Bring a pencil.'], checkPrompt: '读问题，再选它要找的信息。',
  answers: [['图书馆', '图书馆回答在哪儿。这里问要带什么。'], ['铅笔']],
  recap: '先分清题目问哪一类信息，再回原文定位。',
}), teachingLesson({
  id: 'reading-paraphrase', number: '第三十五课', title: '选项改了说法，意思有没有变', goal: '对照人物、动作和时间，不靠单词长得像选答案。',
  example: 'Mei arrives at 8:50. The meeting starts at 9:00.', chinese: 'Mei 八点五十到，会议九点开始。',
  terms: [['arrives', '到达'], ['before', '在……之前'], ['after', '在……之后'], ['the meeting starts', '会议开始']],
  rule: '原文不一定出现选项里的原词。8:50 比 9:00 早，换句话说就是 Mei 在会议开始前到了。',
  guided: ['Bo arrives at 9:10. The meeting starts at 9:00.'],
  walkthrough: '9:10 比 9:00 晚。说 Bo 在会议开始后到，虽然换了说法，意思还对得上。',
  guidedAnswers: [['Bo arrives after the meeting starts.'], ['Bo arrives before the meeting starts.', 'before 是之前，但 Bo 到得更晚。']],
  independent: ['Lin arrives at 3:00. The meeting starts at 4:00.'], checkPrompt: '哪一句和原通知表达的意思相同？',
  answers: [['Lin arrives after the meeting starts.', '三点比四点早，after 把先后关系反过来了。'], ['Lin arrives before the meeting starts.']],
  recap: '看清是谁、做了什么和先后关系。词变了，事实不能变。',
}), teachingLesson({
  id: 'reading-exceptions', number: '第三十六课', title: '读懂 not 和例外', goal: '看清否定的是哪件事，区分不必做和不能做。',
  example: 'Bring a pen. Do not bring food. You do not need to bring a notebook.',
  chinese: '带笔。不要带食物。不必带笔记本。',
  terms: [['Do not bring', '不要带'], ['do not need to bring', '不必带，不等于禁止带'], ['food', '食物'], ['notebook', '笔记本']],
  rule: '不要看到 not 就认为全都不能。Do not bring food 说的是食物；do not need to bring a notebook 只是说笔记本不是必须的。',
  guided: ['Bring a pen. Do not bring food.'], walkthrough: '笔在肯定的 Bring 后面，食物才在 Do not bring 后面。',
  guidedAnswers: [['带笔，不带食物'], ['笔和食物都不要带', '否定只跟着 food，不影响上一句。']],
  independent: ['Bring a notebook. You do not need to bring a pencil.'], checkPrompt: '下面哪项准确？',
  answers: [['笔记本和铅笔都必须带', 'do not need to 表示后面的铅笔不是必需的。'], ['笔记本要带，铅笔不必带'], ['铅笔禁止带', '题目说不必带，不是禁止带。']],
  recap: '先圈否定作用在哪个动作和物品上，再区分「不必」和「不要」。',
}), teachingLesson({
  id: 'notice-deadline', number: '第三十七课', title: '看懂截止时间：by 不等于 at', goal: '区分活动几点开始和材料最迟几点交。',
  example: 'The meeting starts at 4 p.m. Send your name by 3 p.m.', chinese: '会议下午四点开始。最迟下午三点发来姓名。',
  terms: [['starts at', '在某个时刻开始'], ['send your name', '发来你的姓名'], ['by 3 p.m.', '最迟下午三点，提前也可以'], ['send your email', '发邮件']],
  rule: 'at 把事情放在一个具体时刻；by 在这里给的是最迟时间。读通知时先看是在说活动，还是交材料。',
  guided: 'Send your name by 3 p.m.', walkthrough: 'by 3 p.m. 不是只能三点发；两点就发也符合要求。',
  guidedAnswers: [['下午两点发可以'], ['必须正好下午三点发', 'by 给的是截止时间，不是指定的发送时刻。']],
  independent: ['Send your email by 4 p.m.', 'The meeting starts at 5 p.m.'], checkPrompt: '最迟几点发邮件？',
  answers: [['下午五点', '五点是会议开始时间。'], ['下午四点']], recap: '发邮件看 by 4 p.m.；开会看 starts at 5 p.m.。',
}), teachingLesson({
  id: 'notice-condition', number: '第三十八课', title: '看懂 if：规则对谁生效', goal: '读到 if 时，先看条件，再看满足条件的人要做什么。',
  example: 'If you are new, send your name by Friday.', chinese: '如果你是新成员，最迟星期五发来姓名。',
  terms: [['if', '如果'], ['you are new', '你是新成员'], ['it rains', '下雨'], ['meet inside', '在室内集合'], ['everyone', '所有人']],
  rule: 'if 引出来的是条件。逗号后才说条件成立时怎么做。不要把只对某些人或某种情况的要求当成通用规则。',
  guided: 'If you are new, bring a pen.', walkthrough: '先看 if 后面：你是新成员。对满足这个条件的人，这一句才要求带笔。',
  guidedAnswers: [['新成员要带笔'], ['这句话要求所有人都带笔', '这一句用 if 限定了谁要带。']],
  independent: 'If it rains, meet inside.', checkPrompt: '这条通知什么时候要求在室内集合？',
  answers: [['下雨时'], ['不论天气怎样', 'if it rains 表示只有这里说的下雨情况。']], recap: '先判断 if 条件，再读行动。',
}), teachingLesson({
  id: 'notice-change', number: '第三十九课', title: '通知改了：新时间和旧时间别弄反', goal: '用 now、not 和不变的信息确定实际安排。',
  example: 'We now meet on Friday, not Monday. The room stays the same.', chinese: '现在改为星期五集合，不是星期一。房间不变。',
  terms: [['now', '现在，这里提示更新'], ['not Monday', '不是星期一'], ['stays the same', '保持不变'], ['Room 105 / Room 203', '105 室／203 室']],
  rule: 'now 常提示新安排，not 后的是被取消的旧安排；stays the same 说明那一项不用改。',
  guided: ['We now meet on Friday, not Monday.', 'The room stays the same.'], walkthrough: '更新的是星期，保留的是房间。实际去的是星期五。',
  guidedAnswers: [['星期五集合，房间不变'], ['星期一集合，房间也换了', 'Monday 在 not 后，房间那句明说不变。']],
  independent: ['We now meet in Room 105, not Room 203.', 'The time stays the same.'], checkPrompt: '哪项是更新后的安排？',
  answers: [['203 室，时间不变', '203 在 not 后，是旧房间。'], ['105 室，时间不变']], recap: '分别核对哪项改了、改成什么、哪项不变。',
}), teachingLesson({
  id: 'email-use-details', number: '第四十课', title: '从一句「我喜欢」写到有细节', goal: '不用堆长单词，加一个时间、地点或一起做事的人。',
  example: 'I like basketball. I play with my classmates after class.', chinese: '我喜欢篮球。我下课后和同学一起打球。',
  terms: [['with my classmates', '和同学一起'], ['after class', '下课后'], ['in the library', '在图书馆'], ['on Fridays', '每逢星期五']],
  rule: '第二句要补和主题有关的具体信息。写完 I like basketball，可以说跟谁打、什么时候打，不要把第一句换个词再说一遍。',
  guided: '主题：喜欢篮球。题目还问「平时怎么参加」。', guidedLanguage: 'zh-CN',
  walkthrough: '选一句能真正补出参加方式的话，而不是再说一次喜欢。',
  guidedAnswers: [['I play with my classmates after class.'], ['I like basketball very much.', '还是只说喜欢，没有说怎么参加。']],
  independent: '主题：喜欢读书。题目还问「什么时候、在哪儿读」。', independentLanguage: 'zh-CN', checkPrompt: '哪一句同时写出了时间和地点？',
  answers: [['I like reading.', '只说了喜欢。'], ['I read in the library on Fridays.']], recap: '用短句交代一个有用细节，不靠长句撑字数。',
}), teachingLesson({
  id: 'email-specific-reason', number: '第四十一课', title: '用 because 说清喜欢的原因', goal: '理由要给新信息，不把「喜欢」重复一遍。',
  example: 'I like basketball because I can play with my friends.', chinese: '我喜欢篮球，因为我可以和朋友一起打球。',
  terms: [['because', '因为'], ['play with my friends', '和朋友一起玩'], ['learn new things', '学到新东西'], ['read with my friends', '和朋友一起读书']],
  rule: 'because 之后最好是完整的小句：谁、做什么。理由要回答为什么，而不是换一种说法重复「我很喜欢」。',
  guided: 'I like basketball because ____.', walkthrough: '「能和朋友一起打」给了一个原因；只重复我喜欢篮球，并没有回答为什么。',
  guidedAnswers: [['I can play with my friends'], ['I like basketball', '这只把开头又说了一遍。']],
  independent: 'I like reading because ____.', checkPrompt: '哪一个既是完整的小句，又给了具体原因？',
  answers: [['in the library', '只有地点，没有说谁做什么。'], ['I can learn new things']], recap: '用 because 接一句具体理由。',
}), teachingLesson({
  id: 'email-revise', number: '第四十二课', title: '交邮件前：对题目清点，删掉重复句', goal: '用要点清单检查正文，词数够不等于内容齐。',
  example: 'I like the book club. We meet on Fridays. I like it because I can read with my friends.',
  chinese: '喜欢读书社；星期五见面；喜欢的原因是能和朋友一起读书。',
  terms: [['第一句', '交代活动'], ['第二句', '给参加的细节'], ['第三句', '给具体理由']],
  rule: '把题目的要点和正文一项项对起来。少了理由就补理由，别再补一句喜欢。题目如果要求约 40 词，篇幅要看，给出的要点也要逐项核对。',
  guided: '题目要写活动、参加方式和原因。草稿只写了「喜欢读书社，星期五见面」。', guidedLanguage: 'zh-CN',
  walkthrough: '前两项已经有了，缺的是第三项：为什么喜欢。',
  guidedAnswers: [['补为什么喜欢'], ['再加一句「我真的很喜欢」', '重复喜欢并没有回答为什么。']],
  independent: '题目要写活动、时间、原因。正文写了喜欢篮球、因为能和朋友一起打。', independentLanguage: 'zh-CN', checkPrompt: '现在最该补哪一句？',
  answers: [['I like basketball very much.', '已经说了喜欢，这一句仍然没给时间。'], ['I play basketball after class.']],
  recap: '先查题目要点，再查词形和连贯，不靠重复凑字数。',
}), teachingLesson({
  id: 'cloze-collocations', number: '第四十三课', title: '完形：把空格边上的词连起来读', goal: '用熟悉的搭配缩小范围，再回到句子核对意思。',
  example: 'We made a list of things to bring: water and cups.', chinese: '我们列了一张自带物品清单：水和杯子。',
  terms: [['make a list', '列清单'], ['take a photo', '拍照'], ['take a break', '休息一下'], ['tired', '累了'], ['then', '然后']],
  rule: '先把空格和它旁边的词连起来。make a list 是列清单；take 可以接 photo，也可以接 break。搭配通顺还不够，要看当时发生了什么。',
  guided: ['We made a ____ of things to bring: water and cups.'], walkthrough: '冒号后是一项项列出的物品。make a list 和后面的内容都对得上。',
  guidedAnswers: [['list'], ['photo', '后面直接列出物品，不是在说拍的照片。']],
  independent: ['We were tired. We took a short ____, then went back to work.'], checkPrompt: '累了，过了一会儿又开始工作。“took a short ____” 填什么？',
  answers: [['photo', '拍照不解释为什么说累、后来又恢复工作。'], ['break']], recap: 'take a break 是休息；tired 和 went back to work 说明先停了一会儿。',
}), teachingLesson({
  id: 'cloze-later-clue', number: '第四十四课', title: '完形：答案的线索可能在后面', goal: '空格两边不够判断时，先往后读一句。',
  example: 'Bo went to the library. He opened a book and started to read.', chinese: 'Bo 去了图书馆。他翻开一本书开始读。',
  terms: [['library', '图书馆'], ['gym', '体育馆'], ['book', '书'], ['borrow books', '借书'], ['played basketball', '打了篮球'], ['went to', '去了']],
  rule: '碰到地点或人物空，不必在这一句就定答案。读后面的人做了什么，再回来判断哪个选项最符合。',
  guided: ['Mei went to the ____.', 'She borrowed two books there.'], walkthrough: '第一句只说去了某个地方。后一句说在那里借了两本书，提供了图书馆的线索。',
  guidedAnswers: [['library'], ['gym', '后一句是在借书，不是在体育馆运动。']],
  independent: ['Lin went to the ____.', 'He played basketball there with his class.'], checkPrompt: '后一句支持哪个地点？',
  answers: [['gym'], ['library', 'played basketball 是打篮球，这次体育馆更贴合。']], recap: 'there 指上一句的地方；后面写的活动能帮你判断那个地点。',
}), teachingLesson({
  id: 'cloze-read-back', number: '第四十五课', title: '完形：填完放回全文读一遍', goal: '把选项放回去，检查事情的顺序和结果有没有接上。',
  example: 'It rained, so we stayed inside. We played a game in the classroom.', chinese: '下雨了，所以我们留在室内。我们在教室里玩了个游戏。',
  terms: [['rained', '下雨了'], ['so', '所以，后面接结果'], ['because', '因为，后面接原因'], ['inside / outside', '在室内／在外面'], ['kept playing', '继续玩'], ['classroom', '教室']],
  rule: '放回去读两遍：第一遍看一句话有没有语法问题，第二遍看它和下一句是不是在说同一件事。别只看一个选项单独顺不顺。',
  guided: ['It rained, ____ we stayed inside.', 'We played in the classroom.'], walkthrough: '下雨是原因，留室内是结果。用 so 后，下一句在教室里玩也对得上。',
  guidedAnswers: [['so'], ['because', '这样会变成因为留在室内才下雨，因果反了。']],
  independent: ['We stayed inside ____ it rained.', 'We kept playing in the classroom.'], checkPrompt: '这一回原因放在了后面。回填哪个词，原文才讲得通？',
  answers: [['so', 'so 后面接结果，这里后面是下雨这个原因。'], ['because']], recap: '同样两件事互换顺序，连接词也可能变。回填后再读一遍。',
}), teachingLesson({
  id: 'service-borrow', number: '第四十六课', title: '借东西：先听清能不能借', goal: '认出 Can I borrow…?，分清借用和索要。',
  example: 'Can I borrow a ruler? — Sure. Here you are.', chinese: '能借我一把尺子吗？——可以，给你。',
  terms: [['borrow', '借来使用'], ['ruler', '尺子'], ['Sure.', '可以'], ['Here you are.', '给你'], ['Sorry, I need it now.', '抱歉，我现在要用它']],
  rule: 'Can I borrow…? 是在请求借东西。Sure 是同意；Sorry 后如果说自己还要用，就是拒绝。',
  guided: ['Can I borrow your pen?', 'Sure. Here you are.'], walkthrough: '问的是借笔；Sure 和 Here you are 都说明对方同意。',
  guidedAnswers: [['同意借'], ['拒绝借', 'Sure 是同意，不是拒绝。']],
  independent: ['Can I borrow your ruler?', 'Sorry, I need it now.'], checkPrompt: '这一次对方同意借吗？',
  answers: [['不同意，自己现在要用'], ['同意，已经递过来了', '对方还要用，没有递东西。']], recap: '问句认出 borrow；答句再分同意还是拒绝。',
}), teachingLesson({
  id: 'service-directions', number: '第四十七课', title: '问路：先找地点，再找方向', goal: '用 Where is…? 问位置，读懂 next to、turn left 和 go straight。',
  example: 'Where is the library? — It’s next to the gym.', chinese: '图书馆在哪儿？——在体育馆旁边。',
  terms: [['next to', '紧挨着'], ['gym', '体育馆'], ['turn left', '左转'], ['go straight', '直走'], ['the office', '办公室']],
  rule: '问的地点不会因为答句出现另一个地点就改变。next to 后面的地方是参照点，不是目的地。',
  guided: ['Where is the office?', 'It’s next to the library.'], walkthrough: '问的是办公室，图书馆是参照点。', guidedAnswers: [['办公室在图书馆旁边'], ['要去图书馆', '图书馆只是用来指路。']],
  independent: ['Where is the gym?', 'Go straight, then turn left.'], checkPrompt: '该怎么走？', answers: [['先左转，再直走', 'then 是然后，顺序不能反。'], ['先直走，再左转']], recap: '先确认目标地点，再按答句的顺序走。',
}), teachingLesson({
  id: 'service-booking', number: '第四十八课', title: '约时间：哪一个才约成了', goal: '分清一开始提议的时间和最后确认的时间。',
  example: 'How about Monday? — I’m busy on Monday. Is Friday OK? — Friday is fine.', chinese: '星期一怎么样？——星期一忙。星期五行吗？——星期五可以。',
  terms: [['How about…?', '……怎么样？'], ['busy', '忙'], ['Is … OK?', '……可以吗？'], ['… is fine.', '……可以']],
  rule: '提议不等于约成。遇到 busy 先排除那个时间，再找最后一句接受的是哪个时间。',
  guided: ['How about Monday?', 'I’m busy on Monday. Is Friday OK?', 'Friday is fine.'], walkthrough: 'Monday 没约成；Friday 被明确接受了。', guidedAnswers: [['星期五'], ['星期一', '星期一说了忙。']],
  independent: ['How about 3 p.m.?', 'I’m busy at 3. Is 4 p.m. OK?', '4 p.m. is fine.'], checkPrompt: '最后约在几点？', answers: [['下午三点', '三点是未接受的提议。'], ['下午四点']], recap: '一直读到最后的确认，再记时间。',
}), teachingLesson({
  id: 'reading-order', number: '第四十九课', title: '读出先后：事情不是同时发生', goal: '用 first、then、finally 把步骤按顺序排。',
  example: 'First, read the notice. Then write your name. Finally, send the email.', chinese: '先读通知，再写姓名，最后发邮件。',
  terms: [['first', '首先'], ['then', '接着'], ['finally', '最后'], ['open the box', '打开盒子'], ['take out', '拿出来']],
  rule: '找连接词后面做的事。问第一步就去 first 后面找，不要选看起来最重要的一步。',
  guided: ['First, read the notice. Then write your name.'], walkthrough: 'first 后面的动作是读通知，写名字在下一步。', guidedAnswers: [['先读通知'], ['先写姓名', '写姓名在 then 后面。']],
  independent: ['First, open the box. Then take out the books.'], checkPrompt: '拿书之前做什么？', answers: [['打开盒子'], ['先拿出书', '先做 open，再做 take out。']], recap: '问题问先后，就用顺序词核对。',
}), teachingLesson({
  id: 'reading-examples', number: '第五十课', title: '分清作者的观点和举的例子', goal: '看到 for example 时，用例子反过来验证前一句的观点。',
  example: 'Small changes save time. For example, keep your keys by the door.', chinese: '小改变可以省时间。例如把钥匙放在门边。',
  terms: [['small changes', '小改变'], ['save time', '省时间'], ['for example', '例如'], ['keys', '钥匙'], ['reuse', '再次使用']],
  rule: 'for example 后面通常是一个具体例子，不是全文只想说这个例子。先找它支持前面哪句话。',
  guided: ['Small changes save time.', 'For example, keep your keys by the door.'], walkthrough: '钥匙是例子，用来说明小改变怎么省时间。', guidedAnswers: [['小改变能省时间'], ['这段只想讲钥匙', '钥匙只在例子里出现。']],
  independent: ['We can reuse many things.', 'For example, use an old box to hold pens.'], checkPrompt: '旧盒子支持的观点是什么？', answers: [['一定要买一个笔盒', '原文说用旧盒子，不是买新的。'], ['许多东西可以再次使用']], recap: '例子具体；观点能包括不止一个例子。',
}), teachingLesson({
  id: 'reading-purpose', number: '第五十一课', title: '作者是想通知、邀请，还是教方法', goal: '看开头和关键句，判断作者写这段话是要读者做什么。',
  example: 'Join our reading club this Friday! Sign up in Room 105.', chinese: '这周五加入读书社吧！去105室报名。',
  terms: [['join', '加入'], ['sign up', '报名'], ['here is how', '下面是做法'], ['will be closed', '将关闭']],
  rule: 'Join 和 sign up 是邀请／报名；will be closed 多是在通知安排；Here is how 和 first、then 多是教步骤。要看整段，不只找某一个词。',
  guided: ['Join our reading club this Friday!', 'Sign up in Room 105.'], walkthrough: '两句都在鼓励读者参加并报名。', guidedAnswers: [['邀请参加'], ['教怎么阅读一本书', '没有列读书步骤。']],
  independent: ['The library will be closed on Monday.', 'You can borrow books on Friday.'], checkPrompt: '作者主要在做什么？', answers: [['教借书的步骤', '没有列步骤。'], ['通知图书馆的开放安排']], recap: '看看作者想让读者知道什么，或接下来做什么。',
}), teachingLesson({
  id: 'present-routine', number: '第五十二课', title: '说平时做什么：I read，she reads', goal: '说经常做的事时，先看是谁，再选动词形式。',
  example: 'I read after class. Mei reads after class.', chinese: '我下课后看书。Mei 下课后看书。',
  terms: [['after class', '下课后'], ['every day', '每天'], ['play basketball', '打篮球'], ['read / reads', '都表示读，形式跟着主语变']],
  rule: '说习惯时，I / you / we / they 后用 read。换成 he / she 或一个人的名字，这里的 read 变 reads、play 变 plays。并不是所有动词都只加 s。',
  guided: 'I ____ after class. (read)', walkthrough: '句子说 I 平时做什么，用原形 read。', guidedAnswers: [['read'], ['reads', '这里的主语是 I，不是 he 或 she。']],
  independent: 'Bo ____ basketball every day.', checkPrompt: '这句说 Bo 每天打篮球，补哪个词？', answers: [['play', 'Bo 是一个人的名字，这里要用 plays。'], ['plays']],
  recap: '先圈主语，再看动词：I play，但 Bo plays。',
}), teachingLesson({
  id: 'present-negative', number: '第五十三课', title: '说平时不做：don’t / doesn’t', goal: '分清什么时候用 don’t 或 doesn’t，后面的动作一律用原形。',
  example: 'I don’t play on Mondays. Mei doesn’t play on Mondays.', chinese: '我星期一不打球。Mei 星期一不打球。',
  terms: [['don’t = do not', '不；这里和 I / you / we / they 搭配'], ['doesn’t = does not', '不；这里和 he / she 或一个人的名字搭配'], ['on Mondays', '每逢星期一']],
  rule: '说平时不做某个动作，用 don’t 或 doesn’t。doesn’t 已经带出了第三人称单数，后面别再写 plays，要用 play。',
  guided: 'I ____ read on Mondays.', walkthrough: '主语是 I，用 don’t；后面的 read 已经是原形。', guidedAnswers: [['don’t'], ['doesn’t', '主语是 I。']],
  independent: 'Mei ____ on Mondays.', checkPrompt: '哪项表示 Mei 平时星期一不打球？', answers: [['doesn’t plays', 'doesn’t 后面要用 play，不再加 s。'], ['doesn’t play']], recap: 'Mei plays 是肯定；Mei doesn’t play 是否定。',
}), teachingLesson({
  id: 'present-questions', number: '第五十四课', title: '问平时做不做：Do / Does', goal: '用 Do 或 Does 问日常习惯，并读懂简短回答。',
  example: 'Do you read after class? — Yes, I do. Does Mei read after class? — No, she doesn’t.',
  chinese: '你下课后看书吗？——看。Mei 下课后看书吗？——不看。',
  terms: [['Do you …?', '问你平时做不做'], ['Does Mei …?', '问 Mei 平时做不做'], ['Yes, she does.', '是的，她做'], ['No, she doesn’t.', '不，她不做']],
  rule: '把 Do / Does 放在主语前，动作放主语后，用原形。问 he / she 或一个人时用 Does；简单回答可以说 Yes, she does 或 No, she doesn’t。',
  guided: '____ you play basketball after class?', walkthrough: '问的是 you，所以句首用 Do。', guidedAnswers: [['Do'], ['Does', '这里不是问 he、she 或某一个人。']],
  independent: 'Does Bo ____ every day?', checkPrompt: '选能和句首 Does 配合的动词形式。', answers: [['reads', '句首已经有 Does，后面的动作写 read。'], ['read']], recap: 'Does Bo read…? 不写成 Does Bo reads…?。',
}), teachingLesson({
  id: 'past-negative', number: '第五十五课', title: '说过去没做：didn’t 后用原形', goal: '区分 played 和 didn’t play，否定句只标一次过去。',
  example: 'I played basketball on Monday. I didn’t play on Friday.', chinese: '我星期一打了篮球，星期五没打。',
  terms: [['didn’t = did not', '过去没做某事'], ['play / played', '打球的原形／过去式'], ['go / went', '去的原形／过去式'], ['yesterday', '昨天']],
  rule: '肯定句可以用 played 或 went；否定句用 didn’t 加原形。didn’t 已经表示过去，不写 didn’t played 或 didn’t went。',
  guided: 'I didn’t ____ basketball yesterday.', walkthrough: 'didn’t 已经表明是过去，后面放原形 play。', guidedAnswers: [['play'], ['played', 'didn’t 后用原形。']],
  independent: 'Mei ____ to the library yesterday.（昨天没去图书馆）', checkPrompt: '选能表达过去没去的部分。', answers: [['didn’t went', 'went 是过去式，didn’t 后换回 go。'], ['didn’t go']],
  recap: '肯定：Mei went。否定：Mei didn’t go。',
}), teachingLesson({
  id: 'past-questions', number: '第五十六课', title: '问过去做没做：Did …?', goal: '认出 Did 问句，知道后面的动词用原形。',
  example: 'Did you read yesterday? — Yes, I did. Did Bo play yesterday? — No, he didn’t.', chinese: '你昨天看书了吗？——看了。Bo 昨天打球了吗？——没打。',
  terms: [['Did you …?', '你过去做了吗？'], ['Did Bo …?', 'Bo 过去做了吗？'], ['Yes, he did.', '是的，他做了。'], ['No, he didn’t.', '不，他没做。']],
  rule: '问过去做没做，把 Did 放在主语前，后面用动词原形。不同主语都用 Did；回答用 did 或 didn’t。',
  guided: 'Did Mei ____ to the library yesterday?', walkthrough: 'Did 已经说明问的是过去，动作要用 go。', guidedAnswers: [['go'], ['went', '问句有 Did，动作不再用过去式。']],
  independent: ['Did Bo play basketball yesterday?', '____ He didn’t play.'], checkPrompt: '哪句简短回答能和后面的事实对上？',
  answers: [['Yes, he did.', '后面明确说他没打。'], ['No, he didn’t.']], recap: '问句用 Did + 主语 + 原形；回答跟事实。',
}), teachingLesson({
  id: 'past-story', number: '第五十七课', title: '读过去的小故事：先找时间，再排动作', goal: '分清过去先做了什么、后来做了什么，不把没做的事排进去。',
  example: 'Yesterday, Mei went to the library. Later, she played basketball. She didn’t go to the shop.', chinese: '昨天 Mei 去了图书馆，后来打了篮球。她没去商店。',
  terms: [['yesterday', '昨天'], ['later', '后来'], ['shop', '商店'], ['went to', '去了'], ['read a book', '读了一本书']],
  rule: '先用 Yesterday 找到故事发生的时间，再用 Later 串起发生过的动作。有 didn’t 的那件事没有做，不排进时间线。',
  guided: ['Yesterday, Mei went to the library.', 'Later, she played basketball.', 'She didn’t go to the shop.'],
  walkthrough: '去图书馆是先发生的；打球在后来；去商店没发生。', guidedAnswers: [['先去图书馆，后来打球'], ['先去商店，后来去图书馆', '去商店这一件事有 didn’t。']],
  independent: ['Yesterday, Bo played basketball.', 'Later, he read a book at home.', 'He didn’t go to the library.'], checkPrompt: '只排发生过的事。',
  answers: [['先去图书馆，后来在家看书', '去图书馆没发生。'], ['先打球，后来在家看书']], recap: '时间线只写实际发生过的事，顺序用时间词核对。',
}), teachingLesson({
  id: 'future-will', number: '第五十八课', title: '说接下来会做什么：will 加原形', goal: '看懂 will 表达的将来安排，并在 will 后选动词原形。',
  example: 'Mei plays basketball every day. Tomorrow, she will play at school.', chinese: 'Mei 每天都打篮球。明天她会在学校打球。',
  terms: [['every day', '每天'], ['tomorrow', '明天'], ['next week', '下周'], ['visit', '参观；拜访'], ['school office', '学校办公室']],
  rule: 'plays 这句在说平时的习惯，will play 这句在说明天会做什么。用 will 表示将来时，不管前面是 I、they 还是 Mei，will 后都用原形：will play，不是 will plays。',
  guided: 'Tomorrow, Mei will ____ basketball.', walkthrough: 'Tomorrow 把事情放到明天。will 后用 play，不能因为主语是 Mei 就改成 plays。', guidedAnswers: [['play'], ['plays', '有 will 时，后面的动作不用加 s。']],
  independent: 'Next week, Bo ____ the library.', checkPrompt: '哪项能表达「Bo 下周会参观图书馆」？',
  answers: [['will visits', 'visits 不能直接放在 will 后；用 visit。'], ['will visit']], recap: '说将来可以用 will：先找时间，再检查 will 后是不是原形。',
}), teachingLesson({
  id: 'future-negative', number: '第五十九课', title: '说将来不会做：won’t 加原形', goal: '在同一段话里分清哪件事会做，哪件事不会做。',
  example: 'I won’t go to the shop tomorrow. I will go to the library.', chinese: '我明天不会去商店。我会去图书馆。',
  terms: [['won’t = will not', '将来不会做'], ['will', '这里表示将来会做'], ['meet', '见面；集合'], ['at the school gate', '在校门口'], ['read at home', '在家看书'], ['bring', '带来']],
  rule: 'won’t 是 will not 的缩写。读到 won’t go，就知道「去」这件事不在安排里。won’t 后也用原形。',
  guided: ['We will meet at the school gate.', 'We won’t meet in the gym.'], walkthrough: 'meet 出现了两次。校门口前面是 will meet，要保留；体育馆前面是 won’t meet，要排除。',
  guidedAnswers: [['在校门口见面'], ['在体育馆见面', 'won’t meet in the gym 表示不在体育馆见。']],
  independent: ['Bo will read at home tomorrow.', 'He won’t play basketball.'], checkPrompt: 'Bo 明天会做哪件事？',
  answers: [['打篮球', '打篮球是 won’t play basketball，这件事不会做。'], ['在家看书']], recap: '地点和动作都要跟前面的 will 或 won’t 一起读。',
}), teachingLesson({
  id: 'future-notice', number: '第六十课', title: '读将来的通知：排掉旧安排，记下新安排', goal: '读懂一条变更通知，说出仍然有效的日期、时间和地点。',
  example: 'The club will meet on Friday. We won’t meet in Room 101. We will meet in Room 204 at 4 p.m.', chinese: '社团星期五会集合。不在 101 室，改在下午四点到 204 室集合。',
  terms: [['the club', '社团'], ['meet', '见面；集合'], ['in Room 204', '在 204 室'], ['at 4 p.m.', '在下午四点'], ['on Friday', '星期五'], ['on Monday / Tuesday', '星期一／星期二'], ['the library', '图书馆']],
  rule: '先用 won’t 划掉取消的安排，再把确定的信息合起来。这里只取消 101 室，没取消 Friday；有效安排是星期五下午四点在 204 室。',
  guided: ['The club will meet on Friday.', 'We won’t meet in Room 101.', 'We will meet in Room 204 at 4 p.m.'], walkthrough: '第一句给日期，最后一句给地点和时刻；中间那句只排除旧地点。',
  guidedAnswers: [['星期五下午四点，204 室'], ['星期五下午四点，101 室', 'won’t meet 否定的是 101 室。']],
  independent: ['We won’t meet on Monday.', 'We will meet on Tuesday.', 'Meet in the library at 3 p.m.'], checkPrompt: '要参加这次集合，应该什么时候去哪里？',
  answers: [['星期一下午三点，图书馆', '这次取消的是星期一；will meet 说的是星期二。'], ['星期二下午三点，图书馆']], recap: '这次变的是日期，不是地点。先排除取消项，再把分散的日期、时间和地点拼起来。',
}), teachingLesson({
  id: 'compare-direction', number: '第六十一课', title: '谁比谁更快：看清 than 两边', goal: '在比较句里分清谁更快、哪条路更短。',
  example: 'The bus is faster than the bike.', chinese: '公交车比自行车快。',
  terms: [['the bus', '公交车'], ['the bike', '自行车'], ['faster', '更快'], ['shorter', '更短'], ['than', '比'], ['Route A / B', 'A / B 路线']],
  rule: '先找 faster（更快），再看句子说谁 is faster。这里是公交车；than 后的自行车是拿来比的。把两边对调，意思就反了。',
  guided: 'The bus is faster than the bike.', walkthrough: '问谁更快，就找谁 is faster：the bus。the bike 在 than 后面，是比较对象。',
  guidedAnswers: [['公交车'], ['自行车', '自行车在 than 后；这句话说公交车更快。']],
  independent: 'Route B is shorter than Route A.', checkPrompt: '哪条路线更短？',
  answers: [['A 路线', 'Route A 在 than 后；句子说更短的是 Route B。'], ['B 路线']], recap: '别按 A、B 的习惯顺序猜。读清楚谁 is shorter，再看跟谁比。',
}), teachingLesson({
  id: 'compare-quantity', number: '第六十二课', title: '不到还是超过：less than 和 more than', goal: '读懂数字前的 less than 或 more than，知道它们都不包含那个数字。',
  example: 'The walk takes less than 10 minutes. The bus ride takes more than 10 minutes.', chinese: '走路不到十分钟。坐公交超过十分钟。',
  terms: [['less than', '少于；不到'], ['more than', '多于；超过'], ['takes', '这里表示花费时间'], ['minutes', '分钟'], ['costs', '价钱是'], ['yuan', '元'], ['ticket', '票'], ['notebook', '笔记本']],
  rule: '数字是用来比较的界线，不是报告的准确数字。less than 10 可以是 8，不能是 10；more than 10 可以是 12，也不能是 10。',
  guided: 'The walk takes less than 10 minutes.', walkthrough: '8 分钟不到 10 分钟，能符合这句话；正好 10 分钟不符合。句子没说到底走了几分钟。',
  guidedAnswers: [['可能花了 8 分钟'], ['正好花了 10 分钟', 'less than 10 不包含 10。']],
  independent: 'The ticket costs more than 20 yuan.', checkPrompt: '哪种价格符合这句话？',
  answers: [['正好 20 元', 'more than 20 是超过 20，不包含 20。'], ['可能是 23 元']], recap: '先看是 less 还是 more，再看数字；别把界线当成准确值。',
}), teachingLesson({
  id: 'compare-reading', number: '第六十三课', title: '短文里比的是谁：先圈范围，再比数字', goal: '找准问题问的是哪一组，不把另一组的数字算进去。',
  example: 'Class A: 12 students chose the art club and 5 chose the music club. Class B: 15 students chose the music club.',
  chinese: 'A 班：12 名学生选了美术社，5 名选了音乐社。B 班：15 名学生选了音乐社。',
  terms: [['class', '这里表示班级'], ['chose', '选了'], ['art club / music club', '美术社／音乐社'], ['more students', '更多学生'], ['after school', '放学后'], ['at lunch', '午饭时'], ['borrowed', '借了'], ['used', '用了'], ['computer', '电脑']],
  rule: '问 A 班就只比 A 班：12 人选美术，5 人选音乐。15 虽然更大，却是 B 班的数据。遇到分班、分时段或分地点的数字，先圈问题的范围，再比较。',
  guided: ['Class A: 12 students chose the art club and 5 chose the music club.', 'Class B: 15 students chose the music club.'],
  walkthrough: '只看 A 班，12 比 5 大。B 班的 15 人不能用来回答。',
  guidedAnswers: [['A 班选美术社的更多'], ['A 班选音乐社的更多', '15 是 B 班的；A 班选音乐的是 5 人。']],
  independent: ['At lunch, 18 students borrowed books and 7 used computers.', 'After school, 4 students borrowed books and 11 used computers.'],
  checkPrompt: '只看放学后，做哪件事的学生更多？',
  answers: [['借书', '18 是午饭时借书的人数；放学后借书的只有 4 人。'], ['用电脑']], recap: '从分班换到分时段，做法没变：先圈范围，再比较同一范围的两个数。',
}), teachingLesson({
  id: 'reason-or-purpose', number: '第六十四课', title: '是因为什么，还是为了什么', goal: '分清促使人去做的原因和做这件事想达到的目的。',
  example: 'Mei went to the library because it was quiet. She went there to study.',
  chinese: 'Mei 去图书馆，因为那里安静。她去那里是为了学习。',
  terms: [['because', '因为；这里接原因'], ['quiet', '安静的'], ['to study', '为了学习'], ['took the bus', '坐了公交'], ['tired', '累的'], ['to get home early', '为了早点到家']],
  rule: '「那里安静」解释为什么选图书馆；「学习」是她想在那里做的事。because 后面说原因；这里的 to study 表示目的，可以读成「为了学习」。不是每个 to 都是「为了」：went to the library 里的 to 是「去图书馆」。',
  guided: ['Mei went to the library because it was quiet.', 'She went there to study.'],
  walkthrough: '问她在图书馆想做什么，就选 to study；安静是她选这里的原因。',
  guidedAnswers: [['学习'], ['找一个安静的地方', '原文说那里安静，是她选图书馆的原因；想在那里做的是学习。']],
  independent: ['Bo took the bus because he was tired.', 'He took the bus to get home early.'], checkPrompt: '什么情况让 Bo 决定坐公交？',
  answers: [['他累了'], ['他想早点到家', '早点到家是他想达到的目的。这题找的是原文用 because 给出的原因。']], recap: '问已有的原因，找 because；问想做到什么，看看这里有没有表示目的的 to。',
}), teachingLesson({
  id: 'purpose-or-result', number: '第六十五课', title: '读懂 so that 的目的和 so 的结果', goal: '区别「希望能怎样」与「后来真的怎样」。',
  example: 'Lin left early so that she could catch the bus. The bus was late, so she waited for ten minutes.',
  chinese: 'Lin 早早出门，为了赶上公交。公交晚点了，所以她等了十分钟。',
  terms: [['left early', '早早出门'], ['catch the bus', '赶上公交'], ['was late', '晚点了'], ['waited', '等了'], ['so that', '这里是「为了让……」'], ['so', '这里是「所以」'], ['wrote down', '写下'], ['room number', '房间号'], ['find', '找到']],
  rule: 'so that she could catch the bus 讲她早出门的目的，不保证她赶上了。so she waited 是在说公交晚点之后，实际发生了什么。不要看到 so 就停下来，要看看后面有没有 that。',
  guided: ['Lin left early so that she could catch the bus.', 'The bus was late, so she waited for ten minutes.'],
  walkthrough: '赶公交是她出门时的打算。原文明确说实际发生的是：公交晚点，她等了十分钟。',
  guidedAnswers: [['她赶上了公交', '第一句只说她想赶上公交，没说最后赶没赶上。'], ['她等了十分钟']],
  independent: ['Mei wrote down the room number so that she could find the room.'], checkPrompt: '写下房间号是为了什么？',
  answers: [['为了找到房间'], ['因为她已经找到了房间', 'so that 后面是写号码的目的，并不说明她已经找到了。']], recap: '先分清原文是在讲打算，还是在报告已经发生的事。',
}), teachingLesson({
  id: 'reason-purpose-reading', number: '第六十六课', title: '读短文：把原因、目的和结果各放一格', goal: '按问题找对证据，不把打算当成做成了。',
  example: 'The library was closed, so Mei went to Room 203 to study. But Room 203 was too noisy. She went home without studying.',
  chinese: '图书馆关了，所以 Mei 去 203 室学习。但 203 室太吵了，她没学习就回家了。',
  terms: [['closed', '关闭的'], ['too noisy', '太吵了'], ['without studying', '没有学习'], ['wanted to', '想要'], ['write a card', '写卡片'], ['to buy a pen', '为了买笔'], ['shop', '商店'], ['sold out', '卖完了'], ['came home', '回家了'], ['without a pen', '没带笔回来']],
  rule: '先看问题。问为什么改去 203 室，答「图书馆关了」；问想去做什么，答「学习」；问最后怎样，读完才知道「没学习就回家了」。遇到 But，别漏掉后面改变结局的那句。',
  guided: ['The library was closed, so Mei went to Room 203 to study.', 'But Room 203 was too noisy. She went home without studying.'],
  walkthrough: '问题问 Mei 去 203 室打算做什么。第一句的 to study 是目的；第二句说目的没达到。',
  guidedAnswers: [['学习'], ['回家', '回家是后来发生的事，不是她去 203 室的目的。']],
  independent: ['Bo wanted to write a card, so he went to the shop to buy a pen.', 'But the pens were sold out. He came home without a pen.'],
  checkPrompt: 'Bo 最后买到笔了吗？',
  answers: [['买到了，他去商店买笔', 'to buy a pen 只说明为什么去商店，后面说笔卖完了。'], ['没买到，笔卖完了']], recap: '想做、去做和做成不是一回事。问最后怎样，要读到原文给出的结局。',
}), teachingLesson({
  id: 'rules-can-must', number: '第六十七课', title: '看规则：can 是可以，must 是必须', goal: '在校园规则里分清允许做的事和非做不可的事。',
  example: 'You can use a computer. You must show your student card first.', chinese: '你可以用电脑，但必须先出示学生证。',
  terms: [['can', '在这里表示允许，可以'], ['must', '必须'], ['show', '出示'], ['student card', '学生证'], ['locker', '储物柜'], ['wear', '穿；戴'], ['gloves', '手套'], ['workshop', '实训室']],
  rule: '规则里说 can use，是允许用，不是命令你用。must show 是要求出示。can 和 must 后面接动作原形：can use、must show。',
  guided: ['You can use a computer.', 'You must show your student card first.'],
  walkthrough: '只找「必须」。must 后面是 show your student card first，也就是先出示学生证。',
  guidedAnswers: [['先出示学生证'], ['一定要用电脑', '用电脑是 can，不是必须做。']],
  independent: ['In the workshop, you must wear gloves.', 'You can use a locker.'], checkPrompt: '这两件事里，哪件必须做？',
  answers: [['使用储物柜', 'can use 是可以用，不是一定要用。'], ['戴手套']], recap: '先看动作前面是 can 还是 must，再决定「可以」还是「必须」。',
}), teachingLesson({
  id: 'rules-mustnt-optional', number: '第六十八课', title: '不能做，和可以不做，不是一回事', goal: '分清 mustn’t 表示禁止，don’t have to 表示不必。',
  example: 'You mustn’t eat in this room. You don’t have to bring a notebook.', chinese: '这个房间不能吃东西。你不必带笔记本。',
  terms: [['mustn’t = must not', '禁止；不能做'], ['don’t have to', '不必；可以不做'], ['eat', '吃'], ['bring', '带'], ['take photos', '拍照'], ['print', '打印'], ['form', '表格']],
  rule: 'mustn’t eat 是「不能吃」。don’t have to bring 是「不必带」：不带也行，不是禁止带。看到否定，不能只凭一个「不」字猜。',
  guided: ['You mustn’t eat in this room.', 'You don’t have to bring a notebook.'],
  walkthrough: '不能吃东西，但笔记本只是不用非带不可。',
  guidedAnswers: [['不能吃东西，不必带笔记本'], ['不能吃东西，也不能带笔记本', 'don’t have to bring 不是「不能带」。']],
  independent: ['You don’t have to print the form.', 'You mustn’t take photos in this room.'], checkPrompt: '哪项准确说出了两个要求？',
  answers: [['不能打印表格，拍不拍照都行', '第一句是不必打印；第二句才说禁止。'], ['不必打印表格，房间里不能拍照']], recap: 'mustn’t 是「别做」；don’t have to 是「不做也行」。',
}), teachingLesson({
  id: 'rules-who-reading', number: '第六十九课', title: '读校园通知：哪条规矩说的是你', goal: '遇到分情况的规则，先看条件，再找必须、禁止或不必做的事。',
  example: 'If you are new, you must sign in. If you are not new, you don’t have to sign in. For everyone: You mustn’t eat in the room.',
  chinese: '新成员必须签到。不是新成员就不必签到。所有人都不得在屋里吃东西。',
  terms: [['if', '如果'], ['new', '这里指新成员'], ['sign in', '签到'], ['everyone', '每个人'], ['have your student card', '带了学生证'], ['show it', '把它出示出来'], ['write your name', '写下姓名'], ['use your phone', '使用手机']],
  rule: '先挑跟自己情况相符的 if，再读该行的要求。遇到 everyone，就把这条也算进去。这里不是新成员的人不必签到，但「不能吃东西」照样适用。',
  guided: ['If you are new, you must sign in.', 'If you are not new, you don’t have to sign in.', 'For everyone: You mustn’t eat in the room.'],
  walkthrough: '假设你不是新成员。第一条不适用，第二条说你不必签到；最后一条对所有人有效。',
  guidedAnswers: [['不必签到，屋里不能吃东西'], ['必须签到，屋里不能吃东西', '必须签到的是新成员。']],
  independent: ['If you have your student card, you must show it.', 'If you don’t have your student card, you must write your name.', 'For everyone: You mustn’t use your phone in the room.'],
  checkPrompt: '你没带学生证。这张通知要求你怎么做？',
  answers: [['写下姓名，屋里不能用手机'], ['出示学生证，屋里不能用手机', '你适用的是 don’t have your student card 那条。']], recap: '条件决定哪条跟你有关；对所有人的规则也别漏。',
}), teachingLesson({
  id: 'passive-roles', number: '第七十课', title: '谁做的，什么被做了', goal: '从主动句和被动句里认出同一个动作的两方。',
  example: 'Mei made the poster. The poster was made by Mei.', chinese: 'Mei 做了海报。换个说法：这张海报是 Mei 做的。',
  terms: [['poster', '海报'], ['made', '做；制作'], ['was made', '被制作；是……做的'], ['by Mei', '由 Mei'], ['card', '卡片'], ['was written', '被写；是……写的']],
  rule: '两句都说 Mei 做海报。第一句先说做事的人；第二句先说海报，再用 was made 表示「被做出来」，最后用 by Mei 交代是谁做的。海报没有做任何事。别只看到 was 就译成「被」：was quiet 是「很安静」；这里 was made 才说这东西被做了出来。',
  guided: 'The poster was made by Mei.', walkthrough: '问谁做的，就去找 by 后面的 Mei；句首的海报是被做出来的东西。',
  guidedAnswers: [['Mei'], ['海报', '海报是做出来的东西，不是做事的人。']],
  independent: 'The card was written by Bo.', checkPrompt: '哪句话保留了原句的意思？',
  answers: [['Bo 收到了一张卡片', 'by Bo 交代谁写的，没有交代谁收到。'], ['Bo 写了这张卡片']], recap: '在这里，句首是受动作影响的东西，by 后才是做事的人。',
}), teachingLesson({
  id: 'passive-no-agent', number: '第七十一课', title: '没说是谁做的，也能读懂发生了什么', goal: '读出被处理的物品和动作，不自己补一个做事的人。',
  example: 'The books were moved to Room 204 yesterday.', chinese: '这些书昨天被搬到了 204 室。',
  terms: [['were moved', '被搬动'], ['yesterday', '昨天'], ['was repaired', '被修理；修好了'], ['school computer', '学校的电脑'], ['this morning', '今天早上']],
  rule: '句子只想告诉你书被搬了，不一定用 by 写出是谁搬的。这里 books 是复数，所以用 were；说一台电脑时可以用 was。读的时候先找哪样东西被怎样处理，再看时间或地点。',
  guided: 'The books were moved to Room 204 yesterday.', walkthrough: '被搬的是书，搬到 204 室。没写谁搬的，但这不影响我们知道书去了哪里。',
  guidedAnswers: [['书被搬到了 204 室'], ['204 室的同学搬了书', 'to Room 204 是搬去哪里，不是交代谁搬的。']],
  independent: 'The school computer was repaired this morning.', checkPrompt: '只根据这句话，能确定什么？',
  answers: [['学校的电脑今天早上修好了'], ['学校的老师今天早上修好了电脑', '学校的电脑不等于学校的老师修的。原文没有交代谁修。']], recap: '没交代是谁做的，就只说原文明确给出的动作、时间和地点。',
}), teachingLesson({
  id: 'passive-notice', number: '第七十二课', title: '读通知：什么改了，什么没改', goal: '读懂通知里的被动表达，把变动和仍有效的信息合在一起。',
  example: 'The book sale was moved from Room 101 to Room 205. It will still start at 3 p.m.',
  chinese: '图书义卖从 101 室改到了 205 室，仍然下午三点开始。',
  terms: [['book sale', '图书义卖'], ['was moved from A to B', '从 A 改到 B'], ['still', '仍然'], ['was changed', '被改了'], ['from Monday to Wednesday', '从星期一改到星期三'], ['club meeting', '社团会议'], ['will still be in', '仍将在……举行']],
  rule: '先找什么被改了：这里是义卖的地点。from 后是原来的地方，to 后是新地方。下一句的 still 告诉你时刻没改。读完两句才知道应该什么时候、去哪里。',
  guided: ['The book sale was moved from Room 101 to Room 205.', 'It will still start at 3 p.m.'],
  walkthrough: '义卖改到 205 室；still 表示下午三点这个时刻不变。',
  guidedAnswers: [['下午三点去 205 室'], ['下午三点去 101 室', '101 室在 from 后面，是原地点。']],
  independent: ['The day of the club meeting was changed from Monday to Wednesday.', 'The meeting will still be in Room 303.'],
  checkPrompt: '按最新通知，要哪天去哪里参加会议？',
  answers: [['星期一去 303 室', '这次改的是日期，from Monday 是旧日期。'], ['星期三去 303 室']], recap: '这次改的是日期，不是房间。先找被改的项目，再用 still 保留没改的信息。',
}), teachingLesson({
  id: 'relative-people', number: '第七十三课', title: 'who 这段话在说哪一批人', goal: '把「哪一批人」和「他们要做什么」分开读。',
  example: 'The students who signed up on Monday will meet on Friday.', chinese: '星期一报名的学生将在星期五集合。',
  terms: [['students', '学生'], ['who signed up', '报名的（学生）'], ['meet', '见面；集合'], ['who borrowed books', '借了书的（学生）'], ['bring them back', '把它们带回来']],
  rule: '这里的 who 不是提问「谁」，而是接在 students 后，说明是哪一批学生。先把 [who signed up on Monday] 当成一块，再读主干：The students will meet on Friday。星期一是报名，不是集合。',
  guided: 'The students who signed up on Monday will meet on Friday.', walkthrough: '问集合时间，就找 will meet 后面的 on Friday；on Monday 跟的是 signed up。',
  guidedAnswers: [['星期五集合'], ['星期一集合', '星期一是报名时间。']],
  independent: 'Students who borrowed books on Tuesday must bring them back on Thursday.', checkPrompt: '这批学生要在哪天还书？',
  answers: [['星期二', '星期二修饰 borrowed，表示哪天借的。'], ['星期四']], recap: '日期要跟动作配对：星期二借，星期四还。',
}), teachingLesson({
  id: 'relative-things', number: '第七十四课', title: 'that 后面的信息，帮你找到哪一样', goal: '用名词后的 that 从几样东西中找准目标。',
  example: 'Bring the bag that has your name on it.', chinese: '带上写有你名字的那个包。',
  terms: [['bag', '包'], ['has your name on it', '上面有你的名字'], ['find', '找到'], ['poster', '海报'], ['shows', '显示；写有'], ['club meeting time', '社团集合时间']],
  rule: '先读 Bring the bag，知道要带包。再读 [that has your name on it]，知道不是随便一个包，而是写有你名字的那个。这里的 that 不用单独翻译成「那个」；整段放在名词前，可以译成「……的」。',
  guided: 'Bring the bag that has your name on it.', walkthrough: '要区分几个包，就找名字。原句没有规定要哪种颜色。',
  guidedAnswers: [['带上写有自己名字的包'], ['带上蓝色的包', '原句说了名字，没提颜色。']],
  independent: 'Find the poster that shows the club meeting time.', checkPrompt: '要找哪张海报？',
  answers: [['离社团活动室最近的', '这里找的是写有集合时间的海报，不是看摆放位置。'], ['写有社团集合时间的']], recap: '先找是什么东西，再用 that 后的描述判断是哪一个。',
}), teachingLesson({
  id: 'relative-notice', number: '第七十五课', title: '读长一点的通知：哪一组，去哪儿', goal: '把限定人群或物品的信息跟主干的动作、地点对起来。',
  example: 'Students who signed up online will meet in Room 202. Students who signed up at the office will meet in Room 105.',
  chinese: '网上报名的学生去 202 室集合；在办公室报名的学生去 105 室集合。',
  terms: [['signed up online', '在网上报了名'], ['at the office', '在办公室'], ['books that have a blue label', '贴蓝色标签的书'], ['books that have a red label', '贴红色标签的书'], ['put A on B', '把 A 放到 B 上'], ['return desk', '还书台'], ['front table', '前面的桌子']],
  rule: '不要看到第一个房间号就停。先用 who 后的信息找对人，再从同一句读出集合地点。如果通知分的是物品，也一样：用 that 后的描述找对物品，再去看怎么处理。',
  guided: ['Students who signed up online will meet in Room 202.', 'Students who signed up at the office will meet in Room 105.'],
  walkthrough: '假设你在办公室报了名，先找 at the office 所在的第二句，再看 will meet in Room 105。办公室是报名地点，不是集合地点。',
  guidedAnswers: [['去 105 室集合'], ['去 202 室集合', '202 室是网上报名那批学生的集合地点。']],
  independent: ['Put books that have a blue label on the return desk.', 'Put books that have a red label on the front table.'],
  checkPrompt: '你手里拿的是贴红色标签的书。该放哪儿？',
  answers: [['还书台', '还书台对应的是蓝色标签，不是你手里的红色标签。'], ['前面的桌子']], recap: '找对人或物，再从同一句找动作和地点。不要把一行的条件跟另一行的安排拼起来。',
}), teachingLesson({
  id: 'vocab-borrow-lend', number: '第七十六课', title: '借东西：borrow 和 lend 看方向', goal: '在借用场景里认出谁借进来、谁借出去。',
  example: 'I borrow a book from Mei. Mei lends me a book.', chinese: '我跟 Mei 借一本书。换个说法：Mei 借给我一本书。',
  terms: [['borrow … from …', '从……借来……'], ['lend / lends', '借给别人'], ['book', '书'], ['pen', '笔']],
  rule: '同一件事，从拿到东西的人那边说，用 borrow；从把东西借出去的人那边说，用 lend。from 后面是东西从谁那里来。Mei lends me a book 里，Mei 借出去，me 是借到的人。',
  guided: 'I borrow a book from Mei.', walkthrough: '先找 borrow 前面的 I。我借到书；from Mei 说明书从 Mei 那里来。',
  guidedAnswers: [['我从 Mei 那里借到了书'], ['Mei 从我这里借到了书', 'borrow 前面的 I 才是借到书的人。']],
  independent: 'Bo lends Lin a pen.', checkPrompt: '谁把笔借给了谁？',
  answers: [['Lin 借给 Bo', 'lends 前面是 Bo，他是借出笔的人。'], ['Bo 借给 Lin']], recap: 'borrow 是借进来，lend 是借出去，先找动词前面是谁。',
}), teachingLesson({
  id: 'vocab-return-keep', number: '第七十七课', title: '借多久、哪天还：keep 和 return', goal: '认出 keep 表示留用，return 在借用场景里表示归还。',
  example: 'You can keep the book for one week. Return it on Friday.', chinese: '书可以留用一周。星期五归还。',
  terms: [['keep', '留着；留用'], ['return', '这里表示归还'], ['lent', 'lend 的过去式，借给了'], ['for two days', '持续两天'], ['it', '这里指借来的东西'], ['for one week', '持续一周'], ['on Friday', '在星期五'], ['on Monday', '在星期一']],
  rule: 'keep 说东西可以在你手里留多久，return 说把它还回去。Return it 的 it 指前面说的书，不用每次都把 the book 写一遍。',
  guided: ['You can keep the book for one week.', 'Return it on Friday.'], walkthrough: 'Return 后面接的是 it，指书。这一句说的是归还，不是再借一本。',
  guidedAnswers: [['星期五还书'], ['星期五再借一本书', 'Return 是归还，不是借来。']],
  independent: ['Bo lent you a pen. Keep it for two days. Return it on Monday.'], checkPrompt: '星期一要做什么？',
  answers: [['把笔还回去'], ['把笔再留两天', 'Keep it for two days 说留用多久；星期一跟着 Return。']], recap: '同样是一支笔，keep 是留用，return 是还回去。',
}), teachingLesson({
  id: 'vocab-library-reading', number: '第七十八课', title: '读借用说明：能借什么、要还什么', goal: '在一张新说明里认出 borrow、keep、return，并把归还日期配对。',
  example: 'You can borrow a book and a map. Keep the book for one week. Return the map on Monday and the book on Friday.',
  chinese: '你可以借书和地图。书可以留用一周。地图星期一还，书星期五还。',
  terms: [['borrow', '借来'], ['keep', '留用'], ['return', '归还'], ['map', '地图'], ['book', '书'], ['pen', '笔'], ['ruler', '尺子']],
  rule: '先找动作：borrow 说能借什么，keep 说可以留多久，return 说要还什么。两样东西一起出现时，把 return 后每样东西和它自己的日期配起来。',
  guided: ['You can borrow a book and a map.', 'Keep the book for one week.', 'Return the map on Monday and the book on Friday.'],
  walkthrough: '问星期一还什么，就去 Return 那句找 on Monday：是地图。书也要还，但不是星期一。',
  guidedAnswers: [['还地图'], ['还书', '书对应的是 on Friday。']],
  independent: ['You can borrow a ruler and a pen.', 'Return the ruler on Friday.', 'Return the pen on Monday.'],
  checkPrompt: '星期一需要做哪件事？', transferGlossary: [['ruler', '尺子'], ['pen', '笔']],
  answers: [['归还尺子', '尺子对应星期五，星期一对应的是笔。'], ['归还笔'], ['借一支笔', '星期一那句用的是 Return，不是 borrow。']],
  recap: '卡在物品名可以查，borrow 和 return 的方向要自己判断，再核对日期。',
}), teachingLesson({
  id: 'poster-signup', number: '第七十九课', title: '看海报：报名和活动是两件事', goal: '分清 sign up 的报名地点和 meet 的活动地点。',
  example: 'Art Club: Sign up in Room 106. Meet in the classroom on Friday.',
  chinese: '美术社：在 106 室报名。星期五到教室集合。',
  terms: [['club', '社团'], ['Art Club', '美术社'], ['sign up', '报名'], ['meet in', '在……集合'], ['classroom', '教室'], ['the school office', '学校办公室']],
  rule: '先看题目问哪件事。问报名，就跟着 Sign up 找地点；问活动集合，就跟着 Meet 找地点。同一张海报可以写两个地方，不能看到第一个地点就选。',
  guided: ['Art Club', 'Sign up in Room 106.', 'Meet in the classroom on Friday.'],
  walkthrough: '现在是去报名，不是去参加活动。读 Sign up 那一行，106 室才是报名地点。',
  guidedAnswers: [['去 106 室报名'], ['去教室报名', 'classroom 跟着 Meet，是集合的地方。']],
  independent: ['Book Club', 'Meet in the library on Monday.', 'Sign up at the school office.'],
  checkPrompt: '现在想报名，应该去哪里？', transferGlossary: [['Book Club', '读书社']],
  answers: [['去图书馆', 'library 在 Meet 后面，这一行说的是集合。'], ['去学校办公室']],
  recap: '海报换了顺序，方法不变：问报名就找 Sign up，再读它旁边的地点。',
}), teachingLesson({
  id: 'poster-no-experience', number: '第八十课', title: '没学过，也能参加吗', goal: '读懂 no experience needed，不把「不需要基础」读成「不招新手」。',
  example: 'Drawing Club: No experience needed. Bring a pencil.',
  chinese: '绘画社：不要求有经验。请带一支铅笔。',
  terms: [['experience', '做过某事的经验'], ['needed', '需要的'], ['no experience needed', '不要求有经验'], ['must', '必须'], ['already know how to swim', '已经会游泳']],
  rule: 'No experience needed 说的是「没有经验也可以」，不是说有经验的人不能来，也不是说什么要求都没有。下一行如果写了 Bring 或 must，仍然要照做。',
  guided: ['Drawing Club', 'No experience needed.', 'Bring a pencil.'],
  walkthrough: '假设没学过画画：不用补经验就可以来，但 Bring a pencil 仍然要求带铅笔。',
  guidedAnswers: [['没学过也能来，记得带铅笔'], ['没学过不能来', '这里不要求有经验。']],
  independent: ['Swim Club: You must already know how to swim.', 'Photo Club: No experience needed.'],
  checkPrompt: '你不会游泳，也没学过摄影。按海报写的要求，哪一个现在可以参加？',
  transferGlossary: [['Swim Club', '游泳社'], ['Photo Club', '摄影社'], ['already know how to swim', '已经会游泳']],
  answers: [['游泳社', 'must 表示已经会游泳是参加条件。'], ['摄影社']],
  recap: '先找对应社团写的条件。no experience needed 不要求基础，must 写出的条件不能略过。',
}), teachingLesson({
  id: 'poster-compare', number: '第八十一课', title: '几张海报一起读：能参加，还得赶得上', goal: '同时核对参加条件和开始时间，找出适合自己的活动。',
  example: 'Photo Club: No experience needed. Starts at 4 p.m.\nSwim Club: You must already know how to swim. Starts at 5 p.m.',
  chinese: '摄影社：不要求有经验，下午四点开始。游泳社：必须已经会游泳，下午五点开始。',
  terms: [['starts at', '在某一时刻开始'], ['no experience needed', '不要求有经验'], ['must', '必须'], ['already know how to swim', '已经会游泳'], ['after 4 p.m.', '下午四点以后']],
  rule: '先看是自己能不能参加，再看能不能准时到。两个条件都对才算合适，不能借用另一张海报上的开始时间。',
  guided: ['Photo Club: No experience needed. Starts at 4 p.m.', 'Swim Club: You must already know how to swim. Starts at 5 p.m.'],
  walkthrough: '你四点前就能到，但不会游泳。先排除游泳社，再看摄影社在四点，你来得及。',
  guidedAnswers: [['摄影社'], ['游泳社', '时间合适也不够，海报要求已经会游泳。']],
  independent: ['Art Club: No experience needed. Starts at 3 p.m.', 'Music Club: You must already know how to play the guitar. Starts at 5 p.m.', 'Book Club: No experience needed. Starts at 5 p.m.'],
  checkPrompt: '你是新手，不会弹吉他，下午四点才能到。哪一个符合要求，又能准时参加？',
  transferGlossary: [['Art Club', '美术社'], ['Music Club', '音乐社'], ['Book Club', '读书社'], ['play the guitar', '弹吉他']],
  answers: [['美术社', '不要求经验，但三点已经开始了。'], ['读书社'], ['音乐社', '五点来得及，但 must 后面说必须已经会弹吉他。']],
  recap: '只看时间会误选音乐社，只看经验会误选美术社。两条都对上的才是读书社。',
}), teachingLesson({
  id: 'insert-reference', number: '第八十二课', title: '选句：后面的 they 指谁', goal: '用空格后面的代词和动作，反查空格里该介绍谁。',
  example: 'Lin opened the classroom door. Two students were inside. They said hello.',
  chinese: 'Lin 打开教室门。里面有两名学生。他们打了招呼。',
  terms: [['inside', '在里面'], ['they', '他们／它们'], ['said hello', '打了招呼'], ['school office', '学校办公室'], ['teacher', '老师'], ['map', '地图'], ['gave her a map', '给了她一张地图']],
  rule: '有时题目的关键在空格之后。这里 They 后面是 said hello，所以要找前面提到的、能打招呼的几个人。名词数量对上还不够，动作也要说得通。',
  guided: ['Lin opened the classroom door. ____', 'They said hello.'], walkthrough: '后面的 They 要接住前面的人。教室里的两名学生能打招呼，桌子不能。',
  guidedAnswers: [['Two students were inside.'], ['Two desks were inside.', '桌子是两个，但不会打招呼。']],
  independent: ['Mei went to the school office. ____', 'They gave her a map.'], checkPrompt: '哪句既接得上办公室，又解释了 They 是谁？',
  answers: [['She saw two maps on a desk.', '两张地图可以是复数，但地图不会给她东西。'], ['Two teachers were there.']],
  recap: '先问 They 指谁，再检查那几个人或物能不能做后面的动作。',
}), teachingLesson({
  id: 'insert-relation', number: '第八十三课', title: '选句：接一个例子，还是转个话头', goal: '用 for example 和 but 分清举例与转折。',
  example: 'We can help in small ways. For example, we can lend a pen to a classmate.',
  chinese: '我们可以从小事上帮忙。比如，可以借一支笔给同学。',
  terms: [['for example', '例如'], ['help in small ways', '从小事上帮忙'], ['lend a pen', '借出一支笔'], ['classmate', '同学'], ['but', '但是，提示转折'], ['still', '仍然'], ['tired', '累的'], ['work on it', '接着做它'], ['stopped working', '停下不做了']],
  rule: 'For example 后面要有能说明上一句的具体事；但 But 后面应跟前面有反差。不只找重复的名词，要先看句子之间的关系。',
  guided: ['We can help in small ways. ____'], walkthrough: '上一句说从小事上帮忙。借一支笔是具体的帮忙例子；笔是红色的不说明怎么帮。',
  guidedAnswers: [['For example, we can lend a pen to a classmate.'], ['For example, my pen is red.', '只说颜色，没举出帮人的做法。']],
  independent: ['Bo was tired. ____', 'He finished the poster.'],
  checkPrompt: '哪句能把「累了」和最后完成海报接起来？', transferGlossary: [['poster', '海报'], ['finished', '完成了']],
  answers: [['For example, he stopped working.', '停下来不是累了的例子，也没接住后来完成海报。'], ['But he still worked on it.']],
  recap: '先认连接词，再检查它接的内容。累了但仍在做，才接得上后来做完。',
}), teachingLesson({
  id: 'insert-both-sides', number: '第八十四课', title: '选句：放进去，把三句一起读', goal: '排除只接得上前一句或只接得上后一句的选项。',
  example: 'Mei had a wet notebook. Lin gave her a dry notebook. Now she could write again.',
  chinese: 'Mei 的笔记本湿了。Lin 给了她一本干的笔记本。现在她又能写字了。',
  terms: [['wet / dry', '湿的／干的'], ['could', '能'], ['now', '现在，提示情况发生了变化'], ['again', '再次'], ['key', '钥匙'], ['unlocked', '打开了锁']],
  rule: '不要只问「这一句跟前面像不像」。前面笔记本湿了，后面又能写，中间要有能解释这个变化的事。最后把选好的句子放进去，连读三句。',
  guided: ['Mei had a wet notebook. ____', 'Now she could write again.'], walkthrough: '换来一本干笔记本能解释为什么又能写。只说湿本子是蓝色的，虽然接得上前面，却解释不了后面。',
  guidedAnswers: [['Lin gave her a dry notebook.'], ['The wet notebook was blue.', '只补了颜色，没解决不能写的问题。']],
  independent: ['The classroom door was locked. The students waited outside. ____', 'Now they could go inside.'],
  checkPrompt: '哪句能同时接住锁着的教室门和后来能进去的学生？', transferGlossary: [['locked', '锁着'], ['waited outside', '在外面等'], ['go inside', '进去'], ['office door', '办公室的门']],
  answers: [['The classroom door was white.', '接得上教室门，但颜色解释不了为什么学生能进去了。'], ['A teacher unlocked the classroom door.'], ['A teacher unlocked the office door.', '开锁确实能让人进去，但办公室的门不是前一句那扇门。']],
  recap: '题目中的两个线索都要用上：门锁着 → 有人开锁 → 学生能进去。',
}), teachingLesson({
  id: 'gap-what', number: '第八十五课', title: '语法填空：空里缺「什么」还是「在哪儿」', goal: '没给括号词时，先读空后面对什么信息还没说全。',
  example: 'I don’t know what Mei wants to borrow. She wants a book.',
  chinese: '我不知道 Mei 想借什么。她想借一本书。',
  terms: [['I don’t know', '我不知道'], ['what', '什么'], ['where', '在哪里'], ['wants to borrow', '想借'], ['needs', '需要'], ['shelf', '架子']],
  rule: '空后已经有 Mei wants to borrow（Mei 想借）。缺的是想借什么。后文给出 a book，所以用 what；如果后文给的是地点，才考虑 where。接在 I don’t know 后面仍按「谁＋动作」读。',
  guided: ['I don’t know ____ Mei wants to borrow.', 'She wants a book.'], walkthrough: 'a book 回答的是「什么东西」，不是「在哪里」。',
  guidedAnswers: [['what'], ['where', '下一句给的是书，不是地点。']],
  independent: ['I don’t know ____ the map is.', 'It is on the shelf.'], checkPrompt: '哪一个词能让两句意思接上？',
  answers: [['where'], ['what', '下一句说在架子上，回答的是地点，不是在解释地图是什么。']],
  recap: '没给提示词，先找空格要引出的信息：东西用 what，地点用 where。',
}), teachingLesson({
  id: 'gap-word-job', number: '第八十六课', title: '语法填空：括号给了词，先看它在句里做什么', goal: '从空格位置判断用形容词还是副词，不见 -ly 就选。',
  example: 'Mei is careful. Mei reads the notice carefully.',
  chinese: 'Mei 很仔细。Mei 仔细读通知。',
  terms: [['careful', '仔细的'], ['carefully', '仔细地'], ['slow', '缓慢的'], ['slowly', '慢慢地'], ['notice', '通知'], ['bus', '公交车']],
  rule: '先找空格在描述谁。Mei is careful 说的是人怎样；reads carefully 说的是读的方式。括号给的是起点，不一定原样抄，也不是每个空都要加 -ly。',
  guided: 'Mei reads the notice ____. (careful)', walkthrough: '空格在说怎么看通知，用 carefully。',
  guidedAnswers: [['carefully'], ['careful', '这里在描述 reads 这个动作。']],
  independent: 'The bus is ____. (slow)', checkPrompt: '填哪一种词形？',
  answers: [['slowly', '这里不是说公交车开得怎样，而是 is 后描述车本身。'], ['slow']],
  recap: '描述车本身用 slow；如果说 The bus moves slowly，才是描述怎么开。',
}), teachingLesson({
  id: 'gap-spend-ing', number: '第八十七课', title: '语法填空：花时间做事，动作怎么变', goal: '识别 spend + 时间 + (in) doing，分清空里是动作还是名词。',
  example: 'Lin spends an hour (in) reading every day.',
  chinese: 'Lin 每天花一小时读书。这里的 in 可以省略。',
  terms: [['spend an hour', '花一小时'], ['spend time (in) doing', '花时间做某事'], ['read / reading', '读／读（-ing 形式）'], ['clean / cleaning', '打扫／打扫（-ing 形式）'], ['after class', '下课后']],
  rule: '先圈 spend 和后面花的时间。再看空格是不是在说做什么：这里用 -ing。看到 spend an hour reading，即使没有 in，也不把 reading 换回 read。',
  guided: 'Lin spends an hour in ____ every day. (read)', walkthrough: 'an hour 是时间，read 是花这段时间做的事，所以用 reading。',
  guidedAnswers: [['reading'], ['read', '这里表示花时间做事，用 -ing。']],
  independent: 'Bo spends ten minutes ____ the classroom after class. (clean)', checkPrompt: '选合适的词形。',
  answers: [['cleaning'], ['clean', 'spend ten minutes 后说做的事，仍然用 cleaning。']],
  recap: '先认「花多久」，再用 -ing 写「做什么」。书写时别忘了把词形真正写出来。',
}), ...[
  {
    id: 'sentence-past-phrase', number: '第八十八课', title: '完成句子：看准时间，补上过去的动作', goal: '用题目给的时间定词形，再按中文提示补整段动作。',
    example: 'Two days ago, we washed a cup.', chinese: '两天前，我们洗了一个杯子。',
    terms: [['two days ago', '两天前'], ['yesterday', '昨天'], ['last Friday', '上周五'], ['wash → washed', '洗 → 洗了'], ['help → helped', '帮助 → 帮助了'], ['open → opened', '打开 → 打开了'], ['work → worked', '工作 → 工作了']],
    rule: '看 Two days ago, we ____.（洗了一个杯子）。Two days ago 和 we 已经给了。这里说过去做完的一件事，把 wash 写成 washed，再接上「一个杯子」a cup；空里只填 washed a cup。',
    guided: 'Yesterday, I ____ after class.', walkthrough: '要补「帮助了老师」。Yesterday 说明事情已发生；I 和 after class 已经给了。只补 help 的过去式和「老师」the teacher。',
    guidedAnswers: [['helped the teacher'], ['help the teacher', '人和动作的意思对上了，再用 Yesterday 核对动作是什么时候做的。']],
    independent: 'Mei ____ last Friday.', checkPrompt: '根据中文「打开了窗户」，选只填进空格的部分。', transferGlossary: [['window', '窗户']],
    answers: [['opens the window', '这是说 Mei 平时打开窗户；last Friday 指的是上周五。'], ['opened the window'], ['opened the window last Friday', '动作对了；last Friday 已经在空格右边，不要再写一次。']],
    recap: '过去的时间放在空格前或后，都要用来核对词形。这里补 opened the window，不重复写 Mei 或 last Friday。',
  },
  {
    id: 'sentence-location-question', number: '第八十九课', title: '完成句子：把「在哪里」接进半句话', goal: '看空格两边，把地点问句按 where + 地点名 + is 的顺序接进去。',
    example: 'Where is the school office?\nCould you tell me where the school office is?',
    chinese: '学校办公室在哪里？\n你能告诉我学校办公室在哪里吗？',
    terms: [['Could you tell me', '你能告诉我……吗'], ['where', '在哪里'], ['school office', '学校办公室'], ['art room', '美术教室'], ['school map', '学校地图']],
    rule: '自己直接问时，is 放在地点名之前；接到 Could you tell me 后时，先写 where，再写地点名，is 放在后面。整句仍是在提问，右边给的问号保留，不放进空格。',
    guided: 'Could you tell me ____?', walkthrough: '要补「美术教室在哪里」。左边已给 Could you tell me，右边已给问号。空里只排 where + the art room + is。',
    guidedAnswers: [['where is the art room', '这是单独问时的顺序；接在 tell me 后，把地点名放到 is 前。'], ['where the art room is']],
    independent: 'Please show me ____ on the school map.', checkPrompt: '根据中文「体育馆在哪里」，选只填进空格的部分。', transferGlossary: [['school map', '学校地图']],
    answers: [['where the gym is'], ['where is the gym', '单独问才把 is 放前面；这里接在 Please show me 后。'], ['where the gym is on the school map', '空格右边已写 on the school map，不要把地图抄进空格。']],
    recap: '接进半句话时，先写 where，再写地点名，最后写 is；右边已经给的词或标点不用重写。',
  },
  {
    id: 'sentence-proud-boundary', number: '第九十课', title: '完成句子：两边拼出 be proud of', goal: '用时间和主体选 be 的形式，再核对 of 在空内还是在空外。',
    example: 'Mei is proud of her work.\nYesterday, we were proud of our work.',
    chinese: 'Mei 为自己的作品感到自豪。\n昨天，我们为自己的作品感到自豪。',
    terms: [['be proud of', '为……感到自豪'], ['was / were', '表示过去状态的两种 be 形式'], ['last night', '昨晚'], ['work', '作品']],
    rule: '这里练的是 be proud of。过去说 Mei 用 was，说 we 或 they 用 were。先看谁、什么时候，再看右边：of 已经给了，空里就不再写 of；右边只有人或作品，空里才要带上 of。',
    guided: 'Yesterday, Mei ____ of her work.', walkthrough: '要补「感到自豪」。Yesterday 指过去，Mei 是一个人，用 was；右边已有 of，空里到 proud 为止。',
    guidedAnswers: [['was proud'], ['was proud of', '把它放回空里试读：右边已经有 of，会多出一个 of。']],
    independent: 'After the show last night, we ____ of our class.', checkPrompt: '根据中文「感到自豪」，选只填进空格的部分。', transferGlossary: [['show', '演出'], ['our class', '我们班']],
    answers: [['was proud', 'last night 指过去；主语是 we，这里用 were。'], ['were proud of', 'were 对了，但右边已经有 of。'], ['were proud']],
    recap: 'last night 定过去，we 用 were。of 在空格右边，所以这里只补 were proud。',
  },
].map((data) => {
  const lesson = teachingLesson(data);
  lesson.build.englishOptions = lesson.transfer.englishOptions = true;
  return lesson;
}), {
  id: 'timetable-locate', number: '第九十一课', title: '看时间表：先定到那一行',
  scene: '班主任在墙上贴了一张本周课程安排。',
  goal: '用星期几和几点两个线索，在课程安排里找到唯一一门课。',
  stepLabels: ['先看讲解', '跟着找一行', '自己试一次'],
  example: {
    title: '一张课程安排，一行就是一门课',
    chinese: '每一行先写星期几，再写几点，然后写什么课，最后写在哪间教室。',
    dialogue: [
      { speaker: '第一行 · 星期一，九点', english: 'Monday 9:00, Math, Room 106', chinese: '星期一九点，数学，106 室。' },
      { speaker: '第二行 · 星期一，十点', english: 'Monday 10:00, Art, Room 108', chinese: '星期一十点，美术，108 室。' },
      { speaker: '第三行 · 星期二，九点', english: 'Tuesday 9:00, English, Room 106', chinese: '星期二九点，英语，106 室。' },
    ],
    teaching: [
      '每一行都是四样东西：星期几、几点、什么课、哪间教室，中间用逗号分开。一行没有读完，内容可能折到下一行显示，所以要看完整的一行，不要跨行拼。',
      '要找一门课，先用星期几缩小到一两行，再用几点定到那一行。两个线索都对上，答案才唯一。',
    ],
    next: '跟着找一行',
  },
  build: {
    title: '跟着找：星期一九点上什么课',
    prompt: '先看下面的拆解，再选一项。',
    dialogueLines: ['Monday 9:00, Math, Room 106', 'Monday 10:00, Art, Room 108', 'Tuesday 9:00, English, Room 106'],
    guide: '题目问星期一 9:00。先找写 Monday 的行，有两行；再看 9:00，只剩第一行；最后从这一行读出 Math 和 Room 106。星期二那行虽然也是 9:00、也在 106 室，但星期不对。',
    options: [
      { id: 'art', label: '美术，在 108 室', hint: '美术是星期一 10:00 那行。题目问的是 9:00。' },
      { id: 'english', label: '英语，在 106 室', hint: '英语是星期二 9:00。106 室一样，但星期不一样。' },
      { id: 'correct', label: '数学，在 106 室' },
    ],
    answer: 'correct',
    success: '两个线索都对上了，才能定到这一行。',
    next: '下一步：自己找一行',
    backLabel: '回看讲解',
  },
  transfer: {
    title: '自己找：星期三十点什么课',
    prompt: '用星期几和几点两个线索，找出这一门课和它的教室。',
    dialogueLines: ['Monday 9:00, Math, Room 106', 'Tuesday 10:00, Music, Room 108', 'Wednesday 10:00, Drawing, Room 203'],
    glossary: [['Wednesday', '星期三'], ['Music', '音乐'], ['Drawing', '绘画']],
    options: [
      { id: 'music', label: '音乐，在 108 室', hint: '这一行写的是星期二。题目问星期三，星期先不符，再看别的线索也没用。' },
      { id: 'correct', label: '绘画，在 203 室' },
      { id: 'room', label: '绘画，在 108 室', hint: '课找对了。108 是星期二音乐那行的教室，星期三这行最后写的是 203。' },
    ],
    answer: 'correct',
    success: '先定星期，再定几点，最后只从那一行读课名和教室。',
  },
  done: {
    title: '你能从课程安排里取到一条信息', subtitle: '不用逐行读完，按星期几和几点两个线索找就行。',
    english: 'Monday 9:00, Math, Room 106', practice: '先定星期，再定几点，最后从同一行读课名和教室。',
    audio: 'Monday 9:00, Math, Room 106',
  },
}, {
  id: 'timetable-change', number: '第九十二课', title: '安排改了：先认通知改哪一条',
  scene: '课程安排旁边又多贴了一张改动通知。',
  goal: '通知只改了一门课，要从两份材料里排掉时间表上的旧信息。',
  stepLabels: ['先看讲解', '跟着核对', '自己试一次'],
  example: {
    title: '两张纸：一张旧安排，一张说改了哪条',
    chinese: '旧安排上星期五四点有两门课；通知只说美术改了教室。',
    dialogue: [
      { speaker: '旧安排 · 星期五，两门课都在四点', english: 'Friday 4:00, Music, Room 106', chinese: '星期五四点，音乐，106 室。' },
      { speaker: '旧安排 · 同一时间的另一门', english: 'Friday 4:00, Art, Room 108', chinese: '星期五四点，美术，108 室。' },
      { speaker: '通知 · 这周起改了一条', english: 'From this week, Friday Art is in Room 203.', chinese: '从这周起，星期五的美术在 203 室。' },
    ],
    teaching: [
      '两份材料一起看时，先读通知，认出它点名的是哪一门课、改的是哪一项。',
      '通知说 Friday Art is in Room 203，改的是美术的教室。音乐那行通知没提，仍是 106 室。旧安排上的 108 已经被换掉，不能再用。',
    ],
    next: '跟着核对一次',
  },
  build: {
    title: '跟着核对：美术现在在哪间教室',
    prompt: '先看下面的拆解，再选一项。',
    dialogueLines: ['Friday 4:00, Music, Room 106', 'Friday 4:00, Art, Room 108', 'Notice: From this week, Friday Art is in Room 203.'],
    guide: '题目问星期五美术。通知写的是 Art，正是美术，新教室 203。音乐那行通知没提，仍是 106。旧安排上美术的 108 要排掉。',
    options: [
      { id: 'old', label: '美术 108，音乐 106', hint: '108 是旧安排上的教室；通知说从这周起美术换到 203。' },
      { id: 'both', label: '美术 203，音乐 203', hint: '通知只改了美术。音乐那行没提，仍是 106。' },
      { id: 'correct', label: '美术 203，音乐 106' },
    ],
    answer: 'correct',
    success: '通知只动它点名的那一条，别的行保持原样。',
    next: '下一步：自己核对',
    backLabel: '回看讲解',
  },
  transfer: {
    title: '自己核对：这次改的是哪一门',
    prompt: '按通知，说出星期一十点这两门课分别在哪间教室。',
    dialogueLines: ['Monday 10:00, Art, Room 108', 'Monday 10:00, Music, Room 106', 'Notice: From this week, Monday Music is in Room 203.'],
    glossary: [['Notice', '通知'], ['From this week', '从这周起']],
    options: [
      { id: 'correct', label: '美术 108，音乐 203' },
      { id: 'stale', label: '美术 108，音乐 106', hint: '音乐正是通知改的那一门；106 是旧安排上的信息。' },
      { id: 'wrongrow', label: '美术 203，音乐 106', hint: '通知点的是 Music；美术那行没提，仍是 108。' },
    ],
    answer: 'correct',
    success: '通知这次改的是第二行，不是第一行；按通知点名，不按行序猜。',
  },
  done: {
    title: '你能排掉被改动过的旧信息', subtitle: '两份材料一起看时，先认通知改哪一条，再回安排里只看那一行。',
    english: 'From this week, Friday Art is in Room 203.', practice: '通知点名哪门课，就只改哪一行；别的行保持原样。',
    audio: 'From this week, Friday Art is in Room 203.',
  },
}, {
  id: 'timetable-decide', number: '第九十三课', title: '两份材料一起用：选出真正能去的',
  scene: '社团招新，安排表旁边还有一条条件说明。',
  goal: '把时间安排和条件说明同时用上，从几个选项里选出真正可行的那个。',
  stepLabels: ['先看讲解', '跟着选一次', '自己试一次'],
  example: {
    title: '一个是安排，一个是条件，两个都要满足',
    chinese: '安排给时间和教室；通知说这一周哪一项没有，或者要满足什么条件。',
    dialogue: [
      { speaker: '安排 · 星期五，第一个时段', english: 'Friday 9:00, Music Club, Room 106', chinese: '星期五九点，音乐社，106 室。' },
      { speaker: '安排 · 星期五，第二个时段', english: 'Friday 10:00, Art Club, Room 203', chinese: '星期五十点，美术社，203 室。' },
      { speaker: '通知 · 这周的情况', english: 'There is no Music Club this week.', chinese: '这周没有音乐社。' },
    ],
    teaching: [
      '这类题有两个条件：安排给你时间和教室，通知给你这周能不能去、或者谁才符合条件。',
      '想星期五去一个社团：通知说这周没有音乐社，九点那条就排掉；剩下美术社，十点，203 室。两个条件都满足，才是能去的那一个。',
    ],
    next: '跟着选一次',
  },
  build: {
    title: '跟着选：星期五能去哪一个',
    prompt: '先看下面的拆解，再选一项。',
    dialogueLines: ['Friday 9:00, Music Club, Room 106', 'Friday 10:00, Art Club, Room 203', 'Notice: There is no Music Club this week.'],
    guide: '想星期五去一个社团。通知说这周没有音乐社，九点那条排掉；剩下美术社，十点，203 室。时间和教室都从美术社这一行来，不要拿另一行的时间。',
    options: [
      { id: 'music', label: '星期五 9:00，音乐社，106 室', hint: '通知说这周没有音乐社，这一项要先排掉。' },
      { id: 'mix', label: '星期五 9:00，美术社，106 室', hint: '把两行拼在一起了：美术社是十点、203 室。' },
      { id: 'correct', label: '星期五 10:00，美术社，203 室' },
    ],
    answer: 'correct',
    success: '先排掉通知说不行的，再从剩下那一行读时间和教室。',
    next: '下一步：自己选',
    backLabel: '回看讲解',
  },
  transfer: {
    title: '自己选：不会游泳的同学能参加哪一项',
    prompt: '一个还不会游泳的同学，星期六能参加哪一项？',
    dialogueLines: ['Saturday 9:00, Swim Club, Room 106', 'Saturday 10:00, Drawing Club, Room 203', 'Notice: Swim Club is only for students who already know how to swim.'],
    glossary: [['Swim Club', '游泳社'], ['Drawing Club', '绘画社'], ['only for', '只限……参加'], ['already', '已经']],
    options: [
      { id: 'swim', label: '星期六 9:00，游泳社，106 室', hint: '游泳社要求已经会游泳；还不会游泳就不符合这个条件。' },
      { id: 'correct', label: '星期六 10:00，绘画社，203 室' },
      { id: 'mix', label: '星期六 9:00，绘画社，106 室', hint: '把两行拼在一起了：绘画社是十点、203 室。' },
      { id: 'mix2', label: '星期六 10:00，游泳社，203 室', hint: '时间和教室都借了另一行；游泳社本身也不符合条件。' },
    ],
    answer: 'correct',
    success: '先按条件排掉不能参加的，再从剩下那一行读时间和教室，两样都不跨行。',
  },
  done: {
    title: '你能把两份材料一起用上', subtitle: '时间、教室、这周是否举行、要什么条件，四个线索分开核对。',
    english: 'There is no Music Club this week.', practice: '先按通知排掉不行的，再只从剩下那一行读时间和教室，不要跨行拼。',
    audio: 'There is no Music Club this week.',
  },
}, {
  id: 'form-field', number: '第九十四课', title: '看报名表：按 Field 名找该填的那一栏',
  scene: '社团招新，桌上放着一张英文报名表。',
  goal: '按每一栏的名字（Name、Email、Activity、Class），把一条信息填进对应的那一栏。',
  stepLabels: ['先看讲解', '跟着找一栏', '自己试一次'],
  example: {
    title: '一张报名表：每一栏先写栏名，后面才是要填的内容',
    chinese: '表里 Name 填姓名，Email 填电子邮箱，Activity 填要参加的活动。',
    dialogue: [
      { speaker: '表头', english: 'Drawing Club: Sign-up form', chinese: '绘画社 · 报名表。' },
      { speaker: '第 1 栏', english: 'Name: ____', chinese: '这一栏填姓名。' },
      { speaker: '第 2 栏', english: 'Email: ____', chinese: '这一栏填电子邮箱。' },
      { speaker: '第 3 栏', english: 'Activity: ____', chinese: '这一栏填要参加的活动。' },
      { speaker: '表下小字', english: 'Please write in English.', chinese: '请用英语填写。' },
    ],
    teaching: [
      '表单里每一栏先写这一栏叫什么，英文叫 Field，冒号后面才是要填的内容。Name 是姓名，Email 是电子邮箱，Activity 是活动名称。',
      '要填一条信息，先看它是姓名、邮箱还是活动，再去找写着同一个 Field 名的那一栏。不要按第几栏记：换一张表，栏的顺序会变。',
    ],
    next: '跟着找一栏',
  },
  build: {
    title: '跟着找：邮箱写在哪一栏',
    prompt: '先看下面的拆解，再选一项。',
    dialogueLines: ['Name: ____', 'Email: ____', 'Activity: ____'],
    guide: 'Lin 的邮箱是 lin@school.example。中间有 @ 的这一串是电子邮箱，不是姓名，也不是活动。表里写着 Email 的那一栏，才是填邮箱的地方。',
    options: [
      { id: 'name', label: 'Name 那一栏', hint: 'Name 是姓名。要填的是一串带 @ 的电子邮箱，不是人名。' },
      { id: 'email', label: 'Email 那一栏' },
      { id: 'activity', label: 'Activity 那一栏', hint: 'Activity 是活动名称。这串带 @ 的内容是电子邮箱，不是活动。' },
    ],
    answer: 'email',
    success: '邮箱写在 Email 那一栏。先认栏名，再填。',
    next: '下一步：自己找一栏',
    backLabel: '回看讲解',
  },
  transfer: {
    title: '自己找：「2 班」写在哪一栏',
    prompt: '换一张读书社的报名表。要把「2 班」填进去，应该写在哪一栏？',
    dialogueLines: ['Book Club: Sign-up form', 'Activity: ____', 'Class: ____', 'Name: ____'],
    glossary: [['Class', '班级'], ['Activity', '活动名称'], ['Name', '姓名']],
    options: [
      { id: 'activity', label: 'Activity 那一栏', hint: 'Activity 是活动名称，写读书、绘画这一类。' },
      { id: 'name', label: 'Name 那一栏', hint: 'Name 是姓名，填的是人名。' },
      { id: 'class', label: 'Class 那一栏' },
    ],
    answer: 'class',
    success: '「2 班」填在 Class 那一栏。这张表把 Class 放在中间，换一张表位置又会变，认栏名就行。',
  },
  done: {
    title: '你能在报名表上找到该填的那一栏',
    subtitle: '不用读懂整张表，先认栏名，再把信息放进对应的空里。',
    english: 'Name: ____ Email: ____ Activity: ____',
    practice: '先看这条信息是姓名、邮箱、活动还是班级，再找写着同一个栏名的那一栏。',
    audio: 'Name. Email. Activity.',
  },
}, {
  id: 'receipt-status', number: '第九十五课', title: '看回执：Submitted、Confirmed 还是 Needs correction',
  scene: '交完报名表，回执上多了一行 Status。',
  goal: '读懂回执上的三种状态，按状态决定下一步做什么。',
  stepLabels: ['先看讲解', '跟着读状态', '自己试一次'],
  example: {
    title: '回执只写一个状态，三种状态的意思不一样',
    chinese: 'Status 一行只写一种：已交、已确认，或者有一项要改。',
    dialogue: [
      { speaker: '回执 · 活动', english: 'Receipt: Drawing Club', chinese: '回执 · 绘画社。' },
      { speaker: '回执 · 姓名', english: 'Name: Lin', chinese: '报名人 Lin。' },
      { speaker: '回执 · 状态', english: 'Status: Submitted', chinese: '已经交上去了，学校还在核对。' },
      { speaker: '回执 · 备注', english: 'Note: We will check your form. Please wait for a new receipt.', chinese: '我们会核对你的报名表，请等新的回执。' },
    ],
    teaching: [
      '回执上的 Status 只写一种状态，说的是表交上去以后到了哪一步。Submitted 是已交、还在等确认；Confirmed 是已经确认；Needs correction 是有一项要改。',
      '读完 Status 再读 Note。写 Submitted 时还要等新的回执，不能当成已经确认；写 Needs correction 时，还要看更正通知说改哪一项。',
    ],
    next: '跟着读状态',
  },
  build: {
    title: '跟着读：Submitted 时下一步做什么',
    prompt: '先看下面的拆解，再选一项。',
    dialogueLines: ['Status: Submitted', 'Note: We will check your form. Please wait for a new receipt.'],
    guide: 'Status 写 Submitted，说明表交上去了，还在核对。Note 也说 wait for a new receipt，要等新的回执。这会儿不是已经确认，也还没说要改哪一项。',
    options: [
      { id: 'confirmed', label: '已经确认，可以按回执上的时间去', hint: 'Confirmed 才是已确认。这一行写的是 Submitted，还没到那一步。' },
      { id: 'wait', label: '先等新的回执' },
      { id: 'fix', label: '先改一项再交一次', hint: 'Needs correction 才要说改哪一项。Note 里没说哪一项有错。' },
    ],
    answer: 'wait',
    success: 'Submitted 是已交、等确认，所以先等新的回执。',
    next: '下一步：自己读',
    backLabel: '回看讲解',
  },
  transfer: {
    title: '自己读：Confirmed 之后可以做什么',
    prompt: '换一张回执。Status 写 Confirmed，Note 里也写了时间和教室。现在可以做什么？',
    dialogueLines: ['Status: Confirmed', 'Note: See you on Friday at 4:00 in Room 203.'],
    glossary: [['Confirmed', '已确认'], ['See you', '到时候见']],
    options: [
      { id: 'again', label: '再交一次报名表', hint: 'Confirmed 是已经确认。再交一次不是这一步要做的事。' },
      { id: 'go', label: '按回执上的时间和教室去参加' },
      { id: 'wait', label: '再等一张新的回执', hint: '要等新回执的是 Submitted。这一行写的是 Confirmed。' },
    ],
    answer: 'go',
    success: 'Confirmed 表示已经确认，按回执上的时间和教室去参加就行。',
  },
  done: {
    title: '你能按回执上的状态决定下一步',
    subtitle: 'Status 一行只写一种：已交等确认、已确认，或者有一项要改。',
    english: 'Status: Submitted. Status: Confirmed. Status: Needs correction.',
    practice: '先读 Status，再看 Note 是说要等、可以去，还是要看更正通知。',
    audio: 'Status: Submitted. Status: Confirmed. Status: Needs correction.',
  },
}, {
  id: 'receipt-fix', number: '第九十六课', title: '回执和更正通知：只改通知点名的那一项',
  scene: '回执上写着 Needs correction，旁边还有一张更正通知。',
  goal: '对照回执和更正通知，只改通知点名的那一项，其余信息照回执保持原样。',
  stepLabels: ['先看讲解', '跟着核对', '自己试一次'],
  example: {
    title: '回执给原来的信息，通知只说改哪一项',
    chinese: '回执原来写星期五 4:00、203 室；通知请把教室改成 106 室，时间不变。',
    dialogue: [
      { speaker: '回执 · 时间', english: 'Friday 4:00', chinese: '星期五四点。' },
      { speaker: '回执 · 教室', english: 'Room 203', chinese: '203 室。' },
      { speaker: '回执 · 状态', english: 'Status: Needs correction', chinese: '有一项要改。' },
      { speaker: '更正通知', english: 'Notice: Please change the room to Room 106. The time stays the same.', chinese: '通知：请把教室改成 106 室，时间不变。' },
    ],
    teaching: [
      '更正通知不会把整条回执重写，只说改哪一项。change the room to Room 106 点的是教室；后面 The time stays the same 说时间不动。',
      '改完只换被点名的这一项，没点名的照抄回执：星期五 4:00，106 室。多改一项，或者有一项没改，都不对。',
    ],
    next: '跟着核对一次',
  },
  build: {
    title: '跟着核对：通知点名要改哪一项',
    prompt: '先看下面的拆解，再选一项。',
    dialogueLines: ['Receipt: Friday 4:00', 'Receipt: Room 203', 'Notice: Please change the room to Room 106. The time stays the same.'],
    guide: '通知第一句写 change the room，说明要动的是教室；后面 the time stays the same 说明时间不动。所以只改教室这一项，时间照回执上的星期五 4:00。',
    options: [
      { id: 'time', label: '只改时间', hint: '通知写的是 change the room。后面 the time stays the same 说时间不动。' },
      { id: 'room', label: '只改教室' },
      { id: 'both', label: '时间和教室都要改', hint: '通知只写了一项 change the room，后面还说时间不变。' },
    ],
    answer: 'room',
    success: '通知只点名一项，就只改这一项，另一项照回执。',
    next: '下一步：自己核对',
    backLabel: '回看讲解',
  },
  transfer: {
    title: '自己核对：改完之后，哪一组信息是对的',
    prompt: '换一张回执和一张通知。按通知改过以后，时间和教室分别是多少？',
    dialogueLines: ['Receipt: Monday 3:00', 'Receipt: Room 204', 'Notice: Please change the time to Monday 5:00. The room stays the same.'],
    glossary: [['change', '更改'], ['stays the same', '保持不变']],
    options: [
      { id: 'old', label: '星期一 3:00，204 室', hint: '通知里 change the time 已经把时间改了，3:00 是回执上的旧时间。' },
      { id: 'ok', label: '星期一 5:00，204 室' },
      { id: 'room2', label: '星期一 5:00，203 室', hint: '时间对上了。教室这一项通知写的是 the room stays the same，要照这张回执抄；203 是上一张回执上的教室。' },
      { id: 'both', label: '星期一 3:00，203 室', hint: '时间还是这张回执上的 3:00，没改；教室却从 204 变成了 203，而通知说教室不变。两项都跟通知对不上。' },
    ],
    answer: 'ok',
    success: '只换通知点名的时间，教室照回执抄。两项都对，才是改完的结果。',
  },
  done: {
    title: '你能只按证据改一项',
    subtitle: '通知点名哪一项就改哪一项，没点名的照回执抄，改完再把两项一起核对。',
    english: 'Please change the room to Room 106. The time stays the same.',
    practice: '先找 change 后面改的是哪一项，再看 stays the same 说的是哪一项没动。',
    audio: 'Please change the room to Room 106. The time stays the same.',
  },
},
{
  id: 'price-tag', number: '第九十七课', title: '看价签：每个的价，还是一组的价',
  scene: '校园义卖的书桌上摆着几张手写价签。',
  goal: '从短价签上分清「每一个多少钱」、写成一组的价钱，以及整单的 total。',
  stepLabels: ['先看讲解', '跟着看价签', '自己试一次'],
  example: {
    title: '三张价签：每个多少钱，还是一组多少钱',
    chinese: '笔记本每本 6 元；铅笔 2 支一共 5 元；贴纸每张 1 元。整单合起来多少，看小票上的 total。',
    dialogue: [
      { speaker: '价签 · 笔记本', english: 'Notebook: 6 yuan each', chinese: '笔记本：每本 6 元。' },
      { speaker: '价签 · 铅笔', english: 'Pencil: 2 for 5 yuan', chinese: '铅笔：2 支一共 5 元。' },
      { speaker: '价签 · 贴纸', english: 'Sticker: 1 yuan each', chinese: '贴纸：每张 1 元。' },
      { speaker: '小票最后一行', english: 'Total: 12 yuan', chinese: '总价：12 元。' },
    ],
    teaching: [
      'each 紧跟在价钱后面，说的是「每一个」的价钱：6 yuan each 是每本 6 元，1 yuan each 是每张 1 元。',
      '价签上写 2 for 5 yuan，5 元是这一组的总价：5 元可以买 2 个，也就是 2 个一共 5 元，不是每个 5 元。',
      'total 是整单合起来多少钱，写在小票最后那一行，不是某一件东西的价钱。',
    ],
    next: '跟着看价签',
  },
  build: {
    title: '跟着看：这张价签说的是一个还是一组',
    prompt: '先看下面的拆解，再选一项。',
    dialogueLines: ['Eraser: 1 yuan each', 'Pencil: 2 for 5 yuan'],
    guide: '第一张写 1 yuan each，each 是每一个，所以一块橡皮 1 元。第二张写 2 for 5 yuan，2 和 5 中间有 for，这一行的价钱按 2 支一组算：5 元买 2 支，2 支一共 5 元，不是每支 5 元。',
    options: [
      { id: 'a', label: '橡皮每块 1 元' },
      { id: 'b', label: '橡皮两块 1 元', hint: '这张价签写的是 1 yuan each，each 指每一个；上面没有 2 for 这样的组数。' },
      { id: 'c', label: '铅笔每支 5 元', hint: '铅笔那张写 2 for 5 yuan，5 元是这一组 2 支的总价。要按「2 支一共」算，不是每支 5 元。' },
    ],
    answer: 'a',
    success: 'each 说的是每一个的价钱；2 for 5 yuan 说的是 2 个一共的价钱。',
    next: '下一步：自己看一张',
    backLabel: '回看讲解',
  },
  transfer: {
    title: '自己看：换一张义卖价签',
    prompt: '换一场义卖，价签换了内容。下面哪一句读对了？',
    dialogueLines: ['Bookmark: 3 yuan each', 'Notebook: 2 for 9 yuan'],
    glossary: [['bookmark', '书签'], ['notebook', '笔记本']],
    options: [
      { id: 'a', label: '书签两张 3 元', hint: '书签那一行写 3 yuan each，each 是每一个；2 for 9 yuan 在笔记本那一行。' },
      { id: 'b', label: '书签每张 3 元' },
      { id: 'c', label: '笔记本每本 9 元', hint: '笔记本那一行写 2 for 9 yuan，9 元是这 2 本的总价。要按「2 本一共」算，不是每本 9 元。' },
    ],
    answer: 'b',
    success: 'each 紧跟在价钱后面，是每一个的价；写成 2 for 9 yuan，这个价钱属于一组。',
  },
  done: {
    title: '你能分清单价、成组价和 total',
    subtitle: 'each 跟在价钱后是每一个的价钱，写成 2 for 的是一组的价钱，total 是整单合计。',
    english: 'Notebook: 6 yuan each. Pencil: 2 for 5 yuan.',
    practice: '先看价钱后面是不是 each（每个的价），再看有没有 2 for（一组的总价），最后才看 total。',
    audio: 'Notebook: 6 yuan each. Pencil: 2 for 5 yuan.',
  },
},
{
  id: 'price-offer', number: '第九十八课', title: '看优惠说明：对谁有效、买几个才算',
  scene: '文具店收银台旁边贴着一张优惠说明。',
  goal: '读清一条优惠的两个门槛：数量门槛（two or more）和对象门槛（only for），再看这个价钱是不是单价。',
  stepLabels: ['先看讲解', '跟着读条件', '自己试一次'],
  example: {
    title: '一条优惠说明：先看买几个，再看谁能用',
    chinese: '笔记本两本及以上每本 5 元；这条只限有学生证的同学。只买一本还是 6 元。',
    dialogue: [
      { speaker: '优惠 · 第一行', english: 'Notebooks: two or more, 5 yuan each', chinese: '笔记本：两本及以上，每本 5 元。' },
      { speaker: '优惠 · 第二行', english: 'Only for students with a school card', chinese: '只限有学生证的同学。' },
      { speaker: '价签', english: 'One notebook: 6 yuan', chinese: '一本笔记本 6 元。' },
    ],
    teaching: [
      'two or more 是数量门槛：两本或者更多，才按 5 元一本。只买一本不满足，还是 6 元。',
      'only for 是对象门槛：后面写谁，就只有谁能用这条优惠。没有学生证的同学，不在这条优惠里。',
      '两个门槛都要满足：买够两本、又有学生证，5 yuan each 才成立。价钱后面有 each，说的还是每本。',
    ],
    next: '跟着读条件',
  },
  build: {
    title: '跟着读：只买一本，能不能用 5 元这个价',
    prompt: '先看下面的拆解，再选一项。',
    dialogueLines: ['Notebooks: two or more, 5 yuan each', 'One notebook: 6 yuan'],
    guide: '优惠第一句写 two or more，意思是两本或更多。只买一本，数量不到两本，这个条件没满足，所以按价签上的 6 元，不是 5 元。',
    options: [
      { id: 'a', label: '买一本用不了 5 元，还是 6 元' },
      { id: 'b', label: '买一本也能用 5 元', hint: '那句写的是 two or more：两本或更多才算。一本不满足两本这个条件。' },
      { id: 'c', label: '不管买几本，都是 5 元一本', hint: '5 yuan each 前面还有一段 two or more，它把这个价钱限制在两本及以上。' },
    ],
    answer: 'a',
    success: 'two or more 是数量门槛：先数够不够两本，再谈价钱。',
    next: '下一步：自己读一条',
    backLabel: '回看讲解',
  },
  transfer: {
    title: '自己读：这个 8 元的优惠价对谁有效',
    prompt: '换一家文具店，优惠说明换了内容。关于这套文具的价钱，下面哪一句读对了？',
    dialogueLines: ['Offer: Pen set 8 yuan', 'Only for students with a school card'],
    glossary: [['offer', '优惠'], ['pen set', '文具套装'], ['school card', '学生证']],
    options: [
      { id: 'a', label: '没有学生证也能用 8 元这个价', hint: 'Only for 后面写的是 students with a school card，它说明这个 8 元对谁有效；没有学生证的同学不在里面。' },
      { id: 'b', label: '8 元这个优惠价只对有学生证的同学' },
      { id: 'c', label: '8 元是所有同学都能用的普通价', hint: '第二行写 Only for students with a school card，说明 8 元前面还有一条限制，不是人人可用的普通价。' },
    ],
    answer: 'b',
    success: '8 元这个优惠价只对有学生证的同学。Only for 限的是这条价钱对谁有效。',
  },
  done: {
    title: '你能读出优惠价的两个门槛',
    subtitle: 'two or more 说买够几个才算这个价，only for 说这个优惠价对谁有效，价钱后面有 each 就还是单价。',
    english: 'Notebooks: two or more, 5 yuan each. Only for students with a school card.',
    practice: '先看数量门槛，再看这个优惠价对谁有效，最后确认这个价钱是不是每个的价钱。',
    audio: 'Notebooks: two or more, 5 yuan each. Only for students with a school card.',
  },
},
{
  id: 'price-receipt', number: '第九十九课', title: '对一对：小票上哪一项跟价签和优惠对不上',
  scene: '义卖结束后，价签和优惠说明还贴在桌上，手里是一张交易小票。',
  goal: '把价签、优惠说明和交易小票并排看，逐行核对单价，指出收费跟材料不符的那一项，并把依据说清楚。',
  stepLabels: ['先看讲解', '跟着对一次', '自己试一次'],
  example: {
    title: '两份材料并排：一份写该收多少，一份写收了多少',
    chinese: '价签写笔记本每本 6 元、橡皮每块 1 元，两本及以上每本 5 元。小票上两本笔记本却按每本 6 元收，这一行跟材料对不上；橡皮 1 元两边一致。',
    dialogue: [
      { speaker: '材料一 · 价签', english: 'Notebook: 6 yuan each', chinese: '笔记本：每本 6 元。' },
      { speaker: '材料一 · 优惠', english: 'Two or more notebooks: 5 yuan each', chinese: '两本及以上：每本 5 元。' },
      { speaker: '材料一 · 价签', english: 'Eraser: 1 yuan each', chinese: '橡皮：每块 1 元。' },
      { speaker: '材料二 · 小票第一行', english: 'Receipt: 2 notebooks, 6 yuan each', chinese: '小票：笔记本 2 本，每本 6 元。' },
      { speaker: '材料二 · 小票第二行', english: 'Receipt: 1 eraser, 1 yuan each', chinese: '小票：橡皮 1 块，每块 1 元。' },
    ],
    teaching: [
      '这里有两份材料：材料一是价签和优惠，材料二是交易小票。小票每一行先写物品和买了几件，再写每件多少钱。',
      '核对时先看小票这一行的件数，再回材料一找同一样东西的价钱。橡皮的价签写 1 yuan each，小票也是每块 1 元，这一行对得上。',
      '笔记本买了 2 本，够 two or more，优惠价是每本 5 元；小票写每本 6 元，这一行跟材料对不上。只比单价这一栏，不用自己算总价。',
    ],
    next: '跟着对一次',
  },
  build: {
    title: '跟着对：小票上哪一行的单价不对',
    prompt: '先看下面的拆解，再选一项。',
    dialogueLines: ['Material 1 - Price tag: Pencil 2 yuan each', 'Material 1 - Price tag: Eraser 1 yuan each', 'Material 2 - Receipt: 1 pencil, 2 yuan each', 'Material 2 - Receipt: 1 eraser, 3 yuan each'],
    guide: '小票第一行是铅笔，每支 2 元；价签也写 2 yuan each，两边一样，对得上。第二行是橡皮，小票写每块 3 元，价签写的是 1 yuan each，两个数字不一样，对不上。',
    options: [
      { id: 'a', label: '橡皮这一行：价签 1 元，小票收 3 元' },
      { id: 'b', label: '铅笔这一行：价签 2 元，小票收 2 元', hint: '铅笔两边都是 2 元，这一行对得上。题目要找的是对不上的那一行。' },
      { id: 'c', label: '两行都对得上', hint: '再回材料一行一行看：橡皮的价签写的是多少，小票收的又是多少，这两个数字并不一样。' },
    ],
    answer: 'a',
    success: '一行一行比单价：两边一样是对得上，两边不一样才是要指出的那一项。',
    next: '下一步：自己对一次',
    backLabel: '回看讲解',
  },
  transfer: {
    title: '自己对：义卖小票上哪一项跟材料不符',
    prompt: '换一场义卖。材料一是价签和优惠，材料二是小票。哪一项的收费跟材料对不上？',
    dialogueLines: ['Material 1 - Tag: Notebook 6 yuan each', 'Material 1 - Offer: Two or more notebooks, 5 yuan each', 'Material 1 - Tag: Pen 2 yuan each', 'Material 2 - Receipt: 2 notebooks, 5 yuan each', 'Material 2 - Receipt: 1 pen, 3 yuan each'],
    glossary: [['receipt', '小票'], ['offer', '优惠说明'], ['tag', '价签']],
    options: [
      { id: 'a', label: '笔记本：两本按每本 5 元收', hint: '买了 2 本，满足 two or more，优惠价就是每本 5 元。这一行跟材料一样，对得上。' },
      { id: 'b', label: '笔：价签 2 元，小票收 3 元' },
      { id: 'c', label: '两项都对得上，没有问题', hint: '再回材料看笔那一行：价签写的是多少，小票收的又是多少，这两个数字并不一样。' },
    ],
    answer: 'b',
    success: '先看小票这一行买了几个，再回材料找同一样东西的单价；两边数字不一样，就是收费跟材料不符的那一项。',
  },
  done: {
    title: '你能拿两份材料核对一张小票',
    subtitle: '价签和优惠写该收多少，小票写实收多少；一行一行比单价，找出对不上的那一项。',
    english: 'Receipt: 2 notebooks, 6 yuan each. Offer: Two or more notebooks, 5 yuan each.',
    practice: '先看小票这一行的件数，再回价签和优惠找同一样东西的单价；只比数字，不自己算总价。',
    audio: 'Receipt: 2 notebooks, 6 yuan each. Offer: Two or more notebooks, 5 yuan each.',
  },
},
// 每个单元的选做加练按课号追加。
...[
  {
    "unit": 1,
    "id": "unit-01-practice",
    "number": "第一百课",
    "title": "加练：打招呼、说名字、问名字、回一句",
    "goal": "把打招呼、说名字、问名字、回应「很高兴认识你」连起来用。",
    "example": "Hi, I’m Bo. Nice to meet you.",
    "chinese": "你好，我是 Bo。很高兴认识你。",
    "terms": [
      [
        "Hi",
        "你好"
      ],
      [
        "I’m Bo",
        "我是 Bo"
      ],
      [
        "Nice to meet you",
        "很高兴认识你"
      ],
      [
        "What’s your name?",
        "你叫什么名字？"
      ],
      [
        "too",
        "也"
      ]
    ],
    "rule": "见面先说 Hi，再说 I’m 加自己的名字；想知道对方叫什么，用 What’s your name?；对方说 Nice to meet you，就用同一句加 too 回过去。换人只换名字，其他部分不动。",
    "guided": "Hi, I’m Jia. Nice to meet you.",
    "walkthrough": "对方先说了自己的名字 Jia，再说很高兴认识你。这时不用再报名字，用同一句加 too 回过去。",
    "guidedAnswers": [
      [
        "Hi, I’m Jia.",
        "Jia 是对方的名字，这样答等于把对方的名字当成自己的。"
      ],
      [
        "What’s your name?",
        "对方已经报了名字，这句用不上了。"
      ],
      [
        "Nice to meet you, too."
      ]
    ],
    "independent": [
      "Hi, I’m Tao. What’s your name?"
    ],
    "checkPrompt": "对方在问你的名字。你叫 Wen，该怎么答？",
    "answers": [
      [
        "Nice to meet you, too.",
        "对方在问你名字，还没说很高兴认识你。"
      ],
      [
        "Hi, I’m Wen."
      ],
      [
        "Hi, I’m Tao.",
        "Tao 是对方的名字，不能当成自己的名字。"
      ]
    ],
    "recap": "见到人先说 Hi 和自己的名字；对方问名字就报自己的名字，对方说很高兴认识你就加 too 回过去。"
  },
  {
    "unit": 2,
    "id": "unit-02-practice",
    "number": "第一百零一课",
    "title": "加练：一张新通知，时间地点要带的东西分开找",
    "goal": "在一张没读过的通知里，分别找出开始时间、集合地点和自己要带的东西。",
    "example": "The show starts at 7 p.m. on Friday. Meet in the school hall. Bring a chair.",
    "chinese": "演出星期五晚上七点开始，在学校礼堂集合，自己带一把椅子。",
    "terms": [
      [
        "the show",
        "演出"
      ],
      [
        "starts at",
        "在几点开始"
      ],
      [
        "school hall",
        "学校礼堂"
      ],
      [
        "Bring a chair",
        "带一把椅子"
      ],
      [
        "Doors open",
        "开门"
      ],
      [
        "computer lab",
        "计算机教室；机房"
      ],
      [
        "meeting",
        "会议"
      ]
    ],
    "rule": "一条通知常有三块信息：starts at 后面是开始的时间，on 后面是星期，Meet in 后面是集合地点，Bring 后面是自己要带的东西。看到 Doors open 要分清：那只是开门，不是开始。",
    "guided": [
      "Doors open at 8:30 a.m. on Saturday.",
      "The show starts at 9 a.m. on Saturday."
    ],
    "walkthrough": "两行都有时间。要看演出开始，就找写着 starts 的那一行：9 a.m.。8:30 那行开头是 Doors open，说的只是开门。",
    "guidedAnswers": [
      [
        "上午九点"
      ],
      [
        "上午八点半",
        "8:30 那行写的是 Doors open（开门），演出开始要看 starts at。"
      ],
      [
        "晚上九点",
        "9 a.m. 里的 a.m. 是上午，不是晚上。"
      ]
    ],
    "independent": [
      "Doors open at 1:30 p.m. on Monday.",
      "The meeting starts at 2 p.m. on Monday.",
      "Meet in the computer lab.",
      "Bring a notebook. The school will lend you a pen."
    ],
    "checkPrompt": "这次会议几点开始、在哪儿开、要自己带什么？",
    "answers": [
      [
        "下午两点开始，在机房，带笔记本"
      ],
      [
        "下午一点半开始，在机房，带笔记本",
        "1:30 那行写的是 Doors open（开门），开始要看 starts at。"
      ],
      [
        "下午两点开始，在机房，带笔",
        "笔前面是 lend you，是学校借给你的；Bring 后面才是自己带的。"
      ]
    ],
    "recap": "先想自己要哪条信息，再找对应短语：starts at 找时间，Meet in 找地点，Bring 找自带的东西。",
    "transferGlossary": [
      [
        "lend you",
        "借给你"
      ],
      [
        "computer lab",
        "计算机教室；机房"
      ]
    ]
  },
  {
    "unit": 3,
    "id": "unit-03-practice",
    "number": "第一百零二课",
    "title": "加练：一句说事，一句说它是哪样",
    "goal": "先从短句里找做事的人和做的事，再回前一句弄清 it 指哪一样东西。",
    "example": "Mei buys a bag. It is small.",
    "chinese": "Mei 买了一个包。它很小。",
    "terms": [
      [
        "buys",
        "买"
      ],
      [
        "a bag",
        "一个包"
      ],
      [
        "small",
        "小的"
      ],
      [
        "it",
        "它，指前面提到的那样东西"
      ],
      [
        "notebook",
        "笔记本"
      ],
      [
        "clock",
        "钟"
      ],
      [
        "hall",
        "礼堂"
      ],
      [
        "photo",
        "照片"
      ],
      [
        "tell the time",
        "显示时间（钟表）"
      ],
      [
        "pages",
        "页（page 的复数）"
      ],
      [
        "ruler",
        "尺子"
      ]
    ],
    "rule": "第一句先找谁做了什么：Mei 是做事的人，buys 是动作，a bag 是买的东西。第二句用 it 代替前面那样东西。前面有两样东西时，把 it 后面的描述分别换回去试。",
    "guided": [
      "Bo borrows a notebook and a ruler.",
      "It has ten pages."
    ],
    "walkthrough": "前一句里有笔记本和尺子。十页（ten pages）说的是笔记本。把 It 换成笔记本，再把后一句读一遍。",
    "guidedAnswers": [
      [
        "尺子",
        "尺子虽然离 It 更近，但有十页说的是笔记本。"
      ],
      [
        "笔记本"
      ],
      [
        "Bo",
        "Bo 是人，第二句用的是 it，不指人。"
      ]
    ],
    "independent": [
      "The hall has a photo and a clock.",
      "It tells the time."
    ],
    "checkPrompt": "第二句的 It 指哪一样？",
    "answers": [
      [
        "照片",
        "照片不会告诉人时间；tell the time 说的是钟。"
      ],
      [
        "礼堂",
        "It 指礼堂里的一样东西，不是礼堂本身。"
      ],
      [
        "钟"
      ]
    ],
    "recap": "先把「谁做什么」读出来，再把 it 后面的描述换回前面每一样东西，接得通的那个才是 it。",
    "transferGlossary": [
      [
        "hall",
        "礼堂"
      ],
      [
        "tells the time",
        "报出时间"
      ]
    ]
  },
  {
    "unit": 4,
    "id": "unit-04-practice",
    "number": "第一百零三课",
    "title": "加练：比两个时间，推一件事，别加原文没有的原因",
    "goal": "把两条时间信息放在一起比，只推出原文撑得住的结论，不自己补原因。",
    "example": "The bus left at 8:00 a.m. Mei got to the stop at 8:15 a.m.",
    "chinese": "公交早上八点开走。Mei 八点十五到车站。",
    "terms": [
      [
        "left at",
        "在几点开走"
      ],
      [
        "got to the stop",
        "到车站"
      ],
      [
        "stop",
        "车站"
      ],
      [
        "sits down",
        "坐下"
      ],
      [
        "film",
        "电影"
      ]
    ],
    "rule": "推断题只把原文两条信息连起来：8:15 晚于 8:00，车已经开走了。原文没有写她为什么晚到，就不要加「睡过头」这类原因。",
    "guided": "The shop closes at 6:00 p.m. Bo arrives at 6:20 p.m.",
    "walkthrough": "先找两个时间：关门 6:00 p.m.，到店 6:20 p.m.。6:20 晚于 6:00，所以 Bo 到的时候店已经关了。",
    "guidedAnswers": [
      [
        "Bo 在店里买了东西",
        "6:20 晚于关门的 6:00，店已经关了。"
      ],
      [
        "Bo 因为下雨来晚了",
        "原文只给了两个时间，没有提下雨，不能自己补原因。"
      ],
      [
        "Bo 到的时候，店已经关门了"
      ]
    ],
    "independent": "The film starts at 2:00 p.m. Lin sits down at 1:50 p.m.",
    "checkPrompt": "只根据这两句，能推断出哪一项？",
    "answers": [
      [
        "Lin 在电影开始前坐好了"
      ],
      [
        "Lin 迟到了",
        "1:50 比 2:00 早，是开始前，不是迟到。"
      ],
      [
        "电影改到了一点五十",
        "原文只给了开始时间和她坐下的时间，没有说改期。"
      ]
    ],
    "recap": "推断只做一步：把两条信息比一比。原文没写的理由和改动，都不能自己补进去。",
    "transferGlossary": [
      [
        "film",
        "电影"
      ],
      [
        "sits down",
        "坐下"
      ]
    ]
  },
  {
    "unit": 5,
    "id": "unit-05-practice",
    "number": "第一百零四课",
    "title": "加练：现在正在做，还是那时正在做",
    "goal": "认出 be + -ing 的两种时间：now 说现在正在做，过去某一刻用 was 或 were。",
    "example": "Mei is cleaning the desk now. Yesterday at eight, she was cleaning the desk.",
    "chinese": "Mei 现在正在擦桌子。昨天八点的时候，她正在擦桌子。",
    "terms": [
      [
        "is cleaning",
        "现在正在擦"
      ],
      [
        "was cleaning",
        "那时正在擦"
      ],
      [
        "now",
        "现在"
      ],
      [
        "Yesterday at eight",
        "昨天八点"
      ]
    ],
    "rule": "现在正在做，用 am、is 或 are 加 -ing；说过去某一刻正在做，把 be 换成 was 或 were，后面的 -ing 不变。Mei 是一个人，现在用 is，过去用 was。",
    "guided": "Bo is reading a map now. Yesterday at nine, he ____ a map.",
    "walkthrough": "前一句有 now，是现在正在读：is reading。后一句用 Yesterday at nine 把时间放到过去那一刻，主语还是 he，所以 be 换成 was，-ing 不动。",
    "guidedAnswers": [
      [
        "was reading"
      ],
      [
        "is reading",
        "Yesterday at nine 说的是过去那一刻，be 要换成 was。"
      ],
      [
        "were reading",
        "主语是 he，过去这里用 was，不用 were。"
      ]
    ],
    "independent": "Lin is drawing a poster now. Yesterday at ten, she ____ a poster.",
    "checkPrompt": "后一句说的是昨天十点那一刻，空格该填什么？",
    "answers": [
      [
        "were drawing",
        "主语是 she，过去这里用 was，不用 were。"
      ],
      [
        "is drawing",
        "Yesterday at ten 指过去那一刻，不用 is。"
      ],
      [
        "was drawing"
      ]
    ],
    "recap": "now 配 am、is 或 are 加 -ing；过去某一刻配 was 或 were 加 -ing，-ing 那部分不变。"
  },
  {
    "unit": 6,
    "id": "unit-06-practice",
    "number": "第一百零五课",
    "title": "加练：写邮件前，先找出收件人和要写的事",
    "goal": "从题目里找出写给谁、必须交代哪几件事，不把没问的写进正文。",
    "example": "Write to Ms. Chen. Tell her which club you want to join and why.",
    "chinese": "写信给陈老师，告诉她你想加入哪个社团、为什么。",
    "terms": [
      [
        "write to",
        "写信给"
      ],
      [
        "which club",
        "哪个社团"
      ],
      [
        "join",
        "加入"
      ],
      [
        "why",
        "为什么"
      ],
      [
        "favorite sport",
        "最喜欢的运动"
      ],
      [
        "how often",
        "多久一次"
      ]
    ],
    "rule": "先看 write to 后面是谁，那是收件人。再看 Tell her 或 Tell him 后面跟了哪几件事：which club 问社团，why 问原因。题目没问的，不用写进正文。",
    "guided": "Write to Mr. Li. Tell him when you can come and what you can bring.",
    "walkthrough": "收件人是 Mr. Li。这封邮件要交代两件事：when you can come（什么时候能来）和 what you can bring（能带什么）。题目里没有 why。",
    "guidedAnswers": [
      [
        "只写为什么想参加",
        "题目问的是 when 和 what，没有 why。"
      ],
      [
        "什么时候能来、能带什么"
      ],
      [
        "什么时候能来、在哪儿集合",
        "when 对了；题目没有问地点，另一项要的是能带什么（what you can bring）。"
      ]
    ],
    "independent": "Write to Anna. Tell her your favorite sport and how often you play it.",
    "checkPrompt": "新题目要你写哪两件事？选把要点列全的那一项。",
    "answers": [
      [
        "在哪儿玩、和谁一起玩",
        "题目问的是 how often（多久一次），不是在哪儿或和谁。"
      ],
      [
        "最喜欢的运动、多久玩一次"
      ],
      [
        "为什么喜欢 Anna",
        "Anna 是收件人，题目没让你写对她的看法。"
      ]
    ],
    "recap": "先核对收件人，再逐项检查正文有没有回答题目的要求。",
    "transferGlossary": [
      [
        "favorite sport",
        "最喜欢的运动"
      ],
      [
        "how often",
        "多久一次"
      ]
    ]
  },
  {
    "unit": 7,
    "id": "unit-07-practice",
    "number": "第一百零六课",
    "title": "加练：换了说法，时间跟事实有没有变",
    "goal": "对照时间和否定范围，判断改写后的句子跟原材料是不是同一个意思。",
    "example": "The club meets on Thursday. New members do not need to bring a photo.",
    "chinese": "社团星期四活动。新成员不必带照片。",
    "terms": [
      [
        "meets on",
        "在星期几活动"
      ],
      [
        "new members",
        "新成员"
      ],
      [
        "do not need to bring",
        "不必带"
      ],
      [
        "photo",
        "照片"
      ],
      [
        "closes",
        "关门"
      ],
      [
        "return",
        "归还"
      ]
    ],
    "rule": "换说法要守住三样：谁、什么时候、否定到哪儿。do not need to 是「不必」，不是「不准」；meets on Thursday 说活动在星期四，不能改成别的日子。",
    "guided": "The meeting starts at 3 p.m. You do not need to bring a pen.",
    "walkthrough": "do not need to bring a pen 说的是带笔不是必须的，带不带都行。它不是禁止带笔；三点那句只给开始时间，也没说三点前必须到。",
    "guidedAnswers": [
      [
        "不准带笔",
        "do not need to 是「不必」，不是禁止。"
      ],
      [
        "必须三点前到",
        "starts at 3 p.m. 是三点开始，不是三点前必须到。"
      ],
      [
        "不必带笔"
      ]
    ],
    "independent": "The library closes at 5 p.m. You do not need to return the book today.",
    "checkPrompt": "哪一项跟材料说的一致？",
    "answers": [
      [
        "今天不必还书"
      ],
      [
        "今天不准还书",
        "do not need to 是「不必」，不是禁止还书。"
      ],
      [
        "图书馆五点开门",
        "closes at 5 p.m. 是五点关门，不是开门。"
      ]
    ],
    "recap": "改写先比三样：人有没有换、时间有没有换、not 管到哪儿。",
    "transferGlossary": [
      [
        "closes",
        "关门"
      ],
      [
        "return",
        "归还"
      ]
    ]
  },
  {
    "unit": 8,
    "id": "unit-08-practice",
    "number": "第一百零七课",
    "title": "加练：一条通知里的最迟时间、条件和改过的安排",
    "goal": "在一张办事通知里分清最迟时间、只对谁生效的条件，以及已经改掉和还在用的安排。",
    "example": "Send your name by 4 p.m. on Wednesday. If you are new, write NEW after your name. We now meet in Room 102, not Room 201.",
    "chinese": "最迟星期三下午四点把名字发来。如果你是新成员，在名字后面写 NEW。现在改到 102 室，不是 201 室。",
    "terms": [
      [
        "by 4 p.m.",
        "最迟下午四点"
      ],
      [
        "If you are new",
        "如果你是新成员"
      ],
      [
        "now",
        "现在，提示改动"
      ],
      [
        "not Room 201",
        "不是 201 室"
      ],
      [
        "hand in",
        "上交"
      ],
      [
        "lost",
        "丢了"
      ],
      [
        "front desk",
        "前台"
      ],
      [
        "office window",
        "办公室窗口"
      ]
    ],
    "rule": "by 给最迟时间，早一点也可以；if 限定这条只对谁生效；now 引出新安排，not 后面是被换掉的旧安排。三样各查一遍，再合起来。",
    "guided": "Send your form by 5 p.m. on Friday. If you are in Class 2, use the blue form.",
    "walkthrough": "by 5 p.m. on Friday 是最迟时间，星期五下午五点或之前交都可以。if 后面只说 Class 2，说明这条只管 2 班：2 班用蓝表，别的班不算。",
    "guidedAnswers": [
      [
        "最迟星期五下午五点；2 班用蓝表"
      ],
      [
        "最迟星期五下午五点；所有人都用蓝表",
        "If you are in Class 2 只限定 2 班。"
      ],
      [
        "必须正好五点交；2 班用蓝表",
        "by 5 p.m. 是最迟时间，早交也可以。"
      ]
    ],
    "independent": [
      "Hand in your form by 9 a.m. on Monday.",
      "If you lost your old card, write LOST on the form.",
      "We now use the office window, not the front desk."
    ],
    "checkPrompt": "如果你丢了旧卡，按这条通知：什么时候交、要在表上写什么、去哪儿交？",
    "answers": [
      [
        "最迟星期一上午九点；不用写；去办公室窗口",
        "丢了旧卡的人要在表上写 LOST，这条不能省。"
      ],
      [
        "必须正好星期一上午九点；写 LOST；去办公室窗口",
        "by 9 a.m. 是最迟时间，早一点交也可以，不必正好九点。"
      ],
      [
        "最迟星期一上午九点；写 LOST；去办公室窗口"
      ]
    ],
    "recap": "截止看 by，条件看 if，改动看 now 和 not。三样都查到，才算把通知读完。",
    "transferGlossary": [
      [
        "hand in",
        "上交"
      ],
      [
        "front desk",
        "前台"
      ],
      [
        "office window",
        "办公室窗口"
      ]
    ]
  },
  {
    "unit": 9,
    "id": "unit-09-practice",
    "number": "第一百零八课",
    "title": "加练：草稿缺哪一块，就补哪一句",
    "goal": "根据题目要的要点，判断草稿还缺哪一块，再补上带细节或带理由的那一句。",
    "example": "I like the cooking club because we cook together on Fridays.",
    "chinese": "我喜欢烹饪社，因为我们星期五一起做饭。",
    "terms": [
      [
        "cooking club",
        "烹饪社"
      ],
      [
        "because",
        "因为"
      ],
      [
        "cook together",
        "一起做饭"
      ],
      [
        "on Fridays",
        "每逢星期五"
      ],
      [
        "reading club",
        "读书社"
      ],
      [
        "very much",
        "很，非常"
      ]
    ],
    "rule": "题目要细节，就补时间、地点或一起做事的人；题目要理由，就用 because 接一件具体的事。只重复「我很喜欢」不算补内容。",
    "guided": "I like the art club.",
    "walkthrough": "这一步的题目要写「喜欢什么活动、什么时候参加」。草稿只说了喜欢哪个社团，还缺什么时候参加这一块，所以补的句子要带时间。",
    "guidedAnswers": [
      [
        "I really like the art club.",
        "这句还是只说喜欢，没有补时间。"
      ],
      [
        "We meet in the art room on Tuesdays."
      ],
      [
        "The art club is very good.",
        "good 没有说明什么时候参加。"
      ]
    ],
    "independent": "I like the reading club.",
    "checkPrompt": "题目要的是「喜欢什么活动、为什么喜欢」。草稿缺的是哪一块，该补哪一句？",
    "answers": [
      [
        "I like it because I can read with my friends."
      ],
      [
        "I like the reading club very much.",
        "这句只是把喜欢又说了一遍，没有给理由。"
      ],
      [
        "The reading club is in the library.",
        "地点回答不了为什么喜欢，题目要的是原因。"
      ]
    ],
    "recap": "先看题目列了几项，再看草稿写了哪几项，缺的那项才去补。补的句子要带新信息。",
    "transferGlossary": [
      [
        "reading club",
        "读书社"
      ]
    ]
  },
  {
    "unit": 10,
    "id": "unit-10-practice",
    "number": "第一百零九课",
    "title": "加练：空里的词，靠搭配和前后句来定",
    "goal": "先用熟悉的搭配缩小范围，再看前后两句写了什么，最后把词放回去读一遍。",
    "example": "It was hot, so we took a short break under the tree.",
    "chinese": "天气很热，所以我们在树下休息了一小会儿。",
    "terms": [
      [
        "hot",
        "热的"
      ],
      [
        "take a break",
        "休息一下"
      ],
      [
        "under the tree",
        "在树下"
      ],
      [
        "so",
        "所以"
      ],
      [
        "turn on",
        "打开（灯）"
      ],
      [
        "light",
        "灯"
      ],
      [
        "photo",
        "照片"
      ],
      [
        "take a photo of",
        "给……拍照"
      ],
      [
        "bus",
        "公交车"
      ]
    ],
    "rule": "先把空格和旁边的词连起来读：take a photo of 是给某处拍照，take a bus 是坐车，take a break 是休息；turn on 后面常接 light、TV 这类东西。搭配通顺以后，再看前后句说的是什么情况。",
    "guided": "Mei took a ____ of the new hall.",
    "walkthrough": "空格前是 took a，后面是 of the new hall。take a photo of 是「给……拍照」，of 后面正是拍的对象。",
    "guidedAnswers": [
      [
        "bus",
        "take a bus 是坐车，后面不接 of the new hall。"
      ],
      [
        "break",
        "take a break 是休息，后面也不接 of the new hall。"
      ],
      [
        "photo"
      ]
    ],
    "independent": "The room was dark. Mei turned on the ____.",
    "checkPrompt": "空格该填哪个词？先看 dark 说明了什么。",
    "answers": [
      [
        "door",
        "turn on 可以说打开灯或电器。开门用 open the door。"
      ],
      [
        "light"
      ],
      [
        "desk",
        "桌子跟房间亮不亮没有关系。"
      ]
    ],
    "recap": "先靠搭配缩小范围，再回前后句看意思，最后把词放回去整句读一遍。",
    "transferGlossary": [
      [
        "dark",
        "暗的"
      ],
      [
        "turned on",
        "打开（设备）"
      ]
    ]
  },
  {
    "unit": 11,
    "id": "unit-11-practice",
    "number": "第一百一十课",
    "title": "加练：这次借不到，下一回要约到哪一刻",
    "goal": "在校园服务对话里分清今天借不借，再一路读到最后被接受的那个时间。",
    "example": "Can I borrow your ruler? — Sorry, I need it now. How about after lunch? — After lunch is fine.",
    "chinese": "能借我一把尺子吗？——抱歉，我现在要用。午饭后怎么样？——午饭后可以。",
    "terms": [
      [
        "borrow",
        "借来用"
      ],
      [
        "Sorry, I need it",
        "抱歉，我要用"
      ],
      [
        "How about…?",
        "……怎么样？"
      ],
      [
        "… is fine",
        "……可以"
      ],
      [
        "bike",
        "自行车"
      ]
    ],
    "rule": "Can I borrow…? 是借东西。Sorry 后说自己还要用，就是现在不借；但对话没停在拒绝上，How about…? 又提了一个时间，要等到有人回答 … is fine，那个时间才算约成。中途被回掉的提议不能算，日子和钟点也要一个个对。",
    "guided": "Can I borrow your dictionary? — Sorry, I need it this morning. How about this afternoon? — This afternoon is fine.",
    "walkthrough": "先看 Sorry, I need it this morning：现在不借。后面又提了一个时间，最后有人用 is fine 接了，那个时间才算约成。",
    "guidedAnswers": [
      [
        "现在不借，今天下午可以"
      ],
      [
        "现在就借给我",
        "Sorry, I need it this morning 是拒绝，现在不借。"
      ],
      [
        "一直都不借",
        "后面 This afternoon is fine 已经接受了今天下午。"
      ]
    ],
    "independent": "Can I borrow your bike? — Sorry, I need it today. How about Friday at 4 p.m.? — Friday at 4 is fine.",
    "checkPrompt": "假设今天是星期三。今天能借到自行车吗？最后约在哪天、几点？",
    "answers": [
      [
        "现在就借到，约在星期五下午四点",
        "Sorry, I need it today 是拒绝，今天借不到。"
      ],
      [
        "今天借不到，约在星期五上午四点",
        "日子和钟点都靠上了，但 4 p.m. 是下午四点，不是上午。"
      ],
      [
        "今天借不到，约在星期五下午四点"
      ],
      [
        "今天借不到，约在明天下午四点",
        "明天这个时间对方没提过，最后答应的是 Friday。"
      ]
    ],
    "recap": "先听今天借不借，再一路读到有人接受的那个时间；被回掉的提议、串了的钟点和没提过的日子都不能算。"
  },
  {
    "unit": 12,
    "id": "unit-12-practice",
    "number": "第一百一十一课",
    "title": "加练：三步的做法，问哪一步就找哪一步",
    "goal": "用 first、then、finally 把步骤排好，按问题找对那一步，不把顺序弄反。",
    "example": "First, fill in the form. Then give it to the teacher. Finally, wait for your card.",
    "chinese": "先填表，再把表交给老师，最后等你的卡。",
    "terms": [
      [
        "first",
        "首先"
      ],
      [
        "then",
        "接着"
      ],
      [
        "finally",
        "最后"
      ],
      [
        "fill in the form",
        "填表"
      ],
      [
        "wait for",
        "等"
      ],
      [
        "check",
        "查看"
      ],
      [
        "knock",
        "敲门"
      ],
      [
        "answer",
        "回答"
      ]
    ],
    "rule": "first 后面是第一步，then 后面是接着做的一步，finally 后面是最后一步。问哪一步，就到那个词后面找，别按句子长短猜。",
    "guided": "First, wash your hands. Then cut the paper. Finally, glue it on the card.",
    "walkthrough": "拆解要看的是剪之前那一步：cut 在 then 后面，它前面是 first 后面的 wash your hands（洗手）。",
    "guidedAnswers": [
      [
        "先把纸粘在卡片上",
        "glue it on the card 在 finally 后面，是最后一步。"
      ],
      [
        "先洗手"
      ],
      [
        "先剪纸",
        "cut 就是剪；题目问的是剪之前那一步。"
      ]
    ],
    "independent": "First, check the number on the door. Then knock. Finally, wait for an answer.",
    "checkPrompt": "敲门之后，下一步做什么？",
    "answers": [
      [
        "看清门上的号码",
        "check 在 first 后面，是敲门之前的那一步。"
      ],
      [
        "推门进去",
        "材料里没有推门进去这一步。"
      ],
      [
        "等里面的人回答"
      ]
    ],
    "recap": "先圈 first、then、finally，再按问题找对应那一步；问「之前」就往前挪一步，问「之后」就往后挪一步。",
    "transferGlossary": [
      [
        "knock",
        "敲门"
      ],
      [
        "wait for an answer",
        "等回答"
      ]
    ]
  },
  {
    "unit": 13,
    "id": "unit-13-practice",
    "number": "第一百一十二课",
    "title": "加练：说习惯，主语一换动词跟着换",
    "goal": "在一般现在时里按主语选动词形式，否定句用 don’t 或 doesn’t，后面动词回到原形。",
    "example": "I walk to school every day. Mei walks to school every day.",
    "chinese": "我每天走路上学。Mei 每天走路上学。",
    "terms": [
      [
        "walk to school",
        "走路上学"
      ],
      [
        "every day",
        "每天"
      ],
      [
        "walks",
        "走（这里的主语是 Mei，相当于 she）"
      ],
      [
        "don’t / doesn’t",
        "不"
      ],
      [
        "watch TV",
        "看电视"
      ],
      [
        "after school",
        "放学后"
      ]
    ],
    "rule": "I、you、we、they 后面用 walk；he、she 或一个人的名字后面用 walks。否定句里，I 用 don’t，Mei 用 doesn’t，后面的动词都回到原形。",
    "guided": "Bo ____ his bike to school every day. (ride)",
    "walkthrough": "主语是 Bo，相当于 he；every day 说习惯。肯定句里动词要加 s：rides。",
    "guidedAnswers": [
      [
        "ride",
        "主语是 Bo，相当于 he，这里用 rides。"
      ],
      [
        "riding",
        "every day 说平时习惯，不用 -ing。"
      ],
      [
        "rides"
      ]
    ],
    "independent": "Mei ____ watch TV after school.",
    "checkPrompt": "这句要说 Mei 放学后不看电视。哪一项能补进空格？",
    "answers": [
      [
        "don’t",
        "don’t 跟 I、you、we、they；这里的主语是 Mei。"
      ],
      [
        "doesn’t"
      ],
      [
        "doesn’t watches",
        "doesn’t 后面要用原形 watch，不再加 es。"
      ]
    ],
    "recap": "先圈主语，再看是肯定还是否定。一般现在时肯定句中，he、she 或 Bo 这类主语在这里用 rides、walks。doesn’t 后接动词原形。"
  },
  {
    "unit": 14,
    "id": "unit-14-practice",
    "number": "第一百一十三课",
    "title": "加练：过去的事，问句和否定都用原形",
    "goal": "在一般过去时里分清 Did 问句和 didn’t 否定句，知道助动词后面动词要回到原形。",
    "example": "Did Mei clean the room yesterday? — Yes, she did.",
    "chinese": "Mei 昨天打扫房间了吗？——打扫了。",
    "terms": [
      [
        "Did",
        "过去问句的开头"
      ],
      [
        "clean",
        "打扫（原形）"
      ],
      [
        "yesterday",
        "昨天"
      ],
      [
        "Yes, she did",
        "是的，她做了"
      ],
      [
        "homework",
        "作业"
      ],
      [
        "tired",
        "累的"
      ]
    ],
    "rule": "问过去做没做，把 Did 放句首，后面用原形 clean。否定句用 didn’t，后面也用原形。过去的意思已经由 Did 或 didn’t 带出来了，动词不再变。",
    "guided": "Did Bo ____ to the library yesterday? (go)",
    "walkthrough": "句首是 Did，已经说明问的是过去。空格里的动词用原形 go，不用 went。",
    "guidedAnswers": [
      [
        "go"
      ],
      [
        "went",
        "句首有 Did，动词要回到原形。"
      ],
      [
        "goes",
        "Did 问的是过去，不用第三人称单数的形式。"
      ]
    ],
    "independent": "Mei didn’t ____ her homework yesterday. She was tired.",
    "checkPrompt": "哪一项能补进空格？",
    "answers": [
      [
        "did",
        "didn’t 后面要用原形 do，不能再用 did。"
      ],
      [
        "does",
        "过去否定句不用 does。"
      ],
      [
        "do"
      ]
    ],
    "recap": "Did 和 didn’t 已经把过去说清楚了，后面的动词一律用原形。",
    "transferGlossary": [
      [
        "homework",
        "作业"
      ]
    ]
  },
  {
    "unit": 15,
    "id": "unit-15-practice",
    "number": "第一百一十四课",
    "title": "加练：改期改地点，哪条还作数",
    "goal": "读懂一条改动通知，先用 won’t 划掉取消的安排，再把仍然有效的日期、时间和地点拼起来。",
    "example": "The book sale will start at 2 p.m. on Monday. We won’t use the front hall. We will use the reading room.",
    "chinese": "图书义卖星期一下午两点开始。前厅不用了，改在阅览室。",
    "terms": [
      [
        "book sale",
        "图书义卖"
      ],
      [
        "front hall",
        "前厅"
      ],
      [
        "reading room",
        "阅览室"
      ],
      [
        "will start",
        "将开始"
      ],
      [
        "won’t use",
        "不用"
      ]
    ],
    "rule": "先用 won’t 找出被取消的那一项：这里取消的是地点 front hall。时间那句没有 won’t，星期一下午两点仍然有效。最后一句 will use 给出新地点 reading room。三句合起来，才是现在的安排。",
    "guided": "The art show will start at 3 p.m. on Friday. We won’t use the small hall. We will use the art room.",
    "walkthrough": "第一句给时间：星期五下午三点，没有否定。中间那句 won’t use 只划掉小厅。最后一句 will use the art room 补上新地点。所以按星期五下午三点去美术教室。",
    "guidedAnswers": [
      [
        "星期五下午三点，去美术教室"
      ],
      [
        "星期五下午三点，去小厅",
        "won’t use the small hall 已经把这一项划掉了；现在用的是 art room。"
      ],
      [
        "星期五下午两点，去美术教室",
        "第一句写的是 3 p.m.，三点；两点没有依据。"
      ]
    ],
    "independent": "We won’t meet on Wednesday. We will meet on Thursday. Meet in the music room at 2 p.m.",
    "checkPrompt": "按最新安排，这次集合在哪一天、几点、去哪里？",
    "answers": [
      [
        "星期三下午两点，去音乐教室",
        "这次取消的是星期三；第二句 will meet 说的是星期四。"
      ],
      [
        "星期四下午两点，去音乐教室"
      ],
      [
        "星期四下午三点，去音乐教室",
        "日期和地点对上了；2 p.m. 是两点，不是三点。"
      ]
    ],
    "recap": "日期、时间、地点常常分在三句里。先用 won’t 划掉取消的那一项，再把剩下的信息拼起来。",
    "transferGlossary": [
      [
        "music room",
        "音乐教室"
      ],
      [
        "won’t meet",
        "不见面"
      ]
    ]
  },
  {
    "unit": 16,
    "id": "unit-16-practice",
    "number": "第一百一十五课",
    "title": "加练：谁更快，界线算不算进去",
    "goal": "看清 than 两边谁更快、哪条更短，再判断 less than 和 more than 后面的数字包不包括它本身。",
    "example": "The new dining hall is bigger than the old one. It has more than 60 seats.",
    "chinese": "新食堂比旧的大，里面的座位超过 60 个。",
    "terms": [
      [
        "dining hall",
        "食堂"
      ],
      [
        "bigger than",
        "比……大"
      ],
      [
        "more than",
        "超过"
      ],
      [
        "seat",
        "座位"
      ]
    ],
    "rule": "先看 bigger than 两边：句首的 new dining hall 更大，than 后的 old one 是拿来比的。more than 60 是「超过 60」，比 60 多都可以，正好 60 不行。",
    "guided": "Room 305 is bigger than Room 302. Room 305 has more than 40 seats.",
    "walkthrough": "问哪个房间更大，就看谁 is bigger：Room 305。than 后的 Room 302 是比较对象。more than 40 不含 40，所以座位数要大于 40。",
    "guidedAnswers": [
      [
        "305 室更大，座位超过 40 个"
      ],
      [
        "305 室更大，正好 40 个座位",
        "more than 40 是超过 40，不包含 40。"
      ],
      [
        "302 室更大",
        "302 室在 than 后面，是比较对象；句子说更大的是 305 室。"
      ]
    ],
    "independent": "The city bus is faster than the school bus. The city bus takes less than 25 minutes.",
    "checkPrompt": "哪个说法把比较的两边和数字范围都读对了？",
    "answers": [
      [
        "市公交更快，路上正好花 25 分钟",
        "less than 25 是不到 25 分钟，不包含 25。"
      ],
      [
        "市公交更快，路上不到 25 分钟"
      ],
      [
        "校车更快，路上不到 25 分钟",
        "校车在 than 后面；句子说更快的是市公交。"
      ]
    ],
    "recap": "比较级先看谁在 is 前面，than 后只是对照；数字前的 less 和 more 都不包含那个数字。",
    "transferGlossary": [
      [
        "faster than",
        "比……快"
      ],
      [
        "school bus",
        "校车"
      ]
    ]
  },
  {
    "unit": 17,
    "id": "unit-17-practice",
    "number": "第一百一十六课",
    "title": "加练：为什么去、想做什么、最后怎样",
    "goal": "分清 because 给的原因、to 给的目的，以及 but 和 so 后面实际发生的结果。",
    "example": "Lin left early because the bus was slow. She went to the shop to buy a card. But the shop was closed, so she came back.",
    "chinese": "Lin 早走是因为公交慢。她去商店是为了买一张卡片。但商店关门了，她只好回来。",
    "terms": [
      [
        "left early",
        "早走了"
      ],
      [
        "slow",
        "慢的"
      ],
      [
        "buy a card",
        "买一张卡片"
      ],
      [
        "closed",
        "关门的"
      ],
      [
        "came back",
        "回来了"
      ]
    ],
    "rule": "because 后面是原因：公交慢。to buy a card 是去商店的目的，不等于买到了。But 一转，so 给出结果：商店关门，她回来了。问原因找 because，问目的找 to，问结果读到句末。",
    "guided": "Kai got up early because he wanted a seat near the front. He went to the hall to save a seat for Mei. But the hall was full, so he stood at the back.",
    "walkthrough": "题目问去礼堂想做什么。to save a seat for Mei 就是目的：给 Mei 占座。站在后面是后来的结果，不是他去的理由。",
    "guidedAnswers": [
      [
        "给 Mei 占座"
      ],
      [
        "站在礼堂后面",
        "站在后面是礼堂满了以后的结果，不是他去的目的。"
      ],
      [
        "因为他想靠前坐",
        "靠前坐是他早起的理由；问的是去礼堂想做什么。"
      ]
    ],
    "independent": "Mei took the early bus because the later bus was full. She wanted to reach the shop before nine. She got there at 8:50. The shop was still closed, so she waited outside. It opened at nine.",
    "checkPrompt": "哪一项是 Mei 坐早班车的原因？",
    "answers": [
      [
        "为了九点前赶到商店",
        "九点前到店是她的目的，最早那句的 because 后面才给出选早班车的原因。"
      ],
      [
        "商店九点才开门",
        "九点开门解释了她为什么在门外等。选早班车的原因在第一句。"
      ],
      [
        "晚一班车满了"
      ]
    ],
    "recap": "问原因找 because，问目的找 to，问结果读到 but 和 so 后面。三样各放一格，别互相顶替。",
    "transferGlossary": [
      [
        "the later bus",
        "较晚的一班车"
      ],
      [
        "full",
        "满的"
      ],
      [
        "outside",
        "外面"
      ]
    ]
  },
  {
    "unit": 18,
    "id": "unit-18-practice",
    "number": "第一百一十七课",
    "title": "加练：先看自己属于哪一条，再读 must",
    "goal": "遇到分条件的规则，先挑跟自己相符的 if，再分清 must、don’t have to 和 mustn’t。",
    "example": "If you are in Group A, you must bring a map. If you are in Group B, you don’t have to bring a map. For everyone: You mustn’t take photos in the hall.",
    "chinese": "A 组必须带地图。B 组不必带地图。所有人都不准在礼堂拍照。",
    "terms": [
      [
        "Group A",
        "A 组"
      ],
      [
        "bring a map",
        "带地图"
      ],
      [
        "don’t have to",
        "不必"
      ],
      [
        "take photos",
        "拍照"
      ],
      [
        "hall",
        "礼堂"
      ]
    ],
    "rule": "先找跟自己情况相符的 if：B 组的人看第二条。must bring 是必须带；don’t have to bring 是不必带，不带也行；mustn’t take photos 是不准拍照。For everyone 那条对谁都算。",
    "guided": "If you are in Class 2, you must bring a cup. If you are in Class 3, you don’t have to bring a cup. For everyone: You mustn’t use the sink in the corner.",
    "walkthrough": "假设你在 3 班。第一条 must 说的是 2 班，不适用。第二条 don’t have to 说你不用非带杯子不可。最后一条 mustn’t 对所有人有效：角落的水槽不能用。",
    "guidedAnswers": [
      [
        "不必带杯子，也不能用角落的水槽"
      ],
      [
        "必须带杯子，也不能用角落的水槽",
        "必须带杯子的是 2 班；你在 3 班，适用第二条。"
      ],
      [
        "不必带杯子，可以用角落的水槽",
        "mustn’t use 是禁止使用，对所有人有效。"
      ]
    ],
    "independent": "If you have a bike card, you must park in Area A. If you don’t have a bike card, you must park in Area B. For everyone: You mustn’t park near the gate.",
    "checkPrompt": "你没有自行车卡。这份停车通知要求你怎么做？",
    "answers": [
      [
        "停在 A 区，不能停在大门附近",
        "有自行车卡才停 A 区；你没有卡，适用 don’t have a bike card 那条。"
      ],
      [
        "停在 B 区，不能停在大门附近"
      ],
      [
        "停在 B 区，也可以停在大门附近",
        "mustn’t park near the gate 是对所有人的禁止，停在 B 区也不能停到大门附近。"
      ]
    ],
    "recap": "条件决定哪条规矩跟你有关；must 是必须，don’t have to 是不必，mustn’t 是禁止。",
    "transferGlossary": [
      [
        "bike card",
        "自行车卡"
      ],
      [
        "near the gate",
        "在大门附近"
      ]
    ]
  },
  {
    "unit": 19,
    "id": "unit-19-practice",
    "number": "第一百一十八课",
    "title": "加练：东西被搬走了，没写谁做的也能读",
    "goal": "从被动句里读出被处理的东西、动作和时间地点，不自己补一个做事的人。",
    "example": "The old desks were moved out of Room 202 on Monday. New desks were put in on Tuesday.",
    "chinese": "旧课桌星期一从 202 室搬走了，星期二搬进了新课桌。",
    "terms": [
      [
        "old desks",
        "旧课桌"
      ],
      [
        "were moved out",
        "被搬走"
      ],
      [
        "were put in",
        "被搬进"
      ],
      [
        "Room 202",
        "202 室"
      ]
    ],
    "rule": "句首是被处理的东西，were 加过去分词表示「被……」。这里没说谁搬的，就不要自己加「老师」或「同学」。moved out 是搬出去，put in 是搬进来，两个方向别弄反。",
    "guided": "The broken chairs were taken away this morning. New chairs will be put in tomorrow.",
    "walkthrough": "今天早上被搬走的是 broken chairs，句子没交代谁搬。明天 will be put in 的是 new chairs。只说材料写的事，不补人。",
    "guidedAnswers": [
      [
        "今天早上破椅子被搬走，明天会有新椅子搬进来"
      ],
      [
        "今天早上有人搬来了新椅子",
        "taken away 是搬走，搬来的是明天 will be put in 的新椅子。"
      ],
      [
        "今天早上老师把破椅子搬走了",
        "原文没有写是谁搬的，不能自己补一个老师。"
      ]
    ],
    "independent": "The notice board was moved from the gate to the library last week. New notices were put on it yesterday.",
    "checkPrompt": "只根据这两句话，能确定哪一项？",
    "answers": [
      [
        "上周有人把公告板从图书馆搬到了大门",
        "from the gate 是原来的位置，to the library 才是新位置，方向反了。"
      ],
      [
        "公告板上周从大门挪到了图书馆，昨天上面贴了新通知"
      ],
      [
        "昨天有人把公告板搬进了图书馆",
        "搬公告板是上周的事，昨天做的是往上面贴新通知；原文也没写是谁搬的。"
      ]
    ],
    "recap": "被动句先找「什么被怎样」，再看时间和地点。没写做事的人，就不要替他补名字。",
    "transferGlossary": [
      [
        "notice board",
        "公告板"
      ],
      [
        "were put on it",
        "被贴在上面"
      ]
    ]
  },
  {
    "unit": 20,
    "id": "unit-20-practice",
    "number": "第一百一十九课",
    "title": "加练：先认是哪一批，再看去哪儿",
    "goal": "用 who 或 that 后面的描述找准人或物，再从同一句读动作和地点。",
    "example": "The books that have a green mark will go to Class 1. The books that have a red mark will go to Class 2.",
    "chinese": "贴绿标记的书送到 1 班，贴红标记的书送到 2 班。",
    "terms": [
      [
        "green mark",
        "绿色标记"
      ],
      [
        "red mark",
        "红色标记"
      ],
      [
        "go to Class 1",
        "送到 1 班"
      ],
      [
        "book",
        "书"
      ]
    ],
    "rule": "that 后面是限定：哪一批书。先认对是哪一批，再看同一句后半段送去哪里。绿标记去 1 班，红标记去 2 班，不能把两半句拼在一起。",
    "guided": "The pictures that won the prize will be shown in the hall. The pictures that did not win will be kept in the art room.",
    "walkthrough": "问得奖的画在哪儿，就找 that won the prize 那一句，后半段是 will be shown in the hall。美术教室那句写的是 did not win。",
    "guidedAnswers": [
      [
        "在礼堂展出"
      ],
      [
        "在美术教室收着",
        "美术教室对应的是 that did not win 那一句。"
      ],
      [
        "先放礼堂，再收进美术教室",
        "这两句说的是两批不同的画，不是同一批的两个步骤。"
      ]
    ],
    "independent": "Bags that have a name card will be kept at the front desk. Bags that have no name card will be kept in the office.",
    "checkPrompt": "你的书包上没有名牌。按这张说明，该去哪里找？",
    "answers": [
      [
        "去前台找",
        "前台对应的是 that have a name card，也就是有名牌的书包。"
      ],
      [
        "去办公室找"
      ],
      [
        "先到前台登记，再去办公室拿",
        "说明里没有登记这一步；没有名牌的书包直接放在办公室。"
      ]
    ],
    "recap": "先认 who 或 that 指的是哪一批，再从同一句读地点，别跨句拼。",
    "transferGlossary": [
      [
        "name card",
        "名牌"
      ],
      [
        "front desk",
        "前台"
      ]
    ]
  },
  {
    "unit": 21,
    "id": "unit-21-practice",
    "number": "第一百二十课",
    "title": "加练：借进来、借出去、什么时候还",
    "goal": "在借用场景里分清 borrow 和 lend 的方向，再用 keep 和 return 读出期限和归还日。",
    "example": "Chen borrowed a pen from Lin. He can keep it for two days and must return it on Thursday.",
    "chinese": "Chen 从 Lin 那里借了一支笔，可以留两天，星期四必须还。",
    "terms": [
      [
        "borrowed",
        "借进来了"
      ],
      [
        "from Lin",
        "从 Lin 那里"
      ],
      [
        "keep it for two days",
        "留两天"
      ],
      [
        "return",
        "归还"
      ]
    ],
    "rule": "borrow 是借进来，from 后面是从谁或哪里借来；lend 是借出去，后面接借给谁。keep 说可以在手里留多久，return 说要还回去。",
    "guided": "Mei borrowed a ruler from the office. She can keep it for three days and must return it on Friday.",
    "walkthrough": "borrow 前面是 Mei，她是借到尺子的人；from the office 说明尺子从办公室来。所以借出尺子的是办公室，不是 Mei。",
    "guidedAnswers": [
      [
        "办公室把尺子借给 Mei"
      ],
      [
        "Mei 把尺子借给办公室",
        "borrow 前面的 Mei 是借到的人；from 后面才是东西来的地方。"
      ],
      [
        "Mei 从办公室买了一把尺子",
        "borrow 是借，不是买；后面还说星期五要 return。"
      ]
    ],
    "independent": "Bo lent Jia his dictionary on Monday. Jia can keep it until Thursday. Jia must return it on Thursday afternoon.",
    "checkPrompt": "谁把词典借了出去，Jia 最晚什么时候还？",
    "answers": [
      [
        "Jia 借出，Bo 星期四下午还",
        "lent 前面是 Bo，他才是借出词典的人。"
      ],
      [
        "Bo 借出，Jia 可以一直留着",
        "keep it until Thursday 说明只留到星期四，不是一直留。"
      ],
      [
        "Bo 借出，Jia 星期四下午还"
      ]
    ],
    "recap": "borrow 是借进来，lend 是借出去；keep 管留多久，return 管哪天还。",
    "transferGlossary": [
      [
        "dictionary",
        "词典"
      ],
      [
        "until",
        "直到"
      ],
      [
        "return",
        "归还"
      ]
    ]
  },
  {
    "unit": 22,
    "id": "unit-22-practice",
    "number": "第一百二十一课",
    "title": "加练：两张海报，报名和活动分开看",
    "goal": "同时核对参加条件、报名地点和开始时间，从几张海报里选出可行的那一个。",
    "example": "Dance Club: No experience needed. Sign up in Room 105. Meet in the hall at 3 p.m. on Tuesday.",
    "chinese": "舞蹈社不要求经验。在 105 室报名，星期二下午三点在礼堂活动。",
    "terms": [
      [
        "Dance Club",
        "舞蹈社"
      ],
      [
        "no experience needed",
        "不要求经验"
      ],
      [
        "sign up",
        "报名"
      ],
      [
        "hall",
        "礼堂"
      ]
    ],
    "rule": "Sign up 后面是报名的地方，Meet 后面是活动的地方，两个地点可以不一样。先看自己符不符合条件，再看时间赶不赶得上，最后才看报名去哪儿。",
    "guided": "Cooking Club: No experience needed. Sign up at the school office. Meet in the dining hall at 4 p.m. on Wednesday.",
    "walkthrough": "题目问报名去哪儿。跟 Sign up 走：at the school office。食堂跟着 Meet，是活动地点。",
    "guidedAnswers": [
      [
        "去学校办公室报名"
      ],
      [
        "去食堂报名",
        "食堂跟着 Meet，是活动的地方；报名写的是 Sign up at the school office。"
      ],
      [
        "不用报名，直接去食堂",
        "海报写了 Sign up，说明要先报名。"
      ]
    ],
    "independent": "Singing Club: You must already be able to sing one song. Sign up in Room 107. Meet in the music room at 5 p.m. on Friday. Chess Club: No experience needed. Sign up in Room 108. Meet in the reading room at 6 p.m. on Friday.",
    "checkPrompt": "你星期五下午五点能到，六点不能到，也已经会唱一首歌。该去哪里报名？",
    "answers": [
      [
        "去 108 室报名",
        "108 室是棋社的报名地点；棋社六点才开始，不是五点。"
      ],
      [
        "去音乐教室报名",
        "音乐教室是唱歌社的活动地点；报名写在 Sign up in Room 107。"
      ],
      [
        "去 107 室报名"
      ]
    ],
    "recap": "先按条件选社团，再跟 Sign up 找报名地点，别把 Meet 的地点当报名处。",
    "transferGlossary": [
      [
        "experience",
        "经验"
      ],
      [
        "sign up",
        "报名"
      ],
      [
        "music room",
        "音乐教室"
      ]
    ]
  },
  {
    "unit": 23,
    "id": "unit-23-practice",
    "number": "第一百二十二课",
    "title": "加练：三句连读，中间放哪一句",
    "goal": "选一句能同时接住前一句和后面那句的话，不只接一边。",
    "example": "Mei’s pen had no ink. Lin gave her a new pen. Now Mei could fill in the form.",
    "chinese": "Mei 的笔没墨了。Lin 给了她一支新笔。现在 Mei 能填表了。",
    "terms": [
      [
        "ink",
        "墨水"
      ],
      [
        "gave her",
        "给了她"
      ],
      [
        "fill in the form",
        "填表"
      ],
      [
        "pen",
        "笔"
      ]
    ],
    "rule": "先看前一句缺什么，再看后一句为什么能成立。笔没墨，后面又能填表，中间要有能写字的新笔。只跟前一句有关、却解释不了后一句的选项，要排除。放进去以后，把三句连着读一遍。",
    "guided": "The classroom clock stopped at nine. ____ Now the class could see the time again.",
    "walkthrough": "前面说钟停了，后面说又能看时间。中间要填能解释这个变化的事：换电池。钟是圆的说得通，但解释不了为什么又能看时间。",
    "guidedAnswers": [
      [
        "The teacher put in a new battery."
      ],
      [
        "The clock was round.",
        "只说了钟的样子，没解释为什么又能看时间。"
      ],
      [
        "The clock was on the wall.",
        "只说了位置，没解释钟为什么恢复。"
      ]
    ],
    "independent": "The reading room was too dark. ____ Now the students could read there.",
    "checkPrompt": "哪一句能同时接住「太暗」和「学生又能看书」？",
    "answers": [
      [
        "The reading room was on the first floor.",
        "只说了位置，没解决太暗的问题。"
      ],
      [
        "A worker put in two new lights in the office.",
        "装了灯，但装在了办公室，阅览室还是暗的。"
      ],
      [
        "A worker put in two new lights."
      ]
    ],
    "recap": "选句要看两头：前一句的问题和后一句的变化都要接上，再把三句连读一遍。",
    "transferGlossary": [
      [
        "reading room",
        "阅览室"
      ],
      [
        "dark",
        "暗的"
      ],
      [
        "put in",
        "安装"
      ]
    ]
  },
  {
    "unit": 24,
    "id": "unit-24-practice",
    "number": "第一百二十三课",
    "title": "加练：空里缺什么，括号里的词怎么变",
    "goal": "没给括号先看后文缺的是「什么」还是「哪里」；给了括号先看空在句里做什么，别见词就加 -ly。",
    "example": "I don’t know what Mei wants to borrow. Mei reads the notice carefully.",
    "chinese": "我不知道 Mei 想借什么。Mei 仔细地读通知。",
    "terms": [
      [
        "what",
        "什么"
      ],
      [
        "where",
        "在哪里"
      ],
      [
        "borrow",
        "借进来"
      ],
      [
        "careful",
        "仔细的"
      ],
      [
        "carefully",
        "仔细地"
      ]
    ],
    "rule": "没给括号时，看后一句回答的是东西还是地点：东西用 what，地点用 where。给了括号，先看空在句里做什么：描述人或物本身用形容词，这里要描述读的方式，careful 变成 carefully。括号只是起点，不一定原样抄。",
    "guided": "Bo checks the time ____. (careful)",
    "walkthrough": "空格说明 Bo 怎样检查时间，这里需要描述动作的方式。用 carefully。",
    "guidedAnswers": [
      [
        "carefully"
      ],
      [
        "careful",
        "这里在描述 checks 这个动作。careful 用来形容人或物。"
      ],
      [
        "care",
        "care 是动词或名词，这里要的是表示方式的词。"
      ]
    ],
    "independent": "Can you tell me ____ Bo wants to buy? — He wants a new pen.",
    "checkPrompt": "哪一个词能让前后两句接上？",
    "answers": [
      [
        "where",
        "后一句给的是笔，是东西，不是在说地点。"
      ],
      [
        "who",
        "后一句说的是想买的东西，不是在问人。"
      ],
      [
        "what"
      ]
    ],
    "recap": "没括号先找缺的信息：东西用 what，地点用 where；有括号先看空在句里做什么，再决定该用 careful 还是 carefully。"
  },
  {
    "unit": 25,
    "id": "unit-25-practice",
    "number": "第一百二十四课",
    "title": "加练：补半句，先看时间，再看两边",
    "goal": "用句子给的过去时间定词形，只补空格缺的部分，不重复右边已经写好的内容。",
    "example": "Yesterday, we cleaned the windows after class.",
    "chinese": "昨天，我们下课后擦了窗户。",
    "terms": [
      [
        "yesterday",
        "昨天"
      ],
      [
        "cleaned",
        "擦了"
      ],
      [
        "windows",
        "窗户"
      ],
      [
        "after class",
        "下课后"
      ]
    ],
    "rule": "Yesterday 把动作放到过去，clean 要写成 cleaned。补的时候只看空格：主语和 after class 已经给了，就不再写一遍。右边如果已经有 of、问号或地点，也不重复。",
    "guided": "Last week, Mei ____ in the school garden.",
    "walkthrough": "要补「种了三棵树」。Last week 指过去，plant 写成 planted；in the school garden 已经在空格右边，不再写。空里只放 planted three trees。",
    "guidedAnswers": [
      [
        "planted three trees"
      ],
      [
        "plants three trees",
        "Last week 指过去，动词要用过去式 planted。"
      ],
      [
        "planted three trees in the school garden",
        "in the school garden 已经在空格右边，不要再写一遍。"
      ]
    ],
    "independent": "The parents ____ of the show last night.",
    "checkPrompt": "根据中文「感到自豪」，选出只填进空格的部分。",
    "answers": [
      [
        "was proud",
        "last night 指过去；主语 the parents 是复数，要用 were。"
      ],
      [
        "were proud of",
        "were 对了，但右边已经有 of，空里再写一次就多了。"
      ],
      [
        "were proud"
      ]
    ],
    "recap": "时间定词形，主语定 be 的形式；空格两边已经有的词和标点，都不重复写。",
    "transferGlossary": [
      [
        "parents",
        "家长"
      ],
      [
        "last night",
        "昨晚"
      ]
    ]
  },
  {
    "unit": 26,
    "id": "unit-26-practice",
    "number": "第一百二十五课",
    "title": "加练：同一行找课，再按通知排掉",
    "goal": "用星期几和几点定到一行，再用通知排掉取消的或不符合条件的项目。",
    "example": "Monday 9:00, English, Room 104. Monday 10:00, Music, Room 106. Notice: From this week, Monday Music is in Room 202.",
    "chinese": "星期一九点英语，104 室；星期一十点音乐，106 室。通知：从这周起，星期一音乐改到 202 室。",
    "terms": [
      [
        "timetable",
        "时间表"
      ],
      [
        "notice",
        "通知"
      ],
      [
        "from this week",
        "从这周起"
      ],
      [
        "Room 202",
        "202 室"
      ]
    ],
    "rule": "先用星期几和几点定到一行，课名和教室都从这一行读。通知只改其中一项：说 Music 改到 202 室，就只换音乐的教室，英语那行不动。音乐课这次不再用 106 室。",
    "guided": "Tuesday 9:00, Math, Room 106. Tuesday 10:00, Art, Room 108. Notice: From this week, Tuesday Art is in Room 205.",
    "walkthrough": "问星期二十点美术。先定到 Art 那一行，再看通知：Art 改到 Room 205。108 是旧信息。",
    "guidedAnswers": [
      [
        "美术在 205 室"
      ],
      [
        "美术在 108 室",
        "108 是时间表上的旧教室；通知说从这周起改到 205。"
      ],
      [
        "数学在 205 室",
        "通知点的是 Art；数学那行没改，仍在 106 室。"
      ]
    ],
    "independent": "Thursday 9:00, Swim Club, Room 106. Thursday 10:00, Drawing Club, Room 203. Notice: Swim Club is only for students who can swim 50 meters.",
    "checkPrompt": "一个游不到 50 米的同学，星期四能参加哪一项？",
    "answers": [
      [
        "9:00 游泳社，106 室",
        "通知说游泳社只招能游 50 米的学生；到不了 50 米就不符合这个条件。"
      ],
      [
        "10:00 绘画社，106 室",
        "把两行拼在一起了：绘画社是 10:00、203 室。"
      ],
      [
        "10:00 绘画社，203 室"
      ]
    ],
    "recap": "先按星期和几点定行，再按通知排掉不能参加的；时间和教室都从同一行读。",
    "transferGlossary": [
      [
        "only for",
        "只限"
      ],
      [
        "meters",
        "米"
      ]
    ]
  },
  {
    "unit": 27,
    "id": "unit-27-practice",
    "number": "第一百二十六课",
    "title": "加练：回执走到哪一步，只改点名的一项",
    "goal": "按 Status 判断下一步，再照更正通知只改点名的一项，其余信息保持原样。",
    "example": "Status: Needs correction. Note: Please write your class in the Class field.",
    "chinese": "状态：需要更正。备注：请把班级写进 Class 那一栏。",
    "terms": [
      [
        "status",
        "状态"
      ],
      [
        "needs correction",
        "需要更正"
      ],
      [
        "field",
        "栏目"
      ],
      [
        "note",
        "备注"
      ]
    ],
    "rule": "Status 只写一种状态：Submitted 是已交、还要等新回执；Confirmed 是已确认，可以按时间和地点去；Needs correction 是有一项要改。更正通知只说改哪一项，没点名的那项照抄回执。填表时先认栏名，再填内容。",
    "guided": "Status: Submitted. Note: We have your form. Please wait for our reply.",
    "walkthrough": "Submitted 表示表已经交了。Please wait for our reply 让你等回复。",
    "guidedAnswers": [
      [
        "等回复"
      ],
      [
        "已经确认，可以按时间去了",
        "Confirmed 才是已确认；这一行写的是 Submitted。"
      ],
      [
        "改一项再交一次",
        "Needs correction 才要改；这里 Note 没点出哪一项有错。"
      ]
    ],
    "independent": "Receipt: Wednesday 2:00, Room 108. Notice: Please change the room to Room 302. The time stays the same.",
    "checkPrompt": "按通知改过以后，时间和教室分别是多少？",
    "answers": [
      [
        "星期三 2:00，108 室",
        "通知写的是 change the room，108 是回执上的旧教室，教室这一项没改。"
      ],
      [
        "星期三 2:00，302 室"
      ],
      [
        "星期二 2:00，302 室",
        "教室改对了；回执上的日期是 Wednesday，通知也没有点名改日期。"
      ]
    ],
    "recap": "先读 Status 决定下一步；要更正时，只换通知点名的那一项，另一项照回执抄。",
    "transferGlossary": [
      [
        "receipt",
        "回执"
      ],
      [
        "stays the same",
        "保持不变"
      ]
    ]
  },
  {
    "unit": 28,
    "id": "unit-28-practice",
    "number": "第一百二十七课",
    "title": "加练：单价、门槛和小票，哪行对不上",
    "goal": "分清每个的价和一组价，读清数量门槛，再逐行核对小票上的单价。",
    "example": "Tag: Pencil 2 yuan each. Tag: Notebook 3 for 12 yuan. Receipt: 2 pencils, 2 yuan each. Total: 4 yuan.",
    "chinese": "价签：铅笔每支 2 元，笔记本 3 本 12 元。小票：2 支铅笔，每支 2 元，合计 4 元。",
    "terms": [
      [
        "each",
        "每一个"
      ],
      [
        "3 for 12 yuan",
        "3 本 12 元"
      ],
      [
        "total",
        "合计"
      ],
      [
        "receipt",
        "小票"
      ],
      [
        "glue stick",
        "胶棒"
      ],
      [
        "rolls of tape",
        "几卷胶带"
      ]
    ],
    "rule": "each 跟在价钱后面，是每一个的价；3 for 12 yuan 是这一组 3 本一共 12 元，不是每本 12 元。total 是整单合起来。核对小票时，先看这一行买了几件，再回价签找同一样东西的价钱或组价。",
    "guided": "Tag: Glue stick 4 yuan each. Tag: Tape 2 for 7 yuan. Receipt: 1 glue stick, 4 yuan each. Receipt: 2 rolls of tape, 9 yuan each.",
    "walkthrough": "胶棒：价签 4 元一支，小票也是 4 元，对得上。胶带：价签写 2 for 7 yuan，2 卷一共 7 元；小票写的是每卷 9 元，两边对不上。",
    "guidedAnswers": [
      [
        "胶带这一行：价签 2 卷 7 元，小票收每卷 9 元"
      ],
      [
        "胶棒这一行：价签 4 元，小票收 4 元",
        "胶棒两边都是 4 元，这一行对得上；题目要找对不上的那行。"
      ],
      [
        "两行都对得上",
        "再回价签看胶带：2 for 7 yuan 是 2 卷一共 7 元，小票写的每卷 9 元跟它对不上。"
      ]
    ],
    "independent": "Tag: Notebook 6 yuan each. Offer: Three or more notebooks, 5 yuan each. Receipt: 3 notebooks, 6 yuan each. Tag: Pen 2 yuan each. Receipt: 2 pens, 2 yuan each.",
    "checkPrompt": "哪一项的收费跟价签和优惠对不上？",
    "answers": [
      [
        "笔：价签 2 元，小票也按 2 元收",
        "笔两边都是 2 元，这一行对得上。"
      ],
      [
        "两项都对得上，没有问题",
        "再看笔记本：买了 3 本，够 three or more，优惠价是每本 5 元，小票却按每本 6 元收。"
      ],
      [
        "笔记本：买了 3 本，小票按每本 6 元收"
      ]
    ],
    "recap": "先看买了几个，够不够门槛；再回价签找同一样东西的价。两边数字不一样，就是收费对不上的那一行。",
    "transferGlossary": [
      [
        "receipt",
        "小票"
      ],
      [
        "offer",
        "优惠"
      ],
      [
        "three or more",
        "三个或更多"
      ]
    ]
  }
].map(({ unit, ...content }) => ({ ...teachingLesson(content), practiceUnit: unit })),
]);

// 只复习通知单元教过的线索。requires 是出题的硬门槛，不是掌握评级。
window.NOTICE_REVIEW = Object.freeze([
  {
    reviewId: 'notice-time-friday', requires: ['notice-time'], title: '复习：几点开始？', prompt: '先找 starts at，再核对星期。',
    dialogueLines: ['The meeting starts at 9 a.m. on Friday.'],
    options: [{ id: 'am', label: '星期五上午九点' }, { id: 'pm', label: '星期五下午九点', hint: 'a.m. 表示上午。' }, { id: 'day', label: '星期一上午九点', hint: 'on Friday 是星期五。' }],
    answer: 'am', success: '9 a.m. 是上午九点，on Friday 是星期五。', takeaway: 'starts at 找几点，on 找星期。',
  },
  {
    reviewId: 'notice-place-206', requires: ['notice-place'], title: '复习：在哪儿集合？', prompt: '只找地点。',
    dialogueLines: ['Meet in Room 206.'],
    options: [{ id: 'library', label: '图书馆', hint: '图书馆是 the library。这里写了 Room 和房间号。' }, { id: 'room', label: '206 室' }],
    answer: 'room', success: 'Meet in 后面的 Room 206 是集合地点。', takeaway: 'Meet in 找地点；Room 后面是房间号。',
  },
  {
    reviewId: 'notice-bring-notebook', requires: ['notice-bring'], title: '复习：自己带什么？', prompt: '找自己要带的东西，不是学校借给你的。',
    dialogueLines: ['The school will lend you a pencil.', 'Bring a notebook.'],
    options: [{ id: 'pencil', label: '铅笔', hint: '铅笔在 lend you 后面，是学校借给你的。' }, { id: 'both', label: '铅笔和笔记本', hint: '只需要带 Bring 后面的物品。' }, { id: 'notebook', label: '笔记本' }],
    answer: 'notebook', success: 'Bring a notebook 就是自己带笔记本。', takeaway: 'Bring 找要带的东西；lend you 指借给你。',
  },
]);

// 每组两个原创变式：都用已教过的线索，不照抄正课的独立题。
function reviewPair(skill, title, prompt, examples) {
  return examples.map(([id, lines, answer, distractor, hint, takeaway], index) => {
    const correct = { id: 'correct', label: answer };
    const incorrect = { id: 'retry', label: distractor, hint };
    return {
      reviewId: id, requires: [skill], title, prompt, dialogueLines: lines,
      options: index % 2 ? [correct, incorrect] : [incorrect, correct],
      answer: correct.id, success: takeaway, takeaway,
    };
  });
}

// 通用复习池：每道题明列所需课程，选项也不依赖未教句型。
window.LEARNED_REVIEW = Object.freeze([
  { reviewId: 'intro-mei', requires: ['first-hello'], englishOptions: true, title: '复习：说自己的名字', prompt: '你叫 Mei，在社团活动见到新同学。选一句介绍自己。',
    options: [{ id: 'other', label: 'Hi, I’m Lin.', hint: 'I’m 后面是说话的人自己的名字。你叫 Mei。' }, { id: 'self', label: 'Hi, I’m Mei.' }],
    answer: 'self', success: 'I’m Mei 是「我是 Mei」。', takeaway: '打完招呼，用 I’m 加自己的名字。' },
  { reviewId: 'intro-tao', requires: ['first-hello'], englishOptions: true, title: '复习：是谁在介绍自己？', prompt: '实训课换了座位。假设你叫 Tao，哪句是你在介绍自己？',
    options: [{ id: 'self', label: 'Hi, I’m Tao.' }, { id: 'other', label: 'Hi, I’m Mei.', hint: '看 I’m 后面的人名。你叫 Tao，不是 Mei。' }],
    answer: 'self', success: '把名字换成 Tao，句型不用换。', takeaway: 'I’m 后面跟的名字，属于说这句话的人。' },
  { reviewId: 'ask-bo', skill: 'ask-name', requires: ['first-hello', 'ask-name'], englishOptions: true, title: '复习：补一句问名字', prompt: '你已经介绍了自己。接下来想问对方叫什么，选哪句？',
    dialogueLines: ['You: Hi, I’m Mei. ____', 'Partner: I’m Bo.'],
    options: [{ id: 'self', label: 'Hi, I’m Mei.', hint: '这句是在介绍自己，不是在问名字。' }, { id: 'ask', label: 'What’s your name?' }],
    answer: 'ask', success: '下一句是在报名字，前面问 What’s your name? 能接上。', takeaway: 'your name 是对方的名字；I’m 是介绍自己。' },
  { reviewId: 'meet-mei', requires: ['first-conversation'], englishOptions: true, title: '复习：接一句礼貌回应', prompt: '同学刚认识你。选一句接下去。', dialogueLines: ['Mei: Nice to meet you.'],
    options: [{ id: 'reply', label: 'Nice to meet you, too.' }, { id: 'greet', label: 'Hi!', hint: '对方说「很高兴认识你」，可以用 too 表示「我也」。' }],
    answer: 'reply', success: 'too 在这里表示「也」。', takeaway: '对方说 Nice to meet you，可以用带 too 的句子回应。' },
  ...window.NOTICE_REVIEW,
  { reviewId: 'core-bo-note', requires: ['sentence-core'], title: '复习：谁在做什么？', prompt: '先看开头是谁，再看做的事。', dialogueLines: ['Bo writes a note.'],
    options: [{ id: 'read', label: 'Bo 读书', hint: 'writes 是写，不是读。' }, { id: 'write', label: 'Bo 写便条' }],
    answer: 'write', success: 'Bo 是做事的人，writes a note 是写便条。', takeaway: '先找谁，再找动作和对象。' },
  { reviewId: 'state-doors', requires: ['be-state'], title: '复习：谁怎么样？', prompt: '找出这句话描述的是谁、是什么状态。', dialogueLines: ['The doors are open.'],
    options: [{ id: 'room', label: '房间开着', hint: 'doors 是门；room 才是房间。' }, { id: 'doors', label: '这些门开着' }],
    answer: 'doors', success: 'The doors 是这些门；are open 说明它们开着。', takeaway: '先看谁，再看 is / are 后面的状态。' },
  { reviewId: 'count-pens', requires: ['noun-count'], title: '复习：数量跟着哪个词？', prompt: '分别找出笔和笔记本的数量。', dialogueLines: ['I have two pens and three notebooks.'],
    options: [{ id: 'swap', label: '三支笔和两本笔记本', hint: 'two 在 pens 前，three 在 notebooks 前。' }, { id: 'count', label: '两支笔和三本笔记本' }],
    answer: 'count', success: 'two pens 是两支笔，three notebooks 是三本笔记本。', takeaway: '把数字和后面的名词放在一起读。' },
  ...reviewPair('notice-time', '复习：几点开始？', '选星期和时间。', [
    ['notice-time-monday', ['The meeting starts at 4 p.m. on Monday.'], '星期一下午四点', '星期一上午四点', '4 p.m. 是下午四点。', '先核对 a.m. 或 p.m.，再看星期。'],
    ['notice-time-late', ['The meeting starts at 3 p.m. on Friday.'], '星期五下午三点', '星期一下午三点', 'Friday 是星期五。', 'on 后面的词告诉你星期几。'],
  ]),
  ...reviewPair('notice-place', '复习：去哪儿集合？', '选集合地点。', [
    ['notice-place-library', ['Meet in the library.'], '图书馆', '206 室', '这里没有 Room 或房间号。', '在 Meet in 后面找集合地点。'],
    ['notice-place-classroom-event', ['Meet in the classroom at 9 a.m.', 'Bring a book from the school library.'], '在教室集合', '在学校图书馆集合', '图书馆在 from 后面，表示书从哪里拿。集合地点要看 Meet in。', '两个地点都看见了，还要判断哪个地点跟集合有关。'],
  ]).map((task) => task.reviewId === 'notice-place-classroom-event' ? { ...task, glossary: [['from', '从……来']] } : task),
  ...reviewPair('notice-bring', '复习：由谁准备？', '选要自己带的东西。', [
    ['notice-bring-pen', ['The school will lend you a notebook.', 'Bring a pen.'], '笔', '笔记本', '笔记本是学校借给你的。', 'Bring 后面才是自己要带的东西。'],
  ]),
  ...reviewPair('notice-whole', '复习：从不同的行找时间、地点和物品', '选和通知完全对得上的安排。', [
    ['notice-whole-art-club', ['The art club starts at 9 a.m. on Friday.', 'Bring a pencil.', 'Meet in Room 206.'], '星期五上午九点 · 206 室 · 带铅笔', '星期五上午九点 · 206 室 · 带笔', 'Bring 后是 pencil，不是 pen。', '换成美术社的通知，找信息的短语还是 starts at、Meet in、Bring。'],
    ['notice-whole-book-club', ['Meet in the library.', 'Bring a notebook. The school will lend you a pen.', 'The book club starts at 4 p.m. on Monday.'], '星期一下午四点 · 图书馆 · 带笔记本', '星期一下午四点 · 图书馆 · 带笔', 'pen 跟着 lend you，是学校借给你的。', '先找 Bring 再认物品，不被借给你的东西带偏。'],
  ]).map((task, index) => ({
    ...task,
    glossary: index === 0 ? [['art club', '美术社']] : [['book club', '读书社']],
    options: [...task.options, index === 0
      ? { id: 'time', label: '星期五下午九点 · 206 室 · 带铅笔', hint: 'a.m. 是上午。' }
      : { id: 'place', label: '星期一下午四点 · 206 室 · 带笔记本', hint: 'Meet in 后是 the library。' }],
  })),
  ...reviewPair('sentence-core', '复习：谁做了什么？', '选这句话的意思。', [
    ['core-mei-book', ['Mei reads a book.'], 'Mei 读书', 'Mei 写便条', 'reads 是读，不是写。', '先找谁，再找动作。'],
    ['core-borrow-map', ['Bo borrows a map（地图）from Lin.'], 'Bo 向 Lin 借地图', 'Lin 向 Bo 借地图', 'borrows 前面是 Bo；from Lin 说明地图从 Lin 那里来。', '换个人、换件东西，还是先找动作前面的人。'],
  ]),
  ...reviewPair('be-state', '复习：找状态', '选这句话的意思。', [
    ['state-quiet-room', ['The room is quiet.'], '房间很安静', '房间开着', 'quiet 才是这里的状态。', 'is 后面的词在说房间怎么样。'],
    ['state-library-classroom', ['The school library is open.', 'The classroom is quiet.'], '图书馆开放，教室安静', '图书馆安静，教室开放', '第一句是 library is open；第二句才说 quiet。', '每个地点有自己的状态，别把两句对调。'],
  ]),
  ...reviewPair('time-verbs', '复习：平时和昨天', '只选题目问的那个时间。', [
    ['time-verbs-study', ['I study in the school library every day.', 'Yesterday, I studied in the classroom.'], '昨天在教室学习', '昨天在学校图书馆学习', '图书馆是 every day 那句的地点。', '同样是学习，地点要和具体时间配对。'],
  ]),
  ...reviewPair('reference-basics', '复习：把名词换回 it 的位置', '看看哪样东西符合第二句的描述。', [
    ['reference-basics-pen', ['I put a pen on the desk.（desk：桌子）', 'It has blue ink.（ink：墨水）'], '笔', '桌子', '桌子离 It 更近，但有蓝色墨水的是笔。', '不要只认最近的名词，先把它代进去读。'],
  ]),
  ...reviewPair('noun-count', '复习：对上数量', '选这句话的意思。', [
    ['count-notebooks', ['I have one notebook and two pens.'], '一本笔记本和两支笔', '两本笔记本和一支笔', 'one 跟着 notebook；two 跟着 pens。', '数字和它后面的物品一起读。'],
    ['count-library-books', ['The school will lend you one pencil.', 'Bring three books and two pens.'], '自带三本书和两支笔', '自带一支铅笔和两支笔', '铅笔在 lend you 后；要自带的东西在 Bring 后。', '先读动作，再给每一样物品对上数量。'],
  ]),
  { reviewId: 'ask-tao', skill: 'ask-name', requires: ['ask-name'], englishOptions: true, title: '复习：问对方叫什么', prompt: '老师给你换了一个新搭档。选问名字的那句。',
    options: [{ id: 'ask', label: 'What’s your name?' }, { id: 'hello', label: 'Hi!', hint: 'Hi 是打招呼，不是在问名字。' }],
    answer: 'ask', success: '用 What’s your name? 问对方叫什么。', takeaway: 'your name 指对方的名字。' },
  { reviewId: 'meet-bo', requires: ['first-conversation'], englishOptions: true, title: '复习：回应「很高兴认识你」', prompt: '实训课搭档说了这句，怎么回？', dialogueLines: ['Bo: Nice to meet you.'],
    options: [{ id: 'greet', label: 'Hi!', hint: '可以用带 too 的句子表达「我也很高兴」。' }, { id: 'reply', label: 'Nice to meet you, too.' }],
    answer: 'reply', success: '句尾的 too 表示「也」。', takeaway: 'Nice to meet you, too. 是礼貌接话。' },
  ...reviewPair('context-cloze', '复习：转折还是原因？', '把连接词填进去，前后意思要接得上。', [
    ['cloze-cold', ['It was cold, ____ we still played outside.'], 'but', 'because', 'still 是「仍然」。天气冷，却还是出去玩。', '前后转折用 but。'],
    ['cloze-rain', ['We played inside ____ it rained.'], 'because', 'but', '下雨是在说明为什么留在室内。', 'because 后面接原因。'],
  ]),
  ...reviewPair('cloze-collocations', '复习：搭配放回句子', '选能和前后文都接上的词。', [
    ['collocation-photo', ['The team smiled for the camera. Mei took a ____.'], 'photo', 'break', 'camera 是相机，smiled for the camera 是对着镜头笑。', 'take a photo 和镜头线索一致。'],
    ['collocation-list', ['Before going to the shop, Bo made a ____: apples, bread and milk.'], 'list', 'photo', '冒号后列出要买的三样东西。', 'make a list 后面可以接一串项目。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('cloze-later-clue', '复习：往后找地点', '第二句说了发生的事。选能对上的地点。', [
    ['clue-rain-gym', ['It rained, so the class went to the ____.', 'They played basketball inside.'], 'gym', 'library', '里面打篮球，和体育馆最符合。', '下雨不是地点线索，后面的活动才是。'],
    ['clue-desk-library', ['The teacher took us to the ____.', 'We returned our books there.'], 'library', 'gym', 'returned our books 是还书。', '用后文的还书动作找图书馆。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('cloze-read-back', '复习：回填后因果别读反', '把连接词代进去，前后两件事顺不顺？', [
    ['readback-tired', ['We were tired, ____ we took a break.'], 'so', 'because', '先累，再休息；休息是结果。', 'so 后接结果。'],
    ['readback-quiet', ['We read in the library ____ it was quiet.'], 'because', 'so', '安静解释了为什么在那里读。', 'because 后给原因。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('service-borrow', '复习：同意还是拒绝借用', '读完答句再选。', [
    ['borrow-library', ['Can I borrow this book?', 'Sure. Here you are.'], '同意借书', '拒绝借书', 'Sure 表示同意。', 'Here you are 说明对方把东西递给你。'],
    ['borrow-art', ['Can I borrow your pencil for art class?', 'Sorry, I need it now.'], '暂时不能借', '已经借到了', '对方自己现在还要用。', 'Sorry 和 need it now 组合起来是拒绝。'],
  ]),
  ...reviewPair('service-directions', '复习：找目标和方向', '读问路与指路的两句。', [
    ['directions-library', ['Where is Room 105?', 'It’s next to the office.'], '105 室在办公室旁边', '目的地是办公室', '问句是 Room 105，办公室只是参照。', '先看问的地点，再看参照点。'],
    ['directions-gate', ['Where is the school gate?', 'Turn left, then go straight.'], '先左转，再直走', '先直走，再左转', 'then 后面的动作晚一步。', '找方向也要尊重顺序。'],
  ]),
  ...reviewPair('service-booking', '复习：哪个时间约成了', '以最后的答复为准。', [
    ['booking-notice', ['How about Friday?', 'I’m busy on Friday. Is Monday OK?', 'Monday is fine.'], '星期一', '星期五', '星期五已经被排除。', 'is fine 确认了星期一。'],
    ['booking-poster', ['Can we make the poster at 9 a.m.?', 'I’m busy then. Is 10 a.m. OK?', '10 a.m. is fine.'], '上午十点', '上午九点', '九点是没接受的提议。', '别只记住第一个出现的时间。'],
  ]),
  ...reviewPair('reading-order', '复习：把步骤排回来', '用 first、then 或 finally 核对。', [
    ['order-art', ['First, draw a line. Then write your name on it.'], '先画线', '先写名字', 'first 后面是 draw。', '先后顺序由连接词告诉你。'],
    ['order-library', ['First, find your book. Then show it to the teacher. Finally, take it home.'], '最后把书带回家', '最后给老师看', '给老师看在 then 后面。', 'finally 后面才是最后一步。'],
  ]),
  ...reviewPair('reading-examples', '复习：观点还是例子', '用例子找能概括它的观点。', [
    ['examples-bag', ['Small changes save time. For example, pack your bag before you go to bed.'], '小改变能省时间', '只能在晚上收包', '收包是例子，不是唯一办法。', 'for example 前常给出更宽的观点。'],
    ['examples-cup', ['We can reuse many things. For example, grow a small plant in an old cup.'], '许多东西可以再次使用', '所有植物只能用杯子种', '杯子只是一个例子。', '观点不能缩成例子那一个细节。'],
  ]),
  ...reviewPair('reading-purpose', '复习：作者想让你做什么', '用整段写法判断，不猜作者心情。', [
    ['purpose-break', ['Here is how to make a reading card. First, write the book’s name. Then write one thing you like about it.'], '教读者做读书卡', '邀请读者参加比赛', 'First 和 Then 在列步骤。', '列步骤通常是在教方法。'],
    ['purpose-sport', ['Join our basketball club on Monday! Sign up in Room 105.'], '邀请报名参加社团', '通知社团已经关闭', 'Join 和 Sign up 是邀人参加。', '看作者希望读者接下来做什么。'],
  ]),
  ...reviewPair('present-routine', '复习：主语变了，动词怎么变', '先找是谁，再补日常动作。', [
    ['present-mei-play', ['Mei ____ basketball on Fridays.'], 'plays', 'play', 'Mei 是一个人，用 plays。', '姓名指一个人，给这里的动词加 s。'],
    ['present-we-read', ['We ____ in the library after class.'], 'read', 'reads', 'We 是我们，不是一个人。', 'We 后用原形 read。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('present-negative', '复习：日常否定句', '补出正确的否定形式。', [
    ['negative-library', ['Bo ____ in the library on Mondays.（不看书）'], 'doesn’t read', 'doesn’t reads', 'doesn’t 后只能用原形 read。', '第三人称的变化已放在 doesn’t 上。'],
    ['negative-basketball', ['We ____ basketball on Fridays.（不打篮球）'], 'don’t play', 'doesn’t play', 'We 后面用 don’t。', '先认主语，再决定用 don’t 或 doesn’t。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('present-questions', '复习：问习惯、读简短回答', '根据前一句选能接上的英语。', [
    ['question-club', ['____ Mei read in the library on Mondays?'], 'Does', 'Do', 'Mei 指一个人。', 'Does Mei 后面的 read 用原形。'],
    ['question-answer', ['Does she play basketball after class?', '____ She plays after class every day.'], 'Yes, she does.', 'No, she doesn’t.', '下一句说她经常打。', '回答要和下面的事实对上。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('past-negative', '复习：过去没做', '补出正确的否定形式。', [
    ['past-negative-shop', ['Bo ____ to the shop last Friday.（上周五没去商店）'], 'didn’t go', 'didn’t went', 'didn’t 后动词用原形。', '过去只标一次：didn’t go。'],
    ['past-negative-reading', ['I ____ at home yesterday.（昨天没在家看书）'], 'didn’t read', 'don’t read', '这里是 yesterday，讲的是过去。', '过去的否定用 didn’t，不用 don’t。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('past-questions', '复习：问过去的事', '根据问句结构或后面事实来选。', [
    ['past-question-office', ['Did you ____ to the office yesterday?'], 'go', 'went', 'Did 已经标出是过去。', 'Did 后的动作回到原形。'],
    ['past-question-club', ['Did Mei go to the club yesterday?', '____ She went there after class.'], 'Yes, she did.', 'No, she didn’t.', '下一句说她下课后去了。', '先看事实，再选 did 或 didn’t。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('past-story', '复习：按事情发生的顺序读', '只留下真正发生的事。', [
    ['past-story-room', ['Yesterday, Lin went to Room 105. Later, she read a book there. She didn’t play basketball.'], '先去105室，后来读书', '先打球，后来读书', 'didn’t play 表示没打球。', '用 Later 排顺序，不把没做的事算进去。'],
    ['past-story-gym', ['Yesterday, Mei played basketball in the gym. Later, she went home. She didn’t go to the shop.'], '先在体育馆打球，后来回家', '先回家，后来去商店', '回家发生在后来，去商店没发生。', '先区分做了和没做，再排先后。'],
  ]),
  ...reviewPair('future-will', '复习：用 will 说将来的事', '按中文意思选对将来的表达。', [
    ['future-will-home', ['Tomorrow, Mei will ____ at home.（明天 Mei 会在家看书）'], 'read', 'reads', 'will 后不用给 read 加 s。', 'will 已经在动作前，后面写原形 read。'],
    ['future-will-office', ['Next week, we ____ to the school office.（下周我们会去学校办公室）'], 'will go', 'went', 'went 讲过去，这里是 next week。', '下周的安排可以用 will go。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('future-negative', '复习：将来会做还是不会做', '读完整句，选符合安排的一项。', [
    ['future-negative-books', ['We will bring books tomorrow.', 'We won’t bring pens.'], '带书，不带笔', '带笔，不带书', 'won’t bring 否定的是带笔。', '两个 bring 的意思一样，will 和 won’t 决定带不带。'],
    ['future-negative-friday', ['Mei won’t go to the library on Friday.', 'She will go on Monday.'], '她星期一去图书馆', '她星期五去图书馆', '星期五对应 won’t go。', '没去的日期要排除，再找 will go 的日期。'],
  ]),
  ...reviewPair('future-notice', '复习：读变更后的集合安排', '排除取消项，再把日期、时间和地点合在一起。', [
    ['future-notice-gate', ['We will meet on Monday at 9 a.m.', 'We won’t meet in the gym.', 'We will meet at the school gate.'], '星期一上午九点，校门口', '星期一上午九点，体育馆', '日期和时刻没变，改的是集合地点。', 'will meet at the school gate 才是有效地点。'],
    ['future-notice-time', ['The club will meet on Friday in Room 206.', 'We won’t meet at 2 p.m.', 'We will meet at 3 p.m.'], '星期五下午三点，206 室', '星期五下午两点，206 室', 'won’t meet at 2 p.m. 取消的是两点，不是日期或房间。', '读出新时刻，再找仍然有效的日期和房间。'],
  ]),
  ...reviewPair('compare-direction', '复习：读清 than 两边', '按句子说的方向比较。', [
    ['compare-direction-bags', ['The red bag is lighter than the blue bag.（lighter：更轻；bag：包）'], '红色的包更轻', '蓝色的包更轻', 'lighter 描述的是 the red bag。', 'than 后的蓝色的包是比较对象。'],
    ['compare-direction-swim', ['Bo swims faster than Mei.（swims：游泳）'], 'Bo 游得更快', 'Mei 游得更快', 'swims faster 说的是 Bo 的动作。', '即使句子不用 is，谁 swims faster 就是谁更快。'],
  ]),
  ...reviewPair('compare-quantity', '复习：不到和超过', '判断哪一项可能符合英文。', [
    ['compare-quantity-notebook', ['The notebook costs less than 12 yuan.'], '可能是 9 元', '正好 12 元', 'less than 12 不包含 12 元。', '低于 12 元的价格才可能符合。'],
    ['compare-quantity-bus', ['The bus ride takes more than 30 minutes.'], '可能要 35 分钟', '只要 25 分钟', '25 少于 30，而原文说 more than 30。', '超过 30 分钟不表示正好 30 分钟。'],
  ]),
  ...reviewPair('compare-reading', '复习：看准范围再比较', '只比较问题指定的一组。', [
    ['compare-reading-days', ['On Monday, 14 students played basketball and 3 played table tennis（乒乓球）.', 'On Friday, 6 played basketball and 9 played table tennis.'], '星期五打乒乓球的更多', '星期五打篮球的更多', '14 是星期一的人数。星期五比的是 6 和 9。', '先锁定星期五，再比较同一天的两项活动。'],
    ['compare-reading-places', ['At the school shop, 16 students bought pens and 8 bought notebooks.', 'At the bookshop（书店）, 4 students bought pens and 19 bought notebooks.'], '在学校商店买笔的更多', '在学校商店买笔记本的更多', '书店是另一组。学校商店的数据是笔 16 人，笔记本 8 人。', '先锁定学校商店，不把另一个地点的数据混进来。'],
  ]).map((task, index) => ({ ...task, prompt: index === 0 ? '只看星期五，哪项活动人更多？' : '只看学校商店，买哪样东西的人更多？' })),
  ...reviewPair('reason-or-purpose', '复习：已有的原因，还是想达到的目的', '按问题找对应的线索。', [
    ['reason-purpose-water', ['Lin was thirsty（口渴的）. She went to the shop to buy water.'], '买水', '她口渴了', '口渴是出发前的原因；to buy water 是去商店想做的事。', '把已有的原因和想做的事分开。'],
    ['reason-purpose-seat', ['Bo moved（挪动）his chair because he couldn’t see the board（黑板）. He moved it to sit closer（坐近一点）.'], '他看不见黑板', '他想坐近一点', '坐近一点是目的；because 后的看不见黑板是已有的原因。', '问是什么情况促使他行动，就找 because 后面的内容。'],
  ]).map((task, index) => ({ ...task, prompt: index === 0 ? 'Lin 去商店想做什么？' : '什么情况让 Bo 决定挪椅子？' })),
  ...reviewPair('purpose-or-result', '复习：打算不等于结果', '哪项是原文明确说已经发生的？', [
    ['purpose-result-notes', ['Mei copied the notes（抄了笔记）so that she could read them at home.', 'She left the notes at school（把笔记落在学校）.'], '她把笔记落在学校了', '她在家读了笔记', '在家读是她抄笔记的目的，并不等于已经读了。', '用实际发生的那句回答结果题。'],
    ['purpose-result-umbrella', ['Lin took an umbrella（带了伞）so that she could stay dry（不被淋湿）.', 'It didn’t rain, so she didn’t use the umbrella.'], '她没用伞', '她下雨时用了伞', '后一句明确说没下雨，所以没用伞。', 'so that 后是带伞的目的，so 后是实际结果。'],
  ]),
  ...reviewPair('reason-purpose-reading', '复习：从短文里找原因、目的和结果', '按问题找证据，别用另一格的信息来答。', [
    ['reason-reading-friend', ['Mei’s phone was broken（坏了）, so she went to the office to call a friend.', 'But her friend didn’t answer（没接电话）.'], '她的手机坏了', '她的朋友没接电话', '没接电话发生在打电话之后，不是她去办公室的原因。', '第一句先说原因，再说去办公室；最后一句说明结果。'],
    ['reason-reading-book', ['The library was open, so Bo went there to borrow a book.', 'But the book wasn’t there. He borrowed a different book（另一本书）.'], '他借了另一本书', '他借到了原先想借的书', '书不在馆里；最后一句说他借的是另一本。', '去借书的目的和最后借到什么，要分开读。'],
  ]).map((task, index) => ({ ...task, prompt: index === 0 ? '什么情况让 Mei 去了办公室？' : 'Bo 最后借到了什么？' })),
  ...reviewPair('rules-can-must', '复习：允许还是必须', '按规则回答，不把允许当成要求。', [
    ['rules-must-library', ['You must show your student card at the library desk（图书馆服务台）.', 'You can borrow books.'], '出示学生证', '借书', 'can borrow 是可以借，不是必须借。', '问哪件必须做，就找 must 后的动作。'],
    ['rules-can-room', ['You can use Room 105 after class.', 'You must close the door（关门）when you leave（离开时）.'], '下课后用 105 室', '离开时关门', '关门前面是 must；用房间前面是 can。', 'can 给的是许可，不是命令。'],
  ]).map((task, index) => ({ ...task, prompt: index === 0 ? '哪件事必须做？' : '哪件事被允许，但不是必须的？' })),
  ...reviewPair('rules-mustnt-optional', '复习：禁止还是不必', '读清 mustn’t 和 don’t have to。', [
    ['rules-optional-pen', ['You don’t have to bring a pen. The office has pens.'], '可以不带笔', '不能带笔', 'don’t have to 表示不必。', '不必带，不等于禁止带。'],
    ['rules-no-food', ['You must not bring food into the library.', 'You don’t have to bring a notebook.'], '食物不能带，笔记本不必带', '笔记本不能带，食物不必带', 'must not 禁止带食物；don’t have to 指笔记本不必带。', 'must not 是 mustn’t 的完整写法。'],
  ]),
  ...reviewPair('rules-who-reading', '复习：哪条规则适用于你', '先看自己的情况，再加上适用于所有人的规定。', [
    ['rules-reading-form', ['If you have the form（表格）, you must give it to the teacher（交给老师）.', 'If you don’t have the form, you must write your name.', 'For everyone: You mustn’t take photos.'], '把表格交给老师，不能拍照', '写姓名，不能拍照', '你已经带了表格，要按第一条办。', '原文规定的是有表格就交，没有才写姓名。'],
    ['rules-reading-club', ['If you are new, you must bring a photo（照片）.', 'If you are not new, you don’t have to bring a photo.', 'For everyone: You must show your student card.'], '不必带照片，但必须出示学生证', '不必带照片，也不必出示学生证', '不用带照片只是第二条。出示学生证是所有人的要求。', '挑完适用的条件，还要读所有人都要遵守的规则。'],
  ]).map((task, index) => ({ ...task, prompt: index === 0 ? '你带了表格。怎么做才符合通知？' : '你不是新成员。通知对你有什么要求？' })),
  ...reviewPair('passive-roles', '复习：被动句里谁做了什么', '先找受影响的东西，再看有没有写明是谁做的。', [
    ['passive-roles-picture', ['The picture was drawn（画）by Lin.'], 'Lin 画了这幅图', '图上画的是 Lin', 'by Lin 说谁画的，不是画了谁。', 'by Lin 交代做事的人。'],
    ['passive-roles-box', ['The teacher opened the box（打开了盒子）.', 'The box was opened by the teacher.'], '两句都说老师打开了盒子', '第一句是老师打开盒子，第二句没有说谁打开的', '第二句有 by the teacher，也说了谁打开的。', '两种说法可以描述同一件事。'],
  ]),
  ...reviewPair('passive-no-agent', '复习：没写是谁，就不要猜是谁', '只选原文明确提供的信息。', [
    ['passive-no-agent-doors', ['The doors were painted（刷漆）on Friday.'], '门是星期五刷的', '老师星期五刷了门', 'on Friday 说的是时间。句子没说谁刷的。', '被动句不一定写出做事的人。'],
    ['passive-no-agent-tickets', ['The tickets（票）were sent（寄出）yesterday.'], '票昨天寄出了', '学生昨天收到了票', 'sent 说票寄出了，不表示学生已经收到。', '读清原文的动作，不添没说的信息。'],
  ]),
  ...reviewPair('passive-notice', '复习：按最新通知行动', '找出变了什么，再保留没变的安排。', [
    ['passive-notice-time', ['The start time of the game was changed from 2 p.m. to 4 p.m.', 'It will still be in the gym.'], '下午四点去体育馆', '下午两点去体育馆', 'from 2 p.m. 是原时刻，to 4 p.m. 才是新时刻。', '时刻变了，体育馆没变。'],
    ['passive-notice-place', ['The art show（美术展）was moved from Room 202 to Room 108.', 'It will still open on Friday.'], '星期五去 108 室', '星期五去 202 室', 'to Room 108 才是新地点。', '日期仍是星期五，房间改到了 108 室。'],
  ]),
  ...reviewPair('relative-people', '复习：who 后是辨认人群的线索', '分清用来认人的信息和这批人要做的事。', [
    ['relative-people-practice', ['Students who missed practice（没参加训练）on Friday will practise on Monday.'], '星期一训练', '星期五训练', '星期五是没参加训练的那天；will practise 后面才是星期一。', '日期跟着它所在的动作读。'],
    ['relative-people-keys', ['The student who found the keys（捡到钥匙）must take them to the office.'], '捡到钥匙的学生要把钥匙送到办公室', '办公室里有学生捡到了钥匙', 'to the office 跟的是 take them，表示钥匙要送去哪儿。', 'who found the keys 用来确认是哪位学生。'],
  ]),
  ...reviewPair('relative-things', '复习：按描述找对物品', '读名词后的 that，选出原文说的东西。', [
    ['relative-things-cup', ['Use the cup that has a red star（红色星星）on it.'], '上面有红色星星的杯子', '随便一个红色的杯子', '原文说星星是红色的，不是说杯子是红色的。', '把 that 后的描述整个读完。'],
    ['relative-things-form', ['Print the form that shows the new date（新日期）.'], '打印写有新日期的表格', '把所有表格都打印出来', 'that shows the new date 指定了要打印哪张。', '先找动作，再确认动作针对哪个物品。'],
  ]),
  ...reviewPair('relative-notice', '复习：看清哪一组，按哪条做', '先找符合题目条件的那一行，再读那一行的安排。', [
    ['relative-notice-classes', ['Students who have art class（美术课）on Monday must bring a pencil.', 'Students who have art class on Friday must bring a notebook.'], '带笔记本', '带铅笔', 'Friday 在第二条，后面的要求是带笔记本。', '不要把星期五这组和星期一的要求拼到一起。'],
    ['relative-notice-boxes', ['Put boxes that have a green label（绿色标签）in Room 109.', 'Put boxes that have a yellow label（黄色标签）in Room 206.'], '放到 109 室', '放到 206 室', '绿色标签是第一条；206 室对应黄色标签。', '先用标签认出是哪一箱，再找同一句的地点。'],
  ]).map((task, index) => ({ ...task, prompt: index === 0 ? '你星期五上美术课。要带什么？' : '你拿的是贴绿色标签的箱子。放到哪里？' })),
  ...reviewPair('vocab-borrow-lend', '复习：借进还是借出', '读句子，分清谁借给谁。', [
    ['vocab-borrow-ruler', ['Lin borrows a ruler（尺子）from Bo.'], 'Bo 把尺子借给 Lin', 'Lin 把尺子借给 Bo', 'borrows 前的 Lin 借到尺子，from Bo 表示尺子从 Bo 那里来。', '借来的人在 borrow 前面。'],
    ['vocab-lend-map', ['Mei lends Bo a map（地图）.'], 'Mei 把地图借给 Bo', 'Bo 把地图借给 Mei', 'lends 前面的 Mei 是借出地图的人。', 'lend 的方向是借出去。'],
  ]),
  ...reviewPair('vocab-return-keep', '复习：留用还是归还', '找出这句说明的要求。', [
    ['vocab-keep-ruler', ['You can keep the ruler（尺子）for one day.'], '尺子可以留用一天', '不能把尺子留在手里', 'keep 是留用；for one day 说能留多久。', '把留用时长和归还时间分开。'],
    ['vocab-return-key', ['Return the key（钥匙）on Friday.'], '星期五归还钥匙', '星期五借一把钥匙', 'Return 是归还，不是借来。', '日期要跟动作一起读。'],
  ]),
  ...reviewPair('vocab-library-reading', '复习：借还说明里的日期', '先看是借还是还，再核对物品和日期。', [
    ['vocab-reading-map', ['You can borrow a map and a book.', 'Return the map on Monday. Keep the book until Friday（直到星期五）.'], '星期一归还地图', '星期一归还书', 'Return 后是 map；书可以留用到星期五。', '归还日期要同物品配对。'],
    ['vocab-reading-kit', ['You can borrow a pen and a ruler.', 'Return the pen on Thursday（星期四） and the ruler on Friday.'], '星期五归还尺子', '星期五借一把尺子', 'Friday 配的是尺子，整句说的是 Return。', '看到日期别停，还要核对动词。'],
  ]).map((task, index) => ({ ...task, prompt: index === 0 ? '星期一该做什么？' : '星期五该做什么？' })),
  ...reviewPair('poster-signup', '复习：读海报的地点', '找题目问的那件事。', [
    ['poster-signup-drawing', ['Drawing Club', 'Meet in the art room（美术教室）.', 'Sign up in Room 207.'], '207 室', '美术教室', '美术教室是集合地点；报名看 Sign up。', '先看动作，再找地点。'],
    ['poster-meet-school', ['Music Club', 'Sign up at the school office.', 'Meet in the classroom.'], '教室', '学校办公室', '问集合，不是报名；看 Meet in。', '问的是不同的事，地点也可能不一样。'],
  ]).map((task, index) => ({ ...task, prompt: index === 0 ? '想报名，去哪儿？' : '已经报过名了，去哪儿集合？' })),
  ...reviewPair('poster-no-experience', '复习：读清参加条件', '假设你刚入门，选正确的理解。', [
    ['poster-experience-music', ['Music Club: No experience needed.', 'Bring a notebook.'], '可以参加，但要带笔记本', '可以参加，也不用带任何东西', '不要求经验不等于免除带东西的要求。', '经验和物品是两回事，分别读。'],
    ['poster-experience-game', ['Game Club: You must already know the rules（已经懂规则）.', 'Art Club: No experience needed.'], '没经验也能参加美术社', '没经验也能参加游戏社', '游戏社说 must already know the rules。', '别把另一张海报的条件带过来。'],
  ]),
  ...reviewPair('poster-compare', '复习：条件和时间都要对上', '你没学过这些活动，也不会游泳，下午四点才能到。哪个符合要求又来得及？', [
    ['poster-compare-art', ['Drawing Club: No experience needed. Starts at 5 p.m.', 'Book Club: No experience needed. Starts at 3:30 p.m.', 'Swim Club: You must already know how to swim. Starts at 5 p.m.'], '绘画社', '读书社', '读书社虽然欢迎新手，但三点半开始。', '绘画社不要求经验，五点也赶得上。'],
    ['poster-compare-photo', ['Swim Club: You must already know how to swim. Starts at 6 p.m.', 'Photo Club: No experience needed. Starts at 4:30 p.m.', 'Music Club: No experience needed. Starts at 2 p.m.'], '摄影社', '游泳社', '六点来得及，但游泳社要求已经会游泳。', '摄影社不要求经验，四点半也来得及。'],
  ]).map((task, index) => ({ ...task,
    glossary: index === 0 ? [['Book Club', '读书社'], ['Drawing Club', '绘画社'], ['Swim Club', '游泳社']]
      : [['Swim Club', '游泳社'], ['Photo Club', '摄影社'], ['Music Club', '音乐社']],
    options: [...task.options, index === 0
      ? { id: 'other', label: '游泳社', hint: '五点来得及，但游泳社要求已经会游泳。' }
      : { id: 'other', label: '音乐社', hint: '音乐社下午两点开始，四点到就晚了。' }],
  })),
  ...reviewPair('insert-reference', '复习：代词接住谁', '把一句话放回空格，再看 They 的动作。', [
    ['insert-reference-gym', ['Bo went to the gym. ____', 'They asked him to play.（请他一起玩）'], 'Two friends were there.', 'Two balls were there.', '球不会请 Bo 一起玩。', '数量和动作要一起核对。'],
    ['insert-reference-kittens', ['Mei looked under the table. ____', 'They were looking for food.（在找吃的）'], 'Two small cats were there.', 'Two school bags were there.', '书包不会寻找食物。', '这里的 They 指前面提到的小猫。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('insert-relation', '复习：看句子之间是什么关系', '选接得上上下文的整句。', [
    ['insert-relation-home', ['We can use old things again.（旧东西可以再用） ____'], 'For example, we can use an old cup for pens.', 'For example, my cup is new.', '举例要说明如何再用旧物，不是只说杯子是新的。', '用旧杯子放笔是对前一句的举例。'],
    ['insert-relation-park', ['It was cold. ____', 'The team finished the game.'], 'But they still played.', 'For example, they went home.', '后面说球队打完了比赛。回家没接上这个结果。', '冷但继续打，才能接到后来打完。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('insert-both-sides', '复习：放回去，检查两边', '哪句能解释后面为什么变了？', [
    ['insert-both-sides-light', ['The room was dark（暗的）. ____', 'Now Mei could see her book.'], 'Lin turned on the light.（开灯）', 'Mei had two books.', '两本书解释不了为什么现在看得见了。', '开灯同时接住房间暗与后来能看见。'],
    ['insert-both-sides-map', ['Bo did not know the way（不认识路）. ____', 'Now he could find the office.'], 'A student showed him a map.（给他看地图）', 'The office was open.', '办公室开着不代表 Bo 知道路。', '地图解释了他为什么后来找得到。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('gap-what', '复习：空格缺哪种信息', '看后一行给什么信息，再选。', [
    ['gap-what-snack', ['I don’t know ____ Bo wants to eat.', 'He wants an apple.（苹果）'], 'what', 'where', '苹果是想吃的东西，不是地点。', '问吃什么，用 what。'],
    ['gap-where-key', ['I don’t know ____ the key is.', 'It is in the bag.'], 'where', 'what', 'in the bag 给的是位置。', '问在哪儿，用 where。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('gap-word-job', '复习：词形取决于位置', '看空格是在描述谁，还是在说怎么做。', [
    ['gap-adverb-copy', ['Mei copies（抄写）the words ____. (slow)'], 'slowly', 'slow', '这里说抄写得怎样。', '用 slowly 描述 copies。'],
    ['gap-adjective-student', ['Bo is ____. (careful)'], 'careful', 'carefully', '这里在说 Bo 是怎样的人。', '用 careful 描述人。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('gap-spend-ing', '复习：花时间做什么', '选出适合 spend + 时间的动作形式。', [
    ['gap-spend-write', ['I spend ten minutes ____ a note. (write)'], 'writing', 'write', '空里是花十分钟做的事。', '即使没写 in，也要用 writing。'],
    ['gap-spend-study', ['Mei spends an hour in ____ at the library. (study)'], 'studying', 'study', 'spend an hour in 后写这段时间做的事。', 'study 在这里用 studying。'],
  ]).map((task) => ({ ...task, englishOptions: true })),
  ...reviewPair('reading-main-idea', '复习：短文主要在说什么？', '把开头和结尾连起来，别只选一个细节。', [
    ['main-bo', ['Bo could not swim. He practised with a friend. Later, he learned to swim.'], 'Bo 从不会游泳到学会了', 'Bo 认识一个朋友', '朋友只是帮助他练习的细节。', '主旨要覆盖人物前后的变化。'],
    ['main-mei', ['Mei was afraid to talk in class. She practised every week. Later, she spoke to the whole class.'], 'Mei 从不敢发言到敢对全班说话', 'Mei 每周和同学一起游泳', '短文说的是 talk in class，不是游泳。', '先看开头遇到的事，再看结尾怎样了。'],
  ]),
  ...reviewPair('link-a-sentence', '复习：哪句话能接上？', '从前后两句找一个能接起来的句子。', [
    ['link-bag', ['Mei has a bag. ____'], 'It is red.', 'I need a pen.', '上一句的重点是 Mei 的包。It 可以接着说这个包。', '接回去后，前后仍在说同一个东西。'],
    ['link-note', ['I need a pen. ____', 'I can now write a note.'], 'Mei gives me a pen.', 'The room is blue.', 'now 提示处境变了。借助笔，才解释得通为什么现在能写便条。', '好选句既接得上前一句，也能解释后一句。'],
  ]),
  ...reviewPair('past-form', '复习：给动作配过去式', 'Yesterday 指过去。选合适的动词形式。', [
    ['past-play', ['Yesterday, I ____ basketball.'], 'played', 'play', 'play 是原形。这里讲已经发生的事。', 'play 是规则动词，过去式是 played。'],
    ['past-go', ['I ____ home after class yesterday.'], 'went', 'goed', 'go 的过去式是不规则变化。', 'go 的过去式是 went。'],
  ]),
  ...reviewPair('embedded-question', '复习：tell me 后的顺序', '这不是单独提问。选能直接接在 tell me 后的部分。', [
    ['embedded-time', ['Please tell me ____.（会议几点开始）'], 'what time the meeting starts', 'what time does the meeting start', '接在 tell me 后，用「会议＋开始」的顺序。', '先写疑问词，再写谁或什么，最后写动作。'],
    ['embedded-room', ['Please tell me ____.（房间在哪里）'], 'where the room is', 'where is the room', '这里先写 the room，is 放在后面。', 'where the room is 可以直接接在 tell me 后面。'],
  ]),
  ...reviewPair('email-plan', '复习：先把邮件要点圈出来', '不用写邮件，先选一个不漏题目要求的提纲。', [
    ['email-fair', ['给 Bo 写邮件，介绍喜欢的校园活动并说明为什么喜欢。'], '写给 Bo，介绍活动并说明喜欢的原因', '写给 Bo，只列活动时间地点', '题目还要说明为什么喜欢。', '先找收件人，再圈主题和必写要点。'],
    ['email-club', ['给 Alex 写邮件，说你参加什么社团、每周怎么参加。'], '写给 Alex，说社团和参加方式', '写给 Bo，只说喜欢哪个社团', '收件人是 Alex，还要说怎么参加。', '提纲必须按这一次的题干来，不套上一次的要点。'],
  ]).map((task) => ({ ...task, linesLanguage: 'zh-CN' })),
  ...[
    ...reviewPair('sentence-past-phrase', '复习：把过去的动作补进句子', '只选填进空格的部分。', [
      ['sentence-past-washed-plate', ['Last Sunday, Lin ____ after lunch.', '洗了一个盘子'], 'washed a plate', 'washes a plate', 'Last Sunday 表示上周日，选过去的词形。', 'Last Sunday 已经给出过去时间，空里只补 washed a plate。'],
      ['sentence-past-worked-there', ['A year ago, they ____.', '在那里工作'], 'worked there', 'work there', 'A year ago 表示一年前；这里讲的是过去的事。', 'A year ago 和 they 已经给了，空格中要写过去的动作 worked，也别漏掉 there（在那里）。'],
    ]),
    ...reviewPair('sentence-location-question', '复习：把地点问句接进去', '只选填进空格的部分。', [
      ['sentence-location-music-room', ['Could you tell me ____?', '音乐教室在哪里'], 'where the music room is', 'where is the music room', '这里接在 tell me 后，地点名放到 is 前。', 'where 后面先放地点名，再放 is；右边保留题目给的问号。'],
      ['sentence-location-playground', ['Please show us ____ on this map.', '操场在哪里'], 'where the playground is', 'where the playground is on this map', '右边已有 on this map，不要重复写。', 'where the playground is 是空里的部分；on this map 留在空格右边。'],
    ]),
    ...reviewPair('sentence-proud-boundary', '复习：看谁自豪、of 写在哪儿', '只选填进空格的部分。', [
      ['sentence-proud-bo-team', ['Last week, Bo ____ of his team.', '感到自豪'], 'was proud', 'were proud', 'Last week 是过去；说 Bo 一个人，用 was。', 'Bo 用 was，of 已在右边，只补 was proud。'],
      ['sentence-proud-they-poster', ['Yesterday, they ____ their poster.', '为他们的海报感到自豪'], 'were proud of', 'were proud', '右边在 their poster 前没有 of，填空时要把 of 补上。', 'they 用 were；右边只有 their poster，所以 of 留在空格里。'],
    ]),
  ].map(({ dialogueLines: [line, chinese], ...task }) => ({
    ...task, dialogueLines: [line], prompt: `根据中文「${chinese}」，只选填进空格的部分。`, englishOptions: true,
  })),
]);

// 回练沿用三节课的句型，不要求再学新词。
window.REVIEW = Object.freeze([
  {
    title: '先打个招呼',
    prompt: '社团活动要两人一组。你叫 Tao，想跟新搭档打个招呼、说自己的名字。选哪句？',
    options: [
      { id: 'old', label: 'Hi, I’m Lin.', hint: '这句是在介绍自己，不过这次你叫 Tao，不是 Lin。' },
      { id: 'self', label: 'Hi, I’m Tao.' },
      { id: 'ask', label: 'What’s your name?', hint: '这句是在问对方。你现在要先告诉对方自己的名字。' },
    ],
    answer: 'self',
    success: '对，I’m 后面接自己的名字。',
    takeaway: '打招呼、说自己的名字',
  },
  {
    title: '再问对方的名字',
    prompt: '你已经打过招呼了，但还不知道搭档叫什么。选一句问对方。',
    options: [
      { id: 'self', label: 'Hi, I’m Tao.', hint: '这句只说了你自己的名字，没有问对方。' },
      { id: 'meet', label: 'Nice to meet you.', hint: '这句是「很高兴认识你」，不是在问名字。' },
      { id: 'ask', label: 'What’s your name?' },
    ],
    answer: 'ask',
    success: '对，What’s your name? 就是在问对方叫什么。',
    takeaway: '问对方叫什么',
  },
  {
    title: '接上最后一句',
    prompt: '对方告诉你，她叫 Mei。接着她说了下面这句。你怎么回？',
    english: 'Nice to meet you.',
    options: [
      { id: 'reply', label: 'Nice to meet you, too.' },
      { id: 'ask', label: 'What’s your name?', hint: 'Mei 已经说了名字，不用再问。找找哪句有 too（也）。' },
      { id: 'self', label: 'Hi, I’m Tao.', hint: '你已经介绍过自己了。现在要说「我也很高兴认识你」。' },
    ],
    answer: 'reply',
    success: '接上了。句尾的 too 是「也」：我也很高兴认识你。',
    takeaway: '回一句「我也很高兴认识你」',
  },
]);

// 原创过渡练习，不是原卷题，也不代表正式题量。
window.EXAM_BRIDGE = Object.freeze([
  {
    title: '选一句，补全对话',
    prompt: '先看中文提示：Mia 在问对方的名字。',
    dialogueLines: ['Mia: Hi! What’s your name?', 'Leo: ____'],
    options: [
      { id: 'greet', label: 'Hi!', hint: 'Hi 是打招呼，但没回答名字。' },
      { id: 'name', label: 'Hi, I’m Leo.' },
      { id: 'ask', label: 'What’s your name?', hint: '这句又问了一遍。Leo 应该说自己的名字。' },
    ],
    answer: 'name',
    success: '问名字，就用 I’m 加自己的名字来答。',
    takeaway: '别人问名字 → 用 I’m 加自己的名字回答。',
  },
  {
    title: '选一句，补全对话',
    prompt: '这次先看英文。选一句放进空格。',
    dialogueLines: ['Ana: Hi, I’m Ana. ____', 'Ben: I’m Ben.'],
    options: [
      { id: 'ask', label: 'What’s your name?' },
      { id: 'meet', label: 'Nice to meet you, too.', hint: 'too 是「也」。这里还没人说「很高兴认识你」。' },
      { id: 'name', label: 'Hi, I’m Ben.', hint: '说话的人是 Ana。看下一行：Ben 正在报自己的名字。' },
    ],
    answer: 'ask',
    success: '空格在中间时，往后看一句。I’m Ben. 是在回答「你叫什么名字？」。',
    takeaway: '空格在对话中间 → 看后一句给了什么线索。',
  },
  {
    title: '选一句，补全对话',
    prompt: '先看英文。选最合适的一句接下去。',
    dialogueLines: ['Rui: Hi, I’m Rui.', 'Sam: Hi, I’m Sam. Nice to meet you.', 'Rui: ____'],
    options: [
      { id: 'ask', label: 'What’s your name?', hint: 'Sam 已经说了名字，不用再问。' },
      { id: 'name', label: 'Hi, I’m Sam.', hint: '这一轮是 Rui 在说话，不是 Sam。' },
      { id: 'reply', label: 'Nice to meet you, too.' },
    ],
    answer: 'reply',
    success: 'Nice to meet you. 是「很高兴认识你」，加上 too 就是「我也很高兴认识你」。',
    takeaway: '对方说 Nice to meet you. → 用带 too 的句子回应。',
  },
]);

window.CONTEXT_WORDS = Object.freeze([
  {
    title: '看句子，选词义',
    prompt: '选出画线词在这句话里的意思。先找它后面跟着什么。',
    wordLine: ['I ', 'leave', ' school at five. Then I go home.'],
    options: [
      { id: 'remain', label: '剩下', hint: 'school 是学校，下一句说「然后我回家了」。想想离开的是哪里。' },
      { id: 'go', label: '离开' },
      { id: 'put', label: '把……留在某处', hint: '句子没说把什么东西留下。I 是人，后面说回家。' },
    ],
    answer: 'go', success: 'leave school 是「离开学校」。下一句 go home 就是线索。',
    takeaway: 'leave school：离开学校。',
  },
  {
    title: '看句子，选词义',
    prompt: '同一个词，意思还一样吗？',
    wordLine: ['I ', 'left', ' my bag in the classroom. I need it now.'],
    options: [
      { id: 'go', label: '离开', hint: '这次 left 后面不是地点，而是 my bag（我的包）。' },
      { id: 'direction', label: '左边', hint: '句子在说包在哪里，不是在指路。' },
      { id: 'put', label: '把……留在某处' },
    ],
    answer: 'put', success: 'left 是 leave 的过去式。包留在教室了，所以说话的人现在得去拿。',
    takeaway: 'left my bag in the classroom：把包留在了教室。',
  },
  {
    title: '看句子，选词义',
    prompt: '这次自己找线索：画线词在这里是什么意思？',
    wordLine: ['Please turn ', 'left', ' at the school gate. The shop is on that side.'],
    options: [
      { id: 'direction', label: '左边' },
      { id: 'go', label: '离开', hint: 'turn 在这里是「转弯」，想想接着会说方向，还是说离开。' },
      { id: 'put', label: '把……留在某处', hint: '这句话是在指路，turn left 是向一边转。' },
    ],
    answer: 'direction', success: 'turn left 是「向左转」。这里的 left 表示方向。',
    takeaway: 'turn left：向左转。',
  },
]);

// 第七课后的选做导学。与短阅读和整卷共用的材料分开，答卷题号不变。
window.READING_START = Object.freeze({
  example: {
    title: 'Meeting Notice', question: 'When does the meeting start?',
    lines: [
      ['Doors open at 1:40 p.m.', '下午 1:40 开门。'],
      ['The meeting starts at 2 p.m.', '下午 2 点开始。'],
      ['Bring a notebook.', '自己带一本笔记本。'],
      ['The school will lend you a pen.', '学校会借给你一支笔。'],
    ],
    evidence: 1,
    steps: [
      '先看题：When（什么时候）问时间，start（开始）说明问的是会议开始，不是几点能进门。',
      '再找动作：题里的 start 和原文的 starts 都是「开始」。沿着这行读下去，答案是下午 2 点，不是开门的 1:40。',
      '换成问物品也一样：问自己带什么，找 Bring 开头的句子；问学校借给你什么，找 lend you。两句话里的东西不能换。',
    ],
  },
  tasks: [
    {
      title: '跟着找：活动几点开始？', prompt: 'When does the meeting start?（会议什么时候开始？）',
      passage: { title: 'Reading Group', lines: ['Meet in the school library.', 'Doors open at 10:10 a.m.', 'The meeting starts at 10:30 a.m.'] },
      glossary: [['Reading Group', '读书小组']],
      guide: '题目问 start（开始）。两行都有时刻，先找到写 starts 的那行，再核对 a.m. 是哪个时段。',
      options: [
        { id: 'open', label: '上午 10:10', hint: '10:10 那行写的是 Doors open（开门）。用题目里的 start 去找另一行。' },
        { id: 'pm', label: '晚上 10:30', hint: '你找对了时刻。再核对它后面的 a.m.，不是 p.m.。' },
        { id: 'start', label: '上午 10:30' },
      ],
      answer: 'start', evidence: 2, success: '这行写的是 starts at 10:30 a.m.，所以是上午 10:30 开始。',
      takeaway: '题目问开始，就看写 starts 的那行，不选开门的时间。',
    },
    {
      title: '换张通知，自己找一句', prompt: '哪一句告诉你，学校会借给你什么？', englishOptions: true,
      passage: { title: 'Drawing Group', lines: ['The school will lend you a ruler.', 'Meet in the school library.', 'Bring a pencil to school.'] },
      glossary: [['Drawing Group', '绘画小组'], ['pencil', '铅笔'], ['ruler', '尺子']],
      options: [
        { id: 'bring', label: 'Bring a pencil to school.', hint: '这句说要自己带铅笔到学校。现在问的是学校借给你什么，不是看哪句提到了 school。' },
        { id: 'lend', label: 'The school will lend you a ruler.' },
        { id: 'place', label: 'Meet in the school library.', hint: '这句交代集合地点。再找哪句说学校会借给你一样东西。' },
      ],
      answer: 'lend', evidence: 0, success: '学校会借给你一把尺子。尺子跟在 lend you 后面，铅笔才是自己带的。',
      takeaway: 'lend you 是「借给你」；ruler 在这个动作后面。',
    },
  ],
});

// 第三道短阅读题的选看示范；不引用题面，也不参与原创卷组卷。
window.READING_CONDITION_HELP = Object.freeze({
  title: '卡住了？先看两句别的通知',
  examples: [
    ['You do not need to bring a phone.', '不必带手机。没带手机也符合这条要求。'],
    ['Do not bring a phone.', '不要带手机。这一句才说不能带。'],
  ],
  method: '把 do not need to 当成一块来看，意思是「不必……」。再读它后面的动作：如果我做不到这件事，这句话会把我排除吗？有别的要求，再分开核对。',
});

// 原创短告示，用于练证据定位，不是 2026 原卷材料。
window.READING_INTRO = Object.freeze({
  title: 'School Photo Club',
  lines: [
    'The next Photo Club meeting starts at 4 p.m. on Friday.',
    'Meet in Room 203, not in the school library.',
    'Bring a notebook. The club will lend you a camera.',
    'New members are welcome. You do not need to know how to take photos.',
  ],
  tasks: [
    {
      title: '找开场时间', prompt: 'When does the next meeting start?（下次活动什么时候开始？）',
      options: [
        { id: 'a', label: 'At 3 p.m. on Friday.', hint: '先找 starts at（在……开始），再看它后面的数字。' },
        { id: 'b', label: 'At 4 p.m. on Friday.' },
        { id: 'c', label: 'At 4 p.m. on Saturday.', hint: '时间对了，再检查原文星期几。Friday 是星期五。' },
        { id: 'd', label: 'At 5 p.m. on Friday.', hint: '不要只看星期，回到第一句核对具体时间。' },
      ],
      answer: 'b', evidence: 0, success: '标出的第一句直接写了 4 p.m. on Friday：星期五下午四点。',
      takeaway: '问什么时候，就去找 starts at 后的时间，再核对星期。',
    },
    {
      title: '分清自己带什么', prompt: 'What should you bring?（你应该自己带什么？）',
      options: [
        { id: 'a', label: 'A camera.', hint: 'camera 的确在文中，但 lend 是「借给」。看 Bring（带上）后面是什么。' },
        { id: 'b', label: 'A phone.', hint: '文中没提到 phone。回原文找 Bring 开头的那句。' },
        { id: 'c', label: 'A notebook.' },
        { id: 'd', label: 'A photo.', hint: 'Photo 是社团名称的一部分，不是要带的东西。' },
      ],
      answer: 'c', evidence: 2, success: 'Bring a notebook. 要自己带笔记本；相机由社团借给你。',
      takeaway: '原文出现了某个名词，不代表它就是答案；看看动作是谁做的。',
    },
    {
      title: '看看谁能参加', prompt: 'Who can join the meeting?（谁可以参加活动？）',
      options: [
        { id: 'a', label: 'Students who are new to taking photos.' },
        { id: 'b', label: 'Only students with their own cameras.', hint: '社团会借相机。最后一行也没有说必须自带。' },
        { id: 'c', label: 'Only students who take good photos.', hint: '看最后一行：do not need to 是「不需要」。' },
        { id: 'd', label: 'Only students who are already club members.', hint: 'New members are welcome. 表示也欢迎新成员。' },
      ],
      answer: 'a', evidence: 3, success: '最后一行说欢迎新成员，而且不要求会拍照。所以刚开始学的学生也能来。',
      takeaway: '选项可能换了写法。用原文意思核对，不必找一模一样的词。',
    },
  ],
});

// 两组原创进阶阅读：不复刻真题，不用先完成入门阅读。
window.READING_STORY = Object.freeze({
  title: 'A Quiet First Day',
  lines: [
    'Lin joined a group to make a poster for the school fair. At first, she had an idea but did not say a word. She was afraid her classmates might laugh at it.',
    'Her partner Mei asked everyone to write one idea on a small card. Lin drew a simple map of the fair on her card. The group liked it and used the map on the poster.',
    'At the next meeting, Lin told the group her idea before anyone asked. Mei did not need to hand her a card this time.',
  ],
  tasks: [
    {
      title: '读全文，抓主旨', prompt: 'What is the story mainly about?（故事主要讲什么？）',
      options: [
        { id: 'map', label: 'How to draw a map for a school fair.', hint: '地图只是故事里的一个细节。再比一比 Lin 开头和结尾的表现。' },
        { id: 'fair', label: 'Why the school stopped holding its fair.', hint: '短文没有说学校停办活动。故事一直跟着 Lin 的表现走。' },
        { id: 'voice', label: 'How Lin became more willing to share her ideas.' },
        { id: 'cards', label: 'Why students should always write on cards.', hint: '最后一次没有用卡片。选能解释这个变化的答案。' },
      ],
      answer: 'voice', evidence: [0, 2], success: '开头不敢说，结尾主动说。把前后的变化连起来，比只抓住「地图」更能概括全文。',
      takeaway: '主旨题：把开头的处境和结尾的变化连起来。',
    },
    {
      title: '从动作推断', prompt: 'Why did the cards help Lin?（为什么卡片能帮到 Lin？）',
      options: [
        { id: 'quiet', label: 'She could share an idea without speaking first.' },
        { id: 'finish', label: 'She could finish the poster by herself.', hint: '用地图的是整个小组，不是她一个人做完海报。' },
        { id: 'leave', label: 'She could leave the meeting early.', hint: '第二段说的是她怎样参与，不是她什么时候离开。' },
        { id: 'idea', label: 'Mei wrote an idea for her.', hint: '看是谁画的地图；Mei 提出用卡片，但没有代写。' },
      ],
      answer: 'quiet', evidence: [0, 1], success: '第一段说 Lin 不敢开口；第二段说她把想法画在卡上。合起来就能推断，卡片给了她不用先开口也能参与的办法。',
      takeaway: '推断题：把人物遇到的问题和后来做的事连起来。',
    },
  ],
});

window.READING_GUIDE = Object.freeze({
  title: 'Keeping a Lunch Box Cool',
  lines: [
    'Do you bring lunch to school? Try these steps to keep cold food cool until lunch time.',
    'First, chill the food in the fridge overnight. In the morning, put it in an insulated lunch bag, a bag that slows down heat from outside.',
    'Next, place an ice pack beside the food. Keep the bag closed until you are ready to eat.',
  ],
  tasks: [
    {
      title: '判断文章出处', prompt: 'Where is this text most likely from?（这篇文章最可能来自哪里？）',
      options: [
        { id: 'menu', label: 'A school lunch menu.', hint: '菜单一般列菜名。看看这篇是不是在教读者做某件事。' },
        { id: 'diary', label: 'A student’s diary.', hint: '日记通常写自己的经历。这里的 you 和 Try these steps 是对谁说的？' },
        { id: 'story', label: 'A story about a lunch box.', hint: '文中没有人物经历，First、Next 后面是行动步骤。' },
        { id: 'guide', label: 'A school guide for students.' },
      ],
      answer: 'guide', evidence: [0, 1, 2], success: '文章直接对带午餐的学生说话，还用 First、Next 给步骤。它最像一份给学生的指南。',
      takeaway: '判断出处时，先看写给谁，再看文章在做什么。',
    },
    {
      title: '用上下文猜词', prompt: 'What does “insulated” tell us about the bag?（这个词说明袋子有什么用？）',
      options: [
        { id: 'pack', label: 'It makes the food easier to pack.', hint: '原文在说明袋子的功能。看逗号后写的是打包，还是 heat。' },
        { id: 'heat', label: 'It slows down heat from outside.' },
        { id: 'large', label: 'It can hold a very large lunch box.', hint: '解释里没有谈容量，重点是热量会怎样。' },
        { id: 'ice', label: 'It can make ice on its own.', hint: '后面说要另放冰袋，袋子不会自己制冰。' },
      ],
      answer: 'heat', evidence: [1], success: '逗号后 a bag that slows down heat from outside 就是在解释这个词：袋子能减缓外面热量传进来。',
      takeaway: '陌生词旁边可能就有解释；先读逗号后的部分。',
    },
  ],
});

window.CLOZE_INTRO = Object.freeze({
  title: 'A Class Picnic',
  lines: [
    'Our class planned a picnic. We made a ____ of things to bring: water, cups and fruit.',
    'It rained on Friday, ____ we still wanted to eat together. So we stayed at school.',
    'At noon, we ate in the ____. After lunch, we cleaned the desks and put our books back on them.',
  ],
  tasks: [
    {
      title: '第 1 空：看搭配', prompt: '先读短文大意，再选一项填入第 1 空。',
      blank: 0, evidence: 0, answer: 'list',
      options: [
        { id: 'story', label: 'story', hint: '冒号后是要带的几样东西，不是在讲故事。' },
        { id: 'list', label: 'list' },
        { id: 'song', label: 'song', hint: '后面只列出要带的东西，没有提到唱歌。' },
        { id: 'photo', label: 'photo', hint: '冒号后直接列出了水、杯子和水果，没有说拍照片。' },
      ],
      success: 'make a list 是「列清单」。冒号后的水、杯子和水果就是清单上的东西。',
      takeaway: '看空格前后的搭配，也留意冒号后面列了什么。',
    },
    {
      title: '第 2 空：看前后关系', prompt: '读第 2 空两边的内容，选一个连接词。',
      blank: 1, evidence: 1, answer: 'but',
      options: [
        { id: 'because', label: 'because', hint: '下雨不是因为大家想一起吃饭。两边不是这个因果关系。' },
        { id: 'if', label: 'if', hint: '下雨是已经发生的事，这里不是假设。' },
        { id: 'but', label: 'but' },
        { id: 'or', label: 'or', hint: '下雨和还想一起吃饭可以同时发生，不是在二选一。' },
      ],
      success: '虽然下雨，但大家仍然想一起吃饭。still（仍然）帮你看出了转折。',
      takeaway: '前后意思转弯时，试着用「但是」把两边读一遍。',
    },
    {
      title: '第 3 空：往后找线索', prompt: '选一个地点。也看看午饭后他们做了什么。',
      blank: 2, evidence: 2, answer: 'classroom',
      options: [
        { id: 'classroom', label: 'classroom' },
        { id: 'park', label: 'park', hint: '上一段说他们留在学校；再看后面是谁的课桌和书。' },
        { id: 'kitchen', label: 'kitchen', hint: '不只看 ate（吃）。桌上放回了课本，比较像学校里的哪个地方？' },
        { id: 'playground', label: 'playground', hint: '后文有 desks（课桌）和 books（书），操场通常不是放课本的地方。' },
      ],
      success: '他们留在学校，饭后擦课桌、放回课本，所以教室最符合这些线索。',
      takeaway: '空格前不够判断，就往后读，找能排除其他选项的细节。',
    },
  ],
});

const librarySentences = Object.freeze([
  { id: 'closed', label: 'But it was closed.' },
  { id: 'home', label: 'We went home at once.' },
  { id: 'bus', label: 'We took a bus to the other library.' },
  { id: 'table', label: 'We found a quiet table there.' },
]);

window.SENTENCE_INSERT = Object.freeze({
  title: 'A Place to Study',
  lines: [
    'On Saturday, Ming and I went to our school library to study.',
    '____ The door was locked, so we could not get in.',
    'A friend told us about another library across town. It was open.',
    '____ The ride took twenty minutes.',
    'When we arrived, we went upstairs. ____ We sat there and finished our homework.',
  ],
  tasks: [
    {
      title: '第 1 空：看原因', prompt: '从下方选一个整句填入空格。用过的句子不会再出现。',
      blank: 1, evidence: 1, options: librarySentences, answer: 'closed',
      hints: { home: '后面两人还在找学习的地方，并没有马上回家。', bus: '先看这一空后面：门锁着，进不去。坐车是后来的事。', table: '连门都没进去，还不能在里面找到桌子。' },
      success: '后一句说门锁着、进不去，接「今天闭馆」最顺。',
      takeaway: '空格后的一句话，可能是在解释前一句。',
    },
    {
      title: '第 2 空：找重复的线索', prompt: '看看空格后提到的是哪件事。',
      blank: 3, evidence: 3, options: librarySentences, answer: 'bus',
      hints: { home: '前面说另一家图书馆开着，他们后来也到了那里。', table: 'The ride 是「这段车程」。找到桌子不解释这一段车程。' },
      success: 'The ride（这段车程）接的是坐公交去另一家图书馆。',
      takeaway: '看到 The ride，往前找哪一句说了怎么去。',
    },
    {
      title: '第 3 空：看指代', prompt: '后一句的 there（那里）指的是哪里？',
      blank: 4, evidence: 4, options: librarySentences, answer: 'table',
      hints: { home: '他们已经到了另一家图书馆。能让他们坐下做作业的是哪一个地方？' },
      success: '最后一句说他们坐在那里做作业，there 指刚找到的那张桌子所在的位置。',
      takeaway: '遇到 there，看看前一句有没有交代具体地方。',
    },
  ],
});

// 原创微练习：两处给括号词，一处按语境补一个词。
window.GRAMMAR_INTRO = Object.freeze({
  title: 'A Club Sale',
  lines: [
    'Last Friday, our school club ____ (sell) snacks to raise money.',
    'The club made thirty ____ (sandwich) for the sale.',
    'We sold snacks ____ two hours, from 2 p.m. to 4 p.m.',
  ],
  tasks: [
    { blank: 0, answer: 'sold', prompt: '看时间线索，把括号里的词变成合适的形式。',
      hint: 'Last Friday 表示过去。sell 是不规则动词，不能直接加 -ed。', takeaway: 'Last Friday 提示一般过去时；sell 的过去式是 sold。' },
    { blank: 1, answer: 'sandwiches', prompt: '看空格前面的数量，写出括号词的正确形式。',
      hint: 'thirty 是三十。sandwich 是可数名词，以 -ch 结尾时复数加 -es。', takeaway: 'thirty 后用复数；sandwich 的复数是 sandwiches。' },
    { blank: 2, answer: 'for', prompt: '这空没有括号词。想想 two hours 表示的是时长还是时刻。',
      hint: 'two hours 是持续多久，不是几点。用表示「持续一段时间」的介词。', takeaway: 'for + 一段时间，表示持续多久。' },
  ],
});

window.SENTENCE_WRITING = Object.freeze([
  { line: 'Yesterday, we ____ after class.', chinese: '打了篮球', answer: 'played basketball',
    accepted: ['played basketball'], hint: 'Yesterday 是过去的时间。看动词有没有用过去式，篮球前不用加 the。',
    takeaway: 'Yesterday 提示过去时；play basketball 中，球类名称前不加 the。' },
  { line: 'I ____ come to the club meeting this afternoon.', chinese: '不能', answer: 'can’t',
    accepted: ['can’t', 'cannot', 'can not'], hint: '空格后已经有 come。这里只需表达「不能」。',
    takeaway: 'can’t 和 cannot 都能表达「不能」。考试里优先用 cannot 或 can’t。' },
  { line: 'Please tell me ____.', chinese: '会议什么时候开始', answer: 'when the meeting starts',
    accepted: ['when the meeting starts', 'when the meeting will start', 'when the meeting is going to start', 'what time the meeting starts', 'what time the meeting will start', 'what time the meeting is going to start'],
    hint: 'tell me 后面用「什么时候 + 会议 + 开始」的顺序，不要照搬独立问句的语序。',
    takeaway: 'when 或 what time 都可询问时间；放在 tell me 后面时，用主语在动词前的顺序。' },
]);

// 第 88–90 课的独立选做，不并入旧补句题组或据其生成的原创 A 卷。
window.SENTENCE_WRITING_BRIDGE = Object.freeze([
  { id: 'sentence-write-past', line: 'Last Monday, we ____ after school.', chinese: '打扫了体育馆', answer: 'cleaned the gym',
    accepted: ['cleaned the gym', 'cleaned up the gym', 'cleaned the sports hall', 'cleaned up the sports hall'],
    hint: 'Last Monday 表示已发生。检查 clean 的词形和打扫的地点；空外的 we 和 after school 不重写。',
    takeaway: '用 clean 的过去式 cleaned；整个动作是 cleaned the gym，只把这部分写进空格。' },
  { id: 'sentence-write-location', line: 'Could you tell me ____?', chinese: '机房在哪里', answer: 'where the computer lab is',
    accepted: ['where the computer lab is', 'where the computer lab is located', 'where the computer room is', 'where the computer room is located'],
    hint: 'tell me 后先写 where，再写机房，最后放 is。问号已经给了。',
    takeaway: '只写 where the computer lab is；不照搬 Where is the computer lab? 的语序和问号。' },
  { id: 'sentence-write-proud', line: 'Last Saturday, ____ of my team after the game.', chinese: '我感到自豪', answer: 'I was proud',
    accepted: ['I was proud', 'I felt proud'],
    hint: '这是上周六发生的事。「我」也在中文提示里，句中尚未给出。of 已在右边，不要重复。',
    takeaway: '空里有主语 I 和过去的感受 was proud；接上右边才是 I was proud of my team。' },
]);

// 独立示范，不使用书写任务的句子或答案。
window.WRITING_GUIDES = Object.freeze({
  grammar: {
    title: '先看示范：一个空怎么想',
    lines: [
      ['Yesterday, I ____ (call) a friend.', 'Yesterday 说明事情已发生。括号给 call（打电话），把它变成过去式 called。'],
      ['I have two ____ (pen).', 'two 提示不止一个，pen 变成 pens。'],
      ['The meeting starts ____ 4 p.m.', '没给括号词，先问空缺起什么作用。这里缺连接具体时刻的介词：at。'],
    ],
    bridge: '轮到你时，先圈时间、数量或搭配，再写一个词。下面是另一篇短文。',
  },
  sentence: {
    title: '先看示范：只补缺的部分',
    lines: [
      ['Mei ____ after class.（读便条）', 'Mei 和 after class 已经给了，不要再抄一遍。说 Mei 平时做什么，可补 reads a note。'],
      ['Mei reads a note after class.', '把答案放回去读：Mei 下课后读一张便条。确认谁、做什么和时间都没有重复。'],
    ],
    bridge: '自己写时：先看两边给了什么，再补中文那一块，最后读完整句。',
  },
  email: {
    title: '先看示范：三条要求变成三句',
    lines: [
      ['Our class has a book club.', '先说是什么：我们班有一个读书社。'],
      ['We meet in the library on Fridays and talk about books.', '再说怎么参加：星期五在图书馆集合，聊书。'],
      ['I like the club because I can read with my friends.', '最后说原因：because 后说能和朋友一起读书。'],
    ],
    bridge: '独立写前，先在心里填三格：什么活动／怎么参加／为什么喜欢。下面的题可以换成你熟悉的活动。',
  },
  sentenceBridge: {
    title: '先看示范：空外已经给了什么',
    lines: [
      ['Three days ago, Bo ____ at school.（练习了英语）', 'Three days ago 是三天前。用过去式 practiced，再补动作的对象 English：practiced English。'],
      ['Can you show me ____ on the map?（校门在哪里）', 'show me 后按 where + 地点名 + is 的顺序写 where the school gate is，不抄 on the map 或问号。'],
      ['Yesterday, Lin ____ his little sister.（为他的妹妹感到自豪）', 'Lin 已经给了，Yesterday 提示过去。右边没给 of，只补 was proud of；his little sister（他的妹妹）已经写在后面，不用再写。'],
    ],
    bridge: '下面三题是新例子。只写空格，不抄空外的时间、人物、单词或标点；最后把答案放回去读一遍。',
  },
});

window.EMAIL_WRITING = Object.freeze({
  prompt: '假定你是 Lin。朋友 Alex 想了解你喜欢的一项课外活动。写一封英语邮件，告诉对方你喜欢什么活动、平时怎么参加，并说明你为什么喜欢它。正文约 40 词，不写自己的真实姓名、学校或联系方式。',
  checks: [
    '内容：我写了哪项活动、怎么参加，以及喜欢的原因。',
    '语言：我检查了动词、单复数和标点。',
    '连贯：我按活动、参加方式、原因的顺序说明，读起来能接上。',
  ],
  example: 'My favorite after-school activity is playing basketball. I play with my classmates on Fridays. We usually practice for about an hour after class. I like this activity because it helps me relax and gives me time to talk with friends.',
});

window.LESSON_GUIDANCE = Object.freeze({
  'first-hello': [
    '把 Hi, I’m Lin. 分两拍读：先用 Hi 打招呼，停一下，再说 I’m Lin. 让对方知道你是谁。',
    '换成 Bo 做自我介绍时，只把 Lin 换成 Bo。说话人嘴里说出来的 I，指的始终是说话人自己。',
  ],
  'ask-name': [
    '先圈住 your name，确定你想知道的是「对方的名字」。问完 What’s your name?，可以停下来等对方回答。',
    '如果对方回答 I’m Lin.，你听到 I’m 后留心最后一个词。现在已经知道对方叫什么，可以接一句 Nice to meet you.',
  ],
  'first-conversation': [
    '把例句里的话按两个人分开读。Chen 先报自己的名字，再问 Lin。中间的问号提示轮到对方开口了。',
    '听到 Nice to meet you.，双方已经交换过名字。最后一句里的 too 放在句尾，意思是「我也很高兴认识你」。',
  ],
  'notice-time': [
    '用手指从 starts at 往右读，先框出 4 p.m.，可以记成 16:00。继续读到 on Friday，把「星期五」记在时刻旁边。',
    '如果同一张纸上还写着 Doors open at 3:30 p.m.，就分别记「开门 15:30」「开始 16:00」。问开始时间只抄第二项。',
  ],
  'notice-place': [
    '把 Meet in Room 203. 切成「去集合」和「在哪儿」两段。Room 203 整体是房间号，看到 203 时先认清它前面的 Room。',
    '把 Room 203 换成 the computer lab，集合这件事没变。遇到长一点的地点名称，可以把 in 后面整段圈起来。',
  ],
  'notice-bring': [
    '先在纸上写两栏「自己带」「学校提供」。把 Bring 后的 a notebook 放进第一栏，把 lend you 后的 a pen 放进第二栏。',
    '读 lend 那句时先看谁在借出，主语是 The school。读到 you 才找到借给谁，所以准备清单上只记笔记本。',
  ],
  'notice-whole': [
    '试着从最后一行往上找。想整理书包，先看 Bring，记下 notebook；想确定往哪走，再看 Meet in，记下 Room 105。',
    '最后用 starts at 和 on 补齐「周一上午九点」。合上原文，按「什么时候／去哪里／带什么」说一遍，漏哪项就回原文找。',
  ],
  'sentence-core': [
    '在 Mei reads a book. 上从左到右标「谁／做什么／读什么」：Mei／reads／a book。把 a 和 book 一起当作最后一块。',
    '如果只把 reads 换成 borrows，做事的人和书都相同，动作变成了「借」。翻译前先确认句中间的动作词。',
  ],
  'be-state': [
    '读到 The room is quiet. 时，先问「谁安静？」答案是 the room。quiet 就是对这个房间的描述。',
    '试着把一个房间换成两个：The rooms are quiet.。前面数量变了，连起来的词也跟着变，安静这个状态用同一个 quiet。',
  ],
  'time-verbs': [
    '先遮住两个动作词，只看句尾。every day 表示重复发生的习惯，yesterday 把事情放在昨天。给两句分别贴上「平时」「过去」。',
    '再掀开动作词，发现两句都在说打篮球。变的是 play 的形式。自己把 I play after class. 改成昨天的事，可写 I played after class yesterday.',
  ],
  'noun-count': [
    '从 and 切开，左边 one pen 写成 1 支笔，右边 two notebooks 写成 2 本笔记本。数数时把数量和后面的名词绑在一起。',
    '把笔记本从两本改成一本，试读 one notebook。变化有两处：two 换成 one，notebooks 的尾巴 s 去掉了。',
  ],
  'reference-basics': [
    '把 It is red. 里的 It 暂时换成 the notebook。读成 The notebook is red.，看看「笔记本是红色的」和前一句能不能连起来。',
    '如果前文出现两个东西，继续找颜色以外的线索。例如 It has pages. 说它有一页一页的纸，这有助于在书包和笔记本中认出笔记本。',
  ],
  'request-reply': [
    '听到 Could you help me?，把它理解成请你帮忙。回答 Of course. 是答应，后面的 I have time. 补上了可以帮忙的原因。',
    '可以把两句连起来核对语气。先说 Sure，再说 I’m busy right now，听起来前后不一致；现在没空时可以说 Sorry, I’m busy right now.',
  ],
  'conversation-purpose': [
    '先读 I passed the test!，抓住 passed the test（通过测试）。这是分享好消息，用 Glad to hear that. 可以回应这个消息。',
    '换一句 Is this your bag?，对方要确认归属。此时 Yes, it is. 可以直接把事情说清楚。选答句前，先给上一句话贴一个用途标签。',
  ],
  'context-actions': [
    '给第一句加上停顿 Please / open the door.，能听出是在请人「做」一件事，the door 告诉你打开什么。',
    '第二句从 The door 开始，后半句 is open 描述门现在的样子。翻译时可以用「门开着」，不必自己加一个开门的人。',
  ],
  'context-cloze': [
    '下雨一般会妨碍玩耍，still played 却说「还是玩了」。先在纸上写「下雨 → 仍然玩」，两边有反差，就试读 but。',
    '玩的位置改到 inside，it rained 能解释为什么要在屋内。先说「在屋里玩」再说「因为下雨」，整句放回文章读一遍。',
  ],
  'reading-main-idea': [
    '在原文挑三个有变化的地方：afraid to talk、practised with a friend、spoke to the whole class。试着用箭头把它们按先后连起来。',
    '缩成一句可说「Bo 通过和朋友练习，从不敢开口到能在全班面前说话」。还能看见起点、办法和结果，才算抓住这段的主线。',
  ],
  'reading-inference': [
    '把两个时刻放到一条线上：4:00 开会在前，4:10 到达在后。时钟往后走了十分钟，所以 Bo 在开始后十分钟才到。',
    '检验每个判断能不能指回原文。可以指给别人看两个时刻，所以「迟到」有依据；要判断路上发生了什么，还得有别的句子。',
  ],
  'link-a-sentence': [
    '读 It is blue. 时先往前找一件能是蓝色的东西。把前句的 a bag 换进 It，读 The bag is blue.，蓝色就有了明确对象。',
    '假如前句只写 Mei has two bags.，单数 It 就不够清楚。补句时留意数量和指代，前后合读才能发现这种接不上的地方。',
  ],
  'action-now': [
    '先看时间。every day 把 reads 放在每天的习惯里，now 则让你想象此刻正在发生的画面。',
    '描述现在的画面可以分三块读 Mei / is / reading。把 Mei 换成两个人 Mei and Bo 时，用 are reading，因为做事的人变成了复数。',
  ],
  'past-form': [
    '给三个句子标时间，第一句说平时，后两句都有 Yesterday。相同的时间提示可以让不同的动词进入过去式。',
    '用两行记住这组变化：play → played，go → went。自己把 I go home at five. 放到昨天，就换成 went，再补上 yesterday。',
  ],
  'one-with-article': [
    '读 a pen 和 an apple 时，把 a／an 与后面的词连起来。先听 pen 的开头 /p/，再听 apple 开头的元音，比较两个起始音。',
    '做题可以先把 a 或 an 留空，轻声念后面那个词。读 egg 时用 an，读 bag 时用 a；有形容词时，听紧跟在 a／an 后面的那个词。',
  ],
  'adjective-adverb': [
    '给两句配两个小问题：Mei 是怎样的人？她写得怎么样？第一个用 careful 描述人，第二个用 carefully 补充 writes。',
    '检查自己的句子时找被描述的词。写 Mei reads carefully. 时，carefully 回答的是「怎么读」，所以跟着动作 reads。',
  ],
  'embedded-question': [
    '把直接问句圈成 When / does the meeting start?。接在 tell me 后留下 when，再把「会议」the meeting 放回动作前。',
    'the meeting 是单数，把原来放在 does 里的标记放回动词，写成 starts。整段读作 when the meeting starts，中间不再加 does。',
  ],
  'link-a-list': [
    '找到 I 后，用手指依次点 read、write、draw。每点一个都可以补回 I，说明它们是同一个人的三件事。',
    '如果换成描述两件事，可以写 I read and draw.。遇到三项时，先用逗号分开前两项，再用 and 接最后一项。',
  ],
  'time-duration': [
    '想象看墙上的钟：at two 告诉你指针指在哪儿。想象用计时器：for one hour 告诉你过了多长时间。',
    '如果两种信息都要写，可以说 I read at two for one hour.。先标「两点开始」，再标「持续一小时」，就知道两个数字各在做什么。',
  ],
  'own-things': [
    '先找这张海报是谁的。句首的 Mei 是一个女生，所以最后用 her own 来强调海报归她自己。',
    '模仿时连着换两处：I make a poster of my own.。说的人变成 I 后，海报的归属跟着换成 my own。',
  ],
  'after-ing': [
    '先按时间画箭头：reading 在前，write a note 在后。After reading 先交代时间，逗号后再读这句话主要在说什么。',
    '看 after 后有没有明确的主语。直接跟 reading 时用 -ing；写 After I read, I write a note. 时，after 后已经有 I，可以接完整的小句子。',
  ],
  'past-in-progress': [
    '先在时间线上点出 the phone rang，再画一条穿过这个点的读书线。铃响那一下发生时，读书这件事已经在进行。',
    '写的时候用 was reading 画出持续的背景，用 rang 交代那一刻。把 I 换成两个人 We 时，相应地说 We were reading。',
  ],
  'enough-to': [
    '先找房间的条件 quiet，再问「安静到够做什么？」to read in 把要做的事补出来：能在这个房间里读书。',
    '模仿时按「怎样／够不够／做什么」三格写。换成灯光，可说 The room is bright enough to read in.，enough 仍放在 bright 后面。',
  ],
  'advice-pride': [
    '先把 had better 整块圈起来，再找建议做的动作 read。读到 You had better read the notice.，可以理解为「你最好读一下通知」。',
    '第二句先用 I am 表明是谁有这个感受，再用 proud of our class 说明为谁感到自豪。把 I 换成 We 时，连着把 am 换成 are。',
  ],
  'phrases-in-context': [
    '先把 looks for 合起来读，后面 his pen 是寻找的东西。读到下一句的 finds，可以把两句串成「先找笔，后来找到了」。',
    '再看 finds 后的 it；把它换回 the pen，故事仍说得通。短语的意思和代词指的东西，都可以用前后句核对。',
  ],
  'email-plan': [
    '把范文的正文分成三句，分别写在「活动／怎么参加／为什么」三格里。Sports Day 是活动，run and play games 是做法，work together 是原因。',
    '再看看正文外的两头。Dear Bo 确定写给谁，Mei 是署名。换题练习时，按新题给的人名和三格内容写自己的邮件。',
  ],
  'reading-question-words': [
    '先只看问号前每句的第一个词。把 When、Where、What 分别记成「时间」「地点」「东西」，再去找文章里对应的那一项。',
    '回看问题的动作也很重要。When does the meeting start? 问会议几点开始；同样以 When 开头，问上交日期时就要找上交那一行。',
  ],
  'reading-paraphrase': [
    '把 8:50 和 9:00 放在同一条时间线上。Mei 在前一个时刻到场，会议在后一个时刻开始，所以她早到了十分钟。',
    '看到 She arrived before the meeting. 时，before 给出的先后顺序和原文相同。把选项的先后、人物和数字换回原文核对。',
  ],
  'reading-exceptions': [
    '给每一样东西画不同记号：pen 是要带，food 是不能带，notebook 是可带可不带。一个 not 能改变整条指示。',
    '读第二、三句时，把 Do not bring 和 do not need to bring 各圈成一块。第三句有 need to，去掉的是「必须带」的要求。',
  ],
  'notice-deadline': [
    '做两个提醒：3 p.m. 前发名字，4 p.m. 开会。把「最迟三点」和「正好四点开始」分别记在日程表上。',
    '用一个时间检验理解：2:50 发名字来得及，3:10 才发就迟了。会议仍在 4 p.m. 开始，by 后的时间属于发名字这件事。',
  ],
  'notice-condition': [
    '从逗号切开，左边 if you are new 写「条件：新同学」，右边写「动作：最晚周五发姓名」。先判断自己是否符合左边。',
    '如果是新同学，记下发姓名的任务和周五的截止时间。已经加入的同学要找适用于自己的说明，这条 if 句只给新同学的要求。',
  ],
  'notice-change': [
    '把星期在纸上写成一条修改记录「Monday → Friday」。now 后是现行的时间，not 后点出被替换的旧时间。',
    '读 Room stays the same 时只在教室一栏做「沿用」标记。写自己的日程时更新星期，地点翻回旧通知的教室栏抄。',
  ],
  'email-use-details': [
    '第一句 I like basketball. 已经把项目说清楚。第二句用 play 把喜欢的活动写成一件平时真的在做的事。',
    '在第二句分别圈 who 和 when 的信息：with my classmates 说明和谁，after class 说明何时。仿写时先补一项真实细节，再看需不需要另一项。',
  ],
  'email-specific-reason': [
    '在 because 处停一下，自己先问「为什么喜欢篮球？」从 I can 开始读完整回答，发现理由是有机会和朋友一起打球。',
    '仿写时想一个自己的场景，可以用 I like drawing because I can make cards for my friends.。读到 because 后，检查是否说出了一个可想象的原因。',
  ],
  'email-revise': [
    '把草稿读给自己听，在题目旁做三道勾：book club 回答活动，meet on Fridays 回答参加时间，read with my friends 回答原因。',
    '再逐句检查有没有一句可以删掉而信息仍齐全。We meet on Fridays. 提供了具体时间；最后一句虽然又写 I like，但 because 后提供了新信息。',
  ],
  'cloze-collocations': [
    '暂时把冒号后遮住，先读 made ___ of things to bring。把 a list 放进去，可以和 made 组成「列清单」。',
    '再看冒号后的 water and cups，它们就是清单里的两项东西。选词时让空格同时过两关：前后搭配读得通，后面的细节也对得上。',
  ],
  'cloze-later-clue': [
    '读完 Bo went to the library. 可以先猜他去了什么地方；要知道他接着做什么，还要再读一句。',
    'opened a book 给了对象，started to read 给了动作。做选择后把地点、拿出的东西和动作连起来读，第二句的线索通常更具体。',
  ],
  'cloze-read-back': [
    '在 so 处连出「下雨 → 留在屋内」。接着扫下一句，in the classroom 又给出一个确实在屋内的地点。',
    '填完以后把这些词读成一个小故事。如果试填 outside，「教室里玩」就和去户外对不上；这时回去改空格。',
  ],
  'service-borrow': [
    '先从 Can I borrow a ruler? 找出谁想借和想借什么：I 想借一把 ruler（尺子）。',
    '分开听回答的两拍。Sure 表示同意，Here you are 表示正在递给你。借到后可以回 Thanks.，把这次对话收好。',
  ],
  'service-directions': [
    '从问句提取目标 the library。答句开头的 It’s 把这个目标接过来，后面的 the gym 是用来指路的参照物。',
    '在纸上画两个相邻的框，一个写 gym，一个写 library。next to 表示在旁边；图上仍要等更多信息才能确定具体在左侧还是右侧。',
  ],
  'service-booking': [
    '对第一个提议 Monday 先记一个问号，等下一句话。听到 I’m busy on Monday，把这个候选时间划掉。',
    '再记录后一个提议 Friday。直到对方说 Friday is fine.，才给周五打勾。用同样方法区分对话里的所有提议和最后的约定。',
  ],
  'reading-order': [
    '用 1、2、3 标出 First、Then、Finally，再把每句的动作抄在数字旁：读通知、写姓名、发邮件。',
    '假如题目问发邮件之前做什么，就找到 send the email 所在的第 3 步，再往上找第 2 步。问哪一步就回到相应的标记。',
  ],
  'reading-examples': [
    '先把两句分别贴标签。「小改动可以省时间」是能用在许多场景的观点，把钥匙放门边是其中一个具体做法。',
    '在 For example 前画一条分隔线。问作者要说明什么时看前一句；问钥匙放哪里时在后一句找 by the door。',
  ],
  'reading-purpose': [
    'Join our reading club! 直接邀请读者加入，感叹号前还给了 this Friday，说明了邀请的时间。',
    '再读 Sign up in Room 105.，它让有意加入的人知道下一步去哪里报名。用这两个动词说明材料的目的，再核对题目问的是目的还是细节。',
  ],
  'present-routine': [
    '两句共有 after class，都是在说课后的习惯。先把时间和动作圈起来，再比较句首换了谁。',
    '主语从 I 换成一个人 Mei 时，read 加上 s。可以反过来小声练一遍 Mei reads → I read，读完回看动词的词尾。',
  ],
  'present-negative': [
    '先找主语。例句从 I 换成 Mei 时，表示否定的 don’t 换成 doesn’t，星期和打球这件事没有变化。',
    '把 doesn’t 和 play 接成一块来读。改写 Mei plays on Mondays. 时，用 Mei doesn’t play on Mondays.，原来的 s 已经由 doesn’t 承担。',
  ],
  'present-questions': [
    '看到问句开头的 Do／Does 就先等一个 Yes 或 No，再看问的是谁。对 you 回答时从自己的角度说 I；说到 Mei 时用 she。',
    '短答要和问句的开头配套。第一问的 Do 接 Yes, I do.，第二问的 Does 接 No, she doesn’t.，两句回答都可以省去已经问过的动作。',
  ],
  'past-negative': [
    '把 Monday 和 Friday 分成两栏。同一件打球的事，周一栏记录 played（发生了），周五栏记录 didn’t play（没有发生）。',
    '用第二句改写另一件事：I didn’t read on Friday.。先用 didn’t 表过去和否定，再接你要说的动作原形。',
  ],
  'past-questions': [
    'Did 已经把问题放到过去，后面的 read 用原形。听第一句的 read，可留意 /riːd/，和现在时 I read every day. 的 read 同音。',
    '把回答和问的人配好：问 you 时可以答 Yes, I did.；问 Bo 时，例句答 No, he didn’t.。短答里的 did 或 didn’t 接住整个动作。',
  ],
  'past-story': [
    '从 Yesterday 开始画昨天的时间线。第一个地点是 the library；Later 之后发生的是 played basketball。',
    '读到 didn’t go 时，在 shop 旁写「没去」。复述时把发生的两件事按顺序说，最后单独说明商店没去。',
  ],
  'future-will': [
    '把 every day 和 Tomorrow 写到两栏。「每天打球」是习惯，「明天在学校打球」是还没发生的安排。',
    '换到明天这一句，先找 will，再检查后面写的是 play。可用同样方式把 Mei reads every day. 改写为 Tomorrow, Mei will read.',
  ],
  'future-negative': [
    '看两句中 will 和 won’t 各接了什么地点。shop 前的 go 跟 won’t，明天不去；library 前的 go 跟 will，明天要去。',
    '如果只记一条明天的出门提醒，就抄去图书馆那条。朗读时留意 will 和 won’t 的声音，判断这个地点是否真的在安排里。',
  ],
  'future-notice': [
    '先写一张新日程：Friday／4 p.m.／Room 204。每填一格都回通知指给自己看它对应哪几个词。',
    'Room 101 前面是 won’t meet，划掉这个地点。末句的 will meet 提供的是现行教室和时间，可以用来检查自己有没有记错。',
  ],
  'compare-direction': [
    '找到 than 后向左找被描述的 bus，向右找用来比较的 bike。faster 放在 bus 的陈述里，所以更快的是公交车。',
    '如果换成从自行车开头，想保持同一件事实，要说 The bike is slower than the bus.。可以画一个箭头指向更快的那辆车来核对。',
  ],
  'compare-quantity': [
    '把 10 分钟写在中间，左边放步行，右边放公交。less than 告诉你在 10 左边，more than 告诉你在右边。',
    '用 9、10、11 试一下：9 可当作步行时间的例子，11 可当作车程的例子。读到原文时只知道各在界线哪边，具体分钟数需要另外给出。',
  ],
  'compare-reading': [
    '按题目圈范围。要比较 music club，只抄 Class A 的 5 和 Class B 的 15，把写在 art club 旁的 12 留在原来的栏目。',
    '把两个同类数字摆在一起，15 比 5 多 10。写结论时带上「选音乐社」和班级名称，就能看出这两个数字比的是什么。',
  ],
  'reason-or-purpose': [
    '先圈 went to the library，再分别问「为什么选图书馆」「过去想做什么」。because it was quiet 答前一个问题，to study 答后一个。',
    'there 指前面去的图书馆。用中文把两条线索连起来：图书馆安静，所以 Mei 选择去那里，打算学习。想做的事有没有做成还需要往后读。',
  ],
  'purpose-or-result': [
    '在第一句看到 so that 时，把 could catch the bus 圈为 Lin 出发前想实现的目标。想赶上车这个目的，解释了她为什么提早出发。',
    '第二句的 so 左边是已经发生的事「公交车晚点」，右边是接着发生的事「她等了十分钟」。两句连着读，前一句的目标和后一句的结果各有自己的线索。',
  ],
  'reason-purpose-reading': [
    '给 was closed 和 to study 分别贴上「换地方的原因」「去新教室的目的」。这时只知道 Mei 到 203 室打算学习。',
    '看到 But 继续读到最后，without studying 说明她没学就回家了。复述时可以说「想学习」，再加一句交代最后发生了什么。',
  ],
  'rules-can-must': [
    '先把两句写成一张行动卡：use a computer 是获准做的事，show your student card 是需要做的事。',
    '第二句中的 first 说明了先后。实际使用时先出示学生证，再使用电脑。读规则除了辨认 can／must，也留意 first 这一类词。',
  ],
  'rules-mustnt-optional': [
    '把 eat 和 bring a notebook 写到纸上，分别标「禁止」和「可选」。遇到 mustn’t，把它和动词放一起看，意思是这件事禁止做。',
    '用书包里的笔记本检验第二条：带一本可以，空手来也可以。don’t have to 去掉的是要求，理解成「不用非带不可」。',
  ],
  'rules-who-reading': [
    '根据 if 先分新同学和老同学。新同学在 sign in 一栏标「要签到」，老同学标「无需签到」。',
    '读到 For everyone，把「室内禁食」同时记到两栏下面。做题时读完自己那条，还要看看有没有适用于所有人的规定。',
  ],
  'passive-roles': [
    '在两句里分别给制作者和海报划线。第一句是 Mei 开头，第二句把 The poster 挪到了开头，制作这件事发生在海报上。',
    '沿着 was made 找到 by Mei，就能回到第一句的制作者。遇到类似句子，分别问「什么被做了」「谁做的」，再给两边配对。',
  ],
  'passive-no-agent': [
    '把句子分成三块：The books 是被搬的东西，to Room 204 是搬到哪里，yesterday 是什么时候搬。',
    '如果题目问现在去哪找书，答案从 to 后面的地点来。原文只给了动作、地点和时间，负责搬书的人需要另外的线索才能确定。',
  ],
  'passive-notice': [
    '用 from 和 to 画箭头「101 室 → 205 室」。如果要去买书，地点记箭头指向的那一端。',
    '另起一行抄 still start at 3 p.m.。still 告诉你开始时间沿用，写提醒时更新教室，再把下午三点原样记上。',
  ],
  'relative-people': [
    '从 The students 往右读，把 who signed up on Monday 整段框起来，给学生贴上「周一报名」的标签。',
    '找到框右边的 will meet on Friday。Monday 说明哪一批学生，Friday 才是开会那天。遇到两个星期时，分别认它们旁边的动作。',
  ],
  'relative-things': [
    '先看 Bring the bag. 知道要带一个包。接下来读 that has your name on it，得到挑这只包的线索。',
    '想象桌上一只包有你的名字，另一只写的是同学的名字。用 that 后面的说明去检查标签，拿写有自己名字的那只。',
  ],
  'relative-notice': [
    '把两句里的 who 说明各抄一格：signed up online 对应网上报名的人，signed up at the office 对应在办公室报名的人。',
    '再从每格横着读到该条的 meet in。网上报名看 202 室，办公室报名看 105 室；先确认自己的报名方式，再抄同一行的教室。',
  ],
  'vocab-borrow-lend': [
    '画一个箭头 Mei → I，表示书从 Mei 手里到我手里。第一句以 I 开头，用 borrow from 说「从 Mei 那里借来」。',
    '第二句跟着同一条箭头走，换由 Mei 开头，用 lends me 说「借给我」。遇到这两个词，先认句首是拿到的人还是给出的人。',
  ],
  'vocab-return-keep': [
    '给 keep 和 return 各填一格。keep 后的 for one week 是可以拿在手上多久，return 后的 on Friday 是具体哪天交回去。',
    '把 it 换回 the book 读一次：Return the book on Friday.。如果要记在日历里，写下星期五和要还的物品，时长另记一栏。',
  ],
  'vocab-library-reading': [
    '先在纸上写 book 和 map 两行。读 Keep the book for one week. 时，只把「可借一周」填进 book 那行。',
    '从 and 把最后一句拆为 return the map on Monday 和 return the book on Friday。两个日期和各自名词一起抄，能避免把地图也记成周五还。',
  ],
  'poster-signup': [
    '把海报上的动词写到两个栏目。Sign up 下的 Room 106 是报名地点，Meet 下的 the classroom 是参加活动的地点。',
    '再把 on Friday 写在 Meet 的一栏，因为它在那一句。想参加时先去 106 室报名，活动当天按集合那行走。',
  ],
  'poster-no-experience': [
    '把 No experience needed 整体读成「没有经验也可以」。如果你刚开始学画画，这条告诉你已经满足关于经验的要求。',
    '下一句 Bring a pencil 单独提供了准备事项。给自己留两个勾选框「可以报名」「准备铅笔」，避免只核对一项。',
  ],
  'poster-compare': [
    '分开筛两轮。第一轮看经验：零基础符合 Photo Club，想加入 Swim Club 要先会游泳。',
    '第二轮对照时间：摄影社 16:00 开始，游泳社 17:00 开始。假如新手 16:30 才能到，两个社团都各有一个条件没过。',
  ],
  'insert-reference': [
    '先从 They said hello. 倒着找人物。They 在这里指复数，前面刚介绍的 Two students 可以填进 They 的位置。',
    '把三句连读成「开门 → 发现两名学生 → 两名学生问好」。如果中间句只介绍一个人的名字，最后的 They 就缺少能接上的对象。',
  ],
  'insert-relation': [
    '第一句的 small ways 意思有点宽。读到 For example 后等一个具体行动，lend a pen 就是借出一支笔给同学这种小事。',
    '把后一句拿掉，前一句仍说得完整，只是少了做法。做衔接题时，可以先问后一句在说明前一句、转到相反情况，还是继续讲下一件事。',
  ],
  'insert-both-sides': [
    '只读第一句和最后一句，会看到「本子湿了」跳到「又可以写了」。先想中间缺了一件让情况改善的事。',
    'Lin gave her a dry notebook. 补上这一步，her 指 Mei，dry 和前面的 wet 相对。插入后从头读一遍，看看 now 的新情况能否解释。',
  ],
  'gap-what': [
    '把后一句倒回去接到问法里：She wants a book. 回答的是「她想借什么东西」，a book 就是要找的对象。',
    '写进 I don’t know 后，放 what 再放 Mei wants to borrow。试读时留心 Mei 在 wants 前面，最后按完整陈述来读。',
  ],
  'gap-word-job': [
    '先把括号给的词和空格暂时遮住。看第一句 is 后是在描述 Mei，选 careful；第二句空格跟着 reads the notice，描述她怎样阅读。',
    '第二句需要副词 carefully。做完问自己「如果去掉这个词，还剩不剩 Mei reads the notice 这个动作？」如果剩下，刚补的词就在说明读法。',
  ],
  'gap-spend-ing': [
    '从 spends 后找时长 an hour，再找用这段时间做的事 reading。把句子读成 Lin / spends an hour / reading every day。',
    '仿写半小时做画画练习，可说 Lin spends half an hour drawing every day.。留下时长的位置，后面的动作仍写成 -ing。',
  ],
  'sentence-past-phrase': [
    '把 Two days ago 单独圈出。两天前已经结束，选 wash 的过去式 washed，再从中文找被洗的东西 a cup。',
    '如果题目已经印了 Two days ago, we，在空格里写 washed a cup 即可。写完把印好的部分也读一遍，检查主语、时间和宾语有没有重复。',
  ],
  'sentence-location-question': [
    '在 Where is the school office? 里找三块：where／is／the school office。接在 tell me 后，where 留在最前面。',
    '接着把地点名放在 is 前：where the school office is。自己空读一遍整句 Could you tell me …?，核对空格只填从 where 到 is 的部分。',
  ],
  'sentence-proud-boundary': [
    '先圈出主语和时间。Mei 说现在的感受用 is，Yesterday 加 we 时就要用 were，后面的 proud of 保持连在一起。',
    '分清空格的右边已经印了什么。若题目右边是 of our work，只填 were proud；若右边只有 our work，就连着填 were proud of。',
  ],
  'timetable-locate': [
    '假设你找星期一九点的课，先用 Monday 筛掉第三行，再用 9:00 筛掉第二行。',
    '从留下的第一行向右读出 Math 和 Room 106。第三行也有 106 室，所以可以用星期和时刻确认这是自己要去的那节课。',
  ],
  'timetable-change': [
    '先在更改通知圈 Friday Art，把它和旧表里同样写着 Friday、Art 的那行配起来。两门课时刻相同，课程名才分得开。',
    '就在美术行把 108 室换成 203 室。音乐那行仍读作 Friday 4:00, Music, Room 106，抄最新教室时沿着课程名找到同一行。',
  ],
  'timetable-decide': [
    '先照时间表抄两个候选：九点音乐社、十点美术社。然后读这周通知，把 no Music Club 对到音乐社那行并划掉。',
    '想找这周还能去的一项，就从剩下的美术社那行一起抄时间和 203 室。同一行里三项都对上，出门时才知道几点到哪里。',
  ],
  'form-field': [
    '把表名和可填写的栏分开。Drawing Club: Sign-up form 告诉你是哪张表，有空格的 Name、Email、Activity 才是要落笔的三栏。',
    '如果手里有一个活动名，沿着 Activity 右边填；邮箱放 Email。填完再读表下 Please write in English，把书写要求应用到表格上。',
  ],
  'receipt-status': [
    '先对照 Drawing Club 和 Name，确认是自己这一次报名，再读 Status: Submitted。这个状态说明表已经送到了。',
    '到 Note 找接下来做什么。We will check 说明还在等核对，Please wait 指示先等新回执；可以把当前进度记成「已交，待确认」。',
  ],
  'receipt-fix': [
    '看到 Needs correction 先去读更正通知。change the room to Room 106 同时告诉你要动的是教室栏、要写的新值是 106。',
    '按通知逐项核对：把 Room 203 改成 106；看到 The time stays the same，把 Friday 4:00 从旧回执原样抄到新记录。',
  ],
  'price-tag': [
    '从价格旁找 each 和 for。Notebook 的 each 给每本价；Pencil 的 2 for 5 yuan 给两支一组的价。买两支时按一组写 5 元。',
    'Total: 12 yuan 出现在小票末尾，表示这张小票加起来的金额。查某种东西的单价时回价签找对应的那一行。',
  ],
  'price-offer': [
    '列两个核对项：买两本及以上；有学生证。优惠行上的 5 yuan each 要在这两项都满足时才用。',
    '拿「有学生证，买 1 本」来试一下。证件符合，数量没到两本，查下面的 One notebook，单本价是 6 元。',
  ],
  'price-receipt': [
    '先从小票抄数量：笔记本 2 本，橡皮 1 块。把笔记本的 2 跟 two or more 核对，刚好够，正确单价应是 5 元。',
    '再逐行比较单价。橡皮的 1 元和价签相同；笔记本写成每本 6 元，需要更正，按 2 本重新算应该是 10 元。',
  ],
  'unit-01-practice': [
    '把 Bo 的话按用途拆成三小段：Hi 先招呼，I’m Bo. 报自己的名字，Nice to meet you. 把初次见面的问候说完。',
    '换一个同学来接话时，可以先用 I’m 加自己的名字，再回 Nice to meet you, too.。还不知道对方名字时，用 What’s your name? 来问。',
  ],
  'unit-02-practice': [
    '把例句抄成三栏。先写 show 的开始时间 Friday 7 p.m.，再用 Meet in 找集合点 school hall，用 Bring 找要带的 chair。',
    '核对时把信息说成一句出门提醒：「周五晚上七点，到学校礼堂，带一把椅子。」看新通知时，即使三句换顺序，也按动作找回对应的那栏。',
  ],
  'unit-03-practice': [
    '第一句读成 Mei／buys／a bag，先看清「谁买了什么」。第二句的 It 需要从这三个部分里找一个能接住的事物。',
    '试着在 It is small. 里换回 the bag，意思是「包很小」。顺手圈住 is small，这一段是在说包的样子。',
  ],
  'unit-04-practice': [
    '沿同一条线记「08:00 公交车离开 → 08:15 Mei 到车站」。两个时刻相差 15 分钟，可以推出她错过了这班车。',
    '想加一句「因为起晚了」时，回材料找有没有起床的线索。例句里只有车离开和她到站的时间，可以用这两点说明判断。',
  ],
  'unit-05-practice': [
    '先把两句共同的动作 cleaning the desk 圈起来，再找时间。now 是此刻，Yesterday at eight 是昨天八点。',
    '时间决定前面配哪一个 be：Mei is cleaning 说现在，she was cleaning 说过去那一刻。把 she 换成两个人 they 时，可说 they were cleaning。',
  ],
  'unit-06-practice': [
    '从第一句把 Ms. Chen 抄到「收件人」，所以开头可以写 Dear Ms. Chen。她对应后一句里的 her。',
    '把题目的 and 当成核对线：which club 要写一个社团，why 要交代想参加的原因。写完用两句原话分别勾掉这两个要求。',
  ],
  'unit-07-practice': [
    '把原文记成两行事实：开会在 Thursday；new members 带照片可选。看改写时先核对日期，再核对说的是哪群人。',
    '如果选项说 New members can come without a photo.，意思接得上。写成 They must bring a photo. 就把可选变成了必须。',
  ],
  'unit-08-practice': [
    '把 Wednesday 4 p.m. 记进「发姓名的截止时间」。if 只管紧接着的要求，新同学发姓名时在后面写 NEW。',
    '用 now 和 not 给两个房间贴新旧标签：现用 102 室，原来是 201 室。最后按「截止／给谁的附加要求／现用教室」自己念一遍。',
  ],
  'unit-09-practice': [
    '用三个小框读原句：cooking club 是喜欢的活动，we cook together on Fridays 既写到做法和时间，也在 because 后解释喜欢的原因。',
    '如果要讲得再具体些，可以加 We make simple dishes together.。补充前回看题目的要求，选一句能带来新信息的放进草稿。',
  ],
  'unit-10-practice': [
    '把 took a short break 读成一组，意思是「短暂休息」。这里 took 已经表示过去，break 是这组表达里的名词。',
    '从 so 两边画箭头「天气热 → 到树下休息」。试词时先读搭配，再检查这个行动能不能接住前面的原因。',
  ],
  'unit-11-practice': [
    '前半段先解决「现在能不能借」。听到 Sorry 和 I need it now，就在「现在」旁标暂时借不到。',
    'How about after lunch? 只是提了新时间，直到 After lunch is fine. 才约成。用两个记号把「提议」和「确认」分开。',
  ],
  'unit-12-practice': [
    '先标出三步：填写表格、把它交给老师、等卡。第二句的 it 回指第一步填好的 form。',
    '从结尾往前核对一次。要拿到卡，前面要先等；等待前要把表给老师。题目问交给谁时，就去第 2 步读 to the teacher。',
  ],
  'unit-13-practice': [
    '先把两句相同的部分 to school every day 框起来，说明都是每天步行去上学。剩下的差别是 I walk 和 Mei walks。',
    '从 Mei 换回 I 时，把 walks 改回 walk。默念一遍 I walk / she walks，再带着同一个 every day 把两句说完整。',
  ],
  'unit-14-practice': [
    '从 yesterday 和 Did 找到过去的时间，Did 已经标明过去，所以读 clean the room。例句中的 Yes, she did. 就是在说 Mei 确实打扫了。',
    '试说相反的情况：Mei didn’t clean the room yesterday.。动词仍是 clean，因为表示过去的任务交给了 didn’t。',
  ],
  'unit-15-practice': [
    '先写下将来时的时间格「周一下午两点」。接着从用场地的两句里找 won’t，划掉 front hall。',
    '把 will use 后的 reading room 填到地点格。提醒自己出门时拿到的是「周一下午两点，阅览室」，时间和地点都要有依据。',
  ],
  'unit-16-practice': [
    '第一句从 bigger 往两边找：new dining hall 在左，old one 在右。one 代替 dining hall，所以比较的是新旧两个食堂。',
    '第二句单独看座位数。more than 60 表示超过 60，61 符合，60 刚好在界线上。例句给出了范围，具体有多少座位还要查其他信息。',
  ],
  'unit-17-practice': [
    '把 because the bus was slow 和 to buy a card 放进两栏。公交车慢解释为什么早出发，买卡说明去了店里想做什么。',
    '读到 But 先找遇到的问题：店关门了。接着用 so 找结果：她回来了。复述时保留「想买」这个词，买成了需要另外的线索。',
  ],
  'unit-18-practice': [
    '先按组别画两行。A 组读 must bring，地图记为必带；B 组读 don’t have to bring，地图记为可选。',
    '最后一条从 For everyone 开头，两组都要遵守。无论哪组，mustn’t take photos 都应记成「礼堂内禁止拍照」。',
  ],
  'unit-19-practice': [
    '用两行记这次搬动。旧桌子是 moved out，周一搬出去；新桌子是 put in，周二放进去。out 和 in 给出了相反的方向。',
    '第二句省去了同一个教室名，可以根据上下文接到 202 室。复述给同学时可以先说教室，再按两天分开说桌子的变化。',
  ],
  'unit-20-practice': [
    '前半句都从 the books 开始，先圈各自的 that 说明，用 green mark／red mark 把两批书分开。',
    '从各自的标记连线到 will go to 后的班级，连出绿色 → 1 班、红色 → 2 班。拿到一本书，先看标记，再沿同一条线找班级。',
  ],
  'unit-21-practice': [
    'Chen 作主语，borrowed … from Lin 说明他从 Lin 手里借来一支笔。画箭头 Lin → Chen，笔先到 Chen 手里。',
    '把还笔写成一条提醒「周四归还这支笔」。for two days 表示能留多久，on Thursday 表示具体哪天还，两个时间各填一栏。',
  ],
  'unit-22-practice': [
    '先读 No experience needed，舞蹈零基础符合这条要求。然后给自己记「报名到 105 室」「活动到礼堂」两处地点。',
    'at 3 p.m. on Tuesday 跟着 Meet 写，所以贴到活动格。对比另一张海报时，也各自抄出资格、报名和活动三项再比较。',
  ],
  'unit-23-practice': [
    '先从两头找缺口：开头说笔没墨，结尾说 Mei 现在能填表了。缺的是能让她重新写字的那件事。',
    '把 Lin gave her a new pen. 接进去，新的笔解决「没墨」，her 也接住前文的 Mei。把三句连读，看最后的 Now 有没有从中间句得到解释。',
  ],
  'unit-24-practice': [
    '第一句从 borrow 往回问「想借什么」。用 what 占要借的东西的位置，然后按 Mei wants 的顺序接到 I don’t know 后。',
    '第二句把 reads the notice 连着看。carefully 说明 Mei 读得怎么样，给动作补细节；在 is 后描述 Mei 的特点时，可用 careful。',
  ],
  'unit-25-practice': [
    '先框出 Yesterday 和 after class。前者确定用过去式 cleaned，后者补充事情发生在昨天的哪个时段。',
    '如果空格左边已有 Yesterday, we，右边已有 after class，只写 cleaned the windows。合起来读一遍，确认已经印出的时间和主语各出现一次。',
  ],
  'unit-26-practice': [
    '把原表按课程分两行：English 九点 104 室，Music 十点 106 室。查课时，同一个课程的时间和教室一起从那行读。',
    '通知点名 Monday Music，只把音乐行的教室换成 202。十点这个时刻在原表里，通知只更新教室，写新日程时再把时刻带上。',
  ],
  'unit-27-practice': [
    '先从 Status 读出还在等更正，接着到 Note 找要做的事。Note 点名 Class field，所以在表里找班级栏。',
    '用班级名填进 Class，回读一次说明，确认这一项已补。其他栏按原表填写，重新提交后看新的 Status。',
  ],
  'unit-28-practice': [
    '先把每种东西的计价方式单独记下：铅笔每支 2 元，笔记本 3 本一组 12 元。each 按件算，for 前的数字告诉你这一组有几件。',
    '用小票的 2 pencils 对回铅笔价签。2 支乘每支 2 元得到 4 元，和 Total 一致。核对小票时逐行用自己的商品和数量算，再看总价。',
  ],
});
