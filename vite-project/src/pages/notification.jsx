import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageCircle, Calendar, AlertCircle, ArrowLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Notification type → icon mapping
const iconMap = {
  info: MessageCircle,
  trip: Calendar,
  alert: AlertCircle,
};

// Icon color logic
const getIconColor = (type) => {
  switch (type) {
    case "info":
      return "text-primary";
    case "trip":
      return "text-green-600";
    case "alert":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
};

// Empty card for no messages
const EmptyCard = ({ text }) => (
  <Card className="bg-white border border-gray-200">
    <CardContent className="flex flex-col items-center justify-center py-12">
      <Bell className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-muted-foreground">{text}</p>
    </CardContent>
  </Card>
);

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const navigate = useNavigate(); // <-- Added for Back navigation

  const token = localStorage.getItem("token");
  

  const fetchNotifications = async () => {
    try {
      if (!token) return console.error("No token found");

      const response = await axios.get(
        "http://localhost:5000/api/traveler/notification/notify",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(response.data.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Marks a notification as read and updates state instantly
  const fetchAndMarkNotification = async (id) => {
    try {
      if (!token) return console.error("No token found");

      // Optimistic update
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );

      const response = await axios.get(
        `http://localhost:5000/api/traveler/notification/notify/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSelectedNotification(response.data.data);

      await axios.put(
        `http://localhost:5000/api/traveler/notification/mark/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error("Error fetching notification:", err);
    }
  };
console.log("TRAVELER TOKEN:", token);
  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <p>Loading notifications...</p>;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Single notification view
  if (selectedNotification) {
    const Icon = iconMap[selectedNotification.type] || Bell;
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          className="mb-4 flex items-center gap-2"
          onClick={() => setSelectedNotification(null)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <Card className="bg-white">
          <CardHeader className="pb-3 flex items-start gap-3">
            <div className={`p-2 rounded-full bg-muted ${getIconColor(selectedNotification.type)}`}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-base flex items-center gap-2">
                {selectedNotification.type.toUpperCase()}
              </CardTitle>
              <CardDescription>{selectedNotification.message}</CardDescription>
              <p className="text-xs text-muted-foreground">
                {new Date(selectedNotification.createdAt).toLocaleString()}
              </p>
            </div>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
    

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Notifications
          </h1>
          <div className="text-muted-foreground text-lg">
            Stay updated with your travel plans
            {unreadCount > 0 && (
              <Badge className="ml-2" variant="default">
                {unreadCount} new
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
        </TabsList>

        {/* All Notifications */}
        <TabsContent value="all" className="space-y-3 mt-6">
          {notifications.length === 0 ? (
            <EmptyCard text="No notifications available" />
          ) : (
            notifications.map((n) => {
              const Icon = iconMap[n.type] || Bell;
              return (
                <Card
                  key={n._id}
                  onClick={() => fetchAndMarkNotification(n._id)}
                  className={`cursor-pointer transition-colors ${
                    !n.isRead ? "bg-primary/5 border-primary/20" : ""
                  }`}
                >
                  <CardHeader className="pb-3 flex items-start gap-3">
                    <div className={`p-2 rounded-full bg-muted ${getIconColor(n.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {n.type.toUpperCase()}
                        {!n.isRead && <span className="w-2 h-2 bg-primary rounded-full"></span>}
                      </CardTitle>
                      <CardDescription>{n.message}</CardDescription>
                      <p className="text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </CardHeader>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Unread Notifications */}
        <TabsContent value="unread" className="space-y-3 mt-6">
          {notifications.filter((n) => !n.isRead).length === 0 ? (
            <EmptyCard text="No unread notifications" />
          ) : (
            notifications
              .filter((n) => !n.isRead)
              .map((n) => {
                const Icon = iconMap[n.type] || Bell;
                return (
                  <Card
                    key={n._id}
                    onClick={() => fetchAndMarkNotification(n._id)}
                    className="cursor-pointer bg-primary/5 border-primary/20"
                  >
                    <CardHeader className="pb-3 flex items-start gap-3">
                      <div className={`p-2 rounded-full bg-muted ${getIconColor(n.type)}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-base flex items-center gap-2">
                          {n.type.toUpperCase()}
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                        </CardTitle>
                        <CardDescription>{n.message}</CardDescription>
                        <p className="text-xs text-muted-foreground">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </CardHeader>
                  </Card>
                );
              })
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}




