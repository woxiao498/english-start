// 词目取自站内第 4–12 课及第 37–39 课的讲解；例句与题面另写，不作为教材对齐依据。
// options[0] 固定为正确答案；选项显示顺序由界面调整。
window.VOCAB_WORDS = Object.freeze([
  // 第四课：通知里的时间。
  {
    id: 'starts-at', lesson: 'notice-time', term: 'starts at', meaning: '在某个时刻开始',
    example: ['The show starts at 7 p.m.', '演出晚上七点开始。'],
    variants: [
      { lines: ['The film starts at 6:20.'], prompt: '6:20 是电影的什么时间？', options: ['开场时间', '散场时间'], glossary: [['film', '电影']] },
      { lines: ['Doors open at 8:00.', 'The sale starts at 8:30.'], prompt: '哪项说明符合这两行通知？', options: ['8:30 开始售卖', '8:00 开始售卖'], glossary: [['doors open', '开门'], ['sale', '售卖活动']] },
      { lines: ['Lunch starts at twelve.'], prompt: '这句话怎么理解？', options: ['十二点开始吃午饭', '十二点前要吃完午饭'], glossary: [['lunch', '午饭'], ['twelve', '十二']] },
    ],
  },
  {
    id: 'meeting', lesson: 'notice-time', term: 'meeting', meaning: '会议',
    example: ['Our meeting is in Room 12.', '我们的会议在 12 室开。'],
    variants: [
      { lines: ['The team has a meeting at 10:00.'], prompt: '这组人十点有什么安排？', options: ['开会', '训练'], glossary: [['team', '小组；队伍'], ['has', '有']] },
      { lines: ['Can I call you after the meeting?'], prompt: '对方说的是哪件事之后？', options: ['会议之后', '考试之后'], glossary: [['call you', '给你打电话'], ['after', '在……之后']] },
      { lines: ['There is a meeting with the teacher on Tuesday.'], prompt: '星期二和老师安排了什么？', options: ['开会', '上课'], glossary: [['there is', '有'], ['with the teacher', '和老师一起'], ['Tuesday', '星期二']] },
    ],
  },
  {
    id: 'am', lesson: 'notice-time', term: 'a.m.', meaning: '上午时段，从午夜零点到正午前',
    example: ['The shop is open at 8 a.m.', '商店上午八点开着。'],
    variants: [
      { lines: ['Train to Guangzhou: 6:40 a.m.'], prompt: '去广州的这趟火车是几点？', options: ['上午 6:40', '傍晚 6:40'], glossary: [['train to Guangzhou', '去广州的火车']] },
      { lines: ['Our test starts at 10:15 a.m.'], prompt: '考试是上午还是晚上开始？', options: ['上午 10:15', '晚上 10:15'], glossary: [['test', '考试'], ['starts at', '在某时开始']] },
      { lines: ['The doctor can see you at 7:20 a.m.'], prompt: '这次约的看诊时间是？', options: ['上午 7:20', '晚上 7:20'], glossary: [['the doctor', '医生'], ['can see you', '可以给你看诊']] },
    ],
  },
  {
    id: 'pm', lesson: 'notice-time', term: 'p.m.', meaning: '从正午到午夜前，可以表示下午或晚上',
    example: ['The game starts at 2 p.m.', '比赛下午两点开始。'],
    variants: [
      { lines: ['Please call me at 3:30 p.m.'], prompt: '应该什么时候打电话？', options: ['下午 3:30', '凌晨 3:30'], glossary: [['please', '请'], ['call me', '给我打电话']] },
      { lines: ['Last bus: 10:30 p.m.'], prompt: '末班车的时间是？', options: ['晚上 10:30', '上午 10:30'], glossary: [['last bus', '末班公交车']] },
      { lines: ['The pool is closed at 8:15 p.m.'], prompt: '泳池在哪个时刻不开放？', options: ['晚上 8:15', '上午 8:15'], glossary: [['pool', '泳池'], ['closed', '不开放的']] },
    ],
  },

  // 第五课：集合指令和校园地点。第七课综合复用前三课词组，不重复立词目。
  {
    id: 'meet-in', lesson: 'notice-place', term: 'meet in', meaning: '在某个地方见面或集合',
    example: ['Meet in Room 32 after lunch.', '午饭后在 32 室集合。'],
    variants: [
      { lines: ['Photo team: Meet in the hall at 2:10.'], prompt: '通知让摄影组到大厅做什么？', options: ['集合', '解散'], glossary: [['photo team', '摄影组'], ['hall', '大厅']] },
      { lines: ['We meet in the café to plan the trip.'], prompt: '大家怎么商量出行计划？', options: ['到咖啡馆碰面商量', '各自在家打电话商量'], glossary: [['café', '咖啡馆'], ['to plan the trip', '为了安排这趟出行']] },
      { lines: ['Can we meet in your office at 3:00?'], prompt: '对方在征求什么意见？', options: ['能不能三点到你的办公室碰面', '能不能三点给你的办公室打电话'], glossary: [['can we …?', '我们能……吗？'], ['your office', '你的办公室']] },
    ],
  },
  {
    id: 'school-library', lesson: 'notice-place', term: 'school library', meaning: '学校图书馆',
    example: ['The school library has two doors.', '学校图书馆有两扇门。'],
    variants: [
      { lines: ['You can get a new card at the school library.'], prompt: '可以去哪里领新卡？', options: ['学校图书馆', '学校办公室'], glossary: [['can get', '可以领取'], ['a new card', '一张新卡']] },
      { lines: ['Go past the school library and turn left.'], prompt: '左转前先经过什么地方？', options: ['学校图书馆', '教学楼'], glossary: [['go past', '经过'], ['turn left', '左转']] },
      { lines: ['I left my jacket in the school library.'], prompt: '说话的人把外套落在哪儿了？', options: ['学校图书馆', '学校礼堂'], glossary: [['left', '落下；遗留'], ['jacket', '外套']] },
    ],
  },
  {
    id: 'classroom', lesson: 'notice-place', term: 'classroom', meaning: '教室',
    example: ['There are six desks in the classroom.', '教室里有六张课桌。'],
    variants: [
      { lines: ['Your water bottle is still in the classroom.'], prompt: '水瓶还在哪儿？', options: ['教室', '机房'], glossary: [['water bottle', '水瓶'], ['still', '仍然']] },
      { lines: ['Keep food out of the classroom.'], prompt: '这条提醒说不要把食物带进哪里？', options: ['教室', '食堂'], glossary: [['keep … out of', '别让……进入'], ['food', '食物']] },
      { lines: ['The teacher is waiting outside the classroom.'], prompt: '老师在哪个地方的外面等？', options: ['教室外', '办公室外'], glossary: [['teacher', '老师'], ['is waiting', '正在等'], ['outside', '在……外面']] },
    ],
  },
  {
    id: 'computer-lab', lesson: 'notice-place', term: 'computer lab', meaning: '计算机教室；机房',
    example: ['There are 24 seats in the computer lab.', '机房里有 24 个座位。'],
    variants: [
      { lines: ['The computer lab is on the second floor.'], prompt: '二楼有什么地方？', options: ['机房', '普通教室'], glossary: [['on the second floor', '在二楼']] },
      { lines: ['Please take this key to the computer lab.'], prompt: '要把钥匙送到哪里？', options: ['机房', '图书馆'], glossary: [['please take … to', '请把……带到'], ['key', '钥匙']] },
      { lines: ['No drinks in the computer lab.'], prompt: '哪里不能带饮料进去？', options: ['机房', '体育馆'], glossary: [['no drinks', '禁止带饮料']] },
    ],
  },

  // 第六课：自带、借给和物品名。
  {
    id: 'bring', lesson: 'notice-bring', term: 'bring', meaning: '带上；带来',
    reviewOrder: [1, 0, 2], // 优先测证件；保留已有句子索引，避免重出旧题。
    example: ['Bring your ticket to the game.', '来看比赛时带上你的票。'],
    variants: [
      { lines: ['Bring some fruit for the picnic.'], prompt: '去野餐的人该怎么处理水果？', options: ['把水果带过去', '到那里再领水果'], glossary: [['some fruit', '一些水果'], ['picnic', '野餐']] },
      { lines: ['Bring your ID to the front desk.'], prompt: '关于身份证件，需要做什么？', options: ['把自己的证件带到前台', '到前台借证件'], glossary: [['ID', '身份证件'], ['front desk', '前台']] },
      { lines: ['It may rain. Bring a raincoat.'], prompt: '关于雨衣，对方给了什么建议？', options: ['把雨衣带上', '把雨衣留在原处'], glossary: [['may rain', '可能下雨'], ['raincoat', '雨衣']] },
    ],
  },
  {
    id: 'lend-you', lesson: 'notice-bring', term: 'lend you', meaning: '把东西借给你',
    example: ['I can lend you my ruler.', '我可以把我的尺子借给你。'],
    variants: [
      { lines: ['I can lend you my bike for an hour.'], prompt: '这句话里的自行车会从谁到谁？', options: ['我把自行车借给你', '你把自行车借给我'], glossary: [['can', '可以'], ['my bike', '我的自行车'], ['for an hour', '一个小时']] },
      { lines: ['Mina will lend you a scarf for the show.'], prompt: '演出用的围巾，Mina 要怎么处理？', options: ['借给你用', '让你自己带一条'], glossary: [['will', '将会'], ['scarf', '围巾'], ['show', '演出']] },
      { lines: ['Ask at the desk. They can lend you a charger.'], prompt: '去服务台问问，那里能提供什么帮助？', options: ['把充电器借给你', '把充电器卖给你'], glossary: [['ask at the desk', '去服务台问问'], ['they can', '他们可以'], ['charger', '充电器']] },
    ],
  },
  {
    id: 'pen', lesson: 'notice-bring', term: 'pen', meaning: '笔；与 pencil（铅笔）区分',
    example: ['My pen is on the chair.', '我的笔在椅子上。'],
    variants: [
      { lines: ['Sign your name with this pen.'], prompt: '这句要求用什么签名？', options: ['用这支笔', '用这支铅笔'], glossary: [['sign your name', '签名'], ['with', '用']] },
      { lines: ['I lost a blue pen on the bus.'], prompt: '说话的人在公交车上丢了什么？', options: ['一支蓝色的笔', '一本蓝色的笔记本'], glossary: [['lost', '丢失'], ['blue', '蓝色的'], ['on the bus', '在公交车上']] },
      { lines: ['The pen costs three yuan.'], prompt: '什么东西卖三元？', options: ['一支笔', '一把尺子'], glossary: [['costs', '售价为……'], ['three yuan', '三元']] },
    ],
  },
  {
    id: 'pencil', lesson: 'notice-bring', term: 'pencil', meaning: '铅笔',
    example: ['My pencil is next to the book.', '我的铅笔在书旁边。'],
    variants: [
      { lines: ['Use a pencil for this test.'], prompt: '考试要求用哪种书写工具？', options: ['铅笔', '钢笔'], glossary: [['use', '使用'], ['test', '考试']] },
      { lines: ['There is a short pencil in the drawer.'], prompt: '抽屉里有什么？', options: ['一支短铅笔', '一把短尺子'], glossary: [['there is', '有'], ['short', '短的'], ['drawer', '抽屉']] },
      { lines: ['Li draws a cat with a pencil.'], prompt: 'Li 用什么画猫？', options: ['铅笔', '画笔'], glossary: [['draws a cat', '画一只猫'], ['with', '用']] },
    ],
  },
  {
    id: 'notebook', lesson: 'notice-bring', term: 'notebook', meaning: '记事用的纸质笔记本',
    example: ['Your notebook is in my bag.', '你的笔记本在我的包里。'],
    variants: [
      { lines: ['Ming writes new words in a notebook.'], prompt: 'Ming 把生词写在什么上面？', options: ['笔记本', '日历'], glossary: [['writes', '写'], ['new words', '生词']] },
      { lines: ['I bought a notebook for my sister.'], prompt: '说话的人给姐妹买了什么？', options: ['一本笔记本', '一个文件夹'], glossary: [['bought', '买了'], ['for my sister', '给我的姐妹']] },
      { lines: ['Someone left a green notebook on the train.'], prompt: '有人在火车上落下了什么？', options: ['一本绿色的笔记本', '一本绿色的杂志'], glossary: [['someone', '有人'], ['left', '落下；遗留'], ['green', '绿色的'], ['on the train', '在火车上']] },
    ],
  },

  // 第八课：读、写和借入。词形变化仍算同一词目。
  {
    id: 'read', lesson: 'sentence-core', term: 'read', meaning: '读；阅读',
    example: ['Ana reads a story before bed.', 'Ana 睡前读一个故事。'],
    variants: [
      { lines: ['Read the menu before you order.'], prompt: '点餐之前要怎么做？', options: ['看一下菜单', '把菜单递过去'], glossary: [['menu', '菜单'], ['before you order', '在你点餐之前']] },
      { lines: ['Tao reads the news at breakfast.'], prompt: 'Tao 吃早餐的时候做什么？', options: ['看新闻', '写新闻'], glossary: [['news', '新闻'], ['at breakfast', '吃早餐时']] },
      { lines: ['Please read the signs at the door.'], prompt: '说话的人希望你对门口的标牌做什么？', options: ['读标牌上的内容', '把标牌移到别处'], glossary: [['signs', '标牌'], ['at the door', '在门口']] },
    ],
  },
  {
    id: 'write-a-note', lesson: 'sentence-core', term: 'write a note', meaning: '写一张便条；写一段简短留言',
    example: ['I write a note before I leave.', '我离开前会写一张便条。'],
    variants: [
      { lines: ['Nina writes a note for Dad and puts it on the fridge.'], prompt: 'Nina 用什么方式给爸爸留了信息？', options: ['写了一张便条', '发了一条手机消息'], glossary: [['for Dad', '给爸爸'], ['puts it on', '把它放在……上'], ['fridge', '冰箱']] },
      { lines: ['Please write a note for the teacher about the broken chair.'], prompt: '关于坏掉的椅子，这句话让你怎么告诉老师？', options: ['给老师写张便条', '去当面跟老师说'], glossary: [['teacher', '老师'], ['about', '关于'], ['broken chair', '坏掉的椅子']] },
      { lines: ['I write a note to thank my neighbor.'], prompt: '说话的人用什么方式向邻居道谢？', options: ['写下简短的留言', '打电话道谢'], glossary: [['to thank', '为了感谢'], ['neighbor', '邻居']] },
    ],
  },
  {
    id: 'borrow', lesson: 'sentence-core', term: 'borrow', meaning: '从别人那里借来用',
    example: ['I often borrow a pen from my friend.', '我常向朋友借笔。'],
    variants: [
      { lines: ['Can I borrow your umbrella?'], prompt: '说话的人想做什么？', options: ['借用对方的伞', '把伞借给对方'], glossary: [['can I …?', '我可以……吗？'], ['your umbrella', '你的伞']] },
      { lines: ['Jun borrows a ball from the sports center.'], prompt: 'Jun 怎么拿到球？', options: ['从体育中心借来', '从体育中心买来'], glossary: [['ball', '球'], ['from', '从……'], ['sports center', '体育中心']] },
      { lines: ['We borrow chairs from our neighbors for the party.'], prompt: '聚会的椅子是怎样安排的？', options: ['向邻居借椅子', '把椅子借给邻居'], glossary: [['chairs', '椅子'], ['from', '从……'], ['neighbors', '邻居'], ['party', '聚会']] },
    ],
  },

  // 第九课：描述场所和物品的状态。
  {
    id: 'room', lesson: 'be-state', term: 'room', meaning: '房间；Room 加编号表示几号房间',
    example: ['My room is small.', '我的房间很小。'],
    variants: [
      { lines: ['Hotel key: Room 412.'], prompt: '412 在这里是什么编号？', options: ['房间号', '楼层号'], glossary: [['hotel key', '酒店钥匙']] },
      { lines: ['This room has two windows.'], prompt: '哪样东西有两扇窗？', options: ['这个房间', '这扇门'], glossary: [['has', '有'], ['windows', '窗户']] },
      { lines: ['Our lesson is in Room 13 today.'], prompt: '今天这节课安排在哪儿？', options: ['13 号房间', '第 13 层'], glossary: [['lesson', '课'], ['today', '今天']] },
    ],
  },
  {
    id: 'quiet', lesson: 'be-state', term: 'quiet', meaning: '安静的',
    example: ['The street is quiet at night.', '这条街夜里很安静。'],
    variants: [
      { lines: ['The baby’s room is quiet.'], prompt: '这句话说宝宝的房间怎么样？', options: ['安静', '有点吵'], glossary: [['the baby’s room', '宝宝的房间']] },
      { lines: ['I like this café because it is quiet.'], prompt: '说话的人为什么喜欢这家咖啡馆？', options: ['这里很安静', '这里很热闹'], glossary: [['like', '喜欢'], ['café', '咖啡馆'], ['because', '因为']] },
      { lines: ['The train is quiet now.'], prompt: '现在车厢里的声音怎么样？', options: ['声音很少，很安静', '声音很多，很吵'], glossary: [['train', '火车'], ['now', '现在']] },
    ],
  },
  {
    id: 'open', lesson: 'be-state', term: 'open', meaning: '处于开着或对外开放的状态',
    example: ['The museum is open on Sundays.', '博物馆星期日开放。'],
    variants: [
      { lines: ['The window is open, but the door is shut.'], prompt: '窗户现在是什么状态？', options: ['开着', '关着'], glossary: [['window', '窗户'], ['but', '但是'], ['shut', '关着的']] },
      { lines: ['The bread shop is still open at 7:45.'], prompt: '七点四十五的时候，这家店是什么状态？', options: ['还在营业', '已经打烊'], glossary: [['bread shop', '面包店'], ['still', '仍然']] },
      { lines: ['The box is open on the table.'], prompt: '桌上的盒子是什么状态？', options: ['打开着', '合着盖'], glossary: [['box', '盒子'], ['table', '桌子']] },
    ],
  },
  {
    id: 'closed', lesson: 'be-state', term: 'closed', meaning: '处于关着或不对外开放的状态',
    example: ['The bank is closed on Sunday.', '银行星期日不营业。'],
    variants: [
      { lines: ['The café is closed for lunch.'], prompt: '这家咖啡馆午饭时段是什么状态？', options: ['暂停营业', '照常营业'], glossary: [['café', '咖啡馆'], ['for lunch', '这里指午饭时段']] },
      { lines: ['The windows are closed, but the door is open.'], prompt: '窗户是开着还是关着的？', options: ['关着', '开着'], glossary: [['windows', '窗户'], ['but', '但是'], ['door', '门']] },
      { lines: ['The bridge is closed today. Use the other bridge.'], prompt: '今天第一句提到的那座桥能走吗？', options: ['不能，今天不通行', '能，今天照常通行'], glossary: [['bridge', '桥'], ['today', '今天'], ['use', '使用；这里指走某条路线'], ['the other', '另一座']] },
    ],
  },
  {
    id: 'door', lesson: 'be-state', term: 'door', meaning: '门',
    example: ['The dog is by the door.', '狗在门旁边。'],
    variants: [
      { lines: ['The key is behind the door.'], prompt: '钥匙在什么东西后面？', options: ['门', '柜子'], glossary: [['key', '钥匙'], ['behind', '在……后面']] },
      { lines: ['This bus has two doors.'], prompt: '公交车有两个什么？', options: ['车门', '车窗'], glossary: [['bus', '公交车'], ['has', '有']] },
      { lines: ['Someone is knocking on the door.'], prompt: '有人在敲什么？', options: ['门', '窗户'], glossary: [['someone', '有人'], ['is knocking on', '正在敲……']] },
    ],
  },

  // 第十课：习惯、过去与日常活动。
  {
    id: 'play-basketball', lesson: 'time-verbs', term: 'play basketball', meaning: '打篮球',
    example: ['We play basketball at the park.', '我们在公园打篮球。'],
    variants: [
      { lines: ['Lu wants to play basketball with a friend.'], prompt: 'Lu 想和朋友做什么？', options: ['打篮球', '踢足球'], glossary: [['wants to', '想要'], ['with a friend', '和一个朋友一起']] },
      { lines: ['You can play basketball in the gym today.'], prompt: '今天可以在体育馆做什么？', options: ['打篮球', '看篮球比赛'], glossary: [['can', '可以'], ['gym', '体育馆'], ['today', '今天']] },
      { lines: ['I played basketball at summer camp.'], prompt: '说话的人在夏令营参加了哪项活动？', options: ['打篮球', '打排球'], glossary: [['summer camp', '夏令营']] },
    ],
  },
  {
    id: 'every-day', lesson: 'time-verbs', term: 'every day', meaning: '每天；天天',
    example: ['I take the bus to work every day.', '我每天坐公交去上班。'],
    variants: [
      { lines: ['Water the plant every day.'], prompt: '应该多久给这株植物浇一次水？', options: ['每天', '每周一次'], glossary: [['water the plant', '给植物浇水']] },
      { lines: ['This shop is open every day.'], prompt: '这家店通常哪些日子营业？', options: ['每天都营业', '只在周末营业'], glossary: [['shop', '商店'], ['open', '营业的']] },
      { lines: ['I read one page every day.'], prompt: '说话的人怎么安排阅读？', options: ['每天读一页', '隔一天读一页'], glossary: [['page', '页']] },
    ],
  },
  {
    id: 'yesterday', lesson: 'time-verbs', term: 'yesterday', meaning: '昨天',
    example: ['I washed my bag yesterday.', '我昨天洗了包。'],
    variants: [
      { lines: ['Yesterday, the café was closed.'], prompt: '这句说咖啡馆哪一天没营业？', options: ['昨天', '今天'], glossary: [['café', '咖啡馆'], ['was closed', '没营业']] },
      { lines: ['I lost my key yesterday.'], prompt: '钥匙是哪天弄丢的？', options: ['昨天', '前天'], glossary: [['lost', '弄丢'], ['key', '钥匙']] },
      { lines: ['We had a test yesterday.'], prompt: '考试发生在哪一天？', options: ['昨天', '今天'], glossary: [['had a test', '参加了考试']] },
    ],
  },
  {
    id: 'after-class', lesson: 'time-verbs', term: 'after class', meaning: '下课后',
    example: ['I play the guitar after class.', '我下课后弹吉他。'],
    variants: [
      { lines: ['Please see me after class.'], prompt: '说话的人让你什么时候去找他？', options: ['下课后', '上课前'], glossary: [['please see me', '请来找我']] },
      { lines: ['We clean the desks after class.'], prompt: '什么时候擦桌子？', options: ['下课后', '上课时'], glossary: [['clean the desks', '擦桌子']] },
      { lines: ['Let’s get a snack after class.'], prompt: '这句话提议什么时候去吃点东西？', options: ['下课后', '上课前'], glossary: [['let’s', '我们……吧'], ['get a snack', '吃点东西']] },
    ],
  },
  {
    id: 'study', lesson: 'time-verbs', term: 'study', meaning: '学习；温习功课',
    example: ['I study English on the bus.', '我在公交车上学英语。'],
    variants: [
      { lines: ['We study math at the library.'], prompt: '他们在图书馆做什么？', options: ['学数学', '教数学'], glossary: [['math', '数学'], ['library', '图书馆']] },
      { lines: ['Yesterday, Lin studied for a driving test.'], prompt: 'Lin 昨天做了什么？', options: ['为驾照考试复习', '参加了驾照考试'], glossary: [['for', '为了'], ['driving test', '驾照考试']] },
      { lines: ['Ping studies online at night.'], prompt: 'Ping 晚上上网做什么？', options: ['学习', '工作'], glossary: [['online', '在网上'], ['at night', '在晚上']] },
    ],
  },

  // 第十一课：用 have 表示“有”。
  {
    id: 'have', lesson: 'noun-count', term: 'have', meaning: '有；拥有',
    example: ['I have a new pencil case.', '我有一个新笔袋。'],
    variants: [
      { lines: ['I have two cats at home.'], prompt: '说话的人和这两只猫是什么关系？', options: ['家里养着这两只猫', '想领养两只猫，但现在没有'], glossary: [['cats', '猫'], ['at home', '在家']] },
      { lines: ['Do you have a ticket for the concert?'], prompt: '这句是在向对方确认什么？', options: ['手上有没有音乐会的票', '要不要卖掉音乐会的票'], glossary: [['do you …?', '你……吗？'], ['ticket', '票'], ['concert', '音乐会']] },
      { lines: ['Our hotel has a pool.'], prompt: '下列哪句话和原意一致？', options: ['这家酒店有泳池', '这家酒店正在建泳池'], glossary: [['hotel', '酒店'], ['pool', '泳池']] },
    ],
  },

  // 第十二课：it 回指前文；物品词继续用于新场景。
  {
    id: 'it', lesson: 'reference-basics', term: 'it', meaning: '它；这里代替前面说过的一样东西',
    example: ['I found a red cap. It is too big for me.', '我找到一顶红色帽子。它对我来说太大了。'],
    variants: [
      { lines: ['I set my cup on the table.', 'It is still full of tea.'], prompt: '第二句的 It 代替哪样东西？', options: ['杯子', '桌子'], glossary: [['set … on', '把……放在……上'], ['cup', '杯子'], ['table', '桌子'], ['still full of tea', '仍装满了茶']] },
      { lines: ['Where is your bus ticket?', 'It is in my pocket.'], prompt: '回答里的 It 指的是什么？', options: ['车票', '口袋'], glossary: [['where', '在哪里'], ['bus ticket', '公交车票'], ['pocket', '口袋']] },
      { lines: ['A bag is next to the bike.', 'It has a flat tire.'], prompt: '第二句的 It 指前一句的什么？', options: ['那辆自行车', '那个包'], glossary: [['next to', '在……旁边'], ['bike', '自行车'], ['flat tire', '瘪了的轮胎']] },
    ],
  },
  {
    id: 'bag', lesson: 'reference-basics', term: 'bag', meaning: '包；袋子',
    example: ['My bag is under the desk.', '我的包在课桌下面。'],
    variants: [
      { lines: ['The apples are in a paper bag.'], prompt: '苹果装在什么里？', options: ['纸袋里', '纸盒里'], glossary: [['apples', '苹果'], ['paper', '纸；纸制的']] },
      { lines: ['I left my bag on the bus.'], prompt: '说话的人把什么落在公交车上了？', options: ['自己的包', '自己的伞'], glossary: [['left', '落下；遗留'], ['on the bus', '在公交车上']] },
      { lines: ['There is a hole in my bag.'], prompt: '什么东西破了一个洞？', options: ['说话人的包', '说话人的口袋'], glossary: [['there is a hole', '有一个洞']] },
    ],
  },
  {
    id: 'page', lesson: 'reference-basics', term: 'page', meaning: '页；书本或文件中的一页',
    example: ['This page has two pictures.', '这一页有两张图。'],
    variants: [
      { lines: ['Open your book to page 16.'], prompt: '16 指的是书里的什么？', options: ['页码', '课次'], glossary: [['open your book to', '把书翻到……']] },
      { lines: ['Juice fell on the book. One page is wet.'], prompt: '这句话说多大范围弄湿了？', options: ['一页', '一整章'], glossary: [['juice fell on the book', '果汁洒到了书上'], ['wet', '湿的']] },
      { lines: ['Look at the map on the first page.'], prompt: '地图在什么地方？', options: ['第一页', '第一张插图的背面'], glossary: [['look at', '看'], ['map', '地图'], ['first', '第一']] },
    ],
  },

  // 第三十七课：区分截止、活动开始时间与要发的信息。
  {
    id: 'by', lesson: 'notice-deadline', term: 'by', meaning: '最迟在……；提前做或到点做都可以',
    example: ['Please send the photo by noon.', '请最迟在中午十二点发来照片。'],
    variants: [
      { lines: ['Return the key by 4:30.'], prompt: '按通知，哪个时间还钥匙来得及？', options: ['4:15', '4:45'], glossary: [['return', '归还'], ['key', '钥匙']] },
      { lines: ['Send the list by 9:00.', 'The bus leaves at 9:20.'], prompt: '最迟几点要把名单发过去？', options: ['9:00', '9:20'], glossary: [['send the list', '发名单'], ['the bus leaves', '公交车发车']] },
      { lines: ['Pick up your ticket by 12:00.'], prompt: '正好 12:00 领到票，按这条通知算晚吗？', options: ['不算晚，12:00 也可以', '算晚，必须早于 12:00'], glossary: [['pick up', '领取'], ['ticket', '票']] },
    ],
  },
  {
    id: 'send-your-name', lesson: 'notice-deadline', term: 'send your name', meaning: '把自己的姓名发给对方',
    example: ['Please send your name to Ms. Lin.', '请把你的姓名发给林老师。'],
    variants: [
      { lines: ['To join the cooking club, send your name.'], prompt: '想加入烹饪社，要发给对方什么信息？', options: ['自己的姓名', '社团的名称'], glossary: [['to join', '为了加入'], ['cooking club', '烹饪社']] },
      { lines: ['For the club trip, send your name to Mr. Wu.'], prompt: '关于社团出行，通知让你怎么做？', options: ['把姓名发给吴老师', '当面告诉吴老师自己的姓名'], glossary: [['club trip', '社团出行'], ['Mr. Wu', '吴老师']] },
      { lines: ['Send your name first.', 'You can send your photo next week.'], prompt: '哪样信息要先发？', options: ['自己的姓名', '自己的照片'], glossary: [['first', '先'], ['next week', '下周']] },
    ],
  },

  // 第三十八课：区分条件、集合行动和规则适用的范围。
  {
    id: 'if', lesson: 'notice-condition', term: 'if', meaning: '如果；引出条件，条件成立时才按这条通知行动',
    example: ['If your shoes are wet, change them.', '如果鞋子湿了，就换一双。'],
    variants: [
      { lines: ['If you forget your card, go to the front desk.'], prompt: '通知要求谁去前台？', options: ['忘带卡的人', '来的人都要去'], glossary: [['forget', '忘记'], ['card', '卡'], ['front desk', '前台']] },
      { lines: ['Use Room 12 if Room 10 is full.'], prompt: '通知在什么情况下让你用 12 室？', options: ['10 室满了的时候', '10 室还有空位的时候'], glossary: [['use', '使用'], ['full', '满的']] },
      { lines: ['If your screen goes dark, raise your hand.'], prompt: '你的屏幕正常亮着。按这条通知，你现在需要举手吗？', options: ['不用举手', '也要举手'], glossary: [['screen', '屏幕'], ['goes dark', '变黑'], ['raise your hand', '举手']] },
    ],
  },
  {
    id: 'meet-inside', lesson: 'notice-condition', term: 'meet inside', meaning: '在室内集合',
    example: ['We meet inside on cold days.', '天冷时，我们在室内集合。'],
    variants: [
      { lines: ['The art group will meet inside on windy days.'], prompt: '风大的时候，美术组在哪儿集合？', options: ['在室内', '在室外'], glossary: [['art group', '美术组'], ['windy days', '风大的日子']] },
      { lines: ['Please meet inside before the tour.'], prompt: '开始参观之前，大家要怎么做？', options: ['先在室内碰头', '各自在室内等，不用碰头'], glossary: [['please', '请'], ['before', '在……之前'], ['tour', '参观']] },
      { lines: ['Pick up a map in the yard.', 'Then meet inside.'], prompt: '在院子里领到地图后，接下来要做什么？', options: ['进屋集合', '留在院子里集合'], glossary: [['pick up', '领取'], ['map', '地图'], ['yard', '院子'], ['then', '然后']] },
    ],
  },
  {
    id: 'everyone', lesson: 'notice-condition', term: 'everyone', meaning: '所有人；指所说范围内的每个人',
    example: ['Everyone in the group has a seat.', '组里的每个人都有座位。'],
    variants: [
      { lines: ['Everyone needs a blue card.', 'New students can get one at the office.'], prompt: '关于蓝卡，通知要求哪些人必须有？', options: ['所有人都要有蓝卡', '只有新生才需要蓝卡'], glossary: [['needs', '需要'], ['blue card', '蓝卡'], ['new students', '新生'], ['office', '办公室']] },
      { lines: ['The team leader will show the new tool.', 'Everyone on the team can try it.'], prompt: '队里哪些人能试用新工具？', options: ['队里每个人都能试用', '只有队长能试用'], glossary: [['team leader', '队长'], ['show', '展示'], ['tool', '工具'], ['try it', '试试它']] },
      { lines: ['Everyone in Group B must wear gloves.'], prompt: '关于戴手套，这句话对 B 组的要求是什么？', options: ['B 组每个人都要戴', 'B 组只要有一个人戴'], glossary: [['group', '组'], ['must', '必须'], ['wear gloves', '戴手套']] },
    ],
  },

  // 第三十九课：认出新安排、被排除的旧安排和没变的信息。
  {
    id: 'now', lesson: 'notice-change', term: 'now', meaning: '现在；在更新通知里常提示改用新安排',
    example: ['The shop now opens at ten.', '这家店现在改为十点开门。'],
    variants: [
      { lines: ['The workshop used to start at 9:10.', 'It now starts at 9:40.'], prompt: '按新安排，实训课几点开始？', options: ['9:40', '9:10'], glossary: [['workshop', '这里指实训课'], ['used to', '以前常常'], ['start at', '在某个时刻开始']] },
      { lines: ['The photos were on the first floor.', 'They are now on the second floor.'], prompt: '要看照片，该上哪一层？', options: ['二楼', '一楼'], glossary: [['photos', '照片'], ['floor', '楼层'], ['first', '第一'], ['second', '第二']] },
      { lines: ['You must now sign up online.', 'Last term, students signed up in Room 14.'], prompt: '按新安排，该怎么办理报名？', options: ['在网上报名', '去 14 室报名'], glossary: [['sign up', '报名'], ['online', '在网上'], ['last term', '上学期']] },
    ],
  },
  {
    id: 'not', lesson: 'notice-change', term: 'not', meaning: '不是；在这里排除不再采用的安排或选项',
    example: ['Choose the red folder, not the blue one.', '选红色文件夹，不选蓝色的。'],
    variants: [
      { lines: ['Use the side door, not the front door.'], prompt: '按通知，要走哪扇门？', options: ['侧门', '正门'], glossary: [['use', '使用'], ['side door', '侧门'], ['front door', '正门']] },
      { lines: ['Bring a ruler, not a tape measure.'], prompt: '说到量尺寸，通知要你带哪种工具？', options: ['直尺', '卷尺'], glossary: [['ruler', '直尺'], ['tape measure', '卷尺']] },
      { lines: ['The practice is not on Wednesday.', 'It is on Thursday.'], prompt: '要参加这次训练，应该哪天去？', options: ['星期四', '星期三'], glossary: [['practice', '训练'], ['Wednesday', '星期三'], ['Thursday', '星期四']] },
    ],
  },
  {
    id: 'stays-the-same', lesson: 'notice-change', term: 'stays the same', meaning: '保持不变；仍按原来的安排',
    example: ['Your seat number stays the same.', '你的座位号不变。'],
    variants: [
      { lines: ['The teams use new tools today.', 'The safety rule stays the same.'], prompt: '换了工具，安全规定怎么执行？', options: ['还是按原来的安全规定做', '要按新的安全规定做'], glossary: [['teams', '各小组'], ['tools', '工具'], ['safety rule', '安全规定']] },
      { lines: ['Lunch cost 12 yuan last week.', 'The price stays the same this week.'], prompt: '这周一份午餐多少钱？', options: ['还是 12 元', '只知道上周是 12 元，这周多少钱还不确定'], glossary: [['cost', '价格是……'], ['yuan', '元'], ['price', '价格'], ['last week', '上周'], ['this week', '这周']] },
      { lines: ['You can enter through a different door.', 'The door code stays the same.'], prompt: '换一道门进入，应该用哪个密码？', options: ['用原来的密码', '需要用一个新密码'], glossary: [['enter through', '从……进入'], ['a different door', '另一道门'], ['door code', '门禁密码']] },
    ],
  },
]);
