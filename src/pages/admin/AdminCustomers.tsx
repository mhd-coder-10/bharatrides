import { Users } from 'lucide-react';

export default function AdminCustomers() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Customers Management</h1>
      </div>
      <p className="text-muted-foreground">View and manage customer accounts.</p>
      <div className="bg-card rounded-lg border p-8 text-center text-muted-foreground">
        Customer management features coming soon...
      </div>
    </div>
  );
}
