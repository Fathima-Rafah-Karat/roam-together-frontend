import { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, MessageCircle, Calendar, AlertCircle } from "lucide-react";
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

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/traveler/notification/notify",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data.data || []);
    } catch (err) {
      console.error("Error loading notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mark a notification as read
  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await axios.patch(
        `http://localhost:5000/api/traveler/notification/read/${id}`,
        { isRead: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchNotifications(); // refresh UI
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading) return <p>Loading notifications...</p>;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Notifications
          </h1>

          <p className="text-muted-foreground text-lg">
            Stay updated with your travel plans
            {unreadCount > 0 && (
              <Badge className="ml-2" variant="default">
                {unreadCount} new
              </Badge>
            )}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        {/* ALL Notifications */}
        <TabsContent value="all" className="space-y-3 mt-6">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || Bell;

            return (
              <Card
                key={n._id}
                onClick={() => markAsRead(n._id)}
                className={`cursor-pointer transition-colors ${
                  !n.isRead ? "bg-primary/5 border-primary/20" : ""
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    {/* ICON */}
                    <div className={`p-2 rounded-full bg-muted ${getIconColor(n.type)}`}>
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* TEXT */}
                    <div className="space-y-1">
                      <CardTitle className="text-base flex items-center gap-2">
                        {n.type.toUpperCase()}
                        {!n.isRead && (
                          <span className="w-2 h-2 bg-primary rounded-full"></span>
                        )}
                      </CardTitle>

                      <CardDescription>{n.message}</CardDescription>

                      <p className="text-xs text-muted-foreground">
                        {new Date(n.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </TabsContent>

        {/* UNREAD Notifications */}
        <TabsContent value="unread" className="space-y-3 mt-6">
          {notifications
            .filter((n) => !n.isRead)
            .map((n) => {
              const Icon = iconMap[n.type] || Bell;

              return (
                <Card
                  key={n._id}
                  onClick={() => markAsRead(n._id)}
                  className="cursor-pointer bg-primary/5 border-primary/20"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-full bg-muted ${getIconColor(n.type)}`}
                      >
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
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
        </TabsContent>

        {/* Archived */}
        <TabsContent value="archived" className="mt-6">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No archived notifications</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
