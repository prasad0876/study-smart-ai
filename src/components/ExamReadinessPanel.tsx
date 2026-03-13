import { motion } from "framer-motion";
import { subjects } from "@/lib/study-data";
import ExamReadinessGauge from "./ExamReadinessGauge";

const ExamReadinessPanel = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl border border-border p-6"
    >
      <h3 className="font-heading font-semibold text-foreground mb-6">Exam Readiness</h3>
      <div className="flex flex-wrap justify-center gap-6">
        {subjects.map((s) => (
          <ExamReadinessGauge key={s.name} subject={s} />
        ))}
      </div>
    </motion.div>
  );
};

export default ExamReadinessPanel;
