"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Bookmark,
  Plus,
  Search,
  Folder,
  FolderPlus,
  Edit2,
  Trash2,
  ExternalLink,
  Download,
  Upload,
  X,
  ChevronRight,
  ChevronDown,
  Link as LinkIcon,
  Tag,
  FileText,
} from "lucide-react";

interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  description: string;
  folderId: string;
  createdAt: number;
}

interface FolderItem {
  id: string;
  name: string;
  color: string;
}

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#06b6d4",
  "#84cc16",
];

export default function Home() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(["all"])
  );
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<BookmarkItem | null>(
    null
  );
  const [editingFolder, setEditingFolder] = useState<FolderItem | null>(null);

  // Form states
  const [newBookmark, setNewBookmark] = useState({
    title: "",
    url: "",
    description: "",
    folderId: "",
  });
  const [newFolder, setNewFolder] = useState({ name: "", color: COLORS[0] });

  // Load from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("linkvault-bookmarks");
    const savedFolders = localStorage.getItem("linkvault-folders");
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedFolders) setFolders(JSON.parse(savedFolders));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("linkvault-bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("linkvault-folders", JSON.stringify(folders));
  }, [folders]);

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter((b) => {
      const matchesSearch =
        searchQuery === "" ||
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFolder =
        selectedFolder === null || b.folderId === selectedFolder;
      return matchesSearch && matchesFolder;
    });
  }, [bookmarks, searchQuery, selectedFolder]);

  const addBookmark = () => {
    if (!newBookmark.title || !newBookmark.url) return;
    const bookmark: BookmarkItem = {
      id: crypto.randomUUID(),
      ...newBookmark,
      createdAt: Date.now(),
    };
    setBookmarks([bookmark, ...bookmarks]);
    setNewBookmark({ title: "", url: "", description: "", folderId: "" });
    setIsAddingBookmark(false);
  };

  const updateBookmark = () => {
    if (!editingBookmark) return;
    setBookmarks(
      bookmarks.map((b) => (b.id === editingBookmark.id ? editingBookmark : b))
    );
    setEditingBookmark(null);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  const addFolder = () => {
    if (!newFolder.name) return;
    const folder: FolderItem = {
      id: crypto.randomUUID(),
      ...newFolder,
    };
    setFolders([...folders, folder]);
    setNewFolder({ name: "", color: COLORS[0] });
    setIsAddingFolder(false);
  };

  const updateFolder = () => {
    if (!editingFolder) return;
    setFolders(
      folders.map((f) => (f.id === editingFolder.id ? editingFolder : f))
    );
    setEditingFolder(null);
  };

  const deleteFolder = (id: string) => {
    setFolders(folders.filter((f) => f.id !== id));
    setBookmarks(
      bookmarks.map((b) => (b.folderId === id ? { ...b, folderId: "" } : b))
    );
    if (selectedFolder === id) setSelectedFolder(null);
  };

  const exportData = () => {
    const data = { bookmarks, folders, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "linkvault-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.bookmarks) setBookmarks(data.bookmarks);
        if (data.folders) setFolders(data.folders);
      } catch {
        alert("Invalid file format");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const getFolderById = (id: string) => folders.find((f) => f.id === id);

  const toggleFolderExpand = (id: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedFolders(newExpanded);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--card)] border-r border-[var(--border)] p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-6">
          <Bookmark className="w-6 h-6 text-[var(--primary)]" />
          <h1 className="text-xl font-bold">LinkVault</h1>
        </div>

        {/* Folders */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[var(--muted)] uppercase tracking-wide">
              Folders
            </span>
            <button
              onClick={() => setIsAddingFolder(true)}
              className="p-1 hover:bg-[var(--card-hover)] rounded transition-colors"
            >
              <FolderPlus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            {/* All Bookmarks */}
            <button
              onClick={() => setSelectedFolder(null)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === null
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-[var(--card-hover)]"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>All Bookmarks</span>
              <span className="ml-auto text-sm opacity-70">
                {bookmarks.length}
              </span>
            </button>

            {/* Uncategorized */}
            <button
              onClick={() => setSelectedFolder("")}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                selectedFolder === ""
                  ? "bg-[var(--primary)] text-white"
                  : "hover:bg-[var(--card-hover)]"
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Uncategorized</span>
              <span className="ml-auto text-sm opacity-70">
                {bookmarks.filter((b) => !b.folderId).length}
              </span>
            </button>

            {/* Custom Folders */}
            {folders.map((folder) => (
              <div key={folder.id} className="group">
                <button
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    selectedFolder === folder.id
                      ? "bg-[var(--primary)] text-white"
                      : "hover:bg-[var(--card-hover)]"
                  }`}
                >
                  <Folder
                    className="w-4 h-4"
                    style={{ color: folder.color }}
                  />
                  <span className="truncate">{folder.name}</span>
                  <span className="ml-auto text-sm opacity-70">
                    {bookmarks.filter((b) => b.folderId === folder.id).length}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingFolder(folder);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black/20 rounded"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Import/Export */}
        <div className="border-t border-[var(--border)] pt-4 mt-4 space-y-2">
          <button
            onClick={exportData}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--card-hover)] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-[var(--card-hover)] transition-colors cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import</span>
            <input
              type="file"
              accept=".json"
              onChange={importData}
              className="hidden"
            />
          </label>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[var(--card)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] transition-colors"
            />
          </div>
          <button
            onClick={() => setIsAddingBookmark(true)}
            className="flex items-center gap-2 px-4 py-3 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            Add Bookmark
          </button>
        </div>

        {/* Bookmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bookmark) => {
            const folder = getFolderById(bookmark.folderId);
            return (
              <div
                key={bookmark.id}
                className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-4 hover:border-[var(--primary)] transition-colors group"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <LinkIcon className="w-4 h-4 text-[var(--primary)] shrink-0" />
                    <h3 className="font-medium truncate">{bookmark.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingBookmark(bookmark)}
                      className="p-1.5 hover:bg-[var(--card-hover)] rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteBookmark(bookmark.id)}
                      className="p-1.5 hover:bg-[var(--danger)]/20 text-[var(--danger)] rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--muted)] hover:text-[var(--primary)] truncate block mb-2 flex items-center gap-1"
                >
                  <span className="truncate">{bookmark.url}</span>
                  <ExternalLink className="w-3 h-3 shrink-0" />
                </a>

                {bookmark.description && (
                  <p className="text-sm text-[var(--muted)] line-clamp-2 mb-3">
                    {bookmark.description}
                  </p>
                )}

                {folder && (
                  <div className="flex items-center gap-1.5">
                    <Folder
                      className="w-3 h-3"
                      style={{ color: folder.color }}
                    />
                    <span className="text-xs text-[var(--muted)]">
                      {folder.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredBookmarks.length === 0 && (
          <div className="text-center py-12">
            <Bookmark className="w-12 h-12 text-[var(--muted)] mx-auto mb-4" />
            <p className="text-[var(--muted)]">
              {searchQuery
                ? "No bookmarks found matching your search"
                : "No bookmarks yet. Add your first one!"}
            </p>
          </div>
        )}
      </main>

      {/* Add Bookmark Modal */}
      {isAddingBookmark && (
        <Modal onClose={() => setIsAddingBookmark(false)}>
          <h2 className="text-xl font-bold mb-4">Add Bookmark</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Title
              </label>
              <input
                type="text"
                value={newBookmark.title}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
                placeholder="My Bookmark"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                URL
              </label>
              <input
                type="url"
                value={newBookmark.url}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, url: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
                placeholder="https://example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Description
              </label>
              <textarea
                value={newBookmark.description}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, description: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] resize-none"
                rows={3}
                placeholder="Optional description..."
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Folder
              </label>
              <select
                value={newBookmark.folderId}
                onChange={(e) =>
                  setNewBookmark({ ...newBookmark, folderId: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="">No folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsAddingBookmark(false)}
                className="px-4 py-2 hover:bg-[var(--card-hover)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addBookmark}
                className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors"
              >
                Add Bookmark
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Bookmark Modal */}
      {editingBookmark && (
        <Modal onClose={() => setEditingBookmark(null)}>
          <h2 className="text-xl font-bold mb-4">Edit Bookmark</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Title
              </label>
              <input
                type="text"
                value={editingBookmark.title}
                onChange={(e) =>
                  setEditingBookmark({
                    ...editingBookmark,
                    title: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                URL
              </label>
              <input
                type="url"
                value={editingBookmark.url}
                onChange={(e) =>
                  setEditingBookmark({ ...editingBookmark, url: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Description
              </label>
              <textarea
                value={editingBookmark.description}
                onChange={(e) =>
                  setEditingBookmark({
                    ...editingBookmark,
                    description: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)] resize-none"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Folder
              </label>
              <select
                value={editingBookmark.folderId}
                onChange={(e) =>
                  setEditingBookmark({
                    ...editingBookmark,
                    folderId: e.target.value,
                  })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
              >
                <option value="">No folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditingBookmark(null)}
                className="px-4 py-2 hover:bg-[var(--card-hover)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateBookmark}
                className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Folder Modal */}
      {isAddingFolder && (
        <Modal onClose={() => setIsAddingFolder(false)}>
          <h2 className="text-xl font-bold mb-4">Add Folder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Name
              </label>
              <input
                type="text"
                value={newFolder.name}
                onChange={(e) =>
                  setNewFolder({ ...newFolder, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
                placeholder="Work, Personal, etc."
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewFolder({ ...newFolder, color })}
                    className={`w-8 h-8 rounded-full transition-transform ${
                      newFolder.color === color
                        ? "scale-110 ring-2 ring-white"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setIsAddingFolder(false)}
                className="px-4 py-2 hover:bg-[var(--card-hover)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addFolder}
                className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors"
              >
                Add Folder
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Folder Modal */}
      {editingFolder && (
        <Modal onClose={() => setEditingFolder(null)}>
          <h2 className="text-xl font-bold mb-4">Edit Folder</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Name
              </label>
              <input
                type="text"
                value={editingFolder.name}
                onChange={(e) =>
                  setEditingFolder({ ...editingFolder, name: e.target.value })
                }
                className="w-full px-3 py-2 bg-[var(--background)] border border-[var(--border)] rounded-lg focus:outline-none focus:border-[var(--primary)]"
              />
            </div>
            <div>
              <label className="block text-sm text-[var(--muted)] mb-1">
                Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() =>
                      setEditingFolder({ ...editingFolder, color })
                    }
                    className={`w-8 h-8 rounded-full transition-transform ${
                      editingFolder.color === color
                        ? "scale-110 ring-2 ring-white"
                        : ""
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => deleteFolder(editingFolder.id)}
                className="px-4 py-2 text-[var(--danger)] hover:bg-[var(--danger)]/20 rounded-lg transition-colors mr-auto"
              >
                Delete Folder
              </button>
              <button
                onClick={() => setEditingFolder(null)}
                className="px-4 py-2 hover:bg-[var(--card-hover)] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={updateFolder}
                className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-hover)] rounded-lg transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 hover:bg-[var(--card-hover)] rounded transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}
