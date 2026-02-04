'use client';

import { useState, useEffect } from 'react';
import { X, Link, FileText, Tag, FolderOpen } from 'lucide-react';
import type { Bookmark, Folder } from '@/types';
import { cn, isValidUrl } from '@/lib/utils';

interface BookmarkFormProps {
  bookmark?: Bookmark | null;
  folders: Folder[];
  onSubmit: (data: Omit<Bookmark, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export function BookmarkForm({ bookmark, folders, onSubmit, onCancel }: BookmarkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [folderId, setFolderId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (bookmark) {
      setTitle(bookmark.title);
      setUrl(bookmark.url);
      setDescription(bookmark.description);
      setCategory(bookmark.category);
      setFolderId(bookmark.folderId);
    }
  }, [bookmark]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      title: title.trim(),
      url: url.trim(),
      description: description.trim(),
      category: category.trim(),
      folderId,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-card rounded-xl border border-border shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">
            {bookmark ? 'Edit Bookmark' : 'Add Bookmark'}
          </h2>
          <button
            onClick={onCancel}
            className="p-2 rounded-lg text-muted hover:text-foreground hover:bg-card-hover transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <FileText className="w-4 h-4 text-muted" />
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Bookmark"
              className={cn(
                'w-full px-4 py-3 rounded-lg text-sm',
                errors.title && 'border-danger'
              )}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-danger">{errors.title}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Link className="w-4 h-4 text-muted" />
              URL
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className={cn(
                'w-full px-4 py-3 rounded-lg text-sm',
                errors.url && 'border-danger'
              )}
            />
            {errors.url && (
              <p className="mt-1 text-sm text-danger">{errors.url}</p>
            )}
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <FileText className="w-4 h-4 text-muted" />
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief description..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg text-sm resize-none"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <Tag className="w-4 h-4 text-muted" />
              Category
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Work, Personal, Research..."
              className="w-full px-4 py-3 rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
              <FolderOpen className="w-4 h-4 text-muted" />
              Folder
            </label>
            <select
              value={folderId || ''}
              onChange={(e) => setFolderId(e.target.value || null)}
              className="w-full px-4 py-3 rounded-lg text-sm"
            >
              <option value="">No Folder</option>
              {folders.map((folder) => (
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-3 rounded-lg text-sm font-medium text-foreground bg-card-hover hover:bg-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent-hover transition-colors"
            >
              {bookmark ? 'Save Changes' : 'Add Bookmark'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
