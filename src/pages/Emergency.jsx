import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";



const Emergency = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const token = localStorage.getItem("token");

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api/traveler",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const fetchContacts = async () => {
    try {
      const res = await axiosInstance.get("/viewemergency");
      setContacts(res.data.data || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch contacts");
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewContact({ ...newContact, [name]: value });
  };

  const handleAddContact = async () => {
    if (!newContact.name || !newContact.phone || !newContact.relation) {
      toast.error("Please fill all fields!");
      return;
    }

    try {
      await axiosInstance.post("/emergency", newContact);
      toast.success("Emergency contact added successfully!");
      setNewContact({ name: "", phone: "", relation: "" });
      setDialogOpen(false);
      fetchContacts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to add contact");
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await axiosInstance.delete(`/emergency/${id}`);
      toast.success("Contact deleted successfully!");
      fetchContacts();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete contact");
    }
  };

  // Disable Add Contact if user already added one
  const isRegistrationClosed = contacts.length >= 3;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-5 pb-12 max-w-6xl">
       

        <h1 className="text-4xl font-bold mb-2 text-destructive">Emergency & Safety</h1>
        <p className="text-muted-foreground pb-5">
          Manage your emergency contacts and quick access to help
        </p>

        {/* Emergency Contacts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between items-center">
                <div>Emergency Contacts</div>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      disabled={isRegistrationClosed}
                      className="text-lg px-4 py-2 bg-blue-400 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" /> Add Contact
                    </Button>
                  </DialogTrigger>

                  {!isRegistrationClosed && (
                    <DialogContent className="sm:max-w-[600px]">
                      <DialogHeader>
                        <DialogTitle>Add Emergency Contact</DialogTitle>
                      </DialogHeader>

                      <div className="flex flex-col gap-3 mt-4">
                        <label className="text-sm font-medium">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={newContact.name}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />

                        <label className="text-sm font-medium">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={newContact.phone}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />

                        <label className="text-sm font-medium">Relationship</label>
                        <input
                          type="text"
                          name="relation"
                          value={newContact.relation}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>

                      <DialogFooter>
                        <Button onClick={handleAddContact}>Add</Button>
                      </DialogFooter>
                    </DialogContent>
                  )}
                </Dialog>
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {contacts.length === 0 ? (
              <p className="text-muted-foreground">No emergency contacts added yet.</p>
            ) : (
              contacts.map((contact) => (
                <div
                  key={contact._id}
                  className="flex items-center justify-between p-4 rounded-lg border mb-2"
                >
                  <div className="flex-1">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relation}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary">{contact.phone}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteContact(contact._id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>


      </div>
    </div>
  );
};

export default Emergency;
