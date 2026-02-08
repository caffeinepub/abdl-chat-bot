import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Message {
    content: string;
    author: string;
    timestamp: bigint;
}
export interface ChatView {
    title: string;
    creator: Principal;
    messages: Array<Message>;
    chatId: bigint;
}
export interface ChatSummary {
    title: string;
    creator: Principal;
    chatId: bigint;
}
export interface MessageInput {
    content: string;
    author: string;
}
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMessage(chatId: bigint, message: MessageInput, timestamp: bigint): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createChat(title: string): Promise<bigint>;
    deleteChat(chatId: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getChat(chatId: bigint): Promise<ChatView | null>;
    getChatbotReply(prompt: string): Promise<string>;
    getUserChats(): Promise<Array<ChatSummary>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
