import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TweetInputBlock } from '@/components/TweetInputBlock';
import { PredictionResults } from '@/components/PredictionResults';
import { predictTweet, getQualityMetrics, TweetPredictionRequest } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function Prediction() {
  const [singleResults, setSingleResults] = useState<{
    likes: number;
    retweets: number;
    replies: number;
    quality: {
      likes: { value: number; quality: string; color: string };
      retweets: { value: number; quality: string; color: string };
      replies: { value: number; quality: string; color: string };
      engagement: { value: number; quality: string; color: string };
    };
  } | null>(null);
  const [splitResultsA, setSplitResultsA] = useState<{
    likes: number;
    retweets: number;
    replies: number;
    quality: {
      likes: { value: number; quality: string; color: string };
      retweets: { value: number; quality: string; color: string };
      replies: { value: number; quality: string; color: string };
      engagement: { value: number; quality: string; color: string };
    };
  } | null>(null);
  const [splitResultsB, setSplitResultsB] = useState<{
    likes: number;
    retweets: number;
    replies: number;
    quality: {
      likes: { value: number; quality: string; color: string };
      retweets: { value: number; quality: string; color: string };
      replies: { value: number; quality: string; color: string };
      engagement: { value: number; quality: string; color: string };
    };
  } | null>(null);
  const [splitDataA, setSplitDataA] = useState<TweetPredictionRequest | null>(null);
  const [splitDataB, setSplitDataB] = useState<TweetPredictionRequest | null>(null);
  const [isLoadingSingle, setIsLoadingSingle] = useState(false);
  const [isLoadingSplit, setIsLoadingSplit] = useState(false);
  const { toast } = useToast();

  const handleSinglePredict = async (data: TweetPredictionRequest) => {
    const storedUser = localStorage.getItem("x_user");
    console.log("Debug: User info from localStorage:", storedUser ? JSON.parse(storedUser) : "Not found");
    console.log("Debug: Prediction request payload (without follower_count):", { ...data, follower_count: undefined });
    try {
      setIsLoadingSingle(true);
      const response = await predictTweet(data);
      const quality = getQualityMetrics(response.likes, response.retweets, response.replies);
      setSingleResults({
        likes: response.likes,
        retweets: response.retweets,
        replies: response.replies,
        quality,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get prediction. Please try again.",
        variant: "destructive",
      });
      console.error('Prediction error:', error);
    } finally {
      setIsLoadingSingle(false);
    }
  };

  const handleSplitPredict = async (data: TweetPredictionRequest, isA: boolean) => {
    const storedUser = localStorage.getItem("x_user");
    console.log("Debug (Split): User info from localStorage:", storedUser ? JSON.parse(storedUser) : "Not found");
    console.log("Debug (Split): Prediction request payload (without follower_count):", { ...data, follower_count: undefined });
    if (isA) {
      setSplitDataA(data);
    } else {
      setSplitDataB(data);
    }

    // Only predict if we have both tweets
    if ((isA && splitDataB) || (!isA && splitDataA)) {
      try {
        setIsLoadingSplit(true);
        const [responseA, responseB] = await Promise.all([
          predictTweet(isA ? data : splitDataA!),
          predictTweet(isA ? splitDataB! : data),
        ]);

        const qualityA = getQualityMetrics(responseA.likes, responseA.retweets, responseA.replies);
        const qualityB = getQualityMetrics(responseB.likes, responseB.retweets, responseB.replies);

        setSplitResultsA({
          likes: responseA.likes,
          retweets: responseA.retweets,
          replies: responseA.replies,
          quality: qualityA,
        });

        setSplitResultsB({
          likes: responseB.likes,
          retweets: responseB.retweets,
          replies: responseB.replies,
          quality: qualityB,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to get predictions. Please try again.",
          variant: "destructive",
        });
        console.error('Split prediction error:', error);
      } finally {
        setIsLoadingSplit(false);
      }
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-1">Tweet Engagement Predictor</h1>
      <p className="text-center text-gray-500 max-w-2xl mx-auto mb-6">
        Predict how your tweet will perform before posting.
      </p>
      <Tabs defaultValue="single" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 bg-transparent border border-gray-200 rounded-full overflow-hidden mb-6 h-14 items-center">
          <TabsTrigger value="single" className="transition-all font-semibold rounded-full px-6 py-2 text-base border-none flex items-center justify-center h-full data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black data-[state=inactive]:border-none">
            Single Tweet Mode
          </TabsTrigger>
          <TabsTrigger value="split" className="transition-all font-semibold rounded-full px-6 py-2 text-base border-none flex items-center justify-center h-full data-[state=active]:bg-black data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-black data-[state=inactive]:border-none">
            Split-Test Mode
          </TabsTrigger>
        </TabsList>

        <TabsContent value="single" className="space-y-6">
          <TweetInputBlock
            onPredict={handleSinglePredict}
            isLoading={isLoadingSingle}
          />
          {singleResults && (
            <PredictionResults
              data={singleResults.quality}
            />
          )}
        </TabsContent>

        <TabsContent value="split" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tweet A</h3>
              <TweetInputBlock
                onPredict={(data) => handleSplitPredict(data, true)}
                isLoading={isLoadingSplit}
              />
              {splitResultsA && (
                <PredictionResults
                  data={splitResultsA.quality}
                  title="Tweet A Results"
                />
              )}
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tweet B</h3>
              <TweetInputBlock
                onPredict={(data) => handleSplitPredict(data, false)}
                isLoading={isLoadingSplit}
              />
              {splitResultsB && (
                <PredictionResults
                  data={splitResultsB.quality}
                  title="Tweet B Results"
                />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 