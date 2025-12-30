import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  ChevronRight,
  Shield,
  Clock,
  FolderKanban,
  Menu,
  X,
  Heart,
  ExternalLink,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Separator } from '@/components/ui/separator';

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  href?: string;
  badge?: number;
  active?: boolean;
  children?: { label: string; href: string; badge?: number }[];
}

const SidebarItem = ({ icon: Icon, label, href, badge, active, children }: SidebarItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  if (children) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              "hover:bg-accent hover:text-accent-foreground",
              isOpen && "bg-accent/50"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="flex-1 text-left">{label}</span>
            {badge !== undefined && (
              <Badge variant="secondary" className="ml-auto mr-2">
                {badge}
              </Badge>
            )}
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-7 space-y-1 mt-1">
          {children.map((child) => (
            <Link
              key={child.href}
              to={child.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                location.pathname === child.href && "bg-primary text-primary-foreground"
              )}
            >
              <span>{child.label}</span>
              {child.badge !== undefined && (
                <Badge variant="secondary" className="ml-auto">
                  {child.badge}
                </Badge>
              )}
            </Link>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      to={href || '#'}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        active && "bg-primary text-primary-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <Badge variant="secondary" className="ml-auto">
          {badge}
        </Badge>
      )}
    </Link>
  );
};

interface AdminSidebarProps {
  pendingCount: number;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function AdminSidebar({ pendingCount, activeTab, onTabChange }: AdminSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'bookings', icon: Calendar, label: 'Bookings', badge: 0 },
    { id: 'pending', icon: Clock, label: 'Pending Approvals', badge: pendingCount },
    { id: 'providers', icon: Stethoscope, label: 'Healthcare Providers' },
    { id: 'provider-services', icon: Package, label: 'Provider Services' },
    { id: 'add-provider', icon: UserCog, label: 'Add Provider' },
    { id: 'hospitals', icon: FolderKanban, label: 'Hospitals & Clinics' },
    { id: 'users', icon: Users, label: 'All Users' },
    { id: 'user-mgmt', icon: UserCog, label: 'User Management' },
    { id: 'blood-donors', icon: Heart, label: 'Blood Donors' },
    { id: 'documents', icon: FileText, label: 'Document Review' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'content', icon: FolderKanban, label: 'Content Management' },
    { id: 'bulk', icon: Settings, label: 'Bulk Operations' },
    { id: 'export', icon: ClipboardList, label: 'Data Export' },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <span className="font-bold text-lg">Admin Panel</span>
        </div>
      </div>
      
      {/* Scrollable Menu */}
      <div className="flex-1 overflow-y-auto p-3 min-h-0">
        <div className="space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                setMobileOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                "hover:bg-accent hover:text-accent-foreground",
                activeTab === item.id && "bg-primary text-primary-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge variant={activeTab === item.id ? "secondary" : "default"} className="ml-auto">
                  {item.badge}
                </Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer - Always at bottom */}
      <div className="p-4 border-t flex-shrink-0 mt-auto bg-card">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Doctori AI</span>
            <Badge variant="outline" className="text-xs">v1.0</Badge>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
            Go to Main Site
          </Link>
        </div>
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
          "fixed left-0 top-0 h-screen w-64 bg-card border-r z-40 transition-transform duration-200 flex flex-col",
          "md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
