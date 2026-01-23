"use client";

import { useState, useEffect, useCallback } from "react";

// Base API URL
const API_BASE = "/api/jackpot";

/**
 * Custom hook for fetching jackpot details
 * @param {string} jackpotId - The jackpot ID or "latest" to fetch the most recent jackpot
 */
export function useJackpotDetails(jackpotId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetails = useCallback(async () => {
    if (!jackpotId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let url = `${API_BASE}/details`;

      // If jackpotId is "latest", fetch without ID to get the most recent
      // Otherwise, fetch the specific jackpot
      if (jackpotId !== "latest") {
        url += `?jackpotId=${jackpotId}`;
      } else {
        // Fetch the latest jackpot (limit 1, sorted by bettingClosesAt desc)
        url += `?limit=1`;
      }

      const response = await fetch(url);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch jackpot details");
      }

      // Handle both single jackpot and array response
      const jackpotData = Array.isArray(result.data)
        ? result.data[0]
        : result.data;

      if (!jackpotData) {
        throw new Error("No jackpot found");
      }

      setData(jackpotData);
    } catch (err) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  return { data, loading, error, refetch: fetchDetails };
}

/**
 * Custom hook for fetching and managing predictions
 * @param {string} jackpotId - The jackpot ID (MongoDB ObjectId)
 */
export function usePredictions(jackpotId) {
  const [predictions, setPredictions] = useState([]);
  const [userPrediction, setUserPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all predictions for the jackpot
  const fetchPredictions = useCallback(async () => {
    if (!jackpotId) return;

    try {
      setLoading(true);
      // Fetch community predictions (all predictions for this jackpot)
      const response = await fetch(
        `${API_BASE}/predictions?jackpotId=${jackpotId}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch predictions");
      }

      setPredictions(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  // Fetch current user's prediction
  const fetchUserPrediction = useCallback(async () => {
    if (!jackpotId) return;

    try {
      const response = await fetch(
        `${API_BASE}/predictions?jackpotId=${jackpotId}`
      );
      const result = await response.json();

      if (response.ok && result.data?.length > 0) {
        // The API returns user's own predictions when no userId is specified
        setUserPrediction(result.data[0]);
      }
    } catch (err) {
      console.error("Error fetching user prediction:", err);
    }
  }, [jackpotId]);

  // Create a new prediction
  const createPrediction = useCallback(
    async (picks) => {
      if (!jackpotId) return null;

      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/predictions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jackpotId, picks }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to create prediction");
        }

        setUserPrediction(result.data);
        await fetchPredictions(); // Refresh the list
        return result.data;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [jackpotId, fetchPredictions]
  );

  // Update an existing prediction
  const updatePrediction = useCallback(
    async (predictionId, picks) => {
      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/predictions`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predictionId, picks }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to update prediction");
        }

        setUserPrediction(result.data);
        await fetchPredictions(); // Refresh the list
        return result.data;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchPredictions]
  );

  // Delete a prediction
  const deletePrediction = useCallback(
    async (predictionId) => {
      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/predictions`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ predictionId }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to delete prediction");
        }

        setUserPrediction(null);
        await fetchPredictions(); // Refresh the list
        return true;
      } catch (err) {
        setError(err.message);
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [fetchPredictions]
  );

  useEffect(() => {
    if (jackpotId) {
      fetchPredictions();
      fetchUserPrediction();
    }
  }, [jackpotId, fetchPredictions, fetchUserPrediction]);

  return {
    predictions,
    userPrediction,
    loading,
    error,
    submitting,
    createPrediction,
    updatePrediction,
    deletePrediction,
    refetch: fetchPredictions,
  };
}

/**
 * Custom hook for fetching and managing comments
 * @param {string} jackpotId - The jackpot ID (MongoDB ObjectId)
 */
export function useComments(jackpotId) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch all comments for the jackpot
  const fetchComments = useCallback(async () => {
    if (!jackpotId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/comments?jackpotId=${jackpotId}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch comments");
      }

      setComments(result.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  // Create a new comment
  const createComment = useCallback(
    async (text) => {
      if (!jackpotId || !text.trim()) return null;

      try {
        setSubmitting(true);
        const response = await fetch(`${API_BASE}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jackpotId, text }),
        });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Failed to create comment");
        }

        // Add the new comment to the top of the list
        setComments((prev) => [result.data, ...prev]);
        return result.data;
      } catch (err) {
        setError(err.message);
        return null;
      } finally {
        setSubmitting(false);
      }
    },
    [jackpotId]
  );

  // Delete a comment
  const deleteComment = useCallback(async (commentId) => {
    try {
      setSubmitting(true);
      const response = await fetch(`${API_BASE}/comments`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId }),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to delete comment");
      }

      // Remove the comment from the list
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  useEffect(() => {
    if (jackpotId) {
      fetchComments();
    }
  }, [jackpotId, fetchComments]);

  return {
    comments,
    loading,
    error,
    submitting,
    createComment,
    deleteComment,
    refetch: fetchComments,
  };
}

/**
 * Custom hook for fetching statistics
 * @param {string} jackpotId - The jackpot ID (MongoDB ObjectId)
 */
export function useStatistics(jackpotId) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    if (!jackpotId) return;

    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE}/statistics?jackpotId=${jackpotId}`
      );
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to fetch statistics");
      }

      setStats(result.data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [jackpotId]);

  useEffect(() => {
    if (jackpotId) {
      fetchStats();
    }
  }, [jackpotId, fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}