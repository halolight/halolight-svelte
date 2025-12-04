import type { Message, MessageThread, MessageStats } from '$lib/types/messages.js';

/**
 * 生成模拟消息数据
 */
export function generateMessages(count: number = 100): Message[] {
  const messages: Message[] = [];
  const types = ['system', 'user', 'notification', 'announcement'] as const;
  const priorities = ['low', 'normal', 'high', 'urgent'] as const;
  const statuses = ['unread', 'read', 'archived'] as const;
  const subjects = [
    '系统通知',
    '重要消息',
    '活动通知',
    '账户安全',
    '新功能上线',
    '维护通知',
    '反馈回复',
    '审核结果',
  ];

  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const subject = subjects[Math.floor(Math.random() * subjects.length)];
    const createdAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
    const readAt =
      status === 'read'
        ? new Date(createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000).toISOString()
        : undefined;

    messages.push({
      id: `msg-${i}`,
      senderId: type === 'system' ? 'system' : `user-${Math.floor(Math.random() * 50) + 1}`,
      senderName: type === 'system' ? '系统' : `用户${Math.floor(Math.random() * 50) + 1}`,
      senderAvatar:
        type === 'system'
          ? undefined
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=sender${i}`,
      receiverId: `user-${Math.floor(Math.random() * 50) + 1}`,
      receiverName: `用户${Math.floor(Math.random() * 50) + 1}`,
      type,
      priority,
      subject: `${subject} #${i}`,
      content: `这是消息 #${i} 的内容。${priority === 'urgent' ? '请尽快处理！' : ''}`,
      status,
      readAt,
      attachments:
        Math.random() > 0.7
          ? [
              {
                id: `att-${i}-1`,
                name: `attachment-${i}.pdf`,
                url: `https://example.com/files/att-${i}.pdf`,
                size: Math.floor(Math.random() * 1000000),
                type: 'application/pdf',
              },
            ]
          : undefined,
      metadata: {},
      createdAt: createdAt.toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 生成模拟消息会话
 */
export function generateMessageThreads(count: number = 20): MessageThread[] {
  const threads: MessageThread[] = [];

  for (let i = 1; i <= count; i++) {
    const participantCount = Math.floor(Math.random() * 3) + 2;
    const participants = Array.from({ length: participantCount }, (_, j) => ({
      id: `user-${Math.floor(Math.random() * 50) + 1}`,
      name: `用户${Math.floor(Math.random() * 50) + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${j}`,
    }));

    const lastMessage = generateMessages(1)[0];
    const unreadCount = Math.floor(Math.random() * 10);

    threads.push({
      id: `thread-${i}`,
      participantIds: participants.map((p) => p.id),
      participants,
      lastMessage,
      unreadCount,
      isPinned: Math.random() > 0.8,
      isMuted: Math.random() > 0.9,
      createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: lastMessage.createdAt,
    });
  }

  return threads.sort((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

/**
 * 生成消息统计数据
 */
export function generateMessageStats(messages: Message[]): MessageStats {
  const stats: MessageStats = {
    total: messages.length,
    unread: messages.filter((m) => m.status === 'unread').length,
    read: messages.filter((m) => m.status === 'read').length,
    archived: messages.filter((m) => m.status === 'archived').length,
    byType: {
      system: messages.filter((m) => m.type === 'system').length,
      user: messages.filter((m) => m.type === 'user').length,
      notification: messages.filter((m) => m.type === 'notification').length,
      announcement: messages.filter((m) => m.type === 'announcement').length,
    },
    byPriority: {
      low: messages.filter((m) => m.priority === 'low').length,
      normal: messages.filter((m) => m.priority === 'normal').length,
      high: messages.filter((m) => m.priority === 'high').length,
      urgent: messages.filter((m) => m.priority === 'urgent').length,
    },
  };

  return stats;
}

/**
 * 全局消息数据
 */
export const mockMessages = generateMessages(100);
export const mockMessageThreads = generateMessageThreads(20);
export const mockMessageStats = generateMessageStats(mockMessages);
