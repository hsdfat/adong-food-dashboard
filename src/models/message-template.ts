export interface MessageTemplate {
  templateId: number;
  templateName: string;
  templateType: string;
  content: string;
  isActive: boolean;
  createdBy: string;
  createdDate: string;
  modifiedDate: string;
}

export interface CreateMessageTemplateInput {
  templateName: string;
  templateType: string;
  content: string;
  isActive?: boolean;
}

export interface UpdateMessageTemplateInput {
  templateName?: string;
  templateType?: string;
  content?: string;
  isActive?: boolean;
}
