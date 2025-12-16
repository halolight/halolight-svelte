import type { BaseEntity, PaginatedResponse } from './index.js';

/**
 * 消息类型（系统消息、用户消息等）
 */
export type MessageCategory = 'system' | 'user' | 'notification' | 'announcement';

/**
 * 消息状态
 */
export type MessageStatus = 'unread' | 'read' | 'archived' | 'deleted';

/**
 * 消息优先级
 */
export type MessagePriority = 'low' | 'normal' | 'high' | 'urgent';

/**
 * 消息基础信息
 */
export interface Message extends BaseEntity {
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName?: string;
  type: MessageCategory;
  priority: MessagePriority;
  subject: string;
  content: string;
  status: MessageStatus;
  readAt?: string;
  attachments?: MessageAttachment[];
  metadata?: Record<string, any>;
}

/**
 * 消息附件
 */
export interface MessageAttachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  thumbnailUrl?: string;
}

/**
 * 消息列表查询参数
 */
export interface MessageListQuery {
  page?: number;
  pageSize?: number;
  type?: MessageCategory;
  status?: MessageStatus;
  priority?: MessagePriority;
  keyword?: string;
  senderId?: string;
  startDate?: string;
  endDate?: string;
  sortBy?: 'createdAt' | 'priority';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 消息列表响应
 */
export type MessageListResponse = PaginatedResponse<Message>;

/**
 * 消息统计
 */
export interface MessageStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
  byType: Record<MessageCategory, number>;
  byPriority: Record<MessagePriority, number>;
}

/**
 * 发送消息参数
 */
export interface SendMessageDto {
  receiverIds: string[];
  type: MessageCategory;
  priority?: MessagePriority;
  subject: string;
  content: string;
  attachments?: Omit<MessageAttachment, 'id'>[];
  scheduledAt?: string;
}

/**
 * 消息会话
 */
export interface MessageThread extends BaseEntity {
  participantIds: string[];
  participants: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  lastMessage: Message;
  unreadCount: number;
  isPinned: boolean;
  isMuted: boolean;
}

/**
 * 消息会话列表响应
 */
export type MessageThreadListResponse = PaginatedResponse<MessageThread>;
