import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User, Stethoscope, ChevronDown, UserPlus, Search, Download } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useRoleBasedAuth } from "@/hooks/useRoleBasedAuth";
import { LanguageSelector } from "@/components/LanguageSelector";
import { NotificationBell } from "@/components/NotificationBell";
import { Input } from "@/components/ui/input";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { profile } = useRoleBasedAuth();
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showInstallBtn, setShowInstallBtn] = useState(false);
  const [showBetaBanner, setShowBetaBanner] = useState(() => {
    return !localStorage.getItem('beta-banner-dismissed');
  });

  useEffect(() => {
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      || (navigator as any).standalone === true;
    if (isStandalone) return;
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    if (dismissed) return;
    // Show install button on mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) setShowInstallBtn(true);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };
  
  // Helper function to get dashboard path based on user role
  const getDashboardPath = () => {
    if (!profile) return '/login';
    
    switch (profile.role) {
      case 'user':
        return '/dashboard/user';
      case 'provider':
        return profile.approval_status === 'approved' 
          ? '/dashboard/provider' 
          : '/dashboard/provider/pending';
      case 'admin':
        return '/dashboard/admin';
      default:
        return '/login';
    }
  };
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  const isActive = (path: string) => location.pathname === path;
  const isBlogActive = location.pathname.startsWith('/blog');
  const dismissBetaBanner = () => {
    setShowBetaBanner(false);
    localStorage.setItem('beta-banner-dismissed', 'true');
  };

  return (
    <>
      {/* Beta Notification Bar */}
      {showBetaBanner && (
        <div className="bg-primary text-primary-foreground text-sm py-2 px-4 text-center relative z-50">
          <div className="container flex items-center justify-center gap-3 flex-wrap">
            <span className="font-medium">
              🚀 Doctori AI is currently in Private Beta — Experience the future of AI Healthcare.
            </span>
            <Link to="/login">
              <Button size="sm" className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0 rounded-full text-xs px-4 h-7">
                Join Waitlist
              </Button>
            </Link>
            <button
              onClick={dismissBetaBanner}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              aria-label="Dismiss beta banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Doctori AI
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`text-foreground hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : ''}`}>
              {t('nav.home')}
            </Link>
            <Link to="/chat" title="Chat with AI health assistant" className={`text-foreground hover:text-primary transition-colors ${isActive('/chat') ? 'text-primary' : ''}`}>
              {t('nav.aiHealthAssistant')}
            </Link>
            <Link to="/doctors" title="Find and book verified doctors near you" className={`text-foreground hover:text-primary transition-colors ${isActive('/doctors') ? 'text-primary' : ''}`}>
              {t('nav.findDoctors')}
            </Link>
            <Link to="/medicine" title="Search medicine information and drug interactions" className={`text-foreground hover:text-primary transition-colors ${isActive('/medicine') ? 'text-primary' : ''}`}>
              {t('nav.searchMedicine')}
            </Link>
            
            
            {/* Health Blog Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`flex items-center space-x-1 ${isBlogActive ? 'text-primary' : ''}`}>
                  <span>{t('nav.healthBlog')}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border z-50">
                <DropdownMenuItem asChild>
                  <Link to="/blog" className="w-full">{t('nav.allBlogs')}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/health-tips" className="w-full">{t('nav.healthTips')}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Dashboard link for authenticated users */}
            {user && profile && (
              <Link to={getDashboardPath()} className={`text-foreground hover:text-primary transition-colors ${location.pathname.startsWith('/dashboard') ? 'text-primary' : ''}`}>
                {t('nav.dashboard')}
              </Link>
            )}
          </div>

          {/* Language selector and Auth buttons */}
          <div className="hidden md:flex items-center space-x-2">
            <LanguageSelector />
            {user && <NotificationBell />}
            {user ? <Button variant="ghost" size="sm" onClick={handleSignOut} aria-label="Sign out">
                <LogOut className="h-4 w-4" />
              </Button> : <Link to="/login">
                <Button variant="outline" size="sm" aria-label="Log in to your account">
                  <User className="h-4 w-4" />
                </Button>
              </Link>}
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>

          {/* Mobile Navigation */}
          {isOpen && <div className="absolute top-16 left-0 right-0 bg-background border-b md:hidden z-50">
              <div className="container py-4 space-y-4">
                <Link to="/" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.home')}
                </Link>
                <Link to="/chat" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.aiHealthAssistant')}
                </Link>
                <Link to="/doctors" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.findDoctors')}
                </Link>
                <Link to="/medicine" className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                  {t('nav.searchMedicine')}
                </Link>
                
                
                {/* Mobile Health Blog Section */}
                <div className="py-2">
                  <p className="text-foreground font-medium mb-2">{t('nav.healthBlog')}</p>
                  <Link to="/blog" className="block text-foreground hover:text-primary transition-colors py-1 pl-4" onClick={() => setIsOpen(false)}>
                    {t('nav.allBlogs')}
                  </Link>
                  <Link to="/health-tips" className="block text-foreground hover:text-primary transition-colors py-1 pl-4" onClick={() => setIsOpen(false)}>
                    {t('nav.healthTips')}
                  </Link>
                </div>
                
                
                {/* Dashboard link for mobile */}
                {user && profile && (
                  <Link to={getDashboardPath()} className="block text-foreground hover:text-primary transition-colors py-2" onClick={() => setIsOpen(false)}>
                    {t('nav.dashboard')}
                  </Link>
                )}
                
                {/* Install App link for mobile */}
                {showInstallBtn && (
                  <Link to="/install" className="flex items-center gap-2 text-primary font-medium py-2" onClick={() => setIsOpen(false)}>
                    <Download className="h-4 w-4" /> Install App
                  </Link>
                )}

                <div className="pt-4 border-t">
                  <LanguageSelector />
                  <div className="mt-3 space-y-2">
                    {user ? <Button variant="ghost" size="sm" onClick={handleSignOut} className="w-full justify-start">
                        <LogOut className="h-4 w-4" />
                      </Button> : <Link to="/login" className="block">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <User className="h-4 w-4" />
                        </Button>
                      </Link>}
                  </div>
                </div>
              </div>
            </div>}
        </div>
      </nav>

      {/* Search Bar - Separate line under menu (not sticky) */}
      <div className="border-b bg-background/80">
        <div className="container py-2">
          <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={t('nav.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full rounded-full border-primary/20 focus:border-primary"
              aria-label="Search doctors, medicine, and health articles"
            />
          </form>
        </div>
      </div>
    </>
  );
};
