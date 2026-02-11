import { useState } from 'react';
import { FileText, Upload, File, Trash2, Download, Search, Eye, Pencil, Plus, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

import swiftDzire from '@/assets/vehicles/swift-dzire.jpg';
import hondaCity from '@/assets/vehicles/honda-city.jpg';
import royalEnfield from '@/assets/vehicles/royal-enfield-classic-350.jpg';
import hyundaiCreta from '@/assets/vehicles/hyundai-creta.jpg';
import hondaActiva from '@/assets/vehicles/honda-activa-6g.jpg';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadDate: string;
  size: string;
  vehicleImage?: string;
  vehicleName?: string;
}

// Sample documents data with matched vehicle images
const initialDocuments: Document[] = [
  { id: '1', name: 'Vehicle Insurance - Swift Dzire', type: 'Insurance', uploadDate: '2024-01-10', size: '2.4 MB', vehicleImage: swiftDzire, vehicleName: 'Swift Dzire' },
  { id: '2', name: 'RC Book - Honda City', type: 'Registration', uploadDate: '2024-01-08', size: '1.8 MB', vehicleImage: hondaCity, vehicleName: 'Honda City' },
  { id: '3', name: 'Permit - Royal Enfield Classic', type: 'Permit', uploadDate: '2024-01-05', size: '1.2 MB', vehicleImage: royalEnfield, vehicleName: 'Royal Enfield Classic 350' },
  { id: '4', name: 'Insurance Policy - Honda Activa', type: 'Insurance', uploadDate: '2024-01-02', size: '5.6 MB', vehicleImage: hondaActiva, vehicleName: 'Honda Activa 6G' },
  { id: '5', name: 'PUC Certificate - Hyundai Creta', type: 'PUC', uploadDate: '2023-12-28', size: '0.8 MB', vehicleImage: hyundaiCreta, vehicleName: 'Hyundai Creta' },
];

export default function AdminDocuments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    type: '',
    imagePreview: '' as string,
  });
  const [addFormData, setAddFormData] = useState({
    name: '',
    type: 'Insurance',
    size: '',
    imagePreview: '' as string,
  });

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

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsViewDialogOpen(true);
  };

  const handleEditDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setEditFormData({
      name: doc.name,
      type: doc.type,
      imagePreview: doc.vehicleImage || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleDeleteDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setIsDeleteDialogOpen(true);
  };

  const saveDocumentEdit = () => {
    if (!selectedDocument) return;
    
    setDocuments(prev => 
      prev.map(d => d.id === selectedDocument.id ? { 
        ...d, 
        name: editFormData.name,
        type: editFormData.type,
        vehicleImage: editFormData.imagePreview || d.vehicleImage,
      } : d)
    );

    toast.success('Document updated successfully');
    setIsEditDialogOpen(false);
    setSelectedDocument(null);
  };

  const confirmDeleteDocument = () => {
    if (!selectedDocument) return;
    
    setDocuments(prev => prev.filter(d => d.id !== selectedDocument.id));
    toast.success('Document deleted successfully');
    setIsDeleteDialogOpen(false);
    setSelectedDocument(null);
  };

  const handleAddDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      name: addFormData.name,
      type: addFormData.type,
      uploadDate: new Date().toISOString().split('T')[0],
      size: addFormData.size || '1.0 MB',
      vehicleImage: addFormData.imagePreview || undefined,
    };

    setDocuments(prev => [newDoc, ...prev]);
    toast.success('Document added successfully');
    setIsAddDialogOpen(false);
    setAddFormData({ name: '', type: 'Insurance', size: '', imagePreview: '' });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'add' | 'edit') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      if (target === 'add') {
        setAddFormData(prev => ({ ...prev, imagePreview: result }));
      } else {
        setEditFormData(prev => ({ ...prev, imagePreview: result }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = (doc: Document) => {
    // Create a downloadable file from the document image or a text summary
    const link = document.createElement('a');
    if (doc.vehicleImage) {
      link.href = doc.vehicleImage;
      link.download = `${doc.name.replace(/\s+/g, '_')}.jpg`;
    } else {
      // Generate a text file with document details as fallback
      const content = `Document: ${doc.name}\nType: ${doc.type}\nUpload Date: ${doc.uploadDate}\nSize: ${doc.size}`;
      const blob = new Blob([content], { type: 'text/plain' });
      link.href = URL.createObjectURL(blob);
      link.download = `${doc.name.replace(/\s+/g, '_')}.txt`;
    }
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloading ${doc.name}...`);
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
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Document
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
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleViewDocument(doc)}
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEditDocument(doc)}
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDownload(doc)}
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteDocument(doc)}
                        title="Delete"
                      >
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

      {/* View Document Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Document Details</DialogTitle>
            <DialogDescription>
              View document information
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              {/* Document Image */}
              {selectedDocument.vehicleImage ? (
                <div className="rounded-lg overflow-hidden border border-border">
                  <img
                    src={selectedDocument.vehicleImage}
                    alt={selectedDocument.vehicleName || selectedDocument.name}
                    className="w-full h-56 object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-lg bg-muted flex items-center justify-center h-40 border border-border">
                  <div className="text-center text-muted-foreground">
                    <ImageIcon className="h-10 w-10 mx-auto mb-2" />
                    <p className="text-sm">No image available</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-semibold text-lg">{selectedDocument.name}</h3>
                  <div className="mt-1">{getTypeBadge(selectedDocument.type)}</div>
                </div>
              </div>

              {selectedDocument.vehicleName && (
                <div className="flex justify-between rounded-lg bg-muted p-3">
                  <span className="text-muted-foreground">Vehicle</span>
                  <span className="font-medium">{selectedDocument.vehicleName}</span>
                </div>
              )}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Upload Date</span>
                  <span className="font-medium">{selectedDocument.uploadDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">File Size</span>
                  <span className="font-medium">{selectedDocument.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Document Type</span>
                  <span className="font-medium">{selectedDocument.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Document ID</span>
                  <span className="font-medium">#{selectedDocument.id}</span>
                </div>
              </div>

              <Button className="w-full" onClick={() => handleDownload(selectedDocument)}>
                <Download className="h-4 w-4 mr-2" />
                Download Document
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Document Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Document</DialogTitle>
            <DialogDescription>
              Update document details
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="doc_name">Document Name</Label>
                <Input
                  id="doc_name"
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="doc_type">Type</Label>
                <Select 
                  value={editFormData.type} 
                  onValueChange={(value) => setEditFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Registration">Registration</SelectItem>
                    <SelectItem value="Permit">Permit</SelectItem>
                    <SelectItem value="PUC">PUC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Document Image</Label>
                {editFormData.imagePreview && (
                  <img src={editFormData.imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2 border border-border" />
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'edit')}
                  className="cursor-pointer"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={saveDocumentEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Document Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Document</DialogTitle>
            <DialogDescription>
              Add a new document to the system
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="add_doc_name">Document Name</Label>
              <Input
                id="add_doc_name"
                value={addFormData.name}
                onChange={(e) => setAddFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Vehicle Insurance - Swift Dzire"
              />
            </div>
            <div>
              <Label htmlFor="add_doc_type">Type</Label>
              <Select 
                value={addFormData.type} 
                onValueChange={(value) => setAddFormData(prev => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                  <SelectItem value="Registration">Registration</SelectItem>
                  <SelectItem value="Permit">Permit</SelectItem>
                  <SelectItem value="PUC">PUC</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="add_doc_size">File Size</Label>
              <Input
                id="add_doc_size"
                value={addFormData.size}
                onChange={(e) => setAddFormData(prev => ({ ...prev, size: e.target.value }))}
                placeholder="e.g., 2.4 MB"
              />
            </div>
            <div>
              <Label>Document Image</Label>
              {addFormData.imagePreview && (
                <img src={addFormData.imagePreview} alt="Preview" className="w-full h-32 object-cover rounded-lg mb-2 border border-border" />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'add')}
                className="cursor-pointer"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddDocument} disabled={!addFormData.name}>Add Document</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Document</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedDocument?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setSelectedDocument(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDocument} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
