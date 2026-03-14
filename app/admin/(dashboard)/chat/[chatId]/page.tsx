import { getChatDetails, getChatMessages } from '@/services/chatService';
import React from 'react';
import ChatArea from '../components/ChatArea';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import ChatLayout from '../ChatLayout';
import { getUserById } from '@/services/usersService';

interface PageProps {
  params: Promise<{
    chatId?: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ChatPage = async ({ params, searchParams }: PageProps) => {
  const chatId = (await params)?.chatId || '';
  const role = ((await searchParams)?.tab || '') as string;

  const session = await getSession();

  if (!session) {
    return redirect('/login');
  }
  const userData = await getUserById(session.id);
  if (!userData) {
    return redirect('/login');
  }

  const currentUserId = session.id;

  // 2. Fetch Data in Parallel
  const chatDataPromise = await getChatDetails(chatId);
  const messagesPromise = await getChatMessages(chatId);

  const [chatDetails, messagesData] = await Promise.all([chatDataPromise, messagesPromise]);

  if (!chatDetails) {
    return <div className="p-8 text-center">Chat not found</div>;
  }

  return (
    <ChatLayout searchParams={searchParams}>
      <ChatArea
        initialMessages={messagesData.data}
        chatDetails={chatDetails}
        currentUserId={currentUserId}
        role={role}
        currentUserRole={userData.role}
      />
    </ChatLayout>
  );
};

export default ChatPage;
