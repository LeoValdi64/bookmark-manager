'use client';

import { useState } from 'react';
import {
  FolderOpen,
  Folder as FolderIcon,
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  X,
  Check,
  Bookmark,
} from 'lucide-react';
import type { Folder, Bookmark as BookmarkType } from '@/types';
import { cn } from '@/lib/utils';

interface FolderSidebarProps {
  folders: Folder[];
  bookmarks: BookmarkType[];
  selectedFolderId: string | null | 'all';
  onSelectFolder: (folderId: string | null | 'all') => void;
  onAddFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => void;
  onUpdateFolder: (id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>) => void;
  onDeleteFolder: (id: string) => void;
}

const FOLDER_COLORS = [
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#14b8a6', // Teal
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
];

export function FolderSidebar({
  folders,
  bookmarks,
  selectedFolderId,
  onSelectFolder,
  onAddFolder,
  onUpdateFolder,
  onDeleteFolder,
}: FolderSidebarProps) {
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder({
        name: newFolderName.trim(),
        parentId: null,
        color: newFolderColor,
      });
      setNewFolderName('');
      setNewFolderColor(FOLDER_COLORS[0]);
      setIsAddingFolder(false);
    }
  };

  const handleStartEdit = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setEditingName(folder.name);
    setMenuOpenId(null);
  };

  const handleSaveEdit = (id: string) => {
    if (editingName.trim()) {
      onUpdateFolder(id, { name: editingName.trim() });
    }
    setEditingFolderId(null);
    setEditingName('');
  };

  const handleDeleteFolder = (id: string) => {
    onDeleteFolder(id);
    setMenuOpenId(null);
    if (selectedFolderId === id) {
      onSelectFolder('all');
    }
  };

  const getBookmarkCount = (folderId: string | null) => {
    return bookmarks.filter((b) => b.folderId === folderId).length;
  };

  const uncategorizedCount = getBookmarkCount(null);
  const totalCount = bookmarks.length;

  return (
    <aside className="w-64 h-full bg-card border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 text-foreground">
          <Bookmark className="w-5 h-5 text-accent" />
          <h1 className="font-semibold">Bookmarks</h1>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <button
          onClick={() => onSelectFolder('all')}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
            selectedFolderId === 'all'
              ? 'bg-accent/10 text-accent'
              : 'text-foreground hover:bg-card-hover'
          )}
        >
          <FolderOpen className="w-4 h-4" />
          <span className="flex-1 text-left">All Bookmarks</span>
          <span className="text-xs text-muted">{totalCount}</span>
        </button>

        <button
          onClick={() => onSelectFolder(null)}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
            selectedFolderId === null
              ? 'bg-accent/10 text-accent'
              : 'text-foreground hover:bg-card-hover'
          )}
        >
          <FolderIcon className="w-4 h-4" />
          <span className="flex-1 text-left">Uncategorized</span>
          <span className="text-xs text-muted">{uncategorizedCount}</span>
        </button>

        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between px-3">
            <span className="text-xs font-medium text-muted uppercase tracking-wider">
              Folders
            </span>
            <button
              onClick={() => setIsAddingFolder(true)}
              className="p-1 rounded text-muted hover:text-foreground hover:bg-card-hover transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {isAddingFolder && (
          <div className="px-3 py-2 space-y-2 bg-card-hover rounded-lg">
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder name"
              className="w-full px-3 py-2 text-sm rounded-md"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAddFolder();
                if (e.key === 'Escape') setIsAddingFolder(false);
              }}
            />
            <div className="flex gap-1 flex-wrap">
              {FOLDER_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewFolderColor(color)}
                  className={cn(
                    'w-5 h-5 rounded-full transition-transform',
                    newFolderColor === color && 'ring-2 ring-white ring-offset-2 ring-offset-card-hover scale-110'
                  )}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsAddingFolder(false)}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground rounded-md hover:bg-border transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFolder}
                className="flex-1 px-3 py-1.5 text-xs font-medium text-white bg-accent hover:bg-accent-hover rounded-md transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        )}

        {folders.map((folder) => (
          <div key={folder.id} className="relative group">
            {editingFolderId === folder.id ? (
              <div className="flex items-center gap-2 px-3 py-2">
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: folder.color }}
                />
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm rounded"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit(folder.id);
                    if (e.key === 'Escape') setEditingFolderId(null);
                  }}
                />
                <button
                  onClick={() => handleSaveEdit(folder.id)}
                  className="p-1 text-success hover:bg-card-hover rounded"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setEditingFolderId(null)}
                  className="p-1 text-muted hover:text-foreground hover:bg-card-hover rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => onSelectFolder(folder.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                  selectedFolderId === folder.id
                    ? 'bg-accent/10 text-accent'
                    : 'text-foreground hover:bg-card-hover'
                )}
              >
                <div
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: folder.color }}
                />
                <span className="flex-1 text-left truncate">{folder.name}</span>
                <span className="text-xs text-muted">{getBookmarkCount(folder.id)}</span>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setMenuOpenId(menuOpenId === folder.id ? null : folder.id);
                    }}
                    className="p-1 rounded opacity-0 group-hover:opacity-100 text-muted hover:text-foreground hover:bg-border transition-all"
                  >
                    <MoreVertical className="w-3.5 h-3.5" />
                  </button>
                  {menuOpenId === folder.id && (
                    <div className="absolute right-0 top-full mt-1 w-32 bg-card border border-border rounded-lg shadow-xl z-10 py-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(folder);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-card-hover transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        Rename
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFolder(folder.id);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-danger hover:bg-card-hover transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </button>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}
