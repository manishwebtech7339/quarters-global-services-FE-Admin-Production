'use client';
import {
  LayoutDashboard,
  FileText,
  Users,
  Car,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Wallet,
  MessageCircle,
  Landmark,
  Stamp,
} from 'lucide-react';

import { NavItem, Sidebar } from '@/components/ui/sidebar';

const navigationItems: NavItem[] = [
  { name: 'Dashboard', href: '/agent/home', icon: LayoutDashboard },

  { name: 'Applications', href: '/agent/applications', icon: FileText },

  { name: 'Customers', href: '/agent/customers', icon: Users },

  { name: 'Vehicles', href: '/agent/vehicles', icon: Car },

  { name: 'Services', href: '/agent/services', icon: Briefcase },

  { name: 'Travel Insurance', href: '/agent/travel-insurance', icon: ShieldCheck },

  { name: 'Payments', href: '/agent/payments', icon: Wallet },

  { name: 'Credit History', href: '/agent/credit-history', icon: CreditCard },

  { name: 'Chat', href: '/agent/chat', icon: MessageCircle },

  { name: 'Tax Bureau', href: '/agent/tax-bureau', icon: Landmark },

  { name: 'Apostille', href: '/agent/apostille', icon: Stamp },
];

const AgentSidebar = () => {
  return <Sidebar navigationItems={navigationItems} />;
};

export default AgentSidebar;
