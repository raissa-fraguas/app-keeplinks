import React, { useState, useEffect } from 'react';
import { X, Folder as FolderIcon, Check } from 'lucide-react';
import { Folder } from '../types';
import { getFolderIconComponent } from './FolderList';
import { useLanguage } from '../i18n/LanguageContext';

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (folder: Omit<Folder, 'id' | 'createdAt'> & { id?: string }) => void;
  initialFolder?: Folder | null;
}

const COLOR_PALETTE = [
  '#6366f1', // Indigo
  '#3b82f6', // Blue
  '#06b6d4', // Cyan
  '#10b981', // Emerald
  '#84cc16', // Lime
  '#f59e0b', // Amber
  '#f97316', // Orange
  '#ef4444', // Red
  '#ec4899', // Pink
  '#a855f7', // Purple
  '#8b5cf6', // Violet
  '#64748b', // Slate
];

const ICON_OPTIONS = [
  { name: 'Folder', label: 'Pasta Padrão' },
  { name: 'Inbox', label: 'Inbox / Entrada' },
  { name: 'Utensils', label: 'Receitas / Gastronomia' },
  { name: 'GraduationCap', label: 'Estudos / Cursos' },
  { name: 'Sparkles', label: 'Inspiração / Ideias' },
  { name: 'Laugh', label: 'Humor / Memes' },
  { name: 'Heart', label: 'Favoritos / Amor' },
  { name: 'Video', label: 'Vídeos / Filmes' },
  { name: 'ShoppingBag', label: 'Compras / Desejos' },
  { name: 'Briefcase', label: 'Trabalho / Negócios' },
  { name: 'Code', label: 'Tecnologia / Dev' },
];

export const FolderModal: React.FC<FolderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialFolder,
}) => {
  const { t } = useLanguage();
  const [name, setName] = useState('');
  const [color, setColor] = useState('#6366f1');
  const [icon, setIcon] = useState('Folder');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const isEditing = Boolean(initialFolder?.id);

  useEffect(() => {
    if (initialFolder) {
      setName(initialFolder.name);
      setColor(initialFolder.color || '#6366f1');
      setIcon(initialFolder.icon || 'Folder');
      setDescription(initialFolder.description || '');
    } else {
      setName('');
      setColor('#6366f1');
      setIcon('Folder');
      setDescription('');
    }
    setError('');
  }, [initialFolder, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(t('folder_name_required'));
      return;
    }

    onSave({
      id: initialFolder?.id,
      name: name.trim(),
      color,
      icon,
      description: description.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div 
              className="p-2 rounded-xl text-white shadow-md"
              style={{ backgroundColor: color }}
            >
              {getFolderIconComponent(icon, 'w-5 h-5')}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditing ? t('edit_folder') : t('create_folder_title')}
              </h2>
              <p className="text-xs text-slate-400">{t('folder_subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('folder_name_label')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('folder_name_placeholder')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              {t('accent_color')}
            </label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`h-8 rounded-xl transition flex items-center justify-center ${
                    color === c ? 'ring-2 ring-white scale-110 shadow-lg' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-4 h-4 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              {t('icon_label')}
            </label>
            <div className="grid grid-cols-6 gap-2">
              {ICON_OPTIONS.map((item) => {
                const isSelected = icon === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setIcon(item.name)}
                    className={`h-10 rounded-xl border flex items-center justify-center transition ${
                      isSelected
                        ? 'bg-indigo-600 border-indigo-500 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                    title={item.label}
                  >
                    {getFolderIconComponent(item.name, 'w-4 h-4')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              {t('desc_label')}
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t('desc_placeholder')}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm text-white placeholder-slate-500 outline-none"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
            >
              {t('cancel')}
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition active:scale-95 shadow-md shadow-indigo-600/30"
            >
              <Check className="w-4 h-4" />
              <span>{isEditing ? t('save_folder_btn') : t('create_folder_btn')}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
