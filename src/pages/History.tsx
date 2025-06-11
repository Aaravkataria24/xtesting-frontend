
import { Calendar, TrendingUp, Heart, Repeat2, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const History = () => {
  // Mock historical data
  const historyData = [
    {
      id: 1,
      text: "Just shipped a new feature that will revolutionize how we think about productivity! 🚀",
      timestamp: "2024-05-30T14:30:00Z",
      predictions: {
        likes: { value: 2500, quality: 'Very Good' },
        retweets: { value: 850, quality: 'Good' },
        replies: { value: 420, quality: 'Good' },
        engagement: { value: 85, quality: 'Very Good' }
      },
      actualResults: {
        likes: 2340,
        retweets: 890,
        replies: 380,
        engagement: 82
      }
    },
    {
      id: 2,
      text: "Coffee thoughts: Why do we always overthink the simple things but rush through the complex ones? ☕",
      timestamp: "2024-05-29T09:15:00Z",
      predictions: {
        likes: { value: 1200, quality: 'Good' },
        retweets: { value: 350, quality: 'Good' },
        replies: { value: 180, quality: 'Good' },
        engagement: { value: 65, quality: 'Good' }
      },
      actualResults: {
        likes: 1150,
        retweets: 320,
        replies: 195,
        engagement: 68
      }
    },
    {
      id: 3,
      text: "Excited to announce our partnership with @TechCorp! This is going to be huge! 🎉",
      timestamp: "2024-05-28T16:45:00Z",
      predictions: {
        likes: { value: 3200, quality: 'Excellent' },
        retweets: { value: 1200, quality: 'Very Good' },
        replies: { value: 580, quality: 'Very Good' },
        engagement: { value: 92, quality: 'Excellent' }
      },
      actualResults: {
        likes: 3450,
        retweets: 1180,
        replies: 620,
        engagement: 95
      }
    }
  ];

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccuracy = (predicted: number, actual: number) => {
    const diff = Math.abs(predicted - actual);
    const accuracy = Math.max(0, 100 - (diff / predicted) * 100);
    return Math.round(accuracy);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Prediction History</h1>
          <p className="text-gray-600 mt-2">Review your past tweet predictions and their actual performance</p>
        </div>

        <div className="space-y-6">
          {historyData.map((item) => (
            <Card key={item.id} className="w-full">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-lg text-gray-900 mb-2">{item.text}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(item.timestamp)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Predictions */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Predicted</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-sm text-gray-600">Likes</span>
                          </div>
                          <span className="font-semibold">{item.predictions.likes.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Repeat2 className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-600">Retweets</span>
                          </div>
                          <span className="font-semibold">{item.predictions.retweets.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-600">Replies</span>
                          </div>
                          <span className="font-semibold">{item.predictions.replies.value.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                            <span className="text-sm text-gray-600">Engagement</span>
                          </div>
                          <span className="font-semibold">{item.predictions.engagement.value}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actual Results */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Actual Results</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Heart className="w-4 h-4 text-red-500 mr-2" />
                            <span className="text-sm text-gray-600">Likes</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{item.actualResults.likes.toLocaleString()}</span>
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                              {getAccuracy(item.predictions.likes.value, item.actualResults.likes)}% acc
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Repeat2 className="w-4 h-4 text-green-500 mr-2" />
                            <span className="text-sm text-gray-600">Retweets</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{item.actualResults.retweets.toLocaleString()}</span>
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                              {getAccuracy(item.predictions.retweets.value, item.actualResults.retweets)}% acc
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <MessageCircle className="w-4 h-4 text-blue-500 mr-2" />
                            <span className="text-sm text-gray-600">Replies</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{item.actualResults.replies.toLocaleString()}</span>
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                              {getAccuracy(item.predictions.replies.value, item.actualResults.replies)}% acc
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 text-purple-500 mr-2" />
                            <span className="text-sm text-gray-600">Engagement</span>
                          </div>
                          <div className="text-right">
                            <span className="font-semibold">{item.actualResults.engagement}%</span>
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">
                              {getAccuracy(item.predictions.engagement.value, item.actualResults.engagement)}% acc
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
