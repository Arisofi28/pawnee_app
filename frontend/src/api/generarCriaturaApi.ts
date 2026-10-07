import { CreatureAnswers, GeneratedCreature } from "../tiposGeneradorCriatura";

const API_URL = import.meta.env.VITE_API_URL ?? "";

export async function generarCriatura(answers: CreatureAnswers): Promise<GeneratedCreature> {
  const response = await fetch(`${API_URL}/api/generate-creature`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answers),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? `Creature generation failed (HTTP ${response.status}).`);
  }

  return response.json() as Promise<GeneratedCreature>;
}
