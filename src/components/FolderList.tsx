import React from 'react';
import { 
  Folder as FolderIcon, 
  Plus, 
  Edit2, 
  Trash2, 
  Layers,
  Utensils,
  GraduationCap,
  Sparkles,
  Laugh,
  Inbox,
  Heart,
  Video,
  ShoppingBag,
  Briefcase,
  Code
} from 'lucide-react';
import { Folder } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface FolderListProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (id: string | null) => void;
  onOpenCreateFolder: () => void;
  onOpenEditFolder: (folder: Folder) => void;
  onDeleteFolder: (folderId: string) => void;
  folderCounts: Record<string, number>;
  totalAllCount: number;
}

export const getFolderIconComponent = (iconName: string, className = 'w-4 h-4') => {
  switch (iconName?.toLowerCase()) {
    case 'inbox':
      return <Inbox className={className} />;
    case 'utensils':
      return <Utensils className={className} />;
    case 'graduationcap':
      return <GraduationCap className={className} />;
    case 'sparkles':
      return <Sparkles className={className} />;
    case 'laugh':
      return <Laugh className={className} />;
    case 'heart':
      return <Heart className={className} />;
    case 'video':
      return <Video className={className} />;
    case 'shoppingbag':
      return <ShoppingBag className={className} />;
    case 'briefcase':
      return <Briefcase className={className} />;
    case 'code':
      return <Code className={className} />;
    default:
      return <FolderIcon className={className} />;
  }
};

export const FolderList: React.FC<FolderListProps> = ({
  folders,
  selectedFolderId,
  onSelectFolder,
  onOpenCreateFolder,
  onOpenEditFolder,
  onDeleteFolder,
  folderCounts,
  totalAllCount,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>{t('thematic_folders')}</span>
        </h2>
        <button
          onClick={onOpenCreateFolder}
          className="flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition px-2 py-1 rounded-lg hover:bg-slate-800"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{t('new_folder')}</span>
        </button>
      </div>

      {/* Folder Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x">
        
        {/* All links pill */}
        <button
          onClick={() => onSelectFolder(null)}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border shrink-0 ${
            selectedFolderId === null
              ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800 hover:border-slate-700'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t('all_links')}</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
            selectedFolderId === null ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-800 text-slate-400'
          }`}>
            {totalAllCount}
          </span>
        </button>

        {/* User Folders */}
        {folders.map((folder) => {
          const isSelected = selectedFolderId === folder.id;
          const count = folderCounts[folder.id] || 0;

          return (
            <div
              key={folder.id}
              className={`group relative flex items-center rounded-xl border text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? 'bg-slate-800 text-white shadow-md'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800/80 hover:border-slate-700'
              }`}
              style={{
                borderColor: isSelected ? folder.color : undefined,
              }}
            >
              <button
                onClick={() => onSelectFolder(folder.id)}
                className="flex items-center gap-2 px-3.5 py-2 cursor-pointer"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="text-slate-200 group-hover:text-white flex items-center gap-1.5">
                  {getFolderIconComponent(folder.icon, 'w-3.5 h-3.5')}
                  {folder.name}
                </span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-400 group-hover:text-slate-300">
                  {count}
                </span>
              </button>

              {/* Action buttons (edit / delete) */}
              <div className="flex items-center pr-1.5 opacity-80 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenEditFolder(folder);
                  }}
                  title={t('edit_folder')}
                  className="p-1 rounded text-slate-400 hover:text-indigo-400 hover:bg-slate-700/60 transition"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                {!folder.isDefault && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(t('delete_folder_confirm', { name: folder.name }))) {
                        onDeleteFolder(folder.id);
                      }
                    }}
                    title="Excluir pasta"
                    className="p-1 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-700/60 transition"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

      </div>
    </div>
  );
};
