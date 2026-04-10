import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  MessageCircle,
  Smartphone,
  Download,
  UserPlus } from
"lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const Footer = () => {
  const { user } = useAuth();
  const { t } = useTranslation('common');
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async () => {
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      toast.error(t('footer.invalidEmail', 'Please enter a valid email address'));
      return;
    }
    setSubmitting(true);
    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: trimmed });
    setSubmitting(false);
    if (error) {
      if (error.code === '23505') {
        toast.info(t('footer.alreadySubscribed', 'You are already subscribed!'));
      } else {
        toast.error(t('footer.subscribeError', 'Something went wrong. Please try again.'));
      }
    } else {
      toast.success(t('footer.subscribeSuccess', 'Successfully subscribed!'));
      setEmail("");
    }
  };

  return (
    <footer className="bg-muted/30 border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary p-2 rounded-lg">
                <Stethoscope className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">Doctori AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
            <Link to="/chat">
              <Button variant="medical" size="sm" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                {t('footer.startChatNow')}
              </Button>
            </Link>
            {!user &&
            <Link to="/register/provider">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <UserPlus className="mr-2 h-4 w-4" />
                  {t('footer.becomeProvider')}
                </Button>
              </Link>
            }
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-center">{t('footer.quickLinks')}</h3>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block text-muted-foreground hover:text-primary transition-colors text-center">
                {t('footer.home')}
              </Link>
              <Link to="/doctors" className="block text-muted-foreground hover:text-primary transition-colors text-center">
                {t('footer.findDoctors')}
              </Link>
              <Link to="/doctor-directory" className="block text-muted-foreground hover:text-primary transition-colors text-center">
                {t('footer.doctorDirectory')}
              </Link>
              <Link to="/blog" className="block text-muted-foreground hover:text-primary transition-colors text-center">
                {t('footer.healthBlog')}
              </Link>
              <Link to="/about" className="block text-muted-foreground hover:text-primary transition-colors text-center">
                {t('footer.aboutUs')}
              </Link>
              <Link to="/contact" className="block text-muted-foreground hover:text-primary transition-colors text-center">
                {t('footer.contact')}
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-semibold text-center">{t('footer.legal')}</h3>
            <div className="space-y-2 text-sm">
              <Link to="/terms" className="block text-muted-foreground hover:text-primary transition-colors text-center">
                {t('footer.termsConditions')}
              </Link>
              <Link to="/privacy" className="block text-muted-foreground hover:text-primary transition-colors text-center">
                {t('footer.privacyPolicy')}
              </Link>
              <Link
                to="/doctor-verification"
                className="block text-muted-foreground hover:text-primary transition-colors text-center">

                {t('footer.doctorVerification')}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold text-center">{t('footer.contactInfo')}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4" />
                <span>+1-800-DOCTORI</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span>support@doctoriai.com</span>
              </div>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{t('footer.availableWorldwide')}</span>
              </div>
            </div>
          </div>

          {/* Download Apps */}
          <div className="space-y-4">
            <h3 className="font-semibold">{t('footer.downloadApps')}</h3>
            <p className="text-sm text-muted-foreground">{t('footer.getOnMobile')}</p>
            <div className="space-y-2">
              <Link to="/install">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  {t('footer.googlePlay')}
                </Button>
              </Link>
              <Link to="/install">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Smartphone className="h-4 w-4 mr-2" />
                  {t('footer.appStore')}
                </Button>
              </Link>
            </div>
            <p className="text-xs text-muted-foreground">{t('footer.comingSoon')}</p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-center">{t('footer.healthUpdates')}</h3>
            <p className="text-sm text-muted-foreground">{t('footer.weeklyTips')}</p>
            <div className="space-y-2">
              <Input
                placeholder={t('footer.emailPlaceholder')}
                className="text-sm"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              />
              <Button variant="healing" size="sm" className="w-full" onClick={handleSubscribe} disabled={submitting}>
                {submitting ? '...' : t('footer.subscribe')}
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-muted-foreground">
            {t('footer.copyright')}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{t('footer.followUs')}</span>
            <div className="flex space-x-2">
              <a href="https://www.facebook.com/doctoriai" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Facebook className="h-4 w-4" />
                </Button>
              </a>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Twitter className="h-4 w-4" />
              </Button>
              <a href="https://www.instagram.com/doctoriai/" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Instagram className="h-4 w-4" />
                </Button>
              </a>
              <a href="https://www.linkedin.com/company/doctoriai/?viewAsMember=true" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Linkedin className="h-4 w-4" />
                </Button>
              </a>
            </div>
            {/* Staff Access Link */}
            <Link to="/login/admin" className="text-muted-foreground hover:text-primary transition-colors text-xs">
              {t('footer.staffAccess')}
            </Link>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 pt-8 border-t opacity-60">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{t('footer.dataSecured')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Stethoscope className="h-4 w-4" />
            <span>{t('footer.medicalGradeSecurity')}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Heart className="h-4 w-4" />
            <span>{t('footer.available247')}</span>
          </div>
        </div>
      </div>
    </footer>);

};