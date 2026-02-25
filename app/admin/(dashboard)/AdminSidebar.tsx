'use client';

import {
  LayoutDashboard,
  FileText,
  Building2,
  Car,
  Wallet,
  Users,
  Headphones,
  Briefcase,
  Ticket,
  MessageCircle,
  Landmark,
  Stamp,
  GraduationCap,
  ShieldUser,
} from 'lucide-react';

import { NavItem, Sidebar } from '@/components/ui/sidebar';
import useHasAccess from '@/hooks/useAccessControl/useHasAccess';
import { PERMISSIONS_LIST_ENUM } from '@/hooks/useAccessControl/permissions';

const AdminSidebar = () => {
  const { hasAccess, isLoading } = useHasAccess();

  const navigationItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/admin/home',
      icon: LayoutDashboard,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.dashboard }),
    },
    {
      name: 'Users And Roles',
      href: '/admin/users-and-roles',
      icon: ShieldUser, // Better than Users (role control feeling)
      isVisible:
        hasAccess({ permission: PERMISSIONS_LIST_ENUM.users }) ||
        hasAccess({ permission: PERMISSIONS_LIST_ENUM.roles }),
    },
    {
      name: 'Applications',
      href: '/admin/applications',
      icon: FileText,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.applications }),
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: Users,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.customers }),
    },
    {
      name: 'Agencies',
      href: '/admin/agencies',
      icon: Building2,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.agencies }),
    },
    {
      name: 'Vehicles',
      href: '/admin/vehicles',
      icon: Car,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.vehicles }),
    },
    {
      name: 'Services',
      href: '/admin/services',
      icon: Briefcase,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.services }),
    },
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: Wallet,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.payments }),
    },
    {
      name: 'Training',
      href: '/admin/training',
      icon: GraduationCap, // More meaningful
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.training }),
    },
    {
      name: 'Tickets',
      href: '/admin/tickets',
      icon: Ticket,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.tickets }),
    },
    {
      name: 'Support',
      href: '/admin/support',
      icon: Headphones,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.support }),
    },
    {
      name: 'Chat',
      href: '/admin/chat',
      icon: MessageCircle,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.chat }),
    },
    {
      name: 'Tax Bureau',
      href: '/admin/tax-bureau',
      icon: Landmark, // Government related
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.tax_bureau }),
    },
    {
      name: 'Apostille',
      href: '/admin/apostille',
      icon: Stamp, // Perfect semantic match
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.apostille }),
    },
  ];

  const visibleItems = navigationItems.filter((item) => item.isVisible);

  return <Sidebar navigationItems={visibleItems} isLoading={isLoading} />;
};

export default AdminSidebar;
