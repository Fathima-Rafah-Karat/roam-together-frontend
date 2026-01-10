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



















import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  CheckCircle,
  MapPin,
  Clock,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import {
  getDashboardCount,
  getVerificationStats,
  getGrowthData,
} from "../api/admin/count";

const COLORS = ["#22c55e", "#facc15", "#ef4444"];

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [percentages, setPercentages] = useState({});
  const [chartData, setChartData] = useState([]);
  const [growthData, setGrowthData] = useState([]);
  const [verificationPieData, setVerificationPieData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const payload = await getDashboardCount();

        const total =
          (payload.totalTravelers || 0) +
          (payload.verifiedOrganizers || 0) +
          (payload.totalTrips || 0);

        // 📊 Percentages
        setPercentages({
          travelersPercent: total
            ? Math.round((payload.totalTravelers / total) * 100)
            : 0,
          organizersPercent: total
            ? Math.round((payload.verifiedOrganizers / total) * 100)
            : 0,
          tripsPercent: total
            ? Math.round((payload.totalTrips / total) * 100)
            : 0,
          pendingPercent: payload.verifiedOrganizers
            ? Math.round(
                (payload.pendingVerification /
                  payload.verifiedOrganizers) *
                  100
              )
            : 0,
        });

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

        // 🟢 Verification Pie Data
        const v = await getVerificationStats();
        setVerificationPieData([
          { name: "Approved", value: v.approved || 0 },
          { name: "Pending", value: v.pending || 0 },
          { name: "Rejected", value: v.rejected || 0 },
        ]);

        //  Growth Chart
        const growth = await getGrowthData();
        setGrowthData(
          growth.map((m) => ({
            month: m.month,
            users: Number(m.users) || 0,
            trips: Number(m.trips) || 0,
          }))
        );
      } catch (error) {
        console.error("Dashboard Error:", error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!stats)
    return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-blue-500 mb-8">
        Admin Dashboard
      </h1>

      {/*  Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Travelers"
          value={stats.totalTravelers}
          percent={percentages.travelersPercent}
          icon={<Users className="text-blue-600" />}
        />

        <StatCard
          title="Organizers"
          value={stats.verifiedOrganizers}
          percent={percentages.organizersPercent}
          icon={<CheckCircle className="text-green-600" />}
        />

        <StatCard
          title="Trips"
          value={stats.totalTrips}
          percent={percentages.tripsPercent}
          icon={<MapPin className="text-purple-600" />}
        />

        <StatCard
          title="Pending"
          value={stats.pendingVerifications}
          percent={percentages.pendingPercent}
          down
          icon={<Clock className="text-yellow-500" />}
        />
      </div>

      {/*  Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <ChartCard title="Statistics">
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4f46e5" />
          </BarChart>
        </ChartCard>

        {/* Line Chart */}
        <ChartCard title="Platform Growth">
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line dataKey="users" stroke="#4f46e5" />
            <Line dataKey="trips" stroke="#10b981" />
          </LineChart>
        </ChartCard>

        {/*  Verification Pie Chart */}
        <ChartCard title="Organizer Verification Status">
          <PieChart>
            <Pie
              data={verificationPieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={90}
              label
            >
              {verificationPieData.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ChartCard>
      </div>
    </div>
  );
};

/* ---------------- COMPONENTS ---------------- */

const StatCard = ({ title, value, percent, icon, down }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm text-muted-foreground">
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="flex justify-between items-center">
      <div className="flex gap-3 items-center">
        {icon}
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <div
        className={`flex items-center gap-1 font-semibold ${
          down ? "text-red-500" : "text-green-500"
        }`}
      >
        {down ? <ArrowDown size={16} /> : <ArrowUp size={16} />}
        {percent}%
      </div>
    </CardContent>
  </Card>
);

const ChartCard = ({ title, children }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent style={{ height: 300 }}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default AdminDashboard;
