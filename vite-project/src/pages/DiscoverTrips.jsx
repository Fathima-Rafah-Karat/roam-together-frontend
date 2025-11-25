// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MapPin, Calendar, Users } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const trips = [
//   {
//     id: 1,
//     title: "Bali Adventure",
//     location: "Bali, Indonesia",
//     duration: "7 days",
//     participants: "Max 12",
//     price: "$1,299",
//     image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80",
//     description: "Explore temples, rice terraces, and pristine beaches in this magical island paradise.",
//     tags: ["Adventure", "Culture", "Beach"]
//   },
//   {
//     id: 2,
//     title: "Swiss Alps Trek",
//     location: "Swiss Alps, Switzerland",
//     duration: "10 days",
//     participants: "Max 8",
//     price: "$2,499",
//     image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
//     description: "Trek through stunning mountain landscapes with experienced guides.",
//     tags: ["Adventure", "Hiking", "Nature"]
//   },
//   {
//     id: 3,
//     title: "Tokyo Culture Tour",
//     location: "Tokyo, Japan",
//     duration: "5 days",
//     participants: "Max 15",
//     price: "$1,799",
//     image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80",
//     description: "Immerse yourself in Japanese culture, from ancient temples to modern tech.",
//     tags: ["Culture", "Food", "City"]
//   },
//   {
//     id: 4,
//     title: "Safari Experience",
//     location: "Serengeti, Tanzania",
//     duration: "8 days",
//     participants: "Max 10",
//     price: "$3,299",
//     image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&q=80",
//     description: "Witness the great migration and explore Africa's incredible wildlife.",
//     tags: ["Wildlife", "Adventure", "Nature"]
//   },
//   {
//     id: 5,
//     title: "Iceland Northern Lights",
//     location: "Reykjavik, Iceland",
//     duration: "6 days",
//     participants: "Max 12",
//     price: "$2,199",
//     image: "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&q=80",
//     description: "Chase the aurora borealis and explore volcanic landscapes and hot springs.",
//     tags: ["Nature", "Adventure", "Photography"]
//   },
//   {
//     id: 6,
//     title: "Greek Islands Hopping",
//     location: "Santorini & Mykonos, Greece",
//     duration: "9 days",
//     participants: "Max 14",
//     price: "$1,899",
//     image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
//     description: "Discover white-washed villages, blue-domed churches, and crystal-clear waters.",
//     tags: ["Beach", "Culture", "Relaxation"]
//   }
// ];

// export default function DiscoverTrips() {
//   const navigate = useNavigate();

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent mb-2">
//           Discover Amazing Trips
//         </h1>
//         <p className="text-muted-foreground text-lg">
//           Explore curated travel experiences from around the world
//         </p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {trips.map((trip) => (
//           <Card key={trip.id} className="overflow-hidden hover:shadow-lg transition-shadow">
//             <div className="h-48 overflow-hidden">
//               <img 
//                 src={trip.image} 
//                 alt={trip.title}
//                 className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
//               />
//             </div>

//             <CardHeader>
//               <div className="flex items-start justify-between gap-2 mb-2">
//                 <CardTitle className="text-xl">{trip.title}</CardTitle>
//                 <span className="text-lg font-bold text-accent whitespace-nowrap">{trip.price}</span>
//               </div>

//               <CardDescription className="flex items-center gap-1 text-foreground/70">
//                 <MapPin className="h-4 w-4" />
//                 {trip.location}
//               </CardDescription>
//             </CardHeader>

//             <CardContent className="space-y-3">
//               <p className="text-sm text-muted-foreground">{trip.description}</p>

//               <div className="flex gap-2 flex-wrap">
//                 {trip.tags.map((tag) => (
//                   <Badge key={tag} variant="secondary" className="text-xs">
//                     {tag}
//                   </Badge>
//                 ))}
//               </div>

//               <div className="flex gap-4 text-sm text-muted-foreground pt-2">
//                 <span className="flex items-center gap-1">
//                   <Calendar className="h-4 w-4" />
//                   {trip.duration}
//                 </span>

//                 <span className="flex items-center gap-1">
//                   <Users className="h-4 w-4" />
//                   {trip.participants}
//                 </span>
//               </div>
//             </CardContent>

//             <CardFooter>
//               <Button className="w-full" onClick={() => navigate(`/trip/${trip.id}`)}>
//                 View Details
//               </Button>
//             </CardFooter>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
