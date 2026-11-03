import { Folder, SavedLink, UserSubscription } from '../types';

const STORAGE_KEYS = {
  LINKS: 'linkkeep_links_v1',
  FOLDERS: 'linkkeep_folders_v1',
  SUBSCRIPTION: 'linkkeep_sub_v1',
};

const DEFAULT_FOLDERS: Folder[] = [
  {
    id: 'geral',
    name: 'Geral (Inbox)',
    icon: 'Inbox',
    color: '#6366f1',
    description: 'Links salvos recentemente aguardando triagem',
    createdAt: new Date().toISOString(),
    isDefault: true,
  },
  {
    id: 'receitas',
    name: 'Receitas & Culinária',
    icon: 'Utensils',
    color: '#f59e0b',
    description: 'Vídeos de pratos rápidos, sobremesas e dicas de cozinha',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'estudos',
    name: 'Estudos & Tech',
    icon: 'GraduationCap',
    color: '#3b82f6',
    description: 'Tutoriais de programação, IA, design e marketing',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lifestyle',
    name: 'Inspirações & Estilo',
    icon: 'Sparkles',
    color: '#ec4899',
    description: 'Ideias de decoração, moda, viagens e fotografia',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'memes',
    name: 'Humor & Memes',
    icon: 'Laugh',
    color: '#10b981',
    description: 'Vídeos engraçados e posts para descontrair',
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_SAMPLE_LINKS: SavedLink[] = [
  {
    id: 'sample-1',
    url: 'https://www.instagram.com/reel/C8qL95kvX7B/',
    title: 'Massa Cremosa com Queijo e Tomates Assados em 15min',
    platform: 'instagram',
    author: 'Chef Gabriel Rocha',
    authorHandle: '@cozinhado.gabriel',
    folderId: 'receitas',
    tags: ['Culinária', 'Jantar Rápido', 'Reels'],
    notes: 'Comprar tomatinho cereja e manjericão fresco no sábado!',
    previewImage: 'https://images.unsplash.com/photo-1621996346565-e3d5d6281297?w=600&auto=format&fit=crop&q=80',
    savedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    isFavorite: true,
    isArchived: false,
  },
  {
    id: 'sample-2',
    url: 'https://www.tiktok.com/@techtrends/video/7382910482919',
    title: '5 Ferramentas de Inteligência Artificial para aumentar 3x sua produtividade',
    platform: 'tiktok',
    author: 'Tech Trends BR',
    authorHandle: '@techtrends.br',
    folderId: 'estudos',
    tags: ['Produtividade', 'IA', 'Dicas'],
    notes: 'Testar a ferramenta 2 mencionada no vídeo para geração de resumos.',
    previewImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&auto=format&fit=crop&q=80',
    savedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    isFavorite: false,
    isArchived: false,
  },
  {
    id: 'sample-3',
    url: 'https://x.com/design_digest/status/18129482918471',
    title: 'Thread completa: Princípios essenciais de UI/UX em aplicativos mobile em 2026',
    platform: 'twitter',
    author: 'Design Digest',
    authorHandle: '@design_digest',
    folderId: 'estudos',
    tags: ['Design', 'Mobile', 'UI/UX'],
    notes: 'Ótima referência sobre espaçamentos e acessibilidade em telas pequenas.',
    previewImage: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=600&auto=format&fit=crop&q=80',
    savedAt: new Date(Date.now() - 1000 * 60 * 360).toISOString(),
    isFavorite: true,
    isArchived: false,
  },
  {
    id: 'sample-4',
    url: 'https://threads.net/@viajantes_br/post/C9W483k9',
    title: 'Roteiro de 4 dias no Jalapão gastando pouco: onde ficar e melhores fervedouros',
    platform: 'threads',
    author: 'Viajantes BR',
    authorHandle: '@viajantes_br',
    folderId: 'lifestyle',
    tags: ['Viagens', 'Brasil', 'Ecoturismo'],
    notes: 'Guardar para as férias de julho com a família.',
    previewImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    savedAt: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    isFavorite: false,
    isArchived: false,
  },
  {
    id: 'sample-5',
    url: 'https://bsky.app/profile/devbr.bsky.social/post/3kqj2m9s81a',
    title: 'Novidades do ecossistema TypeScript e React 19 que você precisa conhecer hoje',
    platform: 'bluesky',
    author: 'Comunidade DevBR',
    authorHandle: '@devbr.bsky.social',
    folderId: 'estudos',
    tags: ['WebDev', 'TypeScript', 'Frontend'],
    notes: 'Ler a documentação oficial sobre os novos Server Actions e hooks.',
    previewImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
    savedAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    isFavorite: false,
    isArchived: false,
  },
];

function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

export const StorageService = {
  // --- FOLDERS ---
  getFolders(): Folder[] {
    const raw = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(DEFAULT_FOLDERS));
      return DEFAULT_FOLDERS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_FOLDERS;
    }
  },

  saveFolder(folder: Omit<Folder, 'id' | 'createdAt'> & { id?: string }): Folder {
    const folders = this.getFolders();
    if (folder.id) {
      // Edit
      const index = folders.findIndex((f) => f.id === folder.id);
      if (index !== -1) {
        folders[index] = {
          ...folders[index],
          name: folder.name,
          icon: folder.icon,
          color: folder.color,
          description: folder.description,
        };
        localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
        return folders[index];
      }
    }

    // Create new
    const newFolder: Folder = {
      id: `folder-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: folder.name,
      icon: folder.icon || 'Folder',
      color: folder.color || '#6366f1',
      description: folder.description || '',
      createdAt: new Date().toISOString(),
    };
    folders.push(newFolder);
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
    return newFolder;
  },

  deleteFolder(folderId: string): boolean {
    const folders = this.getFolders();
    const folderToDelete = folders.find((f) => f.id === folderId);
    if (!folderToDelete || folderToDelete.isDefault) {
      return false; // Cannot delete default folder
    }

    const filtered = folders.filter((f) => f.id !== folderId);
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(filtered));

    // Move orphan links to 'geral'
    const links = this.getLinks();
    let updated = false;
    const remapped = links.map((l) => {
      if (l.folderId === folderId) {
        updated = true;
        return { ...l, folderId: 'geral' };
      }
      return l;
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(remapped));
    }
    return true;
  },

  // --- SUBSCRIPTION & LIMITS ---
  getSubscription(): UserSubscription {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTION);
    const today = getTodayString();

    let sub: UserSubscription = {
      plan: 'free',
      dailyLimit: 5,
      todaySavedCount: 0,
      lastResetDate: today,
      price: 'R$ 4,99/mês',
    };

    if (raw) {
      try {
        sub = JSON.parse(raw);
        // Ensure free users have the updated dailyLimit of 5
        if (sub.plan === 'free' && sub.dailyLimit !== 5) {
          sub.dailyLimit = 5;
          localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
        }
      } catch {
        // fallback to default
      }
    }

    // Reset daily count if date has changed
    if (sub.lastResetDate !== today) {
      sub.todaySavedCount = 0;
      sub.lastResetDate = today;
      localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
    }

    return sub;
  },

  updateSubscription(sub: UserSubscription): void {
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, JSON.stringify(sub));
  },

  upgradeToPro(paymentMethod: 'pix' | 'credit_card'): UserSubscription {
    const today = getTodayString();
    const sub: UserSubscription = {
      plan: 'pro',
      dailyLimit: Infinity,
      todaySavedCount: this.getSubscription().todaySavedCount,
      lastResetDate: today,
      price: 'R$ 4,99/mês',
      subscribedAt: new Date().toISOString(),
      paymentMethod,
    };
    this.updateSubscription(sub);
    return sub;
  },

  downgradeToFree(): UserSubscription {
    const today = getTodayString();
    const current = this.getSubscription();
    const sub: UserSubscription = {
      plan: 'free',
      dailyLimit: 5,
      todaySavedCount: current.todaySavedCount,
      lastResetDate: today,
      price: 'R$ 4,99/mês',
    };
    this.updateSubscription(sub);
    return sub;
  },

  resetDailyCount(): UserSubscription {
    const sub = this.getSubscription();
    sub.todaySavedCount = 0;
    this.updateSubscription(sub);
    return sub;
  },

  simulateIncrementDailyCount(amount: number): UserSubscription {
    const sub = this.getSubscription();
    sub.todaySavedCount = Math.max(0, sub.todaySavedCount + amount);
    this.updateSubscription(sub);
    return sub;
  },

  // --- LINKS ---
  getLinks(): SavedLink[] {
    const raw = localStorage.getItem(STORAGE_KEYS.LINKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(INITIAL_SAMPLE_LINKS));
      return INITIAL_SAMPLE_LINKS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SAMPLE_LINKS;
    }
  },

  saveLink(
    linkData: Omit<SavedLink, 'id' | 'savedAt'> & { id?: string }
  ): { success: boolean; link?: SavedLink; error?: string; limitReached?: boolean } {
    const sub = this.getSubscription();

    // Check free plan limit (5 links per day) for NEW links only
    if (!linkData.id && sub.plan === 'free' && sub.todaySavedCount >= sub.dailyLimit) {
      return {
        success: false,
        limitReached: true,
        error: `Você atingiu o limite de ${sub.dailyLimit} links diários do Plano Grátis. Faça upgrade para o Pro por R$ 4,99/mês para links ilimitados!`,
      };
    }

    const links = this.getLinks();

    if (linkData.id) {
      // Update existing link
      const idx = links.findIndex((l) => l.id === linkData.id);
      if (idx !== -1) {
        links[idx] = {
          ...links[idx],
          ...linkData,
        };
        localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
        return { success: true, link: links[idx] };
      }
    }

    // Create new link
    const newLink: SavedLink = {
      id: `link-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      url: linkData.url,
      title: linkData.title,
      platform: linkData.platform,
      author: linkData.author,
      authorHandle: linkData.authorHandle,
      authorAvatar: linkData.authorAvatar,
      folderId: linkData.folderId || 'geral',
      tags: linkData.tags || [],
      notes: linkData.notes || '',
      previewImage: linkData.previewImage,
      savedAt: new Date().toISOString(),
      isFavorite: linkData.isFavorite || false,
      isArchived: linkData.isArchived || false,
    };

    links.unshift(newLink);
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));

    // Increment daily count
    sub.todaySavedCount += 1;
    this.updateSubscription(sub);

    return { success: true, link: newLink };
  },

  deleteLink(id: string): void {
    const links = this.getLinks().filter((l) => l.id !== id);
    localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
  },

  toggleFavorite(id: string): SavedLink | null {
    const links = this.getLinks();
    const link = links.find((l) => l.id === id);
    if (link) {
      link.isFavorite = !link.isFavorite;
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
      return link;
    }
    return null;
  },

  moveLinkToFolder(linkId: string, folderId: string): void {
    const links = this.getLinks();
    const link = links.find((l) => l.id === linkId);
    if (link) {
      link.folderId = folderId;
      localStorage.setItem(STORAGE_KEYS.LINKS, JSON.stringify(links));
    }
  },

  // Export all links as JSON or CSV
  exportData(): { json: string; csv: string } {
    const links = this.getLinks();
    const folders = this.getFolders();
    const sub = this.getSubscription();

    const data = {
      app: 'LinkKeep',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      subscription: sub,
      folders,
      links,
    };

    const json = JSON.stringify(data, null, 2);

    // CSV representation
    const csvHeaders = 'ID,Titulo,URL,Plataforma,Pasta,Data,Favorito,Notas\n';
    const csvRows = links
      .map((l) => {
        const folder = folders.find((f) => f.id === l.folderId)?.name || 'Geral';
        const cleanTitle = `"${(l.title || '').replace(/"/g, '""')}"`;
        const cleanNotes = `"${(l.notes || '').replace(/"/g, '""')}"`;
        return `${l.id},${cleanTitle},"${l.url}",${l.platform},"${folder}",${l.savedAt},${l.isFavorite},${cleanNotes}`;
      })
      .join('\n');

    return { json, csv: csvHeaders + csvRows };
  },
};
