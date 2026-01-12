import { FileText } from 'lucide-react';

export default function AdminDocuments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Documents Management</h1>
      </div>
      <p className="text-muted-foreground">Manage documents and files.</p>
      <div className="bg-card rounded-lg border p-8 text-center text-muted-foreground">
        Document management features coming soon...
      </div>
    </div>
  );
}
