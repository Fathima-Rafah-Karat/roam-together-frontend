// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { z } from "zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { useToast } from "@/hooks/use-toast";
// import { MapPin, UserCircle, Briefcase, Shield } from "lucide-react";

// // -------------------- SCHEMAS --------------------
// const signupSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(6),
//   confirmPassword: z.string(),
//   fullName: z.string().min(2),
//   phone: z.string().min(10),
//   role: z.enum(["Traveler", "Organizer", "Admin"]),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string().min(1),
// });

// const API_URL = import.meta.env.VITE_API_URL;

// const Auth = () => {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const [loading, setLoading] = useState(false);
//   const [selectedRole, setSelectedRole] = useState("Traveler");

//   const roleOptions = [
//     { value: "Traveler", label: "Traveler", icon: UserCircle, description: "Join trips and explore" },
//     { value: "Organizer", label: "Trip Organizer", icon: Briefcase, description: "Create and manage trips" },
//     { value: "Admin", label: "Admin", icon: Shield, description: "Manage the platform" },
//   ];

//   // -------------------- REDIRECTION (SAFE) --------------------
//   const redirectBasedOnRole = (role) => {
//     const r = role.toLowerCase();
//     if (r === "admin") navigate("/admin/verifications");
//     else if (r === "organizer") navigate("/organizer");
//     else navigate("/dashboard");
//   };

//   // -------------------- SIGNUP --------------------
//   const handleSignup = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData(e.currentTarget);
//       const data = {
//         fullName: formData.get("full-name"),
//         email: formData.get("signup-email"),
//         phone: formData.get("phone"),
//         password: formData.get("signup-password"),
//         confirmPassword: formData.get("confirm-password"),
//         role: selectedRole,
//       };

//       const validated = signupSchema.parse(data);

//       const response = await axios.post(`${API_URL}/auth/signup`, {
//         username: validated.fullName,
//         email: validated.email,
//         password: validated.password,
//         phone: validated.phone.startsWith("+") ? validated.phone : "+91" + validated.phone,
//         role: validated.role,
//       });

//       const { token, user } = response.data.data;

//       // Save token & role
//       localStorage.setItem("token", token);
//       localStorage.setItem("role", user.role);

//       toast({ title: "Account Created", description: response.data.message });

//       // Redirect only once after signup
//       redirectBasedOnRole(user.role);
//     } catch (err) {
//       toast({
//         title: "Signup Failed",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------- LOGIN --------------------
//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const formData = new FormData(e.currentTarget);
//       const validated = loginSchema.parse({
//         email: formData.get("login-email"),
//         password: formData.get("login-password")
//       });

//       const response = await axios.post(`${API_URL}/auth/signin`, validated);
//       const { token, user } = response.data.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("role", user.role);

//       toast({ title: "Welcome Back!", description: response.data.message });

//       // Redirect only once after login
//       redirectBasedOnRole(user.role);
//     } catch (err) {
//       toast({
//         title: "Login Failed",
//         description: err.response?.data?.message || err.message,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   // -------------------- JSX --------------------
//   return (
//     <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
//       <div className="w-full max-w-md">
//         <div className="flex items-center justify-center gap-2 mb-8">
//           <div className="bg-primary p-2 rounded-lg">
//             <MapPin className="h-6 w-6 text-primary-foreground" />
//           </div>
//           <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
//             RoamTogether
//           </span>
//         </div>

//         <Tabs defaultValue="login" className="w-full">
//           <TabsList className="grid grid-cols-2">
//             <TabsTrigger value="login">Log In</TabsTrigger>
//             <TabsTrigger value="signup">Sign Up</TabsTrigger>
//           </TabsList>

//           <TabsContent value="login">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Welcome Back</CardTitle>
//                 <CardDescription>Log in to continue</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleLogin} className="space-y-4">
//                   <div>
//                     <Label>Email</Label>
//                     <Input name="login-email" type="email" required />
//                   </div>
//                   <div>
//                     <Label>Password</Label>
//                     <Input name="login-password" type="password" required />
//                   </div>
//                   <Button className="w-full" disabled={loading}>
//                     {loading ? "Logging In..." : "Log In"}
//                   </Button>
//                 </form>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           <TabsContent value="signup">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Create Account</CardTitle>
//                 <CardDescription>Start your travel journey</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <form onSubmit={handleSignup} className="space-y-4">
//                   <div>
//                     <Label>Full Name</Label>
//                     <Input name="full-name" required />
//                   </div>
//                   <div>
//                     <Label>Email</Label>
//                     <Input name="signup-email" type="email" required />
//                   </div>
//                   <div>
//                     <Label>Phone</Label>
//                     <Input name="phone" required />
//                   </div>
//                   <div>
//                     <Label>Password</Label>
//                     <Input name="signup-password" type="password" required />
//                   </div>
//                   <div>
//                     <Label>Confirm Password</Label>
//                     <Input name="confirm-password" type="password" required />
//                   </div>

//                   <div>
//                     <Label>Select Role</Label>
//                     <div className="grid gap-2">
//                       {roleOptions.map((role) => {
//                         const Icon = role.icon;
//                         return (
//                           <button
//                             key={role.value}
//                             type="button"
//                             onClick={() => setSelectedRole(role.value)}
//                             className={`flex gap-3 p-3 rounded-lg border-2 ${
//                               selectedRole === role.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
//                             }`}
//                           >
//                             <Icon className={`h-5 w-5 ${selectedRole === role.value ? "text-primary" : "text-muted-foreground"}`} />
//                             <div>
//                               <div className="font-medium">{role.label}</div>
//                               <div className="text-sm text-muted-foreground">{role.description}</div>
//                             </div>
//                           </button>
//                         );
//                       })}
//                     </div>
//                   </div>

//                   <Button type="submit" className="w-full" disabled={loading}>
//                     {loading ? "Creating..." : "Sign Up"}
//                   </Button>

//                 </form>
//               </CardContent>
//             </Card>
//           </TabsContent>

//         </Tabs>
//       </div>
//     </div>
//   );
// };

// export default Auth;

// Corrected Auth.jsx with working redirection









import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, UserCircle, Briefcase } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

import { signupUser, loginUser } from "@/api/authApi";
import { getVerificationStatus } from "@/api/verifyApi";

/* ---------------- VALIDATION ---------------- */

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string(),
    fullName: z.string().min(2),
    phone: z.string().min(10),
    role: z.enum(["Traveler", "Organizer"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

/* ---------------- COMPONENT ---------------- */

const Auth = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("Traveler");

  const roleOptions = [
    {
      value: "Traveler",
      label: "Traveler",
      icon: UserCircle,
      description: "Join trips and explore",
    },
    {
      value: "Organizer",
      label: "Trip Organizer",
      icon: Briefcase,
      description: "Create and manage trips",
    },
  ];

  /* ---------------- REDIRECT ---------------- */

  const redirectUser = async (role, userId) => {
    const cleanRole = role?.toLowerCase();

    if (cleanRole === "admin") {
      navigate("/admin/dashboard");
      return;
    }

    if (cleanRole === "organizer") {
      try {
        const res = await getVerificationStatus(userId);
        const status = res?.data?.data?.status || "pending";

        if (status === "approved") {
          navigate("/organizer/dashboard");
          return;
        }

        if (status === "rejected") {
          toast.error("Verification rejected. Please resubmit.");
          navigate("/verification");
          return;
        }

        navigate("/verification");
      } catch {
        navigate("/verification");
      }
      return;
    }

    navigate("/dash/dashboard");
  };

  /* ---------------- SIGNUP ---------------- */

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const validated = signupSchema.parse({
        fullName: formData.get("full-name"),
        email: formData.get("signup-email"),
        phone: formData.get("phone"),
        password: formData.get("signup-password"),
        confirmPassword: formData.get("confirm-password"),
        role: selectedRole,
      });

      const res = await signupUser({
        username: validated.fullName,
        email: validated.email,
        password: validated.password,
        phone: validated.phone.startsWith("+")
          ? validated.phone
          : "+91" + validated.phone,
        role: validated.role,
      });

      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user._id);

      toast.success("Account created successfully!");
      redirectUser(user.role, user._id);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      const validated = loginSchema.parse({
        email: formData.get("login-email"),
        password: formData.get("login-password"),
      });

      const res = await loginUser(validated);
      const { token, user } = res.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("userId", user._id);

      toast.success("Login successful!");
      redirectUser(user.role, user._id);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <Toaster position="top-center" />

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="bg-primary p-2 rounded-lg">
            <MapPin className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            RoamTogether
          </span>
        </div>

        <Tabs defaultValue="login">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="login">Log In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* LOGIN */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Welcome Back</CardTitle>
                <CardDescription>Log in to continue</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input name="login-email" type="email" required   autoComplete="off"/>
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input name="login-password" type="password" required autoComplete="new-password"/>
                  </div>
                  <Button className="w-full" disabled={loading}>
                    {loading ? "Logging In..." : "Log In"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SIGNUP */}
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Create Account</CardTitle>
                <CardDescription>Start your journey</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
                  <Input name="full-name" placeholder="Full Name" required />
                  <Input name="signup-email" type="email" placeholder="Email" required autoComplete="off" />
                  <Input name="phone" placeholder="Phone" required />
                  <Input name="signup-password" type="password" placeholder="Password" required autoComplete="new-password"/>
                  <Input
                    name="confirm-password"
                    type="password"
                    placeholder="Confirm Password"
                    required
                  />

                  <div className="grid gap-2">
                    {roleOptions.map((role) => {
                      const Icon = role.icon;
                      return (
                        <button
                          key={role.value}
                          type="button"
                          onClick={() => setSelectedRole(role.value)}
                          className={`flex gap-3 p-3 rounded-lg border-2 ${
                            selectedRole === role.value
                              ? "border-primary bg-primary/5"
                              : "border-border"
                          }`}
                        >
                          <Icon className="h-5 w-5 text-primary" />
                          <div>
                            <div className="font-medium">{role.label}</div>
                            <div className="text-sm text-muted-foreground">
                              {role.description}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <Button className="w-full" disabled={loading}>
                    {loading ? "Creating..." : "Sign Up"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Auth;
