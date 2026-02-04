'use client';

import { Search, Plus, Upload, Download, Menu } from 'lucide-react';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onAddBookmark: () => void;
  onImport: () => void;
  onExport: () => void;
  onToggleSidebar: () => void;
}

export function Header({
  searchQuery,
  onSearchChange,
  onAddBookmark,
  onImport,
  onExport,
  onToggleSidebar,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--foreground)] lg:hidden"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)] to-purple-600">
              <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h1 className="hidden text-xl font-semibold sm:block">Bookmarks</h1>
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <input
              type="text"
              placeholder="Search bookmarks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onImport}
            className="hidden rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--foreground)] sm:flex"
            title="Import bookmarks"
          >
            <Upload className="h-5 w-5" />
          </button>
          <button
            onClick={onExport}
            className="hidden rounded-lg p-2 text-[var(--muted)] transition-colors hover:bg-[var(--card)] hover:text-[var(--foreground)] sm:flex"
            title="Export bookmarks"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={onAddBookmark}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[var(--accent)] to-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Bookmark</span>
          </button>
        </div>
      </div>
    </header>
  );
}
