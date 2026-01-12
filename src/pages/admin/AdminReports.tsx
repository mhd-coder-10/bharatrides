import { BarChart3 } from 'lucide-react';

export default function AdminReports() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
      </div>
      <p className="text-muted-foreground">View business reports and analytics.</p>
      <div className="bg-card rounded-lg border p-8 text-center text-muted-foreground">
        Reporting features coming soon...
      </div>
    </div>
  );
}
