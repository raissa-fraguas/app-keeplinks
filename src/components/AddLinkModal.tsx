import React, { useState, useEffect } from 'react';
import { 
  X, 
  Link as LinkIcon, 
  Clipboard, 
  Folder as FolderIcon, 
  Tag, 
  FileText, 
  Check, 
  Crown, 
  AlertCircle,
  Plus
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Folder, SavedLink, SocialPlatform, UserSubscription } from '../types';
import { detectPlatform, guessPostDetails, PLATFORM_METAS } from '../services/platformDetector';
import { useLanguage } from '../i18n/LanguageContext';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (linkData: Omit<SavedLink, 'id' | 'savedAt'> & { id?: string }) => { success: boolean; error?: string; limitReached?: boolean };
  folders: Folder[];
  initialData?: Partial<SavedLink>;
  subscription: UserSubscription;
  onOpenSubscriptionModal: () => void;
  onOpenCreateFolder: () => void;
}

export const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen,
  onClose,
  onSave,
  folders,
  initialData,
  subscription,
  onOpenSubscriptionModal,
  onOpenCreateFolder,
}) => {
  const { t } = useLanguage();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState<SocialPlatform>('web');
  const [folderId, setFolderId] = useState('geral');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>('');
  const [authorHandle, setAuthorHandle] = useState<string | undefined>('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLimitReached, setIsLimitReached] = useState(false);

  const isEditing = Boolean(initialData?.id);
  const isPro = subscription.plan === 'pro';
  const remaining = Math.max(0, subscription.dailyLimit - subscription.todaySavedCount);
  const cannotSaveNew = !isEditing && !isPro && remaining <= 0;

  useEffect(() => {
    if (initialData) {
      setUrl(initialData.url || '');
      setTitle(initialData.title || '');
      setPlatform(initialData.platform || (initialData.url ? detectPlatform(initialData.url) : 'web'));
      setFolderId(initialData.folderId || 'geral');
      setNotes(initialData.notes || '');
      setTags(initialData.tags || []);
      setPreviewImage(initialData.previewImage);
      setAuthorHandle(initialData.authorHandle);
    } else {
      setUrl('');
      setTitle('');
      setPlatform('web');
      setFolderId(folders[0]?.id || 'geral');
      setNotes('');
      setTags([]);
      setPreviewImage(undefined);
      setAuthorHandle(undefined);
    }
    setErrorMessage('');
    setIsLimitReached(cannotSaveNew);
  }, [initialData, isOpen, cannotSaveNew, folders]);

  // When URL changes, automatically detect platform and guess details
  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    setErrorMessage('');
    if (newUrl.trim().length > 4) {
      const detected = detectPlatform(newUrl);
      setPlatform(detected);

      // If user hasn't typed a title yet, fill with smart guess
      if (!title || title === 'Link Salvo') {
        const guess = guessPostDetails(newUrl);
        setTitle(guess.title);
        if (!tags.length && guess.tags.length) {
          setTags(guess.tags);
        }
        if (!previewImage && guess.previewImage) {
          setPreviewImage(guess.previewImage);
        }
        if (!authorHandle && guess.authorHandle) {
          setAuthorHandle(guess.authorHandle);
        }
      }
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleUrlChange(text.trim());
      }
    } catch {
      setErrorMessage('Permissão para ler a área de transferência não concedida.');
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setErrorMessage('Por favor, informe uma URL válida.');
      return;
    }

    const result = onSave({
      id: initialData?.id,
      url: url.trim(),
      title: title.trim() || 'Post Salvo',
      platform,
      folderId,
      notes: notes.trim(),
      tags,
      previewImage,
      authorHandle,
      isFavorite: initialData?.isFavorite || false,
      isArchived: initialData?.isArchived || false,
    });

    if (result.success) {
      // Confetti burst for rewarding user action!
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
      onClose();
    } else {
      if (result.limitReached) {
        setIsLimitReached(true);
      }
      setErrorMessage(result.error || 'Erro ao salvar o link.');
    }
  };

  if (!isOpen) return null;

  const currentMeta = PLATFORM_METAS[platform] || PLATFORM_METAS.web;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-600/20 text-indigo-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? t('edit_link_title') : t('add_link_title')}
              </h2>
              <p className="text-xs text-slate-400">
                {t('add_link_desc')}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free limit banner warning if close to or at limit */}
        {!isPro && !isEditing && (
          <div className={`mt-4 p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
            cannotSaveNew
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              : 'bg-indigo-950/30 border-indigo-500/30 text-indigo-300'
          }`}>
            <div className="flex items-center gap-2">
              <AlertCircle className={`w-4 h-4 shrink-0 ${cannotSaveNew ? 'text-rose-400' : 'text-indigo-400'}`} />
              <span>
                {cannotSaveNew ? (
                  <strong>{t('limit_reached_title', { limit: subscription.dailyLimit })}</strong>
                ) : (
                  <span>{t('limit_available_title', { remaining, limit: subscription.dailyLimit })}</span>
                )}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSubscriptionModal();
              }}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold shrink-0 transition"
            >
              {t('subscribe_pro_short')}
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* URL Input with Paste button */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('url_label')}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                required
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder={t('url_placeholder')}
                className="w-full pl-3.5 pr-20 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition"
              />
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="absolute right-1.5 top-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:text-white flex items-center gap-1 transition"
                title={t('paste_btn')}
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>{t('paste_btn')}</span>
              </button>
            </div>
          </div>

          {/* Detected Platform Indicator */}
          {url && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">{t('platform_detected')}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${currentMeta.badgeBg}`}>
                  {currentMeta.name}
                </span>
              </div>
              {authorHandle && (
                <span className="text-xs font-mono text-slate-400">{authorHandle}</span>
              )}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('title_label')}
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('title_placeholder')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition"
            />
          </div>

          {/* Folder Selector */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <FolderIcon className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t('folder_label')}</span>
              </label>
              <button
                type="button"
                onClick={onOpenCreateFolder}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>{t('new_folder')}</span>
              </button>
            </div>
            <select
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white outline-none transition cursor-pointer"
            >
              {folders.map((f) => (
                <option key={f.id} value={f.id} className="bg-slate-900 text-white">
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          {/* Personal Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('personal_notes_label')}</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t('notes_placeholder')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none transition resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t('tags_label')}</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder={t('tag_input_placeholder')}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 border border-slate-700 transition"
              >
                {t('add_tag_btn')}
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-indigo-950 text-indigo-300 border border-indigo-500/30"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-rose-400 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Error notice */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              {t('cancel')}
            </button>
            
            {cannotSaveNew ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenSubscriptionModal();
                }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-amber-400 to-yellow-400 text-slate-950 hover:from-amber-300 hover:to-yellow-300 transition shadow-lg shadow-amber-500/20"
              >
                <Crown className="w-4 h-4 fill-slate-950" />
                <span>{t('subscribe_to_save')}</span>
              </button>
            ) : (
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition active:scale-95 shadow-md shadow-indigo-600/30 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>{isEditing ? t('save_changes') : t('save_repository')}</span>
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};
