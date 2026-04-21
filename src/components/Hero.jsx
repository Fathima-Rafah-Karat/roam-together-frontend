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
import { getVerificationStatus } from "../api/verifyApi";
import { RiRobot2Fill } from "react-icons/ri";
import { useState } from "react";
import { chat } from "../api/chatbot/chat";
import { IoCloseSharp } from "react-icons/io5";


const Hero = () => {
  const navigate = useNavigate();

  // 🔁 Toggle this
  const isResponsive = true; // false = non-responsive
  const [showChat, setShowChat] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateTrip = async () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const userId = localStorage.getItem("userId");

    if (!token) {
      navigate("/auth");
      return;
    }

    if (role !== "Organizer") {
      navigate("/no-access");
      return;
    }

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
      // toast.error("Verification check failed");
      navigate("/verification");
    }
  };

  // 🎯 Count text class
  const countTextClass = isResponsive
    ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl"
    : "text-3xl";

 const handleSend = async () => {
  if (!input.trim()) return;

  const userMessage = { sender: "user", text: input };
  setMessages((prev) => [...prev, userMessage]);
  setLoading(true);

  try {
    const res = await chat({ text: input });
    console.log("API response:", res.data);

    const botMessage = {
      sender: "bot",
      text: res?.data?.botMessage?.text || "No response",
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    console.error("Chat error:", error.response || error.message);

    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: "Something went wrong 😢" },
    ]);
  }

  setInput("");
  setLoading(false);
};
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            Travel Together. <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Discover More.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with adventure enthusiasts and solo travelers. Join unforgettable trips,
            make lifelong friends, and share amazing travel memories.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
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

                if (role === "Organizer") {
                  navigate("/join-trip-no-access");
                  return;
                }

                navigate("/dash/dashboard");
              }}
            >
              <Users className="mr-2 h-5 w-5" />
              Join a Trip
            </Button>

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
          <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-2xl mx-auto mt-16">
            {/* Active Trips */}
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div
                className={`font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 ${countTextClass}`}
              >
                <CountUp start={0} end={500} duration={2.5} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Active Trips
              </div>
            </div>

            {/* Happy Travelers */}
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div
                className={`font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-2 ${countTextClass}`}
              >
                <CountUp start={0} end={10000} duration={3} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Happy Travelers
              </div>
            </div>

            {/* Countries */}
            <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-4 sm:p-6">
              <div
                className={`font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-2 ${countTextClass}`}
              >
                <CountUp start={0} end={50} duration={2.5} suffix="+" />
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Countries
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Moved outside the z-10 container to stay on top while scrolling */}
      <div className="fixed right-10 bottom-10 z-[100]">
        <RiRobot2Fill className="text-4xl text-blue-500 cursor-pointer" onClick={() => setShowChat(!showChat)} />
      </div>

      {showChat && (
        <div className="fixed right-10 bottom-24 w-80 sm:w-96 h-[400px] bg-white shadow-2xl rounded-2xl flex flex-col overflow-hidden z-[100]">
          {/* Header */}
          <div className="bg-blue-500 text-white p-3 font-semibold flex justify-between items-center">
            <span>How can I help you?</span>
            <button onClick={() => setShowChat(false)}><IoCloseSharp/></button>
          </div>
          <div className="flex-1 p-3 overflow-y-auto text-sm space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-[80%] ${msg.sender === "user"
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 text-black"
                  }`}
              >
                <p className="whitespace-pre-line">
                  {msg.text}
                </p>
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-xs">Typing...</div>
            )}
          </div>
          <div className="flex flex-row gap-2 mx-2 mb-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              type="text"
              placeholder="Type a message..."
              className="w-full border border-gray-300 rounded-lg px-3 py-4 text-sm "
            />

            <button
              onClick={handleSend}
              className="bg-blue-500 text-white px-3 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Hero;
