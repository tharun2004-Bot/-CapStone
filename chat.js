/*
  CareerRAG chat module — client-side skill path state (localStorage) and a
  keyword-matched mock response engine standing in for a real RAG backend.
  Swap getReply() to call your backend (e.g. POST /api/chat) when ready.
*/
const SkillPath = (function () {
  const KEY = "careerrag_progress";
  const DEFAULT = {
    track: "Data Analyst",
    skills: [
      { name: "Python & SQL fundamentals", status: "done" },
      { name: "Data visualization (Power BI)", status: "now" },
      { name: "Applied statistics", status: "next" },
      { name: "Portfolio project + mock interview", status: "next" },
    ],
  };

  function get() {
    const s = localStorage.getItem(KEY);
    return s ? JSON.parse(s) : JSON.parse(JSON.stringify(DEFAULT));
  }
  function save(progress) {
    localStorage.setItem(KEY, JSON.stringify(progress));
  }
  function advance() {
    const p = get();
    const idx = p.skills.findIndex((s) => s.status === "now");
    if (idx > -1) {
      p.skills[idx].status = "done";
      if (p.skills[idx + 1]) p.skills[idx + 1].status = "now";
    }
    save(p);
    return p;
  }
  function percent() {
    const p = get();
    const done = p.skills.filter((s) => s.status === "done").length;
    return Math.round((done / p.skills.length) * 100);
  }
  function reset() {
    save(JSON.parse(JSON.stringify(DEFAULT)));
  }

  return { get, save, advance, percent, reset };
})();

const RagAssistant = (function () {
  const LIBRARY = [
    {
      keywords: ["power bi", "tableau", "visuali"],
      reply:
        "78% of Data Analyst postings you're tracked against ask for Power BI or Tableau. There's a 4-hour Power BI crash course matched to your current level.",
      sources: ["12 job postings", "Data viz course"],
    },
    {
      keywords: ["sql", "python"],
      reply:
        "You're already strong here — it shows up as a met requirement in 95% of the roles in your track. No action needed on this one.",
      sources: ["42 job postings"],
    },
    {
      keywords: ["statistic", "a/b", "hypothesis"],
      reply:
        "Applied statistics (especially A/B testing) appears in 55% of matched postings and is your next recommended step. Say \"mark this done\" once you've completed it.",
      sources: ["Fintech DA course", "8 job postings"],
    },
    {
      keywords: ["resume", "cv"],
      reply:
        "Upload your resume from the dashboard right panel and I'll re-score it against your target roles and flag missing keywords recruiters filter on.",
      sources: [],
    },
    {
      keywords: ["interview", "mock"],
      reply:
        "Mock interviews unlock once your skill path hits 75%. You're close — finish Applied statistics and I'll schedule one.",
      sources: ["Placement outcomes data"],
    },
    {
      keywords: ["job", "role", "opening", "fintech"],
      reply:
        "3 new postings this week match your current profile at 80%+, mostly asking for the Power BI skill you're already working on.",
      sources: ["Live job board"],
    },
    {
      keywords: ["done", "completed", "finished", "mark"],
      reply: "__ADVANCE__",
      sources: [],
    },
  ];

  function getReply(text) {
    const lower = text.toLowerCase();
    const match = LIBRARY.find((r) => r.keywords.some((k) => lower.includes(k)));
    if (match) return match;
    return {
      reply:
        "I can help with skill gaps, course matches, and job fit — try asking about a specific skill (like SQL or Power BI) or a role you're targeting.",
      sources: [],
    };
  }

  return { getReply };
})();
