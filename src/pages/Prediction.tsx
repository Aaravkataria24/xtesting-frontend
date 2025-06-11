
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TweetInputBlock from '@/components/TweetInputBlock';
import PredictionResults from '@/components/PredictionResults';

const Prediction = () => {
  const [singleResults, setSingleResults] = useState(null);
  const [splitResultsA, setSplitResultsA] = useState(null);
  const [splitResultsB, setSplitResultsB] = useState(null);
  const [splitDataA, setSplitDataA] = useState(null);
  const [splitDataB, setSplitDataB] = useState(null);

  const generateMockPrediction = () => {
    const qualities = [
      { quality: 'Very Bad', color: 'bg-red-500 text-white' },
      { quality: 'Bad', color: 'bg-orange-500 text-white' },
      { quality: 'Good', color: 'bg-emerald-500 text-white' },
      { quality: 'Very Good', color: 'bg-blue-500 text-white' },
      { quality: 'Excellent', color: 'bg-purple-500 text-white' }
    ];

    const getRandomQuality = () => qualities[Math.floor(Math.random() * qualities.length)];

    return {
      likes: { value: Math.floor(Math.random() * 10000), ...getRandomQuality() },
      retweets: { value: Math.floor(Math.random() * 5000), ...getRandomQuality() },
      replies: { value: Math.floor(Math.random() * 2000), ...getRandomQuality() },
      engagement: { value: Math.floor(Math.random() * 100), ...getRandomQuality() }
    };
  };

  const handleSinglePredict = (data: any) => {
    console.log('Single prediction data:', data);
    setSingleResults(generateMockPrediction());
  };

  const handleSplitDataA = (data: any) => {
    console.log('Split data A:', data);
    setSplitDataA(data);
  };

  const handleSplitDataB = (data: any) => {
    console.log('Split data B:', data);
    setSplitDataB(data);
  };

  const handleSplitPredict = () => {
    if (splitDataA && splitDataB) {
      setSplitResultsA(generateMockPrediction());
      setSplitResultsB(generateMockPrediction());
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 font-apex">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Tweet Engagement Prediction</h1>
          <p className="text-lg text-gray-600">Predict how your tweet will perform before posting</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <Tabs defaultValue="single" className="w-full">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 bg-white shadow-sm border border-gray-200 h-12">
                <TabsTrigger 
                  value="single" 
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:text-gray-700 font-semibold py-3 h-10 transition-all duration-200"
                >
                  Single Tweet Mode
                </TabsTrigger>
                <TabsTrigger 
                  value="split" 
                  className="data-[state=active]:bg-gray-900 data-[state=active]:text-white data-[state=inactive]:text-gray-700 font-semibold py-3 h-10 transition-all duration-200"
                >
                  Split-Test Mode
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-8">
              <TabsContent value="single" className="space-y-8 mt-0">
                <TweetInputBlock onPredict={handleSinglePredict} showPredictButton={true} />
                {singleResults && (
                  <PredictionResults data={singleResults} title="Prediction Results" />
                )}
              </TabsContent>

              <TabsContent value="split" className="space-y-8 mt-0">
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <TweetInputBlock onPredict={handleSplitDataA} title="Tweet A" showPredictButton={false} />
                  </div>
                  <div className="space-y-6">
                    <TweetInputBlock onPredict={handleSplitDataB} title="Tweet B" showPredictButton={false} />
                  </div>
                </div>
                
                <div className="text-center pt-4">
                  <Button 
                    onClick={handleSplitPredict}
                    disabled={!splitDataA || !splitDataB}
                    className="bg-gray-900 hover:bg-gray-700 text-white font-bold px-8 py-3 text-lg disabled:bg-gray-300 disabled:text-gray-500"
                  >
                    Predict Both Tweets
                  </Button>
                </div>

                {(splitResultsA || splitResultsB) && (
                  <div className="grid lg:grid-cols-2 gap-8 mt-8">
                    {splitResultsA && (
                      <PredictionResults data={splitResultsA} title="Results A" />
                    )}
                    {splitResultsB && (
                      <PredictionResults data={splitResultsB} title="Results B" />
                    )}
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Prediction;
