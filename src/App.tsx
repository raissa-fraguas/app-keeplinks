/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Heart, 
  Download, 
  Plus, 
  Folder as FolderIcon,
  Sparkles,
  Share2,
  Store,
  Crown,
  Layers,
  Inbox
} from 'lucide-react';
import { Folder, SavedLink, SocialPlatform, UserSubscription, ShareDataInput } from './types';
import { StorageService } from './services/storage';
import { PLATFORM_METAS } from './services/platformDetector';
import { useShareTarget } from './hooks/useShareTarget';
import { useLanguage } from './i18n/LanguageContext';

// Components
import { Header } from './components/Header';
import { StatsBanner } from './components/StatsBanner';
import { FolderList } from './components/FolderList';
import { LinkCard } from './components/LinkCard';
import { AddLinkModal } from './components/AddLinkModal';
import { FolderModal } from './components/FolderModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { StorePublishGuideModal } from './components/StorePublishGuideModal';
import { ShareSimulatorModal } from './components/ShareSimulatorModal';

export default function App() {
  const { t } = useLanguage();

  // State
  const [links, setLinks] = useState<SavedLink[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [subscription, setSubscription] = useState<UserSubscription>(StorageService.getSubscription());

  // Filter & Search
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'title'>('recent');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SavedLink | null>(null);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolder, setEditingFolder] = useState<Folder | null>(null);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isStoreGuideOpen, setIsStoreGuideOpen] = useState(false);
  const [isShareSimOpen, setIsShareSimOpen] = useState(false);

  // Load initial data
  useEffect(() => {
    setLinks(StorageService.getLinks());
    setFolders(StorageService.getFolders());
    setSubscription(StorageService.getSubscription());
  }, []);

  // Handle incoming shared links via Web Share Target (Android/iOS native share sheets)
  const handleIncomingShare = useCallback((data: ShareDataInput) => {
    setEditingLink({
      id: '',
      url: data.url,
      title: data.title || '',
      platform: data.platform || 'web',
      folderId: selectedFolderId || 'geral',
      tags: [],
      notes: data.text || '',
      savedAt: new Date().toISOString(),
      isFavorite: false,
      isArchived: false,
    });
    setIsAddModalOpen(true);
  }, [selectedFolderId]);

  useShareTarget(handleIncomingShare);

  // Filtered and sorted links
  const filteredLinks = useMemo(() => {
    let result = [...links];

    // Filter by folder
    if (selectedFolderId !== null) {
      result = result.filter((l) => l.folderId === selectedFolderId);
    }

    // Filter by platform
    if (selectedPlatform !== 'all') {
      result = result.filter((l) => l.platform === selectedPlatform);
    }

    // Filter by favorites
    if (onlyFavorites) {
      result = result.filter((l) => l.isFavorite);
    }

    // Filter by search text
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          l.notes.toLowerCase().includes(q) ||
          (l.author && l.author.toLowerCase().includes(q)) ||
          (l.authorHandle && l.authorHandle.toLowerCase().includes(q)) ||
          (l.tags && l.tags.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime();
      }
      return a.title.localeCompare(b.title);
    });

    return result;
  }, [links, selectedFolderId, selectedPlatform, onlyFavorites, searchQuery, sortBy]);

  // Folder counts
  const folderCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    links.forEach((l) => {
      counts[l.folderId] = (counts[l.folderId] || 0) + 1;
    });
    return counts;
  }, [links]);

  // Handlers for Link operations
  const handleSaveLink = (linkData: Omit<SavedLink, 'id' | 'savedAt'> & { id?: string }) => {
    const res = StorageService.saveLink(linkData);
    if (res.success) {
      setLinks(StorageService.getLinks());
      setSubscription(StorageService.getSubscription());
    }
    return res;
  };

  const handleDeleteLink = (id: string) => {
    StorageService.deleteLink(id);
    setLinks(StorageService.getLinks());
  };

  const handleToggleFavorite = (id: string) => {
    StorageService.toggleFavorite(id);
    setLinks(StorageService.getLinks());
  };

  const handleMoveFolder = (linkId: string, folderId: string) => {
    StorageService.moveLinkToFolder(linkId, folderId);
    setLinks(StorageService.getLinks());
  };

  // Folder operations
  const handleSaveFolder = (folderData: Omit<Folder, 'id' | 'createdAt'> & { id?: string }) => {
    StorageService.saveFolder(folderData);
    setFolders(StorageService.getFolders());
  };

  const handleDeleteFolder = (folderId: string) => {
    StorageService.deleteFolder(folderId);
    setFolders(StorageService.getFolders());
    setLinks(StorageService.getLinks());
    if (selectedFolderId === folderId) {
      setSelectedFolderId(null);
    }
  };

  // Subscription operations
  const handleUpgrade = (method: 'pix' | 'credit_card') => {
    const sub = StorageService.upgradeToPro(method);
    setSubscription(sub);
  };

  const handleDowngrade = () => {
    const sub = StorageService.downgradeToFree();
    setSubscription(sub);
  };

  const handleResetDailyCount = () => {
    const sub = StorageService.resetDailyCount();
    setSubscription(sub);
  };

  const handleSimulateAddLink = () => {
    const sub = StorageService.simulateIncrementDailyCount(1);
    setSubscription(sub);
  };

  const handleTogglePlan = () => {
    if (subscription.plan === 'pro') {
      handleDowngrade();
    } else {
      handleUpgrade('pix');
    }
  };

  // Export data
  const handleExportData = () => {
    const { json } = StorageService.exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkkeep-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const availablePlatforms: { id: SocialPlatform | 'all'; name: string }[] = [
    { id: 'all', name: t('all_networks') },
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' },
    { id: 'twitter', name: 'X / Twitter' },
    { id: 'threads', name: 'Threads' },
    { id: 'bluesky', name: 'Bluesky' },
    { id: 'youtube', name: 'YouTube' },
    { id: 'reddit', name: 'Reddit' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'web', name: 'Web' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-20 sm:pb-12">
      
      {/* Top Header */}
      <Header
        subscription={subscription}
        onOpenAddModal={() => {
          setEditingLink(null);
          setIsAddModalOpen(true);
        }}
        onOpenSubscriptionModal={() => setIsSubModalOpen(true)}
        onOpenStoreGuide={() => setIsStoreGuideOpen(true)}
        onOpenShareSimulator={() => setIsShareSimOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Daily limits & metrics banner */}
        <StatsBanner
          subscription={subscription}
          totalLinksCount={links.length}
          totalFoldersCount={folders.length}
          onOpenSubscriptionModal={() => setIsSubModalOpen(true)}
          onSimulateAddLink={handleSimulateAddLink}
          onResetDailyCount={handleResetDailyCount}
          onTogglePlan={handleTogglePlan}
        />

        {/* Thematic Folders Selector Bar */}
        <FolderList
          folders={folders}
          selectedFolderId={selectedFolderId}
          onSelectFolder={setSelectedFolderId}
          onOpenCreateFolder={() => {
            setEditingFolder(null);
            setIsFolderModalOpen(true);
          }}
          onOpenEditFolder={(folder) => {
            setEditingFolder(folder);
            setIsFolderModalOpen(true);
          }}
          onDeleteFolder={handleDeleteFolder}
          folderCounts={folderCounts}
          totalAllCount={links.length}
        />

        {/* Search, Filter Pills & View Controls */}
        <div className="space-y-3">
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('search_placeholder')}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-xs sm:text-sm text-white placeholder-slate-500 outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  {t('clear')}
                </button>
              )}
            </div>

            {/* Filter controls right */}
            <div className="flex items-center gap-2 self-end sm:self-auto">
              
              {/* Favorites toggle */}
              <button
                onClick={() => setOnlyFavorites(!onlyFavorites)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                  onlyFavorites
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
                title={t('favorites_filter')}
              >
                <Heart className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-rose-400 text-rose-400' : ''}`} />
                <span className="hidden sm:inline">{t('favorites_filter')}</span>
              </button>

              {/* Sort Order */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 outline-none cursor-pointer"
              >
                <option value="recent">{t('sort_recent')}</option>
                <option value="oldest">{t('sort_oldest')}</option>
                <option value="title">{t('sort_title')}</option>
              </select>

              {/* Grid / List View Toggle */}
              <div className="flex items-center p-1 bg-slate-900 rounded-xl border border-slate-800">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title={t('grid_view')}
                >
                  <Grid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition ${
                    viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                  title={t('list_view')}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Export backup */}
              <button
                onClick={handleExportData}
                className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 transition"
                title={t('export_backup')}
              >
                <Download className="w-4 h-4" />
              </button>

            </div>

          </div>

          {/* Social Platforms Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {availablePlatforms.map((p) => {
              const isSelected = selectedPlatform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedPlatform(p.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                    isSelected
                      ? 'bg-slate-800 text-white border-indigo-500 font-semibold shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

        </div>

        {/* Links Count Header */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-2">
          <span>
            {t('showing_links', { count: filteredLinks.length, plural: t('links_word') })}
            {selectedFolderId && ` ${t('in_folder', { folder: folders.find((f) => f.id === selectedFolderId)?.name || '' })}`}
            {selectedPlatform !== 'all' && ` (${PLATFORM_METAS[selectedPlatform]?.name || selectedPlatform})`}
          </span>

          {(selectedFolderId !== null || selectedPlatform !== 'all' || onlyFavorites || searchQuery) && (
            <button
              onClick={() => {
                setSelectedFolderId(null);
                setSelectedPlatform('all');
                setOnlyFavorites(false);
                setSearchQuery('');
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer"
            >
              {t('reset_filters')}
            </button>
          )}
        </div>

        {/* Links Grid / List Feed */}
        {filteredLinks.length > 0 ? (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'flex flex-col space-y-4 max-w-4xl'
            }
          >
            {filteredLinks.map((link) => (
              <LinkCard
                key={link.id}
                link={link}
                folders={folders}
                onToggleFavorite={handleToggleFavorite}
                onDeleteLink={handleDeleteLink}
                onMoveFolder={handleMoveFolder}
                onEditLink={(l) => {
                  setEditingLink(l);
                  setIsAddModalOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="py-16 text-center rounded-3xl bg-slate-900/40 border border-slate-800/80 p-8 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 text-indigo-400 mx-auto flex items-center justify-center border border-indigo-500/20">
              <Inbox className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-bold text-white">{t('empty_title')}</h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {searchQuery || selectedFolderId || selectedPlatform !== 'all' || onlyFavorites
                  ? t('empty_desc_filter')
                  : t('empty_desc_clean')}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setEditingLink(null);
                  setIsAddModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('save_link_now')}</span>
              </button>
              <button
                onClick={() => setIsShareSimOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>{t('simulate_share_btn')}</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Floating Action Button (Mobile) */}
      <div className="fixed bottom-6 right-6 z-20 sm:hidden">
        <button
          onClick={() => {
            setEditingLink(null);
            setIsAddModalOpen(true);
          }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-600/40 flex items-center justify-center active:scale-90 transition cursor-pointer"
          aria-label={t('save_link')}
        >
          <Plus className="w-7 h-7 stroke-[2.5]" />
        </button>
      </div>

      {/* Modals */}
      <AddLinkModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingLink(null);
        }}
        onSave={handleSaveLink}
        folders={folders}
        initialData={editingLink || undefined}
        subscription={subscription}
        onOpenSubscriptionModal={() => setIsSubModalOpen(true)}
        onOpenCreateFolder={() => {
          setEditingFolder(null);
          setIsFolderModalOpen(true);
        }}
      />

      <FolderModal
        isOpen={isFolderModalOpen}
        onClose={() => {
          setIsFolderModalOpen(false);
          setEditingFolder(null);
        }}
        onSave={handleSaveFolder}
        initialFolder={editingFolder}
      />

      <SubscriptionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        subscription={subscription}
        onUpgrade={handleUpgrade}
        onDowngrade={handleDowngrade}
      />

      <StorePublishGuideModal
        isOpen={isStoreGuideOpen}
        onClose={() => setIsStoreGuideOpen(false)}
      />

      <ShareSimulatorModal
        isOpen={isShareSimOpen}
        onClose={() => setIsShareSimOpen(false)}
        onSimulateShare={handleIncomingShare}
      />

    </div>
  );
}
