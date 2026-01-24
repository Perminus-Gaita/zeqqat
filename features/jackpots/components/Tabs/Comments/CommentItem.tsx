"use client";

import React from 'react';
import { Trash2 } from 'lucide-react';
import type { Comment } from '../../../types';

interface CommentItemProps {
  comment: Comment;
  onDelete?: (commentId: string) => void;
  canDelete?: boolean;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  onDelete,
  canDelete = false,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-bold text-primary">
              {comment.username?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-semibold text-foreground">
                {comment.username || 'Anonymous'}
              </span>
              <span className="text-xs text-muted-foreground">
                {formatTime(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-foreground whitespace-pre-wrap break-words">
              {comment.text}
            </p>
          </div>
        </div>

        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(comment._id)}
            className="text-muted-foreground hover:text-red-500 transition-colors p-1"
            aria-label="Delete comment"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
