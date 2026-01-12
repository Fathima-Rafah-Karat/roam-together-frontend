// import { Button } from "@/components/ui/button";
// import { MapPin, Users } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import CountUp from "react-countup";
// import heroImage from "@/assets/hero-travel.jpg";
// import { toast } from "react-hot-toast";

// const Hero = () => {
//   const navigate = useNavigate();

//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
//       {/* Background Image with Overlay */}
//       <div
//         className="absolute inset-0 bg-cover bg-center"
//         style={{ backgroundImage: `url(${heroImage})` }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
//       </div>

//       {/* Content */}
//       <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
//         <div className="max-w-4xl mx-auto text-center">
//           {/* Avatar Group */}
//           {/* <div className="flex items-center justify-center gap-2 mb-6">
//             <div className="flex -space-x-2">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-card"
//                 />
//               ))}
//             </div>
//             <span className="text-sm font-medium text-muted-foreground">
//               Join 10,000+ travelers
//             </span>
//           </div> */}

//           {/* Hero Text */}
//           <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
//             Travel Together. <br />
//             <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
//               Discover More.
//             </span>
//           </h1>

//           <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
//             Connect with adventure enthusiasts and solo travelers. Join unforgettable trips,
//             make lifelong friends, and share amazing travel memories.
//           </p>

//           {/* Buttons */}
//           <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
//              <Button
//     size="lg"
//     className="text-base px-8"
//     onClick={() => {
//       const token = localStorage.getItem("token");
//       if (token) {
//         navigate("/trips");
//       } else {
//         navigate("/auth");
//       }
//     }}
//   >
//     <Users className="mr-2 h-5 w-5" />
//     Join a Trip
//   </Button>
// <Button
//   size="lg"
//   variant="secondary"
//   className="text-base px-8"
//   onClick={() => {
//     const token = localStorage.getItem("token");
//     const role = localStorage.getItem("role");

//     if (!token) {
//       navigate("/auth");
//       return;
//     }

//     if (role !== "Organizer") {
//       navigate("/no-access");
//       return;
//     }

//     navigate("/organizer/createtrip");
//   }}
// >
//   <MapPin className="mr-2 h-5 w-5" />
//   Create a Trip
// </Button>

//           </div>

//           {/* Animated Stats */}
//           <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
//             {/* Active Trips */}
//             <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-medium)]">
//               <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
//                 <CountUp start={0} end={500} duration={2.5} suffix="+" />
//               </div>
//               <div className="text-sm text-muted-foreground">Active Trips</div>
//             </div>

//             {/* Happy Travelers */}
//             <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-medium)]">
//               <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">
//                 <CountUp start={0} end={10000} duration={3} suffix="+" />
//               </div>
//               <div className="text-sm text-muted-foreground">Happy Travelers</div>
//             </div>

//             {/* Countries */}
//             <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6 shadow-[var(--shadow-medium)]">
//               <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
//                 <CountUp start={0} end={50} duration={2.5} suffix="+" />
//               </div>
//               <div className="text-sm text-muted-foreground">Countries</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Hero;



import { Button } from "@/components/ui/button";
import { MapPin, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountUp from "react-countup";
import heroImage from "@/assets/hero-travel.jpg";
import { toast } from "react-hot-toast";
// import axios from "axios";
import { getVerificationStatus } from "../api/verifyApi";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Hero = () => {
  const navigate = useNavigate();

  const handleCreateTrip = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    // Not logged in
    if (!token) {
      navigate("/auth");
      return;
    }

    // Not organizer
    if (role !== "Organizer") {
      navigate("/no-access");
      return;
    }

    // Organizer → check verification
   try {
      const res = await getVerificationStatus(userId);
      const status = res?.data?.data?.status;

      if (!status || status === "pending") {
        toast.error("Your verification is pending approval");
        navigate("/verification");
        return;
      }

      if (status === "rejected") {
        toast.error("Verification rejected. Please resubmit.");
        navigate("/verification");
        return;
      }

      if (status === "approved") {
        navigate("/createtrip");
      }
    } catch (error) {
      toast.error("Verification check failed");
      navigate("/verification");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Travel Together. <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Discover More.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with adventure enthusiasts and solo travelers. Join unforgettable trips,
            make lifelong friends, and share amazing travel memories.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            
            {/* JOIN TRIP */}
            <Button
              size="lg"
              className="text-base px-8"
              onClick={() => {
                const token = localStorage.getItem("token");
                const role = localStorage.getItem("role");

                if (!token) {
                  navigate("/auth");
                  return;
                }

                // 🚫 Organizer cannot join trips
                if (role === "Organizer") {
                  navigate("/join-trip-no-access");
                  return;
                }

                // Traveler allowed
                navigate("/dashboard");
              }}
            >
              <Users className="mr-2 h-5 w-5" />
              Join a Trip
            </Button>

            {/* CREATE TRIP */}
            <Button
              size="lg"
              variant="secondary"
              className="text-base px-8"
              onClick={handleCreateTrip}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Create a Trip
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                <CountUp start={0} end={500} duration={2.5} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Active Trips</div>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2">
                <CountUp start={0} end={10000} duration={3} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Happy Travelers</div>
            </div>

            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-6">
              <div className="text-3xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2">
                <CountUp start={0} end={50} duration={2.5} suffix="+" />
              </div>
              <div className="text-sm text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
