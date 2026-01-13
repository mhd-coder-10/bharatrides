import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { MessageSquare, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

// Sample messages data - replace with real data from database
const sampleMessages = [
  {
    id: '1',
    subject: 'Booking Confirmation - Honda City',
    preview: 'Your booking has been confirmed for January 15-18, 2026...',
    sender: 'BharatRides Support',
    timestamp: '2026-01-12T10:30:00',
    isRead: false,
  },
  {
    id: '2',
    subject: 'Payment Receipt',
    preview: 'Thank you for your payment of ₹4,500. Your receipt is attached...',
    sender: 'BharatRides Billing',
    timestamp: '2026-01-12T09:15:00',
    isRead: true,
  },
  {
    id: '3',
    subject: 'Welcome to BharatRides!',
    preview: 'Thank you for joining BharatRides. Start exploring our wide range of vehicles...',
    sender: 'BharatRides Team',
    timestamp: '2026-01-10T14:00:00',
    isRead: true,
  },
];

export default function MyMessages() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Messages</h1>
          <p className="text-muted-foreground mt-2">View your notifications and communications</p>
        </div>

        {sampleMessages.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Messages Yet</h3>
              <p className="text-muted-foreground text-center">
                You don't have any messages at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Inbox</span>
                <Badge variant="secondary">
                  {sampleMessages.filter(m => !m.isRead).length} unread
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <div className="divide-y divide-border">
                  {sampleMessages.map((message) => (
                    <button
                      key={message.id}
                      className={`w-full text-left p-4 hover:bg-muted/50 transition-colors ${
                        !message.isRead ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <span className={`font-medium truncate ${!message.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                                {message.sender}
                              </span>
                              {!message.isRead && (
                                <span className="h-2 w-2 rounded-full bg-primary shrink-0"></span>
                              )}
                            </div>
                            <p className={`text-sm truncate ${!message.isRead ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                              {message.subject}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {message.preview}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Clock className="h-3 w-3" />
                          {formatTimestamp(message.timestamp)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
