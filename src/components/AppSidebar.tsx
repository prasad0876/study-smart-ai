import { BarChart3, BookOpen, BrainCircuit, LayoutDashboard, Settings, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", id: "overview" },
  { icon: BookOpen, label: "Subjects", id: "subjects" },
  { icon: Clock, label: "Sessions", id: "sessions" },
  { icon: BrainCircuit, label: "AI Planner", id: "planner" },
  { icon: BarChart3, label: "Analytics", id: "analytics" },
  { icon: Settings, label: "Settings", id: "settings" },
];

interface AppSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  collapsed: boolean;
  onToggle: () => void;
}

const AppSidebar = ({ activeTab, onTabChange, collapsed, onToggle }: AppSidebarProps) => {
  return (
    <aside
      className={cn(
        "h-screen bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center gap-3 px-5 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
          <BrainCircuit className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && (
          <span className="font-heading font-bold text-lg text-foreground truncate">StudyPulse</span>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              activeTab === item.id
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="truncate">{item.label}</span>}
          </button>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="px-5 py-4 text-muted-foreground hover:text-foreground text-xs border-t border-border transition-colors"
      >
        {collapsed ? "→" : "← Collapse"}
      </button>
    </aside>
  );
};

export default AppSidebar;
