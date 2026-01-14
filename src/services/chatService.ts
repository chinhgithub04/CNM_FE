import apiClient from './apiClient';
import type {
    Conversation,
    ConversationResponse,
    MessageResponse,
    SendMessageRequest,
    CreateConversationRequest,
    ChatMessage,
} from '@/types/chat';

export const chatService = {
    getConversations: async (): Promise<Conversation[]> => {
        const response = await apiClient.get<ConversationResponse>('/conversations');
        return response.data.data;
    },

    createConversation: async (
        data: CreateConversationRequest
    ): Promise<Conversation> => {
        const response = await apiClient.post<any>('/conversations', data); // Type as any for now as response wrapper might be consistent
        return response.data.data;
    },

    getMessages: async (conversationId: number): Promise<ChatMessage[]> => {
        const response = await apiClient.get<MessageResponse>(
            `/conversations/${conversationId}/messages`
        );
        return response.data.data;
    },

    sendMessage: async (
        conversationId: number,
        data: SendMessageRequest
    ): Promise<ChatMessage> => {
        const response = await apiClient.post<any>(
            `/conversations/${conversationId}/messages`,
            data
        );
        return response.data.data; // Assuming it returns the created message or similar
    },
};
