import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  Stethoscope,
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Bell
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

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

export default function AdminOverview({ stats, recentActivity, onNavigate }: AdminOverviewProps) {
  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      description: 'Registered patients',
      color: 'text-blue-600',
      bgColor: 'bg-blue-500/10',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Healthcare Providers',
      value: stats.totalProviders,
      icon: Stethoscope,
      description: 'Medical professionals',
      color: 'text-green-600',
      bgColor: 'bg-green-500/10',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      description: 'Awaiting review',
      color: 'text-orange-600',
      bgColor: 'bg-orange-500/10',
      onClick: () => onNavigate('pending')
    },
    {
      title: 'Active Providers',
      value: stats.activeProviders,
      icon: CheckCircle,
      description: 'Approved & active',
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      description: 'All bookings',
      color: 'text-purple-600',
      bgColor: 'bg-purple-500/10',
      onClick: () => onNavigate('bookings')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome Back, Admin</h1>
          <p className="text-muted-foreground">Here's what's happening with your platform today.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onNavigate('pending')}>
            <Bell className="h-4 w-4 mr-2" />
            {stats.pendingApprovals} Pending
          </Button>
          <Button onClick={() => onNavigate('bookings')}>
            <Calendar className="h-4 w-4 mr-2" />
            View Bookings
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <Card 
            key={stat.title}
            className={stat.onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
            onClick={stat.onClick}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground">{stat.description}</p>
                {stat.trend && (
                  <div className={`flex items-center text-xs ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {stat.trend}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions and Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => onNavigate('pending')}
            >
              <Clock className="h-4 w-4 mr-2" />
              Review Pending Providers
              {stats.pendingApprovals > 0 && (
                <Badge variant="secondary" className="ml-auto">
                  {stats.pendingApprovals}
                </Badge>
              )}
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => onNavigate('bookings')}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Manage Bookings
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => onNavigate('users')}
            >
              <Users className="h-4 w-4 mr-2" />
              View All Users
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => onNavigate('providers')}
            >
              <Stethoscope className="h-4 w-4 mr-2" />
              Manage Providers
            </Button>
            <Button 
              variant="outline" 
              className="justify-start"
              onClick={() => onNavigate('analytics')}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              View Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent activity
                </p>
              ) : (
                recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="p-2 rounded-full bg-muted">
                      {activity.type === 'user' && <Users className="h-3 w-3" />}
                      {activity.type === 'provider' && <Stethoscope className="h-3 w-3" />}
                      {activity.type === 'booking' && <Calendar className="h-3 w-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(activity.time, { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
