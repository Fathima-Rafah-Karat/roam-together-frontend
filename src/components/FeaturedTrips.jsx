import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllTrips } from "@/api/tripsApi";
import { getImageUrl } from "@/utils/getImageUrl";

const FeaturedTrips = () => {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
                const data = await getAllTrips();

        setTrips(data || []);
      } catch (err) {
        console.error("Failed to fetch trips", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  if (loading) return <p className="text-center py-10">Loading trips...</p>;

  const displayedTrips = showAll ? trips : trips.slice(0, 6);

  return (
    <section id="discover" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Featured Trips</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover handpicked adventures curated by verified organizers
          </p>
        </div>

        {/* Trips Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {displayedTrips.map((trip) => {
            const imageUrl = getImageUrl(trip.tripPhoto?.[0]);


            return (
              <Card
                key={trip._id}
                className="relative overflow-hidden h-96 cursor-pointer hover:shadow-xl transition-shadow"
                // onClick={() => navigate(`/trips/${trip._id}`)} // Navigate to details
              >
                <img
                  src={imageUrl}
                  alt={trip.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/25 to-black/10" />

                <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                  {/* Tags */}
                  {trip.tags?.length > 0 && (
                    <div className="flex gap-2 flex-wrap mb-2">
                      {trip.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <CardTitle className="text-3xl font-bold mb-3">{trip.title}</CardTitle>

                  <CardDescription className="flex items-center gap-2 mb-2">
                    <div className="flex items-center rounded-lg px-2 gap-2 bg-white text-black">
                      <MapPin className="h-4 w-4 text-blue-500" />
                      {trip.location}
                    </div>
                  </CardDescription>

                  <div className="flex gap-8 text-sm text-white pt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-5 w-5" />
                      {new Date(trip.startDate).toLocaleDateString("en-GB")} -{" "}
                      {new Date(trip.endDate).toLocaleDateString("en-GB")}
                    </span>

                    <span className="flex items-center gap-1">
                      <Users className="h-5 w-5" />
                      {trip.participants}
                    </span>
                  </div>

                  <Button
                    className="w-full mt-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/trips/${trip._id}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* View All Trips */}
        {!showAll && trips.length > 3 && (
          <div className="text-center">
            <Button size="lg" variant="outline" onClick={() => setShowAll(true)}>
              View All Trips
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedTrips;
