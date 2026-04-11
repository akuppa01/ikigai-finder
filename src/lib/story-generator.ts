import { AIReport } from './types';

// Story themes inspired by ancient wisdom traditions
export interface StoryTheme {
  id: string;
  name: string;
  description: string;
  hero: string;
  journey: string;
  opening: string;
  passion: string;
  skills: string;
  career: string;
  learning: string;
  innovation: string;
  action: string;
  closing: string;
}

export const STORY_THEMES: StoryTheme[] = [
  {
    id: 'wandering-monk',
    name: 'The Wandering Monk',
    description: 'A seeker of wisdom traveling through ancient lands',
    hero: 'wandering monk',
    journey: 'spiritual quest',
    opening:
      'In the misty mountains of ancient wisdom, a wandering monk sets forth on a journey of self-discovery. Like you, they seek to understand their true purpose in the grand tapestry of life.',
    passion:
      'Just as the monk finds joy in the simple act of tending a garden or sharing wisdom with travelers, you too have discovered what brings light to your soul.',
    skills:
      'The monk carries with them the tools of their trade—patience, wisdom, and the ability to listen deeply. These are the gifts you bring to the world.',
    career:
      'Like the monk who finds their calling in teaching, healing, or guiding others, your path reveals itself through service and purpose.',
    learning:
      'The monk never stops learning, studying ancient texts and learning from every encounter. Your educational journey is a continuation of this timeless tradition.',
    innovation:
      'Even the most traditional monk finds new ways to share wisdom, adapting ancient teachings to modern times. Your entrepreneurial spirit follows this same path.',
    action:
      'The monk knows that wisdom without action is like a seed that never grows. Your first steps are the beginning of your transformation.',
    closing:
      'As the monk returns to their monastery with new wisdom, you too return to your daily life, but forever changed by the insights you have gained.',
  },
  {
    id: 'samurai-warrior',
    name: 'The Samurai Warrior',
    description: 'A noble warrior seeking balance between strength and wisdom',
    hero: 'samurai warrior',
    journey: 'path of honor and mastery',
    opening:
      'In the ancient dojo of life, a samurai warrior prepares for battle—not with swords, but with the weapons of purpose, skill, and determination. Your journey mirrors this noble path.',
    passion:
      'The samurai finds beauty in the art of the blade, the discipline of practice, and the honor of service. Your passions are your own form of martial art.',
    skills:
      'Like the samurai who masters the way of the sword, you have developed skills that are both powerful and precise, ready to be wielded with purpose.',
    career:
      "The samurai serves their lord with honor and dedication. Your career path is your own form of service, where your skills meet the world's needs.",
    learning:
      'The samurai never stops training, always seeking to perfect their technique. Your education is your own form of continuous improvement.',
    innovation:
      'Even the most traditional samurai adapts their techniques to new challenges. Your entrepreneurial ideas are your way of creating new forms of service.',
    action:
      'The samurai knows that preparation without action leads to defeat. Your action plan is your strategy for victory in the battle of life.',
    closing:
      'As the samurai sheaths their sword after a successful mission, you too can rest knowing that your journey has brought you closer to your true purpose.',
  },
  {
    id: 'philosopher-sage',
    name: 'The Philosopher Sage',
    description: 'A wise thinker seeking truth and understanding',
    hero: 'philosopher sage',
    journey: 'quest for knowledge and truth',
    opening:
      'In the hallowed halls of ancient wisdom, a philosopher sage contemplates the mysteries of existence. Like you, they seek to understand the deeper meaning of life and purpose.',
    passion:
      'The sage finds joy in the pursuit of knowledge, the beauty of ideas, and the satisfaction of understanding. Your passions are your own form of philosophical inquiry.',
    skills:
      'The sage has honed the art of critical thinking, analysis, and synthesis. These are the tools you bring to every challenge you face.',
    career:
      'The sage shares their wisdom through teaching, writing, and guiding others. Your career path is your way of sharing your unique insights with the world.',
    learning:
      'The sage knows that learning is a lifelong journey, never complete but always rewarding. Your educational path continues this eternal quest.',
    innovation:
      'The sage creates new ways of thinking, new frameworks for understanding. Your entrepreneurial ideas are your own contributions to human knowledge.',
    action:
      'The sage knows that wisdom without application is merely intellectual exercise. Your action plan is how you put your insights into practice.',
    closing:
      "As the sage closes their books and steps into the world, you too emerge from your contemplation, ready to apply your newfound understanding to life's challenges.",
  },
  {
    id: 'lost-traveler',
    name: 'The Lost Traveler',
    description: 'A wanderer discovering hidden paths and new horizons',
    hero: 'lost traveler',
    journey: 'adventure of discovery and self-realization',
    opening:
      'On an ancient road less traveled, a lost traveler stumbles upon a hidden village where the elders speak of a secret path to fulfillment. Your journey begins in much the same way.',
    passion:
      'The traveler discovers that what they thought was lost was actually a new beginning. Your passions are the compass that guides you to your true destination.',
    skills:
      'The traveler learns that survival requires adaptability, resourcefulness, and courage. These are the skills you have developed on your own journey.',
    career:
      'The traveler finds that every village needs different skills, and their unique abilities make them valuable wherever they go. Your career path is your own village to serve.',
    learning:
      'The traveler learns from every encounter, every new place, every person they meet. Your education is your own journey of discovery.',
    innovation:
      'The traveler often finds new ways to solve old problems, bringing fresh perspectives to ancient challenges. Your entrepreneurial ideas are your own innovations.',
    action:
      'The traveler knows that the journey continues with each step forward. Your action plan is your map to the next destination.',
    closing:
      'As the traveler finds their way home, they realize that home is not a place but a state of being—one that you too are discovering through your Ikigai journey.',
  },
  {
    id: 'zen-master',
    name: 'The Zen Master',
    description: 'A master of mindfulness and present-moment awareness',
    hero: 'zen master',
    journey: 'path of mindfulness and enlightenment',
    opening:
      'In the quiet stillness of a zen garden, a master sits in meditation, observing the flow of life with perfect awareness. Your journey toward Ikigai follows this same path of mindful discovery.',
    passion:
      'The zen master finds joy in the present moment, in the simple act of being fully present. Your passions are your own form of mindful engagement with life.',
    skills:
      'The zen master has cultivated the ability to focus, to be present, and to act with intention. These are the skills you bring to every moment of your life.',
    career:
      'The zen master serves others through their presence, their wisdom, and their ability to help others find their own path. Your career is your own form of service.',
    learning:
      'The zen master knows that every moment is a teacher, every experience a lesson. Your education is your own practice of mindful learning.',
    innovation:
      'The zen master finds new ways to share ancient wisdom, adapting timeless truths to modern life. Your entrepreneurial ideas are your own innovations in service.',
    action:
      'The zen master knows that action without awareness is merely reaction. Your action plan is your mindful approach to living your purpose.',
    closing:
      'As the zen master rises from meditation, they carry with them the peace that comes from knowing their true nature. You too can find this same peace through your Ikigai journey.',
  },
];

export interface StoryContext {
  theme: StoryTheme;
  userProfile?: {
    name?: string;
    email?: string;
  };
  report: AIReport;
}

export class StoryGenerator {
  private theme: StoryTheme;
  private userProfile?: {
    name?: string;
    email?: string;
  };
  private report: AIReport;

  constructor(context: StoryContext) {
    this.theme = context.theme;
    this.userProfile = context.userProfile;
    this.report = context.report;
  }

  public generateOpening(): string {
    return this.theme.opening;
  }

  public generatePassionSection(): string {
    const loveEntries = this.report.careers?.length || 0;
    const passionText = this.theme.passion;

    if (loveEntries > 0) {
      return `${passionText} Your Ikigai board reveals ${loveEntries} areas where your heart truly sings, each one a thread in the tapestry of your purpose.`;
    }

    return passionText;
  }

  public generateSkillsSection(): string {
    const skillsCount = this.report.majors?.length || 0;
    const skillsText = this.theme.skills;

    if (skillsCount > 0) {
      return `${skillsText} Your journey has revealed ${skillsCount} areas where your natural abilities shine, each one a tool in your arsenal of purpose.`;
    }

    return skillsText;
  }

  public generateCareerSection(): string {
    const careerCount = this.report.careers?.length || 0;
    const careerText = this.theme.career;

    if (careerCount > 0) {
      return `${careerText} Your constellation reveals ${careerCount} paths where your unique gifts meet the world's needs, each one a star in your personal galaxy of purpose.`;
    }

    return careerText;
  }

  public generateLearningSection(): string {
    const learningCount = this.report.majors?.length || 0;
    const learningText = this.theme.learning;

    if (learningCount > 0) {
      return `${learningText} Your educational journey includes ${learningCount} fields of study, each one a stepping stone on your path to mastery.`;
    }

    return learningText;
  }

  public generateInnovationSection(): string {
    const innovationCount = this.report.entrepreneurialIdeas?.length || 0;
    const innovationText = this.theme.innovation;

    if (innovationCount > 0) {
      return `${innovationText} Your garden of innovation contains ${innovationCount} seeds of possibility, each one waiting for your passion to help it bloom.`;
    }

    return innovationText;
  }

  public generateActionSection(): string {
    const actionCount = this.report.nextSteps?.length || 0;
    const actionText = this.theme.action;

    if (actionCount > 0) {
      return `${actionText} Your journey begins with ${actionCount} carefully chosen steps, each one a deliberate move toward your true purpose.`;
    }

    return actionText;
  }

  public generateClosing(): string {
    const closingText = this.theme.closing;

    if (this.userProfile?.name) {
      return `${closingText} ${this.userProfile.name}, your journey is unique, and your Ikigai is waiting to be discovered.`;
    }

    return closingText;
  }

  public generatePersonalizedNarrative(section: string): string {
    switch (section) {
      case 'opening':
        return this.generateOpening();
      case 'passion':
        return this.generatePassionSection();
      case 'skills':
        return this.generateSkillsSection();
      case 'career':
        return this.generateCareerSection();
      case 'learning':
        return this.generateLearningSection();
      case 'innovation':
        return this.generateInnovationSection();
      case 'action':
        return this.generateActionSection();
      case 'closing':
        return this.generateClosing();
      default:
        return this.generateOpening();
    }
  }
}

export function selectRandomTheme(): StoryTheme {
  const randomIndex = Math.floor(Math.random() * STORY_THEMES.length);
  return STORY_THEMES[randomIndex];
}

export function generateStoryForReport(
  report: AIReport,
  userProfile?: { name?: string; email?: string }
): StoryGenerator {
  const theme = selectRandomTheme();
  return new StoryGenerator({ theme, userProfile, report });
}

// Helper function to get theme by ID
export function getThemeById(id: string): StoryTheme | undefined {
  return STORY_THEMES.find(theme => theme.id === id);
}

// Helper function to get all available themes
export function getAllThemes(): StoryTheme[] {
  return STORY_THEMES;
}
