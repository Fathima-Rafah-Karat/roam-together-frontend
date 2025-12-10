import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

// Status badge colors
const getStatusBadge = (status) => {
    switch (status) {
        case "approved":
            return <Badge className="bg-green-500 text-white">Approved</Badge>;
        case "rejected":
            return <Badge className="bg-red-500 text-white">Rejected</Badge>;
        default:
            return (
                <Badge className="bg-white !text-black border border-black">
                    Pending
                </Badge>
            );
    }
};



export default function Verifyorganizers() {
    const [verifications, setVerifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // Image modal
    const [openImage, setOpenImage] = useState(false);
    const [selectedImage, setSelectedImage] = useState("");

    const handleImageClick = (src) => {
        setSelectedImage(src);
        setOpenImage(true);
    };

    // Fetch all verifications
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    "http://localhost:5000/api/admin/viewverify"
                );
                setVerifications(res.data.data);
            } catch (error) {
                console.error("Failed to fetch verifications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Approve / Reject handler
    const handleVerify = async (id, status) => {
        try {
            const res = await axios.put(
                `http://localhost:5000/api/admin/verify/${id}`,
                { status }
            );
            // Update local state
            setVerifications((prev) =>
                prev.map((v) => (v._id === id ? { ...v, status: res.data.data.status } : v))
            );
        } catch (error) {
            console.error("Failed to update verification status:", error);
            alert(error.response?.data?.message || "Error updating verification");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading...</p>;

    return (
        <div className="container mx-auto px-4 pb-12">
            <h1 className="text-4xl text-blue-500 font-bold mb-2">Verifications</h1>
            <p className="text-muted-foreground mb-8">
                Manage organizer verification requests
            </p>

            <div className="space-y-4">
                {verifications.length === 0 ? (
                    <Card>
                        <CardContent className="py-12 text-center text-muted-foreground">
                            No verification requests
                        </CardContent>
                    </Card>
                ) : (
                    verifications.map((v, index) => (
                        <motion.div
                            key={v._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="shadow-md rounded-xl border">
                                <CardContent className="p-6 space-y-4">

                                    {/* Organizer Info */}
                                    <div>
                                        <h3 className="font-semibold text-lg pt-4">
                                            {v.organizer?.username || "Unknown Organizer"}
                                        </h3>

                                    </div>

                                    <p className="text-sm font-medium">
                                        Govt ID Type:
                                        <span className="ml-2 text-blue-500">{v.govtIdType}</span>
                                    </p>
                                    {/* Photos */}
                                    <div className="flex gap-6 mt-2">
                                        {/* User Photo */}
                                        <div
                                            className="flex flex-col items-center cursor-pointer"
                                            onClick={() =>
                                                handleImageClick(`http://localhost:5000/${v.photo}`)
                                            }
                                        >
                                            <p className="text-xs text-muted-foreground mb-1">User Photo</p>
                                            <img
                                                src={`http://localhost:5000/${v.photo}`}
                                                className="w-20 h-20 rounded-lg border object-cover shadow-sm hover:ring-2 hover:ring-blue-400"
                                            />
                                        </div>

                                        {/* Govt ID Photo */}
                                        <div
                                            className="flex flex-col items-center cursor-pointer"
                                            onClick={() =>
                                                handleImageClick(`http://localhost:5000/${v.govtIdPhoto}`)
                                            }
                                        >
                                            <p className="text-xs text-muted-foreground mb-1">Govt ID</p>
                                            <img
                                                src={`http://localhost:5000/${v.govtIdPhoto}`}
                                                className="w-20 h-20 rounded-lg border object-cover shadow-sm hover:ring-2 hover:ring-blue-400"
                                            />
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Submitted: {new Date(v.createdAt).toLocaleDateString()}
                                    </p>
                                    {/* Status */}
                                    <div>{getStatusBadge(v.status)}</div>

                                    {/* Approve/Reject Buttons */}
                                    {v.status === "pending" && (
                                        <div className="flex gap-3 mt-4">
                                            <Button
                                                size="sm"
                                                className="bg-green-600 text-white gap-2"
                                                onClick={() => handleVerify(v._id, "approved")}
                                            >
                                                <CheckCircle size={16} />
                                                Approve
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                className="gap-2"
                                                onClick={() => handleVerify(v._id, "rejected")}
                                            >
                                                <XCircle size={16} />
                                                Reject
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Image Preview Modal */}
            <Dialog open={openImage} onOpenChange={setOpenImage}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        {/* <DialogTitle>Image Preview</DialogTitle> */}
                    </DialogHeader>
                    <img
                        src={selectedImage}
                        className="w-full rounded-lg object-contain"
                        alt="Preview"
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
}
