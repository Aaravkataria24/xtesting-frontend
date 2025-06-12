import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include x_user in headers
api.interceptors.request.use((config) => {
  const xUser = localStorage.getItem('x_user');
  if (xUser) {
    config.headers['x_user'] = xUser;
  }
  return config;
});

export interface TweetPredictionRequest {
  text: string;
  has_image: boolean;
  has_video: boolean;
  has_link: boolean;
  has_mention: boolean;
  has_crypto_mention: boolean;
  is_quoting: boolean;
  has_poll: boolean;
  time_posted: string;
  follower_count?: number;
  view_count?: number;
  length?: number;
}

export interface TweetPredictionResponse {
  likes: number;
  retweets: number;
  replies: number;
}

export const predictTweet = async (data: TweetPredictionRequest): Promise<TweetPredictionResponse> => {
  // Log outgoing payload (omitting follower_count) for debugging
  console.log("Debug (API): Outgoing prediction request payload (without follower_count):", { ...data, follower_count: undefined });
  try {
    const response = await api.post<TweetPredictionResponse>('/predict', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.detail || 'Failed to predict tweet engagement');
    }
    throw error;
  }
};

// Helper function to determine quality based on metrics
export const getQualityMetrics = (likes: number, retweets: number, replies: number) => {
  const getQuality = (value: number, thresholds: { decent: number; veryGood: number; excellent: number; bad: number }) => {
    if (value > thresholds.excellent) return { quality: 'Excellent', color: 'bg-purple-500 text-white' };
    if (value >= thresholds.veryGood) return { quality: 'Very Good', color: 'bg-blue-500 text-white' };
    if (value >= thresholds.decent) return { quality: 'Decent', color: 'bg-emerald-500 text-white' };
    if (value >= thresholds.bad) return { quality: 'Bad', color: 'bg-orange-500 text-white' };
    return { quality: 'Very Bad', color: 'bg-red-500 text-white' };
  };

  // Likes thresholds
  const likesThresholds = { bad: 35, decent: 141, veryGood: 438, excellent: 3200 };
  // Replies thresholds
  const repliesThresholds = { bad: 5, decent: 25, veryGood: 87, excellent: 533 };
  // Retweets thresholds
  const retweetsThresholds = { bad: 2, decent: 9, veryGood: 39, excellent: 407 };

  // Calculate engagement score (weighted average, thresholds unchanged)
  const engagementScore = Math.round(
    (likes * 0.5 + retweets * 0.3 + replies * 0.2) /
    (likes + retweets + replies) * 100
  );

  return {
    likes: { value: likes, ...getQuality(likes, likesThresholds) },
    retweets: { value: retweets, ...getQuality(retweets, retweetsThresholds) },
    replies: { value: replies, ...getQuality(replies, repliesThresholds) },
    engagement: {
      value: engagementScore,
      ...getQuality(engagementScore, { bad: 30, decent: 60, veryGood: 75, excellent: 90 }) // unchanged
    }
  };
}; 