// 题面据本地 exam/2026-广东3+证书-英语真题.md。答案与范文为本站参考，非官方。
(() => {
  'use strict';

  function choice(id, prompt, points, labels, answer, reference) {
    return { id: String(id), prompt, points,
      options: labels.map((label, index) => ({ id: 'ABCDE'[index], label })),
      answer, ...(reference ? { reference } : {}) };
  }

  const insertChoices = [
    'Just follow our heart.',
    'Toothpaste is another example.',
    'Do you want white or brown bread?',
    'Today, the list of candy flavors seems endless.',
    'While shopping, we are facing too many choices.',
  ];

  window.EXAM_2026 = {
    id: '2026',
    title: '2026 年原卷',
    note: '广东省普通高等学校招收中等职业学校毕业生统一考试 · 英语。依据用户提供的原卷照片转录，61 题、150 分。原卷转录未附答案：本页答案、补句参考和作文范例仅供自查，不是官方答案或评分细则。阅读第二节转录正文只列 A–E，虽然后附速查表写「七选五」，本站只呈现正文所列选项，不补造。第 15 题保留 retun（疑为 return）。语法填空只自动匹配所列写法；第 48、51 题的其他合理写法以及完成句子的变体可人工核对。',
    sections: [
      {
        id: 'dialogue', title: 'Ⅰ. 补全对话（10 分）',
        passage: '阅读下列简短对话，从每题所给的 A、B、C 和 D 项中选出最佳选项，将对话补全。',
        questions: [
          choice(1, "—Could I have some more cakes?\n—____ We've got lots of cakes here.", 2, ['Of course.', 'No way.', 'Behave yourself.', 'Better not.'], 'A'),
          choice(2, '—Is this the book you are looking for?\n—____ Thanks.', 2, ['No more.', 'See you.', "Yes, that's the one.", 'The same to you.'], 'C'),
          choice(3, '—I really enjoyed my stay here.\n—____', 2, ['It depends.', "I'm sorry.", "I don't know.", 'Glad to hear that.'], 'D'),
          choice(4, '—We should get to the airport earlier.\n—____ The traffic can be busy on the way.', 2, ["You're welcome.", 'I agree.', "It doesn't matter.", 'It hurts.'], 'B'),
          choice(5, "—I'm nervous about giving a speech in class.\n—____ You can do it well.", 2, ["Don't worry.", 'Good job.', 'Probably not.', 'Sounds great.'], 'A'),
        ],
      },
      {
        id: 'words', title: 'Ⅱ. 词汇（20 分）',
        passage: '阅读下列句子，从每题所给的 A、B、C 和 D 项中选出句中画线的单词或词组的意义。',
        questions: [
          choice(6, 'I **chatted** with my friends online and they told me a lot of fun things.', 2, ['运动', '聊天', '购物', '聚餐'], 'B'),
          choice(7, 'He got better after he received proper **treatment** in hospital.', 2, ['款待', '判断', '治疗', '分析'], 'C'),
          choice(8, 'The new farming methods have brought the farmers a good **harvest**.', 2, ['收成', '印象', '评论', '薪水'], 'A'),
          choice(9, 'I prefer your **original** plan to this new one.', 2, ['理想的', '长期的', '详细的', '原来的'], 'D'),
          choice(10, "He calls his mom **regularly** so that she won't worry about him.", 2, ['顺利地', '自动地', '定期地', '低调地'], 'C'),
          choice(11, "You can leave the task to Li Ming because he's very **responsible**.", 2, ['负责的', '胆小的', '温和的', '懒散的'], 'A'),
          choice(12, 'More and more companies are using Chinese **software**.', 2, ['专利', '芯片', '技术', '软件'], 'D'),
          choice(13, 'I **set off** at 5 a. m. to see the sunrise.', 2, ['起立', '出发', '结束', '拜访'], 'B'),
          choice(14, "The hotel didn't **provide** breakfast so I bought some cookies.", 2, ['处理', '浪费', '提供', '消耗'], 'C'),
          choice(15, 'We hope they will retun **safe and sound** from their journey.', 2, ['兴高采烈', '安然无恙', '战战兢兢', '跌跌撞撞'], 'B'),
        ],
      },
      {
        id: 'cloze', title: 'Ⅲ. 完形填空（30 分）',
        passage: `阅读下面短文，掌握其大意，然后从每题所给的 A、B、C 和 D 项中选出最佳选项。

Rosa was a middle school teacher. Recently, she learned from many parents that their kids spent too much time on smart phones at home. Hoping to make a __16__, Rosa held a discussion in class to help her students think about their use of phones.

Some students said phones were very __17__ because they could use phones to search for information. However, other students had a __18__ opinion. They said phones had eaten up their time with friends. They used to have __19__ with friends in the playground at weekends, but now their friends __20__ playing with their phones at home.

At the end of the __21__, Rosa explained, "Smart phones aren't bad, but spending too much time on them can make us miss out on fun or __22__ moments." Hearing this, one of the students suggested a no-phone day. The whole class __23__ at once.

The next Saturday, Rosa brought the students to the local __24__ to help clean it up. The students handed in their __25__ to Rosa. Then they raced to __26__ litter. They cheered each other on and laughed __27__. They totally forgot their phones. When the students finished their work in the park, Rosa __28__ them, "You've done a great job by working together. More importantly, you've spent a day without phones!"

From this activity, the students learned to __29__ phone use with real-world action. They understood they could be __30__ by building stronger friendship through teamwork and face-to-face fun.`,
        questions: [
          choice(16, '第 16 空', 2, ['list', 'dream', 'fortune', 'change'], 'D'),
          choice(17, '第 17 空', 2, ['small', 'helpful', 'fragile', 'expensive'], 'B'),
          choice(18, '第 18 空', 2, ['positive', 'medical', 'different', 'professional'], 'C'),
          choice(19, '第 19 空', 2, ['fun', 'fear', 'trouble', 'housework'], 'A'),
          choice(20, '第 20 空', 2, ['liked', 'minded', 'finished', 'imagined'], 'A', '本站参考：上文说过去在操场和朋友玩，下文转到如今喜欢待在家玩手机；四项中 liked 最符合上下文。'),
          choice(21, '第 21 空', 2, ['position', 'discussion', 'examination', 'competition'], 'B'),
          choice(22, '第 22 空', 2, ['dark', 'exact', 'important', 'dangerous'], 'C'),
          choice(23, '第 23 空', 2, ['agreed', 'reported', 'guessed', 'appeared'], 'A'),
          choice(24, '第 24 空', 2, ['zoo', 'park', 'yard', 'garden'], 'B'),
          choice(25, '第 25 空', 2, ['food', 'litter', 'flowers', 'phones'], 'D'),
          choice(26, '第 26 空', 2, ['pick up', 'make up', 'wash up', 'cut up'], 'A'),
          choice(27, '第 27 空', 2, ['secretly', 'happily', 'quietly', 'politely'], 'B'),
          choice(28, '第 28 空', 2, ['warmed', 'advised', 'praised', 'questioned'], 'C'),
          choice(29, '第 29 空', 2, ['fill', 'serve', 'balance', 'surprise'], 'C'),
          choice(30, '第 30 空', 2, ['older', 'taller', 'faster', 'closer'], 'D'),
        ],
      },
      {
        id: 'reading-a', title: 'Ⅳ. 阅读·第一节 A（15 分）',
        passage: `阅读下列短文，掌握其大意，然后从每题所给的 A、B、C 和 D 项中选出最佳选项。

Ten years ago, I wrote my first book. I tried to get it published. So I sent the first chapter(章节) to a publishing company. In this chapter, two friends met for coffee and had an argument. I thought it was interesting and felt quite satisfied with this opening.

While waiting for a reply from the company, I happened to read a writing guide. It showed an example of a bad opening: It described two characters sitting in the kitchen drinking tea and there was no development in the story. Such an opening could not hold readers' attention. Reading this, I said to myself that my opening was a good one because it was different from the example. But I was not as confident as before.

So I sent my first chapter to my friend Mike, an experienced writer, hoping to hear some positive comments from him. But he replied that he didn't like it because the characters did nothing but sit there talking. I felt disappointed. To make things worse, a rejection letter from the company arrived a few days later. I was hurt. I went through a period of sadness, with lots of crying and lots of ice cream.

Six months later, in a bookstore, I picked up a book, read the first few pages and found them really boring. The opening was all about three people sitting in the bar complaining to each other. At that moment, I saw the truth: The first chapter of my book was boring, too. Readers didn't know enough about my characters and therefore couldn't understand how their argument helped develop the story. This is one of the most valuable lessons I've learned as a writer: It's easier for me to see my own mistakes from a reader's point of view. From then on, I read my books like I read somebody else's works.`,
        questions: [
          choice(31, 'What did the author think of the opening of her own book at first?', 3, ['Humorous.', 'Boring.', 'Disappointing.', 'Interesting.'], 'D', '本站参考：第一段，I thought it was interesting。'),
          choice(32, 'The writing guide showed ____.', 3, ['a polite reply', 'a poor opening', 'a simple letter', 'a nice character'], 'B', '本站参考：第二段 an example of a bad opening 对应 a poor opening。'),
          choice(33, 'The author sent the first chapter to Mike ____.', 3, ['to teach him writing', 'to give him a surprise', 'to get his nice comments', 'to exchange works with him'], 'C', '本站参考：第三段 hoping to hear some positive comments from him。'),
          choice(34, 'What did the author mean by saying "lots of ice cream" in Paragraph 3?', 3, ['She was sad.', 'She was rich.', 'She was healthy.', 'She was hungry.'], 'A', '本站参考：第三段直接把吃冰淇淋和哭泣放在 a period of sadness 之下。'),
          choice(35, 'What is the lesson the author has learned?', 3, ['To send publishers the whole book.', 'To ask a friend to write the opening.', "To treat her own works as others' works.", 'To read a writing guide before writing a book.'], 'C', "本站参考：末段 I read my books like I read somebody else's works。"),
        ],
      },
      {
        id: 'reading-b', title: 'Ⅳ. 阅读·第一节 B（15 分）',
        passage: `阅读下列短文，掌握其大意，然后从每题所给的 A、B、C 和 D 项中选出最佳选项。

Many people look up to their brothers and sisters. Now researchers have discovered that songbirds also look to their brothers and sisters as role models(榜样)—even more than they look up to their parents.

In the wild, songbirds usually depend on their parents for the first 10 to 14 days of their life. Then they leave their parents. After that, they learn life skills through direct experience or by observing(观察) other birds around them.

To study the learning behavior of young songbirds, the researchers did an experiment on 51 pairs of songbird parents and their 229 kids. They created a puzzle that required the songbirds to open a box to get some food in it.

After studying the birds' problem-solving behavior for 10 weeks, the researchers made some interesting findings. Some young birds worked out how to get the food by themselves. The rest of the young birds learned to solve the puzzle from others; Among them, about 94% learned it from their brothers and sisters, less than 2% learned it from their parents, and about 4% followed the lead of other adults. These research findings showed that the young birds' solution strategies(策略) were more strongly influenced by how their brothers and sisters solved the puzzle.

The researchers say that brothers and sisters are important role models for songbirds to learn the skills they need to survive. The researchers believe that songbirds can better adjust to changes in the environment because they can learn from different role models.`,
        questions: [
          choice(36, 'What do we know about songbirds from Paragraph 2?', 3, ['They depend on other birds to find their parents.', 'They look after their parents before leaving them.', 'They gain life skills and experience from humans.', 'They live with their parents for two weeks at most.'], 'D', '本站参考：第二段说通常在最初 10–14 天依赖父母，之后离开，D 是四项中最符合的一项。选项省略了原文的 usually，不宜理解为所有鸣禽绝对不超过 14 天。'),
          choice(37, 'Why did the researchers create a puzzle for the songbirds?', 3, ['To count the number of them.', 'To study their learning behavior.', 'To understand their sleeping habit.', 'To test the relations between them.'], 'B', '本站参考：第三段开头 To study the learning behavior of young songbirds。'),
          choice(38, 'In the study, the rest of the young birds learned how to solve the puzzle mainly from ____.', 3, ['their parents', 'the researchers', 'other adult birds', 'their brothers and sisters'], 'D', '本站参考：在从其他鸟学习的那一组内，约 94% 是跟兄弟姐妹学的。'),
          choice(39, 'According to the researchers, learning from different role models can help songbirds ____.', 3, ['look up to human beings', 'share puzzle boxes', 'survive environmental changes', 'influence their parents'], 'C', '本站参考：末段 better adjust to changes in the environment。'),
          choice(40, 'Where is this passage most likely taken from?', 3, ['A science magazine.', 'A sports website.', "A learner's dictionary.", 'A music textbook.'], 'A', '本站参考：全文介绍科学实验、数据和研究发现，四项中最像科学杂志。'),
        ],
      },
      {
        id: 'insert', title: 'Ⅳ. 阅读·第二节（15 分）',
        passage: `阅读下面短文，从短文后的选项中选出可以填入空白处的最佳选项。

Nowadays, we often talk about making life simple. We have many smart machines to make work easier and magazines to tell us how to live simply. However, there is one area, shopping, where things are not becoming simpler. __41__

Take candy for example. When I was young, candy had only a few common flavors like milk and lemon. __42__ New flavors appear all the time, while old ones are still there.

__43__ In the past, toothpaste was made simply to clean teeth. We just picked our favorite brand(品牌). Now, there are many types of toothpaste. Some help to make teeth stronger, and others to make teeth brighter. It is not easy to make a choice.

Even choosing bread has become difficult __44__ With sugar or without? Soft or hard? With so many small decisions to make, we may find a simple trip to the supermarket long and tiring.

I read that too many choices can be a problem. We might avoid making a decision because we fear that we'll make the wrong one. In a world of endless choices, perhaps the best one we can make is to stop worrying. __45__ After all, one thing is for sure: Too many choices might not make our life simple, but they certainly show that we're living a life of plenty.`,
        questions: [
          choice(41, '第 41 空', 3, insertChoices, 'E', '本站参考：E 继续说明购物为什么没有变简单，并引出后文的多个例子。'),
          choice(42, '第 42 空', 3, insertChoices, 'D', '本站参考：D 用 Today 与前句的 When I was young 对照，后句继续说新口味增多。'),
          choice(43, '第 43 空', 3, insertChoices, 'B', '本站参考：B 用 another example 从糖果转到牙膏，后文接牙膏的过去与现在。'),
          choice(44, '第 44 空', 3, insertChoices, 'C', '本站参考：C 和后面的两个问句一起列出选面包时要做的决定。'),
          choice(45, '第 45 空', 3, insertChoices, 'A', '本站参考：A 承接 stop worrying，给出不要焦虑之后可以怎样做的建议。'),
        ],
      },
      {
        id: 'grammar', title: 'Ⅴ. 语法填空（20 分）',
        passage: `阅读下面短文，在空格处填入一个适当的词或使用括号中词语的正确形式填空。

Karen used to work in a restaurant. At first, she only made salads. Later she learned to make more dishes. She __46__ (final) became a manager of the restaurant.

Unluckily, the restaurant closed down five years ago. Karen had to consider __47__ she could do next. Around this time, Karen was introduced to __48__ family in need of a private cook. She __49__ (decide) to take the chance. So she began planning meals, buying groceries, __50__ cooking at the family's home for the parents and their three kids.

After having worked for the family __51__ two years, Karen learned that there was a great need for private cooks. So she started Karen's Kitchen, a small business of __52__ (she) own. She received many __53__ (order) from customers online and went cooking at their homes.

With the business growing, Karen hired more cooks to help out. Now Karen spends less time in __54__ (make) food. She has moved into more of a leadership role and is leading her cooks to bring delicious meals to more customers. "I find that doors will open for you," she says, "if you're brave enough __55__ (knock) on them."`,
        questions: [
          { id: '46', prompt: '第 46 空（final）', points: 2, accepted: ['finally'], reference: 'finally：副词，表示「终于」。' },
          { id: '47', prompt: '第 47 空', points: 2, accepted: ['what'], reference: 'what：在 she could do next 中作 do 的宾语，整个从句作 consider 的宾语。' },
          { id: '48', prompt: '第 48 空', points: 2, accepted: ['a'], reviewUnmatched: true, reference: 'a：第一次引入一个家庭。one 在特定强调语境中也能构成句子，但不是这里通常的冠词写法；是否给分需人工核对。' },
          { id: '49', prompt: '第 49 空（decide）', points: 2, accepted: ['decided'], reference: 'decided：按过去叙事顺序继续写一般过去时。' },
          { id: '50', prompt: '第 50 空', points: 2, accepted: ['and'], reference: 'and：连接 planning、buying 和 cooking 三个并列动作。' },
          { id: '51', prompt: '第 51 空', points: 2, accepted: ['for'], reviewUnmatched: true, reference: 'for：for two years 直接表示持续两年。over two years 可表示跨一段时间或超过两年，语义可能不同，本站不自动认作同一答案。' },
          { id: '52', prompt: '第 52 空（she）', points: 2, accepted: ['her'], reference: 'her：of her own 表示「她自己的」。' },
          { id: '53', prompt: '第 53 空（order）', points: 2, accepted: ['orders'], reference: 'orders：many 后接可数名词复数。' },
          { id: '54', prompt: '第 54 空（make）', points: 2, accepted: ['making'], reference: 'making：介词 in 后接动名词。' },
          { id: '55', prompt: '第 55 空（knock）', points: 2, accepted: ['to knock'], reference: 'to knock：enough to do 结构，这道有括号词，要写完整的不定式，包含 to。' },
        ],
      },
      {
        id: 'sentence', title: 'Ⅵ. 完成句子（15 分）',
        passage: '根据所给汉语提示，完成英语句子。',
        questions: [
          { id: '56', prompt: 'Two years ago, they ______________________ (住在这里).', points: 3, reviewUnmatched: true,
            accepted: ['lived here', 'were living here'], reference: 'lived here。were living here 也能表达过去某时在这里居住，具体给分以人工核对为准。' },
          { id: '57', prompt: 'Could you tell me ______________________ (图书馆在哪里)?', points: 3, reviewUnmatched: true,
            accepted: ['where the library is', 'where the library is located', 'where the library is situated'], reference: 'where the library is。接在 tell me 后，用陈述语序。' },
          { id: '58', prompt: '______________________ (我正在学习) when the doorbell rang.', points: 3, reviewUnmatched: true,
            accepted: ['I was studying'], reference: 'I was studying。门铃响时动作正在进行，参考用过去进行时。其他自然表达可人工核对。' },
          { id: '59', prompt: '______________________ (你最好) think carefully before making a decision.', points: 3, reviewUnmatched: true,
            accepted: ['You had better', "You'd better", 'You’d better'], reference: 'You had better 或 You’d better。should 也可以提出建议，但语气不完全相同，若老师认可可人工核对。' },
          { id: '60', prompt: '______________________ (我感到自豪) of the great changes that have taken place in my hometown.', points: 3, reviewUnmatched: true,
            accepted: ['I am proud', "I'm proud", 'I’m proud', 'I feel proud'], reference: 'I am proud / I’m proud / I feel proud，与空后 of 构成搭配。' },
        ],
      },
      {
        id: 'email', title: 'Ⅶ. 应用写作（10 分）',
        questions: [{
          id: '61', points: 10,
          prompt: '【写作内容】假定你是李华。你的外国朋友 Tom 对中国传统节日很感兴趣，请你用英语给他写一封邮件，介绍一个你喜欢的中国传统节日并说明原因。\n\n【写作要求】正文约 40 个英语单词，文中不可出现你自己的真实姓名、学校等信息。\n\n【评分标准】内容完整，语言规范，语篇连贯。',
          reference: '本站自写范例（非官方，正文约 40 词）：\n\nDear Tom,\n\nMy favorite Chinese festival is the Mid-Autumn Festival. My family usually has dinner together. We eat mooncakes and look at the moon. I like this festival because it gives us time to talk and makes me feel close to my family.\n\nBest wishes,\nLi Hua',
          rubric: [
            '本站自查 · 内容完整：写给 Tom，介绍一个喜欢的中国传统节日，并说清喜欢的原因。',
            '本站自查 · 语言规范：句子表达清楚，检查时态、词形与标点。',
            '本站自查 · 语篇连贯：写出节日与活动，再自然接到自己的感受或原因。',
            '本站自查 · 写作要求：正文约 40 个英语单词；使用题设身份，不写真实姓名、学校等信息。',
          ],
        }],
      },
    ],
  };
})();
