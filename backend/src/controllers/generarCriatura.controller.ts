import { NextFunction, Request, Response } from "express";
import { ApiError } from "../apiError";
import {
  CreatureAnswers,
  ELEMENTS,
  HABITATS,
  PERSONALITIES,
  RARITIES,
  ABILITIES,
  generateCreature,
} from "../services/generarCriatura.service";

function isOneOf<T extends readonly string[]>(value: unknown, options: T): value is T[number] {
  return typeof value === "string" && options.some((option) => option === value);
}

export function generar(req: Request, res: Response, next: NextFunction): void {
  const body: unknown = req.body;
  if (!body || typeof body !== "object") {
    next(new ApiError(400, "A complete set of creature answers is required."));
    return;
  }

  const input = body as Record<string, unknown>;
  if (
    !isOneOf(input.habitat, HABITATS) ||
    !isOneOf(input.element, ELEMENTS) ||
    !isOneOf(input.personality, PERSONALITIES) ||
    !isOneOf(input.ability, ABILITIES) ||
    !isOneOf(input.rarity, RARITIES)
  ) {
    next(new ApiError(400, "Creature answers contain a missing or invalid choice."));
    return;
  }

  const answers: CreatureAnswers = {
    habitat: input.habitat,
    element: input.element,
    personality: input.personality,
    ability: input.ability,
    rarity: input.rarity,
  };
  res.json(generateCreature(answers));
}
