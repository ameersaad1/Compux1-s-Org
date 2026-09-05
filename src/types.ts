export interface Badge {
  id: string;
  name: string;
  nameAr: string;
  desc: string;
  descAr: string;
  emoji: string;
  color: string;
  earnedAt: string;
}

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  handle: string;
  role: string;
  bio: string;
  university: string;
  faculty: string;
  major: string;
  studyLevel: 'Freshman' | 'Sophomore' | 'Junior' | 'Senior' | 'Masters' | 'PhD' | string;
  avatar: string;
  coverUrl: string;
  isAdmin: boolean;
  isVerified: boolean;
  verificationPending: boolean;
  verificationColor: string;
  followers: string[];
  following: string[];
  postCount: number;
  studyHours: number;
  badges: Badge[];
  github?: string;
  linkedin?: string;
  phone?: string;
  phoneVerified?: boolean;
  showPhone?: boolean;
  banned?: boolean;
}

export interface Comment {
  id: number;
  authorId: string;
  text: string;
  time: string;
  likes: number;
  replies: Comment[];
}

export interface Post {
  id: number;
  authorId: string;
  content: string;
  time: string;
  likes: number;
  likedBy?: string[];
  comments: Comment[];
  shares: number;
  image?: string;
  hashtags: string[];
  tag?: string;
  tagColor?: string;
  pinned?: boolean;
  createdAt?: string;
}

export interface Resource {
  id: string;
  title: string;
  subject: string;
  fileType: 'pdf' | 'doc' | 'ppt' | 'xlsx' | string;
  downloads: number;
  uploadedBy: string;
  uploadedAt: string;
  fileUrl?: string;
  fileSize?: string;
}

export interface Report {
  id: string;
  postId?: number;
  reportedBy: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface EventItem {
  id: number;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  location: string;
  emoji: string;
  color: string;
  attending: string[];
  hashtags: string[];
}

export interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  members: string[];
  maxMembers: number;
  nextSession: string;
  color: string;
  active: boolean;
}

export interface DirectMessage {
  userId: string;
  unread: number;
  messages: {
    from: string;
    text: string;
    time: string;
  }[];
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'event' | 'verify' | 'group' | string;
  fromId: string;
  recipientId?: string;
  text: string;
  time: string;
  read: boolean;
  targetType?: 'post' | 'profile' | 'event' | 'group' | 'resource';
  targetId?: string | number;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: 'ban_user' | 'unban_user' | 'verify_user' | 'reject_verify' | 'delete_post' | 'resolve_report' | 'system_config' | string;
  targetType: 'user' | 'post' | 'report' | 'system';
  targetId: string | number;
  details: string;
  timestamp: string;
}

export type AppView = 
  | 'feed' 
  | 'profile' 
  | 'settings' 
  | 'admin' 
  | 'explore' 
  | 'hashtag' 
  | 'messages' 
  | 'alerts' 
  | 'events' 
  | 'study' 
  | 'groups';
