import { motion } from "framer-motion";
import { weeklyData } from "@/lib/study-data";

const WeeklyChart = () => {
  const maxValue = Math.max(...weeklyData.map((d) => d.productive + d.unproductive));

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="bg-card rounded-xl border border-border p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-heading font-semibold text-foreground">Weekly Study Hours</h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" /> Productive
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-destructive/40" /> Unproductive
          </span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 h-44">
        {weeklyData.map((d, i) => {
          const productivePct = (d.productive / maxValue) * 100;
          const unproductivePct = (d.unproductive / maxValue) * 100;
          return (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex flex-col items-center justify-end h-36">
                <motion.div
                  className="w-full max-w-[32px] rounded-t bg-destructive/30"
                  initial={{ height: 0 }}
                  animate={{ height: `${unproductivePct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 * i + 0.4 }}
                />
                <motion.div
                  className="w-full max-w-[32px] rounded-t bg-primary"
                  initial={{ height: 0 }}
                  animate={{ height: `${productivePct}%` }}
                  transition={{ duration: 0.6, delay: 0.1 * i + 0.2 }}
                />
              </div>
              <span className="text-xs text-muted-foreground font-medium">{d.day}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default WeeklyChart;
