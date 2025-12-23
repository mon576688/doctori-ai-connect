import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  patient: {
    first_name: string | null;
    last_name: string | null;
    photo_url: string | null;
  };
}

interface ReviewsListProps {
  providerId: string;
}

export function ReviewsList({ providerId }: ReviewsListProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    fetchReviews();
  }, [providerId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          created_at,
          profiles!reviews_patient_id_fkey (
            first_name,
            last_name,
            photo_url
          )
        `)
        .eq('provider_id', providerId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReviews = (data || []).map(r => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        created_at: r.created_at,
        patient: r.profiles || { first_name: null, last_name: null, photo_url: null }
      }));

      setReviews(formattedReviews);

      // Calculate average rating
      if (formattedReviews.length > 0) {
        const avg = formattedReviews.reduce((sum, r) => sum + r.rating, 0) / formattedReviews.length;
        setAverageRating(Math.round(avg * 10) / 10);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          Loading reviews...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Patient Reviews
          </div>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{averageRating}</span>
              <div>
                {renderStars(Math.round(averageRating))}
                <p className="text-sm text-muted-foreground">
                  {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="h-12 w-12 mx-auto mb-4" />
            <p>No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-0">
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarImage src={review.patient.photo_url || undefined} />
                    <AvatarFallback>
                      {review.patient.first_name?.charAt(0) || 'P'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">
                        {review.patient.first_name || 'Anonymous'} {review.patient.last_name?.charAt(0) || ''}.
                      </p>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(review.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                    <div className="mt-1">
                      {renderStars(review.rating)}
                    </div>
                    {review.comment && (
                      <p className="mt-2 text-muted-foreground">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
