export const HABITATS = ["Forest", "Mountains", "City", "Water", "Desert", "Another world"] as const;
export const ELEMENTS = ["Fire", "Water", "Nature", "Light", "Darkness", "Electricity"] as const;
export const PERSONALITIES = ["Curious", "Protective", "Rebellious", "Shy", "Chaotic", "Wise"] as const;
export const ABILITIES = ["Read minds", "Control time", "Become invisible", "Create illusions", "Heal", "Transform"] as const;
export const RARITIES = ["Common", "Rare", "Epic", "Legendary"] as const;

export interface CreatureAnswers {
  habitat: (typeof HABITATS)[number];
  element: (typeof ELEMENTS)[number];
  personality: (typeof PERSONALITIES)[number];
  ability: (typeof ABILITIES)[number];
  rarity: (typeof RARITIES)[number];
}

export interface GeneratedCreature extends CreatureAnswers {
  name: string;
  species: string;
  weakness: string;
  description: string;
  lore: string;
}

const ARCHETYPES = [
  {
    name: "Lumora",
    species: "Guardian of the Mist",
    weakness: "Places without shadows",
    description: "A softly glowing creature that appears between the trees after dusk.",
    lore: "Lumora appears whenever someone gets lost. No one knows whether it is trying to guide them or simply watching.",
  },
  {
    name: "Vexlin",
    species: "Wayfinder of the Unseen",
    weakness: "A perfectly still room",
    description: "A quick-footed wanderer whose outline shimmers like a half-remembered dream.",
    lore: "Old field notes claim Vexlin leaves a new path wherever the familiar roads disappear.",
  },
  {
    name: "Brindle",
    species: "Keeper of Small Wonders",
    weakness: "Forgotten promises",
    description: "A bright-eyed guardian with a coat that catches the colors of its surroundings.",
    lore: "Brindle is said to collect tiny marvels and return one to anyone who has stopped looking for them.",
  },
  {
    name: "Orivane",
    species: "Echo of the Far Wilds",
    weakness: "The sound of its own name",
    description: "A quiet, many-colored creature that watches the world from just beyond the trail.",
    lore: "Those who meet Orivane remember a different story each time, but all agree it ended with a new beginning.",
  },
  {
    name: "Morrowisp",
    species: "Spark of the Old Grove",
    weakness: "Cold iron",
    description: "A small, radiant presence surrounded by drifting sparks and curious signs.",
    lore: "Morrowisp visits the edge of town before important changes, leaving only a warm glow in the grass.",
  },
  {
    name: "Thistelle",
    species: "Sentinel of Hidden Places",
    weakness: "An empty nest",
    description: "A watchful creature whose shifting markings reveal the secrets of its habitat.",
    lore: "According to Pawnee's oldest rangers, Thistelle protects the places that have not yet been discovered.",
  },
];

export function generateCreature(answers: CreatureAnswers): GeneratedCreature {
  const fingerprint = `${answers.habitat}|${answers.element}|${answers.personality}|${answers.ability}|${answers.rarity}`;
  const hash = Array.from(fingerprint).reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 7);
  const archetype = ARCHETYPES[hash % ARCHETYPES.length];

  return {
    ...archetype,
    ...answers,
    description: `${archetype.description} Its ${answers.element.toLowerCase()} energy follows it wherever it calls home.`,
    lore: `${archetype.lore} It is known for being ${answers.personality.toLowerCase()} and can ${answers.ability.toLowerCase()}.`,
  };
}
