import { motion } from "framer-motion";
import { BrainCircuit, TreeDeciduous, BarChart3, Hexagon, ExternalLink, Key, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  analyzeProductivityPatterns,
  predictAllSubjects,
  analyzeStudyPatterns,
  ML_SOURCES,
  DEMO_CREDENTIALS,
} from "@/lib/ml-models";

const trendIcons = {
  improving: TrendingUp,
  stable: Minus,
  declining: TrendingDown,
};

const trendColors = {
  improving: "text-success",
  stable: "text-warning",
  declining: "text-destructive",
};

const MLInsightsPanel = () => {
  const productivity = analyzeProductivityPatterns();
  const subjectPredictions = predictAllSubjects();
  const patterns = analyzeStudyPatterns();

  return (
    <div className="space-y-6">
      {/* Demo Credentials */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="bg-accent rounded-xl border border-primary/20 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <Key className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-semibold text-sm text-foreground">Demo Credentials</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-card rounded-lg p-3 border border-border">
            <span className="text-muted-foreground">Email</span>
            <p className="font-mono font-medium text-foreground mt-0.5">{DEMO_CREDENTIALS.email}</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <span className="text-muted-foreground">Password</span>
            <p className="font-mono font-medium text-foreground mt-0.5">{DEMO_CREDENTIALS.password}</p>
          </div>
          <div className="bg-card rounded-lg p-3 border border-border">
            <span className="text-muted-foreground">API Key</span>
            <p className="font-mono font-medium text-foreground mt-0.5 truncate">{DEMO_CREDENTIALS.apiKey}</p>
          </div>
        </div>
        <p className="text-[10px] text-muted-foreground mt-2">{DEMO_CREDENTIALS.description}</p>
      </motion.div>

      {/* ML Models Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision Tree — Productivity */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-success/15">
              <TreeDeciduous className="w-4 h-4 text-success" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground">Decision Tree</h4>
              <p className="text-[10px] text-muted-foreground">Productive Study Detection</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
              <span className="text-xs text-muted-foreground">Overall Productivity</span>
              <span className="text-lg font-heading font-bold text-success">{productivity.overallProductivity}%</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-success/5 rounded-lg border border-success/20">
                <p className="text-[10px] text-muted-foreground">Best Time</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{productivity.bestTime}</p>
              </div>
              <div className="p-2.5 bg-destructive/5 rounded-lg border border-destructive/20">
                <p className="text-[10px] text-muted-foreground">Worst Time</p>
                <p className="text-xs font-semibold text-foreground mt-0.5">{productivity.worstTime}</p>
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Recent Predictions</p>
              {productivity.predictions.slice(0, 3).map((p, i) => (
                <div key={i} className="flex items-center justify-between text-xs py-1.5">
                  <span className="text-foreground">{p.session.subject}</span>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[10px] font-medium",
                      p.prediction.isProductive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                    )}>
                      {p.prediction.isProductive ? "Productive" : "Unproductive"}
                    </span>
                    <span className="text-muted-foreground">{Math.round(p.prediction.confidence * 100)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Random Forest / Linear Regression — Readiness */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-primary/15">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground">Random Forest + LR</h4>
              <p className="text-[10px] text-muted-foreground">Exam Readiness Prediction</p>
            </div>
          </div>

          <div className="space-y-2.5">
            {subjectPredictions.map((sp, i) => {
              const TrendIcon = trendIcons[sp.prediction.trendDirection];
              return (
                <div key={i} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground">{sp.subject.name}</span>
                    <div className="flex items-center gap-1.5">
                      <TrendIcon className={cn("w-3 h-3", trendColors[sp.prediction.trendDirection])} />
                      <span className="text-xs font-heading font-bold text-foreground">
                        {sp.prediction.predictedReadiness}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${sp.prediction.predictedReadiness}%` }}
                      transition={{ duration: 0.8, delay: 0.4 + i * 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-[10px] text-muted-foreground">
                      Conf: {Math.round(sp.prediction.confidence * 100)}%
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {sp.prediction.daysToReady > 0 ? `~${sp.prediction.daysToReady}d to 80%` : "Ready!"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* K-Means — Pattern Clustering */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-card rounded-xl border border-border p-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-warning/15">
              <Hexagon className="w-4 h-4 text-warning" />
            </div>
            <div>
              <h4 className="font-heading font-semibold text-sm text-foreground">K-Means Clustering</h4>
              <p className="text-[10px] text-muted-foreground">Study Pattern Analysis</p>
            </div>
          </div>

          <div className="p-3 bg-accent rounded-lg border border-primary/20 mb-3">
            <p className="text-[10px] text-muted-foreground">Your Study Pattern</p>
            <p className="text-sm font-heading font-bold text-primary mt-0.5">{patterns.userCluster.name}</p>
            <p className="text-[10px] text-muted-foreground mt-1 leading-relaxed">{patterns.userCluster.description}</p>
          </div>

          <div className="space-y-2 mb-3">
            {patterns.clusters.map((c, i) => (
              <div key={i} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{
                    backgroundColor: i === 0 ? "hsl(239, 84%, 67%)" : i === 1 ? "hsl(160, 84%, 39%)" : "hsl(38, 92%, 50%)"
                  }} />
                  <span className="text-xs text-foreground">{c.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">{c.points.length} patterns</span>
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Insights</p>
            {patterns.patternInsights.slice(0, 2).map((insight, i) => (
              <p key={i} className="text-[10px] text-muted-foreground leading-relaxed">• {insight}</p>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Sources & References */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="bg-card rounded-xl border border-border p-5"
      >
        <div className="flex items-center gap-2 mb-4">
          <BrainCircuit className="w-4 h-4 text-primary" />
          <h4 className="font-heading font-semibold text-sm text-foreground">ML Model Sources & References</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ML_SOURCES.map((source, i) => (
            <a
              key={i}
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-muted/30 rounded-lg border border-border hover:border-primary/30 hover:bg-accent transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">{source.name}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{source.description}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1 italic">{source.paper}</p>
                </div>
                <ExternalLink className="w-3 h-3 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5 transition-colors" />
              </div>
            </a>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default MLInsightsPanel;
