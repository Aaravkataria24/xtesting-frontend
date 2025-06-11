import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { TweetPredictionRequest } from '@/lib/api';
import { AtSign, Hash, Quote, BarChart2, Link, Video } from 'lucide-react';

interface TweetInputBlockProps {
  onPredict: (data: TweetPredictionRequest) => void;
  isLoading?: boolean;
}

export function TweetInputBlock({ onPredict, isLoading = false }: TweetInputBlockProps) {
  const [text, setText] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasLink, setHasLink] = useState(false);
  const [hasMention, setHasMention] = useState(false);
  const [hasCryptoMention, setHasCryptoMention] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [hasPoll, setHasPoll] = useState(false);
  const [followerCount, setFollowerCount] = useState(1000);
  const [timePosted, setTimePosted] = useState(new Date().toISOString());

  const handlePredict = () => {
    if (!text.trim()) {
      return;
    }

    const data: TweetPredictionRequest = {
      text: text.trim(),
      has_image: hasImage,
      has_video: hasVideo,
      has_link: hasLink,
      has_mention: hasMention,
      has_crypto_mention: hasCryptoMention,
      is_quoting: isQuoting,
      has_poll: hasPoll,
      follower_count: followerCount,
      time_posted: timePosted,
    };

    onPredict(data);
  };

  return (
    <div className="space-y-6 bg-white rounded-xl border-2 border-slate-200 shadow-lg p-6">
      <div className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px] resize-none text-lg"
            maxLength={280}
          />
          <div className="absolute bottom-2 right-2 text-sm text-gray-500">
            {text.length}/280
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="has-image"
              checked={hasImage}
              onCheckedChange={setHasImage}
              disabled={isLoading}
            />
            <Label htmlFor="has-image" className="flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              Image
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="has-video"
              checked={hasVideo}
              onCheckedChange={setHasVideo}
              disabled={isLoading}
            />
            <Label htmlFor="has-video" className="flex items-center gap-2">
              <Video className="w-4 h-4" />
              Video
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="has-link"
              checked={hasLink}
              onCheckedChange={setHasLink}
              disabled={isLoading}
            />
            <Label htmlFor="has-link" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Link
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="has-mention"
              checked={hasMention}
              onCheckedChange={setHasMention}
              disabled={isLoading}
            />
            <Label htmlFor="has-mention" className="flex items-center gap-2">
              <AtSign className="w-4 h-4" />
              Mention
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="has-crypto"
              checked={hasCryptoMention}
              onCheckedChange={setHasCryptoMention}
              disabled={isLoading}
            />
            <Label htmlFor="has-crypto" className="flex items-center gap-2">
              <Hash className="w-4 h-4" />
              Crypto
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is-quoting"
              checked={isQuoting}
              onCheckedChange={setIsQuoting}
              disabled={isLoading}
            />
            <Label htmlFor="is-quoting" className="flex items-center gap-2">
              <Quote className="w-4 h-4" />
              Quote
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="has-poll"
              checked={hasPoll}
              onCheckedChange={setHasPoll}
              disabled={isLoading}
            />
            <Label htmlFor="has-poll" className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4" />
              Poll
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="follower-count">Follower Count</Label>
            <Input
              id="follower-count"
              type="number"
              value={followerCount}
              onChange={(e) => setFollowerCount(Number(e.target.value))}
              min={0}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time-posted">Time Posted</Label>
            <Input
              id="time-posted"
              type="datetime-local"
              value={timePosted.slice(0, 16)}
              onChange={(e) => setTimePosted(new Date(e.target.value).toISOString())}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handlePredict}
          disabled={!text.trim() || isLoading}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-full transition-colors"
        >
          {isLoading ? 'Predicting...' : 'Predict Engagement'}
        </Button>
      </div>
    </div>
  );
}
