"use client";

import React, { useState } from "react";
import { MessageSquare, Share2, Trash2, MoreHorizontal } from "lucide-react";
import { formatTimeAgo, generateAvatar } from "../../../utils/helpers";

const CommentItem = ({ comment, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);

  // Get user info from populated userId field
  const user = comment.userId || {};
  const userName = user.name || "Anonymous";
  const userInitial = userName.charAt(0).toUpperCase();
  const profilePicture = user.profilePicture;

  // Use createdAt from API response
  const timestamp = comment.createdAt || comment.timestamp;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      await onDelete(comment._id);
    }
    setShowMenu(false);
  };

  return (
    <div className="flex gap-3 py-3 relative">
      {/* Avatar */}
      {profilePicture ? (
        <img
          src={profilePicture}
          alt={userName}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: generateAvatar(userName) }}
        >
          {userInitial}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground hover:underline cursor-pointer">
            {userName}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            {formatTimeAgo(timestamp)}
          </span>

          {/* Menu Button */}
          <div className="ml-auto relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 rounded-full hover:bg-muted transition-colors"
            >
              <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-2 text-left text-sm text-red-500 hover:bg-muted flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Comment Text */}
        <p className="text-sm text-foreground leading-relaxed mb-2">
          {comment.text}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <MessageSquare className="w-4 h-4" />
            Reply
          </button>
          <button className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;