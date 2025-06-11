
import { useState, useEffect } from 'react';
import { Calendar, Copy, Image, Video, Link as LinkIcon, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface TweetInputBlockProps {
  onPredict: (data: {
    text: string;
    hasImage: boolean;
    hasVideo: boolean;
    hasLink: boolean;
    scheduledTime: string;
  }) => void;
  title?: string;
  showPredictButton?: boolean;
}

const TweetInputBlock = ({ onPredict, title, showPredictButton = true }: TweetInputBlockProps) => {
  const [text, setText] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasLink, setHasLink] = useState(false);
  const [scheduledTime, setScheduledTime] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const now = new Date();
    const formatted = now.toISOString().slice(0, 16);
    setScheduledTime(formatted);
  }, []);

  // Auto-trigger onPredict when data changes (for split mode)
  useEffect(() => {
    if (!showPredictButton && text.trim()) {
      onPredict({
        text,
        hasImage,
        hasVideo,
        hasLink,
        scheduledTime,
      });
    }
  }, [text, hasImage, hasVideo, hasLink, scheduledTime, showPredictButton, onPredict]);

  const handleClear = () => {
    setText('');
    setHasImage(false);
    setHasVideo(false);
    setHasLink(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Tweet text copied to clipboard",
    });
  };

  const handlePredict = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter some tweet text",
        variant: "destructive",
      });
      return;
    }

    onPredict({
      text,
      hasImage,
      hasVideo,
      hasLink,
      scheduledTime,
    });
  };

  const characterCount = text.length;
  const isOverLimit = characterCount > 2000;

  return (
    <div className="bg-white rounded-xl border-2 border-slate-200 shadow-lg overflow-hidden">
      {title && (
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        </div>
      )}
      
      <div className="p-6 space-y-6">
        <div className="relative">
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            className="min-h-[140px] text-lg border-2 border-slate-200 focus:border-slate-400 focus:ring-0 rounded-lg p-4 placeholder:text-slate-400 resize-none bg-slate-50"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant={hasImage ? "default" : "outline"}
            size="sm"
            onClick={() => setHasImage(!hasImage)}
            className={`font-semibold transition-all ${
              hasImage 
                ? 'bg-slate-900 text-white hover:bg-slate-700' 
                : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400'
            }`}
          >
            <Image className="w-4 h-4 mr-2" />
            Image
          </Button>
          <Button
            variant={hasVideo ? "default" : "outline"}
            size="sm"
            onClick={() => setHasVideo(!hasVideo)}
            className={`font-semibold transition-all ${
              hasVideo 
                ? 'bg-slate-900 text-white hover:bg-slate-700' 
                : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400'
            }`}
          >
            <Video className="w-4 h-4 mr-2" />
            Video
          </Button>
          <Button
            variant={hasLink ? "default" : "outline"}
            size="sm"
            onClick={() => setHasLink(!hasLink)}
            className={`font-semibold transition-all ${
              hasLink 
                ? 'bg-slate-900 text-white hover:bg-slate-700' 
                : 'border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400'
            }`}
          >
            <LinkIcon className="w-4 h-4 mr-2" />
            Link
          </Button>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg border border-slate-200">
          <Clock className="w-5 h-5 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Schedule for:</span>
          <input
            type="datetime-local"
            value={scheduledTime}
            onChange={(e) => setScheduledTime(e.target.value)}
            className="text-sm text-slate-700 bg-white border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent"
          />
        </div>

        <div className="flex justify-between items-center pt-4 border-t-2 border-slate-100">
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClear}
              className="border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 font-semibold"
            >
              <X className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCopy}
              className="border-slate-300 text-slate-600 hover:bg-slate-100 hover:border-slate-400 font-semibold"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <span className={`text-sm font-medium ${isOverLimit ? 'text-red-600' : 'text-slate-500'}`}>
              {characterCount}/2000
            </span>
            {showPredictButton && (
              <Button 
                onClick={handlePredict}
                disabled={isOverLimit || !text.trim()}
                className="bg-slate-900 hover:bg-slate-700 text-white font-bold px-6 py-2 disabled:bg-slate-300 disabled:text-slate-500"
              >
                Predict Engagement
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetInputBlock;
