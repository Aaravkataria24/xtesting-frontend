import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
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
  follower_count: number;
  view_count?: number;
  length?: number;
}

export interface TweetPredictionResponse {
  likes: number;
  retweets: number;
  replies: number;
}

export const predictTweet = async (data: TweetPredictionRequest): Promise<TweetPredictionResponse> => {
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
  const getQuality = (value: number, thresholds: { good: number; veryGood: number; excellent: number }) => {
    if (value >= thresholds.excellent) return { quality: 'Excellent', color: 'bg-purple-500 text-white' };
    if (value >= thresholds.veryGood) return { quality: 'Very Good', color: 'bg-blue-500 text-white' };
    if (value >= thresholds.good) return { quality: 'Good', color: 'bg-emerald-500 text-white' };
    if (value >= thresholds.good / 2) return { quality: 'Bad', color: 'bg-orange-500 text-white' };
    return { quality: 'Very Bad', color: 'bg-red-500 text-white' };
  };

  // Calculate engagement score (weighted average)
  const engagementScore = Math.round(
    (likes * 0.5 + retweets * 0.3 + replies * 0.2) / 
    (likes + retweets + replies) * 100
  );

  return {
    likes: { value: likes, ...getQuality(likes, { good: 100, veryGood: 500, excellent: 1000 }) },
    retweets: { value: retweets, ...getQuality(retweets, { good: 50, veryGood: 200, excellent: 500 }) },
    replies: { value: replies, ...getQuality(replies, { good: 25, veryGood: 100, excellent: 250 }) },
    engagement: { 
      value: engagementScore, 
      ...getQuality(engagementScore, { good: 60, veryGood: 75, excellent: 90 }) 
    }
  };
}; 