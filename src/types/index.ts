export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  folderId: string | null;
  favicon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId: string | null;
  color: string;
  createdAt: string;
}

export interface BookmarkManagerState {
  bookmarks: Bookmark[];
  folders: Folder[];
}

export type SortOption = 'title' | 'date' | 'category';
export type SortDirection = 'asc' | 'desc';
