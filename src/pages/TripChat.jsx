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

const getUserIdFromToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload._id || payload.id || payload.userId;
  } catch {
    return null;
  }
};

// Format date to hh:mm AM/PM
const formatTime = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const mins = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${mins} ${ampm}`;
};

const TripChat = () => {
  const { id: tripId } = useParams();
  const navigate = useNavigate();

  const [tripName, setTripName] = useState("");
  const [tripPhoto, setTripPhoto] = useState("");
  const [messages, setMessages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);
  const token = localStorage.getItem("token");
  const myUserId = getUserIdFromToken(token);

  useEffect(() => {
    if (!tripId || !token) return;

    const loadData = async () => {
      try {
        const tripRes = await axios.get(`${API}/api/traveler/${tripId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTripName(tripRes.data.data.title);
        setTripPhoto(
          tripRes.data.data.tripPhoto?.[0]
            ? `${API}/${tripRes.data.data.tripPhoto[0]}`
            : ""
        );

        const participantRes = await axios.get(
          `${API}/api/traveler/participants/${tripId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setParticipants(participantRes.data.data);

        const msgRes = await axios.get(
          `${API}/api/traveler/${tripId}/messages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setMessages(
          msgRes.data.data.map((msg) => {
            const senderName =
              msg.senderId === myUserId
                ? "You"
                : participantRes.data.data.find(
                    (p) => p.authId === msg.senderId
                  )?.name || msg.senderName || "Unknown";

            return {
              _id: msg._id,
              text: msg.text,
              senderId:
                typeof msg.senderId === "object"
                  ? msg.senderId._id
                  : msg.senderId,
              senderName,
              createdAt: msg.createdAt,
            };
          })
        );
      } catch (err) {
        console.error("Chat load error:", err);
      }
    };

    loadData();
  }, [tripId, token, myUserId]);

  useEffect(() => {
    if (!tripId) return;

    socket.emit("joinRoom", tripId);

    socket.on("receiveMessage", (msg) => {
      if (String(msg.senderId) === String(myUserId)) return;

      setMessages((prev) => {
        if (prev.find((m) => m._id === msg._id)) return prev;

        const senderName =
          participants.find((p) => p.authId === msg.senderId)?.name ||
          msg.senderName ||
          "Unknown";

        return [
          ...prev,
          {
            _id: msg._id,
            text: msg.text,
            senderId:
              typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId,
            senderName,
            createdAt: msg.createdAt,
          },
        ];
      });
    });

    return () => socket.off("receiveMessage");
  }, [tripId, participants, myUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() || !myUserId) return;

    const msgPayload = {
      _id: Date.now().toString(),
      tripId,
      text: message,
      senderId: myUserId,
      senderName: "You", // Always "You" for sender
      createdAt: new Date().toISOString(),
    };

    socket.emit("sendMessage", msgPayload);
    setMessage("");
    setMessages((prev) => [...prev, msgPayload]);
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
        {messages.map((msg) => {
          const isOwn = String(msg.senderId) === String(myUserId);

          return (
            <div
              key={msg._id}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`px-4 py-2 rounded-lg shadow max-w-[70%] ${
                  isOwn
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 rounded-bl-none"
                }`}
              >
                <div className="text-[11px] font-bold text-gray-600 mb-1">
                  {msg.senderName}
                </div>
                <div>{msg.text}</div>
                <div className="text-[10px] text-gray-500 mt-1 text-right">
                  {formatTime(msg.createdAt)}
                </div>
              </div>
            </div>
          );
        })}
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














































































































































// correcct 

// import { useEffect, useState, useRef } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { ArrowLeft, Send } from "lucide-react";
// import axios from "axios";
// import socket from "../socket";

// const API = "http://localhost:5000";

// // Decode JWT to get user ID
// const getUserIdFromToken = (token) => {
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     return payload._id || payload.id || payload.userId;
//   } catch {
//     return null;
//   }
// };

// const TripChat = () => {
//   const { id: tripId } = useParams();
//   const navigate = useNavigate();

//   const [tripName, setTripName] = useState("");
//   const [tripPhoto, setTripPhoto] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [participants, setParticipants] = useState([]);
//   const [message, setMessage] = useState("");

//   const messagesEndRef = useRef(null);
//   const token = localStorage.getItem("token");
//   const myUserId = getUserIdFromToken(token);

//   /* ================= LOAD DATA ================= */
//   useEffect(() => {
//     if (!tripId || !token) return;

//     const loadData = async () => {
//       try {
//         // Trip
//         const tripRes = await axios.get(`${API}/api/traveler/${tripId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setTripName(tripRes.data.data.title);
//         setTripPhoto(
//           tripRes.data.data.tripPhoto?.[0]
//             ? `${API}/${tripRes.data.data.tripPhoto[0]}`
//             : ""
//         );

//         // Participants
//         const participantRes = await axios.get(
//           `${API}/api/traveler/participants/${tripId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setParticipants(participantRes.data.data);

//         // Messages
//         const msgRes = await axios.get(
//           `${API}/api/traveler/${tripId}/messages`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         setMessages(
//           msgRes.data.data.map((msg) => ({
//             _id: msg._id,
//             text: msg.text,
//             senderId:
//               typeof msg.senderId === "object"
//                 ? msg.senderId._id
//                 : msg.senderId,
//             senderName: msg.senderName,
//             createdAt: msg.createdAt,
//           }))
//         );
//       } catch (err) {
//         console.error("Chat load error:", err);
//       }
//     };

//     loadData();
//   }, [tripId, token]);

//   /* ================= SOCKET ================= */
//   useEffect(() => {
//     if (!tripId) return;

//     socket.emit("joinRoom", tripId);

//     socket.on("receiveMessage", (msg) => {
//       // Avoid duplicate message if sender emits their own message
//       setMessages((prev) => {
//         if (prev.find((m) => m._id === msg._id)) return prev;
//         return [
//           ...prev,
//           {
//             _id: msg._id,
//             text: msg.text,
//             senderId:
//               typeof msg.senderId === "object"
//                 ? msg.senderId._id
//                 : msg.senderId,
//             senderName: msg.senderName,
//             createdAt: msg.createdAt,
//           },
//         ];
//       });
//     });

//     return () => socket.off("receiveMessage");
//   }, [tripId]);

//   /* ================= AUTO SCROLL ================= */
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   }, [messages]);

//   /* ================= SEND MESSAGE ================= */
//   const sendMessage = () => {
//     if (!message.trim() || !myUserId) return;

//     const msgPayload = {
//       _id: Date.now().toString(), // temporary id until backend confirms
//       tripId,
//       text: message,
//       senderId: myUserId,
//       senderName:
//         participants.find((p) => String(p._id) === String(myUserId))?.name ||
//         "You",
//       createdAt: new Date().toISOString(),
//     };

//     socket.emit("sendMessage", msgPayload);
//     setMessage("");
//   };

//   /* ================= UI ================= */
//   return (
//     <div className="w-full h-screen flex flex-col bg-[#e5ddd5]">
//       {/* HEADER */}
//       <div className="bg-[#075e54] text-white p-4 flex items-center">
//         <button onClick={() => navigate(-1)} className="mr-3">
//           <ArrowLeft size={24} />
//         </button>
//         {tripPhoto && (
//           <img
//             src={tripPhoto}
//             alt="Trip"
//             className="h-10 w-10 rounded-full mr-2 object-cover"
//           />
//         )}
//         <span className="font-bold">{tripName}</span>
//       </div>

//       {/* MESSAGES */}
//       <div className="flex-1 p-4 overflow-y-auto space-y-2">
//         {messages.map((msg) => {
//           const isOwn = String(msg.senderId) === String(myUserId);
//           const displayName = isOwn
//             ? "You"
//             : msg.senderName ||
//               participants.find((p) => String(p._id) === String(msg.senderId))
//                 ?.name ||
//               "Unknown";

//           return (
//             <div
//               key={msg._id}
//               className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`px-4 py-2 rounded-lg shadow max-w-[70%] ${
//                   isOwn
//                     ? "bg-green-500 text-white rounded-br-none"
//                     : "bg-white text-gray-800 rounded-bl-none"
//                 }`}
//               >
//                 <div className="text-[11px] font-bold text-gray-600 mb-1">
//                   {displayName}
//                 </div>
//                 <div>{msg.text}</div>
//               </div>
//             </div>
//           );
//         })}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* INPUT */}
//       <div className="flex items-center p-3 bg-gray-100">
//         <input
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//           placeholder="Type a message"
//           className="flex-1 px-4 py-2 rounded-full outline-none"
//         />
//         <button
//           onClick={sendMessage}
//           className="ml-3 w-10 h-10 flex items-center justify-center rounded-full bg-[#075e54] text-white"
//         >
//           <Send size={18} />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default TripChat;
