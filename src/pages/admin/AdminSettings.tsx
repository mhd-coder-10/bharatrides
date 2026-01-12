import { Settings } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>
      <p className="text-muted-foreground">Configure application settings.</p>
      <div className="bg-card rounded-lg border p-8 text-center text-muted-foreground">
        Settings features coming soon...
      </div>
    </div>
  );
}
