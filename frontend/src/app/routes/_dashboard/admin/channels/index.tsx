import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod/v4'
import { toast } from 'sonner'
import {
  Loader2,
  Save,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ExternalLink,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import * as channelsApi from '@/lib/api/channels'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/_dashboard/admin/channels/')({
  component: ChannelsPage,
})

const whatsappSchema = z.object({
  phoneNumberId: z.string().min(1, 'Phone Number ID is required'),
  accessToken: z.string().min(1, 'Access Token is required'),
  verifyToken: z.string().min(1, 'Verify Token is required'),
})

type WhatsAppFormData = z.infer<typeof whatsappSchema>

function ChannelsPage() {
  const { user } = useAuthStore()
  const salonId = user?.salonId ?? ''
  const queryClient = useQueryClient()
  const [testResult, setTestResult] = useState<{
    success: boolean
    message: string
  } | null>(null)

  const { data: config, isLoading } = useQuery({
    queryKey: ['whatsapp-config', salonId],
    queryFn: () => channelsApi.getWhatsAppConfig(salonId),
    enabled: !!salonId,
  })

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WhatsAppFormData>({
    resolver: zodResolver(whatsappSchema),
    values: config
      ? {
          phoneNumberId: config.phoneNumberId,
          accessToken: config.accessToken,
          verifyToken: config.verifyToken,
        }
      : undefined,
  })

  const updateMutation = useMutation({
    mutationFn: (data: WhatsAppFormData) =>
      channelsApi.updateWhatsAppConfig(salonId, data),
    onSuccess: () => {
      toast.success('WhatsApp configuration saved')
      void queryClient.invalidateQueries({
        queryKey: ['whatsapp-config', salonId],
      })
    },
    onError: () => toast.error('Failed to save configuration'),
  })

  const testMutation = useMutation({
    mutationFn: () => channelsApi.testWhatsAppConnection(salonId),
    onSuccess: (result) => {
      setTestResult(result)
      if (result.success) {
        toast.success('Connection test passed')
      } else {
        toast.error(`Connection test failed: ${result.message}`)
      }
    },
    onError: () => {
      setTestResult({ success: false, message: 'Connection test failed' })
      toast.error('Connection test failed')
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Channels</h1>
        <p className="text-sm text-muted-foreground">
          Configure messaging channels for your AI assistant
        </p>
      </div>

      {/* WhatsApp Configuration */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5" />
            <div>
              <CardTitle>WhatsApp Business</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Connect your WhatsApp Business account
              </p>
            </div>
          </div>
          {config && (
            <Badge
              variant={config.isConnected ? 'default' : 'secondary'}
            >
              {config.isConnected ? (
                <CheckCircle2 className="mr-1 h-3 w-3" />
              ) : (
                <XCircle className="mr-1 h-3 w-3" />
              )}
              {config.isConnected ? 'Connected' : 'Not Connected'}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <form
              onSubmit={handleSubmit((data) => updateMutation.mutate(data))}
              className="space-y-4 max-w-lg"
            >
              <div className="space-y-2">
                <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                <Input
                  id="phoneNumberId"
                  placeholder="e.g. 123456789012345"
                  {...register('phoneNumberId')}
                />
                {errors.phoneNumberId && (
                  <p className="text-sm text-destructive">
                    {errors.phoneNumberId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessToken">Access Token</Label>
                <Input
                  id="accessToken"
                  type="password"
                  placeholder="Your WhatsApp Cloud API access token"
                  {...register('accessToken')}
                />
                {errors.accessToken && (
                  <p className="text-sm text-destructive">
                    {errors.accessToken.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="verifyToken">Verify Token</Label>
                <Input
                  id="verifyToken"
                  placeholder="Your webhook verify token"
                  {...register('verifyToken')}
                />
                {errors.verifyToken && (
                  <p className="text-sm text-destructive">
                    {errors.verifyToken.message}
                  </p>
                )}
              </div>

              {config?.webhookUrl && (
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <div className="rounded-md bg-muted p-3">
                    <code className="text-sm break-all">
                      {config.webhookUrl}
                    </code>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Configure this URL in your Meta Developer dashboard
                  </p>
                </div>
              )}

              {testResult && (
                <div
                  className={`rounded-md p-3 text-sm ${
                    testResult.success
                      ? 'bg-green-50 text-green-700 border border-green-200'
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}
                >
                  {testResult.success ? (
                    <CheckCircle2 className="inline mr-1 h-4 w-4" />
                  ) : (
                    <XCircle className="inline mr-1 h-4 w-4" />
                  )}
                  {testResult.message}
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Configuration
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={testMutation.isPending}
                  onClick={() => testMutation.mutate()}
                >
                  {testMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Test Connection
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Conversations Link */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Conversations</h3>
              <p className="text-sm text-muted-foreground">
                Monitor and manage AI conversations with clients
              </p>
            </div>
            <Link to="/admin/channels/conversations">
              <Button variant="outline">
                View Conversations
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
