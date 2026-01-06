// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Users, CheckCircle, MapPin, FileCheck, XCircle, Clock, LayoutDashboard } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import { useToast } from "@/hooks/use-toast";

// const AdminDashboard = () => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [stats, setStats] = useState({
//     totalTravelers: 0,
//     verifiedOrganizers: 0,
//     totalTrips: 0,
//     pendingVerifications: 0,
//   });
//   const [verifications, setVerifications] = useState([]);
//   const [activeView, setActiveView] = useState("stats");
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     if (!loading && !user) {
//       navigate("/auth");
//     }
//   }, [user, loading, navigate]);

//   useEffect(() => {
//     if (user) {
//       checkAdminRole();
//     }
//   }, [user]);

//   const checkAdminRole = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("user_roles")
//         .select("role")
//         .eq("user_id", user?.id)
//         .eq("role", "admin")
//         .single();

//       if (error) throw error;

//       if (data) {
//         setIsAdmin(true);
//         fetchStats();
//         fetchVerifications();
//       } else {
//         toast({
//           title: "Access Denied",
//           description: "You don't have admin privileges",
//           variant: "destructive",
//         });
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error checking admin role:", error);
//       navigate("/");
//     }
//   };

//   const fetchStats = async () => {
//     try {
//       const { count: travelers } = await supabase
//         .from("user_roles")
//         .select("*", { count: "exact", head: true })
//         .eq("role", "traveler");

//       const { count: organizers } = await supabase
//         .from("organizer_verifications")
//         .select("*", { count: "exact", head: true })
//         .eq("status", "approved");

//       const { count: trips } = await supabase
//         .from("trips")
//         .select("*", { count: "exact", head: true });

//       const { count: pending } = await supabase
//         .from("organizer_verifications")
//         .select("*", { count: "exact", head: true })
//         .eq("status", "pending");

//       setStats({
//         totalTravelers: travelers || 0,
//         verifiedOrganizers: organizers || 0,
//         totalTrips: trips || 0,
//         pendingVerifications: pending || 0,
//       });
//     } catch (error) {
//       toast({
//         title: "Error fetching stats",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const fetchVerifications = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("organizer_verifications")
//         .select(`
//           *,
//           profiles(full_name)
//         `)
//         .order("submitted_at", { ascending: false });

//       if (error) throw error;
//       setVerifications(data || []);
//     } catch (error) {
//       toast({
//         title: "Error fetching verifications",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleVerificationUpdate = async (id, status) => {
//     try {
//       const { error } = await supabase
//         .from("organizer_verifications")
//         .update({
//           status,
//           reviewed_by: user?.id,
//           reviewed_at: new Date().toISOString(),
//         })
//         .eq("id", id);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `Verification ${status}`,
//       });

//       fetchVerifications();
//       fetchStats();
//     } catch (error) {
//       toast({
//         title: "Error updating verification",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const getStatusBadge = (status) => {
//     switch (status) {
//       case "approved":
//         return <Badge className="bg-secondary text-secondary-foreground">Approved</Badge>;
//       case "rejected":
//         return <Badge variant="destructive">Rejected</Badge>;
//       default:
//         return <Badge variant="outline">Pending</Badge>;
//     }
//   };

//   if (loading || !user || !isAdmin) {
//     return <div className="min-h-screen bg-background" />;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 pt-24 pb-12">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
//           <p className="text-muted-foreground">Manage users, trips, and verification requests</p>
//         </div>

//         <div className="flex gap-4 mb-8">
//           <Button
//             variant={activeView === "stats" ? "default" : "outline"}
//             onClick={() => setActiveView("stats")}
//             className="gap-2"
//           >
//             <LayoutDashboard className="h-4 w-4" />
//             Dashboard
//           </Button>
//           <Button
//             variant={activeView === "verifications" ? "default" : "outline"}
//             onClick={() => setActiveView("verifications")}
//             className="gap-2"
//           >
//             <FileCheck className="h-4 w-4" />
//             Verifications
//             {stats.pendingVerifications > 0 && (
//               <Badge variant="destructive" className="ml-2">
//                 {stats.pendingVerifications}
//               </Badge>
//             )}
//           </Button>
//         </div>

//         {activeView === "stats" && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Travelers
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center gap-3">
//                   <Users className="h-8 w-8 text-primary" />
//                   <div className="text-3xl font-bold">{stats.totalTravelers}</div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Verified Organizers
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center gap-3">
//                   <CheckCircle className="h-8 w-8 text-secondary" />
//                   <div className="text-3xl font-bold">{stats.verifiedOrganizers}</div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Total Trips
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center gap-3">
//                   <MapPin className="h-8 w-8 text-accent" />
//                   <div className="text-3xl font-bold">{stats.totalTrips}</div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-3">
//                 <CardTitle className="text-sm font-medium text-muted-foreground">
//                   Pending Verifications
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center gap-3">
//                   <Clock className="h-8 w-8 text-muted-foreground" />
//                   <div className="text-3xl font-bold">{stats.pendingVerifications}</div>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         )}

//         {activeView === "verifications" && (
//           <div className="space-y-4">
//             {verifications.length === 0 ? (
//               <Card>
//                 <CardContent className="py-12 text-center text-muted-foreground">
//                   No verification requests
//                 </CardContent>
//               </Card>
//             ) : (
//               verifications.map((verification) => (
//                 <Card key={verification.id}>
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div className="flex-1">
//                         <div className="flex items-center gap-4 mb-4">
//                           <div>
//                             <h3 className="font-semibold text-lg">
//                               {verification.profiles.full_name}
//                             </h3>
//                             <p className="text-sm text-muted-foreground">
//                               Submitted: {new Date(verification.submitted_at).toLocaleDateString()}
//                             </p>
//                           </div>
//                           {getStatusBadge(verification.status)}
//                         </div>

//                         <div className="flex gap-4 mb-4">
//                           <a
//                             href={verification.govt_id_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-sm text-primary hover:underline"
//                           >
//                             View Government ID
//                           </a>
//                           <a
//                             href={verification.photo_url}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-sm text-primary hover:underline"
//                           >
//                             View Photo
//                           </a>
//                         </div>

//                         {verification.status === "pending" && (
//                           <div className="flex gap-2">
//                             <Button
//                               size="sm"
//                               onClick={() => handleVerificationUpdate(verification.id, "approved")}
//                               className="gap-2"
//                             >
//                               <CheckCircle className="h-4 w-4" />
//                               Approve
//                             </Button>
//                             <Button
//                               size="sm"
//                               variant="destructive"
//                               onClick={() => handleVerificationUpdate(verification.id, "rejected")}
//                               className="gap-2"
//                             >
//                               <XCircle className="h-4 w-4" />
//                               Reject
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;




















import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle, MapPin, Clock, ArrowUp, ArrowDown } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, PieChart, Pie, Cell
} from "recharts";
import axios from "axios";

const AdminDashboard = () => {
  const [activeView] = useState("stats");
  const [stats, setStats] = useState(null);
  const [percentages, setPercentages] = useState({});
  const [chartData, setChartData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [verificationPieData, setVerificationPieData] = useState([]);
  const COLORS = ["#22c55e", "#facc15", "#ef4444"];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // ======================
        // 1️⃣ FETCH MAIN STATS 
        // ======================
        const res = await axios.get("http://localhost:5000/api/admin/count");
        const payload = res.data.data;

        const total =
          (payload.totalTravelers || 0) +
          (payload.verifiedOrganizers || 0) +
          (payload.totalTrips || 0);

        const calculatedPercentages = {
          travelersPercent: total ? Math.round((payload.totalTravelers / total) * 100) : 0,
          organizersPercent: total ? Math.round((payload.verifiedOrganizers / total) * 100) : 0,
          tripsPercent: total ? Math.round((payload.totalTrips / total) * 100) : 0,
          pendingPercent: payload.verifiedOrganizers
            ? Math.round((payload.pendingVerification / payload.verifiedOrganizers) * 100)
            : 0,
        };

        setPercentages(calculatedPercentages);

        setStats({
          totalTravelers: payload.totalTravelers || 0,
          verifiedOrganizers: payload.verifiedOrganizers || 0,
          totalTrips: payload.totalTrips || 0,
          pendingVerifications: payload.pendingVerification || 0,
        });

        setChartData([
          { name: "Travelers", count: payload.totalTravelers || 0 },
          { name: "Organizers", count: payload.verifiedOrganizers || 0 },
          { name: "Trips", count: payload.totalTrips || 0 },
          { name: "Pending", count: payload.pendingVerification || 0 },
        ]);

        // ================================
        // 2️⃣ FETCH VERIFICATION PIE CHART
        // ================================
        const verificationRes = await axios.get(
          "http://localhost:5000/api/admin/verification-stats"
        );

        const v = verificationRes.data.data;

        setVerificationPieData([
          { name: "Approved", value: v.approved },
          { name: "Pending", value: v.pending },
          { name: "Rejected", value: v.rejected },
        ]);

        // ======================
        // 3️⃣ FETCH GROWTH DATA
        // ======================
        const growthRes = await axios.get("http://localhost:5000/api/admin/growth");

        setGrowthData(growthRes.data.data || []);

      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    };

    fetchDashboardData();
  }, []);

  if (!stats) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pb-12">

        <h1 className="text-4xl text-blue-400 font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage users, trips, and verification requests</p>

        {activeView === "stats" && (
          <div className="space-y-6">

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Travelers</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="text-3xl font-bold">{stats.totalTravelers}</div>
                  </div>
                  <div className="flex items-center gap-1 text-green-500 font-semibold">
                    <ArrowUp className="h-4 w-4" /> {percentages.travelersPercent}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Verified Organizers</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                    <div className="text-3xl font-bold">{stats.verifiedOrganizers}</div>
                  </div>
                  <div className="flex items-center gap-1 text-green-500 font-semibold">
                    <ArrowUp className="h-4 w-4" /> {percentages.organizersPercent}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Total Trips</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <MapPin className="h-8 w-8 text-purple-600" />
                    <div className="text-3xl font-bold">{stats.totalTrips}</div>
                  </div>
                  <div className="flex items-center gap-1 text-green-500 font-semibold">
                    <ArrowUp className="h-4 w-4" /> {percentages.tripsPercent}%
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-muted-foreground">Pending Verifications</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <Clock className="h-8 w-8 text-yellow-500" />
                    <div className="text-3xl font-bold">{stats.pendingVerifications}</div>
                  </div>
                  <div className="flex items-center gap-1 text-red-500 font-semibold">
                    <ArrowDown className="h-4 w-4" /> {percentages.pendingPercent}%
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Statistics Chart</CardTitle>
                </CardHeader>
                <CardContent style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Growth Line Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Platform Growth</CardTitle>
                </CardHeader>
                <CardContent style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={growthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="#4f46e5" activeDot={{ r: 8 }} />
                      <Line type="monotone" dataKey="trips" stroke="#10b981" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Verification Pie Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Verification Status</CardTitle>
                </CardHeader>
                <CardContent style={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={verificationPieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {verificationPieData.map((entry, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
