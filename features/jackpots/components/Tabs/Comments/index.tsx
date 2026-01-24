"use client";

import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import CommentItem from './CommentItem';
import type { Comment } from '../../../types';
import { MAX_COMMENT_LENGTH } from '../../../utils/constants';

interface CommentsTabProps {
  comments: Comment[];
  loading?: boolean;
  submitting?: boolean;
  onAddComment?: (text: string) => void;
  onDeleteComment?: (commentId: string) => void;
  currentUserId?: string;
}

const CommentsTab: React.FC<CommentsTabProps> = ({
  comments,
  loading = false,
  submitting = false,
  onAddComment,
  onDeleteComment,
  currentUserId,
}) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim() && onAddComment) {
      onAddComment(commentText.trim());
      setCommentText('');
    }
  };

  const canDelete = (comment: Comment): boolean => {
    return Boolean(currentUserId && comment.userId === currentUserId);
  };

  return (
    <div className="p-4 space-y-4">
      {onAddComment && (
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value.slice(0, MAX_COMMENT_LENGTH))}
            placeholder="Share your thoughts..."
            className="w-full bg-background border border-border rounded-lg p-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            rows={3}
            maxLength={MAX_COMMENT_LENGTH}
            disabled={submitting}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {commentText.length}/{MAX_COMMENT_LENGTH}
            </span>
            <button
              type="submit"
              disabled={!commentText.trim() || submitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Posting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="text-muted-foreground mb-2">No comments yet</div>
          <div className="text-sm text-muted-foreground">
            Be the first to share your thoughts!
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground mb-2">
            {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
          </div>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={onDeleteComment}
              canDelete={canDelete(comment)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsTab;