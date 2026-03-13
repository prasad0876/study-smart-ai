import { motion } from "framer-motion";
import { subjects, getDaysUntilExam } from "@/lib/study-data";

const SubjectList = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.3 }}
      className="bg-card rounded-xl border border-border p-6"
    >
      <h3 className="font-heading font-semibold text-foreground mb-4">Subjects Overview</h3>
      <div className="space-y-3">
        {subjects.map((s, i) => {
          const ratio = s.totalHours > 0 ? (s.productiveHours / s.totalHours) * 100 : 0;
          const days = getDaysUntilExam(s.examDate);
          return (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.08 }}
              className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  <span className="text-xs text-muted-foreground">{s.totalHours}h total</span>
                </div>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: s.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${ratio}%` }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground">{Math.round(ratio)}% productive</span>
                  <span className="text-[10px] text-muted-foreground">{days}d to exam</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SubjectList;
