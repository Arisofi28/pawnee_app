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
