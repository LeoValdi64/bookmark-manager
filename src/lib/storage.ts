import { BookmarkStore, Bookmark, Folder } from '@/types/bookmark';

const STORAGE_KEY = 'bookmark-manager-data';

const DEFAULT_FOLDERS: Folder[] = [
  { id: 'default', name: 'General', color: '#6366f1', createdAt: new Date().toISOString() },
  { id: 'work', name: 'Work', color: '#22c55e', createdAt: new Date().toISOString() },
  { id: 'personal', name: 'Personal', color: '#f59e0b', createdAt: new Date().toISOString() },
];

const DEFAULT_STORE: BookmarkStore = {
  bookmarks: [],
  folders: DEFAULT_FOLDERS,
};

export function loadStore(): BookmarkStore {
  if (typeof window === 'undefined') return DEFAULT_STORE;

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return DEFAULT_STORE;
    return JSON.parse(data);
  } catch {
    return DEFAULT_STORE;
  }
}

export function saveStore(store: BookmarkStore): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createBookmark(data: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>): Bookmark {
  const now = new Date().toISOString();
  return {
    ...data,
    id: generateId(),
    createdAt: now,
    updatedAt: now,
  };
}

export function createFolder(name: string, color: string): Folder {
  return {
    id: generateId(),
    name,
    color,
    createdAt: new Date().toISOString(),
  };
}

export function exportData(store: BookmarkStore): string {
  return JSON.stringify(store, null, 2);
}

export function importData(jsonString: string): BookmarkStore | null {
  try {
    const data = JSON.parse(jsonString);
    if (!data.bookmarks || !data.folders) return null;
    if (!Array.isArray(data.bookmarks) || !Array.isArray(data.folders)) return null;
    return data as BookmarkStore;
  } catch {
    return null;
  }
}
