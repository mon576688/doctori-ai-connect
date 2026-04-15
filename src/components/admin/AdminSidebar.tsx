import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  UserCog,
  Stethoscope,
  ClipboardList,
  BarChart3,
  Settings,
  FileText,
  ChevronDown,
  Shield,
  Clock,
  FolderKanban,
  Menu,
  X,
  Heart,
  ExternalLink,
  Package,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface AdminSidebarProps {
  pendingCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface MenuGroup {
  label: string;
  items: { id: string; icon: typeof LayoutDashboard; label: string; badge?: number }[];
}

export default function AdminSidebar({ pendingCount, activeTab, onTabChange }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    overview: true,
    management: true,
    operations: true,
    insights: true,
  });

  const menuGroups: MenuGroup[] = [
    {
      label: 'Overview',
      items: [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'bookings', icon: Calendar, label: 'Bookings' },
        { id: 'pending', icon: Clock, label: 'Pending Approvals', badge: pendingCount },
      ],
    },
    {
      label: 'Management',
      items: [
        { id: 'providers', icon: Stethoscope, label: 'Healthcare Providers' },
        { id: 'provider-services', icon: Package, label: 'Provider Services' },
        { id: 'add-provider', icon: UserCog, label: 'Add Provider' },
        { id: 'hospitals', icon: FolderKanban, label: 'Hospitals & Clinics' },
        { id: 'users', icon: Users, label: 'All Users' },
        { id: 'user-mgmt', icon: UserCog, label: 'User Management' },
      ],
    },
    {
      label: 'Operations',
      items: [
        { id: 'blood-donors', icon: Heart, label: 'Blood Donors' },
        { id: 'documents', icon: FileText, label: 'Document Review' },
        { id: 'bulk', icon: Settings, label: 'Bulk Operations' },
        { id: 'export', icon: ClipboardList, label: 'Data Export' },
      ],
    },
    {
      label: 'Insights',
      items: [
        { id: 'analytics', icon: BarChart3, label: 'Analytics' },
        { id: 'content', icon: FolderKanban, label: 'Content Management' },
      ],
    },
  ];

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({ ...prev, [label.toLowerCase()]: !prev[label.toLowerCase()] }));
  };

  const filteredGroups = search.trim()
    ? menuGroups.map(g => ({
        ...g,
        items: g.items.filter(i => i.label.toLowerCase().includes(search.toLowerCase())),
      })).filter(g => g.items.length > 0)
    : menuGroups;

  const SidebarContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="p-5 flex-shrink-0">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-sm tracking-tight text-foreground">Doctori AI</span>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Admin Console</p>
          </div>
        </div>
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/30"
          />
        </div>
      </div>

      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto px-3 pb-3 min-h-0">
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <Collapsible
              key={group.label}
              open={openGroups[group.label.toLowerCase()] !== false}
              onOpenChange={() => toggleGroup(group.label)}
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full px-2 py-1 group">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.label}
                </span>
                <ChevronDown className={cn(
                  "h-3 w-3 text-muted-foreground transition-transform duration-200",
                  openGroups[group.label.toLowerCase()] === false && "-rotate-90"
                )} />
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-1">
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200",
                        "hover:bg-accent/50",
                        activeTab === item.id
                          ? "bg-primary/10 text-primary border-l-2 border-primary"
                          : "text-muted-foreground hover:text-foreground border-l-2 border-transparent"
                      )}
                    >
                      <item.icon className="h-4 w-4 flex-shrink-0" />
                      <span className="flex-1 text-left truncate">{item.label}</span>
                      {item.id === 'pending' && pendingCount > 0 && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive" />
                        </span>
                      )}
                      {item.badge !== undefined && item.badge > 0 && (
                        <Badge
                          variant="secondary"
                          className="h-5 min-w-[20px] px-1.5 text-[10px] font-semibold"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-border/50 flex-shrink-0 mt-auto">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-muted-foreground">System Online</span>
          </div>
          <Badge variant="outline" className="text-[10px] h-5">v2.0</Badge>
        </div>
        <Link
          to="/"
          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors mt-1"
        >
          <ExternalLink className="h-3 w-3" />
          Go to Main Site
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
      >
        {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border/50 z-40 transition-transform duration-300 flex flex-col",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
