/*
 * STAAR 2.0 Development Seed Fixture: Canonical English II Curriculum
 * ---------------------------------------------------------------------------
 * Mirrors the relational rows in `db-seed.sql` (schools, modules, reading
 * passages, and TEKS-aligned questions) for local development when no remote
 * backend (`VITE_API_BASE_URL`) is configured.
 */

export const SEED_SCHOOLS = [
  {
    id: 1,
    city: 'Austin',
    county: 'Travis County',
    district: 'Austin ISD',
    schoolName: 'KIPP Austin Collegiate'
  },
  {
    id: 2,
    city: 'Austin',
    county: 'Travis County',
    district: 'Austin ISD',
    schoolName: 'KIPP Austin Brave'
  }
];

export const SEED_MODULES = {
  english_two: [
    {
      id: 1,
      alignedStandards: ['E2.8.A', 'E2.2.B', 'E2.8.G', 'E2.7.E.i', 'E2.8.D'],
      moduleName: 'An Informational Text'
    },
    {
      id: 2,
      alignedStandards: ['E2.2.B', 'E2.5.C', 'E2.8.A', 'E2.8.D', 'E2.8.F'],
      moduleName: 'A Poem'
    }
  ]
};

export const SEED_TEXTS = {
  english_two: [
    {
      id: 1,
      title: 'When Subtracting Technology Is a Plus',
      author: 'Unknown',
      genre: 'informational',
      publicationDate: null,
      content:
        '<p>When you get up in the morning, what is the first thing that you tend to do? By chance, is it to check notifications on a cell phone or a watch? For many, keeping up with the most current methods of learning, working, and entertaining themselves is a must. That usually means using the newest technology in nearly every aspect of life. Sometimes, though, constant connectivity can become a bit overwhelming. One beneficial approach is to find a balance in using technology and to consider which experiences might be better with less of it.</p>' +
        '<p>One major impact of advanced technology has been the change in the way people read. After centuries of reading the printed page, people now do much of their reading on various kinds of screens. While this shift may be convenient and cost-effective, some people choose to read on paper when possible. One concern is that light from computer and phone screens can eventually cause teary, overworked eyes. In addition, recent research has found advantages to reading on paper. Professor Virginia Clinton of the University of North Dakota examined results from 33 studies on reading. This research indicates that students demonstrated better comprehension when reading on paper rather than on screens. That does not mean to never read on a phone. It simply suggests that reading on paper has not yet lost its value.</p>' +
        '<p>In the era of location-tracking software and GPS mapping, people traveling over long distances take comfort in the routes offered by computers and satellites. However, not all trips are about getting to a destination in the fastest way. In some cases, exploring routes without electronic assistance might be more satisfying. The best balance might be found in using GPS for an on-time school or work commute while being open to turning off the satellite guidance on a more leisurely journey.</p>' +
        '<p>How often do people find themselves watching videos or using websites only to find that hours have passed with their original goal unfulfilled? That is because designers use artificial intelligence to create video feeds and music streaming programs that absorb your attention for as long as possible. Therefore, it is more important than ever to be able to take a step back. Users should evaluate whether they are making good use of digital applications or whether the applications are dominating their time without working in their best interests. One of the best arguments for moderating the use of technology is that this approach can give people back their time and sense of agency.</p>' +
        '<p>Consider tasks such as shopping or doing research. These activities often rely on using network technology. As a society, people will continue to move in this direction. In spite of this trend, it is possible that some overlooked gems require a different kind of search. There are historical records, literature, and music that are not yet recorded in digital formats. It may be necessary to physically visit archives, libraries, or music shops to find what the web may have failed to capture. Even in the digitized age, there are still adventures and exciting rediscoveries that may not be found in search engine results.</p>' +
        "<p>Changing or reconsidering use of technology may seem unrealistic or even backward. In the early nineteenth century, some groups of workers banded together in England and began to destroy manufacturing machinery. They believed that new machinery took away people's jobs. These protesters were known as Luddites. Today this term refers to people who resist innovation and new inventions. It would be misguided to adopt such a strange stance today when access to essential things such as literacy, medicine, and healthy food depends greatly on the latest technologies. There is no need to reject technological progress. Instead, the best path is to examine people's habits and try to understand the possible costs of overreliance on these powerful tools.</p>" +
        '<p>Technology is situational. The value of it often depends on the judgment of the user. Sometimes small decisions can go a long way. One practice used by some folks is downshifting during evenings or relaxation times from viewing screens to one of the oldest pastimes: listening to stories. Through podcasts, music, and other recordings, many people have gone back nearly a century to times when great-great-grandparents listened to news and entertainment on the only technology available at home, radio broadcasts.</p>' +
        '<p>The constant flow of news, notifications, and social communications across a wave of platforms and apps has led to the development of tech-free retreats. This new industry is capitalizing on some people\'s desire to roll back the intrusive influence of their electronic devices. These "digital detox" programs can last anywhere from 24 hours to several weeks. People pay a fee to meditate, exercise, and socialize without using smart technology. As it turns out, there is a better option than an expensive one-time escape from the tide of information. The more sensible choice is to set goals, use time limits, and avoid letting any single medium or electronic platform take up the lion\'s share of your time.</p>' +
        '<p>Consider how much healthier, better rested, and more productive people can be when they make wise use of smartphones and social media. The ability of your actions and choices is an advantage that your ancestors did not have. The risk is that by deferring so many of your daily decisions to convenient technology and artificial intelligence, you may be missing out on irreplaceable human experiences. These might include having an uninterrupted conversation with a friend, getting a peaceful night\'s sleep, or making the perfect paper airplane -- and taking it outside for a test flight.</p>',
      context: 'This sample article was written in 2022.',
      moduleId: 1
    },
    {
      id: 2,
      title: 'The Fox',
      author: 'Faith Shearin',
      genre: 'poetry',
      publicationDate: 2011,
      content:
        '<p>It was an ordinary morning: November, thin, light,<br>and we paused over our pancakes to watch<br>something red move outside. Our house is on</p>' +
        '<p>an untamed patch of land and, across the lagoon,<br>another house surrounded by trees. On the banks<br>of their shore, facing us: a fox. We thought</p>' +
        "<p>he might be a dog at first for he trotted and sniffed<br>like a dog but when he turned to us<br>we knew he was nobody's pet. His face was arranged</p>" +
        "<p>like a child's face -- playful, dainty -- and his eyes<br>were liquid and wild. He stood for awhile, looking out,<br>as if he could see us in our pajamas, then found</p>" +
        '<p>a patch of sand beneath a tree and turned himself<br>into a circle of fur: his head tucked into his tail.<br>It was awful to watch him sleep: exposed,</p>' +
        '<p>tiny, his eyes closed. How can any animal<br>be safe enough to rest? But while I washed<br>our dishes he woke again, yawned, and ran</p>' +
        '<p>away to the places only foxes know. My God<br>I was tired of being a person. Even now his tail<br>gestures to me across the disapproving lagoon.</p>',
      context:
        'This poem is from MOVING THE PIANO, published by the Stephen F. Austin Press in 2011.',
      moduleId: 2
    }
  ]
};

export const SEED_QUESTIONS = [
  {
    id: 1,
    alignedStandards: ['E2.8.A'],
    questionType: 'multi-select',
    question: [
      'What are the two most likely reasons the author includes paragraph six?'
    ],
    answerChoices: [
      'To acknowledge the importance and the role technology has in our lives',
      'To reveal that people in the past foresaw that technology would cause major problems',
      'To explain that England has an impressive history of technological innovation',
      'To reassure the reader that the author is not advising people to stop using technology completely',
      'To suggest that we should change our approaches to developing medicines and ensuring food safety'
    ],
    correctAnswer: [
      'To acknowledge the importance and the role technology has in our lives',
      'To reassure the reader that the author is not advising people to stop using technology completely'
    ],
    totalPossiblePoints: 1,
    selectedText:
      "Changing or reconsidering use of technology may seem unrealistic or even backward. In the early nineteenth century, some groups of workers banded together in England and began to destroy malfunctioning machinery. They believed that new machines took away people's jobs. These protesters were known as Luddites. Today this term refers to people who resist innovation and new inventions. It would be misguided to adopt such a stance today when access to essential things such as literacy, medicine, and healthy food depends greatly on the latest technologies. There is no need to reject technological progress. Instead, the best path is to examine people's habits and try to understand the possible costs of overreliance on these powerful tools.",
    incompleteStatement: null,
    directions: null,
    conditions: null,
    moduleId: 1
  },
  {
    id: 2,
    alignedStandards: ['E2.8.D'],
    questionType: 'multiple-choice',
    question: [
      'In paragraph 7, what word does the author use to create a sense of slowing down or moving into a calmer, more thoughtful mode?'
    ],
    answerChoices: ['situational', 'century', 'downshifting', 'value'],
    correctAnswer: ['downshifting'],
    totalPossiblePoints: 1,
    selectedText: null,
    incompleteStatement: null,
    directions: null,
    conditions: null,
    moduleId: 1
  },
  {
    id: 3,
    alignedStandards: ['E2.7.E.i'],
    questionType: 'two-part',
    question: [
      "Which of these best states the author's main claim about technology?",
      'Which sentence from the selection best supports the answer to Part A?'
    ],
    answerChoices: [
      [
        'We need to continue to innovate our technology so that we can eventually reduce the harms it causes.',
        'Technology is the primary source of all the problems in our world today.',
        'We should make thoughtful choices about technology and avoid being overly dependent on it.',
        'Over time, technological devices become more advanced, while society struggles to improve.'
      ],
      [
        'For many, keeping up with the most current methods of learning, working, and entertaining themselves is a must. (paragraph one)',
        'One concern is that light from computer and phone screens can eventually cause teary, overworked eyes. (paragraph two)',
        'In the era of location-tracking software and GPS mapping, people traveling over long distances take comfort in the routes offered by computers and satellites. (paragraph three)',
        'Users should evaluate whether they are making good use of digital applications or whether the applications are dominating their time without working in their best interests. (paragraph four)'
      ]
    ],
    correctAnswer: [
      'We should make thoughtful choices about technology and avoid being overly dependent on it.',
      'Users should evaluate whether they are making good use of digital applications or whether the applications are dominating their time without working in their best interests. (paragraph four)'
    ],
    totalPossiblePoints: 2,
    selectedText: null,
    incompleteStatement: null,
    directions: null,
    conditions: null,
    moduleId: 1
  },
  {
    id: 4,
    alignedStandards: ['E2.2.B'],
    questionType: 'text-entry',
    question: null,
    answerChoices: null,
    correctAnswer: ['constant'],
    totalPossiblePoints: 1,
    selectedText:
      "The constant flow of news, notifications, and social communications across a wave of platforms and apps has led to the development of tech-free retreats. This new industry is capitalizing on some people's desire to roll back the intrusive influence of their electronic devices.",
    incompleteStatement:
      'The word <input> provides the best clue to the meaning of the word intrusive as it is used in paragraph eight.',
    directions:
      'Read these sentences from paragraph eight, and use one word directly from them to complete the statement below.',
    conditions: null,
    moduleId: 1
  },
  {
    id: 5,
    alignedStandards: ['E2.8.G'],
    questionType: 'table-style',
    question: [
      'Which of the following statements represent ideas emphasized in the emotional appeal in this quotation?'
    ],
    answerChoices: [
      'People should not attempt to reduce the number of daily decisions they have to make.',
      'Certain ways of using technology can have regrettable outcomes.',
      'It is too difficult to rest properly if a person owns a large number of networked devices.',
      'People should remember to focus on what is essential and rewarding in life.',
      "Manual projects are a better use of one's time than tasks that rely on technology."
    ],
    correctAnswer: [
      'Certain ways of using technology can have regrettable outcomes.',
      'People should remember to focus on what is essential and rewarding in life.'
    ],
    totalPossiblePoints: 1,
    selectedText:
      "The risk is that by deferring so many of your daily decisions to convenient technology and artificial intelligence, you may be missing out on irreplaceable human experiences. These might include having an uninterrupted conversation with a friend, getting a peaceful night's sleep, or making the perfect paper airplane -- and taking it outside for a test flight.",
    incompleteStatement: null,
    directions:
      'Read this quotation from paragraph nine, and select the correct answer in each row.',
    conditions: [
      'Is an Idea Emphasized in the Appeal',
      'Is Not an Idea Emphasized in the Appeal'
    ],
    moduleId: 1
  },
  {
    id: 6,
    alignedStandards: ['E2.2.B'],
    questionType: 'text-entry',
    question: null,
    answerChoices: null,
    correctAnswer: ['dainty'],
    totalPossiblePoints: 1,
    selectedText: null,
    incompleteStatement:
      "In stanza 4 (lines 10-12), the poet uses the word <input> to emphasize the fox's delicate beauty.",
    directions: 'Enter your answer in the box.',
    conditions: null,
    moduleId: 2
  },
  {
    id: 7,
    alignedStandards: ['E2.5.C'],
    questionType: 'multi-select',
    question: [
      'Which lines from the poem support the impulse to connect with nature? Select TWO correct answers.'
    ],
    answerChoices: [
      'It was an ordinary morning: November, thin, light',
      'an untamed patch of land and, across the lagoon',
      'he might be a dog at first for he trotted and sniffed / like a dog',
      'found / a patch of sand beneath a tree and turned himself',
      'My God / I was tired of being a person'
    ],
    correctAnswer: [
      'an untamed patch of land and, across the lagoon',
      'My God / I was tired of being a person'
    ],
    totalPossiblePoints: 1,
    selectedText: null,
    incompleteStatement: null,
    directions: null,
    conditions: null,
    moduleId: 2
  },
  {
    id: 8,
    alignedStandards: ['E2.8.D'],
    questionType: 'two-part',
    question: [
      "The poet's description of the setting emphasizes...",
      'Which phrase from the poem best supports the answer to Part A?'
    ],
    answerChoices: [
      [
        'a clear portrayal of life',
        'the importance of preserving nature',
        'a sense of playfulness',
        'the freedom of the outdoors'
      ],
      [
        'something red move outside',
        'untamed patch of land',
        'head tucked into his tail',
        'safe enough to rest'
      ]
    ],
    correctAnswer: ['the freedom of the outdoors', 'untamed patch of land'],
    totalPossiblePoints: 2,
    selectedText: null,
    incompleteStatement: null,
    directions: null,
    conditions: null,
    moduleId: 2
  },
  {
    id: 9,
    alignedStandards: ['E2.8.A'],
    questionType: 'table-style',
    question: ["Which phrases from the poem emphasize the fox's vulnerability?"],
    answerChoices: [
      'he trotted and sniffed',
      "like a child's face",
      'He stood for awhile',
      'a patch of sand',
      'circle of fur'
    ],
    correctAnswer: ["like a child's face", 'circle of fur'],
    totalPossiblePoints: 1,
    selectedText: null,
    incompleteStatement: null,
    directions: 'Select the correct answer in each row.',
    conditions: [
      "Emphasizes the Fox's Vulnerability",
      "Does Not Emphasize the Fox's Vulnerability"
    ],
    moduleId: 2
  },
  {
    id: 10,
    alignedStandards: ['E2.8.F'],
    questionType: 'multiple-choice',
    question: [
      "What is the most likely reason the poet includes the words 'tired' and 'disapproving' in the last stanza?"
    ],
    answerChoices: [
      'to show how dissatisfied the speaker is with their daily human life',
      "to highlight the speaker's disdain for wildlife",
      'to show how grateful the speaker is for the lagoon',
      "to highlight the speaker's desire for safety and rest"
    ],
    correctAnswer: [
      'to show how dissatisfied the speaker is with their daily human life'
    ],
    totalPossiblePoints: 1,
    selectedText: null,
    incompleteStatement: null,
    directions: null,
    conditions: null,
    moduleId: 2
  }
];
