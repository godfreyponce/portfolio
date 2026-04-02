export interface CardData {
  id: number;
  title: string;
  description: string;
  color: string;
}

export const cardData: CardData[] = [
  {
    id: 1,
    title: "TechAssist",
    description:
      "A native iOS assistant for data center technicians with 'scan-to-solution' QR navigation.",
    color: "rgba(249, 115, 22, 0.8)", // orange
  },
  {
    id: 2,
    title: "Signal",
    description:
      "An autonomous AI agent that scouts market trends by scraping, analyzing, and synthesizing competitor data into actionable moodboards.",
    color: "rgba(59, 130, 246, 0.8)", // blue
  },
  {
    id: 3,
    title: "Contextual Memory Engine",
    description:
      "A high-fidelity RAG pipeline using FAISS and MPNET to synthesize unstructured data into searchable vector indices.",
    color: "rgba(99, 102, 241, 0.8)", // indigo
  },
  {
    id: 4,
    title: "Juggler Vision",
    description:
      "I kept losing track on the # of times I juggle the soccer ball, so I'm going to build an agent that tracks my juggling metrics.",
    color: "rgba(16, 185, 129, 0.8)", // emerald
  },
];
