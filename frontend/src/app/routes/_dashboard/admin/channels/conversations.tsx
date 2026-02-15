import { useState, useRef, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Send,
  Loader2,
  UserCircle,
  Bot,
  Shield,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import * as conversationsApi from '@/lib/api/conversations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { ConversationStatus } from '@/lib/api/conversations'

export const Route = createFileRoute(
  '/_dashboard/admin/channels/conversations',
)({
  component: ConversationsPage,
})

const statusColors: Record<ConversationStatus, 'default' | 'secondary' | 'destructive'> = {
  ACTIVE: 'default',
  WAITING_FOR_CLIENT: 'secondary',
  COMPLETED: 'secondary',
  HANDED_OFF: 'destructive',
}

function ConversationsPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversations', salonId],
    queryFn: () => conversationsApi.getConversations(salonId),
    enabled: !!salonId,
    refetchInterval: 5000,
  })

  const selected = conversations.find((c) => c.id === selectedId) ?? null

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Link to="/admin/channels">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Conversations</h1>
          <p className="text-sm text-muted-foreground">
            Monitor AI-assisted client conversations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-14rem)]">
        {/* Conversation List - hidden on mobile when a conversation is selected */}
        <div
          className={`rounded-md border overflow-y-auto ${
            selectedId ? 'hidden lg:block' : ''
          }`}
        >
          {isLoading ? (
            <div className="space-y-2 p-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">
                No conversations yet.
              </p>
            </div>
          ) : (
            <div>
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  type="button"
                  onClick={() => setSelectedId(conv.id)}
                  className={`flex w-full min-h-[48px] items-start gap-3 border-b p-3 text-left hover:bg-accent transition-colors ${
                    selectedId === conv.id ? 'bg-accent' : ''
                  }`}
                >
                  <UserCircle className="mt-0.5 h-8 w-8 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium truncate">
                        {conv.clientName}
                      </p>
                      {conv.unreadCount > 0 && (
                        <Badge variant="default" className="shrink-0">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {conv.lastMessage || 'No messages'}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge
                        variant={statusColors[conv.status]}
                        className="text-[10px]"
                      >
                        {conv.status.replace(/_/g, ' ')}
                      </Badge>
                      {conv.lastMessageAt && (
                        <span className="text-[10px] text-muted-foreground">
                          {formatRelativeTime(conv.lastMessageAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Message Thread - full width on mobile when selected */}
        <div
          className={`lg:col-span-2 rounded-md border flex flex-col ${
            !selectedId ? 'hidden lg:flex' : ''
          }`}
        >
          {selected ? (
            <ConversationThread
              salonId={salonId}
              conversation={selected}
              onBack={() => setSelectedId(null)}
            />
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Select a conversation to view messages
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ConversationThread({
  salonId,
  conversation,
  onBack,
}: {
  salonId: string
  conversation: conversationsApi.Conversation
  onBack?: () => void
}) {
  const queryClient = useQueryClient()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages', salonId, conversation.id],
    queryFn: () =>
      conversationsApi.getMessages(salonId, conversation.id),
    enabled: !!salonId,
    refetchInterval: 5000,
  })

  const sendMutation = useMutation({
    mutationFn: (content: string) =>
      conversationsApi.sendMessage(salonId, conversation.id, content),
    onSuccess: () => {
      setInput('')
      void queryClient.invalidateQueries({
        queryKey: ['messages', salonId, conversation.id],
      })
    },
    onError: () => toast.error('Failed to send message'),
  })

  const handoffMutation = useMutation({
    mutationFn: () =>
      conversationsApi.handoffConversation(salonId, conversation.id),
    onSuccess: () => {
      toast.success('Conversation handed off to you')
      void queryClient.invalidateQueries({
        queryKey: ['conversations', salonId],
      })
    },
    onError: () => toast.error('Failed to take over conversation'),
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMutation.mutate(input.trim())
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-3">
        <div className="flex items-center gap-2">
          {onBack && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9"
              onClick={onBack}
              aria-label="Back to conversations"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          <div>
            <p className="font-semibold">{conversation.clientName}</p>
            <p className="text-xs text-muted-foreground">
              {conversation.clientPhone} &middot;{' '}
              {conversation.channel}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusColors[conversation.status]}>
            {conversation.status.replace(/_/g, ' ')}
          </Badge>
          {conversation.status === 'ACTIVE' && (
            <Button
              variant="outline"
              size="sm"
              disabled={handoffMutation.isPending}
              onClick={() => handoffMutation.mutate()}
            >
              <Shield className="mr-1 h-4 w-4" />
              Take Over
            </Button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-3/4" />
            ))}
          </div>
        ) : messages.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No messages yet.
          </p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${
                msg.sender === 'CLIENT' ? 'justify-start' : 'justify-end'
              }`}
            >
              {msg.sender === 'CLIENT' && (
                <UserCircle className="mt-1 h-6 w-6 shrink-0 text-muted-foreground" />
              )}
              <div
                className={`max-w-[70%] rounded-lg px-3 py-2 ${
                  msg.sender === 'CLIENT'
                    ? 'bg-muted'
                    : msg.sender === 'AI'
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-primary text-primary-foreground'
                }`}
              >
                <div className="flex items-center gap-1 mb-1">
                  {msg.sender === 'AI' && (
                    <Bot className="h-3 w-3 text-blue-500" />
                  )}
                  {msg.sender === 'ADMIN' && (
                    <Shield className="h-3 w-3" />
                  )}
                  <span className="text-[10px] opacity-70">
                    {msg.sender === 'CLIENT'
                      ? conversation.clientName
                      : msg.sender === 'AI'
                        ? 'AI Assistant'
                        : 'Admin'}
                  </span>
                </div>
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <p className="mt-1 text-[10px] opacity-50">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {msg.sender !== 'CLIENT' && (
                <div className="w-6 shrink-0" />
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {(conversation.status === 'HANDED_OFF' ||
        conversation.status === 'ACTIVE') && (
        <form onSubmit={handleSend} className="border-t p-3 flex gap-2">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={sendMutation.isPending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || sendMutation.isPending}
          >
            {sendMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      )}
    </>
  )
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}
