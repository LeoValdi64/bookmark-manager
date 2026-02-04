'use client';

import { ExternalLink, Pencil, Trash2, Globe } from 'lucide-react';
import { Bookmark, Folder } from '@/types/bookmark';

interface BookmarkCardProps {
  bookmark: Bookmark;
  folder: Folder | undefined;
  onEdit: () => void;
  onDelete: () => void;
}

function getFaviconUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;
  } catch {
    return '';
  }
}

function getDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return url;
  }
}

export function BookmarkCard({ bookmark, folder, onEdit, onDelete }: BookmarkCardProps) {
  const faviconUrl = getFaviconUrl(bookmark.url);
  const domain = getDomain(bookmark.url);

  return (
    <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 transition-all hover:border-[var(--accent)]/30 hover:bg-[var(--card-hover)]">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--background)]">
          {faviconUrl ? (
            <img
              src={faviconUrl}
              alt=""
              className="h-6 w-6"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <Globe className={`h-5 w-5 text-[var(--muted)] ${faviconUrl ? 'hidden' : ''}`} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="truncate font-medium text-[var(--foreground)]">
                {bookmark.title}
              </h3>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
              >
                <span className="truncate">{domain}</span>
                <ExternalLink className="h-3 w-3 flex-shrink-0" />
              </a>
            </div>

            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={onEdit}
                className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--background)] hover:text-[var(--foreground)]"
                title="Edit bookmark"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={onDelete}
                className="rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                title="Delete bookmark"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {bookmark.description && (
            <p className="mt-2 line-clamp-2 text-sm text-[var(--muted)]">
              {bookmark.description}
            </p>
          )}

          {folder && (
            <div className="mt-3 flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: folder.color }}
              />
              <span className="text-xs text-[var(--muted)]">{folder.name}</span>
            </div>
          )}
        </div>
      </div>

      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute inset-0 z-0"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest('button')) {
            e.preventDefault();
          }
        }}
      >
        <span className="sr-only">Open {bookmark.title}</span>
      </a>
    </div>
  );
}
