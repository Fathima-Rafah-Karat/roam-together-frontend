import React, {
  useState,
  useContext,
  createContext,
  useMemo,
  useCallback,
  forwardRef,
  useEffect,
} from "react";
import { FaBars } from "react-icons/fa";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import {
  Tooltip,
  TooltipProvider,
  TooltipContent,
  TooltipTrigger,
} from "./tooltip";
import { useLocation } from "react-router-dom";

/* =======================
   CONTEXT
======================= */
const SidebarContext = createContext(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context)
    throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

/* =======================
   PROVIDER
======================= */
export const SidebarProvider = forwardRef(
  ({ defaultOpen = true, children, ...props }, ref) => {
    const [open, setOpen] = useState(defaultOpen); // desktop
    const [openMobile, setOpenMobile] = useState(false); // mobile
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const location = useLocation();

    /* 🔧 FIX 1: Watch screen resize */
    useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }, []);

    /* 🔧 FIX 2: Close mobile sidebar on route change */
    useEffect(() => {
      setOpenMobile(false);
    }, [location.pathname]);

    const toggleSidebar = useCallback(() => {
      if (isMobile) {
        setOpenMobile((prev) => !prev);
      } else {
        setOpen((prev) => !prev);
      }
    }, [isMobile]);

    const closeMobile = useCallback(() => {
      setOpenMobile(false);
    }, []);

    const value = useMemo(
      () => ({
        open,
        openMobile,
        toggleSidebar,
        closeMobile,
        isMobile,
      }),
      [open, openMobile, toggleSidebar, isMobile]
    );

    return (
      <SidebarContext.Provider value={value}>
        <TooltipProvider>
          <div ref={ref} {...props}>{children}</div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);

/* =======================
   SIDEBAR
======================= */
export const Sidebar = forwardRef(({ children, className = "" }, ref) => {
  const { open, openMobile, isMobile } = useSidebar();

  return (
    <aside
      ref={ref}
      className={`
        fixed md:static z-40
        h-screen
        bg-gray-800 text-white
        transition-all duration-300
        ${
          isMobile
            ? `w-64 ${
                openMobile ? "translate-x-0" : "-translate-x-full"
              }`
            : open
            ? "w-64"
            : "w-16"
        }
        ${className}
      `}
    >
      {children}
    </aside>
  );
});

/* =======================
   MOBILE OVERLAY
======================= */
export const SidebarOverlay = () => {
  const { openMobile, closeMobile } = useSidebar();
  if (!openMobile) return null;

  return (
    <div
      onClick={closeMobile}
      className="fixed inset-0 bg-black/50 z-30 md:hidden"
    />
  );
};

/* =======================
   TRIGGER
======================= */
export const SidebarTrigger = forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button ref={ref} onClick={toggleSidebar} className={className} {...props}>
      <FaBars />
    </Button>
  );
});

/* =======================
   UI HELPERS
======================= */
export const SidebarHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`p-2 ${className}`} {...props}>
    {children}
  </div>
));

export const SidebarFooter = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`p-2 mt-auto ${className}`} {...props}>
    {children}
  </div>
));

export const SidebarContent = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex-1 overflow-auto flex flex-col ${className}`}
    {...props}
  >
    {children}
  </div>
));

export const SidebarGroup = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col gap-2 p-2 ${className}`} {...props}>
    {children}
  </div>
));

export const SidebarGroupLabel = forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={`text-xs font-medium text-gray-400 px-2 ${className}`}
    {...props}
  >
    {children}
  </div>
));

export const SidebarGroupContent = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`pl-2 flex flex-col gap-1 ${className}`} {...props}>
    {children}
  </div>
));

export const SidebarMenu = forwardRef(({ children, className, ...props }, ref) => (
  <ul ref={ref} className={`flex flex-col gap-1 ${className}`} {...props}>
    {children}
  </ul>
));

export const SidebarMenuItem = forwardRef(({ children, className, ...props }, ref) => (
  <li ref={ref} className={`relative ${className}`} {...props}>
    {children}
  </li>
));

/* 🔧 FIX 3: Close sidebar when clicking menu on mobile */
export const SidebarMenuButton = forwardRef(
  ({ children, tooltip, className, onClick, ...props }, ref) => {
    const { isMobile, closeMobile } = useSidebar();

    const handleClick = (e) => {
      onClick?.(e);
      if (isMobile) closeMobile();
    };

    const button = (
      <button
        ref={ref}
        onClick={handleClick}
        className={`flex items-center gap-2 p-2 w-full text-left rounded ${className}`}
        {...props}
      >
        {children}
      </button>
    );

    if (!tooltip) return button;

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent side="right">{tooltip}</TooltipContent>
      </Tooltip>
    );
  }
);

export const SidebarInput = forwardRef((props, ref) => <Input ref={ref} {...props} />);
export const SidebarSeparator = forwardRef((props, ref) => <Separator ref={ref} {...props} />);
