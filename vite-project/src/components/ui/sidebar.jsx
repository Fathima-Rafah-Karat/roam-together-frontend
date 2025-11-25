import React, { useState, useContext, createContext, useMemo, useCallback, forwardRef } from "react";
import { FaBars } from "react-icons/fa";
import { Button } from "./button";
import { Input } from "./input";
import { Separator } from "./separator";
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from "./tooltip";

const SidebarContext = createContext(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

export const SidebarProvider = forwardRef(({ defaultOpen = true, children, ...props }, ref) => {
  const [open, setOpen] = useState(defaultOpen);
  const [openMobile, setOpenMobile] = useState(false);

  const toggleSidebar = useCallback(() => {
    if (window.innerWidth < 768) setOpenMobile(!openMobile);
    else setOpen(!open);
  }, [open, openMobile]);

  const contextValue = useMemo(
    () => ({ open, setOpen, openMobile, setOpenMobile, toggleSidebar }),
    [open, openMobile, toggleSidebar]
  );

  return (
    
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider>
        <div ref={ref} {...props}>{children}</div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
});

export const Sidebar = forwardRef(({ children, className = "" }, ref) => {
  const { open } = useSidebar();

  return (
    
    <div
      ref={ref}
      className={`flex flex-col bg-gray-800 text-white transition-all duration-300 ${open ? "w-64" : "w-16"} ${className}`}
    >
      {children}
    </div>
  );
});

export const SidebarTrigger = forwardRef(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();
  return (
    <Button ref={ref} className={className} onClick={toggleSidebar} {...props}>
      <FaBars />
    </Button>
  );
});

export const SidebarHeader = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`p-2 ${className}`} {...props}>{children}</div>
));

export const SidebarFooter = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`p-2 mt-auto ${className}`} {...props}>{children}</div>
));

export const SidebarContent = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`flex-1 overflow-auto flex flex-col ${className}`} {...props}>{children}</div>
));

export const SidebarGroup = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`flex flex-col gap-2 p-2 ${className}`} {...props}>{children}</div>
));

export const SidebarGroupLabel = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`text-xs font-medium text-gray-400 px-2 ${className}`} {...props}>{children}</div>
));

/** NEW COMPONENT */
export const SidebarGroupContent = forwardRef(({ children, className, ...props }, ref) => (
  <div ref={ref} className={`pl-2 flex flex-col gap-1 ${className}`} {...props}>
    {children}
  </div>
));

export const SidebarMenu = forwardRef(({ children, className, ...props }, ref) => (
  <ul ref={ref} className={`flex flex-col gap-1 ${className}`} {...props}>{children}</ul>
));

export const SidebarMenuItem = forwardRef(({ children, className, ...props }, ref) => (
  <li ref={ref} className={`relative ${className}`} {...props}>{children}</li>
));

export const SidebarMenuButton = forwardRef(({ children, tooltip, className, ...props }, ref) => {
  const button = (
    <button
      ref={ref}
      className={`flex items-center gap-2 p-2 w-full text-left rounded  ${className}`}
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
});

export const SidebarInput = forwardRef((props, ref) => <Input ref={ref} {...props} />);
export const SidebarSeparator = forwardRef((props, ref) => <Separator ref={ref} {...props} />);
