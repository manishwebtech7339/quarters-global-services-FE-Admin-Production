'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns'; // Recommended for simple date formatting
import { IChatListItem } from '@/services/chatService';
import { UserTypeENUM } from '@/lib/types';

interface ChatSidebarProps {
  chats: IChatListItem[];
  currentUserId: string;
}

export const ChatSidebar = ({ chats }: ChatSidebarProps) => {
  const tab = useSearchParams().get('tab') || UserTypeENUM.AGENT;
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 ? (
          <p className="text-center p-4 text-muted-foreground">No chats found.</p>
        ) : (
          chats.map((chat) => {
            const isActive = pathname === `/admin/chat/${chat._id}`;
            const partnerName = `${chat?.user?.firstName ?? 'N/A'} ${chat?.user?.lastName}`;

            return (
              <Link
                key={chat._id}
                href={`/admin/chat/${chat._id}?tab=` + tab}
                className={cn(
                  'flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors border-b',
                  isActive && 'bg-muted',
                )}
              >
                <Avatar>
                  <AvatarImage src={chat.user?.avatar} alt={partnerName} />
                  <AvatarFallback>{chat.user?.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-medium truncate">{partnerName}</span>
                    {chat.lastMessageCreatedAt && (
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(chat.lastMessageCreatedAt), 'HH:mm')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {chat.lastMessage || (chat.hasMedia ? 'Sent an attachment' : 'No messages yet')}
                  </p>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
};
