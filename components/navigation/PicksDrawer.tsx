"use client";

import { usePicksStore } from "@/lib/stores/picks-store";
import { X, Trash2, Trophy, AlertCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function PicksDrawer() {
  const { picks, isDrawerOpen, removePick, clearPicks, closeDrawer } = usePicksStore();
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"single" | "all" | null>(null);
  const [pickToRemove, setPickToRemove] = useState<string | null>(null);

  // Close drawer on outside click
  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node) &&
        !isModalOpen
      ) {
        closeDrawer();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDrawerOpen, isModalOpen, closeDrawer]);

  // Confirm remove single pick
  const confirmRemovePick = (id: string) => {
    setPickToRemove(id);
    setModalType("single");
    setIsModalOpen(true);
  };

  // Confirm clear all picks
  const confirmClearPicks = () => {
    setModalType("all");
    setIsModalOpen(true);
  };

  // Handle remove pick
  const handleRemovePick = () => {
    if (pickToRemove) {
      removePick(pickToRemove);
    }
    closeModal();
  };

  // Handle clear all
  const handleClearAll = () => {
    clearPicks();
    closeModal();
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
    setPickToRemove(null);
  };

  // Get pick event name for confirmation
  const getPickEventName = () => {
    if (!pickToRemove) return "";
    const pick = picks.find((p) => p.id === pickToRemove);
    return pick ? `${pick.homeTeam} vs ${pick.awayTeam}` : "";
  };

  // Calculate width based on screen size
  const getWidth = () => {
    if (typeof window === "undefined") return "w-[320px]";
    
    if (window.innerWidth < 640) {
      return "w-[80%]";
    } else {
      return "w-[320px]";
    }
  };

  return (
    <>
      {/* Overlay */}
      {isDrawerOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={isModalOpen ? undefined : closeDrawer}
        />
      )}

      {/* Drawer */}
      <aside
        ref={drawerRef}
        className={`
          fixed top-12 right-0 h-[calc(100vh-49px)] z-50
          border-l border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          transition-transform duration-300 ease-in-out
          ${getWidth()}
          ${isDrawerOpen ? "translate-x-0" : "translate-x-full"}
          shadow-lg overflow-hidden
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold">PICKS: {picks.length}</h2>
          </div>
          <div className="flex items-center">
            {picks.length > 0 && (
              <button
                onClick={confirmClearPicks}
                className="p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 mr-2 text-red-500"
                title="Clear all picks"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={closeDrawer}
              className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 z-10 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 w-[90%] max-w-70 shadow-lg border border-gray-200 dark:border-gray-700">
              {modalType === "single" && (
                <>
                  <div className="flex items-center mb-3">
                    <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 shrink-0" />
                    <h3 className="text-base font-bold">Confirm Removal</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Remove "{getPickEventName()}" from your picks?
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={closeModal}
                      className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleRemovePick}
                      className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </>
              )}

              {modalType === "all" && (
                <>
                  <div className="flex items-center mb-3">
                    <AlertCircle className="text-yellow-500 h-5 w-5 mr-2 shrink-0" />
                    <h3 className="text-base font-bold">Clear All Picks</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Are you sure you want to clear all picks?
                  </p>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={closeModal}
                      className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-sm hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearAll}
                      className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                    >
                      Clear All
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
          {picks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Your picks are empty
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Add some picks to get started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {picks.map((pick) => (
                <div
                  key={pick.id}
                  className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm">
                      Match {pick.eventNumber}
                    </span>
                    <button
                      onClick={() => confirmRemovePick(pick.id)}
                      className="text-red-500 text-sm hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {pick.homeTeam} vs {pick.awayTeam}
                  </div>

                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className="bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-sm">
                      {pick.competition}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span>Pick: {pick.selection}</span>
                    <span className="font-bold">Odds: {pick.odds.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
