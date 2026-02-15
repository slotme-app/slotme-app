import apiClient from './client'

export interface WhatsAppConfig {
  phoneNumberId: string
  accessToken: string
  verifyToken: string
  webhookUrl: string
  isConnected: boolean
}

export interface UpdateWhatsAppConfigRequest {
  phoneNumberId: string
  accessToken: string
  verifyToken: string
}

export interface ConnectionTestResult {
  success: boolean
  message: string
}

export async function getWhatsAppConfig(
  salonId: string,
): Promise<WhatsAppConfig> {
  const response = await apiClient.get<WhatsAppConfig>(
    `/salons/${salonId}/channels/whatsapp`,
  )
  return response.data
}

export async function updateWhatsAppConfig(
  salonId: string,
  data: UpdateWhatsAppConfigRequest,
): Promise<WhatsAppConfig> {
  const response = await apiClient.put<WhatsAppConfig>(
    `/salons/${salonId}/channels/whatsapp`,
    data,
  )
  return response.data
}

export async function testWhatsAppConnection(
  salonId: string,
): Promise<ConnectionTestResult> {
  const response = await apiClient.post<ConnectionTestResult>(
    `/salons/${salonId}/channels/whatsapp/test`,
  )
  return response.data
}
