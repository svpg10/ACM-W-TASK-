import { QuizQuestion } from '../types';

export const INITIAL_QUESTIONS: QuizQuestion[] = [
  // --- ACM QUESTIONS ---
  {
    id: 'acm-1',
    category: 'acm',
    difficulty: 'beginner',
    badgeTag: 'ACM Foundation',
    question: 'What does the acronym "ACM" officially stand for?',
    options: [
      'Association for Computing Machinery',
      'Academy of Computer Mathematics',
      'Alliance for Computational Methods',
      'American Council of Microprocessors'
    ],
    correctIndex: 0,
    explanation: 'Founded in 1947, ACM is the world\'s largest educational and scientific computing society, uniting educators, researchers, and professionals.',
    funFact: 'ACM was established at Columbia University during a meeting on September 15, 1947.'
  },
  {
    id: 'acm-2',
    category: 'acm',
    difficulty: 'beginner',
    badgeTag: 'Turing Award',
    question: 'Often called the "Nobel Prize of Computing", which prestigious annual award is administered by ACM?',
    options: [
      'The John von Neumann Medal',
      'The ACM A.M. Turing Award',
      'The Ada Lovelace International Prize',
      'The Claude Shannon Information Laurel'
    ],
    correctIndex: 1,
    explanation: 'The ACM A.M. Turing Award carries a $1,000,000 prize provided by Google and recognizes contributions of lasting and major technical importance to computer science.',
    funFact: 'Alan Turing, the award\'s namesake, developed the theoretical foundation for general-purpose computers with his 1936 Turing Machine.'
  },
  {
    id: 'acm-3',
    category: 'acm',
    difficulty: 'intermediate',
    badgeTag: 'ACM History',
    question: 'Who was the first recipient of the ACM A.M. Turing Award in 1966 for work on advanced programming and compiler construction?',
    options: [
      'Edsger W. Dijkstra',
      'Donald Knuth',
      'Alan J. Perlis',
      'Grace Hopper'
    ],
    correctIndex: 2,
    explanation: 'Alan J. Perlis received the inaugural Turing Award in 1966 for his pioneering work in the field of advanced computer programming and compiler construction.',
    funFact: 'Alan Perlis famously authored the humorous and insightful "Epigrams on Programming" in 1982.'
  },
  {
    id: 'acm-4',
    category: 'acm',
    difficulty: 'intermediate',
    badgeTag: 'Pioneers',
    question: 'Who became the first woman to receive the ACM A.M. Turing Award in 2006 for optimizing compiler techniques?',
    options: [
      'Frances E. Allen',
      'Barbara Liskov',
      'Shafi Goldwasser',
      'Margaret Hamilton'
    ],
    correctIndex: 0,
    explanation: 'Frances E. Allen won the 2006 Turing Award for pioneering contributions to the theory and practice of optimizing compiler techniques that laid the foundation for modern optimizing compilers.',
    funFact: 'Barbara Liskov was the second woman to win (2008), followed by Shafi Goldwasser (2012).'
  },
  {
    id: 'acm-5',
    category: 'acm',
    difficulty: 'beginner',
    badgeTag: 'ACM SIGs',
    question: 'Which ACM Special Interest Group (SIG) is specifically dedicated to Artificial Intelligence research and applications?',
    options: [
      'SIGGRAPH',
      'SIGAI',
      'SIGKDD',
      'SIGPLAN'
    ],
    correctIndex: 1,
    explanation: 'SIGAI (Special Interest Group on Artificial Intelligence) fosters inquiry into the nature of intelligence, autonomous behavior, and machine reasoning.',
    funFact: 'ACM has over 35 Special Interest Groups spanning Graphics (SIGGRAPH), Knowledge Discovery (SIGKDD), and Human-Computer Interaction (SIGCHI).'
  },
  {
    id: 'acm-6',
    category: 'acm',
    difficulty: 'beginner',
    badgeTag: 'ACM Resources',
    question: 'What is ACM\'s vast online repository containing millions of peer-reviewed articles, conference proceedings, and technical magazines?',
    options: [
      'ACM Digital Library',
      'ACM CodeHub',
      'ACM ScholarNet',
      'ACM ResearchCloud'
    ],
    correctIndex: 0,
    explanation: 'The ACM Digital Library (DL) is the most comprehensive database of computing literature, housing over 3 million publications.',
    funFact: 'ACM recently initiated transitions to Open Access for its vast historical archive.'
  },
  {
    id: 'acm-7',
    category: 'acm',
    difficulty: 'intermediate',
    badgeTag: 'ACM SIGs',
    question: 'Which premier ACM Special Interest Group conference is internationally famous for computer graphics, 3D animation, and interactive techniques?',
    options: [
      'SIGGRAPH',
      'SIGOPS',
      'SIGCOMM',
      'SIGSOFT'
    ],
    correctIndex: 0,
    explanation: 'SIGGRAPH is the annual world conference on computer graphics and interactive techniques, having debuted countless rendering and CGI breakthroughs.',
    funFact: 'Many foundational algorithms used in Pixar animations and Hollywood VFX premiered at SIGGRAPH.'
  },
  {
    id: 'acm-8',
    category: 'acm',
    difficulty: 'intermediate',
    badgeTag: 'Competitions',
    question: 'What world-renowned collegiate competitive programming contest was historically launched and nurtured under ACM auspices?',
    options: [
      'Google Code Jam',
      'TopCoder Open',
      'ICPC (International Collegiate Programming Contest)',
      'Meta Hacker Cup'
    ],
    correctIndex: 2,
    explanation: 'The ICPC began in 1970 as a competition hosted by the Alpha Chapter of the UPE Computer Science Honor Society and grew under ACM\'s stewardship.',
    funFact: 'Teams of three students share a single computer and race against time to solve complex algorithmic puzzles.'
  },
  {
    id: 'acm-9',
    category: 'acm',
    difficulty: 'advanced',
    badgeTag: 'ACM Ethics',
    question: 'The ACM Code of Ethics and Professional Conduct establishes that computing professionals should primarily:',
    options: [
      'Contribute to society and to human well-being, acknowledging that all people are stakeholders',
      'Prioritize software delivery speed over verification whenever business requires',
      'Patent all algorithmic discoveries before public academic disclosure',
      'Limit access to computing tools exclusively to certified engineers'
    ],
    correctIndex: 0,
    explanation: 'Section 1.1 of the ACM Code of Ethics mandates that computing professionals act for the benefit of society and recognize everyone affected by systems as stakeholders.',
    funFact: 'The ACM Code of Ethics was comprehensively updated in 2018 to address modern AI, privacy, and systemic automation risks.'
  },
  {
    id: 'acm-10',
    category: 'acm',
    difficulty: 'intermediate',
    badgeTag: 'Turing Award AI',
    question: 'In 2018, which "Godfathers of Deep Learning" trio jointly received the ACM A.M. Turing Award?',
    options: [
      'Yoshua Bengio, Geoffrey Hinton, and Yann LeCun',
      'Andrew Ng, Fei-Fei Li, and Demis Hassabis',
      'Ian Goodfellow, Ilya Sutskever, and Sam Altman',
      'John McCarthy, Marvin Minsky, and Herbert Simon'
    ],
    correctIndex: 0,
    explanation: 'Yoshua Bengio, Geoffrey Hinton, and Yann LeCun were honored for conceptual and engineering breakthroughs that made deep neural networks a critical component of computing.',
    funFact: 'Hinton also won the 2024 Nobel Prize in Physics for foundational discoveries in artificial neural networks.'
  },

  // --- ARTIFICIAL INTELLIGENCE QUESTIONS ---
  {
    id: 'ai-1',
    category: 'ai',
    difficulty: 'beginner',
    badgeTag: 'AI History',
    question: 'Which 1956 workshop is universally considered the founding event of Artificial Intelligence as an academic research field?',
    options: [
      'The Dartmouth Summer Research Project on AI',
      'The Bletchley Park Cryptography Summit',
      'The MIT Cybernetics Symposium',
      'The Stanford Logic Colloquium'
    ],
    correctIndex: 0,
    explanation: 'Organized by John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon at Dartmouth College in 1956, the term "Artificial Intelligence" was formally coined.',
    funFact: 'John McCarthy later invented the LISP programming language, which became the standard language for AI research for decades.'
  },
  {
    id: 'ai-2',
    category: 'ai',
    difficulty: 'beginner',
    badgeTag: 'AI Foundations',
    question: 'What is the "Turing Test" designed to evaluate in a machine?',
    options: [
      'Its floating-point calculation speed',
      'Its ability to exhibit human-equivalent intelligent conversational behavior',
      'Its energy efficiency when running deep neural layers',
      'Its resistance to hardware fault corruption'
    ],
    correctIndex: 1,
    explanation: 'Introduced by Alan Turing in his 1950 paper "Computing Machinery and Intelligence", the Imitation Game checks if an interrogator cannot distinguish human from machine text responses.',
    funFact: 'Turing originally opened his 1950 paper with the question: "Can machines think?"'
  },
  {
    id: 'ai-3',
    category: 'ai',
    difficulty: 'beginner',
    badgeTag: 'Machine Learning',
    question: 'What is the fundamental difference between Supervised and Unsupervised Machine Learning?',
    options: [
      'Supervised uses labeled training data; Unsupervised discovers patterns in unlabeled data',
      'Supervised is faster; Unsupervised requires quantum processors',
      'Supervised is only for audio; Unsupervised is only for images',
      'Supervised models do not use loss functions'
    ],
    correctIndex: 0,
    explanation: 'Supervised learning maps inputs to known target labels (e.g., classification/regression), whereas unsupervised learning finds clustering and underlying structure without explicit labels.',
    funFact: 'Semi-supervised and self-supervised learning combine both approaches to train modern massive LLMs.'
  },
  {
    id: 'ai-4',
    category: 'ai',
    difficulty: 'intermediate',
    badgeTag: 'Model Training',
    question: 'What does "Overfitting" mean in the context of Machine Learning?',
    options: [
      'The model performs exceptionally on training data but fails to generalize to unseen test data',
      'The model runs out of GPU memory during batch calculation',
      'The model produces answers that are too short',
      'The training process takes less than 1 epoch to converge'
    ],
    correctIndex: 0,
    explanation: 'Overfitting occurs when a model memorizes noise and specific idiosyncrasies of the training set rather than learning true generalizable features.',
    funFact: 'Techniques like Dropout, L1/L2 Regularization, and Data Augmentation are standard defenses against overfitting.'
  },
  {
    id: 'ai-5',
    category: 'ai',
    difficulty: 'intermediate',
    badgeTag: 'Deep Learning',
    question: 'What neural network algorithm calculates gradients of the loss function backwards to update weights via gradient descent?',
    options: [
      'Backpropagation',
      'Forward Convolution',
      'Monte Carlo Tree Search',
      'Simulated Annealing'
    ],
    correctIndex: 0,
    explanation: 'Backpropagation applies the chain rule of calculus in reverse order through the network layers to efficiently compute partial derivatives for parameter updates.',
    funFact: 'While popularized in AI by Rumelhart, Hinton, and Williams in 1986, automatic differentiation principles date back to Seppo Linnainmaa in 1970.'
  },
  {
    id: 'ai-6',
    category: 'ai',
    difficulty: 'intermediate',
    badgeTag: 'Modern Architectures',
    question: 'Which revolutionary neural architecture introduced by Google researchers in 2017 forms the backbone of modern LLMs (GPT, Gemini, Claude)?',
    options: [
      'Transformer (Self-Attention)',
      'Recurrent Neural Network (Elman RNN)',
      'Hopfield Network',
      'Self-Organizing Map (SOM)'
    ],
    correctIndex: 0,
    explanation: 'The paper "Attention Is All You Need" (Vaswani et al., 2017) replaced sequential recurrent layers with parallelizable self-attention mechanisms.',
    funFact: 'The self-attention mechanism computes pairwise relationships across all tokens in an input sequence simultaneously.'
  },
  {
    id: 'ai-7',
    category: 'ai',
    difficulty: 'beginner',
    badgeTag: 'Neural Networks',
    question: 'Why are non-linear "Activation Functions" (such as ReLU, GELU, or Sigmoid) crucial in neural networks?',
    options: [
      'Without them, any multi-layer network would collapse into a simple single linear transformation',
      'They prevent the computer monitor from flickering during training',
      'They convert all floating point numbers into 8-bit integers',
      'They encrypt the weights so external users cannot copy them'
    ],
    correctIndex: 0,
    explanation: 'A stack of purely linear operations is mathematically equivalent to a single linear operation. Non-linear activations allow networks to approximate arbitrarily complex functions.',
    funFact: 'ReLU (Rectified Linear Unit: f(x) = max(0, x)) is one of the simplest yet most effective activation functions.'
  },
  {
    id: 'ai-8',
    category: 'ai',
    difficulty: 'intermediate',
    badgeTag: 'Reinforcement Learning',
    question: 'In Reinforcement Learning (RL), the system learns by having an "Agent" take actions in an "Environment" to maximize cumulative:',
    options: [
      'Reward signals',
      'Memory footprint',
      'Latency metrics',
      'Token count'
    ],
    correctIndex: 0,
    explanation: 'RL is framed around maximizing cumulative expected scalar reward through exploration and exploitation (e.g. Q-learning, Policy Gradients, PPO).',
    funFact: 'Reinforcement Learning from Human Feedback (RLHF) is a core technique used to align ChatGPT and Gemini with helpful human instructions.'
  },
  {
    id: 'ai-9',
    category: 'ai',
    difficulty: 'beginner',
    badgeTag: 'Computer Vision',
    question: 'Which neural network layer type uses sliding spatial filters/kernels to detect visual features like edges, textures, and objects in images?',
    options: [
      'Convolutional Layer (CNN)',
      'Lookup Embedding Layer',
      'Softmax Normalizer',
      'Binary Quantizer'
    ],
    correctIndex: 0,
    explanation: 'Convolutional Neural Networks (CNNs) preserve spatial relationships by sliding receptive field kernels across pixel matrices.',
    funFact: 'Yann LeCun\'s LeNet-5 (1998) used CNNs to automate check and zip code recognition on mail in US post offices.'
  },
  {
    id: 'ai-10',
    category: 'ai',
    difficulty: 'intermediate',
    badgeTag: 'NLP & LLMs',
    question: 'In Natural Language Processing (NLP), what is the process of converting raw text words or subwords into dense numerical vector representations?',
    options: [
      'Token Embedding',
      'Pixel Rasterization',
      'De-serialization',
      'Garbage Collection'
    ],
    correctIndex: 0,
    explanation: 'Token embeddings project discrete vocabulary tokens into high-dimensional continuous geometric spaces where semantic similarities correspond to vector proximity.',
    funFact: 'Word2Vec (2013) famously proved geometric analogies in vector space, such as: Vector("King") - Vector("Man") + Vector("Woman") ≈ Vector("Queen").'
  }
];

export const RANK_TIERS = [
  { threshold: 90, title: 'Turing Laureate', badge: '🏆 Legend', description: 'Elite mastery of computing history and cutting-edge intelligence paradigms.' },
  { threshold: 75, title: 'ACM Fellow & AI Architect', badge: '⚡ Master', description: 'Exceptional grasp of computer science foundational systems and deep learning.' },
  { threshold: 55, title: 'Senior Algorithmist', badge: '💡 Proficient', description: 'Strong working knowledge across core ACM milestones and ML models.' },
  { threshold: 35, title: 'Emerging Researcher', badge: '🌱 Apprentice', description: 'Good foundational comprehension with room to sharpen theoretical depth.' },
  { threshold: 0, title: 'Computing Novice', badge: '🎯 Explorer', description: 'Welcome to the journey! Review the deep dive explanations to level up.' }
];

export function getRankForScore(score: number, total: number) {
  const pct = Math.round((score / total) * 100);
  for (const tier of RANK_TIERS) {
    if (pct >= tier.threshold) {
      return { ...tier, percentage: pct };
    }
  }
  return { ...RANK_TIERS[RANK_TIERS.length - 1], percentage: pct };
}
