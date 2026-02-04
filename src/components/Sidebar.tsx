'use client';

import { Folder as FolderIcon, Plus, X, Pencil, Trash2, Check } from 'lucide-react';
import { Folder } from '@/types/bookmark';
import { useState } from 'react';

interface SidebarProps {
  folders: Folder[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onAddFolder: (name: string, color: string) => void;
  onUpdateFolder: (id: string, name: string, color: string) => void;
  onDeleteFolder: (id: string) => void;
  bookmarkCounts: Record<string, number>;
  isOpen: boolean;
  onClose: () => void;
}

const FOLDER_COLORS = [
  '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#ef4444', '#f97316',
  '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6',
];

export function Sidebar({
  folders,
  selectedFolderId,
  onSelectFolder,
  onAddFolder,
  onUpdateFolder,
  onDeleteFolder,
  bookmarkCounts,
  isOpen,
  onClose,
}: SidebarProps) {
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState(FOLDER_COLORS[0]);

  const totalBookmarks = Object.values(bookmarkCounts).reduce((a, b) => a + b, 0);

  const handleAddFolder = () => {
    if (newFolderName.trim()) {
      onAddFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName('');
      setNewFolderColor(FOLDER_COLORS[0]);
      setIsAddingFolder(false);
    }
  };

  const handleUpdateFolder = (folder: Folder) => {
    if (newFolderName.trim()) {
      onUpdateFolder(folder.id, newFolderName.trim(), newFolderColor);
      setEditingFolderId(null);
      setNewFolderName('');
    }
  };

  const startEditing = (folder: Folder) => {
    setEditingFolderId(folder.id);
    setNewFolderName(folder.name);
    setNewFolderColor(folder.color);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-[var(--border)] bg-[var(--background)] transition-transform lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-[var(--border)] p-4 lg:hidden">
            <span className="font-semibold">Folders</span>
            <button onClick={onClose} className="p-1 text-[var(--muted)]">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wider text-[var(--muted)]">
                Categories
              </span>
              <button
                onClick={() => setIsAddingFolder(true)}
                className="rounded p-1 text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--foreground)]"
                title="Add folder"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <nav className="space-y-1">
              <button
                onClick={() => {
                  onSelectFolder(null);
                  onClose();
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  selectedFolderId === null
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'text-[var(--foreground)] hover:bg-[var(--card)]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <FolderIcon className="h-4 w-4" />
                  <span>All Bookmarks</span>
                </div>
                <span className="text-xs text-[var(--muted)]">{totalBookmarks}</span>
              </button>

              {folders.map((folder) => (
                <div key={folder.id} className="group relative">
                  {editingFolderId === folder.id ? (
                    <div className="rounded-lg bg-[var(--card)] p-2">
                      <input
                        type="text"
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                        className="mb-2 w-full rounded px-2 py-1 text-sm"
                        placeholder="Folder name"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleUpdateFolder(folder);
                          if (e.key === 'Escape') setEditingFolderId(null);
                        }}
                      />
                      <div className="mb-2 flex flex-wrap gap-1">
                        {FOLDER_COLORS.map((color) => (
                          <button
                            key={color}
                            onClick={() => setNewFolderColor(color)}
                            className={`h-5 w-5 rounded ${
                              newFolderColor === color ? 'ring-2 ring-white ring-offset-1 ring-offset-[var(--card)]' : ''
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleUpdateFolder(folder)}
                          className="flex-1 rounded bg-[var(--accent)] px-2 py-1 text-xs text-white"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingFolderId(null)}
                          className="rounded px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--border)]"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        onSelectFolder(folder.id);
                        onClose();
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        selectedFolderId === folder.id
                          ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                          : 'text-[var(--foreground)] hover:bg-[var(--card)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-4 w-4 rounded"
                          style={{ backgroundColor: folder.color }}
                        />
                        <span className="truncate">{folder.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-[var(--muted)]">
                          {bookmarkCounts[folder.id] || 0}
                        </span>
                        <div className="hidden items-center gap-0.5 group-hover:flex">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditing(folder);
                            }}
                            className="rounded p-1 text-[var(--muted)] hover:bg-[var(--border)] hover:text-[var(--foreground)]"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          {folder.id !== 'default' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteFolder(folder.id);
                              }}
                              className="rounded p-1 text-[var(--muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    </button>
                  )}
                </div>
              ))}

              {isAddingFolder && (
                <div className="rounded-lg bg-[var(--card)] p-2">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    className="mb-2 w-full rounded px-2 py-1 text-sm"
                    placeholder="Folder name"
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddFolder();
                      if (e.key === 'Escape') setIsAddingFolder(false);
                    }}
                  />
                  <div className="mb-2 flex flex-wrap gap-1">
                    {FOLDER_COLORS.map((color) => (
                      <button
                        key={color}
                        onClick={() => setNewFolderColor(color)}
                        className={`h-5 w-5 rounded ${
                          newFolderColor === color ? 'ring-2 ring-white ring-offset-1 ring-offset-[var(--card)]' : ''
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={handleAddFolder}
                      className="flex-1 rounded bg-[var(--accent)] px-2 py-1 text-xs text-white"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => setIsAddingFolder(false)}
                      className="rounded px-2 py-1 text-xs text-[var(--muted)] hover:bg-[var(--border)]"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
