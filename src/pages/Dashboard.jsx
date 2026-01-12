

// this seach
// // src/pages/Dashboard.jsx
// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Calendar,
//   Users,
//   MapPin,
//   Search,
//   Filter,
//   Bell,
//   Book,
//   Heart,
//   AlertCircle,
//   LogOut,
// } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//   const navigate = useNavigate();
//   const [searchQuery, setSearchQuery] = useState("");
//   const [notifications] = useState(3);

//   // Mock trips data
//   const trips = [
//     {
//       id: 1,
//       title: "Beach Trip",
//       location: "Goa",
//       description:
//         "Enjoy sun, sand and sea on a relaxing beach trip.",
//       start_date: "2025-12-05",
//       end_date: "2025-12-07",
//       participant_count: 10,
//       max_participants: 20,
//       organizer: { full_name: "John Doe" },
//       theme: "Adventure",
//       banner_image: null,
//     },
//     {
//       id: 2,
//       title: "Mountain Hike",
//       location: "Himalayas",
//       description:
//         "Explore the majestic mountains and enjoy a challenging hike.",
//       start_date: "2025-12-10",
//       end_date: "2025-12-15",
//       participant_count: 8,
//       max_participants: 15,
//       organizer: { full_name: "Jane Smith" },
//       theme: "Fitness",
//       banner_image: null,
//     },
//     {
//       id: 3,
//       title: "City Tour",
//       location: "Mumbai",
//       description:
//         "Discover the culture, food, and nightlife of the city.",
//       start_date: "2025-11-20",
//       end_date: "2025-11-22",
//       participant_count: 12,
//       max_participants: 25,
//       organizer: { full_name: "Bob Johnson" },
//       theme: "Culture",
//       banner_image: null,
//     },
//   ];

//   const filteredTrips = trips.filter(
//     (trip) =>
//       trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       trip.location.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   return (
//     <div className="min-h-screen bg-background relative">
//       {/* <Navbar /> */}

//       <div className="container mx-auto px-4 pt-24 pb-12">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Sidebar */}
//           <aside className="fixed m-5 top-12 left-0 pb-20 w-64 flex flex-col bg-white p-4 shadow-lg rounded-r-lg">
//             {/* Top: Profile */}
//             <div className="flex flex-col items-center mb-6 mt-20">
//               <div className="w-16 h-16 rounded-full bg-gray-200 mb-2" ></div>
//               <div className="text-sm font-semibold">Fathima Rafah</div>
//               <div className="text-xs text-gray-500">Traveler</div>
//             </div>

//             {/* Navigation */}
//             <div className="flex flex-col space-y-2">
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start"
//                 onClick={() => navigate("/")}
//               >
//                 <MapPin className="h-4 w-4 mr-2" />
//                 Discover Trips
//               </Button>
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start"
//                 onClick={() => navigate("/diary")}
//               >
//                 <Book className="h-4 w-4 mr-2" />
//                 Travel Diary
//               </Button>
//               <Button variant="ghost" className="w-full justify-start" onClick={()=>navigate()}>
//                 <Heart className="h-4 w-4 mr-2" />
//                 Community
//               </Button>
//               <Button variant="ghost" className="w-full justify-start relative">
//                 <Bell className="h-4 w-4 mr-2" />
//                 Notifications
//                 {notifications > 0 && <Badge variant="destructive">{notifications}</Badge>}
//               </Button>
//               <Button variant="ghost" className="w-full justify-start">
//                 <AlertCircle className="h-4 w-4 mr-2" />
//                 Emergency Contact
//               </Button>
//             </div>

//             {/* Bottom: Logout */}
//             <div className="mt-auto">
//               <Button
//                 variant="ghost"
//                 className="w-full justify-start text-red-500"
//                 onClick={() => {
//                   console.log("Logging out...");
//                   navigate("/");
//                 }}
//               >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Logout
//               </Button>
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main className="lg:col-span-3 ml-64 ">
//             <div className="mb-8">
//               <h1 className="text-4xl font-bold mb-2">Discover Trips</h1>
//               <p className="text-muted-foreground">
//                 Find your next adventure and connect with fellow travelers
//               </p>
//             </div>

//             {/* Search */}
//             <div className="flex gap-4 mb-6">
//               <div className="relative flex-1">
//                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   placeholder="Search trips by location or title..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10"
//                 />
//               </div>
//               <Button variant="outline" size="icon">
//                 <Filter className="h-4 w-4" />
//               </Button>
//             </div>

//             {/* Trips Grid */}
//             {filteredTrips.length === 0 ? (
//               <div className="text-center py-12">
//                 <p className="text-muted-foreground">No trips found.</p>
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {filteredTrips.map((trip) => (
//                   <Card
//                     key={trip.id}
//                     className="overflow-hidden hover:shadow-lg transition-all duration-300"
//                   >
//                     <div className="relative h-48 bg-gradient-to-br from-primary to-accent">
//                       {trip.banner_image && (
//                         <img
//                           src={trip.banner_image}
//                           alt={trip.title}
//                           className="w-full h-full object-cover"
//                         />
//                       )}
//                       {trip.theme && (
//                         <Badge className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm">
//                           {trip.theme}
//                         </Badge>
//                       )}
//                     </div>
//                     <CardContent className="p-6">
//                       <div className="flex items-center gap-2 mb-3">
//                         <MapPin className="h-4 w-4 text-primary" />
//                         <span className="text-sm font-medium text-primary">{trip.location}</span>
//                       </div>
//                       <h3 className="text-xl font-semibold mb-2">{trip.title}</h3>
//                       <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
//                         {trip.description}
//                       </p>
//                       <div className="space-y-2 mb-4">
//                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                           <Calendar className="h-4 w-4" />
//                           <span>
//                             {trip.start_date} - {trip.end_date}
//                           </span>
//                         </div>
//                         <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                           <Users className="h-4 w-4" />
//                           <span>
//                             {trip.participant_count}/{trip.max_participants} travelers
//                           </span>
//                         </div>
//                       </div>
//                       <div className="flex items-center justify-between pt-4 border-t border-border">
//                         <div className="flex items-center gap-2">
//                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
//                           <div className="text-sm">
//                             <div className="font-medium">{trip.organizer.full_name}</div>
//                             <div className="text-xs text-muted-foreground">Organizer</div>
//                           </div>
//                         </div>
//                         <div className="flex gap-2">
//                           <Button size="sm" variant="outline">
//                             View
//                           </Button>
//                           <Button size="sm">Join</Button>
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             )}
//           </main>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;





import { useEffect, useState } from "react";
// import axios from "axios";
import { getAllTrips } from "../api/tripsApi";
import { getUserRegistrations } from "../api/traveler/registrationApi";
import { getImageUrl } from "../utils/getImageUrl";
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
import { MapPin, Calendar, Users, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function DiscoverTrips() {
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filteredTrips, setFilteredTrips] = useState([]);
  const [registeredTrips, setRegisteredTrips] = useState([]);

  const fetchTrips = async () => {
  try {
    const res = await getAllTrips();
    const tripsData = res.data || [];
    setTrips(tripsData);
    setFilteredTrips(tripsData);
  } catch (err) {
    toast.error("Failed to load trips");
  } finally {
    setLoading(false);
  }
};

 const fetchUserRegistrations = async () => {
  try {
    const res = await getUserRegistrations();

    if (res.success) {
      setRegisteredTrips(res.data.map((trip) => trip._id));
    }
  } catch (err) {
    console.error("Failed to fetch registrations", err);
  }
};

  useEffect(() => {
    fetchTrips();
    fetchUserRegistrations();
  }, []);

  const handleSearch = (query) => {
    setSearch(query);
    if (!query) {
      setFilteredTrips(trips);
      return;
    }

    setFilteredTrips(
      trips.filter((trip) =>
        trip.location.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Discover Amazing Trips
        </h1>
        <p className="text-muted-foreground text-lg">
          Explore curated travel experiences
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by location..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 p-2 border rounded-md"
        />
      </div>

      {loading && <p className="text-center py-10">Loading trips...</p>}

      {!loading && filteredTrips.length === 0 && (
        <Card className="p-12 text-center">No trips available</Card>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredTrips.map((trip) => {
         const imageUrl = getImageUrl(trip.tripPhoto?.[0]);
          const isRegistered = registeredTrips.includes(trip._id);
          const isPastTrip = new Date(trip.endDate) < new Date();

          return (
            <Card
              key={trip._id}
              className={`relative overflow-hidden h-96 transition-all ${
                isPastTrip
                  ? "blur-[1.5px] opacity-70 pointer-events-none"
                  : "cursor-pointer hover:shadow-xl"
              }`}
            >
              <img
                src={imageUrl}
                alt={trip.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-black/30" />

              {/* Past Badge */}
              {isPastTrip && (
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <Badge className="bg-red-600 text-white text-lg px-4 py-2">
                    Trip Ended
                  </Badge>
                </div>
              )}

              {/* Registered Badge */}
              {isRegistered && !isPastTrip && (
                <div className="absolute top-3 right-3 z-20">
                  <Badge className="!bg-green-600 text-white">
                    Registered
                  </Badge>
                </div>
              )}

              <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
                <CardTitle className="text-3xl font-bold mb-3">
                  {trip.title}
                </CardTitle>

                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  {trip.location}
                </div>

                <div className="flex gap-6 text-sm">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(trip.startDate).toLocaleDateString("en-GB")} -{" "}
                    {new Date(trip.endDate).toLocaleDateString("en-GB")}
                  </span>

                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" /> {trip.participants}
                  </span>
                </div>

                {/* {!isPastTrip && (
                  <Button
                    className="w-full mt-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dash/trip/${trip._id}`);
                    }}
                  >
                    View Details
                  </Button>
                )} */}
                {!isPastTrip && !isRegistered && (
  <Button
    className="w-full mt-3"
    onClick={(e) => {
      e.stopPropagation();
      navigate(`/dash/trip/${trip._id}`);
    }}
  >
    View Details
  </Button>
)}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}




// api for weather
// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   Card,
//   CardContent,
//   CardFooter,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { MapPin, Calendar, Users, Search } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-hot-toast";

// export default function DiscoverTrips() {
//   const navigate = useNavigate();

//   const [trips, setTrips] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState("");
//   const [filteredTrips, setFilteredTrips] = useState([]);
//   const [registeredTrips, setRegisteredTrips] = useState([]);

//   // ✅ WEATHER AI STATE (ADDED)
//   const [weatherMap, setWeatherMap] = useState({});

//   const fetchTrips = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/traveler/trips");
//       const tripsData = res.data.data || [];
//       setTrips(tripsData);
//       setFilteredTrips(tripsData);

//       // ✅ fetch weather for each trip
//       tripsData.forEach(fetchWeatherAI);
//     } catch (err) {
//       toast.error("Failed to load trips");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserRegistrations = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) return;

//       const res = await axios.get(
//         "http://localhost:5000/api/traveler/registered",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (res.data.success) {
//         setRegisteredTrips(res.data.data.map((trip) => trip._id));
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // 🌤 WEATHER AI FUNCTION (ADDED)
//   const fetchWeatherAI = async (trip) => {
//     try {
//       const geo = await axios.get(
//         `https://geocoding-api.open-meteo.com/v1/search?name=${trip.location}&count=1`
//       );

//       if (!geo.data.results?.length) return;

//       const { latitude, longitude } = geo.data.results[0];

//       const weather = await axios.get(
//         `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max&timezone=auto`
//       );

//       const temps = weather.data.daily.temperature_2m_max;
//       const avgTemp = temps.reduce((a, b) => a + b, 0) / temps.length;

//       let label = "Check Weather";
//       let color = "bg-yellow-500";

//       if (avgTemp >= 15 && avgTemp <= 30) {
//         label = "Good Time visit";
//         color = "!bg-green-600";
//       } else if (avgTemp >= 5) {
//         label = "Cold – Prepare";
//         color = "!bg-blue-500";
//       } else {
//         label = "Not Recommended";
//         color = "!bg-red-600";
//       }

//       setWeatherMap((prev) => ({
//         ...prev,
//         [trip._id]: { label, color },
//       }));
//     } catch (err) {
//       console.error("Weather API error");
//     }
//   };

//   useEffect(() => {
//     fetchTrips();
//     fetchUserRegistrations();
//   }, []);

//   const handleSearch = (query) => {
//     setSearch(query);
//     if (!query) {
//       setFilteredTrips(trips);
//       return;
//     }

//     setFilteredTrips(
//       trips.filter((trip) =>
//         trip.location.toLowerCase().includes(query.toLowerCase())
//       )
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//           Discover Amazing Trips
//         </h1>
//         <p className="text-muted-foreground text-lg">
//           Explore curated travel experiences
//         </p>
//       </div>

//       {/* Search */}
//       <div className="relative mb-6">
//         <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search by location..."
//           value={search}
//           onChange={(e) => handleSearch(e.target.value)}
//           className="w-full pl-10 p-2 border rounded-md"
//         />
//       </div>

//       {loading && <p className="text-center py-10">Loading trips...</p>}

//       {/* ✅ MISSING BLOCK RESTORED */}
//       {!loading && filteredTrips.length === 0 && (
//         <Card className="p-12 text-center">No trips available</Card>
//       )}

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {filteredTrips.map((trip) => {
//           const imageUrl =
//             trip.tripPhoto?.length > 0
//               ? `http://localhost:5000/${trip.tripPhoto[0].replace(/^\/+/, "")}`
//               : "/fallback.jpg";

//           const isRegistered = registeredTrips.includes(trip._id);
//           const isPastTrip = new Date(trip.endDate) < new Date();
//           const weather = weatherMap[trip._id];

//           return (
//             <Card
//               key={trip._id}
//               className={`relative overflow-hidden h-96 transition-all ${
//                 isPastTrip
//                   ? "blur-[1.5px] opacity-70 pointer-events-none"
//                   : "cursor-pointer hover:shadow-xl"
//               }`}
//             >
//               {/* 🌤 WEATHER BADGE */}
//               {weather && (
//                 <div className="absolute top-3 left-3 z-20">
//                   <Badge className={`${weather.color} text-white`}>
//                     {weather.label}
//                   </Badge>
//                 </div>
//               )}

//               {/* ✅ PAST BADGE RESTORED */}
//               {isPastTrip && (
//                 <div className="absolute inset-0 flex items-center justify-center z-20">
//                   <Badge className="bg-red-600 text-white text-lg px-4 py-2">
//                     Trip Ended
//                   </Badge>
//                 </div>
//               )}

//               {/* ✅ REGISTERED BADGE RESTORED */}
//               {isRegistered && !isPastTrip && (
//                 <div className="absolute top-3 right-3 z-20">
//                   <Badge className="!bg-green-600 text-white">
//                     Registered
//                   </Badge>
//                 </div>
//               )}

//               <img
//                 src={imageUrl}
//                 alt={trip.title}
//                 className="absolute inset-0 w-full h-full object-cover"
//               />

//               <div className="absolute inset-0 bg-black/30" />

//               <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
//                 <CardTitle className="text-3xl font-bold mb-3">
//                   {trip.title}
//                 </CardTitle>

//                 <div className="flex items-center gap-2 mb-2">
//                   <MapPin className="h-4 w-4" />
//                   {trip.location}
//                 </div>

//                 <div className="flex gap-6 text-sm">
//                   <span className="flex items-center gap-1">
//                     <Calendar className="h-4 w-4" />
//                     {new Date(trip.startDate).toLocaleDateString("en-GB")} -{" "}
//                     {new Date(trip.endDate).toLocaleDateString("en-GB")}
//                   </span>

//                   <span className="flex items-center gap-1">
//                     <Users className="h-4 w-4" /> {trip.participants}
//                   </span>
//                 </div>

//                 {!isPastTrip && !isRegistered && (
//                   <Button
//                     className="w-full mt-3"
//                     onClick={(e) => {
//                       e.stopPropagation(); // ✅ RESTORED
//                       navigate(`/dash/trip/${trip._id}`);
//                     }}
//                   >
//                     View Details
//                   </Button>
//                 )}
//               </div>
//             </Card>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
