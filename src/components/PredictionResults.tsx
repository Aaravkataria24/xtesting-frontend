import { TrendingUp, Heart, Repeat2, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PredictionData {
  likes: { value: number; quality: string; color: string };
  retweets: { value: number; quality: string; color: string };
  replies: { value: number; quality: string; color: string };
  engagement: { value: number; quality: string; color: string };
}

interface PredictionResultsProps {
  data: PredictionData;
  title?: string;
}

const PredictionResults = ({ data, title }: PredictionResultsProps) => {
  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 shadow-lg p-6 animate-fade-in">
      {title && (
        <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">{title}</h3>
      )}
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-red-50 to-pink-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-red-100 rounded-full">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide">Likes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900 mb-3">{data.likes.value.toLocaleString()}</p>
            <Badge className={`font-semibold px-3 py-1 ${data.likes.color}`}>
              {data.likes.quality}
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-green-50 to-emerald-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-green-100 rounded-full">
                <Repeat2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide">Retweets</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900 mb-3">{data.retweets.value.toLocaleString()}</p>
            <Badge className={`font-semibold px-3 py-1 ${data.retweets.color}`}>
              {data.retweets.quality}
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-blue-50 to-cyan-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-blue-100 rounded-full">
                <MessageCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide">Replies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900 mb-3">{data.replies.value.toLocaleString()}</p>
            <Badge className={`font-semibold px-3 py-1 ${data.replies.color}`}>
              {data.replies.quality}
            </Badge>
          </CardContent>
        </Card>

        <Card className="text-center border-2 border-slate-200 shadow-md hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-violet-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-center mb-2">
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-black text-slate-900 mb-3">{data.engagement.value}%</p>
            <Badge className={`font-semibold px-3 py-1 ${data.engagement.color}`}>
              {data.engagement.quality}
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { PredictionResults };
