import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

import {
  getOrganizerVerifications,
  updateOrganizerVerification,
} from "../api/admin/verificationApi";

// 🔹 Status badge
const getStatusBadge = (status) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500 text-white">Approved</Badge>;
    case "rejected":
      return <Badge className="bg-red-500 text-white">Rejected</Badge>;
    default:
      return (
        <Badge className="bg-white text-black border border-black">
          Pending
        </Badge>
      );
  }
};

export default function Verifyorganizers() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Image preview modal
  const [openImage, setOpenImage] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  const handleImageClick = (src) => {
    setSelectedImage(src);
    setOpenImage(true);
  };

  // 🔹 Fetch verification requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getOrganizerVerifications();
        setVerifications(data || []);
      } catch (error) {
        console.error("Failed to fetch verifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 🔹 Approve / Reject
  const handleVerify = async (id, status) => {
    try {
      const updated = await updateOrganizerVerification(id, status);

      setVerifications((prev) =>
        prev.map((v) =>
          v._id === id ? { ...v, status: updated.status } : v
        )
      );
    } catch (error) {
      console.error("Verification update failed:", error);
      alert("Failed to update verification");
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="container mx-auto px-4 pb-12">
      <h1 className="text-4xl text-blue-500 font-bold mb-2">
        Organizer Verifications
      </h1>
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
              <Card className="rounded-xl shadow-md border">
                <CardContent className="p-6 space-y-4">

                  {/* Organizer Info */}
                  <h3 className="font-semibold text-lg">
                    {v.organizer?.username || "Unknown Organizer"}
                  </h3>

                  <p className="text-sm font-medium">
                    Govt ID Type:
                    <span className="ml-2 text-blue-500">
                      {v.govtIdType}
                    </span>
                  </p>

                  {/* Images */}
                  <div className="flex gap-6">
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        handleImageClick(`${import.meta.env.VITE_API_URL}/${v.photo}`)
                      }
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        User Photo
                      </p>
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${v.photo}`}
                        className="w-20 h-20 rounded-lg border object-cover"
                      />
                    </div>

                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        handleImageClick(`${import.meta.env.VITE_API_URL}/${v.govtIdPhoto}`)
                      }
                    >
                      <p className="text-xs text-muted-foreground mb-1">
                        Govt ID
                      </p>
                      <img
                        src={`${import.meta.env.VITE_API_URL}/${v.govtIdPhoto}`}
                        className="w-20 h-20 rounded-lg border object-cover"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Submitted: {new Date(v.createdAt).toLocaleDateString()}
                  </p>

                  {/* Status */}
                  {getStatusBadge(v.status)}

                  {/* Actions */}
                  {v.status === "pending" && (
                    <div className="flex gap-3">
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
          <img
            src={selectedImage}
            alt="Preview"
            className="w-full rounded-lg object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
