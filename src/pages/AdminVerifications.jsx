// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
// import Navbar from "@/components/Navbar";
// import { useToast } from "@/hooks/use-toast";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// const AdminVerifications = () => {
//   const { user, loading } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [verifications, setVerifications] = useState([]);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [selectedVerification, setSelectedVerification] = useState(null);
//   const [adminNotes, setAdminNotes] = useState("");
//   const [processing, setProcessing] = useState(false);

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
//         .single();

//       if (error) throw error;

//       if (data?.role === "admin") {
//         setIsAdmin(true);
//         fetchVerifications();
//       } else {
//         toast({
//           title: "Access Denied",
//           description: "Only administrators can access this page.",
//           variant: "destructive",
//         });
//         navigate("/");
//       }
//     } catch (error) {
//       console.error("Error checking role:", error);
//       navigate("/");
//     }
//   };

//   const fetchVerifications = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("organizer_verifications")
//         .select("*, profiles(full_name)")
//         .order("submitted_at", { ascending: false });

//       if (error) throw error;
//       setVerifications(data || []);
//     } catch (error) {
//       toast({
//         title: "Error loading verifications",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//   };

//   const handleReview = async (verificationId, newStatus) => {
//     setProcessing(true);

//     try {
//       const { error } = await supabase
//         .from("organizer_verifications")
//         .update({
//           status: newStatus,
//           admin_notes: adminNotes,
//           reviewed_at: new Date().toISOString(),
//           reviewed_by: user?.id,
//         })
//         .eq("id", verificationId);

//       if (error) throw error;

//       toast({
//         title: "Success",
//         description: `Verification ${newStatus} successfully.`,
//       });

//       setSelectedVerification(null);
//       setAdminNotes("");
//       fetchVerifications();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setProcessing(false);
//     }
//   };

//   const getStatusBadge = (status) => {
//     const variants = {
//       approved: "default",
//       rejected: "destructive",
//       pending: "secondary",
//     };
//     return <Badge variant={variants[status]}>{status}</Badge>;
//   };

//   const openReviewDialog = (verification) => {
//     setSelectedVerification(verification);
//     setAdminNotes(verification.admin_notes || "");
//   };

//   if (loading || !user || !isAdmin) {
//     return <div className="min-h-screen bg-background" />;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Navbar />

//       <div className="container mx-auto px-4 pt-24 pb-12">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">Organizer Verifications</h1>
//           <p className="text-muted-foreground">
//             Review and approve organizer verification requests
//           </p>
//         </div>

//         <div className="grid gap-6">
//           {verifications.length === 0 ? (
//             <Card>
//               <CardContent className="py-12 text-center">
//                 <p className="text-muted-foreground">No verification requests</p>
//               </CardContent>
//             </Card>
//           ) : (
//             verifications.map((verification) => (
//               <Card key={verification.id}>
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle>
//                         {verification.profiles?.full_name || "Unknown User"}
//                       </CardTitle>
//                       <p className="text-sm text-muted-foreground mt-1">
//                         Submitted: {new Date(verification.submitted_at).toLocaleDateString()}
//                       </p>
//                     </div>
//                     {getStatusBadge(verification.status)}
//                   </div>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {verification.admin_notes && (
//                     <div className="bg-muted p-3 rounded-lg">
//                       <p className="text-sm font-medium mb-1">Admin Notes:</p>
//                       <p className="text-sm">{verification.admin_notes}</p>
//                     </div>
//                   )}

//                   <div className="flex gap-4">
//                     <Button variant="outline" onClick={() => openReviewDialog(verification)}>
//                       Review Documents
//                     </Button>
//                   </div>
//                 </CardContent>
//               </Card>
//             ))
//           )}
//         </div>

//         <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
//           <DialogContent className="max-w-3xl">
//             <DialogHeader>
//               <DialogTitle>Review Verification</DialogTitle>
//             </DialogHeader>
//             {selectedVerification && (
//               <div className="space-y-6">
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium mb-2">Government ID</p>
//                     <a
//                       href={selectedVerification.govt_id_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 text-primary hover:underline"
//                     >
//                       View Document <ExternalLink className="h-4 w-4" />
//                     </a>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium mb-2">Profile Photo</p>
//                     <a
//                       href={selectedVerification.photo_url}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="flex items-center gap-2 text-primary hover:underline"
//                     >
//                       View Photo <ExternalLink className="h-4 w-4" />
//                     </a>
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="notes">Admin Notes</Label>
//                   <Textarea
//                     id="notes"
//                     value={adminNotes}
//                     onChange={(e) => setAdminNotes(e.target.value)}
//                     placeholder="Add notes about this verification..."
//                     rows={4}
//                   />
//                 </div>

//                 {selectedVerification.status === "pending" && (
//                   <div className="flex gap-4">
//                     <Button
//                       className="flex-1"
//                       onClick={() => handleReview(selectedVerification.id, "approved")}
//                       disabled={processing}
//                     >
//                       <CheckCircle className="h-4 w-4 mr-2" />
//                       Approve
//                     </Button>
//                     <Button
//                       className="flex-1"
//                       variant="destructive"
//                       onClick={() => handleReview(selectedVerification.id, "rejected")}
//                       disabled={processing}
//                     >
//                       <XCircle className="h-4 w-4 mr-2" />
//                       Reject
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             )}
//           </DialogContent>
//         </Dialog>
//       </div>
//     </div>
//   );
// };

// export default AdminVerifications;


import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const sampleVerifications = [
  {
    id: 1,
    full_name: "John Doe",
    submitted_at: "2025-11-18",
    status: "pending",
    govt_id_url: "#",
    photo_url: "#",
    admin_notes: "",
  },
  {
    id: 2,
    full_name: "Jane Smith",
    submitted_at: "2025-11-17",
    status: "approved",
    govt_id_url: "#",
    photo_url: "#",
    admin_notes: "All documents verified successfully.",
  },
  {
    id: 3,
    full_name: "Bob Johnson",
    submitted_at: "2025-11-16",
    status: "rejected",
    govt_id_url: "#",
    photo_url: "#",
    admin_notes: "ID photo did not match profile.",
  },
];

const AdminVerifications = () => {
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500 text-white">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500 text-white">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  const openReviewDialog = (verification) => {
    setSelectedVerification(verification);
    setAdminNotes(verification.admin_notes || "");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Organizer Verifications</h1>
          <p className="text-gray-600">
            Review and approve organizer verification requests
          </p>
        </div>

        <div className="grid gap-6">
          {sampleVerifications.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-gray-500">No verification requests</p>
              </CardContent>
            </Card>
          ) : (
            sampleVerifications.map((verification) => (
              <Card key={verification.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{verification.full_name}</CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Submitted: {new Date(verification.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(verification.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {verification.admin_notes && (
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <p className="text-sm font-medium mb-1">Admin Notes:</p>
                      <p className="text-sm">{verification.admin_notes}</p>
                    </div>
                  )}
                  <div className="flex gap-4">
                    <Button variant="outline" onClick={() => openReviewDialog(verification)}>
                      Review Documents
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <Dialog open={!!selectedVerification} onOpenChange={() => setSelectedVerification(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Review Verification</DialogTitle>
            </DialogHeader>
            {selectedVerification && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Government ID</p>
                    <a
                      href={selectedVerification.govt_id_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      View Document <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2">Profile Photo</p>
                    <a
                      href={selectedVerification.photo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-blue-600 hover:underline"
                    >
                      View Photo <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Admin Notes</Label>
                  <Textarea
                    id="notes"
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this verification..."
                    rows={4}
                  />
                </div>

                {selectedVerification.status === "pending" && (
                  <div className="flex gap-4">
                    <Button className="flex-1">
                      <CheckCircle className="h-4 w-4 mr-2" /> Approve
                    </Button>
                    <Button className="flex-1" variant="destructive">
                      <XCircle className="h-4 w-4 mr-2" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminVerifications;
