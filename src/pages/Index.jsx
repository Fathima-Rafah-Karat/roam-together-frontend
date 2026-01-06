
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedTrips from "../components/FeaturedTrips";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";


const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
     <Hero/>
      <FeaturedTrips/>
      <HowItWorks/>
      <Testimonials/>
    < Footer/>

      
    </div>
  );
};

export default Index;
