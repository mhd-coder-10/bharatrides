import { Settings, Bell, Shield, Globe, Palette, Mail } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    });
  };

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
              <Input id="siteName" defaultValue="Bharat Rides" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" defaultValue="contact@bharatrides.com" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input id="contactPhone" defaultValue="+91 98765 43210" />
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
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Booking Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified for pending bookings</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Customer Sign-ups</Label>
                <p className="text-sm text-muted-foreground">Notify when new customers register</p>
              </div>
              <Switch />
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
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Require Phone Verification</Label>
                <p className="text-sm text-muted-foreground">Verify customer phone before booking</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="grid gap-2">
              <Label htmlFor="driverFee">Driver Fee (per day)</Label>
              <Input id="driverFee" type="number" defaultValue="500" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="serviceFee">Service Fee (%)</Label>
              <Input id="serviceFee" type="number" defaultValue="5" />
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
        <Button onClick={handleSave}>Save Settings</Button>
      </div>
    </div>
  );
}