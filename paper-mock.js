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
    'CADBACABADDBBACCBADCCDDBBCADDBCABABDCCAD',
    'CAACBCDDCACBBDBACDBBCACCDDAADBDBCDABBADA',
    'BDDBCADCDBBCAABBCCDDBBDAACCACBADACACDDAB',
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

  const third = makePaper(3, [
    ['dialogue', [
      ['—Can I pay by card for this ticket?\n—____ This machine only takes coins.', ['I’m afraid not.', 'Here is your seat.', 'That’s a good price.', 'You’re welcome.'], 0, '机器只收硬币，礼貌地回答不能刷卡。'],
      ['—I finally finished the model bridge.\n—____ You’ve worked on it for weeks.', ['Never mind.', 'Well done!', 'I hope not.', 'Not this time.'], 1, '对方完成了作品，用 Well done 表示肯定和祝贺。'],
      ['—I’m looking for a quiet place to work.\n—____ There are usually some empty desks there.', ['Try the room behind the lab.', 'Please turn down your phone.', 'The door is red.', 'Tomorrow is fine.'], 0, '先推荐去实验室后面的房间，there 指回推荐地点。'],
      ['—Could you speak a little more slowly?\n—____ I’ll say that part again.', ['No, I haven’t.', 'I’d like the blue one.', 'Of course.', 'It’s half past three.'], 2, '后句愿意再说一遍，应先同意放慢语速。'],
      ['—When would you like me to return the keys?\n—____ The office closes at five.', ['On the second floor.', 'Any time before four today.', 'They are in my bag.', 'With my sister.'], 1, 'When 问时间，选择今天四点前，并与办公室关闭时间核对。'],
    ]],
    ['words', [
      ['The poster is missing the meeting time. Please **add** it before printing.', ['删掉', '核实', '补上', '记住'], 2, '海报缺少时间，打印前要把时间补上。'],
      ['The number of visitors **dropped** when the rain got heavier.', ['增加了', '下降了', '掉在地上', '排成队'], 1, '主语是人数，dropped 表示人数下降。'],
      ['The club will **run** a free class in May to teach people how to fix small bikes.', ['奔跑', '驾驶', '关停', '开办'], 3, 'run 的对象是 a free class，在这里表示开办课程。'],
      ['The stone floor gets **slippery** after rain, so walk slowly.', ['湿滑的', '坚硬的', '平整的', '明亮的'], 0, '雨后需要慢走，说明地面湿滑。'],
      ['The coach spoke to each player **in turn**, beginning with the youngest.', ['同时', '依次', '意外地', '公开地'], 1, '逐个谈话，从最年轻的人开始，说明是依次进行。'],
      ['We used a folded towel to **protect** the glass jar in the box.', ['清空', '装满', '保护', '搬运'], 2, '折起的毛巾隔开玻璃罐，起保护作用。'],
      ['The shop is out of large notebooks, but small ones are still **available**.', ['免费的', '特制的', '用坏的', '能买到的'], 3, 'but 对比大号没货和小号有货，后者仍能买到。'],
      ['Her plan sounded **practical** because we already had all the tools it needed.', ['可行的', '复杂的', '昂贵的', '奇怪的'], 0, '所需工具已齐，说明方案能实际执行。'],
      ['The two teams will **share** one computer to finish the report.', ['保管', '共用', '修理', '更换'], 1, '两队只有一台电脑，用 share 表示共用。'],
      ['Please **point out** any steps in the guide that are hard to follow.', ['猜测', '跳过', '指出', '取消'], 2, '请告诉对方哪些步骤难懂，point out 表示指出。'],
    ]],
    ['cloze', [
      [null, ['collected', 'printed', 'washed', 'ordered'], 0, '同学从各处收集种子，后面再把它们装入纸袋。'],
      [null, ['directions', 'pictures', 'labels', 'tickets'], 2, '下文说包装上的名字没写清，需要做的是标签。'],
      [null, ['though', 'unless', 'because', 'before'], 0, '种子虽然已经装好，包装却缺识别信息，用 though 表示让步。'],
      [null, ['cancel', 'separate', 'return', 'fold'], 1, '先把不同的种子分开，后文才能给每一类制作信息。'],
      [null, ['price', 'height', 'shape', 'name'], 3, '后文说明要让别人知道种的是哪种植物，最直接的信息是名称。'],
      [null, ['how', 'who', 'what', 'why'], 0, 'how deep 意为多深，问播种深度。'],
      [null, ['Instead', 'Therefore', 'Otherwise', 'However'], 3, '写了播种说明，却发现有些图太小，前后转折。'],
      [null, ['read', 'grow', 'sell', 'mix'], 0, '图片里的字和符号太小，导致难以看清。'],
      [null, ['guessed', 'refused', 'offered', 'failed'], 2, '同学主动提出把图画大，offered to do 表示主动提出。'],
      [null, ['reply', 'test', 'price', 'trip'], 1, '让没参加准备的人试用这套说明，相当于做一次测试。'],
      [null, ['at once', 'once more', 'for sale', 'on time'], 0, '新图一看就懂，at once 表示马上。'],
      [null, ['if', 'but', 'or', 'so'], 3, '看懂包装后，就能选到真正想种的种子，so 表结果。'],
      [null, ['forgot', 'shouted', 'returned', 'noticed'], 3, '班级注意到使用前后的区别，后文说明了观察结果。'],
      [null, ['plain', 'clear', 'warm', 'soft'], 1, '种子本身没有变，使用说明变得清楚。'],
      [null, ['keep', 'show', 'hide', 'throw'], 0, 'keep one packet 表示留一个样品给下一年参考。'],
    ], `
Before the spring fair, our class [1] seeds to exchange with other classes. We put the seeds into paper packets, but we did not make good [2]. At a trial table, visitors could not tell the packets apart, [3] the seeds were ready to take home.

Our first step was to [4] the different kinds of seeds. Then we wrote the [5] of each plant on its packet. We added short notes showing [6] deep to put the seeds in the soil. [7], when two students tried the notes, they found that some of the pictures were too small to [8]. Mai [9] to draw them again in a larger size.

Before the fair, we did one last [10]. We invited two students who had not helped with the packets. They understood the larger pictures [11], [12] they could choose seeds for the plants they actually wanted to grow.

At the fair, we [13] a difference. Fewer people asked what was inside the packets. The seeds were the same, but the new notes were [14]. When the fair ended, we decided to [15] one packet as an example for next year’s group.`],
    ['reading-1', [
      ['What had become a problem after heavy rain?', ['The bike racks were too full.', 'Water collected outside the side door.', 'The school ran out of drinking water.', 'The hall floor became too hot.'], 1, '首段说屋顶水流到侧门外，形成难以绕过的大水坑。'],
      ['What part of the garden slows down water from the roof?', ['A row of painted signs.', 'A new roof over the hall.', 'The main road outside the school.', 'A shallow area with soil and plants.'], 3, '第二段说水流进低处，土和植物共同放慢水流。'],
      ['Why did the students want water to stay away from the wall?', ['They wanted to protect the building.', 'They were drawing pictures there.', 'They needed a place to park buses.', 'They planned to fill the hall with water.'], 0, '第二段给出改花园位置的目的，避免水积聚在建筑墙边。'],
      ['What do students do after a storm?', ['Take all the plants out.', 'Measure the height of the roof.', 'Record how quickly the water disappears.', 'Move the wall a little farther back.'], 2, '第三段说学生记水何时消失，并对照降雨量。'],
      ['Which statement matches the final paragraph?', ['The garden has solved every flooding problem.', 'The school will check the idea across different seasons.', 'All schools are advised to use the same plants.', 'The garden can work anywhere without changes.'], 1, '最后说明要积累不同季节的记录，才考虑推广。'],
    ], `
After heavy rain, water from the roof of East Hill School often made a large puddle outside a side door. Students had trouble reaching the door without getting their shoes wet. A science teacher suggested making a small rain garden instead of covering the area with more concrete.

A rain garden is a shallow area filled with soil and plants. Water from the roof flows into it and moves slowly through the soil. The first plan put the garden next to the wall. Students later moved it farther away because they did not want water to collect beside the building.

The class now keeps a record after each storm. They note how much rain fell and how long it took for the water to disappear from the garden. In light rain the water usually disappears quickly. In one heavy storm, some water still reached the path, but the puddle outside the door was smaller.

The students have seen a useful change at their school. They want records from different seasons before saying the same design would work at other schools. The next step is to find out which plants can survive both wet weeks and long dry periods.`],
    ['reading-2', [
      ['Why did the museum add “look cards”?', ['To help family groups look more closely at objects.', 'To replace all the museum’s objects.', 'To sell longer guidebooks.', 'To teach people how to lock the doors.'], 0, '首段说明成人读介绍时孩子很快走开，卡片让一家人一起观察。'],
      ['What did visitors do with the card near the lamp?', ['Buy a lamp to take home.', 'Draw a picture of a boat.', 'Look for marks on its handle.', 'Ask staff to turn off the lights.'], 2, '第二段卡片提示观察提灯把手上的使用痕迹。'],
      ['Why are the answers printed on a separate sheet?', ['The museum could not find enough cards.', 'Families can make their own guesses first.', 'Visitors have to return the cards unopened.', 'The answers change every day.'], 1, '分开放说明能先自己想，再核对。'],
      ['What change did staff notice after a month?', ['The museum closed one of its rooms.', 'Families stopped reading altogether.', 'Most visitors bought the objects.', 'More adults and children talked about what they saw.'], 3, '第三段说谈话变多，家长和孩子会互相指出细节。'],
      ['What is the best title for the text?', ['Small Cards, Closer Looking', 'Buying Your First Old Lamp', 'The Museum Without Labels', 'How to Write a Long Guide'], 0, '中心是小卡片怎样帮助家庭更细致地观察文物。'],
    ], `
A small town museum noticed that family groups often spent little time together in front of an object. Adults read the labels while children moved on to the next room. To help them notice the same details, staff put short “look cards” beside a few objects.

Each card asks one question that visitors can answer by looking. Beside an old lamp, the card asks people to look for marks on the handle. The marks show where the owner held it most often. Other cards ask visitors to find a repeated pattern or work out which part of an object has been repaired. Answers are printed on a separate sheet so families can make their own guesses first.

After a month, staff heard more conversations in the rooms. Adults sometimes asked children what they had noticed, and children pointed out details the adults had missed. Not every visitor used the cards, but some families came back and asked which objects had new questions.

The museum still uses its regular labels. Staff plan to add just a few more cards, because they want each question to lead to a careful look. An interesting question, they say, is worth more than a large pile of cards.`],
    ['insert', [
      [null, null, 2, '首段提出不熟悉的车站容易迷路，接「出发前做点准备」。'],
      [null, null, 0, '下句 This note 指手机里记下的车次和时间。'],
      [null, null, 3, '后文 For example 给出找错乘车区域的例子，需要先确认正确的上车区域。'],
      [null, null, 1, '后文 a person wearing a station badge 明确了向谁求助。'],
      [null, null, 4, '下句列出座位号等方便一眼找到的内容，说明上车前再核对车票。'],
    ], `
A large train station can feel confusing when you are there for the first time. Signs point in several directions, and it may take longer than you expect to find your train. [1]

Before leaving home, check the departure on your ticket. [2] This note will help if the ticket screen closes or you need to tell someone which train you are taking.

When you reach the station, look up the departure on the main board. [3] For example, one station may have two areas marked north and south, and each may have a Gate 5.

If a sign is hard to understand, stop and ask for help. [4] A person wearing a station badge can check your ticket and tell you where to go.

Stay near the right gate until boarding begins. [5] Find the train number, carriage and seat so that you can move through the line smoothly when it is your turn.`,
      ['Save the train number and time on your phone.', 'Ask a member of staff if you are still unsure.',
       'A little preparation before the journey can help.', 'Check which boarding area the gate belongs to.',
       'Take one more look at the details on your ticket.']],
    ['grammar', [
      [null, ['started'], 'Last winter 提示过去，用 started。'],
      [null, ['an'], 'object 以元音音素开头，第一次提到用 an。'],
      [null, ['shelves'], 'two 后用复数，shelf 的复数是 shelves。'],
      [null, ['to describe'], 'ask somebody to do something 表示请某人做某事。'],
      [null, ['quickly'], '修饰 find，用副词 quickly。'],
      [null, ['who', 'that'], '指先行词 students，并在从句中作主语。'],
      [null, ['its'], '指物品本身的标签，label 前用形容词性物主代词 its。'],
      [null, ['when', 'after'], '这件物品领走时或领走后，负责的同学更新记录。'],
      [null, ['for'], 'for a month 表示一段时长。'],
      [null, ['finding'], 'have trouble doing something 表示做某事有困难。'],
    ], `
Last winter, our school [1] (start) a lost-property corner. If a student found [2] object in the playground, there was finally a place to take it. The school cleared two [3] (shelf) near the office.

At first, people had trouble telling similar bags apart. The teacher asked volunteers [4] (describe) each item on a small card. With a date and a short description, they could find things more [5] (quick). Students [6] came to look for something could check the list without opening every bag.

One day, a girl found a water bottle with [7] (it) label still attached. A volunteer updated the list [8] the owner picked it up, so the record showed that it had been returned. We have kept the new system in use [9] a month. Fewer students now have trouble [10] (find) their things.`],
    ['sentence', [
      ['Do you know ____?（我们在哪里买车票）', ['where we buy tickets', 'where we can buy tickets', 'where we should buy tickets', 'where we can get tickets'], 'where we can buy tickets。where 后先写主语 we。'],
      ['A new sign ____ near the side door yesterday.（被挂起来了）', ['was put up', 'was hung up', 'was hung'], 'was put up。yesterday 提示过去，物作主语用被动。'],
      ['My brother ____ dinner when I got home.（正在准备晚饭）', ['was preparing', 'was cooking', 'was making', 'was getting ready for'], 'was preparing。dinner 已印在空格后，空里写过去进行时的动词形式。'],
      ['Please ____ before you lock the door.（关掉所有的灯）', ['turn off all the lights', 'switch off all the lights', 'turn all the lights off', 'switch all the lights off'], 'turn off all the lights。turn off 是关掉。'],
      ['She is ____ to join the school team.（足够自信）', ['confident enough'], 'confident enough。enough 放在形容词后。'],
    ]],
    ['email', [[
      '假设你是 Tao。交换生 Sam 想在校内举办一次小组活动。给 Sam 写一封英语邮件，推荐一个适合的时间和地点，介绍可以安排的一项活动，并解释推荐理由。正文约 40 个英语单词。',
      'Dear Sam,\n\nI suggest meeting in the art room after school on Tuesday. Your group can make a poster about life at our school. The room has large tables and enough paper, so everyone can draw or write at the same time.\n\nBest wishes,\nTao',
      ['内容（4 分）：给出时间、地点、活动和理由。', '语言（4 分）：建议表达清楚，检查时态、拼写和衔接。', '格式（2 分）：有称呼和署名，正文约 40 词。'],
    ]]],
  ]);

  const fourth = makePaper(4, [
    ['dialogue', [
      ['—Is the art room free now?\n—____ The class there has just ended.', ['Yes, you can use it.', 'No, I didn’t draw it.', 'Turn to page two.', 'That was yesterday.'], 0, '教室里的课刚结束，可以使用该教室。'],
      ['—Could I leave my bag here for a minute?\n—____ Just put it under the chair.', ['I don’t have a bag.', 'Yes, that’s fine.', 'It’s ten dollars.', 'This is for you.'], 1, '后句告诉对方包可以放在哪里，前句应答应请求。'],
      ['—I can’t find the file we worked on.\n—____ I saved a copy on my laptop.', ['I’m glad you liked it.', 'That’s the wrong size.', 'Don’t worry.', 'So do I.'], 2, '说话人有副本，用 Don’t worry 安慰对方。'],
      ['—Would two o’clock suit you?\n—____ I’ll still be on the bus then.', ['I’m afraid it’s too early.', 'That would be perfect.', 'There are two of them.', 'I took the bus.'], 0, '两点时仍在车上，委婉说明时间太早。'],
      ['—We’re opening the club room this afternoon. Would you like to come?\n—____ What time shall I arrive?', ['It’s not for me.', 'I’d love to.', 'You can keep it.', 'Not that one.'], 1, '对方问几点到，说明接受邀请。'],
    ]],
    ['words', [
      ['The road is **blocked** by a fallen tree, so drivers have to take another route.', ['有标记的', '被检查的', '被堵住的', '被拓宽的'], 2, '树倒在路上，车辆需要绕行，说明路被堵住。'],
      ['The small fan can **reduce** the heat around your desk.', ['产生', '减轻', '测量', '保存'], 1, '风扇可以减轻桌边的热感。'],
      ['The school **provides** tools for this course, so you do not need to buy them.', ['提供', '归还', '收费', '查找'], 0, '学生不用买工具，因为学校提供。'],
      ['This table is **steady** now; it no longer moves when you write on it.', ['崭新的', '光滑的', '轻便的', '稳固的'], 3, '写字时桌子已不再晃，说明稳固。'],
      ['The message **applies to** all visitors, including those who have booked online.', ['适用于', '来自于', '回复给', '脱离'], 0, 'including 说明这条通知的适用范围。'],
      ['Please **sort** the photos by date before you put them into the folder.', ['上传', '分类整理', '拍摄', '复印'], 1, 'by date 表示整理照片时按日期分类。'],
      ['There was a **noticeable** difference after we turned on the extra light.', ['很轻的', '末尾的', '难以改善的', '明显的'], 3, '开灯后差别能够明显察觉，noticeable 是明显的。'],
      ['To **avoid** the stairs, follow the path behind the building.', ['打扫', '走向', '避开', '拆除'], 2, '从楼后走另一条路，目的是避开楼梯。'],
      ['The cupboard is **nearly** empty. Only one cup is left.', ['几乎', '起初', '恰好', '偶尔'], 0, '只剩一只杯子，所以柜子几乎空了。'],
      ['We **went over** the safety rules once more before the trip.', ['越过', '忽略', '取消', '复习'], 3, '规则在出发前又过了一遍，go over 在这里表示复习。'],
    ]],
    ['cloze', [
      [null, ['began', 'marked', 'crossed', 'joined'], 1, '班级先用纸箭头给路线做标记。'],
      [null, ['clear', 'cheap', 'short', 'busy'], 0, '站在纸标旁看觉得很清楚，后文用实走检验。'],
      [null, ['unless', 'since', 'because', 'while'], 3, 'while 这里连接边走边找标记的两个行为。'],
      [null, ['opened', 'missed', 'washed', 'followed'], 1, '回头才看见箭头，说明第一次走过时没注意到。'],
      [null, ['below', 'between', 'behind', 'across'], 2, '牌子被树从来路方向挡住，转身才看到。'],
      [null, ['read', 'attract', 'remove', 'repeat'], 2, 'remove the old sign 后面才有换位置的动作。'],
      [null, ['where', 'who', 'how', 'why'], 0, 'where 引出把下一个标记放在哪儿。'],
      [null, ['test', 'rule', 'message', 'prize'], 0, '他们请第一次走路线的人试走，是一次测试。'],
      [null, ['then', 'yet', 'also', 'instead'], 2, '试走者既看见新箭头，又指出字应更大。'],
      [null, ['seldom', 'easily', 'together', 'neatly'], 1, '大一点的字让人从较远处更容易读到。'],
      [null, ['similar', 'spare', 'missing', 'final'], 3, '根据反馈改好之后做出最终版标记。'],
      [null, ['at', 'under', 'with', 'without'], 3, 'without asking 表示无须问路就找到了终点。'],
      [null, ['refused', 'learnt', 'feared', 'doubted'], 1, 'learnt 后面的完整句子是这次学到的经验。'],
      [null, ['think', 'hear', 'see', 'stay'], 2, '标牌要从走路人的角度实际能看见。'],
      [null, ['carry', 'lift', 'draw', 'keep'], 3, '保留路线记录，明年活动可以参考。'],
    ], `
Our class helped plan a short walk for a community festival. We [1] the route with paper arrows. When we stood beside each arrow, everything looked [2]. Our teacher asked us to walk the route [3] looking for the signs as a first-time visitor would.

At the first turn, we [4] an arrow. We could see it only when we looked back. From the direction we were walking, the sign was [5] a tree. We decided to [6] the old sign and walked back to see [7] we could put its replacement.

For a second [8], we asked someone who had never followed the route before. He saw the new arrow straight away. He [9] suggested making the words bigger so people could read them more [10] from a distance. We changed the design and made the [11] signs.

On the festival day, a family found the end of the walk [12] asking for directions. We [13] that it is easy to believe a sign works when you already know where it is. The important question is what a visitor can [14]. We decided to [15] a record of the route for next year’s group.`],
    ['reading-1', [
      ['Who is the open studio mainly for?', ['People waiting for a bus.', 'People interested in trying simple pottery.', 'People buying a new phone.', 'People bringing things for repair.'], 1, '首段面向想尝试做陶器的人。'],
      ['When must visitors come to collect their work?', ['Later on the same afternoon.', 'Before the first visit.', 'On the following Saturday.', 'At lunchtime the next day.'], 2, '第二段明确作品处理后下周六取。'],
      ['Why are people asked to report access needs when booking?', ['So staff can plan a suitable workspace.', 'So they can be sent extra clay.', 'So they can choose a different course price.', 'So the visit can last three hours.'], 0, '第三段说工作人员可按情况安排合适的工作位。'],
      ['What can visitors do without a working place?', ['Use the kiln by themselves.', 'Make a large clay bowl.', 'Bring extra guests to a reserved table.', 'Watch a short demonstration.'], 3, '工作位有限，没预约到仍可观看演示。'],
      ['What is the main purpose of this text?', ['To explain where clay comes from.', 'To give information about a studio event.', 'To sell a collection of cups.', 'To describe the history of a building.'], 1, '文章给出活动、领作品和预约方式，目的是介绍工作室开放活动。'],
    ], `
Saturday Open Studio

The Oak Street Arts Center will open its pottery room this Saturday. If you have never worked with clay, you can book a place to make a small flat dish. A tutor will show you how to shape the clay, then let you choose a simple pattern. The first group starts at ten and the second at eleven.

Clay and tools are provided. Bring an old shirt to wear over your clothes. The dishes need to dry before the studio can prepare them for use. You can collect your finished dish from the front desk the following Saturday. Write your booking number on the card next to your dish so staff can find it later.

There are eight working places in each group. If you need to work at a lower table or use a seat with a back, tell the staff when you book. They will arrange a place that suits you. Visitors without a working place are welcome to watch a short demonstration at noon. Find the booking form on the center’s notice board.`],
    ['reading-2', [
      ['What did the students want to measure?', ['The cost of buying small bowls.', 'The number of people waiting for lunch.', 'The amount of soup left in bowls.', 'The temperature of the kitchen.'], 2, '第一段提出比较不同份量时剩下多少汤。'],
      ['What did servers do in the second week?', ['They stopped offering more soup.', 'They served a smaller amount at first.', 'They changed the soup every day.', 'They used only large bowls.'], 1, '第二周先盛少量，想再添的仍可添。'],
      ['Which result was recorded?', ['The leftovers weighed less in the second week.', 'Nobody asked for more soup.', 'The bowls became more expensive.', 'Fewer people were allowed to have lunch.'], 0, '第二周称出的剩汤重量下降。'],
      ['Why did the students count the number of meals?', ['To raise the price of lunch.', 'To check whether bowls were clean.', 'To find who took extra soup.', 'To compare leftovers in weeks with similar attendance.'], 3, '两周人数差不多，有助于排除就餐人少造成的下降。'],
      ['What does the final paragraph suggest?', ['The experiment should be checked with other foods.', 'The kitchen should stop making soup.', 'All portions must be small from now on.', 'The same result is certain in every school.'], 0, '结尾建议用另一道菜复测，说明结论有范围。'],
    ], `
Students at Mill Road School noticed that a lot of soup went back to the kitchen untouched. Their class decided to check whether the size of the first serving made a difference. They planned to weigh the soup left in the bowls after lunch.

For one week, the servers filled each bowl as usual. The next week, they gave everyone a smaller first serving. Any student who wanted more could come back for a second serving at no extra cost. The soup was kept the same for both weeks.

At the end of each lunch, student helpers counted the meals and weighed the leftovers. The two weeks had nearly the same number of meals. However, the leftover soup weighed much less during the second week. Some students came back for more, while others found that the smaller serving was enough.

The helpers suggested trying the idea with a different dish before changing the serving size for everything. They also told the kitchen to keep offering more to anyone who wanted it. Their aim was to waste less food and still let everyone have enough to eat.`],
    ['insert', [
      [null, null, 3, '首段提出看标签查是否适用，下文分别说明该看哪些信息。'],
      [null, null, 4, '下文 soap and cleaning liquid 是不能只凭外观区分的例子。'],
      [null, null, 0, '后文说 same unit，指把价格换算到同一计价单位。'],
      [null, null, 2, '下句两种处理分别是标签写重用或写请用新容器。'],
      [null, null, 1, '下句 the receipt 指打印的小票，最后比对付款记录。'],
    ], `
Some shops now have refill stations. You can bring a container instead of buying a new one each time. Before you fill it, read the label on the station. [1]

First, check the name and the purpose of the product. [2] For instance, hand soap and cleaning liquid can have the same color, although they are used for different things.

Next, look at the price and the amount it covers. [3] If both prices are written in the same unit, you can make a fair comparison.

Then check the rule about containers. [4] One station may accept a clean used bottle, while another may ask you to take a new empty one from a shelf.

Finally, check the amount before you pay. [5] The receipt should show what you bought and the correct amount of product.`,
      ['Work out the price per liter before comparing two products.', 'Then compare it with the receipt.',
       'Shops can set different rules for what you can bring.', 'It answers several questions that matter before you buy.',
       'The appearance of the liquid does not tell you what it is for.']],
    ['grammar', [
      [null, ['made'], 'Last October 提示过去，make 的过去式为 made。'],
      [null, ['a'], 'chart 以辅音音素起始，首次提到用 a。'],
      [null, ['measurements'], 'several 后接名词复数。'],
      [null, ['clearly'], '修饰 write，用副词 clearly。'],
      [null, ['who', 'that'], '先行词是两位同学，从句缺主语。'],
      [null, ['to collect'], 'tell somebody to do something 表示告诉某人去做某事。'],
      [null, ['for', 'over'], 'for two days 表示持续两天。'],
      [null, ['but', 'yet'], '白天暖和、晚上降温，前后转折。'],
      [null, ['writing'], 'finish doing 表示完成一个动作。'],
      [null, ['their'], 'pictures 前需形容词性物主代词 their。'],
    ], `
Last October, a group in our class [1] (make) a short weather report for the local radio station. At the start, our teacher gave us [2] chart with space for several [3] (measurement). We had to write the figures [4] (clear) so the rest of the class could read them.

Two students [5] lived near the school checked the thermometer before class. The teacher told them [6] (collect) the data at the same time every morning. No rain fell [7] two days. The days were warm, [8] the temperature went down sharply each evening.

After we finished [9] (write) the report, we asked the two students to share [10] (they) pictures of the school yard. The pictures helped the rest of us see what the weather had actually been like.`],
    ['sentence', [
      ['The new chairs ____ yesterday.（被送到了办公室）', ['were delivered to the office', 'were sent to the office', 'were taken to the office', 'were brought to the office'], 'were delivered to the office。过去时间和复数主语对应 were + 过去分词。'],
      ['This path is ____ for two people to walk side by side.（足够宽）', ['wide enough'], 'wide enough。enough 放在形容词之后。'],
      ['Please tell us ____ before Friday.（我们需要准备什么）', ['what we need to prepare', 'what we should prepare', 'what we have to prepare'], 'what we need to prepare。what 后用陈述语序。'],
      ['The plan will work ____ the instructions.（只要你遵守）', ['as long as you follow', 'so long as you follow', 'if you follow'], 'as long as you follow。空格右边已有 instructions。'],
      ['My cousin is used to ____ early.（早起）', ['getting up', 'rising', 'waking up'], 'getting up。be used to 表示习惯于，to 后接动词 -ing。'],
    ]],
    ['email', [[
      '假设你是 Yan。朋友 Kim 想改善课后学习习惯。给 Kim 写一封英语邮件，推荐一种具体做法，说明什么时候做、怎样做以及它有什么帮助。正文约 40 个英语单词。',
      'Dear Kim,\n\nI suggest spending ten minutes on your notes after dinner. Choose two ideas from class and explain them in your own words. Mark anything you cannot explain and ask about it the next day. This makes it easier to remember what matters.\n\nBest wishes,\nYan',
      ['内容（4 分）：说明推荐的做法、时间、步骤和好处。', '语言（4 分）：句子意思清楚，步骤之间连得上。', '格式（2 分）：称呼、正文和署名齐全，正文约 40 词。'],
    ]]],
  ]);

  const fifth = makePaper(5, [
    ['dialogue', [
      ['—Could you show me how to save this file?\n—____ Then choose the folder you want.', ['Select “Save” first.', 'That box is full.', 'I’ll be there tomorrow.', 'It looks taller.'], 0, '后句 Then 继续说保存步骤，先选 Save。'],
      ['—I’ve brought the tickets. Do we need anything else?\n—____ The notice says everyone must show an ID card.', ['Nothing at all.', 'Yes, bring your ID card.', 'One ticket is enough.', 'You can sit here.'], 1, '通知还要求出示证件，因此回答要带证件。'],
      ['—Could you help us at the desk until three?\n—____ I need to leave at two.', ['Three is fine.', 'It’s on the table.', 'I’m afraid I can’t stay that long.', 'No one is there.'], 2, '两点要离开，无法帮到三点。'],
      ['—Does this bus stop near the sports center?\n—____ The driver can tell you where to get off.', ['Yes, it does.', 'I bought two yesterday.', 'You’re welcome.', 'It’s too heavy.'], 0, '可以坐这趟车，请司机提醒下车的地点。'],
      ['—What do you think of this practice plan?\n—____ We can try it for a week and see what happens.', ['It’s written on paper.', 'There are seven days.', 'I forgot the date.', 'It sounds worth trying.'], 3, '后句愿意试一周，前句说明这份计划值得一试。'],
    ]],
    ['words', [
      ['Put the wet umbrellas in the stand to keep the **entrance** to the room clear.', ['窗户', '入口', '讲台', '屋顶'], 1, '清空的是进入房间的位置，entrance 表示入口。'],
      ['Mei had to **adjust** the chair before she could reach the controls.', ['抬起', '擦干', '调整', '换掉'], 2, '为了够到控制装置，需要调整椅子的位置。'],
      ['The results were **reliable** because three groups got similar numbers.', ['可靠的', '少见的', '过时的', '有趣的'], 0, '三个组结果接近，说明结果可信。'],
      ['Can you **spot** the mistake in this list of dates?', ['复制', '修理', '消除', '发现'], 3, 'spot 在这里的对象是错误，表示发现。'],
      ['The shop gives a **discount** to anyone who brings a used container.', ['押金', '折扣', '发票', '奖品'], 1, '自带用过的容器可少付钱，discount 表示折扣。'],
      ['We can save time by doing the two jobs **at the same time**.', ['逐步', '按时', '同时', '再次'], 2, '两个任务一起做才能节约时间，这里是同时。'],
      ['The new road will **connect** the village to the nearest town.', ['阻挡', '连接', '探访', '保护'], 1, '道路把村庄和城镇连起来。'],
      ['Please read the **instructions** before you try the machine.', ['通知日期', '参考答案', '维修工人', '操作说明'], 3, '试用机器前应阅读操作说明。'],
      ['He **ignored** the warning and went out without a coat.', ['忽视了', '听从了', '重复了', '补写了'], 0, '尽管收到提醒仍没穿外套，说明忽视了。'],
      ['The room can get **crowded** just before an event begins.', ['干燥的', '便宜的', '拥挤的', '明亮的'], 2, '活动开始前人多，crowded 是拥挤的。'],
    ]],
    ['cloze', [
      [null, ['collected', 'dropped', 'sold', 'locked'], 0, '规则是从回收箱里取材料，动作是收集。'],
      [null, ['smallest', 'tallest', 'oldest', 'lightest'], 1, '比的是纸塔的高度，tallest 表示最高。'],
      [null, ['especially', 'suddenly', 'exactly', 'quickly'], 3, '大家急着堆高，开始得很快。'],
      [null, ['but', 'or', 'because', 'until'], 0, '前句写看起来很高，后句却开始倾斜，表示转折。'],
      [null, ['bright', 'weak', 'wet', 'clean'], 1, '塔站不稳，底部不能支撑它，weak 表示不够牢固。'],
      [null, ['returned', 'waited', 'suggested', 'refused'], 2, 'suggested folding 表示提议把纸板折起来。'],
      [null, ['thin', 'short', 'dark', 'strong'], 3, '折叠后的底座更结实，可以支撑小塔。'],
      [null, ['less', 'more', 'some', 'enough'], 0, '新塔矮一点，但晃动更少。'],
      [null, ['across', 'below', 'on', 'behind'], 2, '把重物放在顶部，on top 是位置。'],
      [null, ['stood', 'rolled', 'broke', 'turned'], 0, '十秒后还立着，说明没有倒。'],
      [null, ['shared', 'hid', 'forgot', 'bought'], 0, '给别的组看做法，是分享。'],
      [null, ['advice', 'practice', 'patience', 'attention'], 3, 'pay attention to 表示关注，其他组开始关注底部。'],
      [null, ['manage', 'fail', 'lose', 'refuse'], 0, '虽然最终没赢，但成功做成了稳固的塔，manage to do 表示设法做到。'],
      [null, ['fair', 'written', 'useful', 'cheap'], 2, '给将来的工作提供了可再用的经验。'],
      [null, ['sketch', 'support', 'replace', 'follow'], 3, '遇到新任务打算沿用这套办法，follow the same method。'],
    ], `
In our design class, we [1] pieces of cardboard from a recycling box. Each team had the same amount of material. The challenge was simple: build the [2] tower that could stand for ten seconds with a small weight on it.

Our team started [3] because we wanted to reach a great height. The tower looked tall, [4] it leaned as soon as we let go. The base was too [5] to support the top. Our youngest teammate [6] folding the cardboard at the bottom instead of adding more pieces at the top.

After a few tries, the folded base was [7] enough to hold a shorter tower. This tower shook [8] when we touched the table. We put the small weight [9] top and waited. The tower [10] for the full ten seconds. We then [11] our method with a nearby team.

Other teams began to pay more [12] to their bases too. We did not win the final challenge, but we did [13] to build a tower that stood. For us, that was a [14] lesson. The next time we face a problem like this, we will [15] the same method: test the base before building higher.`],
    ['reading-1', [
      ['Why did the center start a quiet hour?', ['To give more visitors a calmer time to read.', 'To teach young children how to sing.', 'To sell books before the center closed.', 'To prepare the building for a film.'], 0, '首段说明有人受不了普通时段的噪声，设安静时段方便阅读。'],
      ['What can visitors do during the quiet hour?', ['Take a group tour of the center.', 'Use the room for a party.', 'Read books or talk softly to staff.', 'Play recorded music at the desk.'], 2, '第二段允许阅读，或低声向工作人员求助。'],
      ['Why does the center show the time on a schedule?', ['To ask visitors to stay all day.', 'To make it easier for people to plan a visit.', 'To let staff sell tickets in the afternoon.', 'To change the opening time every week.'], 1, '固定时间加提前公示，方便按计划来。'],
      ['What happens to other activities during that hour?', ['They are all stopped.', 'They move to the following week.', 'They use the reading room.', 'Some take place in another room.'], 3, '第三段说团体活动移到另一间房，照常进行。'],
      ['Where would the text most likely appear?', ['On a community center’s information page.', 'In a sports team’s diary.', 'On the back of a bus ticket.', 'In a science textbook.'], 0, '列出开放安排、规则和适合谁，属于社区中心通知。'],
    ], `
Quiet Hour at Lake Road Center

The reading room at Lake Road Center is often busy on Saturday mornings. Some visitors told us it was difficult for them to enjoy a book when the room was noisy. We will now offer a quieter time from nine to ten every Saturday.

During this hour, visitors can read, work at a table or ask staff for help in a low voice. Phones should be silent. We will keep the lights at their usual level and put signs by the door, so visitors can see what to expect. The time will be printed on the monthly schedule to help families plan their visit.

Group activities will still take place on Saturdays. They will use the room across the hall until the quiet hour ends. At ten, the reading room will return to its usual schedule. Anyone who prefers the regular atmosphere can arrive then.

There is no charge and you do not need to book. Ask at the main desk if you want to know more before you come.`],
    ['reading-2', [
      ['What question did the class test?', ['Which color of cloth costs the least.', 'Whether a cloth dries faster when it is spread out.', 'How much water a cup can hold.', 'Which room in the school has the most shelves.'], 1, '首段比较湿布摊开还是折叠时干得更快。'],
      ['Why did the students use pieces of cloth of the same size?', ['To make the test fairer.', 'To stop them from drying.', 'To practice cutting with a ruler.', 'To make the cloths easier to sell.'], 0, '第二段保持大小、用水量等相同，控制变量。'],
      ['How did the students tell that a cloth had become drier?', ['Its color had become darker.', 'It covered a larger area.', 'Its weight had gone down.', 'Its shelf had moved.'], 2, '第三段说明蒸发的水使布变轻。'],
      ['Why did they switch the positions of the two cloths the second time?', ['One shelf had been taken away.', 'They wanted to use a new kind of cloth.', 'They wanted each group to draw a map.', 'They wanted to check whether position changed the result.'], 3, '换位置是为了检验书架位置会不会导致差异。'],
      ['What is a suitable title for the text?', ['Two Ways to Dry a Cloth', 'Buying a New Kitchen Shelf', 'How to Fix a Broken Ruler', 'A Lesson about Drawing Colors'], 0, '全文比较湿布摊开与折叠两种晾法。'],
    ], `
At home, people sometimes leave a wet cloth folded on a shelf, while others spread it out. Our class wanted to know which method helped the cloth dry faster. We planned a short test using two pieces cut from the same old towel.

The pieces were the same size. We put the same amount of water on each piece and weighed them before placing them in the same room. One piece lay flat on a shelf. The other was folded in half on a shelf next to it.

We weighed both pieces again every ten minutes. The flat piece became lighter more quickly. A smaller weight meant that more water had left the cloth as it dried. To check whether one shelf was simply in a better spot, we repeated the test and switched the two positions. The flat piece still dried faster.

This test used only one kind of cloth in one room. We have not tested thicker material or a room with a strong fan. Still, the result helped explain why spreading a wet cloth out often works well at home.`],
    ['insert', [
      [null, null, 2, '这一空在首段承上启下，引出记录共享用品的办法。'],
      [null, null, 0, '下句说 choose a time 和 return it 需要知道什么时候回来。'],
      [null, null, 4, '下文 so people know which item you took 说明记清用品编号。'],
      [null, null, 1, '下句说下一位可以决定等还是改用别的物品，需要先收到新的归还时间。'],
      [null, null, 3, '下句 another group can see it is free，接标记已归还。'],
    ], `
A class often has a few things that everyone can borrow. When the items are useful, several people may need them on the same day. [1]

Before taking an item, check the schedule. [2] Choose a time that leaves you enough room to finish and return it before the next person needs it.

Write your name in the record and add the number on the item. [3] This is especially important if the class has two items that look the same.

If you learn that you will be late, tell the next person as early as possible. [4] They can then decide whether to wait or find something else to use.

When you bring the item back, put it in its usual place. [5] Another group can then see that it is free without asking you.`,
      ['Find out when it needs to be back.', 'Give a new return time if you can.',
       'A simple record can keep the borrowing fair.', 'Mark it as returned in the same record.',
       'The number tells people which one you took.']],
    ['grammar', [
      [null, ['began'], 'Last September 提示过去，begin 的过去式是 began。'],
      [null, ['a'], 'pair 以辅音音素开头，a pair of 表示一副。'],
      [null, ['headphones'], 'two pairs of 后用 headphones。'],
      [null, ['to speak'], 'advise somebody to do something 表示建议某人做某事。'],
      [null, ['slowly'], '修饰 speak，用副词 slowly。'],
      [null, ['who', 'that'], '修饰人且在从句中作主语，用 who 或 that。'],
      [null, ['him'], 'listen to 后接人称代词宾格 him。'],
      [null, ['because', 'as', 'since'], '后面解释重新录制的原因。'],
      [null, ['editing'], 'finish doing 表示做完某事。'],
      [null, ['on'], 'on Friday afternoon 表示在某个星期五下午。'],
    ], `
Last September, our class [1] (begin) producing short school news reports. There was [2] pair of speakers in the room, but we brought two pairs of [3] (headphone) so we could check our recordings without disturbing other classes.

Our teacher advised us [4] (speak) [5] (slow) for the first recording. The student [6] read the school news practised three times. We listened to [7] (he) from the other end of the room. He recorded one part again [8] a few words were hard to hear.

After we finished [9] (edit) the recording, we sent it to the teacher. The report was played for the whole school [10] Friday afternoon. Next time we hope to include an interview with one of the new students.`],
    ['sentence', [
      ['I found it ____ between the two documents.（很难区分）', ['hard to distinguish', 'difficult to distinguish', 'hard to tell the difference', 'difficult to tell the difference'], 'hard to distinguish。find it + 形容词 + to do 是常用结构。'],
      ['The students ____ when the coach arrived.（正在做热身）', ['were warming up', 'were doing warm-up exercises', 'were doing warm up exercises'], 'were warming up。过去进行时用 were + -ing。'],
      ['The room ____ our group next week.（将被借给）', ['will be lent to', 'is going to be lent to'], 'will be lent to。将来被动用 will be + 过去分词。'],
      ['Remember to check the schedule ____ home.（在你离家之前）', ['before you leave', 'before leaving'], 'before you leave。home 由题面提供。'],
      ['There were ____ chairs for our group to sit down.（足够的椅子）', ['enough'], 'enough chairs。enough 在名词前，空外已经给出 chairs。'],
    ]],
    ['email', [[
      '假设你是 Zhou。朋友 Nia 想参加学校的物品捐赠活动。写一封英语邮件告诉她可以带哪类物品，什么时候、交到哪里，并说明捐赠会带来什么帮助。正文约 40 个英语单词。',
      'Dear Nia,\n\nYou can bring clean winter clothes for our school donation day. Please leave them at the hall entrance before Friday afternoon. Our volunteer group will sort the clothes and send them to families nearby. Your donation can help someone stay warm.\n\nBest wishes,\nZhou',
      ['内容（4 分）：交代物品、时间、交付地点和捐赠用途。', '语言（4 分）：表达准确，行动和作用的关系清楚。', '格式（2 分）：有称呼和署名，正文约 40 词。'],
    ]]],
  ]);

  return [first, second, third, fourth, fifth];
})();
