import { motion } from "framer-motion";
import { getDaysUntilExam, type Subject } from "@/lib/study-data";

interface ExamReadinessGaugeProps {
  subject: Subject;
}

const ExamReadinessGauge = ({ subject }: ExamReadinessGaugeProps) => {
  const circumference = 251.2; // 2 * PI * 40
  const offset = circumference - (subject.readiness / 100) * circumference;
  const days = getDaysUntilExam(subject.examDate);

  const getColor = (readiness: number) => {
    if (readiness >= 70) return "text-success";
    if (readiness >= 50) return "text-warning";
    return "text-destructive";
  };

  const getStrokeColor = (readiness: number) => {
    if (readiness >= 70) return "hsl(160, 84%, 39%)";
    if (readiness >= 50) return "hsl(38, 92%, 50%)";
    return "hsl(350, 89%, 60%)";
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="hsl(var(--border))" strokeWidth="8" fill="none" />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            stroke={getStrokeColor(subject.readiness)}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`text-lg font-heading font-bold ${getColor(subject.readiness)}`}>
            {subject.readiness}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium text-foreground">{subject.name}</p>
        <p className="text-xs text-muted-foreground">{days} days left</p>
      </div>
    </div>
  );
};

export default ExamReadinessGauge;
