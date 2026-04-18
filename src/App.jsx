import React, { useMemo, useState } from "react";

const quiz = [
  {
    id: "q1",
    title: "When you start a new feature, what do you want first?",
    subtitle: "Pick the instinct that feels most natural to you.",
    options: [
      {
        text: "Architecture, trade-offs, and a clear plan",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Many expensive bugs begin as unclear boundaries, not bad syntax.",
      },
      {
        text: "A careful read of the existing code first",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Understanding old code is often harder than writing new code.",
      },
      {
        text: "Inline coding help so I can move fast immediately",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Fast prototyping often exposes hidden requirements earlier.",
      },
    ],
  },
  {
    id: "q2",
    title: "What slows you down the most?",
    subtitle: "Your bottleneck often reveals your ideal assistant.",
    options: [
      {
        text: "Ambiguous requirements and fuzzy scope",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Ambiguity compounds. Clarity scales.",
      },
      {
        text: "Messy code that needs reasoning before touching it",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Maintainability is one of the quietest productivity multipliers.",
      },
      {
        text: "Slow implementation even after the path is obvious",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Tiny workflow friction adds up massively over a full day of coding.",
      },
    ],
  },
  {
    id: "q3",
    title: "Which line sounds most like your working style?",
    subtitle: "Be honest, not aspirational.",
    options: [
      {
        text: "Think first. Build second.",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Planning is not slowness. It is selective speed.",
      },
      {
        text: "Review deeply. Improve steadily.",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Refinement is where many senior engineers quietly create the most value.",
      },
      {
        text: "Move fast. Learn by shipping.",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Momentum can be a thinking tool, not just an execution tool.",
      },
    ],
  },
  {
    id: "q4",
    title: "What kind of AI help feels most valuable?",
    subtitle: "Not coolest. Most useful.",
    options: [
      {
        text: "Explanations, system thinking, and options",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "The first useful answer in software is often not code. It is the right question.",
      },
      {
        text: "Nuanced critique, edge cases, and refinement",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Refactoring is less about prettier code and more about safer change.",
      },
      {
        text: "Real-time coding momentum inside the workflow",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Flow breaks are small individually and expensive collectively.",
      },
    ],
  },
  {
    id: "q5",
    title: "Where do you most often get stuck?",
    subtitle: "This usually reveals the assistant you actually need.",
    options: [
      {
        text: "Framing the problem and choosing the approach",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Architecture is not about diagrams. It is about reducing future pain.",
      },
      {
        text: "Reasoning through complexity in existing code",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Existing codebases reward patience more than confidence.",
      },
      {
        text: "Turning known intent into working code quickly",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Code suggestions save the most time when direction is already sound.",
      },
    ],
  },
];

const profiles = {
  chatgpt: {
    name: "ChatGPT",
    role: "The Architect",
    emoji: "🧠",
    summary: "You value framing, structure, trade-offs, and clear thinking before code starts moving.",
    accent: "linear-gradient(135deg, #2dd4bf, #22c55e)",
  },
  claude: {
    name: "Claude",
    role: "The Reviewer",
    emoji: "🔎",
    summary: "You thrive on careful reading, thoughtful critique, and improving quality before making changes.",
    accent: "linear-gradient(135deg, #fb923c, #f59e0b)",
  },
  copilot: {
    name: "Copilot",
    role: "The Pair Programmer",
    emoji: "⚡",
    summary: "You want speed, momentum, and low-friction execution once the path is already clear.",
    accent: "linear-gradient(135deg, #60a5fa, #8b5cf6)",
  },
};

function getResult(answers) {
  const totals = { chatgpt: 0, claude: 0, copilot: 0 };
  answers.forEach((answer) => {
    if (!answer) return;
    Object.entries(answer.scores).forEach(([key, val]) => {
      totals[key] += val;
    });
  });

  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  return {
    totals,
    primary: sorted[0]?.[0],
    secondary: sorted[1]?.[0],
  };
}

export default function App() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fact, setFact] = useState("");

  const complete = step >= quiz.length;
  const result = useMemo(() => getResult(answers), [answers]);
  const progress = complete ? 100 : Math.round((step / quiz.length) * 100);

  const chooseOption = (option) => {
    setSelected(option);
    setFact(option.fact);
  };

  const nextQuestion = () => {
    const nextAnswers = [...answers];
    nextAnswers[step] = selected;
    setAnswers(nextAnswers);
    setStep((s) => s + 1);
    setSelected(null);
    setFact("");
  };

  const restart = () => {
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setFact("");
  };

  const current = quiz[step];
  const primary = result.primary ? profiles[result.primary] : null;
  const secondary = result.secondary ? profiles[result.secondary] : null;

  return (
    <div style={styles.page}>
      <div style={styles.glowOne} />
      <div style={styles.glowTwo} />

      <div style={styles.container}>
        <div style={styles.hero}>
          <div style={styles.badge}>Interactive coding assistant quiz</div>
          <h1 style={styles.title}>
            Which AI coding assistant fits <span style={styles.titleAccent}>how you think</span>?
          </h1>
          <p style={styles.subtitle}>
            Answer 5 quick questions. After every choice, a related fun fact appears. Then the app predicts whether ChatGPT, Claude, or Copilot best suits your coding style.
          </p>
        </div>

        <div style={styles.progressCard}>
          <div style={styles.progressTop}>
            <span>{complete ? "Complete" : `Question ${step + 1} of ${quiz.length}`}</span>
            <span>{complete ? "100%" : `${progress}%`}</span>
          </div>
          <div style={styles.progressBarOuter}>
            <div style={{ ...styles.progressBarInner, width: `${complete ? 100 : progress}%` }} />
          </div>
        </div>

        {!complete ? (
          <div style={styles.grid}>
            <div style={styles.panel}>
              <div style={styles.panelLabel}>Question {step + 1}</div>
              <h2 style={styles.questionTitle}>{current.title}</h2>
              <p style={styles.questionSubtitle}>{current.subtitle}</p>

              <div style={styles.optionWrap}>
                {current.options.map((option, index) => {
                  const active = selected?.text === option.text;
                  return (
                    <button
                      key={option.text}
                      onClick={() => chooseOption(option)}
                      style={{
                        ...styles.option,
                        ...(active ? styles.optionActive : {}),
                      }}
                    >
                      <div style={styles.optionIndex}>{index + 1}</div>
                      <div style={styles.optionText}>{option.text}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={styles.sidePanel}>
              <div style={styles.sideHeader}>
                <div style={styles.sideIcon}>✨</div>
                <div>
                  <div style={styles.sideLabel}>Dynamic fun fact</div>
                  <div style={styles.sideTitle}>Your choice unlocks an insight</div>
                </div>
              </div>

              {!fact ? (
                <div style={styles.placeholderBox}>
                  <div style={styles.placeholderEmoji}>💡</div>
                  <p style={styles.placeholderText}>
                    Choose an answer and the app will reveal a contextual fun fact instantly.
                  </p>
                </div>
              ) : (
                <div style={styles.factBox}>
                  <div style={styles.factBadge}>Fun fact unlocked</div>
                  <div style={styles.factText}>{fact}</div>
                  <button onClick={nextQuestion} style={styles.nextButton}>
                    {step === quiz.length - 1 ? "See my result" : "Next question"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={styles.resultGrid}>
            <div style={styles.resultMain}>
              <div style={styles.resultPill}>Your primary fit</div>
              <div style={styles.resultHead}>
                <div style={{ ...styles.resultIcon, background: primary.accent }}>{primary.emoji}</div>
                <div>
                  <div style={styles.resultName}>{primary.name}</div>
                  <div style={styles.resultRole}>{primary.role}</div>
                </div>
              </div>
              <p style={styles.resultSummary}>{primary.summary}</p>
            </div>

            <div style={styles.resultSide}>
              <div style={styles.secondaryCard}>
                <div style={styles.secondaryLabel}>Secondary fit</div>
                <div style={styles.secondaryName}>{secondary.name}</div>
                <div style={styles.secondaryRole}>{secondary.role}</div>
              </div>

              <div style={styles.scoreCard}>
                <div style={styles.secondaryLabel}>Score breakdown</div>
                {Object.entries(result.totals).map(([key, value]) => {
                  const profile = profiles[key];
                  const pct = Math.round((value / 15) * 100);
                  return (
                    <div key={key} style={{ marginTop: 14 }}>
                      <div style={styles.scoreRow}>
                        <span>{profile.name}</span>
                        <span>{value} pts</span>
                      </div>
                      <div style={styles.scoreBarOuter}>
                        <div style={{ ...styles.scoreBarInner, width: `${pct}%`, background: profile.accent }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={restart} style={styles.restartButton}>Retake quiz</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #11172b 0%, #090d18 45%, #05070f 100%)",
    color: "#f8fafc",
    fontFamily: "Inter, Arial, sans-serif",
    position: "relative",
    overflow: "hidden",
  },
  glowOne: {
    position: "absolute",
    width: 420,
    height: 420,
    background: "rgba(34, 197, 94, 0.10)",
    filter: "blur(80px)",
    top: -120,
    left: -120,
    borderRadius: "999px",
  },
  glowTwo: {
    position: "absolute",
    width: 420,
    height: 420,
    background: "rgba(96, 165, 250, 0.10)",
    filter: "blur(80px)",
    bottom: -120,
    right: -100,
    borderRadius: "999px",
  },
  container: {
    maxWidth: 1180,
    margin: "0 auto",
    padding: "42px 22px 64px",
    position: "relative",
    zIndex: 2,
  },
  hero: {
    maxWidth: 900,
    marginBottom: 22,
  },
  badge: {
    display: "inline-block",
    padding: "8px 14px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(15, 23, 42, 0.7)",
    borderRadius: 999,
    color: "#cbd5e1",
    fontSize: 13,
    marginBottom: 18,
  },
  title: {
    fontSize: "clamp(34px, 6vw, 62px)",
    lineHeight: 1.03,
    margin: 0,
    fontWeight: 800,
    letterSpacing: "-0.04em",
  },
  titleAccent: {
    background: "linear-gradient(90deg, #34d399, #fb923c, #60a5fa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 18,
    lineHeight: 1.6,
    marginTop: 18,
    marginBottom: 0,
    maxWidth: 860,
  },
  progressCard: {
    marginTop: 24,
    marginBottom: 24,
    padding: 18,
    background: "rgba(15, 23, 42, 0.72)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
  },
  progressTop: {
    display: "flex",
    justifyContent: "space-between",
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 10,
  },
  progressBarOuter: {
    height: 12,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden",
  },
  progressBarInner: {
    height: "100%",
    borderRadius: 999,
    background: "linear-gradient(90deg, #34d399, #fb923c, #60a5fa)",
    transition: "width 0.25s ease",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 24,
  },
  panel: {
    background: "rgba(15, 23, 42, 0.74)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
  },
  panelLabel: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 10,
  },
  questionTitle: {
    fontSize: 34,
    lineHeight: 1.15,
    margin: 0,
    fontWeight: 800,
    letterSpacing: "-0.03em",
  },
  questionSubtitle: {
    color: "#94a3b8",
    fontSize: 16,
    lineHeight: 1.6,
    marginTop: 10,
    marginBottom: 24,
  },
  optionWrap: {
    display: "grid",
    gap: 14,
  },
  option: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    width: "100%",
    textAlign: "left",
    padding: 18,
    borderRadius: 20,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(2, 6, 23, 0.55)",
    color: "#f8fafc",
    cursor: "pointer",
    transition: "all 0.18s ease",
    fontSize: 16,
  },
  optionActive: {
    border: "1px solid rgba(96,165,250,0.45)",
    background: "linear-gradient(135deg, rgba(59,130,246,0.14), rgba(139,92,246,0.12))",
    transform: "translateY(-1px)",
  },
  optionIndex: {
    width: 34,
    height: 34,
    minWidth: 34,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.08)",
    color: "#cbd5e1",
    fontWeight: 700,
  },
  optionText: {
    lineHeight: 1.45,
    fontWeight: 500,
  },
  sidePanel: {
    background: "rgba(15, 23, 42, 0.74)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 28,
    boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
    display: "flex",
    flexDirection: "column",
    minHeight: 430,
  },
  sideHeader: {
    display: "flex",
    gap: 14,
    alignItems: "center",
    marginBottom: 18,
  },
  sideIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    background: "rgba(34,197,94,0.14)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 22,
  },
  sideLabel: {
    color: "#94a3b8",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  sideTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginTop: 4,
  },
  placeholderBox: {
    flex: 1,
    borderRadius: 22,
    border: "1px dashed rgba(255,255,255,0.12)",
    background: "rgba(2, 6, 23, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    padding: 28,
    textAlign: "center",
  },
  placeholderEmoji: {
    fontSize: 40,
    marginBottom: 16,
  },
  placeholderText: {
    color: "#cbd5e1",
    fontSize: 18,
    lineHeight: 1.6,
    maxWidth: 360,
  },
  factBox: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 1,
    borderRadius: 22,
    background: "linear-gradient(135deg, rgba(15,23,42,0.72), rgba(30,41,59,0.72))",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: 24,
  },
  factBadge: {
    display: "inline-block",
    alignSelf: "flex-start",
    padding: "8px 12px",
    background: "rgba(34,197,94,0.12)",
    color: "#86efac",
    borderRadius: 999,
    fontSize: 13,
    marginBottom: 16,
  },
  factText: {
    fontSize: 28,
    lineHeight: 1.35,
    fontWeight: 700,
    letterSpacing: "-0.03em",
    color: "#f8fafc",
  },
  nextButton: {
    marginTop: 26,
    border: 0,
    borderRadius: 16,
    padding: "14px 18px",
    background: "#f8fafc",
    color: "#020617",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
    alignSelf: "flex-start",
  },
  resultGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 0.95fr",
    gap: 24,
  },
  resultMain: {
    background: "rgba(15, 23, 42, 0.78)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 28,
    padding: 30,
    boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
  },
  resultPill: {
    display: "inline-block",
    padding: "8px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.08)",
    color: "#cbd5e1",
    fontSize: 13,
    marginBottom: 16,
  },
  resultHead: {
    display: "flex",
    gap: 16,
    alignItems: "center",
  },
  resultIcon: {
    width: 74,
    height: 74,
    borderRadius: 22,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 34,
    color: "#020617",
    boxShadow: "0 18px 50px rgba(0,0,0,0.18)",
  },
  resultName: {
    fontSize: 42,
    fontWeight: 800,
    letterSpacing: "-0.04em",
  },
  resultRole: {
    color: "#94a3b8",
    fontSize: 20,
    marginTop: 2,
  },
  resultSummary: {
    fontSize: 24,
    lineHeight: 1.5,
    color: "#e2e8f0",
    marginTop: 24,
    marginBottom: 0,
  },
  resultSide: {
    display: "grid",
    gap: 18,
    alignContent: "start",
  },
  secondaryCard: {
    background: "rgba(15, 23, 42, 0.78)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 24,
  },
  secondaryLabel: {
    color: "#94a3b8",
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
  },
  secondaryName: {
    fontSize: 28,
    fontWeight: 800,
    marginTop: 10,
  },
  secondaryRole: {
    color: "#cbd5e1",
    fontSize: 17,
    marginTop: 4,
  },
  scoreCard: {
    background: "rgba(15, 23, 42, 0.78)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    padding: 24,
  },
  scoreRow: {
    display: "flex",
    justifyContent: "space-between",
    color: "#e2e8f0",
    fontSize: 14,
    marginBottom: 8,
  },
  scoreBarOuter: {
    height: 10,
    background: "rgba(255,255,255,0.08)",
    borderRadius: 999,
    overflow: "hidden",
  },
  scoreBarInner: {
    height: "100%",
    borderRadius: 999,
  },
  restartButton: {
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: "14px 18px",
    background: "rgba(15,23,42,0.78)",
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
  },
};