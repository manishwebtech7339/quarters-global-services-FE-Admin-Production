'use server';

import { fetcher } from '@/lib/fetcher';
import { UserTypeENUM } from '@/lib/types';

export interface IChatUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string;
  role: string;
}

export interface IChatListItem {
  _id: string; // The Chat ID
  lastMessage: string | null;
  lastMessageCreatedAt: string | null;
  hasMedia: boolean;
  type: string;
  user: IChatUser; // The partner details calculated by backend
  unreadCount?: number; // Optional if backend supports it later
}

export interface IMessageAttachment {
  _id: string;
  file: string;
  fileName: string;
  mimeType: string;
}

export interface IChatMessage {
  _id: string;
  chatId: string;
  sender: IChatUser;
  senderType: string;
  message: string | null;
  attachments: IMessageAttachment[];
  messageType: 'text' | 'text_with_attachments' | 'attachments_only';
  createdAt: string;
}

export interface ISendMessagePayload {
  userId: string; // My ID
  role: string; // Tab Role
  currentUserRole: string; // Current User's Role
  from: string; // My ID
  to: string; // Other person's ID
  message: string;
  chatId?: string;
  attachments?: { _id: string; file: string }[];
}

// --- 1. Get List of Chats ---
export const getChatsList = async (
  type: UserTypeENUM,
  search: string = '',
): Promise<{ data: IChatListItem[] }> => {
  try {
    // Matches Backend: /chat/list?type=user&search=...
    const response = await fetcher(`/chat/list?type=${type}&search=${search}&page=1&pageSize=50`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching chat list:', error);
    return { data: [] };
  }
};

// --- 2. Get Messages for a Specific Chat ---
export const getChatMessages = async (chatId: string): Promise<{ data: IChatMessage[] }> => {
  try {
    // Matches Backend: /chat/message/:id
    const response = await fetcher(`/chat/message/${chatId}?page=1&pageSize=50`, {
      method: 'GET',
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching messages:', error);
    return { data: [] };
  }
};

// --- 3. Get Details (for Header) ---
export const getChatDetails = async (chatId: string): Promise<IChatListItem | null> => {
  try {
    const response = await fetcher(`/chat/details/${chatId}`, { method: 'GET' });
    return response.data;
  } catch (error) {
    return null;
  }
};

// --- 4. Send Message ---
export const sendMessage = async (payload: ISendMessagePayload) => {
  try {
    const response = await fetcher('/chat/send-message', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' },
    });
    return response;
  } catch (error) {
    console.error('Send message error', error);
    throw error;
  }
};

// --- 5. Upload Media ---
export const uploadChatMedia = async (formData: FormData): Promise<IMessageAttachment | any> => {
  try {
    // fetcher usually needs to know NOT to set Content-Type for FormData
    // If your fetcher wraps fetch, ensure it allows FormData to set its own boundary
    const response = await fetcher('/chat/upload', {
      method: 'POST',
      body: formData,
      // Do NOT set Content-Type header here, browser does it for FormData
    });
    return response.data;
  } catch (error) {
    console.error('Upload error', error);
    throw error;
  }
};
