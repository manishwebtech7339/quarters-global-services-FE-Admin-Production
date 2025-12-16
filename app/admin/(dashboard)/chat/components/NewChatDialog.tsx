'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from 'use-debounce';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Plus, Search, MessageSquarePlus } from 'lucide-react';

import { UserDataType, UserTypeENUM } from '@/lib/types';
import { sendMessage } from '@/services/chatService';
import { getUsers } from '@/services/usersService';

interface NewChatDialogProps {
  currentUserId: string;
  role: UserTypeENUM;
  title?: string;
  triggerLabel?: React.ReactNode;
}

export const NewChatDialog = ({
  currentUserId,
  role,
  title = 'New Message',
  triggerLabel,
}: NewChatDialogProps) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch] = useDebounce(searchTerm, 500);

  // Data State
  const [users, setUsers] = useState<UserDataType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState(false);

  // Infinite Scroll Trigger
  // 'root' is null means it uses the browser viewport or the nearest scrollable ancestor
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px', // Load more 100px before reaching bottom
  });

  // 1. Fetch Users Function
  const loadUsers = useCallback(
    async (reset = false) => {
      if (isLoading && !reset) return;

      setIsLoading(true);
      const currentPage = reset ? 1 : page;

      try {
        const response = await getUsers({
          role,
          page: String(currentPage),
          search: debouncedSearch,
        });

        const newUsers = response.data || [];

        if (reset) {
          setUsers(newUsers);
        } else {
          setUsers((prev) => [...prev, ...newUsers]);
        }

        // Check if we reached the end
        const totalPages = response.totalPages || 0;
        setHasMore(newUsers.length > 0 && currentPage < totalPages);

        if (!reset && newUsers.length > 0) {
          setPage((prev) => prev + 1);
        } else if (reset) {
          setPage(2);
        }
      } catch (error) {
        console.error('Failed to load users', error);
      } finally {
        setIsLoading(false);
      }
    },
    [role, debouncedSearch, page, isLoading],
  );

  // 2. Effect: Search/Open Change
  useEffect(() => {
    if (open) {
      // Reset everything when opening or searching
      setPage(1);
      setHasMore(true);
      loadUsers(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, open]); // Removed 'role' from dependency to avoid double firing if role is static

  // 3. Effect: Infinite Scroll
  useEffect(() => {
    if (inView && hasMore && !isLoading && open) {
      console.log('Scrolled to bottom, loading more...'); // DEBUG
      loadUsers(false);
    }
  }, [inView, hasMore, isLoading, loadUsers, open]);

  // 4. Handle Start Chat
  const handleUserSelect = async (selectedUser: UserDataType) => {
    if (isStartingChat) return;
    setIsStartingChat(true);

    try {
      const payload = {
        userId: String(currentUserId),
        role: role,
        from: String(currentUserId),
        to: String(selectedUser._id),
        message: 'Started a new conversation',
      };

      const res = await sendMessage(payload);
      console.log('Create Chat Response:', res); // DEBUG - Check console to see structure

      // ROBUST ID CHECK:
      // Your backend returns the MESSAGE object. The message object has a 'chatId' field.
      // We check typical locations for the data.
      const chatId = res?.data?.chatId || res?.chatId || res?.data?._id;

      if (chatId) {
        setOpen(false);
        router.push(`/admin/chat/${chatId}?tab=${role}`);
        router.refresh();
      } else {
        console.error('Could not find Chat ID in response', res);
        // Optional: Show toast error here
      }
    } catch (error) {
      console.error('Failed to start chat', error);
    } finally {
      setIsStartingChat(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) {
          setSearchTerm('');
          setUsers([]);
        }
      }}
    >
      <DialogTrigger asChild>
        {triggerLabel ? (
          triggerLabel
        ) : (
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" /> {title} {role}
          </Button>
        )}
      </DialogTrigger>

      {/* FIX: h-[80vh] ensures the dialog has a fixed height.
         flex & flex-col allows the inner list to scroll while header stays fixed.
      */}
      <DialogContent className="sm:max-w-[425px] flex flex-col h-[80vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>{title}</DialogTitle>
          {/* Search Input */}
          <div className="relative mt-2">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={`Search ${role.toLowerCase()}...`}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </DialogHeader>

        {/* FIX: Replaced ScrollArea with native div.
            flex-1: takes remaining height.
            overflow-y-auto: enables native scrolling.
        */}
        <div className="flex-1 overflow-y-auto p-6 pt-2">
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors border border-transparent hover:border-border"
              >
                <Avatar>
                  <AvatarImage src={user.profilePicture || ''} />
                  <AvatarFallback>{user.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <h4 className="font-medium truncate">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                </div>
                {isStartingChat ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MessageSquarePlus className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            ))}

            {/* Loading State & Observer Target */}
            <div ref={ref} className="py-4 flex justify-center w-full min-h-[40px]">
              {isLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}

              {!isLoading && !hasMore && users.length > 0 && (
                <span className="text-xs text-muted-foreground">End of list</span>
              )}

              {!isLoading && users.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No {role.toLowerCase()}s found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
