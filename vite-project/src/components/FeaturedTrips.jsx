import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, MapPin, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import beachImage from "@/assets/trip-beach.jpg";
import cityImage from "@/assets/trip-city.jpg";
import mountainImage from "@/assets/trip-mountain.jpg";

const trips = [
  {
    id: 1,
    title: "Tropical Paradise Escape",
    location: "Maldives",
    image: beachImage,
    dates: "Jun 15-22, 2025",
    participants: 8,
    maxParticipants: 12,
    organizer: "Sarah Chen",
    rating: 4.9,
    verified: true,
  },
  {
    id: 2,
    title: "European Cultural Journey",
    location: "Italy & Spain",
    image: cityImage,
    dates: "Jul 10-24, 2025",
    participants: 6,
    maxParticipants: 10,
    organizer: "Marco Rossi",
    rating: 5.0,
    verified: true,
  },
  {
    id: 3,
    title: "Mountain Adventure Trek",
    location: "Nepal",
    image: mountainImage,
    dates: "Sep 5-18, 2025",
    participants: 5,
    maxParticipants: 8,
    organizer: "Tenzing Sherpa",
    rating: 4.8,
    verified: true,
  },
];

const FeaturedTrips = () => {
  const navigate = useNavigate();
  
  return (
    <section id="discover" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Featured Trips</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover handpicked adventures curated by verified organizers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <Card key={trip.id} className="overflow-hidden hover:shadow-[var(--shadow-large)] transition-all duration-300 hover:scale-[1.02]">
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={trip.image} 
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-card/90 backdrop-blur-sm border-0">
                    <Star className="h-3 w-3 fill-accent text-accent mr-1" />
                    {trip.rating}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-primary">{trip.location}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3">{trip.title}</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{trip.dates}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{trip.participants}/{trip.maxParticipants} travelers joined</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
                    <div className="text-sm">
                      <div className="font-medium">{trip.organizer}</div>
                      {trip.verified && (
                        <div className="text-xs text-muted-foreground">Verified Organizer</div>
                      )}
                    </div>
                  </div>
                  <Button size="sm" variant="default" >
                    Join Trip
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
            View All Trips
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTrips;
