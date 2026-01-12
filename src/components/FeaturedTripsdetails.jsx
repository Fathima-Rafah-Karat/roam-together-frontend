import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Users,
  Clock,
  MessageCircle,
  CheckCircle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Coffee,
  Bed,
  Car,
  Activity,
  X as XIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import axios from "axios";
import { getParticipantCount } from "../api/participantsApi";
import { getTripById } from "../api/tripsApi";
import { getParticipants } from "../api/participantsApi";
import { getImageUrl } from "../utils/getImageUrl";
import { registerForTrip } from "../api/traveler/registrationApi";
import { Toaster, toast } from "react-hot-toast";


export default function FeaturedTripsdetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [participantsOpen, setParticipantsOpen] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [openDays, setOpenDays] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);
  const [activeTab, setActiveTab] = useState("itinerary");
  const [registerOpen, setRegisterOpen] = useState(false);

  // Lightbox state 
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [participantCount, setParticipantCount] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);

  
  // Fetch participant count when component loads or when participants change
 useEffect(() => {
  const fetchCount = async () => {
    try {
      if (!trip?._id) return;

      const data = await getParticipantCount(trip._id);

      if (data?.success) {
        setParticipantCount(data.count);
      }
    } catch (err) {
      console.error("Error fetching participant count:", err);
    }
  };

  fetchCount();
}, [trip?._id]);

  // Fetch trip details
useEffect(() => {
  const fetchTrip = async () => {
    try {
      if (!id) return;

      const tripData = await getTripById(id);
      setTrip(tripData || null);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to fetch trip details",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchTrip();
}, [id]);


  // Auto-scroll images every 2 seconds (keeps original behavior)
  useEffect(() => {
    if (!trip?.tripPhoto?.length) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === trip.tripPhoto.length - 1 ? 0 : prev + 1
      );
    }, 2000);
    return () => clearInterval(interval);
  }, [trip]);

  // Scroll slider when currentSlide changes
  useEffect(() => {
    if (sliderRef.current && trip?.tripPhoto?.length) {
      sliderRef.current.scrollTo({
        left: currentSlide * sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentSlide, trip]);

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (!lightboxOpen) return;

    const onKey = (e) => {
      if (e.key === "Escape") setLightboxOpen(false);
      if (e.key === "ArrowLeft") prevLightbox();
      if (e.key === "ArrowRight") nextLightbox();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxOpen, trip, lightboxIndex]);

  // const handleChat = (phone) => {
  //   window.open(`https://wa.me/${phone}`, "_blank");
  // };

  const toggleDay = (day) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };



useEffect(() => {
  if (participantsOpen && trip?._id) {
    fetchParticipants();
  }
}, [participantsOpen, trip?._id]);

const fetchParticipants = async () => {
  try {
    const data = await getParticipants(trip._id);

    if (data.success) {
      setParticipants(data.data);
    }
  } catch (error) {
    console.error("Error loading participants:", error);
  }
};

  // Lightbox helpers
  const openLightboxAt = (index) => {
    if (!trip?.tripPhoto?.length) return;
    const safeIndex = Math.max(0, Math.min(index, trip.tripPhoto.length - 1));
    setLightboxIndex(safeIndex);
    setLightboxOpen(true);
  };

  const prevLightbox = () => {
    if (!trip?.tripPhoto?.length) return;
    setLightboxIndex((prev) =>
      prev === 0 ? trip.tripPhoto.length - 1 : prev - 1
    );
  };

  const nextLightbox = () => {
    if (!trip?.tripPhoto?.length) return;
    setLightboxIndex((prev) =>
      prev === trip.tripPhoto.length - 1 ? 0 : prev + 1
    );
  };

  if (loading)
    return (
      <p className="text-center py-10 text-muted-foreground">Loading trip...</p>
    );

  if (!trip)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
        <Button onClick={() => navigate("/dash/dashboard")}>Go Back</Button>
      </div>
    );

  // Convert inclusions to object
  const inclusionsObj = {};
  if (trip.inclusions) {
    if (typeof trip.inclusions === "string") {
      trip.inclusions.split(",").forEach((item) => {
        inclusionsObj[item.trim()] = true;
      });
    } else {
      Object.assign(inclusionsObj, trip.inclusions);
    }
  }

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden">
            {/* --- Image Slider --- */}
            <div className="relative">
              <div
                ref={sliderRef}
                className="h-96 overflow-x-auto flex gap-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400"
              >
                {trip.tripPhoto?.length > 0 ? (
                  trip.tripPhoto.map((photo, index) => (
                    <img
                      key={index}
                      src={getImageUrl(photo)}
                      alt={`${trip.title} ${index + 1}`}
                      className="h-96 w-full flex-shrink-0 object-cover rounded-lg snap-center"
                    />
                  ))
                ) : (
                  <img
                    src="/fallback.jpg"
                    alt="Fallback"
                    className="h-96 w-full object-cover rounded-lg"
                  />
                )}
              </div>

            </div>

            {/* ---- Thumbnails (Only 3 + More) ---- */}
            <div className="flex gap-3 justify-center mt-3 overflow-x-auto">
              {trip.tripPhoto?.slice(0, 3).map((photo, index) => {
                const remaining = (trip.tripPhoto?.length || 0) - 3;

                // Last (3rd) thumbnail shows "+N more"
                if (index === 2 && remaining > 0) {
                  return (
                    <div
                      key={index}
                      onClick={() => openLightboxAt(2)}
                      className="relative h-20 w-28 cursor-pointer rounded-lg overflow-hidden"
                    >
                      <img
                        src={getImageUrl(photo)}
                        className="h-full w-full object-cover opacity-70"
                        alt={`thumb-${index}`}
                      />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
                        +{remaining} more
                      </div>
                    </div>
                  );
                }

                // Normal thumbnails
                return (
                  <img
                    key={index}
                    onClick={() => openLightboxAt(index)}
                    src={getImageUrl(photo)}
                    className={`h-20 w-28 object-cover rounded-lg cursor-pointer transition-all 
                      ${currentSlide === index ? "ring-4 ring-primary" : "opacity-70"}`}
                    alt={`thumb-${index}`}
                  />
                );
              })}
            </div>

            {/* ---------------- Lightbox With ONE-BY-ONE Scroll / Swipe ---------------- */}
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogContent
                className="
      fixed inset-0 bg-black/70 backdrop-blur-sm p-0 
      max-w-6xl h-full flex items-center justify-center 
      border-none rounded-none shadow-none
    "
              >
                <div
                  className="relative w-full h-full overflow-hidden flex items-center justify-center"

                  // === ONE IMAGE PER WHEEL SCROLL ===
                  onWheel={(e) => {
                    if (window.scrollLock) return; // prevent rapid scrolling
                    window.scrollLock = true;

                    if (e.deltaY > 0) nextLightbox();
                    else prevLightbox();

                    setTimeout(() => (window.scrollLock = false), 400); // delay to stop multi-scroll
                  }}

                  // === Touch Swipe ===
                  onTouchStart={(e) => {
                    window.touchStartX = e.touches[0].clientX;
                  }}
                  onTouchEnd={(e) => {
                    const touchEndX = e.changedTouches[0].clientX;
                    const diff = window.touchStartX - touchEndX;

                    if (diff > 50) nextLightbox();      // swipe left
                    if (diff < -50) prevLightbox();     // swipe right
                  }}
                >
                  {/* IMAGE */}
                  {trip?.tripPhoto?.length ? (
                    <img
                      src={getImageUrl(trip.tripPhoto[lightboxIndex])}
                      alt={`lightbox-${lightboxIndex}`}
                      className="max-h-full max-w-full object-contain select-none"
                      draggable="false"
                    />
                  ) : (
                    <div className="text-white">No images available</div>
                  )}

                  {/* CLOSE BUTTON */}
                  <Button
                    variant="ghost"
                    className="absolute top-4 right-4 p-2 bg-white/20 rounded-full"
                    onClick={() => setLightboxOpen(false)}
                  >
                    <XIcon className="h-5 w-5 text-white" />
                  </Button>

                  {/* COUNTER */}
                  {trip?.tripPhoto?.length > 0 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-md">
                      {lightboxIndex + 1} / {trip.tripPhoto.length}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>


            {/* Trip Details */}
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">{trip.title}</CardTitle>

                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-accent">{trip.price}</div>
                  <p className="text-sm text-muted-foreground">per person</p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap mt-4">
                {trip.tags?.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Trip Stats */}
              <h1 className="text-xl font-semibold mb-3">Details</h1>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium">{trip.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Group Size</p>
                    <p className="font-medium">{trip.participants}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {new Date(trip.startDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-3">About This Trip</h3>
                <p
                  className={`text-muted-foreground leading-relaxed transition-all duration-300 ${showFullDescription ? "max-h-full" : "line-clamp-5 overflow-hidden"
                    }`}
                >
                  {trip.description}
                </p>
                {trip.description?.split(" ").length > 20 && (
                  <div className="text-center mt-2">
                    <button
                      className="text-primary text-sm font-medium"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                    >
                      {showFullDescription ? "View Less" : "View More"}
                    </button>
                  </div>
                )}
              </div>

              <Separator />

              {/* Inclusions */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Inclusions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(inclusionsObj).map(([key, value]) => {
                    if (!value) return null;
                    let Icon, label;
                    switch (key) {
                      case "meals":
                        Icon = Coffee;
                        label = "Meals";
                        break;
                      case "stay":
                        Icon = Bed;
                        label = "Stay";
                        break;
                      case "transport":
                        Icon = Car;
                        label = "Transport";
                        break;
                      case "activites":
                        Icon = Activity;
                        label = "Activities";
                        break;
                      default:
                        return null;
                    }
                    return (
                      <div
                        key={key}
                        className="flex flex-col items-center justify-center p-4 bg-muted/20 rounded-lg shadow hover:shadow-md transition-shadow duration-300"
                      >
                        <Icon className="h-8 w-8 text-green-600 mb-2" />
                        <span className="font-medium">{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              <div className="flex justify-evenly mb-6">
                <button
                  className={`rounded-lg px-6 py-3 text-xl text-white ${activeTab === "itinerary" ? "bg-blue-600" : "bg-blue-400"
                    }`}
                  onClick={() => setActiveTab("itinerary")}
                >
                  Daily Itinerary
                </button>

                <button
                  className={`rounded-lg px-6 py-3 text-xl text-white ${activeTab === "info" ? "bg-blue-600" : "bg-blue-400"
                    }`}
                  onClick={() => setActiveTab("info")}
                >
                  Trip Information
                </button>
              </div>

              {/* Daily Itinerary */}
              {activeTab === "itinerary" && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Daily Itinerary</h3>
                  <div className="space-y-4">
                    {trip.planDetails?.map((day) => (
                      <Card key={day.day} className="bg-muted/50 p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 flex items-center justify-center bg-white text-black font-bold rounded-lg">
                              {day.day}
                            </div>
                            <span className="font-medium text-base">{day.title}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="none"
                            onClick={() => toggleDay(day.day)}
                            className="flex items-center justify-center"
                          >
                            {openDays[day.day] ? (
                              <ChevronUp className="h-8 w-8" />
                            ) : (
                              <ChevronDown className="h-8 w-8" />
                            )}
                          </Button>
                        </div>
                        {openDays[day.day] && (
                          <CardContent className="mt-2 text-sm text-muted-foreground">
                            {day.plan}
                          </CardContent>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              )}
         {activeTab === "info" && (
  <div>
    <h3 className="text-xl font-semibold mb-4">Trip Information</h3>

    <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3 text-left font-medium border-b">Inclusions</th>
          <th className="p-3 text-left font-medium border-b">Exclusions</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          {/* INCLUSIONS */}
          <td className="p-3 align-top">
            <ul className="list-disc ml-5">
              {trip.inclusionspoint &&
                trip.inclusionspoint
                  .join(",")                        // merge array into string
                  .replace(/[\[\]"]/g, "")          // remove [" ]
                  .split(",")                       // split
                  .map(item => item.trim())         // trim spaces
                  .filter(item => item !== "" && item !== "." && item !== ",") // remove empty
                  .map((item, index) => (
                    <li key={index} className="capitalize">
                      {item}
                    </li>
                  ))}
            </ul>
          </td>

          {/* EXCLUSIONS */}
          <td className="p-3 align-top">
            <ul className="list-disc ml-5">
              {trip.exclusionspoint &&
                trip.exclusionspoint
                  .join(",")
                  .replace(/[\[\]"]/g, "")
                  .split(",")
                  .map(item => item.trim())
                  .filter(item => item !== "" && item !== "." && item !== ",")
                  .map((item, index) => (
                    <li key={index} className="capitalize">
                      {item}
                    </li>
                  ))}
            </ul>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
)}


            </CardContent>

          </Card>
        </div>


        {/* Right Sidebar */}
        <div className="space-y-4">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Book This Trip</CardTitle>
              <CardDescription>Secure your spot now</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="p-4 bg-primary/10 rounded-lg">
  <div className="flex items-baseline gap-2 mb-1">
    <span className="text-3xl font-bold">{trip.price}</span>
    <span className="text-muted-foreground">per person</span>
  </div>
  <p className="text-m font-semibold text-gray-600 mt-2">
    {participantCount} / {trip.participants} spots filled
  </p>
  <p className="text-sm text-red-600 mt-1">
    {participantCount >= trip.participants
      ? "Trip is full"
      : `${trip.participants - participantCount} spots remaining`}
  </p>
</div>

             <Button className="w-full" size="lg" onClick={() => setRegisterOpen(true)}>
  Register Now
</Button>

{/* Register Now Dialog */}
<Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
  <DialogContent className="sm:max-w-[700px]">
    <DialogHeader>
      <DialogTitle>Register for Trip</DialogTitle>
      <DialogDescription>
        Enter your details to join this trip.
      </DialogDescription>
    </DialogHeader>

    {/* Check if user is logged in */}
    {localStorage.getItem("token") ? (
      <form
  className="space-y-4 mt-4"
  onSubmit={async (e) => {
    e.preventDefault();

    if (participantCount >= trip.participants) {
      toast.error("Registration full. No more seats available.");
      return;
    }

    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("email", e.target.email.value);
    formData.append("phone", e.target.phone.value);
    formData.append("tripId", trip._id);

    if (e.target.photo.files[0]) {
      formData.append("photo", e.target.photo.files[0]);
    }
    if (e.target.aadharcard.files[0]) {
      formData.append("aadharcard", e.target.aadharcard.files[0]);
    }

    try {
      const data = await registerForTrip(formData);

      if (data.success) {
        toast.success("Registration Successful!");
        setRegisterOpen(false);
        setParticipantCount((prev) => prev + 1);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err) {
      console.error("Registration error:", err);
      toast.error(err.response?.data?.error || "Server error");
    }
  }}
>

        {/* Full Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Full Name</label>
          <input
            name="name"
            type="text"
            required
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 transition"
            placeholder="Enter your name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <input
            name="email"
            type="email"
            required
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 transition"
            placeholder="Enter your email"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Phone Number</label>
          <input
            name="phone"
            type="text"
            required
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 transition"
            placeholder="Enter your phone number"
          />
        </div>

        {/* Photo Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Photo</label>
          <input
            name="photo"
            type="file"
            accept="image/*"
            required
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 transition"
          />
        </div>

        {/* Aadhar Card Upload */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Aadhar Card</label>
          <input
            name="aadharcard"
            type="file"
            accept="image/*,.pdf"
            required
            className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setRegisterOpen(false)}
          >
            Cancel
          </Button>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    ) : (
      <div className="text-center py-10">
        <p className="text-red-600 font-semibold text-lg mb-4">
          You must be logged in to register for this trip.
        </p>
        <Button onClick={() => navigate("/auth")}>
          Go to Login
        </Button>
      </div>
    )}
  </DialogContent>
</Dialog>


              {/* <Button
                variant="secondary"
                className="w-full gap-2"
                onClick={handleChat}
              >
                <MessageCircle className="h-4 w-4" /> Chat with Group
              </Button>
   */}


              <Separator />

              <div className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" /> Free cancellation up to 30 days
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" /> Instant confirmation
                </p>
                <p className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" /> 24/7 customer support
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>


    </div>
  );
}
