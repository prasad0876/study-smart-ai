export interface StudySession {
  id: string;
  subject: string;
  date: string;
  hours: number;
  productive: boolean;
}

export interface Subject {
  name: string;
  color: string;
  totalHours: number;
  productiveHours: number;
  examDate: string;
  readiness: number;
}

export const subjects: Subject[] = [
  { name: "Mathematics", color: "hsl(239, 84%, 67%)", totalHours: 42, productiveHours: 34, examDate: "2026-04-10", readiness: 72 },
  { name: "Physics", color: "hsl(160, 84%, 39%)", totalHours: 28, productiveHours: 21, examDate: "2026-04-15", readiness: 58 },
  { name: "Chemistry", color: "hsl(38, 92%, 50%)", totalHours: 18, productiveHours: 12, examDate: "2026-04-08", readiness: 45 },
  { name: "Computer Science", color: "hsl(280, 68%, 60%)", totalHours: 35, productiveHours: 30, examDate: "2026-04-20", readiness: 82 },
  { name: "English", color: "hsl(350, 89%, 60%)", totalHours: 15, productiveHours: 11, examDate: "2026-04-12", readiness: 65 },
];

export const weeklyData = [
  { day: "Mon", productive: 3.5, unproductive: 1.0 },
  { day: "Tue", productive: 4.0, unproductive: 0.5 },
  { day: "Wed", productive: 2.0, unproductive: 1.5 },
  { day: "Thu", productive: 5.0, unproductive: 0.5 },
  { day: "Fri", productive: 3.0, unproductive: 2.0 },
  { day: "Sat", productive: 6.0, unproductive: 1.0 },
  { day: "Sun", productive: 4.5, unproductive: 0.5 },
];

export const recentSessions: StudySession[] = [
  { id: "1", subject: "Mathematics", date: "2026-03-13", hours: 2.5, productive: true },
  { id: "2", subject: "Physics", date: "2026-03-13", hours: 1.5, productive: true },
  { id: "3", subject: "Chemistry", date: "2026-03-12", hours: 1.0, productive: false },
  { id: "4", subject: "Computer Science", date: "2026-03-12", hours: 3.0, productive: true },
  { id: "5", subject: "English", date: "2026-03-11", hours: 1.0, productive: true },
  { id: "6", subject: "Mathematics", date: "2026-03-11", hours: 2.0, productive: true },
  { id: "7", subject: "Physics", date: "2026-03-10", hours: 1.5, productive: false },
];

export const studyRecommendations = [
  {
    title: "Focus on Chemistry",
    description: "Your exam is in 26 days but readiness is only 45%. Increase daily study to 2 hours.",
    priority: "high" as const,
    subject: "Chemistry",
  },
  {
    title: "Maintain CS momentum",
    description: "You're at 82% readiness — keep reviewing past papers and mock tests.",
    priority: "low" as const,
    subject: "Computer Science",
  },
  {
    title: "Reduce Wednesday distractions",
    description: "Your productive ratio drops to 57% on Wednesdays. Try shorter, focused blocks.",
    priority: "medium" as const,
    subject: "General",
  },
  {
    title: "Schedule Physics review",
    description: "Add 1 extra hour on weekends. Focus on mechanics — weakest area detected.",
    priority: "medium" as const,
    subject: "Physics",
  },
];

export function getDaysUntilExam(examDate: string): number {
  const now = new Date("2026-03-13");
  const exam = new Date(examDate);
  return Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
