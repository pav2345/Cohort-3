import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, X, Film, Loader2, Play } from 'lucide-react';
import api from '@/lib/axios';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const PartnerUpload: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a video file.',
          variant: 'destructive',
        });
        return;
      }

      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const removeVideo = () => {
    setVideoFile(null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!videoFile) {
      toast({
        title: 'Video required',
        description: 'Please select a video to upload.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('mama', videoFile); // Field name as specified

      await api.post('/api/food', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast({
        title: 'Upload successful! 🎉',
        description: 'Your food reel has been published.',
      });

      navigate('/partner/dashboard');
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.response?.data?.message || 'Could not upload your food reel.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen p-6 pb-24">
        {/* Back Button */}
        <Link
          to="/partner/dashboard"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="max-w-2xl mx-auto animate-fade-in">
          <h1 className="text-2xl font-bold text-foreground mb-2">Upload Food Reel</h1>
          <p className="text-muted-foreground mb-8">
            Share your delicious creation with food lovers
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Video Upload */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Video
              </label>
              {videoPreview ? (
                <Card className="overflow-hidden border-border">
                  <CardContent className="p-0">
                    <div className="relative aspect-[9/16] max-h-[400px] bg-card">
                      <video
                        src={videoPreview}
                        className="w-full h-full object-contain"
                        controls
                        preload="metadata"
                      />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card
                  className="border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <CardContent className="p-12">
                    <div className="text-center">
                      <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                        <Film className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <p className="text-foreground font-medium mb-1">
                        Click to upload video
                      </p>
                      <p className="text-sm text-muted-foreground">
                        MP4, MOV, or WebM (max 100MB)
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Food Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Food Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="e.g., Spicy Korean Ramen"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Tell us about this dish..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="resize-none"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isUploading || !videoFile}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Publish Reel
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PartnerUpload;
