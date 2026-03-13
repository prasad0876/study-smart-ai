import { motion } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import { recentSessions } from "@/lib/study-data";
import { cn } from "@/lib/utils";

const RecentSessions = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.35 }}
      className="bg-card rounded-xl border border-border p-6"
    >
      <h3 className="font-heading font-semibold text-foreground mb-4">Recent Sessions</h3>
      <div className="space-y-2">
        {recentSessions.slice(0, 5).map((session, i) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.06 }}
            className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              {session.productive ? (
                <CheckCircle className="w-4 h-4 text-success" />
              ) : (
                <XCircle className="w-4 h-4 text-destructive" />
              )}
              <div>
                <p className="text-sm font-medium text-foreground">{session.subject}</p>
                <p className="text-[10px] text-muted-foreground">{session.date}</p>
              </div>
            </div>
            <span className="text-sm font-heading font-semibold text-foreground">{session.hours}h</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default RecentSessions;
