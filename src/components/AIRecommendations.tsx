import { motion } from "framer-motion";
import { BrainCircuit, ArrowRight } from "lucide-react";
import { studyRecommendations } from "@/lib/study-data";
import { cn } from "@/lib/utils";

const priorityStyles = {
  high: "border-l-destructive bg-destructive/5",
  medium: "border-l-warning bg-warning/5",
  low: "border-l-success bg-success/5",
};

const priorityBadge = {
  high: "bg-destructive/10 text-destructive",
  medium: "bg-warning/10 text-warning",
  low: "bg-success/10 text-success",
};

const AIRecommendations = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.4 }}
      className="bg-accent rounded-xl border border-primary/20 p-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <BrainCircuit className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-semibold text-foreground">AI Study Recommendations</h3>
      </div>

      <div className="space-y-3">
        {studyRecommendations.map((rec, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.5 + i * 0.1 }}
            className={cn(
              "border-l-4 rounded-lg p-4 cursor-pointer hover:shadow-sm transition-shadow",
              priorityStyles[rec.priority]
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-foreground">{rec.title}</h4>
                  <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full uppercase", priorityBadge[rec.priority])}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{rec.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default AIRecommendations;
