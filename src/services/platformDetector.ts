import { SocialPlatform } from '../types';

export interface PlatformMeta {
  name: string;
  iconName: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  gradient: string;
  placeholder: string;
}

export const PLATFORM_METAS: Record<SocialPlatform, PlatformMeta> = {
  instagram: {
    name: 'Instagram',
    iconName: 'Instagram',
    color: '#E1306C',
    badgeBg: 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600',
    badgeText: 'text-white',
    gradient: 'from-pink-500 to-purple-600',
    placeholder: 'https://instagram.com/p/... ou /reel/...',
  },
  tiktok: {
    name: 'TikTok',
    iconName: 'Video',
    color: '#00f2fe',
    badgeBg: 'bg-black text-white border border-cyan-500/40',
    badgeText: 'text-cyan-400',
    gradient: 'from-cyan-500 to-rose-500',
    placeholder: 'https://tiktok.com/@usuario/video/...',
  },
  twitter: {
    name: 'X (Twitter)',
    iconName: 'Twitter',
    color: '#1da1f2',
    badgeBg: 'bg-zinc-900 border border-zinc-700 text-white',
    badgeText: 'text-zinc-200',
    gradient: 'from-zinc-700 to-zinc-900',
    placeholder: 'https://x.com/usuario/status/...',
  },
  bluesky: {
    name: 'Bluesky',
    iconName: 'Cloud',
    color: '#1185fe',
    badgeBg: 'bg-sky-500 text-white',
    badgeText: 'text-white',
    gradient: 'from-sky-400 to-blue-600',
    placeholder: 'https://bsky.app/profile/.../post/...',
  },
  threads: {
    name: 'Threads',
    iconName: 'AtSign',
    color: '#ffffff',
    badgeBg: 'bg-neutral-800 text-white border border-neutral-700',
    badgeText: 'text-white',
    gradient: 'from-neutral-800 to-black',
    placeholder: 'https://threads.net/@usuario/post/...',
  },
  youtube: {
    name: 'YouTube',
    iconName: 'Youtube',
    color: '#ff0000',
    badgeBg: 'bg-red-600 text-white',
    badgeText: 'text-white',
    gradient: 'from-red-600 to-red-800',
    placeholder: 'https://youtube.com/watch?v=... ou shorts/...',
  },
  reddit: {
    name: 'Reddit',
    iconName: 'MessageSquare',
    color: '#ff4500',
    badgeBg: 'bg-orange-600 text-white',
    badgeText: 'text-white',
    gradient: 'from-orange-500 to-amber-600',
    placeholder: 'https://reddit.com/r/.../comments/...',
  },
  linkedin: {
    name: 'LinkedIn',
    iconName: 'Briefcase',
    color: '#0a66c2',
    badgeBg: 'bg-blue-700 text-white',
    badgeText: 'text-white',
    gradient: 'from-blue-600 to-blue-800',
    placeholder: 'https://linkedin.com/posts/...',
  },
  web: {
    name: 'Web Link',
    iconName: 'Globe',
    color: '#6366f1',
    badgeBg: 'bg-indigo-600 text-white',
    badgeText: 'text-white',
    gradient: 'from-indigo-500 to-indigo-700',
    placeholder: 'https://seusite.com/...',
  },
};

/**
 * Extracts URL from a raw string that might contain text and a link (common in share sheets)
 */
export function extractUrlFromText(text: string): { url: string; remainingText: string } | null {
  if (!text) return null;
  const urlRegex = /(https?:\/\/[^\s]+)/gi;
  const matches = text.match(urlRegex);
  if (matches && matches.length > 0) {
    const rawUrl = matches[0];
    const cleanUrl = rawUrl.replace(/[.,;!?)]+$/, '');
    const remainingText = text.replace(rawUrl, '').trim();
    return { url: cleanUrl, remainingText };
  }
  return null;
}

/**
 * Detects social platform from URL
 */
export function detectPlatform(url: string): SocialPlatform {
  if (!url) return 'web';
  const lower = url.toLowerCase();

  if (lower.includes('instagram.com') || lower.includes('instagr.am')) {
    return 'instagram';
  }
  if (lower.includes('tiktok.com')) {
    return 'tiktok';
  }
  if (lower.includes('twitter.com') || lower.includes('x.com')) {
    return 'twitter';
  }
  if (lower.includes('bsky.app') || lower.includes('bluesky.ms')) {
    return 'bluesky';
  }
  if (lower.includes('threads.net')) {
    return 'threads';
  }
  if (lower.includes('youtube.com') || lower.includes('youtu.be')) {
    return 'youtube';
  }
  if (lower.includes('reddit.com') || lower.includes('redd.it')) {
    return 'reddit';
  }
  if (lower.includes('linkedin.com')) {
    return 'linkedin';
  }

  return 'web';
}

/**
 * Generates intuitive title, author and tags based on platform and URL
 */
export function guessPostDetails(url: string, rawTitle?: string, rawText?: string) {
  const platform = detectPlatform(url);
  let title = rawTitle?.trim() || '';
  let author = '';
  let authorHandle = '';
  let previewImage = '';
  const tags: string[] = [];

  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    const pathname = parsed.pathname;

    switch (platform) {
      case 'instagram': {
        const isReel = pathname.includes('/reel/');
        authorHandle = pathname.split('/')[1] || 'usuario.insta';
        title = rawText || rawTitle || (isReel ? 'Reel no Instagram' : 'Publicação no Instagram');
        tags.push('Instagram', isReel ? 'Reel' : 'Post');
        previewImage = 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=600&auto=format&fit=crop&q=80';
        break;
      }
      case 'tiktok': {
        title = rawText || rawTitle || 'Vídeo no TikTok';
        tags.push('TikTok', 'Vídeo');
        previewImage = 'https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?w=600&auto=format&fit=crop&q=80';
        break;
      }
      case 'twitter': {
        const parts = pathname.split('/').filter(Boolean);
        authorHandle = parts[0] ? `@${parts[0]}` : '@x_user';
        title = rawText || rawTitle || `Post de ${authorHandle} no X`;
        tags.push('X', 'Thread');
        previewImage = 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=600&auto=format&fit=crop&q=80';
        break;
      }
      case 'bluesky': {
        title = rawText || rawTitle || 'Post no Bluesky';
        tags.push('Bluesky');
        previewImage = 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=600&auto=format&fit=crop&q=80';
        break;
      }
      case 'threads': {
        title = rawText || rawTitle || 'Post no Threads';
        tags.push('Threads');
        previewImage = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
        break;
      }
      case 'youtube': {
        const isShort = pathname.includes('/shorts/');
        title = rawTitle || (isShort ? 'YouTube Short' : 'Vídeo no YouTube');
        tags.push('YouTube', isShort ? 'Shorts' : 'Vídeo');
        previewImage = 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=600&auto=format&fit=crop&q=80';
        break;
      }
      default: {
        title = rawTitle || rawText || parsed.hostname.replace('www.', '');
        tags.push('Artigo');
        previewImage = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=600&auto=format&fit=crop&q=80';
        break;
      }
    }
  } catch {
    title = rawTitle || rawText || url;
  }

  return {
    platform,
    title: title || 'Link Salvo',
    author,
    authorHandle,
    previewImage,
    tags,
  };
}
