import React, { useEffect, useMemo, useState } from "react";

const QUESTION_BANK = [
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
  {
    id: "q6",
    title: "What feels like the best use of AI during coding?",
    subtitle: "Choose the support you instinctively trust most.",
    options: [
      {
        text: "Thinking through architecture before implementation",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "A strong system model is often the best debugging tool you can have.",
      },
      {
        text: "Reviewing code quality and edge cases carefully",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Code review quality often determines whether velocity stays sustainable.",
      },
      {
        text: "Reducing typing friction while building fast",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Tiny reductions in friction can meaningfully improve flow over long sessions.",
      },
    ],
  },
  {
    id: "q7",
    title: "What kind of answer gives you confidence fastest?",
    subtitle: "Go with the response style you trust most under pressure.",
    options: [
      {
        text: "A structured explanation with trade-offs",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Trade-off thinking is one of the clearest signs of engineering maturity.",
      },
      {
        text: "A careful critique that spots weaknesses",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Strong critique often saves teams from very expensive second-order mistakes.",
      },
      {
        text: "A useful code suggestion you can test immediately",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Fast feedback loops are one of the biggest accelerators in software work.",
      },
    ],
  },
  {
    id: "q8",
    title: "If your codebase is huge, what do you need from AI first?",
    subtitle: "The first need reveals your default working mode.",
    options: [
      {
        text: "A high-level map of the system",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Large systems feel smaller once you can name their boundaries clearly.",
      },
      {
        text: "Careful reading and interpretation of existing code",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Existing codebases reward patience more than confidence.",
      },
      {
        text: "Fast implementation help inside the current file",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Inline momentum matters most when you already understand the surrounding system.",
      },
    ],
  },
  {
    id: "q9",
    title: "What makes you feel most productive?",
    subtitle: "Not what sounds ideal. What actually feels true.",
    options: [
      {
        text: "Clarity before coding",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Clarity compounds, just like confusion does.",
      },
      {
        text: "Confidence that the code is getting cleaner",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Cleaner code often makes future work faster even when today feels slower.",
      },
      {
        text: "Shipping visible progress quickly",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Visible progress is often what keeps energy high in long projects.",
      },
    ],
  },
  {
    id: "q10",
    title: "Which problem annoys you the most?",
    subtitle: "Annoyance is a surprisingly accurate signal.",
    options: [
      {
        text: "Not knowing the best approach yet",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Uncertainty around approach is often where the biggest leverage lives.",
      },
      {
        text: "Having to untangle someone else’s messy logic",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Complexity often hides behind naming and structure more than raw algorithms.",
      },
      {
        text: "Knowing the fix but taking too long to implement it",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Execution drag can quietly waste more time than outright blockers.",
      },
    ],
  },
  {
    id: "q11",
    title: "How do you usually build confidence in a solution?",
    subtitle: "Pick the way you naturally validate your thinking.",
    options: [
      {
        text: "By testing the reasoning in advance",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "A strong mental model often prevents bugs before code exists.",
      },
      {
        text: "By reviewing and refining the details carefully",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Refinement is where many high-trust systems earn their stability.",
      },
      {
        text: "By building a first pass and iterating fast",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Iteration speed often reveals truth faster than prolonged speculation.",
      },
    ],
  },
  {
    id: "q12",
    title: "What do you want AI to reduce for you?",
    subtitle: "This is usually more honest than asking what you want AI to do.",
    options: [
      {
        text: "Ambiguity and decision fatigue",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Decision fatigue is one of the least visible drains on technical performance.",
      },
      {
        text: "Risk of bad changes in complex code",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Safer change is one of the biggest markers of mature engineering.",
      },
      {
        text: "Slow typing and repetitive implementation work",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Repetition is one of the easiest places for good tooling to multiply output.",
      },
    ],
  },
  {
    id: "q13",
    title: "What kind of conversation with AI feels most useful?",
    subtitle: "Imagine it as a colleague beside you.",
    options: [
      {
        text: "A strategic design discussion",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Good architecture conversations often eliminate problems before they materialize.",
      },
      {
        text: "A deep review conversation around subtle flaws",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Subtle flaws usually cost more than obvious bugs because they linger longer.",
      },
      {
        text: "A fast pair-programming rhythm",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Fast pair-style momentum is powerful when the problem is already well framed.",
      },
    ],
  },
  {
    id: "q14",
    title: "What type of project stage feels hardest for you?",
    subtitle: "The hardest stage often reveals the assistant you need most.",
    options: [
      {
        text: "Early architecture and framing",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "The earliest choices often set the cost curve for the entire project.",
      },
      {
        text: "Mid-stage cleanup and refinement",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "The middle of projects is where maintainability silently wins or loses.",
      },
      {
        text: "Late-stage implementation speed",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Late-stage execution pressure makes low-friction tools especially valuable.",
      },
    ],
  },
  {
    id: "q15",
    title: "What kind of improvement excites you most?",
    subtitle: "Excitement often points to your default operating style.",
    options: [
      {
        text: "A cleaner design decision",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "A cleaner design choice can save more time than a clever implementation trick.",
      },
      {
        text: "A safer and more maintainable code path",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Maintainability is usually where senior judgment becomes most visible.",
      },
      {
        text: "A faster route from idea to working output",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Fast output becomes a superpower when the direction is already right.",
      },
    ],
  },
  {
    id: "q16",
    title: "When AI gives you a suggestion, what matters most?",
    subtitle: "Trust is built differently for different developers.",
    options: [
      {
        text: "It helps me reason better",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Better reasoning often creates more value than faster typing.",
      },
      {
        text: "It makes the result safer and cleaner",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Safety and cleanliness are often what make speed sustainable later.",
      },
      {
        text: "It moves implementation forward immediately",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Immediate movement is often the cure for overthinking.",
      },
    ],
  },
  {
    id: "q17",
    title: "How do you usually handle uncertainty?",
    subtitle: "Your response to uncertainty says a lot about your tool fit.",
    options: [
      {
        text: "Explore options and compare approaches",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Option framing is often where strategic clarity begins.",
      },
      {
        text: "Read deeply until the unknowns become safer",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Deep reading is one of the most underrated engineering skills.",
      },
      {
        text: "Prototype and let reality answer quickly",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Reality is often the fastest reviewer when prototypes are cheap.",
      },
    ],
  },
  {
    id: "q18",
    title: "What do you most want to preserve in your workflow?",
    subtitle: "Protecting your strength matters more than fixing every weakness.",
    options: [
      {
        text: "Clear thinking and conceptual control",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Conceptual control is often what separates calm engineering from chaotic engineering.",
      },
      {
        text: "Quality and maintainability standards",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Standards are what make good teams reliable under pressure.",
      },
      {
        text: "Coding flow and implementation rhythm",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Flow is one of the most fragile and valuable assets in programming.",
      },
    ],
  },
  {
    id: "q19",
    title: "What feels like the biggest waste of time?",
    subtitle: "This is often the most honest productivity question.",
    options: [
      {
        text: "Starting without enough clarity",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Starting too early can cost more than starting slightly later with clarity.",
      },
      {
        text: "Fixing preventable mistakes in existing code",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Preventable mistakes usually come from weak feedback loops, not weak effort.",
      },
      {
        text: "Typing through obvious implementation patterns",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Repetitive work is usually where automation feels most magical.",
      },
    ],
  },
  {
    id: "q20",
    title: "What kind of code work feels most satisfying?",
    subtitle: "Satisfaction often reveals your default mode better than ambition does.",
    options: [
      {
        text: "Designing a smart approach",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Good design usually feels quiet in the moment and obvious in hindsight.",
      },
      {
        text: "Refining and improving existing logic",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Improvement work is often where craftsmanship shows most clearly.",
      },
      {
        text: "Shipping working output quickly",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Shipping is not just output — it is also learning speed.",
      },
    ],
  },
  {
    id: "q21",
    title: "When time is short, what support do you want most?",
    subtitle: "Pressure reveals your most trusted form of help.",
    options: [
      {
        text: "A fast way to decide the right path",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Under time pressure, the right direction matters even more than usual.",
      },
      {
        text: "A careful second brain for risk and quality",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Pressure tends to amplify the cost of quality mistakes.",
      },
      {
        text: "A way to execute faster with less friction",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Execution friction becomes especially expensive when the clock is tight.",
      },
    ],
  },
  {
    id: "q22",
    title: "What would you most like AI to feel like?",
    subtitle: "A role metaphor often makes the fit obvious.",
    options: [
      {
        text: "A systems architect",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Architectural clarity usually has the biggest long-term payoff.",
      },
      {
        text: "A meticulous reviewer",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Great reviewers often create value that is invisible until much later.",
      },
      {
        text: "A rapid pair programmer",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Fast pair-like help is often what turns momentum into output.",
      },
    ],
  },
  {
    id: "q23",
    title: "How do you prefer to reduce bugs?",
    subtitle: "Prevention style says a lot about your workflow.",
    options: [
      {
        text: "Think through the design more clearly",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "A large portion of bugs begin as design misunderstandings, not syntax mistakes.",
      },
      {
        text: "Review and inspect the implementation carefully",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Inspection is one of the most reliable ways to catch subtle logic issues.",
      },
      {
        text: "Prototype quickly and test early",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Earlier testing often matters more than perfect first attempts.",
      },
    ],
  },
  {
    id: "q24",
    title: "What kind of progress feels most real to you?",
    subtitle: "Choose the signal that makes you feel the work is truly moving.",
    options: [
      {
        text: "A clearer path and cleaner decisions",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Clearer decisions often matter more than more activity.",
      },
      {
        text: "Stronger quality and fewer hidden risks",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Risk reduction is one of the most underestimated forms of progress.",
      },
      {
        text: "More working code on screen",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Visible code output is one of the most psychologically powerful feedback loops.",
      },
    ],
  },
  {
    id: "q25",
    title: "What kind of help do you naturally ask humans for?",
    subtitle: "Your real-world habit often mirrors your best AI fit.",
    options: [
      {
        text: "Help thinking through approach and structure",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Approach-level guidance often creates the highest leverage changes.",
      },
      {
        text: "Help checking quality and reviewing details",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Detail review is where many expensive issues get caught quietly.",
      },
      {
        text: "Help moving implementation faster",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Fast execution help works best when alignment is already strong.",
      },
    ],
  },
  {
    id: "q26",
    title: "What kind of technical confidence matters most to you?",
    subtitle: "Confidence has different sources for different builders.",
    options: [
      {
        text: "Confidence that the approach makes sense",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Approach confidence is often what lets teams move decisively.",
      },
      {
        text: "Confidence that the details are solid",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Detail confidence is what makes systems feel trustworthy over time.",
      },
      {
        text: "Confidence that progress will be fast enough",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Time confidence often shapes how boldly people execute.",
      },
    ],
  },
  {
    id: "q27",
    title: "Which kind of AI mistake annoys you least?",
    subtitle: "This reveals what you can tolerate in exchange for value.",
    options: [
      {
        text: "Verbose discussion, as long as it sharpens thinking",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Some developers prefer extra thinking overhead if it buys clarity.",
      },
      {
        text: "Slower help, as long as it is thoughtful and careful",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Carefulness often feels slow in the short term and fast in the long term.",
      },
      {
        text: "Occasional rough edges, as long as it keeps momentum high",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Some teams benefit most from tools that keep motion alive.",
      },
    ],
  },
  {
    id: "q28",
    title: "What do you want more of in your coding day?",
    subtitle: "A simple question, but usually revealing.",
    options: [
      {
        text: "Better reasoning and better decisions",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "The best productivity gains often come from better decisions, not more effort.",
      },
      {
        text: "Cleaner code and fewer surprises",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Fewer surprises usually means better systems, not just better luck.",
      },
      {
        text: "More flow and faster output",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Flow and output speed are some of the most immediately felt productivity gains.",
      },
    ],
  },
  {
    id: "q29",
    title: "What kind of unfinished work bothers you most?",
    subtitle: "Incomplete things create different discomforts for different people.",
    options: [
      {
        text: "Unanswered design questions",
        scores: { chatgpt: 3, claude: 0, copilot: 0 },
        fact: "Unresolved design questions tend to ripple outward into many later problems.",
      },
      {
        text: "Messy edges and weak quality checks",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Unfinished quality work is often what makes systems feel fragile.",
      },
      {
        text: "Code that simply is not implemented yet",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "For execution-oriented builders, incomplete output is often the loudest friction.",
      },
    ],
  },
  {
    id: "q30",
    title: "Which phrase feels most like your ideal AI partnership?",
    subtitle: "Choose the one that feels most natural, not most impressive.",
    options: [
      {
        text: "Help me think this through well",
        scores: { chatgpt: 3, claude: 1, copilot: 0 },
        fact: "Thinking well early is one of the most scalable productivity advantages.",
      },
      {
        text: "Help me improve this carefully",
        scores: { chatgpt: 0, claude: 3, copilot: 0 },
        fact: "Careful improvement often creates value that compounds quietly over time.",
      },
      {
        text: "Help me build this fast",
        scores: { chatgpt: 0, claude: 0, copilot: 3 },
        fact: "Fast building is most powerful when direction is already trustworthy.",
      },
    ],
  },
];

const QUIZ_LENGTH = 5;

const profiles = {
  chatgpt: {
    name: "ChatGPT",
    role: "The Architect",
    emoji: "🧠",
    summary:
      "You value framing, structure, trade-offs, and clear thinking before code starts moving.",
    accent: "linear-gradient(135deg, #2dd4bf, #22c55e)",
    favoriteCopy:
      "My favorite AI coding assistant style is ChatGPT — The Architect. I value planning, clarity, and structure before coding. What’s yours? https://quiz.beehood.com\n\n#AI #Coding #DeveloperTools #Beehood #TechCraftByBees",
  },
  claude: {
    name: "Claude",
    role: "The Reviewer",
    emoji: "🔎",
    summary:
      "You thrive on careful reading, thoughtful critique, and improving quality before making changes.",
    accent: "linear-gradient(135deg, #fb923c, #f59e0b)",
    favoriteCopy:
      "My favorite AI coding assistant style is Claude — The Reviewer. I value depth, refinement, and careful reasoning. What’s yours? https://quiz.beehood.com\n\n#AI #Coding #DeveloperTools #Beehood #TechCraftByBees",
  },
  copilot: {
    name: "Copilot",
    role: "The Pair Programmer",
    emoji: "⚡",
    summary:
      "You want speed, momentum, and low-friction execution once the path is already clear.",
    accent: "linear-gradient(135deg, #60a5fa, #8b5cf6)",
    favoriteCopy:
      "My favorite AI coding assistant style is Copilot — The Pair Programmer. I value coding flow, speed, and execution. What’s yours? https://quiz.beehood.com\n\n#AI #Coding #DeveloperTools #Beehood #TechCraftByBees",
  },
};

function shuffleArray(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function pickQuizQuestions() {
  return shuffleArray(QUESTION_BANK).slice(0, QUIZ_LENGTH);
}

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
  const [quiz, setQuiz] = useState(() => pickQuizQuestions());
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [fact, setFact] = useState("");

  const complete = step >= quiz.length;
  const result = useMemo(() => getResult(answers), [answers]);
  const progress = complete ? 100 : Math.round((step / quiz.length) * 100);

  useEffect(() => {
    const title = "Which AI coding assistant fits how you think? | Beehood";
    const description =
      "Take Beehood's interactive quiz to see whether ChatGPT, Claude, or Copilot best matches your coding style.";
    const image = "https://quiz.beehood.com/og-quiz-preview.png";
    const url = "https://quiz.beehood.com";

    document.title = title;

    const ensureMeta = (attr, key, content) => {
      const selector = `${attr}="${key}"`;
      let tag = document.head.querySelector(`meta[${selector}]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    ensureMeta("name", "description", description);
    ensureMeta("property", "og:title", title);
    ensureMeta("property", "og:description", description);
    ensureMeta("property", "og:type", "website");
    ensureMeta("property", "og:url", url);
    ensureMeta("property", "og:image", image);
    ensureMeta("name", "twitter:card", "summary_large_image");
    ensureMeta("name", "twitter:title", title);
    ensureMeta("name", "twitter:description", description);
    ensureMeta("name", "twitter:image", image);
  }, []);

  const chooseOption = (option) => {
    setSelected(option);
    setFact(option.fact);
  };

  const nextQuestion = () => {
    if (!selected) return;
    const nextAnswers = [...answers];
    nextAnswers[step] = selected;
    setAnswers(nextAnswers);
    setStep((s) => s + 1);
    setSelected(null);
    setFact("");
  };

  const restart = () => {
    setQuiz(pickQuizQuestions());
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setFact("");
  };

  const copyToClipboard = async (text, successMessage = "Copied!") => {
    try {
      await navigator.clipboard.writeText(text);
      alert(successMessage);
    } catch {
      alert("Could not copy automatically. Please copy it manually.");
    }
  };

  const shareOnX = (text) => {
    const url = encodeURIComponent("https://quiz.beehood.com");
    const shareText = encodeURIComponent(text);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${shareText}`, "_blank");
  };

  const shareOnWhatsApp = (text) => {
    const shareText = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${shareText}`, "_blank");
  };

  const genericShare = async (text) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Which AI coding assistant fits how you think?",
          text,
          url: "https://quiz.beehood.com",
        });
      } catch {
        // user cancelled or share failed
      }
      return;
    }

    await copyToClipboard(text, "Share text copied.");
  };

  const current = quiz[step];
  const primary = result.primary ? profiles[result.primary] : null;
  const secondary = result.secondary ? profiles[result.secondary] : null;

  const linkedinResultText = primary
    ? `I built a small experiment at Beehood.\n\nI took this AI coding assistant quiz and got ${primary.name} — ${primary.role}.\n\nWhat did you get?\nhttps://quiz.beehood.com\n\n#AI #Coding #DeveloperTools #Beehood #TechCraftByBees`
    : "";

  const linkedinFavoriteText = primary ? primary.favoriteCopy : "";

  const whatsappText = primary
    ? `I took this AI coding assistant quiz and got ${primary.name} — ${primary.role}. Try yours: https://quiz.beehood.com`
    : "Take this AI coding assistant quiz: https://quiz.beehood.com";

  const genericShareText = primary
    ? `I got ${primary.name} — ${primary.role} in this AI coding assistant quiz. Try it here: https://quiz.beehood.com`
    : "Try this AI coding assistant quiz: https://quiz.beehood.com";

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
            Answer 5 quick questions chosen from a broader question bank. After every choice, a related fun fact appears. Then the app predicts whether ChatGPT, Claude, or Copilot best suits your coding style.
          </p>
        </div>

        <div style={styles.progressCard}>
          <div style={styles.progressTop}>
            <span>{complete ? "Complete" : `Question ${step + 1} of ${quiz.length}`}</span>
            <span>{complete ? "100%" : `${progress}%`}</span>
          </div>
          <div style={styles.progressBarOuter}>
            <div
              style={{
                ...styles.progressBarInner,
                width: `${complete ? 100 : progress}%`,
              }}
            />
          </div>
          <div style={styles.microNote}>Every run picks a different mix of 5 questions from the larger bank.</div>
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
                  const pct = Math.round((value / (QUIZ_LENGTH * 3)) * 100);

                  return (
                    <div key={key} style={{ marginTop: 14 }}>
                      <div style={styles.scoreRow}>
                        <span>{profile.name}</span>
                        <span>{value} pts</span>
                      </div>
                      <div style={styles.scoreBarOuter}>
                        <div
                          style={{
                            ...styles.scoreBarInner,
                            width: `${pct}%`,
                            background: profile.accent,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <button
                  onClick={() =>
                    copyToClipboard(
                      linkedinResultText,
                      "LinkedIn result post copied. Paste it into your LinkedIn post."
                    )
                  }
                  style={styles.primaryShareButton}
                >
                  Copy LinkedIn result post
                </button>

                <button
                  onClick={() => shareOnWhatsApp(whatsappText)}
                  style={styles.secondaryActionButton}
                >
                  Share on WhatsApp
                </button>

                <button
                  onClick={() =>
                    copyToClipboard(
                      linkedinFavoriteText,
                      "Favorite-assistant LinkedIn post copied."
                    )
                  }
                  style={styles.secondaryActionButton}
                >
                  Copy favorite assistant post
                </button>

                <button
                  onClick={() =>
                    shareOnX(
                      `I got ${primary.name} — ${primary.role} in this AI coding assistant quiz. Try yours! #Beehood #TechCraftByBees`
                    )
                  }
                  style={styles.secondaryActionButton}
                >
                  Share on X
                </button>

                <button
                  onClick={() => genericShare(genericShareText)}
                  style={styles.secondaryActionButton}
                >
                  Share…
                </button>

                <button onClick={restart} style={styles.restartButton}>
                  Retake quiz
                </button>
              </div>

              <div style={styles.brandBlock}>
                <div style={styles.brandText}>Built by Beehood</div>
                <div style={styles.brandLinks}>
                  <a
                    href="https://www.linkedin.com/company/beehood"
                    target="_blank"
                    rel="noreferrer"
                    style={styles.brandLink}
                  >
                    Follow Beehood on LinkedIn
                  </a>
                  <span style={styles.dot}>·</span>
                  <a
                    href="https://x.com/beehood_"
                    target="_blank"
                    rel="noreferrer"
                    style={styles.brandLink}
                  >
                    @beehood_
                  </a>
                </div>
              </div>
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
  microNote: {
    marginTop: 10,
    color: "#94a3b8",
    fontSize: 12,
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
  primaryShareButton: {
    border: 0,
    borderRadius: 16,
    padding: "14px 18px",
    background: "#22c55e",
    color: "#020617",
    fontWeight: 700,
    fontSize: 15,
    cursor: "pointer",
  },
  secondaryActionButton: {
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 16,
    padding: "14px 18px",
    background: "rgba(15,23,42,0.78)",
    color: "#f8fafc",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
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
  brandBlock: {
    marginTop: 6,
    paddingTop: 6,
  },
  brandText: {
    fontSize: 13,
    color: "#94a3b8",
    marginBottom: 6,
  },
  brandLinks: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  brandLink: {
    fontSize: 13,
    color: "#cbd5e1",
    textDecoration: "underline",
  },
  dot: {
    fontSize: 13,
    color: "#64748b",
  },
};
