import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TweetPredictionRequest } from '@/lib/api';
import { AtSign, Hash, Quote, BarChart2, Link, Video, Image, Copy, X, Clock, BarChart3 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface TweetInputBlockProps {
  onPredict: (data: TweetPredictionRequest) => void;
  isLoading?: boolean;
  compact?: boolean;
}

export function TweetInputBlock({ onPredict, isLoading = false, compact = false }: TweetInputBlockProps) {
  const [text, setText] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [hasLink, setHasLink] = useState(false);
  const [hasMention, setHasMention] = useState(false);
  const [hasCryptoMention, setHasCryptoMention] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [hasPoll, setHasPoll] = useState(false);
  const [timePosted, setTimePosted] = useState(new Date());

  const handlePredict = () => {
    if (!text.trim()) return;
    const data: TweetPredictionRequest = {
      text: text.trim(),
      has_image: hasImage,
      has_video: hasVideo,
      has_link: hasLink,
      has_mention: hasMention,
      has_crypto_mention: hasCryptoMention,
      is_quoting: isQuoting,
      has_poll: hasPoll,
      time_posted: timePosted.toISOString(),
    };
    onPredict(data);
  };

  const handleClear = () => {
    setText('');
    setHasImage(false);
    setHasVideo(false);
    setHasLink(false);
    setHasMention(false);
    setHasCryptoMention(false);
    setIsQuoting(false);
    setHasPoll(false);
    setTimePosted(new Date());
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
  };

  // Generate time options for the select
  const timeOptions = Array.from({ length: 24 * 2 }, (_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 === 0 ? '00' : '30';
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute}`,
      label: `${displayHour}:${minute} ${period}`
    };
  });

  const toggleButton = (active: boolean, onClick: () => void, icon: JSX.Element, label: string) => (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={onClick}
      className={`border-gray-300 ${active ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700'} transition-colors`}
      aria-label={label}
    >
      {icon}
    </Button>
  );

  return (
    <div className="space-y-6 bg-white rounded-2xl border border-gray-200 shadow-lg p-8">
      <div className="space-y-4">
        <Textarea
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[120px] resize-none text-lg !placeholder-gray-400 bg-gray-50 border border-gray-200 focus:border-gray-400 focus:ring-0 rounded-xl"
          maxLength={2000}
        />
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setHasImage((v) => !v)}
              className={`border-gray-300 flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium transition-colors
                ${hasImage ? 'bg-black text-white border-black' : 'bg-white text-gray-700'}
                hover:bg-black hover:text-white hover:border-black`}
              aria-label="Image"
            >
              <Image className="w-5 h-5" /> Image
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setHasVideo((v) => !v)}
              className={`border-gray-300 flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium transition-colors
                ${hasVideo ? 'bg-black text-white border-black' : 'bg-white text-gray-700'}
                hover:bg-black hover:text-white hover:border-black`}
              aria-label="Video"
            >
              <Video className="w-5 h-5" /> Video
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setHasLink((v) => !v)}
              className={`border-gray-300 flex items-center gap-2 px-4 py-2 rounded-xl text-base font-medium transition-colors
                ${hasLink ? 'bg-black text-white border-black' : 'bg-white text-gray-700'}
                hover:bg-black hover:text-white hover:border-black`}
              aria-label="Link"
            >
              <Link className="w-5 h-5" /> Link
            </Button>
          </div>
          <span className="text-sm text-gray-400 ml-2">{text.length}/2000</span>
        </div>
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 w-full">
            <Label htmlFor="time-posted">Schedule for:</Label>
            <div className="flex items-center gap-2 mt-1">
              <Select
                value={format(timePosted, 'HH:mm')}
                onValueChange={(value) => {
                  const [hours, minutes] = value.split(':').map(Number);
                  const newDate = new Date(timePosted);
                  newDate.setHours(hours, minutes);
                  setTimePosted(newDate);
                }}
              >
                <SelectTrigger className="w-28 bg-gray-50 border border-gray-200 focus:border-black focus:ring-0 rounded-xl text-black placeholder:text-gray-400" style={{ width: '7rem' }}>
                  <SelectValue placeholder="Select time" className="!text-black placeholder:text-gray-400" />
                </SelectTrigger>
                <SelectContent 
                  className="w-28 text-black border-black focus:border-black focus:ring-0" 
                  style={{ width: '7rem', borderColor: 'black', boxShadow: '0 0 0 2px black' }}
                >
                  {timeOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="!text-black data-[state=checked]:bg-transparent data-[state=checked]:!text-black data-[highlighted]:bg-gray-200 data-[highlighted]:!text-black"
                    >
                      <span className="w-full flex items-center">{option.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex gap-2 mt-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClear} 
            className="flex items-center gap-2 border-black hover:bg-black hover:text-white"
          >
            <X className="w-4 h-4" /> Clear
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCopy} 
            className="flex items-center gap-2 border-black hover:bg-black hover:text-white"
          >
            <Copy className="w-4 h-4" /> Copy
          </Button>
          <Button
            onClick={handlePredict}
            disabled={!text.trim() || isLoading}
            className={`ml-auto flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-full transition-colors shadow-md ${compact ? 'py-1 px-3 text-sm' : 'py-2 px-6 text-base'}`}
          >
            <BarChart3 className="w-5 h-5" />
            {isLoading ? 'Predicting...' : 'Predict Engagement'}
          </Button>
        </div>
      </div>
    </div>
  );
}
