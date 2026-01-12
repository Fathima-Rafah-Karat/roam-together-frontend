import { useState } from "react";
import { motion } from "framer-motion";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import axios from "axios";
import { createTrip } from "../api/organizer/createTrip";

export default function CreateTrip() {
    const navigate = useNavigate();

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [tripData, setTripData] = useState({
        title: "",
        description: "",
        location: "",
        participants: "",
        price: "",
        tripPhoto: [],
        inclusionspoint: [],
        exclusionspoint: [],
        planDetails: [],
        inclusions: {
            meals: false,
            stay: false,
            transport: false,
            activites: false,
        },
    });

    const [newInclusion, setNewInclusion] = useState("");
    const [newExclusion, setNewExclusion] = useState("");
    const [newPlan, setNewPlan] = useState({ day: "", title: "", plan: "" });

    const handleChange = (e) => {
        const { id, value, checked } = e.target;
        if (id === "participants" || id === "price") {
            setTripData({ ...tripData, [id]: Number(value) });
        } else if (id in tripData.inclusions) {
            setTripData({
                ...tripData,
                inclusions: { ...tripData.inclusions, [id]: checked },
            });
        } else {
            setTripData({ ...tripData, [id]: value });
        }
    };

    // Inclusion Points
    const addInclusion = () => {
        if (newInclusion.trim()) {
            setTripData({
                ...tripData,
                inclusionspoint: [...tripData.inclusionspoint, newInclusion.trim()],
            });
            setNewInclusion("");
        }
    };
    const removeInclusion = (index) => {
        const updated = tripData.inclusionspoint.filter((_, i) => i !== index);
        setTripData({ ...tripData, inclusionspoint: updated });
    };

    // Exclusion Points
    const addExclusion = () => {
        if (newExclusion.trim()) {
            setTripData({
                ...tripData,
                exclusionspoint: [...tripData.exclusionspoint, newExclusion.trim()],
            });
            setNewExclusion("");
        }
    };
    const removeExclusion = (index) => {
        const updated = tripData.exclusionspoint.filter((_, i) => i !== index);
        setTripData({ ...tripData, exclusionspoint: updated });
    };

    // Plan Details
    const addPlanDetail = () => {
        if (newPlan.day && newPlan.title && newPlan.plan) {
            setTripData({
                ...tripData,
                planDetails: [
                    ...tripData.planDetails,
                    { ...newPlan, day: Number(newPlan.day) },
                ],
            });
            setNewPlan({ day: "", title: "", plan: "" });
        }
    };
    const removePlanDetail = (index) => {
        const updated = tripData.planDetails.filter((_, i) => i !== index);
        setTripData({ ...tripData, planDetails: updated });
    };

    // Reset form
    const resetForm = () => {
        setTripData({
            title: "",
            description: "",
            location: "",
            participants: "",
            price: "",
            tripPhoto: [],
            inclusionspoint: [],
            exclusionspoint: [],
            planDetails: [],
            inclusions: {
                meals: false,
                stay: false,
                transport: false,
                activites: false,
            },
        });
        setStartDate("");
        setEndDate("");
        setNewPlan({ day: "", title: "", plan: "" });
        setNewInclusion("");
        setNewExclusion("");
    };

    // Handle Form Submission
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const formData = new FormData();

    // Append fields
    formData.append("title", tripData.title);
    formData.append("description", tripData.description);
    formData.append("location", tripData.location);
    formData.append("participants", tripData.participants);
    formData.append("price", tripData.price);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);

    // Append JSON fields
    formData.append("inclusions", JSON.stringify(tripData.inclusions));
    formData.append("inclusionspoint", JSON.stringify(tripData.inclusionspoint));
    formData.append("exclusionspoint", JSON.stringify(tripData.exclusionspoint));
    formData.append("planDetails", JSON.stringify(tripData.planDetails));

    // Append images safely
    if (tripData.tripPhoto?.length > 0) {
      tripData.tripPhoto.forEach((file) => {
        formData.append("tripPhoto", file);
      });
    }

    const response = await createTrip(formData);

    console.log("Trip created:", response);

    toast.success("Trip created successfully!");
    resetForm();
    navigate("/organizer/dashboard");

  } catch (error) {
    console.error("Create trip error:", error);
    toast.error(
      error?.response?.data?.message || "Failed to create trip. Try again."
    );
  }
};
    return (
        <div className="max-w-3xl mx-auto">
            {/* Toaster at top-center */}
            <Toaster position="top-center" />

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-4xl font-display font-bold text-foreground mb-2  bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Create New Trip
                </h1>
                <p className="text-muted-foreground mb-6">
                    Plan your next adventure with your team.
                </p>

                <Card className="shadow-soft">
                    <CardHeader>
                        <CardTitle className="font-display text-blue-400">Trip Details</CardTitle>
                        <CardDescription>Fill in the information about your trip.</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Trip Name */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Trip Name</Label>
                                <Input
                                    id="title"
                                    value={tripData.title}
                                    placeholder="e.g., Summer Beach Retreat"
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={tripData.description}
                                    placeholder="Describe your trip..."
                                    rows={4}
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Dates */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="startDate">Start Date</Label>
                                    <Input
                                        id="startDate"
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="endDate">End Date</Label>
                                    <Input
                                        id="endDate"
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location */}
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={tripData.location}
                                    placeholder="e.g., Maldives"
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Participants & Price */}
                            <div className="space-y-2">
                                <Label htmlFor="participants">Maximum Participants</Label>
                                <Input
                                    id="participants"
                                    type="number"
                                    value={tripData.participants}
                                    placeholder="e.g., 30"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={tripData.price}
                                    placeholder="e.g., 500"
                                    required
                                    onChange={handleChange}
                                />
                            </div>

                            {/* Trip Photos */}
                            {/* Trip Photos */}
                            <div className="space-y-2">
                                <Label className="font-bold">Trip Photos</Label>

                                {/* File input */}
                                <Input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) =>
                                        setTripData({ ...tripData, tripPhoto: [...tripData.tripPhoto, ...Array.from(e.target.files)] })
                                    }
                                />

                                {/* Photo preview grid */}
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
                                    {tripData.tripPhoto.map((file, index) => {
                                        const previewURL = typeof file === "string" ? file : URL.createObjectURL(file); // Handle existing URLs & new files

                                        return (
                                            <div key={index} className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-200">
                                                <img
                                                    src={previewURL}
                                                    alt={`Trip Photo ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute top-1 right-1 bg-red-500 rounded-full p-1 text-white hover:bg-red-600"
                                                    onClick={() => {
                                                        const updatedPhotos = tripData.tripPhoto.filter((_, i) => i !== index);
                                                        setTripData({ ...tripData, tripPhoto: updatedPhotos });
                                                    }}
                                                >
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>


                            {/* Inclusions */}
                            <div className="space-y-2">
                                <Label>Inclusions</Label>
                                <div className="flex gap-10 flex-wrap">
                                    {["meals", "stay", "transport", "activites"].map((key) => (
                                        <label key={key} className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                id={key}
                                                checked={tripData.inclusions[key]}
                                                onChange={handleChange}
                                            />
                                            <span className="capitalize">{key}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Inclusion Points */}
                            <div className="space-y-2">
                                <Label>Inclusion Points</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newInclusion}
                                        placeholder="Add inclusion point"
                                        onChange={(e) => setNewInclusion(e.target.value)}
                                    />
                                    <Button type="button" onClick={addInclusion}>
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {tripData.inclusionspoint.map((p, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                                        >
                                            <span>{p}</span>
                                            <span
                                                className="cursor-pointer text-red-500 hover:text-red-600"
                                                onClick={() => removeInclusion(i)}
                                            >
                                                <X size={14} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Exclusion Points */}
                            <div className="space-y-2">
                                <Label>Exclusion Points</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={newExclusion}
                                        placeholder="Add exclusion point"
                                        onChange={(e) => setNewExclusion(e.target.value)}
                                    />
                                    <Button type="button" onClick={addExclusion}>
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {tripData.exclusionspoint.map((p, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                                        >
                                            <span>{p}</span>
                                            <span
                                                className="cursor-pointer text-red-500 hover:text-red-600"
                                                onClick={() => removeExclusion(i)}
                                            >
                                                <X size={14} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Plan Details */}
                            <div className="space-y-2">
                                <Label>Plan Details</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Day"
                                        value={newPlan.day}
                                        onChange={(e) => setNewPlan({ ...newPlan, day: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Title"
                                        value={newPlan.title}
                                        onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                                    />
                                    <Input
                                        placeholder="Plan description"
                                        value={newPlan.plan}
                                        onChange={(e) => setNewPlan({ ...newPlan, plan: e.target.value })}
                                    />
                                    <Button type="button" onClick={addPlanDetail}>
                                        Add
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-3 mt-2">
                                    {tripData.planDetails.map((p, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                                        >
                                            <span>
                                                Day {p.day}: {p.title} - {p.plan}
                                            </span>
                                            <span
                                                className="cursor-pointer text-red-500 hover:text-red-600"
                                                onClick={() => removePlanDetail(i)}
                                            >
                                                <X size={14} />
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Submit & Cancel */}
                            <div className="flex gap-4 pt-4">
                                <Button
                                    type="submit"
                                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
                                >
                                    Create Trip
                                </Button>
                                <Button type="button" variant="outline" onClick={resetForm}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}
