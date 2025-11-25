import type { StudyMethodData } from '../types';

export const studyMethods: StudyMethodData[] = [
  {
    id: 'blurring',
    name: 'Blurring Method',
    description: 'Switch topics often, 20–30 min sessions, write what you learned',
    workTips: [
      'Switch to a different topic every 20-30 minutes to keep your brain engaged',
      'After each switch, write down 2-3 key points you learned from the previous topic',
      'Use the variety to prevent mental fatigue and maintain focus',
      'Keep a quick note of connections between different topics you study'
    ],
    breakTips: [
      'During breaks, review the notes you wrote between topic switches',
      'Take a quick walk to help your brain process the different topics',
      'Use break time to mentally connect ideas from different subjects'
    ]
  },
  {
    id: 'feynman',
    name: 'Feynman Technique',
    description: 'Explain simply, pretend teaching',
    workTips: [
      'Pretend you\'re teaching the concept to a 12-year-old - use simple language',
      'If you can\'t explain it simply, you don\'t understand it well enough - go back and review',
      'Write your explanation as if creating a lesson plan',
      'Use analogies and examples to make complex ideas accessible'
    ],
    breakTips: [
      'During breaks, try explaining what you learned to yourself out loud',
      'Think about how you would answer questions from a curious student',
      'Identify any gaps in your understanding that came up during explanation'
    ]
  },
  {
    id: 'cornell',
    name: 'Cornell Method',
    description: 'Left: questions, right: answers',
    workTips: [
      'Divide your page: left column for questions, right column for answers',
      'Write questions as you study - they help you identify what\'s important',
      'Use the right side for detailed notes, examples, and explanations',
      'Review by covering the right side and trying to answer the questions'
    ],
    breakTips: [
      'During breaks, review your questions and see if you can answer them without looking',
      'Add new questions based on what you just learned',
      'Use break time to organize and refine your Cornell notes'
    ]
  },
  {
    id: 'recall',
    name: '3–2–1 Recall',
    description: 'Read 3×, repeat 2×, write 1×',
    workTips: [
      'First pass: Read the material once to get an overview',
      'Second pass: Read again, this time focusing on key concepts',
      'Third pass: Read one more time, looking for details and connections',
      'Then: Repeat the main points out loud twice',
      'Finally: Write down the key information once from memory'
    ],
    breakTips: [
      'During breaks, try to recall what you wrote without looking at your notes',
      'Use the break to let the information settle before your next session',
      'Review your written notes and see if you missed anything important'
    ]
  },
  {
    id: 'threeRooms',
    name: 'Study in 3 Rooms',
    description: 'Change room every ~45 min',
    workTips: [
      'Plan to study in three different locations during your session',
      'Each room change helps create new memory associations',
      'Use different rooms for different topics or study phases',
      'The physical movement helps maintain alertness and focus'
    ],
    breakTips: [
      'Use breaks to move to your next study location',
      'Take a moment to mentally transition between topics as you change rooms',
      'The change of environment helps consolidate what you learned in the previous room'
    ]
  },
  {
    id: 'backwards',
    name: 'Study Backwards',
    description: 'Start from last chapter, good for concepts',
    workTips: [
      'Start with the last chapter or most recent material and work backwards',
      'This approach helps you understand how concepts build on each other',
      'You\'ll see the "why" behind earlier concepts when you study them later',
      'Great for subjects where later chapters explain earlier foundations'
    ],
    breakTips: [
      'During breaks, think about how the material you just studied connects to earlier chapters',
      'Use break time to mentally map the relationships between concepts',
      'Reflect on how starting backwards changed your understanding'
    ]
  }
];

