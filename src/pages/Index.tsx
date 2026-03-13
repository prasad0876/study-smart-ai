import { useState } from "react";
import AppSidebar from "@/components/AppSidebar";
import StatCard from "@/components/StatCard";
import WeeklyChart from "@/components/WeeklyChart";
import AIRecommendations from "@/components/AIRecommendations";
import SubjectList from "@/components/SubjectList";
import ExamReadinessPanel from "@/components/ExamReadinessPanel";
import RecentSessions from "@/components/RecentSessions";
import { Clock, TrendingUp, Calendar, BookOpen } from "lucide-react";
import { subjects, weeklyData, getDaysUntilExam } from "@/lib/study-data";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [collapsed, setCollapsed] = useState(false);

  const totalHours = subjects.reduce((a, s) => a + s.totalHours, 0);
  const totalProductive = subjects.reduce((a, s) => a + s.productiveHours, 0);
  const productivityScore = Math.round((totalProductive / totalHours) * 100);
  const nearestExam = subjects.reduce((a, s) => {
    const d = getDaysUntilExam(s.examDate);
    return d < getDaysUntilExam(a.examDate) ? s : a;
  });
  const weekTotal = weeklyData.reduce((a, d) => a + d.productive + d.unproductive, 0);

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <main className="flex-1 overflow-auto">
        <header className="h-16 border-b border-border flex items-center justify-between px-8">
          <div>
            <h1 className="text-xl font-heading font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Welcome back — here's your study overview</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-heading font-bold">
              S
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-6">
          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Study Hours"
              value={`${totalHours}h`}
              subtitle="Across all subjects"
              icon={Clock}
              trend={{ value: "12% vs last week", positive: true }}
              variant="primary"
            />
            <StatCard
              title="Productivity Score"
              value={`${productivityScore}%`}
              subtitle="Productive / Total hours"
              icon={TrendingUp}
              trend={{ value: "3% improvement", positive: true }}
              variant="success"
            />
            <StatCard
              title="Next Exam"
              value={`${getDaysUntilExam(nearestExam.examDate)}d`}
              subtitle={nearestExam.name}
              icon={Calendar}
              variant="warning"
            />
            <StatCard
              title="This Week"
              value={`${weekTotal.toFixed(1)}h`}
              subtitle="Total study time"
              icon={BookOpen}
              trend={{ value: "On track", positive: true }}
            />
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <WeeklyChart />
              <ExamReadinessPanel />
            </div>
            <div className="space-y-6">
              <SubjectList />
              <RecentSessions />
            </div>
          </div>

          {/* AI Recommendations */}
          <AIRecommendations />
        </div>
      </main>
    </div>
  );
};

export default Index;
