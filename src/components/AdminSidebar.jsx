import { useNavigate } from "react-router-dom";
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

import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  FilePlus,
  LogOut,
  Settings,
  MapPin
} from "lucide-react";

import toast, { Toaster } from "react-hot-toast";

// Define admin menu
const adminMenu = [
  { title: "Dashboard", url: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Manage Users", url: "/admin/Manageuser", icon: Users },
  { title: "Verify Organizers", url: "/admin/Verifyorganizers", icon: ClipboardCheck },
 { title: "Manage Trips", url: "/admin/Trips", icon: MapPin },
//   { title: "Settings", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2">
          <div>Are you sure you want to logout?</div>
          <div className="flex justify-end gap-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-2 justify-center">
            <div className="bg-primary rounded-lg p-2 flex-shrink-0">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            {open && (
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                RoamTogether
              </span>
            )}
          </div>

          {/* Navigation Menu */}
          <SidebarGroup>
            <SidebarGroupLabel className={`${open ? "text-gray-500" : "sr-only"} text-center`}>
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminMenu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton>
                      <NavLink
                        to={item.url}
                        end={item.url === "/admin/dashboard"}
                        className={`hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 ${
                          open ? "px-3 py-2" : "p-2 justify-center"
                        } w-full text-gray-700`}
                        activeClassName="bg-gray-200 text-gray-900 font-medium border-l-2 border-gray-400"
                      >
                        <item.icon className={`${open ? "h-5 w-5" : "h-8 w-8"} text-gray-700`} />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}

                {/* Logout */}
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleLogout}
                    className={`flex items-center justify-center gap-3 w-full text-gray-700 hover:bg-gray-100 rounded ${
                      open ? "px-3 py-2 justify-start" : "p-2 justify-center"
                    }`}
                  >
                    <LogOut className={`${open ? "h-5 w-5" : "h-8 w-8"}`} />
                    {open && <span>Logout</span>}
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
