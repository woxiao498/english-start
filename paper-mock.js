/* Original mock exams. Keep published IDs and question numbers stable. */
window.EXAM_MOCKS = (() => {
  const titles = {
    dialogue: 'Ⅰ 补全对话', words: 'Ⅱ 词汇', cloze: 'Ⅲ 完形填空',
    'reading-1': 'Ⅳ 阅读理解 · A 篇', 'reading-2': 'Ⅳ 阅读理解 · B 篇',
    insert: 'Ⅳ 阅读理解 · 短文选句', grammar: 'Ⅴ 语法填空',
    sentence: 'Ⅵ 完成句子', email: 'Ⅶ 应用写作',
  };
  // Fixed, balanced answer positions for the 40 independent multiple-choice items.
  // The five insertion questions share one option order within each paper.
  const positions = [
    'DBCDBDCCACCBBCADBDACABBDAACDBBDABCDADCAA',
    'DABDACCBDADCCADBDCDADCBBDABABACACCBBADCB',
  ];

  function makePaper(number, bank) {
    let n = 0;
    let choice = 0;
    const sections = bank.map(([id, rows, material, shared]) => {
      const offset = n;
      const passage = material?.trim().replace(/\[(\d+)\]/g, (_, index) => `[${offset + Number(index)}] ____`);
      const questions = rows.map(([prompt, values, answer, explanation]) => {
        const item = { id: String(++n), prompt: prompt || `填第 ${n} 空。`,
          points: id === 'email' ? 10 : /^(reading|insert|sentence)/.test(id) ? 3 : 2 };
        if (id === 'email') return { ...item, reference: values, rubric: answer, openEnded: true };
        if (id === 'grammar' || id === 'sentence') {
          return { ...item, accepted: values, reference: id === 'grammar' ? `${values[0]}。 ${answer}` : answer,
            reviewUnmatched: id === 'sentence' };
        }
        let labels = shared;
        let correct = 'ABCDE'[answer];
        if (!shared) {
          correct = positions[number - 1][choice++];
          labels = values.filter((_, index) => index !== answer);
          labels.splice('ABCD'.indexOf(correct), 0, values[answer]);
        }
        return { ...item, options: labels.map((label, i) => ({ id: 'ABCDE'[i], label })),
          answer: correct, reference: explanation };
      });
      return { id, title: titles[id], passage, questions };
    });
    return { id: `mock-${number}`, title: `原创模拟卷 ${String(number).padStart(2, '0')}`, minutes: 120, sections };
  }

  const first = makePaper(1, [
    ['dialogue', [
      ['—Excuse me, is this seat taken?\n—____ I’m waiting for a friend.', ['Yes, it is.', 'Here you are.', 'Good idea.', 'Same to you.'], 0, 'waiting for a friend 说明座位留给朋友，Yes 回答 is this seat taken。'],
      ['—Can we move the art meeting to Thursday?\n—____ I have a class then. How about Friday?', ['That’s great.', 'I’m afraid Thursday won’t work.', 'I’ve got it.', 'It’s next door.'], 1, '后文说明周四有课，并提出另一日期，前句应委婉拒绝周四。'],
      ['—I’m sorry I sent you the wrong file.\n—____ You can send the right one now.', ['I disagree.', 'Not yet.', 'It’s all right.', 'You’re right.'], 2, '对方道歉，接着允许重发，用 It’s all right 表示谅解。'],
      ['—How do I get to the training room?\n—____ It’ll be on your left.', ['It opens at eight.', 'It’s very busy.', 'I’d love to.', 'Go past the office.'], 3, '问路线，选择经过办公室的动作指令。'],
      ['—Shall I print another copy for you?\n—____ One copy is enough.', ['No, thanks.', 'Anything else?', 'See you soon.', 'Sounds difficult.'], 0, '一份足够，礼貌拒绝对方再打印一份。'],
    ]],
    ['words', [
      ['Please **collect** your name card at the front desk before you enter.', ['扔掉', '领取', '制作', '隐藏'], 1, '进入前从前台取自己的名牌，collect 在这里是领取。'],
      ['The repair shop gave me a **rough** idea of how much the work would cost.', ['粗糙的', '激动的', '大致的', '固定的'], 2, '费用只给了一个 estimate，rough 在这里表示大致。'],
      ['The red jacket really **stands out** among all the grey ones.', ['站起来', '坚持', '退出', '显眼'], 3, 'among all the grey ones 的颜色对比说明红夹克格外显眼。'],
      ['The new timetable **takes effect** next Monday. Until then, use the old one.', ['生效', '结束', '起草', '公开'], 0, '下周一开始使用新表，在那之前用旧表，take effect 表示生效。'],
      ['I took the **wrong** bus and ended up on the other side of town.', ['便宜的', '错误的', '最后的', '最快的'], 1, '去了不该去的地方，说明乘错了车。'],
      ['Please **handle** the glass with care because it can break easily.', ['递给', '清洗', '拿放', '画出'], 2, 'glass 易碎，with care 提示小心拿放。'],
      ['The hall can **hold** two hundred people for the concert.', ['抓住', '取消', '邀请', '容纳'], 3, '主语是礼堂，two hundred people 是人数容量。'],
      ['Rita left a note as a **reminder** to feed the fish.', ['提醒', '礼物', '答案', '理由'], 0, '留下便条是为了提醒喂鱼。'],
      ['The two bags look **similar**, but one has a longer strap.', ['相反的', '相似的', '昂贵的', '整齐的'], 1, 'but 后给出一处不同，前半句说整体看起来相似。'],
      ['Our group **ran out of** tape just before we finished the display.', ['收起', '分发', '用完', '找出'], 2, '还没做完展示就没有胶带了，ran out of 表示用完。'],
    ]],
    ['cloze', [
      [null, ['priced', 'removed', 'found', 'locked'], 2, '送去回收前，在废纸下面找到一盒照片。'],
      [null, ['except', 'unless', 'until', 'although'], 3, '照片虽旧却值得留，although 引出让步。'],
      [null, ['story', 'ticket', 'tool', 'stamp'], 0, 'asked neighbors to talk 说明照片背后可能有故事。'],
      [null, ['waited', 'decided', 'promised', 'refused'], 1, 'decided to invite 表示决定邀请邻居来认照片。'],
      [null, ['dates', 'colors', 'sizes', 'prices'], 0, 'year in pencil 指照片背后写的是年份，属于日期线索。'],
      [null, ['slowly', 'safely', 'separately', 'clearly'], 2, '按纸袋分开装，避免照片重新混在一起。'],
      [null, ['rather', 'almost', 'yet', 'however'], 3, '以为都在同一个街区拍，但其中一张是在河对岸拍的。'],
      [null, ['explain', 'forget', 'limit', 'reduce'], 0, '老邻居 explained why，解释了那栋建筑后来为什么拆除。'],
      [null, ['simple', 'local', 'empty', 'closed'], 1, '故事来自附近居民并涉及街区，属于本地历史。'],
      [null, ['gave up', 'held back', 'wrote down', 'looked out'], 2, '听到人名和地点，把它们写下来以免遗忘。'],
      [null, ['need', 'avoid', 'miss', 'include'], 3, '展览包括照片及旁边的简短故事。'],
      [null, ['reply', 'mention', 'borrow', 'believe'], 1, '有人希望让展签提到祖母的名字，mention 表示提及。'],
      [null, ['attention', 'worry', 'trouble', 'noise'], 0, '大家驻足看展，说明它引起关注。'],
      [null, ['across', 'between', 'during', 'without'], 1, 'between generations 指两代人之间。'],
      [null, ['angry', 'afraid', 'glad', 'sleepy'], 2, '把差点丢掉的照片做成展览，人物感到高兴。'],
    ], `
Last spring, Tao helped clear a room at his community center. Under some old papers he [1] a box of photographs. He thought the pictures were worth saving, [2] they were yellow and torn at the edges. “There may be a [3] behind each one,” he said. He [4] to invite a few neighbors to see them.

Before the visit, Tao looked for [5] on the backs of the photographs. A few had a year written in pencil. He put the dated pictures into paper bags [6] so they would not get mixed up again. Tao guessed that all the photos came from the same street. One photo, [7], showed a building across the river.

At the meeting, an older neighbor could [8] why the building had been taken down. Another remembered buying bread there as a child. Tao realized the photos were part of [9] history. As people talked, he [10] names and places so he would not forget them.

The center later held a small exhibition. It could [11] both the pictures and short stories beside them. One visitor asked Tao to [12] her grandmother’s name on a card beside a picture. The show soon drew [13] from people who rarely visited the center. It even started conversations [14] generations. Tao was [15] he had opened the box instead of throwing it away.`],
    ['reading-1', [
      ['What problem did the repair group first notice?', ['The market opened too late.', 'Lots of usable items went to waste.', 'Visitors had no bus to the market.', 'The library needed more lights.'], 1, '首段说小故障可修的物品被扔掉，于是设了桌子。'],
      ['What must visitors do before Saturday?', ['Buy a new lamp.', 'Bring a second item.', 'Clean the whole market.', 'Describe the problem on a form.'], 3, '第二段要求先填一份短表，描述要修的物件的问题。'],
      ['What is special about a visitor’s time at the table?', ['The visitor takes part in the repair.', 'All parts are sold to the visitor.', 'The visitor stays behind a screen.', 'Every item is fixed in five minutes.'], 0, '第三段描述维修者示范后由访客尝试一个简单步骤。'],
      ['What does “workshop” refer to here?', ['A shop that only sells tools.', 'A bus stop next to the market.', 'A teaching session for practical skills.', 'A room where clothing is kept.'], 2, '紧随其后的说明说练安全使用常用工具，是学习实践技能的活动。'],
      ['Where would this text most likely appear?', ['A novel about childhood.', 'A community notice board.', 'A shop receipt.', 'A bus timetable.'], 1, '材料告知当地活动时间、规则和报名方式，符合社区公告。'],
    ], `
Saturday Repair Table

Do you have a lamp that has stopped working or a bag with a broken zip? Volunteers at Riverside Market noticed that many things were being thrown away even when they could still be fixed. They will open a repair table on the first Saturday of each month.

Bring one item that you can carry safely. Before Saturday, fill in the short form at the market office and describe what is wrong. The volunteers use the forms to decide which tools to bring. They cannot work on large machines or items with leaking batteries.

Your visit lasts about twenty minutes. A volunteer will show you how the repair starts, then ask you to try a simple step yourself. For example, you may learn to find the right screw or to put a new zip pull on a bag. If the item needs a part the market does not have, you will get advice on what to do next.

Visitors who want more practice can sign up for a free afternoon workshop. In this session they practise using common tools safely. Dates are displayed by the market entrance.`],
    ['reading-2', [
      ['Why did Mira count people at the bus stop?', ['To find out who was reading.', 'To decide which driver to thank.', 'To test why people gathered near one end.', 'To write down the bus numbers.'], 2, '首段说明 Mira 想找出大家为什么挤在同一端。'],
      ['What made the west end uncomfortable during the first week?', ['It had no seats at all.', 'Strong sun reached its seats.', 'It was closed for cleaning.', 'Drivers could not see it.'], 1, '第一周西端座位数相同，下午太阳却照到它们。'],
      ['What happened after a shade was put up?', ['The bus route changed.', 'The old seats were taken away.', 'More people stood inside the bus.', 'People used both ends more evenly.'], 3, '接近一半选西端，说明两边使用更均衡。'],
      ['Why did Mira keep the number of seats the same?', ['To make a fair comparison.', 'To avoid telling passengers.', 'To save the cost of counting.', 'To prove that the buses were late.'], 0, '保持座位数量不变，便于把差异和遮阳联系起来。'],
      ['Which title fits the text best?', ['How to Draw a Bus Map', 'A New Job for Bus Drivers', 'What Shade Changed at a Bus Stop', 'Why Buses Need More Seats'], 2, '全文围绕观察、加遮阳、比较人数分布。'],
    ], `
On her way home from college, Mira often saw people waiting at one end of a long bus stop. The other end looked almost empty. Was it simply farther from the point where buses stopped? She decided to count the people at both ends for a few afternoons.

During the first week, Mira found that both ends had the same number of seats. However, the west end was in direct sunlight in the late afternoon, while a building shaded the east end. When both sides had seats free, most passengers still chose to stand in the shade.

The following week, the local council put a temporary shade over the west seats. Mira kept the same counting times, and the number of seats did not change. This time nearly half the passengers chose the west end. People no longer needed to walk as far along the stop to find a comfortable place.

Mira shared her notes with the council. Her observation covered only one stop, so she suggested testing the idea elsewhere before making a large change. The council agreed to try temporary shades at two other stops that received a lot of afternoon sun.`],
    ['insert', [
      [null, null, 2, '第一段呈现问题，这里提出以清楚的分工解决问题。'],
      [null, null, 0, '下句列出材料、时间、地点三个需要确认的事项，接 checklist。'],
      [null, null, 4, 'it 指共同记录，下一句解释共同记录怎么避免信息遗漏。'],
      [null, null, 1, '下句 it 指 delay，提前说可以让别人接手。'],
      [null, null, 3, '下文谈下次保留或改进的方法，接完成后的简短回顾。'],
    ], `
A group project can become difficult even when everyone is willing to help. Sometimes two students work on the same task and nobody does another one. [1]

At the first meeting, put the tasks in writing. [2] Make sure the list includes what materials are needed, when the work is due and where the group will meet.

Let each person choose a role. One student can keep a shared record of what the team has decided. [3] That way, a teammate who misses a meeting can still see the latest information.

During the project, check progress before the deadline. [4] If others hear about it early, someone may be able to take over a part of the work.

When the project is finished, meet for a few minutes. [5] Keep the methods that helped the team, and change one thing that caused trouble. The next group project will be easier to organize.`,
      ['A short checklist is a good place to start.', 'Tell the group early if you expect a delay.',
       'Clear roles can prevent this problem.', 'Use this time to discuss what went well.', 'Put the record where all members can read it.']],
    ['grammar', [
      [null, ['organized', 'organised'], 'Last term 说明过去，organize 的两种拼写都接受。'],
      [null, ['a'], '第一次提到一个地图，map 以辅音起始。'],
      [null, ['workers'], 'three 后接可数名词复数。'],
      [null, ['at'], 'arrive at 接具体小地点或场所入口。'],
      [null, ['carefully'], '修饰 listened，用副词 carefully。'],
      [null, ['who', 'that'], '修饰人且在从句里作主语，用 who 或 that。'],
      [null, ['to follow'], 'ask somebody to do something，请某人做某事。'],
      [null, ['but'], '前说声音大，后说听清楚，表示转折。'],
      [null, ['writing'], 'finish doing 表示做完某事。'],
      [null, ['their'], 'notes 前用形容词性物主代词 their。'],
    ], `
Last term our school [1] (organize) a visit to a printing workshop. The teacher gave each group [2] map and a list of questions. We planned to interview three [3] (worker) during the visit.

We arrived [4] the workshop entrance just before nine and listened [5] (careful) to the safety rules. The guide [6] led our group asked us [7] (follow) a blue line along the floor. The machines were loud, [8] we could still hear him when he stood close to us.

Before leaving, we finished [9] (write) the answers to our questions. Back at school, all the groups compared [10] (they) notes and made a short report.`],
    ['sentence', [
      ['Can you tell me ____?（图书角什么时候开放）', ['when the reading corner opens', 'when the reading corner will open', 'when the reading corner is open'], 'when the reading corner opens。连接词后用陈述语序。'],
      ['Jenny ____ when the teacher called her name.（正在画一张地图）', ['was drawing a map', 'was making a map', 'was sketching a map'], 'was drawing a map。过去某一刻正在做，用 was + -ing。'],
      ['The organiser asked us ____ on the list.（写下自己的姓名）', ['to write down our names', 'to write our names', 'to put our names'], 'to write down our names。ask us 后接 to do。'],
      ['It is ____ before a game.（热身很有必要）', ['necessary to warm up', 'important to warm up'], 'necessary to warm up。先写形容词，再加 to warm up。'],
      ['There are ____ in the box.（至少十把尺子）', ['at least ten rulers', 'at least 10 rulers', 'no fewer than ten rulers', 'no fewer than 10 rulers'], 'at least ten rulers。at least 表示至少。'],
    ]],
    ['email', [[
      '假设你是 Lu。外校同学 Ben 下周要来参观你的学校。请给他写一封英语邮件，推荐学校的一个地方，说明在哪里、到了可以做什么，并写出推荐理由。正文约 40 个英语单词。',
      'Dear Ben,\n\nI recommend our reading corner. It is beside the library on the ground floor. You can read short books there or talk with other visitors. I like this place because it is quiet and the books are easy to find.\n\nBest wishes,\nLu',
      ['内容（4 分）：推荐地点，写出位置、可做的事和理由。', '语言（4 分）：句意清楚、词句基本准确、衔接自然。', '格式（2 分）：有称呼和署名，正文约 40 词。'],
    ]]],
  ]);

  const second = makePaper(2, [
    ['dialogue', [
      ['—Would you mind closing the window?\n—____ It’s rather cold in here.', ['I’m late.', 'Keep the change.', 'Not at all.', 'That’s mine.'], 2, '后句同意屋里冷，Not at all 表示不介意关窗。'],
      ['—Which size would you like to try?\n—____ The large one looks too big.', ['Medium, please.', 'Two days ago.', 'On the shelf.', 'By bus, please.'], 0, '问题问尺码，嫌大后选择中号。'],
      ['—I left my notebook in the science room.\n—____ It may still be on the table.', ['You look well.', 'That sounds delicious.', 'It’s a pleasure.', 'Let’s go and check.'], 3, '笔记本可能还在，提出回去查看的行动。'],
      ['—Do you think the poster is easy to read?\n—____ Perhaps you could make the letters bigger.', ['It’s already sold.', 'The words are a little small.', 'It takes an hour.', 'I hope you feel better.'], 1, '后句建议放大字，前句评价字有点小。'],
      ['—Would you like some more soup?\n—____ I’ve had enough.', ['Go to the left.', 'Try it first.', 'No, thank you.', 'Have a nice day.'], 2, 'had enough 说明已经喝够，礼貌谢绝再加。'],
    ]],
    ['words', [
      ['The teacher asked us to **exchange** our notebooks and check each other’s work.', ['交换', '打开', '归还', '丢弃'], 0, 'each other’s work 说明要交换本子，互相检查。'],
      ['This path is **meant for** people on foot, so leave your bike at the gate.', ['由……保管', '与……一起', '专供……使用', '由……修建'], 2, '只能步行，路径专供步行者。'],
      ['The instructions are **clear** enough for a first-time user to follow.', ['透明的', '清楚的', '安静的', '宽阔的'], 1, '连第一次使用的人也能照做，说明指示清楚。'],
      ['Keep your phone on **silent** while the speaker is talking.', ['充电状态', '户外模式', '锁屏状态', '静音模式'], 3, '演讲时保持手机不出声，on silent 是静音。'],
      ['A loose button is easy to **replace** if you have a new one of the same size.', ['更换', '保存', '翻转', '寻找'], 0, '用一个同样大小的新扣子换掉旧扣子。'],
      ['It is difficult to **judge** the distance in thick fog.', ['拉长', '分开', '判断', '记录'], 2, '雾大时难以判断距离。'],
      ['The little tree finally **survived** the dry summer because Mai watered it every day.', ['长高了', '活了下来', '移走了', '开花了'], 1, '尽管夏季干旱，天天浇水使小树活了下来。'],
      ['Please **attach** the photo to the back of the form with a paper clip.', ['描述', '交换', '保存', '附上'], 3, '用回形针把照片附在表格背后。'],
      ['We couldn’t finish the work in daylight, so we **carried on** after dark.', ['继续', '放弃', '搬走', '拒绝'], 0, '天黑后仍做白天没完成的工作，carry on 是继续。'],
      ['The map **indicates** the nearest exit with a green arrow.', ['挡住', '修理', '指示', '量出'], 2, '地图用箭头指示出口位置。'],
    ]],
    ['cloze', [
      [null, ['measured', 'needed', 'opened', 'lost'], 1, '班级有表演，需要字幕让观众听不到时也能跟上。'],
      [null, ['until', 'unless', 'although', 'when'], 3, 'when 引出字幕出现的时机，配合每个角色开口。'],
      [null, ['sound', 'color', 'time', 'size'], 2, '下文要对照每句话开始的时刻，所以 time 最合适。'],
      [null, ['perfectly', 'quickly', 'loudly', 'blindly'], 0, '练习时一切显示得正好，承接后文转折。'],
      [null, ['or', 'so', 'for', 'but'], 3, '练习顺利，正式演出却出现变化。'],
      [null, ['ordered', 'noticed', 'accepted', 'checked'], 1, 'Jia 注意到台上的同学临时换了台词。'],
      [null, ['behind', 'above', 'before', 'beside'], 2, '字幕在演员开口前出现，应选 before。'],
      [null, ['correct', 'enter', 'paint', 'hide'], 0, '出错后需要及时纠正，correct 最合适。'],
      [null, ['Without', 'Against', 'Across', 'Among'], 0, 'without losing her place 指没有因此忘记自己操作到哪儿。'],
      [null, ['reached', 'stayed', 'matched', 'watched'], 2, '新操作后文字和声音重新对上，matched 表示匹配。'],
      [null, ['cleared', 'compared', 'caused', 'borrowed'], 2, '她想找出造成错位的原因，cause 是造成。'],
      [null, ['lesson', 'journey', 'screen', 'check'], 3, '下一次要做一次核查，确认台词顺序有没有变。'],
      [null, ['rather than', 'as far as', 'as well as', 'as soon as'], 0, '让演员发出提示，而非只靠钟表。rather than 引出替代方案。'],
      [null, ['still', 'even', 'also', 'only'], 2, '她除了为同学加了信号，还制作了简短操作卡，also 表示另外做了同类补救。'],
      [null, ['failure', 'change', 'joke', 'secret'], 1, '她学会为临场变动做好准备。'],
    ], `
Jia’s class was putting on a short play. They [1] words on a screen so people at the back could follow the story. Jia offered to run the screen. She planned to show each line just [2] an actor began to speak. During practice, she wrote down the starting [3] of each line. The words appeared [4] every time.

On the day of the show, the first few minutes went well, [5] then something unexpected happened. Jia [6] that one actor had changed a line. The next line appeared on the screen [7] the second actor was ready. Jia knew she had to [8] the timing. [9] losing her place, she hid the words for a moment and waited for the next line she recognized. Soon the words [10] the voices again.

After the show, Jia asked the actors what had [11] the mistake. A chair had been moved, so an actor had used a different line to explain where it was. For the next show, Jia planned an extra [12] of the order of the lines. She would also ask each actor to give her a small signal [13] depending only on the clock.

Jia [14] made a small card with the first word of each line so a new student could take over the screen. She knew then that plans still matter, and a little room for [15] matters too.`],
    ['reading-1', [
      ['Why did Ana set up the shelf?', ['To display her own lunch boxes.', 'To charge a fee for hot drinks.', 'To help people share herbs.', 'To store empty flowerpots.'], 2, '首段建立共用香草架，把多余的香草分享给别人。'],
      ['What does the wooden mark beside a pot tell visitors?', ['What the plant is and when to pick it.', 'How much the plant costs.', 'Who last watered the plant.', 'Where scissors are stored.'], 0, '第二段说木牌写植物名，并说明该不该等它长大再采。'],
      ['Why did Ana add a pair of small scissors?', ['To cut the labels into pieces.', 'To make a space for more pots.', 'To allow visitors to sell leaves.', 'To help people take leaves without harming the plant.'], 3, '最初有人把整株拔了，用剪刀可以只剪几片叶子。'],
      ['What can be inferred about the project?', ['Each visitor must bring a plant.', 'Simple instructions made sharing easier.', 'Customers preferred to pay for leaves.', 'The shelf belongs to the tea shop.'], 1, '标签、用量说明和剪刀共同降低使用难度。'],
      ['What is the main purpose of the text?', ['To compare two tea shops.', 'To explain how to cook a family meal.', 'To describe how a shared herb shelf developed.', 'To advertise equipment for gardeners.'], 2, '全文讲从想法到维护规则的变化。'],
    ], `
Ana grew mint and other herbs on a sunny windowsill. One summer, the plants grew faster than her family could use them. She put a low shelf outside the apartment building and moved a few pots there. A handwritten sign invited anyone to take a little for cooking.

At first, visitors could not tell which pot held which plant. Ana then put a wooden mark beside each pot. It gave the name of the herb and said whether the plant was ready to pick. She also wrote a short note asking people to take only what they needed that day.

One plant disappeared in its first week. A visitor had pulled it up instead of taking a few leaves. Ana put a pair of small scissors on the shelf with a picture showing where to cut. After that, visitors could take something home and leave the rest to grow.

The shelf soon gained two more plants from another neighbor. People who visited began to tell one another how they used the herbs at home. A student even put a small notebook on the shelf for simple cooking ideas.`],
    ['reading-2', [
      ['What did the students want to find out?', ['How different ground surfaces change the sound of footsteps.', 'Which shoes are sold most often.', 'Whether birds can hear people speaking.', 'How to clean the school paths.'], 0, '第一段提出换地面时脚步声是否变化，实验围绕这点。'],
      ['Why did they use the same pair of shoes?', ['Only one student had shoes.', 'The shoes were too heavy to move.', 'They wanted the surface to be the main difference.', 'They needed to test the shoes for a shop.'], 2, '控制鞋和走路人，地面才是主要变量。'],
      ['Which surface produced the loudest footsteps?', ['Grass.', 'Gravel.', 'Wood.', 'There was no difference.'], 1, '结果段说 gravel 的声音最高。'],
      ['Why did the students repeat their work on another day?', ['The first path was closed.', 'They had to try a new pair of shoes.', 'The teacher did not hear the first report.', 'They wanted to see whether the result happened again.'], 3, '重复实验是检查结果是否稳定。'],
      ['Where is the text most likely from?', ['A science club report.', 'A restaurant guide.', 'A personal diary about a trip.', 'A sports timetable.'], 0, '从问题、变量控制、结果到局限，符合科学社实验报告。'],
    ], `
Does a change in ground surface make a difference to the sound of footsteps? Our school science club tested this question on a wooden path, a gravel path and a short stretch of grass. One student walked along each surface, and another took a recording from a fixed distance.

In every test, the walker used the same pair of shoes and tried to walk at the same speed. The recorder stood two meters away, always on the same side of the path. For each surface we recorded three walks and compared the loudest moments from all three recordings.

The gravel path produced the loudest sound. On wood, each step was easy to hear, but the sound was lower. On grass, we could barely hear some of the steps. On a second afternoon, we repeated the work. The order of the surfaces stayed the same, even though the exact measurements were different.

Our work used only one walker and one kind of shoe. That means it cannot tell us how every person will sound on every path. To find out more, the club plans to repeat the test with other shoes. This time, the surface and recording distance will stay the same.`],
    ['insert', [
      [null, null, 1, '第一段提出动手做之前要先确认用途，后文从用途决定大小。'],
      [null, null, 4, '后文 put one shelf drawing … and compare it 意为在图上检查放置是否合理。'],
      [null, null, 0, '下文记录价格和数量，对应先列物料。'],
      [null, null, 3, '下一句说明首选没货时用替代物，所以应先备选。'],
      [null, null, 2, '最后用清单做完工检查，对照下文的检查项。'],
    ], `
If you are planning to make something for your room, begin with a simple idea. A low shelf for books may be a good first project. [1] The size of the things you want to put on it will help you decide how large the shelf needs to be.

Draw the room and the shelf on a piece of paper. [2] Put your shelf drawing next to a door or other furniture on the plan and see whether there will still be enough space to walk.

Before going to the hardware shop, measure the pieces of wood you need. [3] Write down how many pieces there are and later check the price of each one. This helps you stay within your budget.

Take your drawing with you when you shop. [4] If the shop has run out of your first choice, you can pick a suitable second option without changing the whole project.

After you finish putting the shelf together, check it before using it. [5] Find out whether it stands flat, whether all screws are tight, and whether it is safe to place books on it.`,
      ['Make a list of the materials before you leave.', 'Decide what the shelf is meant to hold.',
       'A short checklist is useful at this stage, too.', 'Think of a second choice for the materials.', 'This plan lets you test where the shelf will fit.']],
    ['grammar', [
      [null, ['invited'], 'Yesterday afternoon 提示过去，用 invited。'],
      [null, ['on'], 'on the floor 表示在地板上。'],
      [null, ['boxes'], 'Four 接可数名词复数，box 变 boxes。'],
      [null, ['an'], 'empty 起始是元音音素，第一次提到用 an。'],
      [null, ['to check'], 'remind somebody to do 表示提醒某人要做的事。'],
      [null, ['easily'], '修饰动词 find，用 easily。'],
      [null, ['because', 'as', 'since'], '后半句解释远离路口的原因。'],
      [null, ['which', 'that'], '指先行词 a bike pump，并在从句里作主语。'],
      [null, ['using'], 'after 后直接接动作时用 -ing。'],
      [null, ['us'], '介词 for 后用 we 的宾格 us。'],
    ], `
Yesterday afternoon, a local cycling club [1] (invite) us to help at a safety event. Before the visitors arrived, we laid out the tools [2] the floor. Four [3] (box) held different parts, and a volunteer put [4] empty basket by the door for damaged items.

At the entrance, the leader told visitors how to check their bikes. She reminded each visitor [5] (check) the brakes first. We had made picture signs so new riders could find the right station [6] (easy). All the children stayed away from the road [7] cars were still using it.

My job was to look after a bike pump [8] was near the air station. After [9] (use) it, each rider returned it to the same spot. At the end, the leader made cups of tea for all of [10] (we).`],
    ['sentence', [
      ['A short break can ____ our work.（对我们的工作产生很大影响）', ['make a big difference to', 'make a great difference to', 'have a big effect on', 'have a great impact on'], 'make a big difference to。can 后用动词原形，再接 our work。'],
      ['If you travel by bus, remember to find out ____.（最后一班车什么时候发车）', ['when the last bus leaves', 'when the last bus will leave', 'what time the last bus leaves', 'what time the last bus will leave'], 'when the last bus leaves。find out 后的问句用陈述语序。'],
      ['The school library ____ last Monday.（被重新开放）', ['was reopened', 'was opened again'], 'was reopened。过去时间用 was，加过去分词。'],
      ['You will see your progress ____ what you learn every day.（只要你每天记录）', ['as long as you record', 'so long as you record', 'as long as you write down', 'so long as you write down', 'if you record', 'if you write down'], 'as long as you record。空后给了记录对象和频率。'],
      ['There is enough space ____.（让三个人一起工作）', ['for three people to work together', 'for 3 people to work together'], 'for three people to work together。for 引出执行动作的人。'],
    ]],
    ['email', [[
      '假设你是 Chen。朋友 Robin 想参加一次有意义的社区活动。写一封英语邮件，推荐一项活动，说明活动时间、参与者能做什么和推荐理由。正文约 40 个英语单词。',
      'Dear Robin,\n\nI recommend the park clean-up on Sunday morning. We meet at the main gate and work in small groups. You can collect litter or help sort it. It is a good chance to meet neighbors and make the park more pleasant.\n\nBest wishes,\nChen',
      ['内容（4 分）：写清活动、时间、能做的事和推荐理由。', '语言（4 分）：句意清楚、词句基本准确、衔接自然。', '格式（2 分）：有称呼和署名，正文约 40 词。'],
    ]]],
  ]);

  return [first, second];
})();
