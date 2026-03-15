import React, { ReactNode } from 'react';
import { getChatsList } from '@/services/chatService';
import { ChatSidebar } from './components/ChatSidebar';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NewChatDialog } from './components/NewChatDialog';
import { UserTypeENUM } from '@/lib/types';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import Link from 'next/link';
import { getUserById } from '@/services/usersService';

// Next.js Server Component
const ChatLayout = async ({
  children,
  searchParams,
}: {
  children: ReactNode;
  searchParams: Promise<{ tab?: UserTypeENUM }>;
}) => {
  const session = await getSession();
  if (!session) {
    return redirect('/login');
  }

  const userData = await getUserById(session.id);
  if (!userData) {
    return redirect('/login');
  }

  const activeTab = (await searchParams).tab || UserTypeENUM.ADMIN;

  // Fetch data on the server
  const { data: chats } = await getChatsList(
    activeTab === UserTypeENUM.USER ? UserTypeENUM.USER : UserTypeENUM.AGENT,
  );

  return (
    <div className="h-[calc(100vh-2rem)] grid grid-cols-1 lg:grid-cols-[360px_1fr] grid-rows-[auto_1fr] gap-4">
      <div className="col-span-2 h-fit flex items-center justify-end gap-2">
        {/* <Tabs value={activeTab}>
          <TabsList>
            <Link href={`/agent/chat?tab=${UserTypeENUM.ADMIN}`}>
              <TabsTrigger value={UserTypeENUM.ADMIN}>Admin</TabsTrigger>
            </Link>
            <Link href={`/agent/chat?tab=${UserTypeENUM.USER}`}>
              <TabsTrigger value={UserTypeENUM.USER}>Customer</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs> */}
        {activeTab === UserTypeENUM.ADMIN && chats.length > 0 ? null : (
          <NewChatDialog
            currentUserId={session.id}
            role={activeTab}
            currentUserRole={userData.role}
            title="Chat with"
          />
        )}
      </div>
      <div className="hidden lg:flex flex-col bg-background border rounded-lg overflow-hidden h-full">
        <ChatSidebar chats={chats} currentUserId={session.id} />
      </div>
      <div className="flex flex-col bg-background border rounded-lg overflow-hidden h-full min-w-0">
        {children}
      </div>
    </div>
  );
};

export default ChatLayout;
