interface Persona {
  key: string;
  label: string;
  subtitle: string;
  accent: string;
  chipClass: string;
  quickPrompts: string[];
}

interface PersonaRecord {
  [key: string]: Persona;
}

export const personas: PersonaRecord = {
  anshuman: {
    key: "anshuman",
    label: "Anshuman Singh",
    subtitle: "Mission-charged. Ex-Facebook. 2x ACM ICPC finalist.",
    accent: "from-sky-500 to-cyan-400",
    chipClass: "bg-sky-500/15 text-sky-100 border-sky-400/30 hover:bg-sky-500/25",
    quickPrompts: [
      "How do I master data structures properly?",
      "What's the right mindset for competitive programming?",
      "How should I prepare for MAANG interviews?",
    ],
  },
  abhimanyu: {
    key: "abhimanyu",
    label: "Abhimanyu Saxena",
    subtitle: "Systems-thinker. Missionary > Mercenary. Closes the loop.",
    accent: "from-emerald-500 to-teal-400",
    chipClass: "bg-emerald-500/15 text-emerald-100 border-emerald-400/30 hover:bg-emerald-500/25",
    quickPrompts: [
      "Should I use AI tools or build real skills first?",
      "How do I close the gap between learning and getting hired?",
      "What separates great engineers from average ones?",
    ],
  },
  kshitij: {
    key: "kshitij",
    label: "Kshitij Mishra",
    subtitle: "Educator. Makes DSA crystal-clear. Bite-sized learning.",
    accent: "from-amber-500 to-orange-400",
    chipClass: "bg-amber-500/15 text-amber-100 border-amber-400/30 hover:bg-amber-500/25",
    quickPrompts: [
      "I'm terrified of graph algorithms. Help me!",
      "Explain binary trees as simply as possible.",
      "How do I actually understand dynamic programming?",
    ],
  },
};

export const personaOrder: string[] = ["anshuman", "abhimanyu", "kshitij"];
