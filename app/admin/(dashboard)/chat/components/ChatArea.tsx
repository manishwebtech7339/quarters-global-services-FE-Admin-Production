'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, FileText, X, Loader } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  IChatListItem,
  IChatMessage,
  IMessageAttachment,
  ISendMessagePayload,
  sendMessage,
  uploadChatMedia,
} from '@/services/chatService';
import Link from 'next/link';
import handleAsync from '@/lib/handleAsync';
import { useRouter, useSearchParams } from 'next/navigation';

interface ChatAreaProps {
  initialMessages: IChatMessage[];
  chatDetails: IChatListItem;
  currentUserId: string; // Needed to check "isMine"
  role: string;
}

const ChatArea = ({ initialMessages, chatDetails, currentUserId, role }: ChatAreaProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<IChatMessage[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [attachmentUploading, setAttachmentUploading] = useState(false);
  const [attachments, setAttachments] = useState<IMessageAttachment[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Revalidate the message in every 5 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      router.refresh();
    }, 3000);

    return () => clearInterval(intervalId);
  }, []);

  // Set messages
  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages.length]);

  const handleSend = handleAsync(async () => {
    if (isSending) return;

    setIsSending(true);
    try {
      // Prepare Payload
      const payload: ISendMessagePayload = {
        userId: currentUserId,
        role: role,
        from: currentUserId,
        to: chatDetails.user._id,
        chatId: chatDetails._id,
        message: newMessage,
        attachments: attachments ?? [],
      };

      // Optimistic UI Update (Show message immediately)
      const optimisticMsg: IChatMessage = {
        _id: Math.random().toString(), // Temp ID
        chatId: chatDetails._id,
        sender: {
          _id: currentUserId,
          firstName: 'Me',
          lastName: '',
          email: '',
          avatar: '',
          role: role,
        },
        senderType: role,
        message: newMessage,
        attachments: attachments ?? [],
        messageType: attachments && attachments.length > 0 ? 'text_with_attachments' : 'text',
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [optimisticMsg, ...prev]); // Add to top or bottom depending on your flex direction
      setNewMessage('');
      setAttachments([]);

      // API Call
      await sendMessage(payload);

      // Ideally, re-fetch messages or wait for socket event here to confirm
      const params = new URLSearchParams(searchParams.toString());
      params.set('revalidate', Date.now().toString());
      router.replace(`?${params.toString()}`);
    } finally {
      setIsSending(false);
    }
  });

  const handleFileUpload = handleAsync(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setAttachmentUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', file.type.startsWith('image/') ? 'image' : 'file');
      formData.append('fileName', file.name);
      formData.append('mimeType', file.type);

      // Upload logic...
      const result = await uploadChatMedia(formData);

      if (result?._id && result?.file) {
        setAttachments((pre) => [...pre, result]);
      }
    } finally {
      setAttachmentUploading(false);
    }
  });
  const removeAttachment = (indexToRemove: number) => {
    setAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const isImage = (mimeType: string) => mimeType?.startsWith('image/');

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        <Avatar>
          <AvatarImage src={chatDetails?.user?.avatar ?? '-'} />
          <AvatarFallback>{chatDetails?.user?.firstName?.[0] ?? '-'}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">
            {chatDetails?.user?.firstName || 'N/A'} {chatDetails?.user?.lastName}
          </h3>
          <p className="text-xs text-muted-foreground capitalize">{chatDetails?.user?.role}</p>
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col-reverse gap-4">
        {/* Note: flex-col-reverse if your API returns newest first, otherwise standard flex-col */}
        <div ref={messagesEndRef} />
        {messages.map((msg) => {
          const isMine = msg.sender._id === currentUserId;
          return (
            <div
              key={msg._id}
              className={cn('flex w-full', isMine ? 'justify-end' : 'justify-start')}
            >
              <div
                className={cn(
                  'max-w-[70%] p-3 rounded-2xl text-sm space-y-2',
                  isMine
                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                    : 'bg-muted rounded-tl-none',
                )}
              >
                {/* Render Attachments in Message */}
                {msg.attachments?.length > 0 && (
                  <div
                    className={cn(
                      'grid gap-2',
                      msg.attachments.length > 1 ? 'grid-cols-2' : 'grid-cols-1',
                    )}
                  >
                    {msg.attachments.map((att) => (
                      <div key={att._id} className="relative overflow-hidden rounded-md">
                        {isImage(att.mimeType) ? (
                          <Link target="_blank" href={att.file}>
                            {/* // eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={att.file}
                              alt={att.fileName}
                              className="object-cover w-full aspect-video max-h-[200px] rounded-md"
                            />
                          </Link>
                        ) : (
                          <a
                            href={att.file}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              'flex items-center gap-2 p-3 rounded-md border',
                              isMine
                                ? 'bg-primary-foreground/10 border-white/20'
                                : 'bg-background border-border',
                            )}
                          >
                            <FileText className="h-5 w-5 opacity-70" />
                            <div className="flex flex-col overflow-hidden">
                              <span className="truncate font-medium text-xs">{att.fileName}</span>
                              <span className="text-[10px] opacity-70 uppercase">FILE</span>
                            </div>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Render Text */}
                {msg.message && (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                )}

                {/* Timestamp (Optional) */}
                {/* <p className={cn("text-[10px] mt-1 text-right opacity-70")}>
                    {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Area */}
      <div className="border-t bg-background shrink-0">
        {/* Attachments Preview Area */}
        {attachments.length > 0 && (
          <div className="px-4 py-3 flex gap-3 overflow-x-auto border-b">
            {attachments.map((att, index) => (
              <div key={att._id || index} className="relative group flex-shrink-0">
                <div className="h-16 w-16 rounded-md border overflow-hidden bg-muted flex items-center justify-center">
                  {isImage(att.mimeType) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={att.file} alt="preview" className="h-full w-full object-cover" />
                  ) : (
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  )}
                </div>
                {/* Remove Button */}
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Form */}
        <div className="p-4 flex gap-2 items-end">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileUpload}
            // accept="image/*,application/pdf" // Optional: restrict types
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
            disabled={attachmentUploading}
          >
            {attachmentUploading ? (
              <Loader className="h-5 w-5 text-muted-foreground animate-spin" />
            ) : (
              <Paperclip className="h-5 w-5 text-muted-foreground" />
            )}
          </Button>

          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            autoComplete="off"
            className="h-9"
          />

          <Button
            onClick={handleSend}
            disabled={
              isSending || attachmentUploading || (!newMessage.trim() && attachments.length === 0)
            }
            className="shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
