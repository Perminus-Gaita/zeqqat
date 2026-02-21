"use client";

import { useState, useEffect, useRef } from "react";
import { authClient } from "@/lib/auth/client";
import { Loader2, Pencil, X, Check, Camera, User } from "lucide-react";

interface UserData {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt?: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editName, setEditName] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [showAvatarUrlInput, setShowAvatarUrlInput] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    authClient.getSession().then((session) => {
      const u = session?.data?.user || null;
      if (u) {
        setUser(u as UserData);
        setIsOwnProfile(true);
      }
      setLoading(false);
    });
  }, []);

  const openEdit = () => {
    setEditName(user?.name || "");
    setEditUsername(username);
    setEditBio(bio);
    setEditAvatar(user?.image || "");
    setShowAvatarUrlInput(false);
    setEditing(true);
  };

  const cancelEdit = () => setEditing(false);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updateData: { name?: string; image?: string } = {};
      if (editName !== (user.name || "")) updateData.name = editName;
      if (editAvatar !== (user.image || "")) updateData.image = editAvatar;
      if (Object.keys(updateData).length > 0) {
        await authClient.updateUser(updateData);
        setUser((prev) => (prev ? { ...prev, ...updateData } : prev));
      }
      setUsername(editUsername);
      setBio(editBio);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.name || "Anonymous";
  const displayAvatar = user?.image || "";
  const displayUsername = username || "username";
  const joinDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      })
    : null;

  if (loading) {
    return (
      <div className="pt-20 flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-10">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 dark:bg-gray-800/50 p-8 text-center sm:mx-0 -mx-4 sm:rounded-xl rounded-none">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Sign in to view your profile
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You need to be signed in to see your profile.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── EDIT MODE ──
  if (editing) {
    return (
      <div className="pt-10 pb-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={cancelEdit}
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              Edit Profile
            </h1>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Save
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 sm:rounded-xl rounded-none sm:mx-0 -mx-4">
            <div className="p-6 flex flex-col items-center border-b border-gray-100 dark:border-gray-700/50">
              <div className="relative">
                <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-orange-500 flex items-center justify-center">
                  {editAvatar ? (
                    <img src={editAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-xl font-bold">
                      {editName?.charAt(0)?.toUpperCase() || "?"}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    setShowAvatarUrlInput(!showAvatarUrlInput);
                    setTimeout(() => avatarInputRef.current?.focus(), 100);
                  }}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-blue-700 transition-colors"
                >
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>
              {showAvatarUrlInput && (
                <div className="mt-4 w-full max-w-sm">
                  <input
                    ref={avatarInputRef}
                    type="url"
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  />
                </div>
              )}
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Name</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Your display name"
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">@</span>
                  <input
                    type="text"
                    value={editUsername}
                    onChange={(e) => setEditUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                    placeholder="username"
                    maxLength={30}
                    className="w-full pl-8 pr-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Tell us a bit about yourself..."
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 resize-none"
                />
                <p className="mt-1 text-xs text-gray-400 text-right">{editBio.length}/160</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DISPLAY MODE ──
  return (
    <div className="pt-10 pb-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/50 sm:rounded-xl rounded-none sm:mx-0 -mx-4">
          <div className="p-5">
            <div className="flex items-center gap-1.5">
              {/* Avatar */}
              <div className="w-[50px] h-[50px] rounded-full overflow-hidden bg-gradient-to-br from-pink-500 to-orange-500 flex-shrink-0 flex items-center justify-center">
                {displayAvatar ? (
                  <img src={displayAvatar} alt={displayName} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-xl font-bold">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name + username + edit */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h1 className="text-base font-bold text-gray-900 dark:text-white truncate">
                    {displayName}
                  </h1>
                  {isOwnProfile && (
                    <button
                      onClick={openEdit}
                      className="flex-shrink-0 ml-2 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                      aria-label="Edit profile"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 -mt-0.5">
                  @{displayUsername}
                </p>
              </div>
            </div>

            {/* Joined date */}
            {joinDate && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                Joined {joinDate}
              </p>
            )}

            {/* Bio */}
            {bio && (
              <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {bio}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
