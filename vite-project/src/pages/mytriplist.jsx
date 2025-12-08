import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function TripsList() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login first");
      return;
    }

    axios
      .get("http://localhost:5000/api/organizer/viewtrip", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTrips(res.data.data || []);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load trips");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-center text-muted-foreground text-xl py-10">
        Loading trips...
      </p>
    );
  }

  if (trips.length === 0) {
    return <Card className="p-12 text-center text-lg">No trips available</Card>;
  }

  const now = new Date();

  const renderTrips = (tripList) =>
    tripList.map((trip, index) => {
      const imageUrl =
        trip.tripPhoto && trip.tripPhoto.length > 0
          ? `http://localhost:5000/${trip.tripPhoto[0].replace(/^\/+/, "")}`
          : "/fallback.jpg";

      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);

      let badgeText = "Upcoming";
      let badgeColor = "#16a34a"; // green

      if (end < now) {
        badgeText = "Completed";
        badgeColor = "#6b7280"; // gray
      } else if (start <= now && end >= now) {
        badgeText = "Ongoing";
        badgeColor = "#2563eb"; // blue
      }

      return (
        <motion.div
          key={trip._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className="relative overflow-hidden h-96 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={() => navigate(`/trips/${trip._id}`)}
          >
            {/* Trip Image */}
            <img
              src={imageUrl}
              alt={trip.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-black/10" />

            {/* Status Badge */}
            <div className="absolute top-3 right-3 z-20">
              <Badge
                style={{ backgroundColor: badgeColor, color: "white" }}
                className="px-3 py-1 rounded"
              >
                {badgeText}
              </Badge>
            </div>

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

              <CardTitle className="text-3xl font-bold mb-2">{trip.title}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <div className="flex items-center rounded-lg px-2 gap-2 bg-white text-black">
                  <MapPin className="text-blue-400 h-4 w-4" />
                  {trip.location}
                </div>
              </CardDescription>

              <div className="flex gap-6 text-sm text-white pt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="h-5 w-5" />
                  {start.toLocaleDateString("en-GB")} - {end.toLocaleDateString("en-GB")}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-5 w-5" /> {trip.participants}
                </span>
              </div>

              <Button
                className="w-full mt-3"
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/organizer/TripList/${trip._id}`);
                }}
              >
                View Details
              </Button>
            </div>
          </Card>
        </motion.div>
      );
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-display font-bold text-foreground mb-2">My Trips</h1>
        <p className="text-muted-foreground text-lg">
          Manage and view all your organized trips.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {renderTrips(trips)}
      </div>
    </div>
  );
}
