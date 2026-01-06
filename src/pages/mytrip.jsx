
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// import { Card, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Calendar, MapPin, Users, ArrowLeft, Star } from "lucide-react";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Toaster, toast } from "react-hot-toast";

// export default function MyTrips() {
//   const [upcomingTrips, setUpcomingTrips] = useState([]);
//   const [pastTrips, setPastTrips] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedTrip, setSelectedTrip] = useState(null);
//   const [tripReviews, setTripReviews] = useState([]);
//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [reviewText, setReviewText] = useState("");
//   const [rating, setRating] = useState(5);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   // Fetch trips
//   const fetchMyTrips = async () => {
//     if (!token) return console.error("No token found");
//     try {
//       const res = await axios.get("http://localhost:5000/api/traveler/mytrip/view", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUpcomingTrips(res.data.upcoming || []);
//       setPastTrips(res.data.past || []);
//     } catch (err) {
//       console.error("Error fetching trips:", err);
//       toast.error("Failed to load trips");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch reviews for a trip
//   const fetchTripReviews = async (tripId) => {
//     try {
//       const res = await axios.get(
//         "http://localhost:5000/api/traveler/review&rating/rateandreview",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setTripReviews(res.data.data.filter((r) => r.tripId.toString() === tripId.toString()));
//     } catch (err) {
//       console.error("Error fetching reviews:", err);
//       toast.error("Failed to load reviews");
//     }
//   };

//   useEffect(() => {
//     fetchMyTrips();
//   }, []);

//   const openReviewPage = (trip) => {
//     setSelectedTrip(trip);
//     setShowReviewForm(false);
//     fetchTripReviews(trip._id);
//   };

//   const openCreateReviewForm = () => {
//     setShowReviewForm(true);
//     setRating(5);
//     setReviewText("");
//   };

//   const handleReviewSubmit = async () => {
//     if (!selectedTrip) return;
//     if (!reviewText || rating < 1 || rating > 5) {
//       toast.error("Please enter a valid review and rating (1-5)");
//       return;
//     }
//     try {
//       await axios.post(
//         "http://localhost:5000/api/traveler/review&rating",
//         { tripId: selectedTrip._id, rating, review: reviewText },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setReviewText("");
//       setRating(5);
//       fetchTripReviews(selectedTrip._id);
//       toast.success("Review submitted!");
//       setShowReviewForm(false);
//     } catch (err) {
//       console.error("Error submitting review:", err);
//       toast.error("Failed to submit review");
//     }
//   };

//   const formatDate = (dateString) =>
//     new Date(dateString).toLocaleDateString(undefined, {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//     });

//   if (loading) return <p>Loading trips...</p>;

//   // Show selected trip reviews page
//   if (selectedTrip) {
//     return (
//       <div className="space-y-4">
//         {/* <Toaster /> */}
//         <Button
//           variant="ghost"
//           className="flex items-center gap-2"
//           onClick={() => setSelectedTrip(null)}
//         >
//           <ArrowLeft className="h-4 w-4" /> 
//         </Button>

//         <h1 className="text-3xl font-bold">Reviews for {selectedTrip.title}</h1>

//         {!showReviewForm && (
//           <Button className="my-4 text-white bg-blue-600 hover:bg-blue-700" onClick={openCreateReviewForm}>
//             Create Review
//           </Button>
//         )}

//         {showReviewForm && (
//           <div className="bg-white p-4 rounded border mb-4">
//             <h2 className="text-xl font-semibold mb-2">Write Your Review</h2>

//             <div className="flex gap-1 mb-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <Star
//                   key={star}
//                   className={`cursor-pointer h-6 w-6 ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
//                   onClick={() => setRating(star)}
//                 />
//               ))}
//             </div>

//             <textarea
//               value={reviewText}
//               onChange={(e) => setReviewText(e.target.value)}
//               className="border p-1 w-full mb-2"
//               placeholder="Write your review..."
//             />

//             <Button onClick={handleReviewSubmit}>Submit Review</Button>
//             <Button
//               variant="outline"
//               className="text-black ml-2 hover:bg-red-50"
//               onClick={() => {
//                 setShowReviewForm(false);
//                 setReviewText("");
//                 setRating(5);
//               }}
//             >
//               Cancel
//             </Button>
//           </div>
//         )}

//         {tripReviews.length === 0 ? (
//           <p>No reviews yet.</p>
//         ) : (
//           tripReviews.map((rev) => (
//             <Card key={rev._id} className="mb-2 p-2">
//               <strong>{rev.TravelerId?.name || "Anonymous"}</strong>
//               <p className="flex items-center gap-1 mb-1">
//                 rated:
//                 <span className="flex gap-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={`h-4 w-4 ${star <= rev.rating ? "text-yellow-400" : "text-gray-300"}`}
//                     />
//                   ))}
//                 </span>
//               </p>
//               <p>{rev.review}</p>
//             </Card>
//           ))
//         )}
//       </div>
//     );
//   }

//   // Default trips list page
//   return (
//     <div className="space-y-6">

//       <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">My Trips</h1>
//       <p className="text-muted-foreground text-lg">Manage your booked travel experiences</p>

//       <Tabs defaultValue="upcoming" className="w-full">
//         <TabsList className="grid w-full max-w-md grid-cols-2">
//           <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
//           <TabsTrigger value="past">Past Trips</TabsTrigger>
//         </TabsList>

//         {/* Upcoming trips */}
//         <TabsContent value="upcoming">
//           {upcomingTrips.length === 0 ? (
//             <p>No upcoming trips</p>
//           ) : (
//             upcomingTrips.map((trip) => (
//               <Card key={trip._id} className="overflow-hidden mb-4 shadow-lg">
//                 <div className="flex flex-col md:flex-row">
//                   <img
//                     src={trip.tripPhoto?.length ? `http://localhost:5000/${trip.tripPhoto[0].replace(/^\/+/, "")}` : "/fallback.jpg"}
//                     alt={trip.title}
//                     className="w-full md:w-72 h-52 object-cover"
//                   />
//                   <div className="flex-1 p-6">
//                     <CardTitle className="text-2xl mb-2">{trip.title}</CardTitle>
//                     <p className="text-muted-foreground flex items-center gap-1">
//                       <MapPin className="h-4 w-4" /> {trip.location}
//                     </p>
//                     <div className="grid gap-3 mb-4">
//                       <div className="flex items-center gap-2 text-sm">
//                         <Calendar className="h-4 w-4" /> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
//                       </div>
//                       <div className="flex items-center gap-2 text-sm">
//                         <Users className="h-4 w-4" /> {trip.participants || 0} travelers
//                       </div>
//                     </div>
//                     <div className="flex gap-3">
//                       <Button onClick={() => navigate(`/dash/mytrip/${trip._id}`)}>View Details</Button>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>

//         {/* Past trips */}
//         <TabsContent value="past">
//           {pastTrips.length === 0 ? (
//             <p>No past trips</p>
//           ) : (
//             pastTrips.map((trip) => (
//               <Card key={trip._id} className="overflow-hidden mb-4 shadow-lg opacity-95">
//                 <div className="flex flex-col md:flex-row">
//                   <img
//                     src={trip.tripPhoto?.length ? `http://localhost:5000/${trip.tripPhoto[0].replace(/^\/+/, "")}` : "/fallback.jpg"}
//                     alt={trip.title}
//                     className="w-full md:w-72 h-52 object-cover"
//                   />
//                   <div className="flex-1 p-6">
//                     <CardTitle className="text-2xl mb-2">{trip.title}</CardTitle>
//                     <p className="text-muted-foreground flex items-center gap-1">
//                       <MapPin className="h-4 w-4" /> {trip.location}
//                     </p>
//                     <div className="grid gap-3 mb-4">
//                       <div className="flex items-center gap-2 text-sm">
//                         <Calendar className="h-4 w-4" /> {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
//                       </div>
//                       <div className="flex items-center gap-2 text-sm">
//                         <Users className="h-4 w-4" /> {trip.participants || 0} travelers
//                       </div>
//                     </div>
//                     <div className="flex gap-3">
//                       <Button className="my-4 text-white bg-blue-600 hover:bg-blue-700" onClick={() => openReviewPage(trip)}>Review</Button>
//                     </div>
//                   </div>
//                 </div>
//               </Card>
//             ))
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }











import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, ArrowLeft, Star } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster, toast } from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const gradients = [
  "bg-gradient-to-br from-primary to-secondary",
  "bg-gradient-to-br from-secondary to-accent",
  "bg-gradient-to-br from-accent to-primary",
];

export default function MyTrips() {
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [pastTrips, setPastTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripReviews, setTripReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchMyTrips = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/traveler/mytrip/view",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpcomingTrips(res.data.upcoming || []);
      setPastTrips(res.data.past || []);
    } catch (err) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  const fetchTripReviews = async (tripId) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/traveler/review&rating/rateandreview",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTripReviews(
        res.data.data.filter(
          (r) => r.tripId.toString() === tripId.toString()
        )
      );
    } catch {
      toast.error("Failed to load reviews");
    }
  };

  useEffect(() => {
    fetchMyTrips();
  }, []);

  const openReviewPage = (trip) => {
    setSelectedTrip(trip);
    setShowReviewForm(false);
    fetchTripReviews(trip._id);
  };

  const handleReviewSubmit = async () => {
    if (!reviewText) return toast.error("Enter review text");
    try {
      await axios.post(
        "http://localhost:5000/api/traveler/review&rating",
        { tripId: selectedTrip._id, rating, review: reviewText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review submitted");
      setReviewText("");
      setRating(5);
      fetchTripReviews(selectedTrip._id);
      setShowReviewForm(false);
    } catch {
      toast.error("Review submission failed");
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) return <p>Loading trips...</p>;

  /* ================= REVIEW PAGE ================= */
  if (selectedTrip) {
    return (
      <div className="space-y-6">
        <Toaster />

        <Button variant="ghost" onClick={() => setSelectedTrip(null)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <h1 className="text-3xl font-bold text-blue-400">
          Reviews for {selectedTrip.title}
        </h1>

        {/* CREATE REVIEW */}
        <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 text-white">
              Create Review
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Write Review</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    onClick={() => setRating(s)}
                    className={`cursor-pointer ${
                      s <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                className="w-full border rounded p-2"
                placeholder="Write your experience..."
              />

              <Button onClick={handleReviewSubmit}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* ⭐ TESTIMONIAL STYLE REVIEWS */}
        {tripReviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {tripReviews.map((rev, index) => {
              const photo = rev.TravelerId?.photo
                ? `http://localhost:5000/${rev.TravelerId.photo.replace(
                    /^\/+/,
                    ""
                  )}`
                : null;

              return (
                <Card key={rev._id} className="p-6 hover:shadow-lg">
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-4 w-4 ${
                          s <= rev.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="text-muted-foreground mb-4">
                    "{rev.review}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t">
                    {photo ? (
                      <img
                        src={photo}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div
                        className={`w-12 h-12 rounded-full ${
                          gradients[index % gradients.length]
                        }`}
                      />
                    )}

                    <div>
                      <p className="font-semibold">
                        {rev.TravelerId?.name || "Anonymous"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Traveler
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  /* ================= TRIPS PAGE ================= */
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
        My Trips
      </h1>
      <p className="text-muted-foreground text-lg">Manage your booked travel experiences</p>


      <Tabs defaultValue="upcoming">
        <TabsList className="grid grid-cols-2 max-w-md">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcomingTrips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              formatDate={formatDate}
              navigate={navigate}
            />
          ))}
        </TabsContent>

        <TabsContent value="past">
          {pastTrips.map((trip) => (
            <TripCard
              key={trip._id}
              trip={trip}
              formatDate={formatDate}
              reviewBtn
              openReviewPage={openReviewPage}
            />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ===== Trip Card ===== */
function TripCard({ trip, formatDate, navigate, reviewBtn, openReviewPage }) {
  return (
    <Card className="mb-4 overflow-hidden shadow-lg">
      <div className="flex flex-col md:flex-row">
        <img
          src={`http://localhost:5000/${trip.tripPhoto?.[0]}`}
          className="w-full md:w-72 h-52 object-cover"
        />

        <div className="p-6 flex-1">
          <CardTitle className="text-2xl mb-2">{trip.title}</CardTitle>
          <p className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" /> {trip.location}
          </p>

          <div className="text-sm space-y-1 mt-2">
            <p>
              <Calendar className="inline h-4 w-4" />{" "}
              {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
            </p>
            <p>
              <Users className="inline h-4 w-4" />{" "}
              {trip.participants || 0} travelers
            </p>
          </div>

          {reviewBtn ? (
            <Button className="mt-4" onClick={() => openReviewPage(trip)}>
              Review
            </Button>
          ) : (
            <Button
              className="mt-4"
              onClick={() => navigate(`/dash/mytrip/${trip._id}`)}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
