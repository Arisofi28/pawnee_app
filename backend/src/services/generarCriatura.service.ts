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
    species: "Guardiana de la niebla",
    weakness: "Los lugares sin sombras",
    description: "Una criatura de brillo tenue que aparece entre los árboles al anochecer.",
    lore: "Lumora aparece cuando alguien se pierde. Nadie sabe si intenta guiarle o si simplemente le observa.",
  },
  {
    name: "Vexlin",
    species: "Guía de lo invisible",
    weakness: "Una habitación completamente inmóvil",
    description: "Una viajera veloz cuyo contorno brilla como un sueño a medio recordar.",
    lore: "Las antiguas notas de campo dicen que Vexlin deja un camino nuevo donde desaparecen las rutas conocidas.",
  },
  {
    name: "Brindle",
    species: "Guardiana de las pequeñas maravillas",
    weakness: "Las promesas olvidadas",
    description: "Una guardiana de ojos brillantes cuyo pelaje refleja los colores de su entorno.",
    lore: "Se dice que Brindle colecciona pequeñas maravillas y devuelve una a quien ha dejado de buscarlas.",
  },
  {
    name: "Orivane",
    species: "Eco de las tierras lejanas",
    weakness: "El sonido de su propio nombre",
    description: "Una criatura silenciosa y multicolor que observa el mundo desde el otro lado del sendero.",
    lore: "Quienes conocen a Orivane recuerdan una historia distinta cada vez, pero todos coinciden en que termina con un nuevo comienzo.",
  },
  {
    name: "Morrowisp",
    species: "Chispa del bosque antiguo",
    weakness: "El hierro frío",
    description: "Una pequeña presencia radiante, rodeada de chispas flotantes y señales misteriosas.",
    lore: "Morrowisp visita las afueras antes de los grandes cambios y deja un resplandor cálido sobre la hierba.",
  },
  {
    name: "Thistelle",
    species: "Centinela de los lugares ocultos",
    weakness: "Un nido vacío",
    description: "Una criatura vigilante cuyas marcas cambiantes revelan los secretos de su hábitat.",
    lore: "Según los guardabosques más antiguos de Pawnee, Thistelle protege los lugares que aún no se han descubierto.",
  },
];

const NOMBRES_EN_ESPANOL: Record<string, string> = {
  Fire: "fuego",
  Water: "agua",
  Nature: "naturaleza",
  Light: "luz",
  Darkness: "oscuridad",
  Electricity: "electricidad",
  Curious: "curiosa",
  Protective: "protectora",
  Rebellious: "rebelde",
  Shy: "tímida",
  Chaotic: "caótica",
  Wise: "sabia",
  "Read minds": "leer la mente",
  "Control time": "controlar el tiempo",
  "Become invisible": "volverse invisible",
  "Create illusions": "crear ilusiones",
  Heal: "curar",
  Transform: "transformarse",
};

export function generateCreature(answers: CreatureAnswers): GeneratedCreature {
  const fingerprint = `${answers.habitat}|${answers.element}|${answers.personality}|${answers.ability}|${answers.rarity}`;
  const hash = Array.from(fingerprint).reduce((value, character) => ((value * 31) + character.charCodeAt(0)) >>> 0, 7);
  const archetype = ARCHETYPES[hash % ARCHETYPES.length];

  return {
    ...archetype,
    ...answers,
    description: `${archetype.description} Su energía de ${NOMBRES_EN_ESPANOL[answers.element]} la acompaña dondequiera que vaya.`,
    lore: `${archetype.lore} Se caracteriza por ser ${NOMBRES_EN_ESPANOL[answers.personality]} y puede ${NOMBRES_EN_ESPANOL[answers.ability]}.`,
  };
}
