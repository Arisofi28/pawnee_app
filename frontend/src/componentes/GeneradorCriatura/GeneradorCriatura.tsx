import { useEffect, useRef, useState } from "react";
import { generarCriatura } from "../../api/generarCriaturaApi";
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
  { key: "habitat", title: "Where would your creature live?", options: HABITATS },
  { key: "element", title: "What kind of energy does it have?", options: ELEMENTS },
  { key: "personality", title: "How would you describe its personality?", options: PERSONALITIES },
  { key: "ability", title: "What ability should it have?", options: ABILITIES },
  { key: "rarity", title: "How unusual do you want it to be?", options: RARITIES },
] as const;

const EMPTY_ANSWERS: Partial<CreatureAnswers> = {};
const STORAGE_KEY = "pawnee-saved-creatures";

export function GeneradorCriatura() {
  const [isOpen, setIsOpen] = useState(false);
  const [stage, setStage] = useState<"intro" | "quiz" | "result">("intro");
  const [answers, setAnswers] = useState<Partial<CreatureAnswers>>(EMPTY_ANSWERS);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [creature, setCreature] = useState<GeneratedCreature | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
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
    setMessage("");
  }

  async function createCreature() {
    const { habitat, element, personality, ability, rarity } = answers;
    if (!habitat || !element || !personality || !ability || !rarity) return;
    const completeAnswers: CreatureAnswers = { habitat, element, personality, ability, rarity };
    setIsGenerating(true);
    setMessage("");
    try {
      setCreature(await generarCriatura(completeAnswers));
      setStage("result");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The creature could not be created. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  function saveCreature() {
    if (!creature) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]") as GeneratedCreature[];
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved, creature]));
      setMessage(`${creature.name} was saved in this browser.`);
    } catch {
      setMessage("This creature could not be saved. Check your browser storage settings and try again.");
    }
  }

  const currentQuestion = QUESTIONS[questionIndex];
  const selectedAnswer = currentQuestion ? answers[currentQuestion.key] : undefined;

  return (
    <>
      <section className="creature-generator__promo" aria-labelledby="creature-generator-title">
        <div>
          <span className="creature-generator__eyebrow">FIELD NOTE · PERSONAL ENCOUNTER</span>
          <h2 id="creature-generator-title">A creature of your own</h2>
          <p>Answer a few questions and find out which creature lives alongside you.</p>
        </div>
        <button ref={triggerRef} type="button" onClick={() => { startOver(); setIsOpen(true); }}>
          Discover Your Own Creature
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
              aria-label="Close creature discovery"
            >
              ×
            </button>

            {stage === "intro" && (
              <div className="creature-generator__intro">
                <span className="creature-generator__eyebrow">PAWNEE FIELD ARCHIVE · ENCOUNTER 01</span>
                <h2 id="creature-generator-dialog-title">Discover Your Own Creature</h2>
                <p>Every creature in Pawnee is different. Answer a few questions and discover which one lives alongside you.</p>
                <button type="button" onClick={() => setStage("quiz")}>Start</button>
              </div>
            )}

            {stage === "quiz" && currentQuestion && (
              <section className="creature-generator__quiz" aria-labelledby="creature-generator-dialog-title">
                <div className="creature-generator__progress">
                  <span>QUESTION {questionIndex + 1} / {QUESTIONS.length}</span>
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
                      {option}
                    </button>
                  ))}
                </div>
                {message && <p className="creature-generator__message" role="alert">{message}</p>}
                <div className="creature-generator__controls">
                  <button type="button" className="is-secondary" disabled={questionIndex === 0} onClick={() => setQuestionIndex(questionIndex - 1)}>
                    Back
                  </button>
                  {questionIndex < QUESTIONS.length - 1 ? (
                    <button type="button" disabled={!selectedAnswer} onClick={() => setQuestionIndex(questionIndex + 1)}>
                      Next
                    </button>
                  ) : (
                    <button type="button" disabled={!selectedAnswer || isGenerating} onClick={createCreature}>
                      {isGenerating ? "Creating..." : "Create My Creature"}
                    </button>
                  )}
                </div>
              </section>
            )}

            {stage === "result" && creature && (
              <section className="creature-generator__result" aria-labelledby="creature-generator-dialog-title">
                <span className="creature-generator__eyebrow">FIELD ARCHIVE · NEW ENCOUNTER</span>
                <div className="creature-generator__card">
                  <div className="creature-generator__card-heading">
                    <span className="creature-generator__rarity">{creature.rarity}</span>
                    <h2 id="creature-generator-dialog-title">{creature.name}</h2>
                    <p>{creature.species}</p>
                  </div>
                  <p className="creature-generator__description">{creature.description}</p>
                  <dl>
                    <div><dt>Habitat</dt><dd>{creature.habitat}</dd></div>
                    <div><dt>Element</dt><dd>{creature.element}</dd></div>
                    <div><dt>Personality</dt><dd>{creature.personality}</dd></div>
                    <div><dt>Ability</dt><dd>{creature.ability}</dd></div>
                    <div><dt>Weakness</dt><dd>{creature.weakness}</dd></div>
                  </dl>
                  <blockquote>{creature.lore}</blockquote>
                </div>
                {message && <p className="creature-generator__message" role="status">{message}</p>}
                <div className="creature-generator__controls">
                  <button type="button" className="is-secondary" onClick={startOver}>Create Another Creature</button>
                  <button type="button" onClick={saveCreature}>Save Creature</button>
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </>
  );
}
