export type PredictionResult = {
  likes: number;
  retweets: number;
  replies: number;
  engagementScore: number;
};

export type SplitTestResult = {
  prediction1: PredictionResult;
  prediction2: PredictionResult;
  winner: 'tweet1' | 'tweet2';
};

const API_URL = 'https://xtesting-api.onrender.com';

export const predictSingleTweet = async (
  tweet: string
): Promise<PredictionResult> => {
  const response = await fetch(`${API_URL}/predict/single`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: tweet }),
  });

  if (!response.ok) {
    throw new Error(`Failed to predict tweet (status ${response.status})`);
  }

  const data = await response.json();
  const prediction = data.prediction;

  return {
    likes: prediction.likes,
    retweets: prediction.retweets,
    replies: prediction.replies,
    engagementScore: prediction.engagement_score,
  };
};

export const predictSplitTest = async (
  tweet1: string,
  tweet2: string
): Promise<SplitTestResult> => {
  const response = await fetch(`${API_URL}/predict/split`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tweet1, tweet2 }),
  });

  if (!response.ok) {
    throw new Error(`Failed to predict split test (status ${response.status})`);
  }

  const data = await response.json();

  return {
    prediction1: {
      likes: data.tweet1.likes,
      retweets: data.tweet1.retweets,
      replies: data.tweet1.replies,
      engagementScore: data.tweet1.engagement_score,
    },
    prediction2: {
      likes: data.tweet2.likes,
      retweets: data.tweet2.retweets,
      replies: data.tweet2.replies,
      engagementScore: data.tweet2.engagement_score,
    },
    winner: data.better_tweet,
  };
};
