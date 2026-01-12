import { CircleDollarSign } from 'lucide-react';

export default function AdminPayments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CircleDollarSign className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Payments Management</h1>
      </div>
      <p className="text-muted-foreground">Track and manage payments.</p>
      <div className="bg-card rounded-lg border p-8 text-center text-muted-foreground">
        Payment management features coming soon...
      </div>
    </div>
  );
}
