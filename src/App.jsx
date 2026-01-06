import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Auth from "./pages/Auth";
import DiscoverTrips from "./pages/Dashboard";
import TripDetails from "./pages/TripDetails";
import TripChat from "./pages/TripChat";
import OrganizerDashboard from "./pages/OrganizerDashboard";
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
import {LayoutOrganizer} from "./components/LayoutOrganizer";
import CreateTrip from "./pages/createtrip";
import Verification from "./pages/veification";
import TripsList from "./pages/mytriplist";
import TripListDetails from "./pages/mytriplistdetail";
import { LayoutAdmin } from "./components/LayoutAdmin";
import Manageuser from "./pages/Manageuser";
import Verifyorganizers from "./pages/Verifyorganizers";
import Trips from "./pages/Trips";
import AdminTripsDetails from "./pages/admintripsdetails";
import FeaturedTripsdetails from "./components/FeaturedTripsdetails";
import NoAccess from "./components/NoAccess";
import JoinTripNoAccess from "./components/JoinTripNoAccess";
import JoinTrip from "./components/JoinTriplist";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
                  <Route path="/trips/:id" element={<FeaturedTripsdetails />} />
                  <Route path="/no-access" element={<NoAccess />} />
                  <Route path="/createtrip" element={<CreateTrip/>}/>
                  <Route path="/join-trip-no-access" element={<JoinTripNoAccess />} />
                  <Route path="/jointrip" element={<JoinTrip/>}/>

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

         <Route path="/organizer" element={<LayoutOrganizer />}>
            <Route path="dashboard" element={<OrganizerDashboard />} />
            <Route path="createtrip" element={<CreateTrip />}/>
            <Route path="TripsList" element={<TripsList/> }/>
            <Route path="TripList/:id" element={<TripListDetails/>}/>
          </Route>
 
          <Route path="/admin" element={<LayoutAdmin />}>
             <Route path="dashboard" element={<AdminDashboard />}/>
             <Route path="manageuser" element={<Manageuser />}/>
             <Route path="verifyorganizers" element={<Verifyorganizers/>}/>
             <Route path="Trips" element={<Trips />}/>
             <Route path="Trips/:id" element={<AdminTripsDetails />}/>
          </Route>
                   <Route path="/verification" element={<Verification/>}/>

          {/* <Route path="/trip/:id" element={<TripDetails />} /> */}
          <Route path="/trip/:id/chat" element={<TripChat />} />
          {/* <Route path="/organizer" element={<OrganizerDashboard />} /> */}
          {/* <Route path="/admin/verifications" element={<AdminVerifications />} /> */}
          {/* <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;





