// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Plus, Users, MapPin, Calendar, Edit, Trash2, BarChart3 } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import { useToast } from "@/hooks/use-toast";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";

// const OrganizerDashboard = () => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [trips, setTrips] = useState([]);
//   const [isOrganizer, setIsOrganizer] = useState(false);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [stats, setStats] = useState({ total: 0, active: 0, participants: 0 });
//   const [isVerified, setIsVerified] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState(null);

//   // Redirect if user not logged in
//   useEffect(() => {
//     if (!loading && !user) {
//       navigate("/auth");
//     }
//   }, [user, loading, navigate]);

//   // Check role and verification
//   useEffect(() => {
//     if (!user) return;
//     (async () => {
//       try {
//         const { data, error } = await supabase
//           .from("user_roles")
//           .select("role")
//           .eq("user_id", user.id)
//           .single();
//         if (error) throw error;

//         if (data?.role === "organizer" || data?.role === "admin") {
//           setIsOrganizer(true);
//           await checkVerification();
//           await fetchTrips();
//         } else {
//           toast({
//             title: "Access Denied",
//             description: "You need organizer privileges to access this page.",
//             variant: "destructive",
//           });
//           navigate("/dashboard");
//         }
//       } catch (err) {
//         console.error("Error checking role:", err);
//         navigate("/dashboard");
//       }
//     })();
//   }, [user]);

//   // Check verification status
//   const checkVerification = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("organizer_verifications")
//         .select("status")
//         .eq("user_id", user.id)
//         .maybeSingle();
//       if (error) throw error;

//       if (data) {
//         setVerificationStatus(data.status);
//         setIsVerified(data.status === "approved");
//       } else {
//         setVerificationStatus(null);
//         setIsVerified(false);
//       }
//     } catch (err) {
//       console.error("Error checking verification:", err);
//     }
//   };

//   // Fetch trips
//   const fetchTrips = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("trips")
//         .select(`*, trip_participants(count)`)
//         .eq("organizer_id", user.id)
//         .order("created_at", { ascending: false });
//       if (error) throw error;

//       const tripsWithCount =
//         data?.map((trip) => ({
//           ...trip,
//           participant_count: trip.trip_participants?.[0]?.count || 0,
//         })) || [];

//       setTrips(tripsWithCount);

//       const active = tripsWithCount.filter((t) => t.status === "open").length;
//       const totalParticipants = tripsWithCount.reduce(
//         (sum, t) => sum + (t.participant_count || 0),
//         0
//       );

//       setStats({
//         total: tripsWithCount.length,
//         active,
//         participants: totalParticipants,
//       });
//     } catch (err) {
//       toast({
//         title: "Error loading trips",
//         description: err.message || "Failed to fetch trips",
//         variant: "destructive",
//       });
//     }
//   };

//   // Create trip
//   const handleCreateTrip = async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.currentTarget);

//     try {
//       const { error } = await supabase.from("trips").insert({
//         title: formData.get("title"),
//         description: formData.get("description"),
//         location: formData.get("location"),
//         start_date: formData.get("start_date"),
//         end_date: formData.get("end_date"),
//         max_participants: parseInt(formData.get("max_participants")) || 0,
//         theme: formData.get("theme"),
//         organizer_id: user.id,
//         status: "open",
//       });
//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: "Trip created successfully",
//       });

//       setDialogOpen(false);
//       fetchTrips();
//     } catch (err) {
//       toast({
//         title: "Error creating trip",
//         description: err.message || "Failed to create trip",
//         variant: "destructive",
//       });
//     }
//   };

//   // Delete trip
//   const deleteTrip = async (tripId) => {
//     if (!confirm("Are you sure you want to delete this trip?")) return;

//     try {
//       const { error } = await supabase.from("trips").delete().eq("id", tripId);
//       if (error) throw error;

//       toast({ title: "Trip deleted successfully" });
//       fetchTrips();
//     } catch (err) {
//       toast({
//         title: "Error deleting trip",
//         description: err.message || "Failed to delete trip",
//         variant: "destructive",
//       });
//     }
//   };

//   if (loading || !user || !isOrganizer) {
//     return <div className="min-h-screen bg-background" />;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 pt-24 pb-12">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
//           <p className="text-muted-foreground">Manage your trips and track engagement</p>
//         </div>

//         {/* Verification Alert */}
//         {!isVerified && (
//           <Card className="mb-8 border-yellow-500/20 bg-yellow-500/10">
//             <CardContent className="pt-6">
//               {!verificationStatus ? (
//                 <>
//                   <h3 className="font-semibold mb-2">Verification Required</h3>
//                   <p className="text-sm text-muted-foreground mb-4">
//                     Submit your documents for admin review to create trips.
//                   </p>
//                   <Button onClick={() => navigate("/organizer/verify")}>
//                     Submit Verification
//                   </Button>
//                 </>
//               ) : verificationStatus === "pending" ? (
//                 <>
//                   <h3 className="font-semibold mb-2">Verification Pending</h3>
//                   <p className="text-sm text-muted-foreground mb-4">
//                     Your verification is under review.
//                   </p>
//                   <Button variant="outline" onClick={() => navigate("/organizer/verify")}>
//                     View Status
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <h3 className="font-semibold mb-2">Verification Rejected</h3>
//                   <p className="text-sm text-muted-foreground mb-4">
//                     Verification was rejected. Please resubmit.
//                   </p>
//                   <Button onClick={() => navigate("/organizer/verify")}>
//                     View Details
//                   </Button>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {/* Stats */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Trips</p>
//                   <p className="text-3xl font-bold">{stats.total}</p>
//                 </div>
//                 <MapPin className="h-8 w-8 text-primary" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Active Trips</p>
//                   <p className="text-3xl font-bold">{stats.active}</p>
//                 </div>
//                 <BarChart3 className="h-8 w-8 text-secondary" />
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-sm text-muted-foreground">Total Travelers</p>
//                   <p className="text-3xl font-bold">{stats.participants}</p>
//                 </div>
//                 <Users className="h-8 w-8 text-accent" />
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Create Trip Button */}
//         <div className="mb-6">
//           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
//             <DialogTrigger asChild>
//               <Button size="lg" disabled={!isVerified}>
//                 <Plus className="h-5 w-5 mr-2" /> Create New Trip
//               </Button>
//             </DialogTrigger>

//             <DialogContent className="max-w-2xl">
//               <DialogHeader>
//                 <DialogTitle>Create New Trip</DialogTitle>
//               </DialogHeader>

//               <form onSubmit={handleCreateTrip} className="space-y-4">
//                 <div>
//                   <Label htmlFor="title">Trip Title</Label>
//                   <Input id="title" name="title" required />
//                 </div>

//                 <div>
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea id="description" name="description" rows={4} required />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="location">Location</Label>
//                     <Input id="location" name="location" required />
//                   </div>

//                   <div>
//                     <Label htmlFor="theme">Theme</Label>
//                     <Input id="theme" name="theme" placeholder="Adventure, Cultural..." />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="start_date">Start Date</Label>
//                     <Input id="start_date" name="start_date" type="date" required />
//                   </div>

//                   <div>
//                     <Label htmlFor="end_date">End Date</Label>
//                     <Input id="end_date" name="end_date" type="date" required />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="max_participants">Max Participants</Label>
//                   <Input
//                     id="max_participants"
//                     name="max_participants"
//                     type="number"
//                     min="1"
//                     defaultValue="10"
//                     required
//                   />
//                 </div>

//                 <Button type="submit" className="w-full">
//                   Create Trip
//                 </Button>
//               </form>
//             </DialogContent>
//           </Dialog>
//         </div>

//         {/* Trips List */}
//         <div className="space-y-4">
//           <h2 className="text-2xl font-semibold">Your Trips</h2>

//           {trips.length === 0 ? (
//             <Card>
//               <CardContent className="py-12 text-center">
//                 <p className="text-muted-foreground">
//                   No trips yet. Create your first trip to get started!
//                 </p>
//               </CardContent>
//             </Card>
//           ) : (
//             trips.map((trip) =>
//               trip ? (
//                 <Card key={trip.id || Math.random()}>
//                   <CardHeader>
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <CardTitle className="mb-2">{trip.title}</CardTitle>

//                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                           <div className="flex items-center gap-1">
//                             <MapPin className="h-4 w-4" />
//                             {trip.location}
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Calendar className="h-4 w-4" />
//                             {new Date(trip.start_date).toLocaleDateString()}
//                           </div>

//                           <div className="flex items-center gap-1">
//                             <Users className="h-4 w-4" />
//                             {trip.participant_count}/{trip.max_participants}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="flex items-center gap-2">
//                         <Badge>{trip.status}</Badge>

//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => navigate(`/trip/${trip.id}`)}
//                         >
//                           <Edit className="h-4 w-4" />
//                         </Button>

//                         <Button
//                           size="sm"
//                           variant="destructive"
//                           onClick={() => deleteTrip(trip.id)}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardHeader>
//                 </Card>
//               ) : null
//             )
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrganizerDashboard;





















































































import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, Users, Calendar, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState([]);
  const [recentTrips, setRecentTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* =========================
     STATUS BADGE LOGIC
  ========================== */
  const getTripStatus = (trip) => {
    const now = new Date();
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);

    if (end < now) {
      return { text: "Completed", color: "#6b7280" }; // gray
    }

    if (start <= now && end >= now) {
      return { text: "Ongoing", color: "#2563eb" }; // blue
    }

    return { text: "Upcoming", color: "#16a34a" }; // green
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Unauthorized. Please login.");
          setLoading(false);
          return;
        }

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        /* =====================
           FETCH STATS
        ====================== */
        const statsRes = await axios.get(
          "http://localhost:5000/api/organizer/count",
          { headers }
        );

        // supports both {data:{}} and direct {}
        const statsData = statsRes.data?.data || statsRes.data;

        setStats([
          {
            title: "Total Trips",
            value: statsData.totalTrips || 0,
            icon: MapPin,
            change: "Updated",
          },
          {
            title: "Active Participants",
            value: statsData.activeParticipants || 0,
            icon: Users,
            change: "Live",
          },
          {
            title: "Upcoming Events",
            value: statsData.upcomingEvents || 0,
            icon: Calendar,
            change: "Scheduled",
          },
          {
            title: "Completion Rate",
            value: `${statsData.completionRate || 0}%`,
            icon: TrendingUp,
            change: "Overall",
          },
        ]);

        /* =====================
           FETCH RECENT TRIPS
        ====================== */
        const tripsRes = await axios.get(
          "http://localhost:5000/api/organizer/viewtrip",
          { headers }
        );

        // ✅ FIX: always extract array safely
        const tripsArray = Array.isArray(tripsRes.data)
          ? tripsRes.data
          : tripsRes.data?.data || [];

        // latest 5 trips
        setRecentTrips(tripsArray.slice(0, 5));

        setLoading(false);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-blue-500">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's your trip overview.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="w-4 h-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Trips */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Trips</CardTitle>
        </CardHeader>
        <CardContent>
          {recentTrips.length === 0 ? (
            <p className="text-muted-foreground">No trips found</p>
          ) : (
            <div className="space-y-4">
              {recentTrips.map((trip) => {
                const status = getTripStatus(trip);

                return (
                  <motion.div
                    key={trip._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                    onClick={() => navigate(`/trips/${trip._id}`)}
                  >
                    <div>
                      <h3 className="font-semibold">{trip.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(trip.startDate).toDateString()} –{" "}
                        {new Date(trip.endDate).toDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-4">
                      <p className="text-sm">
                        {trip.participants || 0} participants
                      </p>

                      {/* ✅ SAME BADGE AS TRIP LIST */}
                      <Badge
                        style={{
                          backgroundColor: status.color,
                          color: "white",
                        }}
                        className="px-3 py-1 rounded"
                      >
                        {status.text}
                      </Badge>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


















// import React, { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Upload } from "lucide-react";
// import { Toaster, toast } from "react-hot-toast";
// import axios from "axios";

// export default function OrganizerDashboard() {
//   const [isVerified, setIsVerified] = useState(false);
//   const [verificationStatus, setVerificationStatus] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [uploading, setUploading] = useState(false);

//   const token = localStorage.getItem("token"); // Must be Organizer's JWT

//   // Fetch verification status
//   useEffect(() => {
//     const fetchVerificationStatus = async () => {
//       if (!token) return;

//       try {
//         const res = await axios.get("http://localhost:5000/api/verify/view", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         if (res.data.success && res.data.data?.length > 0) {
//           const latest = res.data.data[0]; // Latest verification
//           setVerificationStatus(latest.status);
//           if (latest.status === "approved") setIsVerified(true);
//         }
//       } catch (error) {
//         console.error("Error fetching verification status:", error);
//         toast.error(error.response?.data?.message || "Failed to fetch verification status");
//       }
//     };

//     fetchVerificationStatus();
//   }, [token]);

//   // Submit verification
//   const handleSubmitVerification = async (e) => {
//     e.preventDefault();
//     setUploading(true);

//     if (!token) {
//       toast.error("You must be logged in to submit verification.");
//       setUploading(false);
//       return;
//     }

//     try {
//       const form = e.target;
//       const govtIdType = form.govtIdType.value;
//       const photoFile = form.photo.files[0];
//       const govtIdPhotoFile = form.govtIdPhoto.files[0];

//       if (!govtIdType || !photoFile || !govtIdPhotoFile) {
//         throw new Error("All fields are required.");
//       }

//       const formData = new FormData();
//       formData.append("govtIdType", govtIdType);
//       formData.append("photo", photoFile);
//       formData.append("govtIdPhoto", govtIdPhotoFile);

//       const response = await axios.post(
//         "http://localhost:5000/api/verify/verification",
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`, // Must include token
//           },
//         }
//       );

//       toast.success(response.data.message || "Verification submitted successfully");
//       setVerificationStatus("pending");
//       setShowModal(false);
//     } catch (error) {
//       console.error(error);
//       toast.error(error.response?.data?.message || error.message || "Submission failed");
//     } finally {
//       setUploading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-background">
//       <Toaster position="top-center" reverseOrder={false} />

//       <div className="container mx-auto px-4 pt-24 pb-12">
//         {!isVerified && (
//           <Card className="mb-8 border-yellow-500/20 bg-yellow-500/10">
//             <CardContent className="pt-6">
//               {!verificationStatus ? (
//                 <>
//                   <h3 className="font-semibold mb-2">Verification Required</h3>
//                   <p className="text-sm text-gray-500 mb-4">
//                     Submit your documents for admin review to create trips.
//                   </p>
//                   <Button onClick={() => setShowModal(true)}>Submit Verification</Button>
//                 </>
//               ) : verificationStatus === "pending" ? (
//                 <>
//                   <h3 className="font-semibold mb-2">Verification Pending</h3>
//                   <p className="text-sm text-gray-500 mb-4">Your verification is under review.</p>
//                   <Button variant="outline" onClick={() => setShowModal(true)}>View Status</Button>
//                 </>
//               ) : (
//                 <>
//                   <p className="text-sm text-red-600 mb-4">Verification rejected. Please resubmit.</p>
//                   <Button onClick={() => setShowModal(true)}>Resubmit Verification</Button>
//                 </>
//               )}
//             </CardContent>
//           </Card>
//         )}

//         {isVerified && (
//           <Card className="border-green-500/20 bg-green-500/10">
//             <CardContent className="pt-6">
//               <h3 className="font-semibold text-green-600">✅ Your account is verified!</h3>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {showModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
//           <Card className="w-full max-w-lg">
//             <CardHeader>
//               <CardTitle>Submit Verification Documents</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form className="space-y-6" onSubmit={handleSubmitVerification}>
//                 <div className="space-y-2">
//                   <Label htmlFor="govtIdType">Government ID Type *</Label>
//                   <select
//                     id="govtIdType"
//                     name="govtIdType"
//                     className="w-full border border-gray-300 rounded-lg px-3 py-2"
//                     required
//                   >
//                     <option value="">Select ID Type</option>
//                     <option value="driving license">Driving License</option>
//                     <option value="aadhar card">Aadhar Card</option>
//                   </select>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="govtIdPhoto">Government ID *</Label>
//                   <Input id="govtIdPhoto" name="govtIdPhoto" type="file" accept="image/*,.pdf" required />
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="photo">Profile Photo *</Label>
//                   <Input id="photo" name="photo" type="file" accept="image/*" required />
//                 </div>

//                 <Button type="submit" className="w-full" disabled={uploading}>
//                   {uploading ? "Uploading..." : <><Upload className="h-4 w-4 mr-2" /> Submit</>}
//                 </Button>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   className="w-full mt-2"
//                   onClick={() => setShowModal(false)}
//                 >
//                   Cancel
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </div>
//       )}
//     </div>
//   );
// }
