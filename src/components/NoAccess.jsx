import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NoAccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 text-red-600">
        Access Denied
      </h1>

      <p className="text-lg text-muted-foreground mb-6">
        You do not have permission to create trips.
        <br />
        Only organizers can create trips.
      </p>

      <Button onClick={() => navigate("/")}>
        Go Back Home
      </Button>
    </div>
  );
};

export default NoAccess;
