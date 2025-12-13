'use client';
import {
  LayoutDashboard,
  FileCheck2,
  Building2,
  FileText,
  Car,
  CreditCard,
  Users,
  Headphones,
  Table2,
  Ticket,
  MessageCircle,
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
      icon: Users,
      isVisible:
        hasAccess({ permission: PERMISSIONS_LIST_ENUM.users }) ||
        hasAccess({ permission: PERMISSIONS_LIST_ENUM.roles }),
    },
    {
      name: 'Applications',
      href: '/admin/applications',
      icon: FileCheck2,
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
    // {
    //   name: 'Couriers',
    //   href: '/admin/couriers',
    //   icon: Truck,
    //   isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.couriers }),
    // },
    {
      name: 'Documents',
      href: '/admin/documents',
      icon: FileText,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.documents }),
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
      icon: Table2,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.services }),
    },
    // {
    //   name: 'Receipts',
    //   href: '/admin/receipts',
    //   icon: ReceiptIcon,
    //   isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.receipts }),
    // }, // no enum? keep always visible
    {
      name: 'Payments',
      href: '/admin/payments',
      icon: CreditCard,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.payments }),
    },
    {
      name: 'Training',
      href: '/admin/training',
      icon: CreditCard,
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
      icon: CreditCard,
      isVisible: hasAccess({ permission: PERMISSIONS_LIST_ENUM.chat }),
    },
  ];
  const visibleItems = navigationItems.filter((item) => item.isVisible);

  console.log(visibleItems, 'visibleItems');

  return <Sidebar navigationItems={visibleItems} isLoading={isLoading} />;
};

export default AdminSidebar;
