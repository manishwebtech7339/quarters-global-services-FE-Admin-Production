'use client';
import {
  LayoutDashboard,
  FileCheck2,
  Car,
  CreditCard,
  Users,
  Table2,
  MessageCircle,
} from 'lucide-react';
import { NavItem, Sidebar } from '@/components/ui/sidebar';
const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/agent/home', icon: LayoutDashboard },

  { name: 'Applications', href: '/agent/applications', icon: FileCheck2 },
  { name: 'Customers', href: '/agent/customers', icon: Users },

  { name: 'Vehicles', href: '/agent/vehicles', icon: Car },
  { name: 'Services', href: '/agent/services', icon: Table2 },
  { name: 'Travel Insurance', href: '/agent/travel-insurance', icon: Table2 },

  { name: 'Payments', href: '/agent/payments', icon: CreditCard },
  { name: 'Credit History', href: '/agent/credit-history', icon: CreditCard },
  { name: 'Chat', href: '/agent/chat', icon: MessageCircle },
];

const AgentSidebar = () => {
  return <Sidebar navigationItems={navigationItems} />;
};

export default AgentSidebar;
