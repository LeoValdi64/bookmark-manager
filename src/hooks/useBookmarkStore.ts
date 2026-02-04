'use client';

import { useState, useEffect, useCallback } from 'react';
import { Bookmark, Folder, BookmarkStore } from '@/types/bookmark';
import { loadStore, saveStore, createBookmark, createFolder } from '@/lib/storage';

export function useBookmarkStore() {
  const [store, setStore] = useState<BookmarkStore>({ bookmarks: [], folders: [] });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const data = loadStore();
    setStore(data);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      saveStore(store);
    }
  }, [store, isLoaded]);

  const addBookmark = useCallback((data: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => {
    const bookmark = createBookmark(data);
    setStore(prev => ({
      ...prev,
      bookmarks: [bookmark, ...prev.bookmarks],
    }));
    return bookmark;
  }, []);

  const updateBookmark = useCallback((id: string, data: Partial<Omit<Bookmark, 'id' | 'createdAt'>>) => {
    setStore(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.map(b =>
        b.id === id ? { ...b, ...data, updatedAt: new Date().toISOString() } : b
      ),
    }));
  }, []);

  const deleteBookmark = useCallback((id: string) => {
    setStore(prev => ({
      ...prev,
      bookmarks: prev.bookmarks.filter(b => b.id !== id),
    }));
  }, []);

  const addFolder = useCallback((name: string, color: string) => {
    const folder = createFolder(name, color);
    setStore(prev => ({
      ...prev,
      folders: [...prev.folders, folder],
    }));
    return folder;
  }, []);

  const updateFolder = useCallback((id: string, data: Partial<Omit<Folder, 'id' | 'createdAt'>>) => {
    setStore(prev => ({
      ...prev,
      folders: prev.folders.map(f =>
        f.id === id ? { ...f, ...data } : f
      ),
    }));
  }, []);

  const deleteFolder = useCallback((id: string) => {
    setStore(prev => ({
      ...prev,
      folders: prev.folders.filter(f => f.id !== id),
      bookmarks: prev.bookmarks.map(b =>
        b.folderId === id ? { ...b, folderId: 'default' } : b
      ),
    }));
  }, []);

  const importStore = useCallback((newStore: BookmarkStore) => {
    setStore(newStore);
  }, []);

  return {
    bookmarks: store.bookmarks,
    folders: store.folders,
    isLoaded,
    addBookmark,
    updateBookmark,
    deleteBookmark,
    addFolder,
    updateFolder,
    deleteFolder,
    importStore,
    store,
  };
}
