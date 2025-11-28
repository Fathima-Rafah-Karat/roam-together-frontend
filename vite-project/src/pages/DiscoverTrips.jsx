// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import { Card, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, Users, ArrowLeft, Star } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Toaster, toast } from "react-hot-toast";

// export default function MyTrips() {
//     const [upcomingTrips, setUpcomingTrips] = useState([]);
//     const [pastTrips, setPastTrips] = useState([]);
//     const [loading, setLoading] = useState(true);

//     const [selectedTrip, setSelectedTrip] = useState(null);
//     const [tripReviews, setTripReviews] = useState([]);
//     const [showReviewForm, setShowReviewForm] = useState(false);
//     const [reviewText, setReviewText] = useState("");
//     const [rating, setRating] = useState(5);

//     const navigate = useNavigate();
//     const token = localStorage.getItem("token");

//     const fetchMyTrips = async () => {
//         try {
//             const res = await axios.get("http://localhost:5000/api/traveler/mytrip/view", {
//                 headers: { Authorization: `Bearer ${token}` },
//             });

//             console.log(res.data);

//             setUpcomingTrips(res.data.upcoming || []);
//             setPastTrips(res.data.past || []);
//         } catch (err) {
//             console.error("Error fetching trips:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     useEffect(() => {
//         fetchMyTrips();
//     }, []);

//     const formatDate = (dateString) =>
//         new Date(dateString).toLocaleDateString(undefined, {
//             year: "numeric",
//             month: "short",
//             day: "numeric",
//         });

//     if (loading) return <p>Loading trips...</p>;

//     return (
//         <div className="space-y-6">
//             <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
//                 My Trips
//             </h1>
//             <p className="text-muted-foreground text-lg">Manage your booked travel experiences</p>

//             <Tabs defaultValue="upcoming" className="w-full">
//                 <TabsList className="grid w-full max-w-md grid-cols-2">
//                     <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//                     <TabsTrigger value="past">Past Trips</TabsTrigger>
//                 </TabsList>


//                 <TabsContent value="upcoming">
//                     {upcomingTrips.length === 0 ? (
//                         <p>No upcoming trips</p>
//                     ) : (
//                         upcomingTrips.map((trip) => (
//                             <Card key={trip._id} className="overflow-hidden mb-4 shadow-lg">
//                                 <div className="flex flex-col md:flex-row">
//                                     <img
//                                         src={
//                                             trip.tripPhoto?.length
//                                                 ? `http://localhost:5000/${trip.tripPhoto[0].replace(/^\/+/, "")}`
//                                                 : "/fallback.jpg"
//                                         }
//                                         alt={trip.title}
//                                         className="w-full md:w-72 h-52 object-cover"
//                                     />
//                                     <div className="flex-1 p-6">
//                                         <CardTitle className="text-2xl mb-2">{trip.title}</CardTitle>

//                                         <p className="text-muted-foreground flex items-center gap-1">
//                                             <MapPin className="h-4 w-4" /> {trip.location}
//                                         </p>

//                                         <div className="grid gap-3 mb-4">
//                                             <div className="flex items-center gap-2 text-sm">
//                                                 <Calendar className="h-4 w-4" />
//                                                 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
//                                             </div>

//                                             <div className="flex items-center gap-2 text-sm">
//                                                 <Users className="h-4 w-4" /> {trip.participants || 0} travelers
//                                             </div>
//                                         </div>

//                                         <div className="flex gap-3">
//                                             <Button onClick={() => navigate(`/dash/mytrip/${trip._id}`)}>View Details</Button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Card>
//                         ))
//                     )}
//                 </TabsContent>


//                 <TabsContent value="past">
//                     {pastTrips.length === 0 ? (
//                         <p>No past trips</p>
//                     ) : (
//                         pastTrips.map((trip) => (
//                             <Card key={trip._id} className="overflow-hidden mb-4 shadow-lg opacity-95">
//                                 <div className="flex flex-col md:flex-row">
//                                     <img
//                                         src={
//                                             trip.tripPhoto?.length
//                                                 ? `http://localhost:5000/${trip.tripPhoto[0].replace(/^\/+/, "")}`
//                                                 : "/fallback.jpg"
//                                         }
//                                         alt={trip.title}
//                                         className="w-full md:w-72 h-52 object-cover"
//                                     />

//                                     <div className="flex-1 p-6">
//                                         <CardTitle className="text-2xl mb-2">{trip.title}</CardTitle>

//                                         <p className="text-muted-foreground flex items-center gap-1">
//                                             <MapPin className="h-4 w-4" /> {trip.location}
//                                         </p>

//                                         <div className="grid gap-3 mb-4">
//                                             <div className="flex items-center gap-2 text-sm">
//                                                 <Calendar className="h-4 w-4" />
//                                                 {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
//                                             </div>

//                                             <div className="flex items-center gap-2 text-sm">
//                                                 <Users className="h-4 w-4" /> {trip.participants || 0} travelers
//                                             </div>
//                                         </div>

//                                         <div className="flex gap-3">
//                                             <Button className="bg-blue-600 text-white hover:bg-blue-700">
//                                                 Review
//                                             </Button>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </Card>
//                         ))
//                     )}
//                 </TabsContent>
//             </Tabs>
//         </div>
//     );
// }
