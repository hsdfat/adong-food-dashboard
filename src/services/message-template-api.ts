import { apiClient } from '@/utils/api_client'
import {
  MessageTemplate,
  CreateMessageTemplateInput,
  UpdateMessageTemplateInput,
} from '@/models/message-template'

export const messageTemplateApi = {
  getAll: (queryString: string = '') =>
    apiClient<{ data: MessageTemplate[]; count: number }>(
      `/api/message-templates${queryString}`,
    ),
  getById: (id: number) =>
    apiClient<{ data: MessageTemplate }>(`/api/message-templates/${id}`),
  create: (data: CreateMessageTemplateInput) =>
    apiClient<{ data: MessageTemplate; templateId: number }>(
      '/api/message-templates',
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
    ),
  update: (id: number, data: UpdateMessageTemplateInput) =>
    apiClient<{ data: MessageTemplate }>(`/api/message-templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id: number) =>
    apiClient<{ message: string }>(`/api/message-templates/${id}`, {
      method: 'DELETE',
    }),
}
