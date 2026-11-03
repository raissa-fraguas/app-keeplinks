import React, { useState } from 'react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Heart, 
  Trash2, 
  Share2, 
  Folder as FolderIcon,
  MessageCircle,
  Tag,
  Clock
} from 'lucide-react';
import { Folder, SavedLink } from '../types';
import { PLATFORM_METAS } from '../services/platformDetector';
import { useLanguage } from '../i18n/LanguageContext';

interface LinkCardProps {
  link: SavedLink;
  folders: Folder[];
  onToggleFavorite: (id: string) => void;
  onDeleteLink: (id: string) => void;
  onMoveFolder: (linkId: string, folderId: string) => void;
  onEditLink: (link: SavedLink) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  folders,
  onToggleFavorite,
  onDeleteLink,
  onMoveFolder,
  onEditLink,
}) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [showFolderMenu, setShowFolderMenu] = useState(false);

  const platformMeta = PLATFORM_METAS[link.platform] || PLATFORM_METAS.web;
  const currentFolder = folders.find((f) => f.id === link.folderId) || folders[0];

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: link.title,
          text: link.notes || link.title,
          url: link.url,
        });
      } catch {
        // user cancelled or unsupported
      }
    } else {
      handleCopy(e);
    }
  };

  const formatTimeAgo = (dateStr: string) => {
    try {
      const now = new Date();
      const past = new Date(dateStr);
      const diffMs = now.getTime() - past.getTime();
      const diffMin = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffMin < 2) return t('now_just');
      if (diffMin < 60) return t('minutes_ago', { m: diffMin });
      if (diffHours < 24) return t('hours_ago', { h: diffHours });
      if (diffDays === 1) return t('yesterday');
      return t('days_ago', { d: diffDays });
    } catch {
      return '';
    }
  };

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all duration-200 overflow-hidden shadow-lg hover:shadow-indigo-500/5">
      
      {/* Top Banner / Image */}
      <div className="relative w-full h-36 sm:h-40 bg-slate-950 overflow-hidden">
        {link.previewImage ? (
          <img
            src={link.previewImage}
            alt={link.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-95"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-indigo-950/60">
            <span className="text-4xl opacity-20">🔗</span>
          </div>
        )}

        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-black/30" />

        {/* Platform Badge on Top-Left */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-bold shadow-md tracking-wide ${platformMeta.badgeBg}`}
          >
            {platformMeta.name}
          </span>
          {link.authorHandle && (
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-black/60 backdrop-blur-md text-slate-200 font-mono">
              {link.authorHandle}
            </span>
          )}
        </div>

        {/* Favorite Heart Button on Top-Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(link.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition active:scale-90 ${
            link.isFavorite
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
              : 'bg-black/50 text-slate-300 hover:text-rose-400 hover:bg-black/70'
          }`}
          title={link.isFavorite ? t('remove_favorite') : t('favorite')}
        >
          <Heart className={`w-4 h-4 ${link.isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Current Folder Badge at Bottom-Left of Image */}
        <div className="absolute bottom-2.5 left-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/80"
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: currentFolder?.color || '#6366f1' }}
            />
            {currentFolder?.name || 'Geral'}
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        
        <div>
          {/* Post Title */}
          <h3
            onClick={() => onEditLink(link)}
            className="font-semibold text-sm sm:text-base text-slate-100 line-clamp-2 hover:text-indigo-400 transition cursor-pointer"
            title={link.title}
          >
            {link.title}
          </h3>

          {/* Notes if available */}
          {link.notes && (
            <p className="mt-2 text-xs text-slate-400 line-clamp-2 italic bg-slate-950/60 p-2 rounded-xl border border-slate-800/80">
              💬 "{link.notes}"
            </p>
          )}

          {/* Tags */}
          {link.tags && link.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-1 mt-2.5">
              {link.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {formatTimeAgo(link.savedAt)}
          </span>

          {/* Folder switcher popover trigger */}
          <div className="relative">
            <button
              onClick={() => setShowFolderMenu(!showFolderMenu)}
              className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium px-1.5 py-0.5 rounded hover:bg-slate-800 transition"
            >
              <FolderIcon className="w-3 h-3" />
              <span>{t('move_folder')}</span>
            </button>

            {showFolderMenu && (
              <div 
                className="absolute bottom-full right-0 mb-2 w-48 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl py-1 z-20 animate-in fade-in zoom-in-95 duration-150"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
                  {t('move_to')}
                </div>
                {folders.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onMoveFolder(link.id, f.id);
                      setShowFolderMenu(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition ${
                      f.id === link.folderId
                        ? 'bg-indigo-600/20 text-indigo-300 font-medium'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: f.color }} />
                    <span className="truncate">{f.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Card Action Buttons Bottom Bar */}
      <div className="px-3 py-2.5 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between gap-1">
        
        {/* Open original external link */}
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-sm transition"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>{t('open_post')}</span>
        </a>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-90"
          title={copied ? t('copied_link') : t('copy_url')}
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>

        {/* Share button */}
        <button
          onClick={handleNativeShare}
          className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition active:scale-90"
          title={t('share')}
        >
          <Share2 className="w-4 h-4" />
        </button>

        {/* Delete button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (confirm(t('delete_link_confirm'))) {
              onDeleteLink(link.id);
            }
          }}
          className="p-1.5 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition active:scale-90"
          title={t('delete_link')}
        >
          <Trash2 className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
