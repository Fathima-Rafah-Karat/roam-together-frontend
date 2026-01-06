import { Button } from "@/components/ui/button";
import { MapPin, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      navigate("/auth");
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="bg-primary rounded-lg p-2">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              RoamTogether
            </span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {!user && (
              <>
                <a href="#discover" className="text-muted-foreground hover:text-foreground transition-colors">
                  Discover Trips
                </a>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </a>
                <a href="#stories" className="text-muted-foreground hover:text-foreground transition-colors">
                  Stories
                </a>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline-flex text-sm text-muted-foreground">
                  {user.email}
                </span>
                <Button variant="ghost" onClick={handleAuthClick} className="gap-2">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" className="hidden sm:inline-flex" onClick={() => navigate("/auth")}>
                  Log In
                </Button>
                <Button variant="default" onClick={() => navigate("/auth")}>
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
