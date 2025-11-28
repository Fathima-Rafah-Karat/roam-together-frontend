import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/index";
import Auth from "./pages/Auth";
import DiscoverTrips from "./pages/Dashboard";
import TripDetails from "./pages/TripDetails";
import TripChat from "./pages/TripChat";
import OrganizerDashboard from "./pages/OrganizerDashboard";
import OrganizerVerification from "./pages/OrganizerVerification";
import AdminVerifications from "./pages/AdminVerifications";
import AdminDashboard from "./pages/AdminDashboard";
import TravelDiary from "./pages/TravelDiary";
import TripBlog from "./pages/tripBlog";
import EmergencyContacts from "./pages/Emergency";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/notification";
import MyTrips from "./pages/mytrip";
import MyTripDetails from "./pages/mytripdetails"; 
import { Layout } from "./components/Layout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dash" element={<Layout />}>
            <Route path="dashboard" element={<DiscoverTrips />} />
            <Route path="diary" element={<TravelDiary />} />
            <Route path="tripblog" element={< TripBlog />} />
            <Route path="emergency" element={<EmergencyContacts />} />
            <Route path="notification" element={<Notifications />} />
            <Route path="mytrip" element={<MyTrips />} />
             <Route path="mytrip/:id" element={<MyTripDetails />} />
            <Route path="trip/:id" element={<TripDetails />} />

          </Route>
          {/* <Route path="/trip/:id" element={<TripDetails />} /> */}
          <Route path="/trip/:id/chat" element={<TripChat />} />
          <Route path="/organizer" element={<OrganizerDashboard />} />
          <Route path="/organizer/verify" element={<OrganizerVerification />} />
          <Route path="/admin/verifications" element={<AdminVerifications />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;





