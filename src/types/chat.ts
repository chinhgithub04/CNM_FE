export interface ChatUser {
    FullName: string;
    UserName: string;
    Email: string;
    PhoneNumber: string | null;
    AvatarUrl: string | null;
}

export interface ChatMessage {
    Id: number;
    ConversationId: number;
    SenderId: string;
    Content: string;
    MessageType: 'text' | 'image' | 'file'; // Assuming these based on typical chat apps, swagger showed "text"
    IsRead: boolean;
    CreatedAt: string; // ISO Date string
    Sender: ChatUser;
}

export interface Conversation {
    Id: number;
    CreatedAt: string;
    LastMessageAt: string;
    CustomerId: string;
    AdminId: string;
    Customer: ChatUser;
    Admin: ChatUser;
    Messages: ChatMessage[];
}

export interface ConversationResponse {
    code: string;
    message: string;
    data: Conversation[];
}

export interface MessageResponse {
    code: string;
    message: string;
    data: ChatMessage[];
}

export interface CreateConversationRequest {
    CustomerId: string;
    AdminId: string;
}

export interface SendMessageRequest {
    Content: string;
    MessageType: string;
    ConversationId: number;
}
