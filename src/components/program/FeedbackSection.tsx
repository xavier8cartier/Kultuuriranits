'use client';

import { useState, useEffect } from 'react';
import { Star, MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Review } from '@/lib/types';

interface FeedbackSectionProps {
  reviews?: Review[];
}

export function FeedbackSection({ reviews = [] }: FeedbackSectionProps) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const savedUser = localStorage.getItem('kr_user');
      const userRole = localStorage.getItem('userRole');
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (parsedUser.role === 'teacher' || parsedUser.role === 'museum' || parsedUser.role === 'admin') {
            setIsAuthorized(true);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }
      
      if (userRole === 'teacher' || userRole === 'museum' || userRole === 'admin') {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    };

    checkAuth();
    setIsLoading(false);

    // Listen for login changes
    window.addEventListener('kr-auth-change', checkAuth);
    return () => window.removeEventListener('kr-auth-change', checkAuth);
  }, []);

  if (isLoading) {
    return <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm animate-pulse h-48"></div>;
  }

  // If the user is guest or not logged in, we completely hide it
  if (!isAuthorized) {
    return null;
  }

  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Limit visible reviews unless expanded
  const displayedReviews = isExpanded ? reviews : reviews.slice(0, 2);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm transition-all duration-300">
      {/* Header with Average Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold text-gray-900">Õpetajate tagasiside</h3>
        </div>
        
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 bg-blue-50/50 px-3 py-1.5 rounded-full border border-blue-100/50">
            <span className="text-sm font-bold text-blue-700">{averageRating} / 5</span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`w-3.5 h-3.5 ${
                    star <= Math.round(Number(averageRating))
                      ? 'text-blue-600 fill-blue-600' 
                      : 'text-gray-300 fill-none'
                  }`} 
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">({reviews.length} tagasisidet)</span>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayedReviews.length > 0 ? (
          displayedReviews.map((review, idx) => (
            <div 
              key={review.id} 
              className={`p-4 rounded-xl bg-gray-50 border border-gray-150 flex flex-col gap-3 transition-all duration-300 ${
                idx > 0 ? 'mt-4' : ''
              }`}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100/80 border border-blue-200 text-blue-700 font-bold flex items-center justify-center shrink-0">
                    {review.authorName[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {review.authorName}
                    </h4>
                    <p className="text-xs text-gray-500">
                      {review.authorSchool}
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3.5 h-3.5 ${
                          star <= review.rating 
                            ? 'text-blue-600 fill-blue-600' 
                            : 'text-gray-300 fill-none'
                        }`} 
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-gray-400 font-medium">
                    {review.date}
                  </span>
                </div>
              </div>
              
              <p className="text-sm text-gray-700 italic pl-3 border-l-2 border-blue-200">
                "{review.comment}"
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 italic text-center py-4">
            Sellele programmile ei ole veel tagasisidet lisatud.
          </p>
        )}
      </div>

      {/* Expand / Collapse Button */}
      {reviews.length > 2 && (
        <div className="mt-6 pt-4 border-t border-gray-100 flex justify-center">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="inline-flex items-center gap-1.5 px-6 py-2 rounded-full border border-blue-100 bg-blue-50/50 text-sm font-semibold text-blue-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
          >
            {isExpanded ? (
              <>
                Näita vähem
                <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Näita kõiki tagasisidesid ({reviews.length})
                <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
