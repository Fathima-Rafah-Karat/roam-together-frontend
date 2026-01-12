import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllTrips } from "../api/tripsApi";
import { getImageUrl } from "../utils/getImageUrl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar } from "lucide-react";
import { motion } from "framer-motion";

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const data = await getAllTrips();
        const tripsData = data.data || [];
        setTrips(tripsData);
      } catch (err) {
        console.error("Failed to load trips", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, []);

  if (loading) {
    return (
      <p className="text-center py-10 text-gray-400 text-xl">Loading trips...</p>
    );
  }

  return (
    <div className="container mx-auto px-4 pb-12">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-2">
        Trips 
      </h1>
      <p className="text-muted-foreground mb-8">Explore all available trips</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip, index) => {
                     const imageUrl = getImageUrl(trip.tripPhoto?.[0]);


          return (
            <motion.div
              key={trip._id}
              className="relative rounded-xl overflow-hidden h-96 cursor-pointer shadow-lg hover:shadow-xl transition duration-300"
              
              onClick={() => navigate(`/admin/Trips/${trip._id}`)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={imageUrl}
                alt={trip.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/10" />

              <div className="relative z-20 h-full flex flex-col justify-end p-5 text-white">
                {trip.tags?.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {trip.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-white/20 text-white border-white/30 backdrop-blur-md text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
                <h3 className="text-2xl font-bold mb-3">{trip.title}</h3>

                <div className="flex items-center mb-3">
                  <div className="flex items-center gap-2 bg-white text-black px-2 py-1 rounded-md">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    {trip.location}
                  </div>
                </div>

                <div className="flex justify-between text-sm text-gray-200 mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(trip.startDate).toLocaleDateString("en-GB")} -{" "}
                    {new Date(trip.endDate).toLocaleDateString("en-GB")}
                  </span>

                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" /> {trip.participants}
                  </span>
                </div>

                <Button
                  className="w-full mt-3 bg-primary hover:bg-primary/90"
                  onClick={(e) => {
                    e.stopPropagation();

                   
                    navigate(`/admin/Trips/${trip._id}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

