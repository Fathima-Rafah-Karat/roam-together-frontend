// Verification.jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Upload, Edit } from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import {
  getVerificationStatus,
  submitVerification,
} from "../api/admin/verificationApi";

export default function Verification() {
  const [govtIdType, setGovtIdType] = useState("");
  const [photo, setPhoto] = useState(null);
  const [govtIdPhoto, setGovtIdPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("not_submitted");
  const [showModal, setShowModal] = useState(false);
  const [formDisabled, setFormDisabled] = useState(false);

  const organizerId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // Fetch verification status
  const fetchStatus = async () => {
    if (!organizerId) return;

    try {
      const res = await getVerificationStatus(organizerId);

      const backendStatus =
        res.data?.data?.status || res.data?.status || "not_submitted";

      setStatus(backendStatus);

      if (backendStatus !== "not_submitted") {
        setFormDisabled(true);
        setShowModal(true);
      }
    } catch (err) {
      console.error("Status check error:", err);
      setStatus("not_submitted");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // Submit verification
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo || !govtIdPhoto || !govtIdType) {
      toast.error("All fields are required!");
      return;
    }

    try {
      setLoading(true);

      const fd = new FormData();
      fd.append("photo", photo);
      fd.append("govtIdPhoto", govtIdPhoto);
      fd.append("govtIdType", govtIdType);

      const res = await submitVerification(fd);

      toast.success(res.data.message);
      setStatus("pending");
      setFormDisabled(true);
      setShowModal(true);
    } catch (err) {
      const errorData = err.response?.data;
      toast.error(errorData?.message || "Something went wrong");

      if (errorData?.status) {
        setStatus(errorData.status);
        setFormDisabled(true);
        setShowModal(true);
      }
    } finally {
      setLoading(false);
    }
  };

  // Modal UI
  const renderModal = () => {
    let title = "";
    let message = "";
    let iconColor = "";
    let actions = null;

    if (status === "pending") {
      title = "Verification Pending";
      message = "Your verification is under review.";
      iconColor = "text-yellow-500";
    } else if (status === "approved") {
      title = "Verification Approved";
      message = "Your account is now verified!";
      iconColor = "text-green-500";

      setTimeout(() => navigate("/organizer/dashboard"), 1200);
    } else if (status === "rejected") {
      title = "Verification Rejected";
      message = "Please correct your details and resubmit.";
      iconColor = "text-red-500";

      actions = (
        <Button
          className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2 mx-auto mt-2"
          onClick={() => {
            setFormDisabled(false);
            setShowModal(false);
            setStatus("resubmit");
            setPhoto(null);
            setGovtIdPhoto(null);
            setGovtIdType("");
          }}
        >
          <Edit className="w-4 h-4" /> Edit & Resubmit
        </Button>
      );
    }

    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="w-full max-w-md border rounded-xl p-6 shadow-xl bg-white text-center">
          <ShieldCheck className={`w-12 h-12 mx-auto mb-4 ${iconColor}`} />
          <h2 className="text-2xl font-semibold mb-2">{title}</h2>
          <p className="text-gray-600 mb-4">{message}</p>
          {actions}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-gray-100">
      <Toaster position="top-center" />
      {showModal && renderModal()}

      {!showModal && (
        <div className="w-full max-w-3xl border rounded-xl p-6 shadow-xl bg-white">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-semibold">Organizer Verification</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Profile Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files[0])}
                disabled={formDisabled}
              />
            </div>

            <div>
              <Label>Government ID Type</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={govtIdType}
                onChange={(e) => setGovtIdType(e.target.value)}
                disabled={formDisabled}
              >
                <option value="">Select ID Type</option>
                <option value="driving license">Driving License</option>
                <option value="aadhar card">Aadhar Card</option>
              </select>
            </div>

            <div>
              <Label>Government ID Photo</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setGovtIdPhoto(e.target.files[0])}
                disabled={formDisabled}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading || formDisabled}
            >
              {loading ? "Submitting..." : <><Upload className="w-4 h-4 mr-2" /> Submit Verification</>}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
