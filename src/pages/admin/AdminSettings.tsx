import { useState, useEffect } from 'react';
import { Settings, Bell, Shield, Globe, Mail, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface GeneralSettings {
  siteName: string;
  contactEmail: string;
  contactPhone: string;
}

interface NotificationSettings {
  emailNotifications: boolean;
  bookingAlerts: boolean;
  customerSignups: boolean;
}

interface BookingSettings {
  autoConfirm: boolean;
  requirePhoneVerification: boolean;
  driverFee: number;
  serviceFee: number;
}

export default function AdminSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [generalSettings, setGeneralSettings] = useState<GeneralSettings>({
    siteName: 'Bharat Rides',
    contactEmail: 'contact@bharatrides.com',
    contactPhone: '+91 98765 43210',
  });
  
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    bookingAlerts: true,
    customerSignups: false,
  });
  
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>({
    autoConfirm: false,
    requirePhoneVerification: false,
    driverFee: 500,
    serviceFee: 5,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*');

      if (error) throw error;

      if (data) {
        data.forEach((setting) => {
          if (setting.key === 'general') {
            setGeneralSettings(setting.value as unknown as GeneralSettings);
          } else if (setting.key === 'notifications') {
            setNotificationSettings(setting.value as unknown as NotificationSettings);
          } else if (setting.key === 'booking') {
            setBookingSettings(setting.value as unknown as BookingSettings);
          }
        });
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to load settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Update general settings
      const { error: generalError } = await supabase
        .from('settings')
        .update({ 
          value: JSON.parse(JSON.stringify(generalSettings)), 
          updated_at: new Date().toISOString() 
        })
        .eq('key', 'general');
      if (generalError) throw generalError;

      // Update notification settings
      const { error: notifError } = await supabase
        .from('settings')
        .update({ 
          value: JSON.parse(JSON.stringify(notificationSettings)), 
          updated_at: new Date().toISOString() 
        })
        .eq('key', 'notifications');
      if (notifError) throw notifError;

      // Update booking settings
      const { error: bookingError } = await supabase
        .from('settings')
        .update({ 
          value: JSON.parse(JSON.stringify(bookingSettings)), 
          updated_at: new Date().toISOString() 
        })
        .eq('key', 'booking');
      if (bookingError) throw bookingError;

      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      });
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Configure application settings</p>
        </div>
      </div>

      <div className="grid gap-6">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-muted-foreground" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Manage your general application settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input 
                id="siteName" 
                value={generalSettings.siteName}
                onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input 
                id="contactEmail" 
                type="email" 
                value={generalSettings.contactEmail}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input 
                id="contactPhone" 
                value={generalSettings.contactPhone}
                onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Notification Settings</CardTitle>
            </div>
            <CardDescription>Configure how you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email for new bookings</p>
              </div>
              <Switch 
                checked={notificationSettings.emailNotifications}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, emailNotifications: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified for pending bookings</p>
              </div>
              <Switch 
                checked={notificationSettings.bookingAlerts}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, bookingAlerts: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Customer Sign-ups</Label>
                <p className="text-sm text-muted-foreground">Notify when new customers register</p>
              </div>
              <Switch 
                checked={notificationSettings.customerSignups}
                onCheckedChange={(checked) => setNotificationSettings({ ...notificationSettings, customerSignups: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Booking Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Booking Settings</CardTitle>
            </div>
            <CardDescription>Configure booking-related settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-confirm Bookings</Label>
                <p className="text-sm text-muted-foreground">Automatically confirm new bookings</p>
              </div>
              <Switch 
                checked={bookingSettings.autoConfirm}
                onCheckedChange={(checked) => setBookingSettings({ ...bookingSettings, autoConfirm: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Phone Verification</Label>
                <p className="text-sm text-muted-foreground">Verify customer phone before booking</p>
              </div>
              <Switch 
                checked={bookingSettings.requirePhoneVerification}
                onCheckedChange={(checked) => setBookingSettings({ ...bookingSettings, requirePhoneVerification: checked })}
              />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="driverFee">Driver Fee (per day)</Label>
              <Input 
                id="driverFee" 
                type="number" 
                value={bookingSettings.driverFee}
                onChange={(e) => setBookingSettings({ ...bookingSettings, driverFee: Number(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="serviceFee">Service Fee (%)</Label>
              <Input 
                id="serviceFee" 
                type="number" 
                value={bookingSettings.serviceFee}
                onChange={(e) => setBookingSettings({ ...bookingSettings, serviceFee: Number(e.target.value) })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Templates */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Email Templates</CardTitle>
            </div>
            <CardDescription>Customize email notifications sent to customers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Confirmation Email</Label>
                <p className="text-sm text-muted-foreground">Sent when booking is confirmed</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Reminder Email</Label>
                <p className="text-sm text-muted-foreground">Sent 24 hours before pickup</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Completion Email</Label>
                <p className="text-sm text-muted-foreground">Sent after rental period ends</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </Button>
      </div>
    </div>
  );
}
