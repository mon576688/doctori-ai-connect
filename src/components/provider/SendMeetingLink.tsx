import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Video, MessageCircle, Phone, Link2, Send, Loader2, Monitor } from 'lucide-react';
import { generateJitsiLink } from '@/lib/bookingUtils';
import { useAuth } from '@/hooks/useAuth';

interface SendMeetingLinkProps {
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const platformOptions = [
  { value: 'jitsi', label: 'Jitsi Meet', icon: Monitor, placeholder: 'Auto-generated' },
  { value: 'zoom', label: 'Zoom', icon: Video, placeholder: 'https://zoom.us/j/...' },
  { value: 'google-meet', label: 'Google Meet', icon: Video, placeholder: 'https://meet.google.com/...' },
  { value: 'whatsapp', label: 'WhatsApp Call', icon: MessageCircle, placeholder: 'Will call via WhatsApp' },
  { value: 'phone', label: 'Phone Call', icon: Phone, placeholder: 'Will call directly' },
];

export default function SendMeetingLink({
  appointmentId,
  patientId,
  patientName,
  patientPhone,
  open,
  onOpenChange,
  onSuccess,
}: SendMeetingLinkProps) {
  const { user } = useAuth();
  const [platform, setPlatform] = useState('jitsi');
  const [meetingLink, setMeetingLink] = useState('');
  const [message, setMessage] = useState(
    `Hello ${patientName}, your consultation is scheduled. Please join using the link below.`
  );
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    setSending(true);
    
    try {
      // For video platforms (non-Jitsi), require a link
      if ((platform === 'zoom' || platform === 'google-meet') && !meetingLink) {
        toast.error('Please enter a meeting link');
        setSending(false);
        return;
      }

      // Auto-generate Jitsi link if selected
      const jitsiLink = platform === 'jitsi' ? generateJitsiLink(appointmentId) : '';

      // Update appointment with consultation link
      const linkToSave = platform === 'jitsi'
        ? jitsiLink
        : platform === 'zoom' || platform === 'google-meet' 
          ? meetingLink 
          : platform === 'whatsapp' && patientPhone 
            ? `https://wa.me/${patientPhone.replace(/\D/g, '')}` 
            : `tel:${patientPhone}`;

      const { error: updateError } = await supabase
        .from('appointments')
        .update({ 
          consultation_link: linkToSave,
          consultation_platform: platform
        })
        .eq('id', appointmentId);

      if (updateError) throw updateError;

      // Send notification to patient
      const { error: notifyError } = await supabase.rpc('send_notification', {
        _user_id: patientId,
        _title: 'Consultation Link Received',
        _message: platform === 'zoom' || platform === 'google-meet'
          ? `Your doctor has shared a meeting link for your consultation. Click to join: ${meetingLink}`
          : `Your doctor will contact you via ${platform === 'whatsapp' ? 'WhatsApp' : 'phone call'} at your scheduled time.`,
        _type: 'info',
        _link: linkToSave,
      });

      if (notifyError) {
        console.error('Notification error:', notifyError);
      }

      // Also post the link as a direct message
      if (user && (platform === 'jitsi' || platform === 'zoom' || platform === 'google-meet')) {
        const displayLink = platform === 'jitsi' ? jitsiLink : meetingLink;
        await supabase.from('direct_messages').insert({
          sender_id: user.id,
          receiver_id: patientId,
          content: `[SYSTEM] Meeting link shared. Join your consultation: ${displayLink}`
        });
      }

      toast.success('Meeting link sent to patient!');
      onOpenChange(false);
      onSuccess?.();
      
      // Reset form
      setMeetingLink('');
      setPlatform('zoom');
    } catch (error) {
      console.error('Error sending meeting link:', error);
      toast.error('Failed to send meeting link');
    } finally {
      setSending(false);
    }
  };

  const selectedPlatform = platformOptions.find(p => p.value === platform);
  const needsLink = platform === 'zoom' || platform === 'google-meet';
  const isJitsi = platform === 'jitsi';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            Send Meeting Link
          </DialogTitle>
          <DialogDescription>
            Share consultation details with {patientName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-3">
            <Label>Platform</Label>
            <RadioGroup value={platform} onValueChange={setPlatform} className="grid grid-cols-2 gap-2">
              {platformOptions.map((option) => (
                <div key={option.value}>
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor={option.value}
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-3 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <option.icon className="h-5 w-5 mb-1" />
                    <span className="text-xs">{option.label}</span>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {isJitsi && (
            <div className="rounded-md bg-primary/10 p-3 text-sm text-primary">
              <p className="font-medium">🎥 Jitsi Meet (Free & Instant)</p>
              <p className="text-xs mt-1 text-muted-foreground">A unique meeting link will be auto-generated. No account needed.</p>
            </div>
          )}

          {needsLink && (
            <div className="space-y-2">
              <Label htmlFor="meetingLink">Meeting Link</Label>
              <Input
                id="meetingLink"
                placeholder={selectedPlatform?.placeholder}
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Paste your {selectedPlatform?.label} meeting link here
              </p>
            </div>
          )}

          {!needsLink && !isJitsi && (
            <div className="rounded-md bg-muted p-3 text-sm text-muted-foreground">
              {platform === 'whatsapp' && patientPhone ? (
                <>Patient will be contacted via WhatsApp at {patientPhone}</>
              ) : platform === 'phone' && patientPhone ? (
                <>Patient will be contacted via phone call at {patientPhone}</>
              ) : (
                <>No phone number available for this patient</>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              placeholder="Add a custom message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={sending || (needsLink && !meetingLink && !isJitsi)}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Link
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}