"use client";

import React, { useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import CommentItem from "./CommentItem";
import { generateAvatar } from "../../../utils/helpers";

const CommentsTab = ({
  comments,
  loading,
  submitting,
  onAddComment,
  onDeleteComment,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    await onAddComment(newComment);
    setNewComment("");
    setIsExpanded(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-3" />
        <p className="text-muted-foreground text-sm">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Comment Input */}
      <div className="mb-6">
        <div
          className={`border border-border rounded-lg bg-card transition-all ${
            isExpanded
              ? "ring-2 ring-primary"
              : "hover:border-muted-foreground"
          }`}
        >
          {!isExpanded ? (
            <div
              className="flex items-center gap-3 p-3 cursor-text"
              onClick={() => setIsExpanded(true)}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ background: generateAvatar("User") }}
              >
                U
              </div>
              <span className="text-muted-foreground text-sm">
                Add a comment...
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-3">
              <textarea
                placeholder="What are your thoughts?"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full bg-transparent text-foreground text-sm py-2 outline-none resize-none min-h-[80px] placeholder:text-muted-foreground"
                rows={3}
                autoFocus
                disabled={submitting}
              />
              <div className="flex justify-end gap-2 pt-2 border-t border-border mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsExpanded(false);
                    setNewComment("");
                  }}
                  className="px-4 py-1.5 rounded-full text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 ${
                    newComment.trim() && !submitting
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground cursor-not-allowed"
                  }`}
                >
                  {submitting && (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  )}
                  Comment
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="py-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No comments yet</p>
          <p className="text-muted-foreground/60 text-xs mt-1">
            Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onDelete={onDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsTab;