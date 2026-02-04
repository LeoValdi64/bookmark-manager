export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

export interface BookmarkStore {
  bookmarks: Bookmark[];
  folders: Folder[];
}
