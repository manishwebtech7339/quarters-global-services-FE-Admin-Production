'use client';
import { Bell, Menu, Search, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { NavItem, SideBarContent } from '../ui/sidebar';
import { Button } from '../ui/button';
import { usePathname } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import useHasAccess from '@/hooks/useAccessControl/useHasAccess';
import Link from 'next/link';

const AppBar = ({
  navigationItems = [],
  sidebarLoading = false,
}: {
  navigationItems: NavItem[];
  sidebarLoading?: boolean;
}) => {
  const { isLoading, userData } = useHasAccess();

  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [title, setTitle] = useState('Quartus');

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  // Get page title
  useEffect(() => {
    function run() {
      if (pathname) {
        // Admin pages
        if (pathname.startsWith('/admin')) {
          setTitle(pathname.split('/')[2].replaceAll('-', ' '));
        }
      }
    }
    run();
  }, [pathname]);

  return (
    <div className="relative">
      <div className="flex justify-between items-center h-[80px] md:p-4 p-0  border-b">
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger>
              <Menu className="block md:hidden" />
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader className="hidden"></SheetHeader>
              <SideBarContent navigationItems={navigationItems} isLoading={sidebarLoading} />
            </SheetContent>
          </Sheet>

          <p className="text-sm font-bold text-black capitalize">{title}</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-12 h-12 border-2 rounded-md flex justify-center items-center border-secondary-foreground">
            <Bell className="text-black w-5 h-5" />
          </div>

          {/* Desktop Search - Always visible on larger screens */}
          {/* <div className="hidden sm:flex bg-primary-foreground h-12 rounded-sm px-2 items-center">
            <Search />
            <Input
              placeholder="Search for something"
              className="bg-transparent border-none focus-visible:border-0 focus-visible:ring-0 font-normal text-[15px]"
            />
          </div> */}

          {/* Mobile Search Toggle - Only visible on small screens */}
          <Button
            onClick={toggleSearch}
            className="sm:hidden w-12 h-12 bg-white border-2 rounded-md flex justify-center items-center border-secondary-foreground hover:bg-secondary/10 transition-colors"
          >
            <Search className="text-black w-5 h-5" />
          </Button>

          {/* Profile card */}
          {isLoading || !userData ? (
            ''
          ) : (
            <Link
              href="/admin/profile"
              className="flex items-center gap-3 bg-muted py-2 px-4 rounded-lg"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={userData.profilePicture || 'https://via.placeholder.com/80'}
                  alt={userData.firstName}
                />
                <AvatarFallback className="uppercase">
                  {userData?.firstName?.charAt(0)}
                  {userData?.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <p className="text-base hidden sm:block">
                {userData.firstName} {userData.lastName}
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Search Overlay - Animated */}
      <div
        className={`absolute top-0 left-0 right-0 bg-background border-b z-50 transition-all duration-300 ease-in-out sm:hidden ${
          isSearchOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-full pointer-events-none'
        }`}
      >
        <div className="flex items-center h-[80px] p-4 gap-2">
          <div className="flex-1 bg-primary-foreground h-12 rounded-sm px-2 flex items-center">
            <Search />
            <Input
              placeholder="Search for something"
              className="bg-transparent border-none focus-visible:border-0 focus-visible:ring-0 font-normal text-[15px]"
              autoFocus={isSearchOpen}
            />
          </div>
          <Button
            onClick={toggleSearch}
            className="w-12 h-12 border-2 bg-white rounded-md flex justify-center items-center border-secondary-foreground hover:bg-secondary/10 transition-colors"
          >
            <X className="text-black w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Backdrop for mobile search */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 sm:hidden" onClick={toggleSearch} />
      )}
    </div>
  );
};

export default AppBar;
