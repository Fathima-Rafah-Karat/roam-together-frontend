

import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Search,ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function JoinTrip() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [registeredTrips, setRegisteredTrips] = useState([]); // only trip IDs

  // Fetch all trips
  const fetchTrips = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/traveler/trips");

      const tripsData = res.data.data || [];
      setTrips(tripsData);
      setFilteredTrips(tripsData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  // Fetch trips user has registered for
  const fetchUserRegistrations = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        "http://localhost:5000/api/traveler/registered",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (res.data.success) {
        // backend returns full trip objects → convert to only IDs
        const ids = res.data.data.map((trip) => trip._id);
        setRegisteredTrips(ids);
      }
    } catch (err) {
      console.error("Error fetching registrations:", err);
    }
  };

  useEffect(() => {
    fetchTrips();
    fetchUserRegistrations();
  }, []);

  // Search handler
  const handleSearch = (query) => {
    setSearch(query);

    if (!query) {
      setFilteredTrips(trips);
      return;
    }

    const filtered = trips.filter((trip) =>
      trip.location.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredTrips(filtered);
  };

  return (
    <div className="space-y-6 ">
        <div className="flex items-center gap-2 ml-5 mt-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted-foreground hover:text-primary transition"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="text-sm"></span>
      </button>
    </div>
      <div className="text-center mt-20"> 
        <h1 className="text-4xl  font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-2">
          Discover Amazing Trips
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore curated travel experiences from around the world
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
          <Search className="h-4 w-4 " />
        </span>
        <input
          type="text"
          placeholder="Search by location..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10  p-2 border rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-center text-muted-foreground text-xl py-10">
          Loading trips...
        </p>
      )}

      {/* No trips */}
      {!loading && filteredTrips.length === 0 && (
        <Card className="p-12 text-center text-lg">No trips available</Card>
      )}

      {/* Trip Grid */}
      <div className= " ml-5 mr-5 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.map((trip) => {
          const imageUrl =
            trip.tripPhoto && trip.tripPhoto.length > 0
              ? `http://localhost:5000/${trip.tripPhoto[0].replace(/^\/+/, "")}`
              : "/fallback.jpg";

          const isRegistered = registeredTrips.includes(trip._id);

          return (
            <Card
              key={trip._id}
              className="relative overflow-hidden h-96 cursor-pointer hover:shadow-xl transition-shadow"
            >
              <img
                src={imageUrl}
                alt={trip.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/20 to-black/10" />

              {/* Registered Badge */}
              <div className="absolute top-3 right-3 z-20">
                {isRegistered && (
                  <Badge className="!bg-green-600 text-white">Registered</Badge>
                )}
              </div>

              <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
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

                <CardTitle className="text-3xl font-bold mb-4">
                  {trip.title}
                </CardTitle>

                <CardDescription className="flex items-center gap-2">
                  <div className="flex items-center rounded-lg px-2 gap-2 bg-white text-black">
                    <MapPin className="text-blue-400 h-4 w-4" />
                    {trip.location}
                  </div>
                </CardDescription>

                <div className="flex gap-10 text-sm text-white pt-2">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-5 w-5" />
                    {new Date(trip.startDate).toLocaleDateString("en-GB")} -{" "}
                    {new Date(trip.endDate).toLocaleDateString("en-GB")}
                  </span>

                  <span className="flex items-center gap-1">
                    <Users className="h-5 w-5" /> {trip.participants}
                  </span>
                </div>

                <Button
                  className="w-full mt-3"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/dash/trip/${trip._id}`);
                  }}
                >
                  View Details
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}


















