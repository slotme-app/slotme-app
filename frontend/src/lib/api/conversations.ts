import apiClient from './client'

export type ConversationStatus =
  | 'ACTIVE'
  | 'WAITING_FOR_CLIENT'
  | 'COMPLETED'
  | 'HANDED_OFF'

export interface Conversation {
  id: string
  clientId: string
  clientName: string
  clientPhone: string
  channel: string
  status: ConversationStatus
  lastMessage?: string
  lastMessageAt?: string
  unreadCount: number
  salonId: string
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  content: string
  sender: 'CLIENT' | 'AI' | 'ADMIN'
  timestamp: string
}

export interface ConversationListParams {
  status?: ConversationStatus
  page?: number
  size?: number
}

export async function getConversations(
  salonId: string,
  params?: ConversationListParams,
): Promise<Conversation[]> {
  const response = await apiClient.get<Conversation[]>(
    `/salons/${salonId}/conversations`,
    { params },
  )
  return response.data
}

export async function getConversation(
  salonId: string,
  conversationId: string,
): Promise<Conversation> {
  const response = await apiClient.get<Conversation>(
    `/salons/${salonId}/conversations/${conversationId}`,
  )
  return response.data
}

export async function getMessages(
  salonId: string,
  conversationId: string,
): Promise<Message[]> {
  const response = await apiClient.get<Message[]>(
    `/salons/${salonId}/conversations/${conversationId}/messages`,
  )
  return response.data
}

export async function sendMessage(
  salonId: string,
  conversationId: string,
  content: string,
): Promise<Message> {
  const response = await apiClient.post<Message>(
    `/salons/${salonId}/conversations/${conversationId}/messages`,
    { content },
  )
  return response.data
}

export async function handoffConversation(
  salonId: string,
  conversationId: string,
): Promise<void> {
  await apiClient.post(
    `/salons/${salonId}/conversations/${conversationId}/handoff`,
  )
}
