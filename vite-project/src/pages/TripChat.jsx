// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Calendar, Users, MapPin, Star } from "lucide-react";
// import { useNavigate } from "react-router-dom";

// const TripCard = ({
//   id,
//   title,
//   location,
//   start_date,
//   end_date,
//   participant_count,
//   max_participants,
//   banner_image,
//   organizer,
//   onJoin,
// }) => {
//   const navigate = useNavigate();

//   const formatDate = (date) => {
//     return new Date(date).toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//     });
//   };

//   return (
//     <Card className="overflow-hidden hover:shadow-[var(--shadow-large)] transition-all duration-300 hover:scale-[1.02] cursor-pointer">
//       <div
//         className="relative h-56 overflow-hidden"
//         onClick={() => navigate(`/trip/${id}`)}
//       >
//         {banner_image ? (
//           <img
//             src={banner_image}
//             alt={title}
//             className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//           />
//         ) : (
//           <div className="w-full h-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//             <MapPin className="h-16 w-16 text-primary-foreground opacity-50" />
//           </div>
//         )}
//         <div className="absolute top-4 right-4">
//           <Badge className="bg-card/90 backdrop-blur-sm border-0">
//             <Star className="h-3 w-3 fill-accent text-accent mr-1" />
//             {participant_count}/{max_participants}
//           </Badge>
//         </div>
//       </div>

//       <CardContent className="p-6">
//         <div className="flex items-center gap-2 mb-3">
//           <MapPin className="h-4 w-4 text-primary" />
//           <span className="text-sm font-medium text-primary">{location}</span>
//         </div>

//         <h3 className="text-xl font-semibold mb-3 line-clamp-2">{title}</h3>

//         <div className="space-y-2 mb-4">
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Calendar className="h-4 w-4" />
//             <span>
//               {formatDate(start_date)} - {formatDate(end_date)}
//             </span>
//           </div>
//           <div className="flex items-center gap-2 text-sm text-muted-foreground">
//             <Users className="h-4 w-4" />
//             <span>
//               {participant_count}/{max_participants} travelers joined
//             </span>
//           </div>
//         </div>

//         <div className="flex items-center justify-between pt-4 border-t border-border">
//           <div className="flex items-center gap-2">
//             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary" />
//             <div className="text-sm">
//               <div className="font-medium">{organizer?.full_name || "Unknown"}</div>
//               <div className="text-xs text-muted-foreground">Organizer</div>
//             </div>
//           </div>
//           <div className="flex gap-2">
//             <Button
//               size="sm"
//               variant="outline"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 navigate(`/trip/${id}`);
//               }}
//             >
//               View
//             </Button>
//             {onJoin && (
//               <Button
//                 size="sm"
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   onJoin(id);
//                 }}
//               >
//                 Join
//               </Button>
//             )}
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default TripCard;






























import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import axios from "axios";
import socket from "../socket";

const API = "http://localhost:5000";

const TripChat = () => {
  const { id: tripId } = useParams();
  const navigate = useNavigate();

  const [tripName, setTripName] = useState("");
  const [tripPhoto, setTripPhoto] = useState("");
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");

  /* =========================
     LOAD TRIP + OLD MESSAGES
  ========================= */
  useEffect(() => {
    if (!tripId) return;

    const loadData = async () => {
      try {
        const tripRes = await axios.get(
          `${API}/api/traveler/${tripId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setTripName(tripRes.data.data.title);
        setTripPhoto(
          tripRes.data.data.tripPhoto?.[0]
            ? `${API}/${tripRes.data.data.tripPhoto[0]}`
            : ""
        );

        const msgRes = await axios.get(
          `${API}/api/traveler/${tripId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages(msgRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadData();
  }, [tripId, token]);

  /* =========================
     SOCKET
  ========================= */
  useEffect(() => {
    if (!tripId) return;

    socket.emit("joinRoom", tripId);

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receiveMessage");
  }, [tripId]);

  /* =========================
     AUTO SCROLL
  ========================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* =========================
     SEND MESSAGE (SOCKET ONLY)
  ========================= */
  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      tripId,
      text: message,
    });

    setMessage("");
  };

  return (
    <div className="w-full h-screen flex flex-col bg-[#e5ddd5]">
      {/* HEADER */}
      <div className="bg-[#075e54] text-white p-4 flex items-center">
        <button onClick={() => navigate(-1)} className="mr-3">
          <ArrowLeft size={24} />
        </button>
        {tripPhoto && (
          <img
            src={tripPhoto}
            alt="Trip"
            className="h-10 w-10 rounded-full mr-2 object-cover"
          />
        )}
        <span className="font-bold">{tripName}</span>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className="flex justify-start">
            <div className="bg-white px-4 py-2 rounded-lg shadow max-w-[70%]">
              <div className="text-[11px] font-bold text-gray-600 mb-1">
                {msg.sender}
              </div>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="flex items-center p-3 bg-gray-100">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message"
          className="flex-1 px-4 py-2 rounded-full outline-none"
        />
        <button
          onClick={sendMessage}
          className="ml-3 w-10 h-10 flex items-center justify-center rounded-full bg-[#075e54] text-white"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default TripChat;


