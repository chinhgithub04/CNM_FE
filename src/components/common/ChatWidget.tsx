import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    MessageCircle,
    Maximize2,
    Search,
    ChevronDown,
    MoreHorizontal,
    CheckCheck,
    Send,
    Smile,
    Paperclip,
    Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import type { ChatMessage, Conversation } from '@/types/chat';

export default function ChatWidget() {
    const location = useLocation();
    const queryClient = useQueryClient();
    const { isAuthenticated, user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Hidden on checkout and payment success pages
    const hiddenPaths = ['/checkout', '/payment-success'];
    const shouldHide = hiddenPaths.some((path) =>
        location.pathname.startsWith(path)
    );

    // Fetch conversations
    const { data: conversations = [], isLoading: isLoadingConversations } = useQuery({
        queryKey: ['conversations'],
        queryFn: chatService.getConversations,
        enabled: isAuthenticated && isOpen,
        refetchInterval: 5000, // Poll every 5 seconds
    });

    // Fetch messages for selected conversation
    const { data: messages = [], isLoading: isLoadingMessages } = useQuery({
        queryKey: ['messages', selectedConversationId],
        queryFn: () => chatService.getMessages(selectedConversationId!),
        enabled: !!selectedConversationId,
        refetchInterval: 3000, // Poll messages faster
    });

    // Send message mutation
    const sendMessageMutation = useMutation({
        mutationFn: (content: string) =>
            chatService.sendMessage(selectedConversationId!, {
                Content: content,
                MessageType: 'text',
                ConversationId: selectedConversationId!
            }),
        onSuccess: () => {
            setNewMessage('');
            queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] });
            // Optimistic update could be added here
        }
    });

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, selectedConversationId, isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleMinimize = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsOpen(false);
    };

    const handleSelectConversation = (id: number) => {
        setSelectedConversationId(id);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Attempting to send:', { newMessage, selectedConversationId, user });
        if (!newMessage.trim() || !selectedConversationId) {
            console.log('Missing data, returning');
            return;
        }
        // Removed strict user?.Id check for now to allow network request if backend handles it
        // and to debug if that was the blocker.
        sendMessageMutation.mutate(newMessage);
    };

    if (shouldHide || !isAuthenticated) return null;

    if (!isOpen) {
        return (
            <div className='fixed bottom-0 right-4 z-50 flex items-center justify-end'>
                <Button
                    onClick={handleToggle}
                    className='flex h-12 items-center gap-2 rounded-t-lg bg-white px-6 py-3 text-red-500 shadow-[0_0_10px_rgba(0,0,0,0.1)] hover:bg-gray-50 border border-b-0 border-gray-200'
                >
                    <MessageCircle className='h-6 w-6 fill-red-500/20' />
                    <span className='text-lg font-bold'>Chat</span>
                </Button>
            </div>
        );
    }

    const selectedConversation = conversations.find(c => c.Id === selectedConversationId);
    // Determine the "other" participant name/avatar
    const getConversationDisplay = (conv: Conversation) => {
        // Determine whom to show based on current user's role
        // If current user is Admin, show Customer info. 
        // If current user is Customer, show Admin info.
        let displayUser = conv.Admin;

        if (user?.Role === 'Admin') {
            displayUser = conv.Customer;
        } else if (user?.Role === 'Customer') {
            displayUser = conv.Admin;
        } else {
            // Fallback if Role is missing or unknown, check IDs
            if (conv.AdminId === user?.Id) {
                displayUser = conv.Customer;
            }
        }

        return {
            name: displayUser?.FullName || 'User',
            avatar: displayUser?.AvatarUrl,
            initial: displayUser?.FullName?.[0]?.toUpperCase() || 'U',
            message: conv.Messages?.[conv.Messages.length - 1]?.Content || 'No messages yet',
            date: new Date(conv.LastMessageAt).toLocaleDateString()
        };
    };

    return (
        <Card className='fixed bottom-0 right-4 z-50 flex h-[600px] w-[900px] flex-col overflow-hidden rounded-t-lg shadow-2xl border-gray-200 bg-white'>
            {/* Header */}
            <div className='flex items-center justify-between border-b px-4 py-3'>
                <div className='flex items-center gap-2'>
                    <h2 className='text-xl font-bold text-red-500'>Chat</h2>
                </div>
                <div className='flex items-center gap-2'>
                    <button className='text-gray-400 hover:text-gray-600'>
                        <Maximize2 className='h-5 w-5' />
                    </button>
                    <button
                        onClick={handleMinimize}
                        className='text-gray-400 hover:text-gray-600'
                    >
                        <ChevronDown className='h-6 w-6' />
                    </button>
                </div>
            </div>

            <div className='flex flex-1 overflow-hidden'>
                {/* Sidebar */}
                <div className='flex w-[350px] flex-col border-r'>
                    {/* Search & Filter */}
                    <div className='space-y-3 p-3'>
                        <div className='flex gap-2'>
                            <div className='relative flex-1'>
                                <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-gray-400' />
                                <Input
                                    placeholder='Tìm theo tên'
                                    className='h-10 pl-9 text-sm bg-gray-50'
                                />
                            </div>
                            <Button
                                variant='ghost'
                                size='sm'
                                className='h-10 px-2 text-gray-600'
                            >
                                Tất cả <ChevronDown className='ml-1 h-3 w-3' />
                            </Button>
                        </div>
                    </div>

                    {/* Conversation List */}
                    <div className='flex-1 overflow-y-auto'>
                        {conversations.map((conv) => {
                            const display = getConversationDisplay(conv);
                            return (
                                <div
                                    key={conv.Id}
                                    onClick={() => handleSelectConversation(conv.Id)}
                                    className={`flex cursor-pointer items-center gap-3 px-3 py-4 hover:bg-gray-50 ${selectedConversationId === conv.Id ? 'bg-red-50' : ''}`}
                                >
                                    <Avatar className='h-12 w-12'>
                                        {display.avatar ? (
                                            <AvatarImage src={display.avatar} />
                                        ) : (
                                            <AvatarFallback className='bg-blue-600 text-white text-sm'>
                                                {display.initial}
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <div className='flex-1 overflow-hidden'>
                                        <div className='flex items-center justify-between'>
                                            <h3 className='truncate font-medium text-gray-900'>
                                                {display.name}
                                            </h3>
                                            <span className='text-xs text-gray-500'>{display.date}</span>
                                        </div>
                                        <p className='truncate text-sm text-gray-500'>
                                            {display.message}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                        {conversations.length === 0 && !isLoadingConversations && (
                            <div className="p-4 text-center text-gray-500">
                                Chưa có tin nhắn nào
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Content Area */}
                <div className='flex flex-1 flex-col bg-[#F5F5F5]'>
                    {selectedConversationId ? (
                        <>
                            {/* Chat Header */}
                            <div className='flex items-center justify-between border-b bg-white px-4 py-3'>
                                <div className='flex items-center gap-3'>
                                    <span className='font-bold text-lg'>
                                        {selectedConversation ? getConversationDisplay(selectedConversation).name : 'Chat'}
                                    </span>
                                    <span className='text-xs text-green-500'>Đang hoạt động</span>
                                </div>
                                <Button variant="ghost" size="icon" className="text-gray-400">
                                    <MoreHorizontal className="h-5 w-5" />
                                </Button>
                            </div>

                            {/* Messages */}
                            <div ref={scrollRef} className='flex-1 space-y-4 overflow-y-auto p-4'>
                                {messages.map((msg) => {
                                    // Match by Email per user request since Id might be missing
                                    const isMe = msg.Sender.Email === user?.Email;
                                    return (
                                        <div
                                            key={msg.Id}
                                            className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                                    ? 'bg-[#d0f4f3] text-gray-900 rounded-tr-none'
                                                    : 'bg-white text-gray-900 rounded-tl-none'
                                                    }`}
                                            >
                                                <p>{msg.Content}</p>
                                                <div className={`mt-1 flex items-center justify-end gap-1`}>
                                                    <span className='text-xs text-gray-500'>
                                                        {new Date(msg.CreatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                    {isMe && msg.IsRead && (
                                                        <CheckCheck className="h-3 w-3 text-green-600" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Input Area */}
                            <div className='border-t bg-white p-3'>
                                <form onSubmit={handleSendMessage} className='flex items-center gap-2'>
                                    <div className="flex gap-1 text-gray-400">
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500">
                                            <Smile className="h-5 w-5" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500">
                                            <Paperclip className="h-5 w-5" />
                                        </Button>
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500">
                                            <ImageIcon className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <Input
                                        placeholder='Nhập tin nhắn...'
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className='flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0'
                                    />
                                    <Button
                                        type="submit"
                                        size="icon"
                                        className="h-9 w-9 bg-red-500 hover:bg-red-600"
                                        disabled={sendMessageMutation.isPending || !newMessage.trim()}
                                    >
                                        <Send className="h-4 w-4" />
                                    </Button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className='flex flex-1 flex-col items-center justify-center p-6 text-center'>
                            <div className='mb-6 rounded-2xl bg-white p-8 shadow-sm'>
                                {/* Simple Laptop Icon Illustration */}
                                <div className="relative mx-auto h-24 w-32">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="h-20 w-28 rounded-md border-4 border-gray-300 bg-white"></div>
                                        <div className="absolute -right-4 bottom-8 flex h-10 w-12 items-center justify-center rounded-lg bg-red-500 text-white shadow-lg">
                                            <span className="flex gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                                                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                                                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-2 -left-4 -right-4 h-2 rounded-full bg-gray-300"></div>
                                </div>
                            </div>
                            <h3 className='mb-2 text-xl font-medium text-gray-900'>
                                Chào mừng bạn đến với kênh chat
                            </h3>
                            <p className='text-gray-500'>Bắt đầu trò chuyện ngay!</p>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
}


