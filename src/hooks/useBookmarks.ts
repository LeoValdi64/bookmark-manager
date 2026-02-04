'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Bookmark, Folder, BookmarkManagerState } from '@/types';

const STORAGE_KEY = 'bookmark-manager-data';

const initialState: BookmarkManagerState = {
  bookmarks: [],
  folders: [],
};

export function useBookmarks() {
  const [state, setState, isLoaded] = useLocalStorage<BookmarkManagerState>(
    STORAGE_KEY,
    initialState
  );

  const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  // Bookmark operations
  const addBookmark = useCallback((bookmark: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmark,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      bookmarks: [...prev.bookmarks, newBookmark],
    }));
    return newBookmark;
  }, [setState]);

  const updateBookmark = useCallback((id: string, updates: Partial<Omit<Bookmark, 'id' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.map((b) =>
        b.id === id
          ? { ...b, ...updates, updatedAt: new Date().toISOString() }
          : b
      ),
    }));
  }, [setState]);

  const deleteBookmark = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      bookmarks: prev.bookmarks.filter((b) => b.id !== id),
    }));
  }, [setState]);

  // Folder operations
  const addFolder = useCallback((folder: Omit<Folder, 'id' | 'createdAt'>) => {
    const newFolder: Folder = {
      ...folder,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setState((prev) => ({
      ...prev,
      folders: [...prev.folders, newFolder],
    }));
    return newFolder;
  }, [setState]);

  const updateFolder = useCallback((id: string, updates: Partial<Omit<Folder, 'id' | 'createdAt'>>) => {
    setState((prev) => ({
      ...prev,
      folders: prev.folders.map((f) =>
        f.id === id ? { ...f, ...updates } : f
      ),
    }));
  }, [setState]);

  const deleteFolder = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      folders: prev.folders.filter((f) => f.id !== id),
      bookmarks: prev.bookmarks.map((b) =>
        b.folderId === id ? { ...b, folderId: null } : b
      ),
    }));
  }, [setState]);

  // Import/Export
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(state, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bookmarks-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [state]);

  const importData = useCallback((jsonString: string) => {
    try {
      const data = JSON.parse(jsonString) as BookmarkManagerState;
      if (data.bookmarks && data.folders) {
        setState(data);
        return { success: true, message: 'Data imported successfully' };
      }
      return { success: false, message: 'Invalid data format' };
    } catch {
      return { success: false, message: 'Failed to parse JSON' };
    }
  }, [setState]);

  const getBookmarksByFolder = useCallback((folderId: string | null) => {
    return state.bookmarks.filter((b) => b.folderId === folderId);
  }, [state.bookmarks]);

  const searchBookmarks = useCallback((query: string, folderId?: string | null) => {
    const lowerQuery = query.toLowerCase();
    return state.bookmarks.filter((b) => {
      const matchesQuery =
        b.title.toLowerCase().includes(lowerQuery) ||
        b.url.toLowerCase().includes(lowerQuery) ||
        b.description.toLowerCase().includes(lowerQuery) ||
        b.category.toLowerCase().includes(lowerQuery);

      if (folderId === undefined) return matchesQuery;
      return matchesQuery && b.folderId === folderId;
    });
  }, [state.bookmarks]);

  return {
    bookmarks: state.bookmarks,
    folders: state.folders,
    isLoaded,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    addFolder,
    updateFolder,
    deleteFolder,
    exportData,
    importData,
    getBookmarksByFolder,
    searchBookmarks,
  };
}
