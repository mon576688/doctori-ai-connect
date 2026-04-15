import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Users,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Shield,
  Activity,
  Zap,
  UserPlus,
  FileSearch,
  BarChart3,
  Server
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AdminOverviewProps {
  stats: {
    totalUsers: number;
    totalProviders: number;
    pendingApprovals: number;
    activeProviders: number;
    totalAppointments: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    message: string;
    time: Date;
  }>;
  onNavigate: (tab: string) => void;
}

function AnimatedNumber({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const steps = 30;
    const increment = value / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= value) { setDisplay(value); clearInterval(interval); }
      else setDisplay(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(interval);
  }, [value, duration]);
  return <>{display.toLocaleString()}</>;
}

// Simulated growth data for chart
function generateChartData() {
  const data = [];
  const now = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      users: Math.floor(Math.random() * 15) + 5 + (30 - i),
      providers: Math.floor(Math.random() * 5) + 1 + Math.floor((30 - i) / 3),
    });
  }
  return data;
}

export default function AdminOverview({ stats, recentActivity, onNavigate }: AdminOverviewProps) {
  const [chartData] = useState(generateChartData);

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      trend: '+12%',
      trendUp: true,
      gradient: 'from-blue-500/10 to-blue-600/5',
      iconBg: 'bg-blue-500/10',
      iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
      title: 'Providers',
      value: stats.totalProviders,
      icon: Stethoscope,
      trend: '+8%',
      trendUp: true,
      gradient: 'from-emerald-500/10 to-emerald-600/5',
      iconBg: 'bg-emerald-500/10',
      iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      title: 'Pending',
      value: stats.pendingApprovals,
      icon: Clock,
      gradient: 'from-amber-500/10 to-amber-600/5',
      iconBg: 'bg-amber-500/10',
      iconColor: 'text-amber-600 dark:text-amber-400',
      onClick: () => onNavigate('pending'),
    },
    {
      title: 'Active Providers',
      value: stats.activeProviders,
      icon: CheckCircle,
      trend: '+5%',
      trendUp: true,
      gradient: 'from-teal-500/10 to-teal-600/5',
      iconBg: 'bg-teal-500/10',
      iconColor: 'text-teal-600 dark:text-teal-400',
    },
    {
      title: 'Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      trend: '+18%',
      trendUp: true,
      gradient: 'from-violet-500/10 to-violet-600/5',
      iconBg: 'bg-violet-500/10',
      iconColor: 'text-violet-600 dark:text-violet-400',
      onClick: () => onNavigate('bookings'),
    },
  ];

  const quickActions = [
    { icon: Clock, label: 'Review Pending', desc: 'Approve providers', tab: 'pending', color: 'text-amber-600' },
    { icon: UserPlus, label: 'Add Provider', desc: 'Register new', tab: 'add-provider', color: 'text-blue-600' },
    { icon: FileSearch, label: 'Documents', desc: 'Review uploads', tab: 'documents', color: 'text-emerald-600' },
    { icon: BarChart3, label: 'Analytics', desc: 'View reports', tab: 'analytics', color: 'text-violet-600' },
  ];

  const activityIconMap: Record<string, typeof Users> = {
    user: Users,
    provider: Stethoscope,
    booking: Calendar,
  };

  const activityColorMap: Record<string, string> = {
    user: 'bg-blue-500',
    provider: 'bg-emerald-500',
    booking: 'bg-violet-500',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-2">
          {stats.pendingApprovals > 0 && (
            <Button variant="outline" size="sm" onClick={() => onNavigate('pending')} className="gap-2">
              <Bell className="h-3.5 w-3.5" />
              <span>{stats.pendingApprovals} Pending</span>
            </Button>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat, i) => (
          <Card
            key={stat.title}
            className={cn(
              "relative overflow-hidden border-0 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group",
              `bg-gradient-to-br ${stat.gradient}`
            )}
            style={{ animationDelay: `${i * 80}ms` }}
            onClick={stat.onClick}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-lg", stat.iconBg)}>
                  <stat.icon className={cn("h-4 w-4", stat.iconColor)} />
                </div>
                {stat.trend && (
                  <div className={cn(
                    "flex items-center gap-0.5 text-[11px] font-semibold px-1.5 py-0.5 rounded-full",
                    stat.trendUp ? "text-emerald-700 bg-emerald-500/10 dark:text-emerald-400" : "text-red-700 bg-red-500/10"
                  )}>
                    {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.trend}
                  </div>
                )}
              </div>
              <div className="text-2xl font-bold tracking-tight">
                <AnimatedNumber value={stat.value} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts + Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Area Chart */}
        <Card className="lg:col-span-2 border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Growth Overview</CardTitle>
              <Badge variant="outline" className="text-[10px]">Last 30 days</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProviders" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} className="text-muted-foreground" interval="preserveStartEnd" />
                  <YAxis tick={{ fontSize: 10 }} className="text-muted-foreground" />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid hsl(var(--border))',
                      backgroundColor: 'hsl(var(--card))',
                      fontSize: '12px',
                    }}
                  />
                  <Area type="monotone" dataKey="users" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                  <Area type="monotone" dataKey="providers" stroke="hsl(160, 84%, 39%)" fillOpacity={1} fill="url(#colorProviders)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No recent activity</p>
              ) : (
                recentActivity.slice(0, 6).map((activity, i) => {
                  const Icon = activityIconMap[activity.type] || Users;
                  const dotColor = activityColorMap[activity.type] || 'bg-muted-foreground';
                  return (
                    <div key={activity.id} className="flex items-start gap-3 py-2.5 relative">
                      {/* Timeline connector */}
                      {i < Math.min(recentActivity.length - 1, 5) && (
                        <div className="absolute left-[11px] top-[30px] w-px h-[calc(100%-14px)] bg-border" />
                      )}
                      <div className={cn("h-[22px] w-[22px] rounded-full flex items-center justify-center flex-shrink-0 relative z-10", dotColor)}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs leading-snug line-clamp-2">{activity.message}</p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatDistanceToNow(activity.time, { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions + System Health */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <button
                  key={action.tab}
                  onClick={() => onNavigate(action.tab)}
                  className="flex flex-col items-start gap-2 p-3 rounded-xl bg-muted/30 hover:bg-muted/60 transition-all duration-200 group text-left"
                >
                  <action.icon className={cn("h-5 w-5", action.color)} />
                  <div>
                    <p className="text-xs font-semibold">{action.label}</p>
                    <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">System Health</CardTitle>
              <Shield className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { label: 'API Status', value: 'Operational', color: 'bg-emerald-500', icon: Server },
                { label: 'Database', value: 'Healthy', color: 'bg-emerald-500', icon: Activity },
                { label: 'Auth Service', value: 'Active', color: 'bg-emerald-500', icon: Shield },
                { label: 'Edge Functions', value: 'Running', color: 'bg-emerald-500', icon: Zap },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("h-1.5 w-1.5 rounded-full", item.color)} />
                    <span className="text-[11px] text-muted-foreground">{item.value}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
