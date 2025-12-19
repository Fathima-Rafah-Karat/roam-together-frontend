import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

const gradientClasses = [
  "bg-gradient-to-br from-primary to-secondary",
  "bg-gradient-to-br from-secondary to-accent",
  "bg-gradient-to-br from-accent to-primary",
];

// ⭐ Safely normalize rating (1–5)
const getSafeRating = (rating) => {
  const num = Number(rating);
  if (Number.isNaN(num)) return 5;
  return Math.min(Math.max(Math.floor(num), 1), 5);
};

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false); // only expand once

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/traveler/review&rating/rateandreview"
        );

        setReviews(Array.isArray(res.data?.data) ? res.data.data : []);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading) return null;

  // ⭐ Show first 6, then all after clicking Show More
  const visibleReviews = showAll ? reviews : reviews.slice(0, 6);

  return (
    <section id="stories" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Traveler Stories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our amazing community of adventurers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {visibleReviews.map((review, index) => {
            const rating = getSafeRating(review.rating);

            const profileImage = review.TravelerId?.photo
              ? `http://localhost:5000/${review.TravelerId.photo.replace(
                  /^\/+/,
                  ""
                )}`
              : null;

            return (
              <Card
                key={review._id || index}
                className="hover:shadow-[var(--shadow-large)] transition-all duration-300"
              >
                <CardContent className="pt-8 pb-6 px-6">
                  {/* Quote */}
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />

                  {/* ⭐ Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-accent text-accent"
                      />
                    ))}
                  </div>

                  {/* Review */}
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    "{review.review || "Amazing experience!"}"
                  </p>

                  {/* User Info */}
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={review.TravelerId?.name}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full ${
                          gradientClasses[index % gradientClasses.length]
                        }`}
                      />
                    )}

                    <div>
                      <div className="font-semibold">
                        {review.TravelerId?.name || "Anonymous"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {review.TravelerId?.role || "Traveler"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ⭐ Show More Button (NO Show Less) */}
        {!showAll && reviews.length > 6 && (
          <div className="flex justify-center mt-12">
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
            >
              More Reviews
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && reviews.length === 0 && (
          <p className="text-center text-muted-foreground text-lg mt-10">
            No reviews available yet
          </p>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
