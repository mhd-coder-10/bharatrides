import { useState } from 'react';
import { FileText, Upload, File, Trash2, Download, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Sample documents data
const sampleDocuments = [
  { id: '1', name: 'Vehicle Insurance - Swift Dzire', type: 'Insurance', uploadDate: '2024-01-10', size: '2.4 MB' },
  { id: '2', name: 'RC Book - Honda City', type: 'Registration', uploadDate: '2024-01-08', size: '1.8 MB' },
  { id: '3', name: 'Permit - Royal Enfield Classic', type: 'Permit', uploadDate: '2024-01-05', size: '1.2 MB' },
  { id: '4', name: 'Insurance Policy - Fleet', type: 'Insurance', uploadDate: '2024-01-02', size: '5.6 MB' },
  { id: '5', name: 'PUC Certificate - Hyundai Creta', type: 'PUC', uploadDate: '2023-12-28', size: '0.8 MB' },
];

export default function AdminDocuments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents] = useState(sampleDocuments);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      Insurance: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      Registration: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      Permit: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      PUC: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    };
    return <Badge className={colors[type] || 'bg-gray-100 text-gray-800'}>{type}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Documents Management</h1>
            <p className="text-muted-foreground">Manage vehicle and business documents</p>
          </div>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{documents.length}</div>
            <p className="text-sm text-muted-foreground">Total Documents</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-blue-600">
              {documents.filter(d => d.type === 'Insurance').length}
            </div>
            <p className="text-sm text-muted-foreground">Insurance</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-600">
              {documents.filter(d => d.type === 'Registration').length}
            </div>
            <p className="text-sm text-muted-foreground">Registrations</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-purple-600">
              {documents.filter(d => d.type === 'Permit').length}
            </div>
            <p className="text-sm text-muted-foreground">Permits</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Documents Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Upload Date</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded bg-muted">
                        <File className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="font-medium">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getTypeBadge(doc.type)}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.uploadDate}</TableCell>
                  <TableCell className="text-muted-foreground">{doc.size}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {filteredDocuments.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">No documents found</h2>
            <p className="text-muted-foreground">Try adjusting your search or upload a new document</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}