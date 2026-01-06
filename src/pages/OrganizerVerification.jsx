// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/hooks/useAuth";
// import { supabase } from "@/integrations/supabase/client";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Upload, CheckCircle, XCircle, Clock } from "lucide-react";
// // import Navbar from "@/components/Navbar";
// import { useToast } from "@/hooks/use-toast";

// const OrganizerVerification = () => {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [verification, setVerification] = useState(null);
//   const [uploading, setUploading] = useState(false);
//   const [isOrganizer, setIsOrganizer] = useState(false);

//   useEffect(() => {
//     if (!!user) {
//       navigate("/auth");
//     }
//   }, [user,  navigate]);

//   useEffect(() => {
//     if (user) {
//       checkOrganizerRole();
//     }
//   }, [user]);

//   const checkOrganizerRole = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("user_roles")
//         .select("role")
//         .eq("user_id", user?.id)
//         .single();

//       if (error) throw error;

//       if (data?.role === "organizer") {
//         setIsOrganizer(true);
//         fetchVerification();
//       } else {
//         toast({
//           title: "Access Denied",
//           description: "Only organizers can access this page.",
//           variant: "destructive",
//         });
//         navigate("/dashboard");
//       }
//     } catch (error) {
//       console.error("Error checking role:", error);
//       navigate("/dashboard");
//     }
//   };

//   const fetchVerification = async () => {
//     try {
//       const { data, error } = await supabase
//         .from("organizer_verifications")
//         .select("*")
//         .eq("user_id", user?.id)
//         .maybeSingle();

//       if (error) throw error;
//       setVerification(data);
//     } catch (error) {
//       console.error("Error fetching verification:", error);
//     }
//   };

//   const uploadFile = async (file, path) => {
//     const fileExt = file.name.split(".").pop();
//     const fileName = `${user?.id}/${path}.${fileExt}`;

//     const { error: uploadError } = await supabase.storage
//       .from("verifications")
//       .upload(fileName, file, { upsert: true });

//     if (uploadError) throw uploadError;

//     const { data } = supabase.storage
//       .from("verifications")
//       .getPublicUrl(fileName);

//     return data.publicUrl;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       const formData = new FormData(e.currentTarget);
//       const govtIdFile = formData.get("govt_id");
//       const photoFile = formData.get("photo");

//       if (!govtIdFile || !photoFile) {
//         throw new Error("Please upload both documents");
//       }

//       const govtIdUrl = await uploadFile(govtIdFile, "govt_id");
//       const photoUrl = await uploadFile(photoFile, "photo");

//       const { error } = await supabase
//         .from("organizer_verifications")
//         .insert({
//           user_id: user?.id,
//           govt_id_url: govtIdUrl,
//           photo_url: photoUrl,
//           status: "pending",
//         });

//       if (error) throw error;

//       toast({
//         title: "Success!",
//         description: "Your verification documents have been submitted for review.",
//       });

//       fetchVerification();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: error.message,
//         variant: "destructive",
//       });
//     } finally {
//       setUploading(false);
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case "approved":
//         return <CheckCircle className="h-6 w-6 text-green-500" />;
//       case "rejected":
//         return <XCircle className="h-6 w-6 text-red-500" />;
//       default:
//         return <Clock className="h-6 w-6 text-yellow-500" />;
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

 

//   return (
//     <div className="min-h-screen bg-background">
//       {/* <Navbar /> */}

//       <div className="container mx-auto px-4 pt-24 pb-12 max-w-2xl">
//         <div className="mb-8">
//           <h1 className="text-4xl font-bold mb-2">Organizer Verification</h1>
//           <p className="text-muted-foreground">
//             Complete your verification to start creating trips
//           </p>
//         </div>

//         {verification ? (
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Verification Status</CardTitle>
//                 <div className="flex items-center gap-2">
//                   {getStatusIcon(verification.status)}
//                   {getStatusBadge(verification.status)}
//                 </div>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <p className="text-sm text-muted-foreground">Submitted on</p>
//                 <p className="font-medium">
//                   {new Date(verification.submitted_at).toLocaleDateString()}
//                 </p>
//               </div>

//               {verification.status === "pending" && (
//                 <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
//                   <p className="text-sm">
//                     Your verification is under review. This typically takes 1-2 business days.
//                   </p>
//                 </div>
//               )}

//               {verification.status === "approved" && (
//                 <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
//                   <p className="text-sm font-medium text-green-700 dark:text-green-300">
//                     Congratulations! You're verified. You can now create trips.
//                   </p>
//                   <Button 
//                     className="mt-4" 
//                     onClick={() => navigate("/organizer")}
//                   >
//                     Go to Dashboard
//                   </Button>
//                 </div>
//               )}

//               {verification.status === "rejected" && (
//                 <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
//                   <p className="text-sm font-medium text-red-700 dark:text-red-300 mb-2">
//                     Your verification was rejected.
//                   </p>
//                   {verification.admin_notes && (
//                     <div>
//                       <p className="text-sm text-muted-foreground mb-1">Admin notes:</p>
//                       <p className="text-sm">{verification.admin_notes}</p>
//                     </div>
//                   )}
//                   <p className="text-sm mt-3">
//                     Please contact support or resubmit with correct documents.
//                   </p>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         ) : (
//           <Card>
//             <CardHeader>
//               <CardTitle>Submit Verification Documents</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSubmit} className="space-y-6">
//                 <div className="space-y-2">
//                   <Label htmlFor="govt_id">Government ID *</Label>
//                   <Input
//                     id="govt_id"
//                     name="govt_id"
//                     type="file"
//                     accept="image/*,.pdf"
//                     required
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Upload a clear photo of your government-issued ID (passport, driver's license, etc.)
//                   </p>
//                 </div>

//                 <div className="space-y-2">
//                   <Label htmlFor="photo">Profile Photo *</Label>
//                   <Input
//                     id="photo"
//                     name="photo"
//                     type="file"
//                     accept="image/*"
//                     required
//                   />
//                   <p className="text-xs text-muted-foreground">
//                     Upload a clear photo of yourself (selfie)
//                   </p>
//                 </div>

//                 <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
//                   <p className="text-sm">
//                     <strong>Privacy Notice:</strong> Your documents will only be visible to administrators 
//                     for verification purposes and will be stored securely.
//                   </p>
//                 </div>

//                 <Button type="submit" className="w-full" disabled={uploading}>
//                   {uploading ? (
//                     "Uploading..."
//                   ) : (
//                     <>
//                       <Upload className="h-4 w-4 mr-2" />
//                       Submit for Verification
//                     </>
//                   )}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         )}
//       </div>
//     </div>
//   );
// };

// export default OrganizerVerification;
