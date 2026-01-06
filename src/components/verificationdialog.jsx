import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ShieldCheck, Upload } from "lucide-react";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";

export function VerificationDialog({
    open,
    onOpenChange,
    onVerified = () => { }, // default to no-op function
}) {
    const [govtIdType, setGovtIdType] = useState("");
    const [photo, setPhoto] = useState(null);
    const [govtIdPhoto, setGovtIdPhoto] = useState(null);
    const [uploading, setUploading] = useState(false);

    const token = localStorage.getItem("token"); // Organizer JWT

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!photo || !govtIdPhoto || !govtIdType) {
            toast.error("All fields are required!");
            return;
        }

        try {
            setUploading(true);
            const fd = new FormData();
            fd.append("photo", photo);
            fd.append("govtIdPhoto", govtIdPhoto);
            fd.append("govtIdType", govtIdType);

            const res = await axios.post(
                "http://localhost:5000/api/verify/verification",
                fd,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`, // send token
                    },
                }
            );

            toast.success(res.data.message || "Verification submitted successfully!");
            onVerified(true); // call parent callback safely
            onOpenChange(false); // close modal
        } catch (err) {
            console.error("Verification Error:", err);
            toast.error(err.response?.data?.message || "Failed to submit verification");
        } finally {
            setUploading(false);
        }
    };

    return (
        <>
            <Toaster position="top-center" />
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-[700px]">
                    <DialogHeader>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                                <ShieldCheck className="w-5 h-5 text-accent" />
                            </div>
                            <DialogTitle className="text-xl font-display">
                                Verification Required
                            </DialogTitle>
                        </div>
                        <DialogDescription>
                            Please complete your verification to access all organizer features. This helps us maintain a safe and trusted community.
                        </DialogDescription>

                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                        <div className="space-y-2">
                            <Label>Profile Photo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhoto(e.target.files[0])}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Government ID Type</Label>
                            <select
                                className="border rounded-md px-3 py-2 w-full bg-gray-50"
                                value={govtIdType}
                                onChange={(e) => setGovtIdType(e.target.value)}
                                required
                            >
                                <option value="">Select ID Type</option>
                                <option value="driving license">Driving License</option>
                                <option value="aadhar card">Aadhar Card</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label>Government ID Photo</Label>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setGovtIdPhoto(e.target.files[0])}
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">
                            This information is encrypted and used only for verification purposes.
                        </p>
                        <div className="flex gap-3 pt-4">
                            <Button type="submit" className="flex-1 bg-accent" disabled={uploading}>
                                {uploading ? "Uploading..." : <><Upload className="h-4 w-4 mr-2" /> Submit</>}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => onOpenChange(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

