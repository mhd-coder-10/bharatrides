import { Link, useLocation } from 'react-router-dom';
import { 
  Home, Car, Bike, Calendar, Users, Settings, 
  CircleDollarSign, BarChart3, FileText, LogOut, 
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
}

const adminNavItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', href: '/admin' },
  { icon: Car, label: 'Vehicles', href: '/admin/vehicles' },
  { icon: Calendar, label: 'Bookings', href: '/admin/bookings' },
  { icon: Users, label: 'Customers', href: '/admin/customers' },
  { icon: CircleDollarSign, label: 'Payments', href: '/admin/payments' },
  { icon: BarChart3, label: 'Reports', href: '/admin/reports' },
  { icon: FileText, label: 'Documents', href: '/admin/documents' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

const publicNavItems: NavItem[] = [
  { icon: Home, label: 'Home', href: '/' },
  { icon: Car, label: 'Cars', href: '/vehicles?type=car' },
  { icon: Bike, label: 'Bikes', href: '/vehicles?type=bike' },
  { icon: Zap, label: 'Activa', href: '/vehicles?type=activa' },
];

interface AppSidebarProps {
  variant?: 'admin' | 'public';
  isOpen?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({ 
  variant = 'admin', 
  isOpen = true, 
  onClose,
  collapsed = false,
  onToggleCollapse
}: AppSidebarProps) {
  const location = useLocation();
  const navItems = variant === 'admin' ? adminNavItems : publicNavItems;

  const isActive = (href: string) => {
    if (href === '/admin' && location.pathname === '/admin') return true;
    if (href === '/' && location.pathname === '/') return true;
    if (href.includes('?')) {
      const [path, query] = href.split('?');
      return location.pathname.startsWith(path) && location.search.includes(query.split('=')[1]);
    }
    return location.pathname.startsWith(href) && href !== '/' && href !== '/admin';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full bg-sidebar text-sidebar-foreground transition-all duration-300 lg:translate-x-0 border-r border-sidebar-border",
        isOpen ? "translate-x-0" : "-translate-x-full",
        collapsed ? "w-16" : "w-64"
      )}>
        {/* Logo */}
        <div className={cn(
          "flex h-16 items-center gap-2 px-4 border-b border-sidebar-border",
          collapsed && "justify-center px-2"
        )}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary flex-shrink-0">
            <Car className="h-6 w-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold">
              Bharat<span className="text-sidebar-primary">Rides</span>
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className={cn("p-4 space-y-1", collapsed && "p-2")}>
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                collapsed && "justify-center px-2",
                isActive(item.href)
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Collapse Toggle (Desktop only) */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex absolute -right-3 top-20 h-6 w-6 items-center justify-center rounded-full bg-background border border-border shadow-sm hover:bg-muted transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}

        {/* Bottom Actions */}
        <div className={cn(
          "absolute bottom-4 left-4 right-4",
          collapsed && "left-2 right-2"
        )}>
          <Link to="/">
            <Button 
              variant="ghost" 
              className={cn(
                "w-full text-sidebar-foreground/70 hover:text-sidebar-foreground",
                collapsed ? "justify-center px-2" : "justify-start"
              )}
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="ml-3">Logout</span>}
            </Button>
          </Link>
        </div>
      </aside>
    </>
  );
}
