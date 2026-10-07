import { useEffect, useRef, useState } from "react";
import { generarCriatura } from "../../api/generarCriaturaApi";
import { crearCriatura } from "../../api/criaturasApi";
import { CriaturaFormulario, TipoCriatura } from "../../tipos";
import {
  ABILITIES,
  CreatureAnswers,
  GeneratedCreature,
  HABITATS,
  ELEMENTS,
  PERSONALITIES,
  RARITIES,
} from "../../tiposGeneradorCriatura";
import "./generadorCriatura.css";

const QUESTIONS = [
  { key: "habitat", title: "¿Dónde viviría tu criatura?", options: HABITATS },
  { key: "element", title: "¿Qué tipo de energía tiene?", options: ELEMENTS },
  { key: "personality", title: "¿Cómo describirías su personalidad?", options: PERSONALITIES },
  { key: "ability", title: "¿Qué habilidad debería tener?", options: ABILITIES },
  { key: "rarity", title: "¿Qué tan inusual quieres que sea?", options: RARITIES },
] as const;

const OPTION_LABELS: Record<string, string> = {
  Forest: "Bosque",
  Mountains: "Montañas",
  City: "Ciudad",
  Water: "Agua",
  Desert: "Desierto",
  "Another world": "Otro mundo",
  Fire: "Fuego",
  Nature: "Naturaleza",
  Light: "Luz",
  Darkness: "Oscuridad",
  Electricity: "Electricidad",
  Curious: "Curiosa",
  Protective: "Protectora",
  Rebellious: "Rebelde",
  Shy: "Tímida",
  Chaotic: "Caótica",
  Wise: "Sabia",
  "Read minds": "Leer la mente",
  "Control time": "Controlar el tiempo",
  "Become invisible": "Volverse invisible",
  "Create illusions": "Crear ilusiones",
  Heal: "Curar",
  Transform: "Transformarse",
  Common: "Común",
  Rare: "Rara",
  Epic: "Épica",
  Legendary: "Legendaria",
};

const EMPTY_ANSWERS: Partial<CreatureAnswers> = {};

function datosParaGuardar(creature: GeneratedCreature): CriaturaFormulario {
  const tipo: TipoCriatura = ["Light", "Darkness"].includes(creature.element) ? "espectral" : "elemental";
  const nivelPeligro = { Common: 2, Rare: 4, Epic: 7, Legendary: 10 }[creature.rarity];

  return {
    nombre: creature.name,
    tipo,
    habilidades: [OPTION_LABELS[creature.ability] ?? creature.ability],
    nivelPeligro,
    estado: "activa",
    especie: creature.species,
    rareza: OPTION_LABELS[creature.rarity] ?? creature.rarity,
    habitat: OPTION_LABELS[creature.habitat] ?? creature.habitat,
    elemento: OPTION_LABELS[creature.element] ?? creature.element,
    personalidad: OPTION_LABELS[creature.personality] ?? creature.personality,
    debilidad: creature.weakness,
    descripcion: creature.description,
    historia: creature.lore,
  };
}

export function GeneradorCriatura() {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [answers, setAnswers] = useState<Partial<CreatureAnswers>>(EMPTY_ANSWERS);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [creature, setCreature] = useState<GeneratedCreature | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [message, setMessage] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.focus();
      return;
    }
    triggerRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function startOver() {
    setStage("intro");
    setAnswers(EMPTY_ANSWERS);
    setQuestionIndex(0);
    setCreature(null);
    setIsSaved(false);
    setMessage("");
  }

  async function createCreature() {
    const { habitat, element, personality, ability, rarity } = answers;
    if (!habitat || !element || !personality || !ability || !rarity) return;
    const completeAnswers: CreatureAnswers = { habitat, element, personality, ability, rarity };
    setIsGenerating(true);
    setMessage("");
    try {
      const generated = await generarCriatura(completeAnswers);
      setCreature(generated);
      setStage("result");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo crear la criatura. Inténtalo de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function saveToAtlas(creatureToSave: GeneratedCreature) {
    setIsSaving(true);
    setMessage("");

    try {
      const savedCreature = await crearCriatura(datosParaGuardar(creatureToSave));
      if (!savedCreature?._id) {
        throw new Error("El servidor no confirmó el registro de la criatura en la base de datos.");
      }
      setIsSaved(true);
      setMessage(`${creatureToSave.name} se guardó en el archivo de Pawnee.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "No se pudo guardar la criatura. Inténtalo de nuevo.");
    } finally {
      setIsSaving(false);
    }
  }

  function saveCreature() {
    if (creature && !isSaved && !isSaving) void saveToAtlas(creature);
  }

  const currentQuestion = QUESTIONS[questionIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.key] : undefined;
  const creatureData = creature ? datosParaGuardar(creature) : null;

  return (
    <>
      <section className="creature-generator__promo" aria-labelledby="creature-generator-title">
        <div>
          <span className="creature-generator__eyebrow">NOTA DE CAMPO · ENCUENTRO PERSONAL</span>
          <h2 id="creature-generator-title">Una criatura propia</h2>
          <p>Responde unas preguntas y descubre qué criatura vive a tu lado.</p>
        </div>
        <button ref={triggerRef} type="button" onClick={() => { startOver(); setIsOpen(true); }}>
          Descubre tu propia criatura
        </button>
      </section>

      {isOpen && (
        <div
          className="creature-generator__backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div
            ref={dialogRef}
            className="creature-generator__dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="creature-generator-dialog-title"
            tabIndex={-1}
          >
            <button
              className="creature-generator__close"
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Cerrar el descubrimiento de criaturas"
            >
              ×
            </button>

            {stage === "intro" && (
              <div className="creature-generator__intro">
                <span className="creature-generator__eyebrow">ARCHIVO DE CAMPO DE PAWNEE · ENCUENTRO 01</span>
                <h2 id="creature-generator-dialog-title">Descubre tu propia criatura</h2>
                <p>Cada criatura de Pawnee es diferente. Responde unas preguntas y descubre cuál vive a tu lado.</p>
                <button type="button" onClick={() => setStage("quiz")}>Comenzar</button>
              </div>
            )}

            {stage === "quiz" && currentQuestion && (
              <section className="creature-generator__quiz" aria-labelledby="creature-generator-dialog-title">
                <div className="creature-generator__progress">
                  <span>PREGUNTA {questionIndex + 1} / {QUESTIONS.length}</span>
                  <div><span style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }} /></div>
                </div>
                <h2 id="creature-generator-dialog-title">{currentQuestion.title}</h2>
                <div className="creature-generator__options">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={option}
                      type="button"
                      className={selectedAnswer === option ? "is-selected" : ""}
                      aria-pressed={selectedAnswer === option}
                      onClick={() => {
                        setAnswers((previous) => ({ ...previous, [currentQuestion.key]: option }));
                        setMessage("");
                      }}
                    >
                      <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                      {OPTION_LABELS[option] ?? option}
                    </button>
                  ))}
                </div>
                {message && <p className="creature-generator__message" role="alert">{message}</p>}
                <div className="creature-generator__controls">
                  <button type="button" className="is-secondary" disabled={questionIndex === 0} onClick={() => setQuestionIndex(questionIndex - 1)}>
                    Anterior
                  </button>
                  {questionIndex < QUESTIONS.length - 1 ? (
                    <button type="button" disabled={!selectedAnswer} onClick={() => setQuestionIndex(questionIndex + 1)}>
                      Siguiente
                    </button>
                  ) : (
                    <button type="button" disabled={!selectedAnswer || isGenerating} onClick={createCreature}>
                      {isGenerating ? "Creando..." : "Crear mi criatura"}
                    </button>
                  )}
                </div>
              </section>
            )}

            {stage === "result" && creature && (
              <section className="creature-generator__result" aria-labelledby="creature-generator-dialog-title">
                <span className="creature-generator__eyebrow">ARCHIVO DE CAMPO · NUEVO ENCUENTRO</span>
                <div className="creature-generator__card">
                  <div className="creature-generator__card-heading">
                    <span className="creature-generator__rarity">{OPTION_LABELS[creature.rarity]}</span>
                    <h2 id="creature-generator-dialog-title">{creature.name}</h2>
                    <p>{creature.species}</p>
                  </div>
                  <p className="creature-generator__description">{creature.description}</p>
                  <dl>
                    <div><dt>Nombre</dt><dd>{creature.name}</dd></div>
                    <div><dt>Tipo</dt><dd>{creatureData?.tipo === "espectral" ? "Espectral" : "Elemental"}</dd></div>
                    <div><dt>Habilidades</dt><dd>{OPTION_LABELS[creature.ability] ?? creature.ability}</dd></div>
                    <div><dt>Nivel de peligro</dt><dd>{creatureData?.nivelPeligro} / 10</dd></div>
                    <div><dt>Estado</dt><dd>Activa</dd></div>
                    <div><dt>Hábitat</dt><dd>{OPTION_LABELS[creature.habitat]}</dd></div>
                    <div><dt>Elemento</dt><dd>{OPTION_LABELS[creature.element] ?? creature.element}</dd></div>
                    <div><dt>Personalidad</dt><dd>{OPTION_LABELS[creature.personality] ?? creature.personality}</dd></div>
                    <div><dt>Debilidad</dt><dd>{creature.weakness}</dd></div>
                  </dl>
                  <blockquote>{creature.lore}</blockquote>
                </div>
                {message && <p className="creature-generator__message" role={isSaved ? "status" : "alert"}>{message}</p>}
                <div className="creature-generator__controls">
                  <button type="button" className="is-secondary" disabled={isSaving} onClick={startOver}>Crear otra criatura</button>
                  <button type="button" onClick={saveCreature} disabled={isSaving || isSaved}>
                    {isSaving ? "Guardando..." : isSaved ? "Guardada en Atlas" : "Guardar criatura"}
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
}
