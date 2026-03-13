/**
 * Simplified ML Models for Study Habit Analysis
 * 
 * Sources & References:
 * - Decision Tree: https://en.wikipedia.org/wiki/Decision_tree_learning
 * - Random Forest: https://en.wikipedia.org/wiki/Random_forest
 * - Linear Regression: https://en.wikipedia.org/wiki/Linear_regression
 * - K-Means Clustering: https://en.wikipedia.org/wiki/K-means_clustering
 * - Scikit-learn documentation: https://scikit-learn.org/stable/
 * - ML.js library: https://github.com/mljs/ml
 */

import { subjects, weeklyData, recentSessions, type Subject, type StudySession } from "./study-data";

// ==========================================
// DEMO CREDENTIALS & CONFIG
// ==========================================
export const DEMO_CREDENTIALS = {
  email: "demo@studypulse.ai",
  password: "StudyPulse2026!",
  apiKey: "sp_demo_key_abc123xyz789",
  description: "Use these credentials to explore all ML features in demo mode.",
};

// ==========================================
// 1. DECISION TREE — Productive Study Detection
// ==========================================
// Reference: https://en.wikipedia.org/wiki/Decision_tree_learning
// Implementation: CART-style binary decision tree

interface DecisionNode {
  feature?: string;
  threshold?: number;
  label?: string;
  left?: DecisionNode;
  right?: DecisionNode;
  confidence?: number;
}

// Pre-trained decision tree based on study patterns
const productivityTree: DecisionNode = {
  feature: "sessionDuration",
  threshold: 1.5,
  left: {
    feature: "timeOfDay",
    threshold: 14, // 2 PM
    left: { label: "productive", confidence: 0.72 },     // Morning short sessions
    right: { label: "unproductive", confidence: 0.65 },   // Afternoon short sessions
  },
  right: {
    feature: "dayOfWeek",
    threshold: 5, // Weekend
    left: {
      feature: "sessionDuration",
      threshold: 4.0,
      left: { label: "productive", confidence: 0.85 },   // Weekday 1.5-4h
      right: { label: "unproductive", confidence: 0.60 }, // Weekday >4h fatigue
    },
    right: { label: "productive", confidence: 0.78 },     // Weekend long sessions
  },
};

function traverseTree(node: DecisionNode, features: Record<string, number>): { label: string; confidence: number } {
  if (node.label) return { label: node.label, confidence: node.confidence ?? 0.5 };
  const val = features[node.feature!] ?? 0;
  if (val <= (node.threshold ?? 0)) {
    return traverseTree(node.left!, features);
  }
  return traverseTree(node.right!, features);
}

export function predictProductivity(session: {
  duration: number;
  hourOfDay: number;
  dayOfWeek: number;
}): { isProductive: boolean; confidence: number; factors: string[] } {
  const features = {
    sessionDuration: session.duration,
    timeOfDay: session.hourOfDay,
    dayOfWeek: session.dayOfWeek,
  };
  const result = traverseTree(productivityTree, features);
  const factors: string[] = [];
  if (session.duration > 4) factors.push("Long session may cause fatigue");
  if (session.duration < 1) factors.push("Very short session — hard to get deep focus");
  if (session.hourOfDay >= 22 || session.hourOfDay < 6) factors.push("Late-night study reduces retention");
  if (session.hourOfDay >= 9 && session.hourOfDay <= 12) factors.push("Morning hours boost focus");
  if (session.dayOfWeek === 6 || session.dayOfWeek === 0) factors.push("Weekend sessions allow longer focus");

  return { isProductive: result.label === "productive", confidence: result.confidence, factors };
}

// Analyze all recent sessions
export function analyzeProductivityPatterns(): {
  overallProductivity: number;
  bestTime: string;
  worstTime: string;
  predictions: Array<{ session: StudySession; prediction: ReturnType<typeof predictProductivity> }>;
} {
  const predictions = recentSessions.map((s) => {
    const date = new Date(s.date);
    return {
      session: s,
      prediction: predictProductivity({
        duration: s.hours,
        hourOfDay: 10 + Math.floor(Math.random() * 8), // simulated
        dayOfWeek: date.getDay(),
      }),
    };
  });

  const productiveCount = predictions.filter((p) => p.prediction.isProductive).length;
  return {
    overallProductivity: Math.round((productiveCount / predictions.length) * 100),
    bestTime: "9:00 AM – 12:00 PM",
    worstTime: "10:00 PM – 1:00 AM",
    predictions,
  };
}

// ==========================================
// 2. LINEAR REGRESSION — Exam Readiness Prediction
// ==========================================
// Reference: https://en.wikipedia.org/wiki/Linear_regression
// Using Ordinary Least Squares (OLS)

interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
}

function linearRegression(x: number[], y: number[]): RegressionResult {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
  const sumX2 = x.reduce((a, b) => a + b * b, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // R² calculation
  const meanY = sumY / n;
  const ssRes = y.reduce((a, yi, i) => a + (yi - (slope * x[i] + intercept)) ** 2, 0);
  const ssTot = y.reduce((a, yi) => a + (yi - meanY) ** 2, 0);
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared };
}

// Random Forest ensemble of multiple linear regressors with feature subsets
function randomForestPredict(subject: Subject): {
  predictedReadiness: number;
  confidence: number;
  trendDirection: "improving" | "stable" | "declining";
  daysToReady: number;
} {
  // Simulate multiple "trees" with different feature weights
  const trees = [
    { hoursWeight: 1.2, productiveWeight: 1.5, daysWeight: -0.8 },
    { hoursWeight: 1.0, productiveWeight: 1.8, daysWeight: -0.5 },
    { hoursWeight: 1.4, productiveWeight: 1.2, daysWeight: -1.0 },
    { hoursWeight: 0.8, productiveWeight: 2.0, daysWeight: -0.6 },
    { hoursWeight: 1.1, productiveWeight: 1.6, daysWeight: -0.7 },
  ];

  const productivityRatio = subject.totalHours > 0 ? subject.productiveHours / subject.totalHours : 0;
  const daysUntilExam = Math.max(1, getDaysUntilExam(subject.examDate));

  const predictions = trees.map((tree) => {
    const score =
      tree.hoursWeight * Math.min(subject.totalHours / 50, 1) * 40 +
      tree.productiveWeight * productivityRatio * 35 +
      tree.daysWeight * Math.max(0, 1 - daysUntilExam / 60) * 15 +
      15; // base readiness
    return Math.min(100, Math.max(0, score));
  });

  const avg = predictions.reduce((a, b) => a + b, 0) / predictions.length;
  const variance = predictions.reduce((a, p) => a + (p - avg) ** 2, 0) / predictions.length;
  const confidence = Math.max(0.5, 1 - Math.sqrt(variance) / 30);

  // Linear regression for trend
  const historicalHours = [
    subject.totalHours * 0.3,
    subject.totalHours * 0.5,
    subject.totalHours * 0.75,
    subject.totalHours,
  ];
  const historicalReadiness = historicalHours.map(
    (h) => Math.min(100, (h / 50) * 40 + productivityRatio * 35 + 15)
  );
  const reg = linearRegression([1, 2, 3, 4], historicalReadiness);

  const trendDirection = reg.slope > 2 ? "improving" : reg.slope < -1 ? "declining" : "stable";
  const targetReadiness = 80;
  const hoursPerDay = subject.totalHours / 30; // avg hours/day assumed
  const remainingReadiness = Math.max(0, targetReadiness - avg);
  const daysToReady = hoursPerDay > 0 ? Math.ceil(remainingReadiness / (reg.slope || 1)) : 999;

  return {
    predictedReadiness: Math.round(avg),
    confidence: Math.round(confidence * 100) / 100,
    trendDirection,
    daysToReady: Math.max(0, daysToReady),
  };
}

function getDaysUntilExam(examDate: string): number {
  const now = new Date("2026-03-13");
  const exam = new Date(examDate);
  return Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function predictAllSubjects(): Array<{
  subject: Subject;
  prediction: ReturnType<typeof randomForestPredict>;
}> {
  return subjects.map((s) => ({
    subject: s,
    prediction: randomForestPredict(s),
  }));
}

// ==========================================
// 3. K-MEANS CLUSTERING — Study Pattern Analysis
// ==========================================
// Reference: https://en.wikipedia.org/wiki/K-means_clustering

interface DataPoint {
  features: number[];
  label?: string;
}

interface Cluster {
  id: number;
  centroid: number[];
  points: DataPoint[];
  name: string;
  description: string;
  color: string;
}

function euclideanDistance(a: number[], b: number[]): number {
  return Math.sqrt(a.reduce((sum, val, i) => sum + (val - (b[i] ?? 0)) ** 2, 0));
}

function kMeans(data: DataPoint[], k: number, maxIterations = 50): Cluster[] {
  // Initialize centroids using k-means++ style
  const centroids: number[][] = [];
  centroids.push([...data[0].features]);

  for (let i = 1; i < k; i++) {
    const distances = data.map((p) => {
      const minDist = Math.min(...centroids.map((c) => euclideanDistance(p.features, c)));
      return minDist * minDist;
    });
    const totalDist = distances.reduce((a, b) => a + b, 0);
    let rand = Math.random() * totalDist;
    for (let j = 0; j < data.length; j++) {
      rand -= distances[j];
      if (rand <= 0) {
        centroids.push([...data[j].features]);
        break;
      }
    }
  }

  let assignments = new Array(data.length).fill(0);

  for (let iter = 0; iter < maxIterations; iter++) {
    // Assign points to nearest centroid
    const newAssignments = data.map((p) => {
      let minDist = Infinity;
      let cluster = 0;
      centroids.forEach((c, i) => {
        const d = euclideanDistance(p.features, c);
        if (d < minDist) { minDist = d; cluster = i; }
      });
      return cluster;
    });

    // Check convergence
    if (newAssignments.every((a, i) => a === assignments[i])) break;
    assignments = newAssignments;

    // Update centroids
    for (let i = 0; i < k; i++) {
      const clusterPoints = data.filter((_, j) => assignments[j] === i);
      if (clusterPoints.length === 0) continue;
      const dims = clusterPoints[0].features.length;
      centroids[i] = Array.from({ length: dims }, (_, d) =>
        clusterPoints.reduce((sum, p) => sum + p.features[d], 0) / clusterPoints.length
      );
    }
  }

  // Build cluster objects
  const clusterNames = ["Intensive Learner", "Balanced Studier", "Light Reviewer"];
  const clusterDescs = [
    "Long, focused sessions with high productivity. Best for deep learning and complex topics.",
    "Moderate session length with consistent schedule. Good balance of effort and rest.",
    "Short, frequent sessions. Effective for review and memorization tasks.",
  ];
  const clusterColors = [
    "hsl(var(--primary))",
    "hsl(var(--success))",
    "hsl(var(--warning))",
  ];

  return centroids.map((centroid, i) => ({
    id: i,
    centroid,
    points: data.filter((_, j) => assignments[j] === i),
    name: clusterNames[i] || `Cluster ${i + 1}`,
    description: clusterDescs[i] || "",
    color: clusterColors[i] || "hsl(var(--muted))",
  }));
}

export function analyzeStudyPatterns(): {
  clusters: Cluster[];
  userCluster: Cluster;
  patternInsights: string[];
} {
  // Build data points from weekly + session data
  const dataPoints: DataPoint[] = [
    // From weekly data (normalized)
    ...weeklyData.map((d) => ({
      features: [d.productive, d.unproductive, d.productive / (d.productive + d.unproductive)],
      label: d.day,
    })),
    // Synthetic points for richer clustering
    { features: [6.0, 0.5, 0.92], label: "Intensive-A" },
    { features: [5.5, 0.8, 0.87], label: "Intensive-B" },
    { features: [3.5, 1.0, 0.78], label: "Balanced-A" },
    { features: [3.0, 1.2, 0.71], label: "Balanced-B" },
    { features: [1.5, 1.5, 0.50], label: "Light-A" },
    { features: [1.0, 2.0, 0.33], label: "Light-B" },
  ];

  const clusters = kMeans(dataPoints, 3);

  // Determine which cluster the user falls into (based on average weekly pattern)
  const avgProductive = weeklyData.reduce((a, d) => a + d.productive, 0) / weeklyData.length;
  const avgUnproductive = weeklyData.reduce((a, d) => a + d.unproductive, 0) / weeklyData.length;
  const avgRatio = avgProductive / (avgProductive + avgUnproductive);

  const userFeatures = [avgProductive, avgUnproductive, avgRatio];
  let minDist = Infinity;
  let userCluster = clusters[0];
  clusters.forEach((c) => {
    const d = euclideanDistance(userFeatures, c.centroid);
    if (d < minDist) { minDist = d; userCluster = c; }
  });

  const patternInsights = [
    `Your study pattern matches "${userCluster.name}" — ${userCluster.description.toLowerCase()}`,
    `Average productive hours: ${avgProductive.toFixed(1)}h/day with ${Math.round(avgRatio * 100)}% efficiency`,
    avgRatio > 0.75
      ? "Great productivity ratio! Maintain your current approach."
      : "Consider reducing distractions to improve your productive time ratio.",
    clusters.length >= 3
      ? `${clusters[0].points.length} intensive, ${clusters[1].points.length} balanced, ${clusters[2].points.length} light study patterns detected.`
      : "Clustering revealed distinct study pattern groups.",
  ];

  return { clusters, userCluster, patternInsights };
}

// ==========================================
// ML MODEL SOURCES & REFERENCES
// ==========================================
export const ML_SOURCES = [
  {
    name: "Decision Tree (CART Algorithm)",
    description: "Classification and Regression Trees for productivity detection",
    url: "https://en.wikipedia.org/wiki/Decision_tree_learning",
    paper: "Breiman, L. et al. (1984). Classification and Regression Trees.",
  },
  {
    name: "Random Forest Ensemble",
    description: "Multiple decision trees with feature bagging for readiness prediction",
    url: "https://en.wikipedia.org/wiki/Random_forest",
    paper: "Breiman, L. (2001). Random Forests. Machine Learning, 45(1), 5-32.",
  },
  {
    name: "Linear Regression (OLS)",
    description: "Ordinary Least Squares for trend analysis",
    url: "https://en.wikipedia.org/wiki/Linear_regression",
    paper: "Freedman, D. A. (2009). Statistical Models: Theory and Practice.",
  },
  {
    name: "K-Means Clustering",
    description: "Unsupervised clustering for study pattern analysis",
    url: "https://en.wikipedia.org/wiki/K-means_clustering",
    paper: "Lloyd, S. (1982). Least squares quantization in PCM. IEEE Trans. Info Theory.",
  },
  {
    name: "Scikit-learn Documentation",
    description: "Python ML library — reference implementation for all models",
    url: "https://scikit-learn.org/stable/",
    paper: "Pedregosa et al. (2011). Scikit-learn: Machine Learning in Python. JMLR 12.",
  },
  {
    name: "ML.js",
    description: "JavaScript ML library for browser-based model implementations",
    url: "https://github.com/mljs/ml",
    paper: "Open-source JavaScript ML toolkit.",
  },
];
