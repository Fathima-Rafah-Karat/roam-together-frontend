import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  Edit,
  X as XIcon,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import axios from "axios";
import toast from "react-hot-toast";

export default function TripListDetails() {
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

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [participantCount, setParticipantCount] = useState(0);

  // Edit dialog state
  const [editOpen, setEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    price: "",
    location: "",
    participants: "",
    startDate: "",
    endDate: "",
    inclusionspoint: [],
    exclusionspoint: [],
    tripPhoto: [],
    planDetails: [],
    inclusions: {},
  });

  const [newInclusion, setNewInclusion] = useState("");
  const [newExclusion, setNewExclusion] = useState("");

  // Fetch trip
  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/traveler/${id}`);
        setTrip(res.data.data || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch trip details");
      } finally {
        setLoading(false);
      }
    };
    fetchTrip();
  }, [id]);

  // Fetch participant count
  useEffect(() => {
    const fetchCount = async () => {
      try {
        if (!trip?._id) return;
        const res = await axios.get(`http://localhost:5000/api/traveler/participants/${trip._id}`);
        if (res.data.success) {
          setParticipantCount(res.data.count);
        }
      } catch (err) {
        console.error("Error fetching participant count:", err);
      }
    };
    fetchCount();
  }, [trip]);

  // Auto slide
  useEffect(() => {
    if (trip?.tripPhoto?.length) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev === trip.tripPhoto.length - 1 ? 0 : prev + 1));
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [trip]);

  useEffect(() => {
    if (sliderRef.current && trip?.tripPhoto?.length) {
      sliderRef.current.scrollTo({
        left: currentSlide * sliderRef.current.offsetWidth,
        behavior: "smooth",
      });
    }
  }, [currentSlide, trip]);

  const toggleDay = (day) => {
    setOpenDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const fetchParticipants = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/traveler/participants/${trip._id}`);
      if (res.data.success) {
        setParticipants(res.data.data);
      }
    } catch (error) {
      console.error("Error loading participants:", error);
    }
  };

  useEffect(() => {
    if (participantsOpen && trip?._id) {
      fetchParticipants();
    }
  }, [participantsOpen, trip?._id]);

  const openLightboxAt = (index) => {
    if (!trip?.tripPhoto?.length) return;
    const safeIndex = Math.max(0, Math.min(index, trip.tripPhoto.length - 1));
    setLightboxIndex(safeIndex);
    setLightboxOpen(true);
  };

  const prevLightbox = () => {
    if (!trip?.tripPhoto?.length) return;
    setLightboxIndex((prev) => (prev === 0 ? trip.tripPhoto.length - 1 : prev - 1));
  };

  const nextLightbox = () => {
    if (!trip?.tripPhoto?.length) return;
    setLightboxIndex((prev) => (prev === trip.tripPhoto.length - 1 ? 0 : prev + 1));
  };

  const handleChat = (phone) => {
    if (phone) window.open(`https://wa.me/${phone}`, "_blank");
  };

  if (loading)
    return <p className="text-center py-10 text-muted-foreground">Loading trip...</p>;

  if (!trip)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold mb-4">Trip not found</h2>
        <Button onClick={() => navigate("/dash/dashboard")}>Go Back</Button>
      </div>
    );

  // Build inclusionsObj for icons
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

  const handleDeleteTrip = async () => {
    try {
      const confirm = await new Promise((resolve) => {
        toast(
          (t) => (
            <div className="flex flex-col gap-2">
              <span>Are you sure you want to cancel this trip?</span>
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(false);
                  }}
                >
                  No
                </button>
                <button
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={() => {
                    toast.dismiss(t.id);
                    resolve(true);
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          ),
          { duration: Infinity }
        );
      });

      if (!confirm) return;

      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized — please login again");
        return;
      }

      const res = await axios.delete(
        `http://localhost:5000/api/traveler/remove-trip/${trip._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate(-1);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to cancel trip");
    }
  };

  // Prepare and open edit dialog
  const openEditDialog = () => {
    setEditData({
      title: trip.title || "",
      description: trip.description || "",
      price: trip.price || "",
      location: trip.location || "",
      participants: trip.participants || "",
      startDate: trip.startDate ? trip.startDate.substring(0, 10) : "",
      endDate: trip.endDate ? trip.endDate.substring(0, 10) : "",
      inclusionspoint: Array.isArray(trip.inclusionspoint)
        ? [...trip.inclusionspoint]
        : trip.inclusionspoint
          ? trip.inclusionspoint.split(",").map(p => p.trim())
          : [],
      exclusionspoint: Array.isArray(trip.exclusionspoint)
        ? [...trip.exclusionspoint]
        : trip.exclusionspoint
          ? trip.exclusionspoint.split(",").map(p => p.trim())
          : [],
      planDetails: Array.isArray(trip.planDetails) ? trip.planDetails.map(day => ({ ...day })) : [],
      tripPhoto: trip.tripPhoto || [],
      inclusions: trip.inclusions || {},
    });
    setEditOpen(true);
  };

  const cleanPointsToArray = (raw) => {
    if (!raw && raw !== "") return [];
    const joined = Array.isArray(raw) ? raw.join(",") : String(raw);
    return joined
      .replace(/[\[\]"]/g, "")
      .split(",")
      .map((x) => x.trim())
      .map((x) => x.replace(/^[.,\s]+|[.,\s]+$/g, ""))
      .filter((x) => x && x !== "." && x !== ",");
  };

  // PUT handler
  const handleUpdateTrip = async (e) => {
    e?.preventDefault?.();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Unauthorized — please login again");
        return;
      }

      const formData = new FormData();
      formData.append("title", editData.title);
      formData.append("description", editData.description);
      formData.append("price", editData.price);
      formData.append("location", editData.location);
      formData.append("participants", editData.participants);
      formData.append("startDate", editData.startDate);
      formData.append("endDate", editData.endDate);
      formData.append("inclusionspoint", JSON.stringify(cleanPointsToArray(editData.inclusionspoint)));
      formData.append("exclusionspoint", JSON.stringify(cleanPointsToArray(editData.exclusionspoint)));
      formData.append("planDetails", JSON.stringify(editData.planDetails));

      editData.tripPhoto.forEach((photo) => {
        if (photo instanceof File) {
          formData.append("tripPhoto", photo);
        }
      });

      const res = await axios.put(
        `http://localhost:5000/api/organizer/trip/${trip._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data?.success) {
        toast.success("Trip updated successfully");
        setTrip(res.data.data || { ...trip, ...editData });
        setEditOpen(false);
      } else {
        toast.error(res.data?.message || "Failed to update trip");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error(err.response?.data?.message || "Failed to update trip");
    }
  };

    return (
        <div className="space-y-6">
            <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="overflow-hidden">
                        <div className="relative">
                            <div
                                ref={sliderRef}
                                className="h-96 overflow-x-auto flex gap-2 scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400"
                            >
                                {trip.tripPhoto?.length > 0 ? (
                                    trip.tripPhoto.map((photo, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:5000/${photo.replace(/^\\+/, "")}`}
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

                        <div className="flex gap-3 justify-center mt-3 overflow-x-auto">
                            {trip.tripPhoto?.slice(0, 3).map((photo, index) => {
                                const remaining = (trip.tripPhoto?.length || 0) - 3;

                                if (index === 2 && remaining > 0) {
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => openLightboxAt(2)}
                                            className="relative h-20 w-28 cursor-pointer rounded-lg overflow-hidden"
                                        >
                                            <img
                                                src={`http://localhost:5000/${photo.replace(/^\\+/, "")}`}
                                                className="h-full w-full object-cover opacity-70"
                                                alt={`thumb-${index}`}
                                            />
                                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-semibold">
                                                +{remaining} more
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <img
                                        key={index}
                                        onClick={() => openLightboxAt(index)}
                                        src={`http://localhost:5000/${photo.replace(/^\\+/, "")}`}
                                        className={`h-20 w-28 object-cover rounded-lg cursor-pointer transition-all ${currentSlide === index ? "ring-4 ring-primary" : "opacity-70"
                                            }`}
                                        alt={`thumb-${index}`}
                                    />
                                );
                            })}
                        </div>

                        {/* Lightbox */}
                        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
                            <DialogContent className="fixed inset-0 bg-black/70 backdrop-blur-sm p-0 max-w-6xl h-full flex items-center justify-center border-none rounded-none shadow-none">
                                <div
                                    className="relative w-full h-full overflow-hidden flex items-center justify-center"
                                    onWheel={(e) => {
                                        if (window.scrollLock) return;
                                        window.scrollLock = true;
                                        if (e.deltaY > 0) nextLightbox();
                                        else prevLightbox();
                                        setTimeout(() => (window.scrollLock = false), 400);
                                    }}
                                    onTouchStart={(e) => {
                                        window.touchStartX = e.touches[0].clientX;
                                    }}
                                    onTouchEnd={(e) => {
                                        const touchEndX = e.changedTouches[0].clientX;
                                        const diff = window.touchStartX - touchEndX;
                                        if (diff > 50) nextLightbox();
                                        if (diff < -50) prevLightbox();
                                    }}
                                >
                                    {trip?.tripPhoto?.length ? (
                                        <img
                                            src={`http://localhost:5000/${trip.tripPhoto[lightboxIndex].replace(/^\\+/, "")}`}
                                            alt={`lightbox-${lightboxIndex}`}
                                            className="max-h-full max-w-full object-contain select-none"
                                            draggable="false"
                                        />
                                    ) : (
                                        <div className="text-white">No images available</div>
                                    )}

                                    <Button
                                        variant="ghost"
                                        className="absolute top-4 right-4 p-2 bg-white/20 rounded-full"
                                        onClick={() => setLightboxOpen(false)}
                                    >
                                        <XIcon className="h-5 w-5 text-white" />
                                    </Button>

                                    {trip?.tripPhoto?.length > 0 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm bg-black/40 px-3 py-1 rounded-md">
                                            {lightboxIndex + 1} / {trip.tripPhoto.length}
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>

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
                                                                .join(",")
                                                                .replace(/[\[\]"]/g, "")
                                                                .split(",")
                                                                .map((item) => item.trim())
                                                                .filter((item) => item !== "" && item !== "." && item !== ",")
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
                                                                .map((item) => item.trim())
                                                                .filter((item) => item !== "" && item !== "." && item !== ",")
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

                {/* Right Section */}
                <div className="space-y-4">
                    <Card className="sticky top-6">
                        <CardHeader>
                            <CardTitle>Trip Actions</CardTitle>
                            <CardDescription>Interact with this trip</CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {/* EDIT TRIP (Dialog) */}
                            <Dialog open={editOpen} onOpenChange={setEditOpen}>
                                <div>
                                    <DialogTrigger asChild>
                                        <Button className="w-full gap-2 bg-blue" onClick={openEditDialog}>
                                            Edit Trip
                                        </Button>
                                    </DialogTrigger>

                                    <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-auto">
                                        <DialogHeader>
                                            <DialogTitle className="!text-xl !font-bold flex justify-start gap-3"><Edit className="text-red-500"/>Edit Trip Details</DialogTitle>
                                            <p> Update the information for this trip.</p>
                                        </DialogHeader>

                                      <form onSubmit={handleUpdateTrip} className="space-y-6">

          {/* BASIC INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <Label>Title</Label>
              <Input
                placeholder="Trip Title"
                value={editData.title}
                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Price</Label>
              <Input
                placeholder="Price"
                value={editData.price}
                onChange={(e) => setEditData({ ...editData, price: e.target.value })}
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                placeholder="Location"
                value={editData.location}
                onChange={(e) => setEditData({ ...editData, location: e.target.value })}
              />
            </div>

            <div>
              <Label>Participants</Label>
              <Input
                placeholder="Participants"
                value={editData.participants}
                onChange={(e) => setEditData({ ...editData, participants: e.target.value })}
              />
            </div>

            <div>
              <Label>Start Date</Label>
              <Input
                type="date"
                value={editData.startDate}
                onChange={(e) => setEditData({ ...editData, startDate: e.target.value })}
              />
            </div>

            <div>
              <Label>End Date</Label>
              <Input
                type="date"
                value={editData.endDate}
                onChange={(e) => setEditData({ ...editData, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Description</Label>
            <Textarea
              rows={4}
              placeholder="Description"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
          </div>

          {/* CHECKBOX INCLUSIONS */}
          <div>
            <Label className="font-semibold text-lg">Inclusions</Label>
            <div className="flex gap-4 flex-wrap mt-2">
              {["meals", "stay", "transport", "activities"].map((inc) => (
                <label key={inc} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!editData.inclusions?.[inc]}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        inclusions: {
                          ...editData.inclusions,
                          [inc]: e.target.checked,
                        },
                      })
                    }
                  />
                  <span className="capitalize">{inc}</span>
                </label>
              ))}
            </div>
          </div>

         {/* INCLUSION POINTS */}
<div className="space-y-2">
  <Label className="font-semibold text-lg">Inclusion Points</Label>
  <div className="flex gap-2">
    <Input
      value={newInclusion}
      placeholder="Add inclusion point"
      onChange={(e) => setNewInclusion(e.target.value)}
    />
    <Button
      type="button"
      onClick={() => {
        if (newInclusion.trim()) {
          setEditData({
            ...editData,
            inclusionspoint: [...editData.inclusionspoint, newInclusion.trim()],
          });
          setNewInclusion("");
        }
      }}
    >
      Add
    </Button>
  </div>
  <div className="flex flex-wrap gap-2 mt-2">
    {editData.inclusionspoint.map((point, index) => (
      <div
        key={index}
        className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
      >
        <span>{point}</span>
        <XIcon
          size={14}
          className="cursor-pointer text-red-500 hover:text-red-600"
          onClick={() =>
            setEditData({
              ...editData,
              inclusionspoint: editData.inclusionspoint.filter((_, i) => i !== index),
            })
          }
        />
      </div>
    ))}
  </div>
</div>

{/* EXCLUSION POINTS */}
<div className="space-y-2">
  <Label className="font-semibold text-lg">Exclusion Points</Label>
  <div className="flex gap-2">
    <Input
      value={newExclusion}
      placeholder="Add exclusion point"
      onChange={(e) => setNewExclusion(e.target.value)}
    />
    <Button
      type="button"
      onClick={() => {
        if (newExclusion.trim()) {
          setEditData({
            ...editData,
            exclusionspoint: [...editData.exclusionspoint, newExclusion.trim()],
          });
          setNewExclusion("");
        }
      }}
    >
      Add
    </Button>
  </div>
  <div className="flex flex-wrap gap-2 mt-2">
    {editData.exclusionspoint.map((point, index) => (
      <div
        key={index}
        className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
      >
        <span>{point}</span>
        <XIcon
          size={14}
          className="cursor-pointer text-red-500 hover:text-red-600"
          onClick={() =>
            setEditData({
              ...editData,
              exclusionspoint: editData.exclusionspoint.filter((_, i) => i !== index),
            })
          }
        />
      </div>
    ))}
  </div>
</div>


          {/* PHOTOS */}
          <div>
            <Label className="font-semibold text-lg">Trip Photos</Label>
            <div className="flex gap-3 flex-wrap mt-2">
              {editData.tripPhoto.map((photo, idx) => {
                const url =
                  typeof photo === "string"
                    ? `http://localhost:5000/${photo}`
                    : URL.createObjectURL(photo);

                return (
                  <div key={idx} className="relative">
                    <img
                      src={url}
                      alt=""
                      className="w-24 h-16 object-cover rounded"
                    />
                    <XIcon
                      className="absolute top-1 right-1 text-red-500 cursor-pointer"
                      size={16}
                      onClick={() =>
                        setEditData({
                          ...editData,
                          tripPhoto: editData.tripPhoto.filter((_, i) => i !== idx),
                        })
                      }
                    />
                  </div>
                );
              })}
              <Input
                type="file"
                multiple
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    tripPhoto: [...editData.tripPhoto, ...Array.from(e.target.files)],
                  })
                }
              />
            </div>
          </div>

          {/* PLAN DETAILS */}
          <div>
            <Label className="text-lg font-semibold">Plan Details</Label>
            <div className="space-y-3 mt-2">
              {editData.planDetails.map((dayItem, idx) => (
                <div key={idx} className="flex gap-3 items-start">

                  <Input
                    type="number"
                    placeholder="Day"
                    className="w-20"
                    value={dayItem.day}
                    onChange={(e) => {
                      const updated = [...editData.planDetails];
                      updated[idx].day = Number(e.target.value);
                      setEditData({ ...editData, planDetails: updated });
                    }}
                  />

                  <Input
                    placeholder="Title"
                    className="w-1/4"
                    value={dayItem.title}
                    onChange={(e) => {
                      const updated = [...editData.planDetails];
                      updated[idx].title = e.target.value;
                      setEditData({ ...editData, planDetails: updated });
                    }}
                  />

                  <Textarea
                    placeholder="Description"
                    className="w-1/2"
                    rows={2}
                    value={dayItem.plan}
                    onChange={(e) => {
                      const updated = [...editData.planDetails];
                      updated[idx].plan = e.target.value;
                      setEditData({ ...editData, planDetails: updated });
                    }}
                  />

                  <Button
                    variant="destructive"
                    type="button"
                    onClick={() => {
                      const updated = [...editData.planDetails];
                      updated.splice(idx, 1);
                      setEditData({ ...editData, planDetails: updated });
                    }}
                  >
                    Remove
                  </Button>
                </div>
              ))}

              <Button
                type="button"
                onClick={() =>
                  setEditData({
                    ...editData,
                    planDetails: [
                      ...editData.planDetails,
                      { day: "", title: "", plan: "" },
                    ],
                  })
                }
              >
                Add Day
              </Button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>

                                    </DialogContent>
                                </div>
                            </Dialog>

                            {/* Participants Dialog */}
                            <Dialog open={participantsOpen} onOpenChange={setParticipantsOpen}>
                                <DialogTrigger asChild>
                                    <Button variant="outline" className="w-full gap-2">
                                        <Users className="h-4 w-4" />
                                        View Participants ({participantCount})
                                    </Button>
                                </DialogTrigger>

                                <DialogContent className="sm:max-w-[500px]">
                                    <DialogHeader>
                                        <DialogTitle>Trip Participants</DialogTitle>
                                    </DialogHeader>

                                    <div className="space-y-3 max-h-[300px] overflow-auto pr-2">
                                        {participants.length === 0 ? (
                                            <p className="text-center text-muted-foreground">No participants yet.</p>
                                        ) : (
                                            participants.map((p) => (
                                                <div
                                                    key={p._id}
                                                    className="flex items-center gap-3 p-2 border rounded-md"
                                                >
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={`http://localhost:5000/${p.photo?.replace(/^\\+/, "")}`}
                                                        />
                                                        <AvatarFallback>{p.name?.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium capitalize">{p.name}</p>
                                                        <p className="text-sm text-muted-foreground">{p.email}</p>
                                                        <button
                                                            onClick={() => handleChat(p.phone)}
                                                            className="text-green-600 text-sm underline"
                                                        >
                                                            Chat
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </DialogContent>
                            </Dialog>

                            <Button
                                variant="secondary"
                                className="w-full gap-2"
                                onClick={() => handleChat(trip.contactPhone)}
                            >
                                <MessageCircle className="h-4 w-4" /> Chat with Group
                            </Button>

                            <Button
                                className="w-full bg-red-600 text-white hover:bg-red-700"
                                onClick={handleDeleteTrip}
                            >
                                Cancel
                            </Button>

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
