import { useNavigate } from "react-router-dom";
import {
  Compass,
  Map,
  BookOpen,
  FileText,
  Bell,
  Phone,
  MapPin,
  LogOut,
  X,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import toast, { Toaster } from "react-hot-toast";

const menuItems = [
  { title: "Discover Trips", url: "/dash/dashboard", icon: Compass },
  { title: "My Trips", url: "/dash/mytrip", icon: Map },
  { title: "Travel Diary", url: "/dash/diary", icon: BookOpen },
  { title: "Trip Blog", url: "/dash/tripblog", icon: FileText },
  { title: "Notifications", url: "/dash/notification", icon: Bell },
  { title: "Emergency Contacts", url: "/dash/emergency", icon: Phone },
];

export function AppSidebar() {
  const { open, toggleSidebar } = useSidebar(); // ✅ correct
  const navigate = useNavigate();

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <div>Are you sure you want to logout?</div>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded-lg"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded-lg"
              onClick={() => {
                localStorage.clear();
                toast.dismiss(t.id);
                navigate("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  };

  return (
    <>
      <Sidebar className="border-r border-gray-200 bg-white">
        <SidebarContent>
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary rounded-lg p-2">
                <MapPin className="h-5 w-5 text-primary-foreground" />
              </div>

              {open && (
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  RoamTogether
                </span>
              )}
            </div>


            {open && (
              <button
                onClick={toggleSidebar}
                className="p-1 rounded-md hover:bg-gray-100"
              >
                <X className="h-3 w-3 text-gray-600" />
              </button>
            )}
          </div>

          {/* Menu */}
          <SidebarGroup>
            <SidebarGroupLabel className={open ? "text-gray-500" : "sr-only"}>
              Navigation
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <NavLink
                        to={item.url}
                        end={item.url === "/dash/dashboard"}
                        className={`flex items-center gap-3 w-full text-gray-700 hover:bg-gray-100 ${open ? "px-3 py-2" : "p-2 justify-center"
                          }`}
                        activeClassName="bg-gray-200 font-medium"
                      >
                        <item.icon className={open ? "h-5 w-5" : "h-8 w-8"} />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* Logout */}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={handleLogout}
                      className={`flex w-full items-center gap-3 text-gray-700 hover:bg-gray-100 ${open ? "px-3 py-2 justify-start" : "p-2 justify-center"
                        }`}
                    >
                      <LogOut className={open ? "h-5 w-5" : "h-8 w-8"} />
                      {open && <span>Logout</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <Toaster position="top-center" />
    </>
  );
}
