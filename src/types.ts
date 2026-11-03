export type SocialPlatform =
  | 'instagram'
  | 'tiktok'
  | 'twitter' // X
  | 'bluesky'
  | 'threads'
  | 'youtube'
  | 'reddit'
  | 'linkedin'
  | 'web';

export interface Folder {
  id: string;
  name: string;
  icon: string; // Emoji or Lucide icon name
  color: string;
  description?: string;
  createdAt: string;
  isDefault?: boolean;
}

export interface SavedLink {
  id: string;
  url: string;
  title: string;
  platform: SocialPlatform;
  author?: string;
  authorHandle?: string;
  authorAvatar?: string;
  folderId: string;
  tags: string[];
  notes: string;
  previewImage?: string;
  savedAt: string;
  isFavorite: boolean;
  isArchived: boolean;
}

export interface UserSubscription {
  plan: 'free' | 'pro';
  dailyLimit: number; // 5 for free, Infinity for pro
  todaySavedCount: number;
  lastResetDate: string; // YYYY-MM-DD
  price: string; // "R$ 4,99/mês"
  subscribedAt?: string;
  paymentMethod?: 'pix' | 'credit_card';
}

export interface ShareDataInput {
  url: string;
  title?: string;
  text?: string;
  platform?: SocialPlatform;
}
