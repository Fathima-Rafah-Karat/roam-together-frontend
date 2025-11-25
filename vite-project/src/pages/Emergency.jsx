import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Phone, ArrowLeft } from "lucide-react";
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
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate

const emergencyNumbers = {
  USA: "911",
  Canada: "911",
  UK: "999",
  EU: "112",
  Australia: "000",
  India: "112",
  Japan: "110",
};

const Emergency = () => {
  const navigate = useNavigate(); // ✅ Initialize navigate
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relation: "" });
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchContacts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/traveler/viewemergency");
      console.log(res.data);
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
      await axios.post("http://localhost:5000/api/traveler/emergency", newContact);
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
      await axios.delete(`http://localhost:5000/api/traveler/emergency/${id}`);
      toast.success("Contact deleted successfully!");
      setContacts(contacts.filter((contact) => contact._id !== id));
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete contact");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 pt-5 pb-12 max-w-6xl">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate("/dash/dashboard")}
        >
          <ArrowLeft className="w-4 h-4" /> 
        </Button>

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
                    <Button className="text-lg px-4 py-2 bg-blue-400 text-white rounded-lg flex items-center gap-2">
                      <Plus className="w-4 h-4" /> Add Contact
                    </Button>
                  </DialogTrigger>
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
                        className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 transition"
                      />
                      <label className="text-sm font-medium">Phone Number</label>
                      <input
                        type="text"
                        name="phone"
                        value={newContact.phone}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 transition"
                      />
                      <label className="text-sm font-medium">Relationship</label>
                      <input
                        type="text"
                        name="relation"
                        placeholder="family, friend, etc"
                        value={newContact.relation}
                        onChange={handleInputChange}
                        className="w-full p-2 border rounded-md border-gray-300 focus:outline-none focus:border-blue-500 hover:border-blue-500 transition"
                      />
                    </div>
                    <DialogFooter>
                      <Button onClick={handleAddContact}>Add</Button>
                    </DialogFooter>
                  </DialogContent>
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

        {/* Global Numbers */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Global Emergency Numbers</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(emergencyNumbers).map(([country, number], idx) => (
              <div key={idx} className="p-4 rounded-lg border">
                <p className="font-medium mb-1">{country}</p>
                <span className="text-primary text-lg font-bold">{number}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Emergency;

