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



import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { MapPin, Users, BarChart3, Plus, Calendar, Edit, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isVerified, setIsVerified] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, participants: 0 });
  const [showModal, setShowModal] = useState(false);

  // Placeholder trips data
  const [trips, setTrips] = useState([
    // { id: 1, title: "Beach Adventure", location: "Goa", start_date: "2025-12-01", participant_count: 5, max_participants: 10, status: "Active" }
  ]);

  const handleCreateTrip = (e) => {
    e.preventDefault();
    // TODO: call API to create trip and update `trips` state
    setShowModal(false);
  };

  const deleteTrip = (id) => {
    // TODO: call API to delete trip
    setTrips(trips.filter((trip) => trip.id !== id));
  };

  return (
    <div className="min-h-screen bg-background">
    

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Organizer Dashboard</h1>
          <p className="text-gray-500">Manage your trips and track engagement</p>
        </div>

        {/* Verification Alert */}
        {!isVerified && (
          <Card className="mb-8 border-yellow-500/20 bg-yellow-500/10">
            <CardContent className="pt-6">
              {!verificationStatus ? (
                <>
                  <h3 className="font-semibold mb-2">Verification Required</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Submit your documents for admin review to create trips.
                  </p>
                  <Button onClick={() => navigate("/organizer/verify")}>Submit Verification</Button>
                </>
              ) : verificationStatus === "pending" ? (
                <>
                  <h3 className="font-semibold mb-2">Verification Pending</h3>
                  <p className="text-sm text-gray-500 mb-4">Your verification is under review.</p>
                  <Button variant="outline" onClick={() => navigate("/organizer/verify")}>
                    View Status
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-gray-500 mb-4">Verification was rejected. Please resubmit.</p>
                  <Button onClick={() => navigate("/organizer/verify")}>View Details</Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Trips</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
              <MapPin className="h-8 w-8 text-primary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Active Trips</p>
                <p className="text-3xl font-bold">{stats.active}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-secondary" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Travelers</p>
                <p className="text-3xl font-bold">{stats.participants}</p>
              </div>
              <Users className="h-8 w-8 text-accent" />
            </CardContent>
          </Card>
        </div>

        {/* Create Trip Button */}
        <div className="mb-6">
          <Button size="lg" disabled={!isVerified} onClick={() => setShowModal(true)}>
            <Plus className="h-5 w-5 mr-2" /> Create New Trip
          </Button>

          {showModal && (
            <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg w-full max-w-2xl relative">
                <button
                  className="absolute top-2 right-2 text-gray-500"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
                <h2 className="text-xl font-bold mb-4">Create New Trip</h2>

                <form onSubmit={handleCreateTrip} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Trip Title</Label>
                    <Input id="title" name="title" required />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" rows={4} required />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" required />
                    </div>
                    <div>
                      <Label htmlFor="theme">Theme</Label>
                      <Input id="theme" name="theme" placeholder="Adventure, Cultural..." />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="start_date">Start Date</Label>
                      <Input id="start_date" name="start_date" type="date" required />
                    </div>
                    <div>
                      <Label htmlFor="end_date">End Date</Label>
                      <Input id="end_date" name="end_date" type="date" required />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="max_participants">Max Participants</Label>
                    <Input
                      id="max_participants"
                      name="max_participants"
                      type="number"
                      min="1"
                      defaultValue="10"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    Create Trip
                  </Button>
                </form>
              </div>
            </div>
          )}
        </div>

        {/* Trips List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Your Trips</h2>

          {trips.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No trips yet. Create your first trip to get started!</p>
              </CardContent>
            </Card>
          ) : (
            trips.map((trip) => (
              <Card key={trip.id || Math.random()}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{trip.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {trip.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(trip.start_date).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {trip.participant_count}/{trip.max_participants}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge>{trip.status}</Badge>
                      <Button size="sm" variant="outline" onClick={() => navigate(`/trip/${trip.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteTrip(trip.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}




