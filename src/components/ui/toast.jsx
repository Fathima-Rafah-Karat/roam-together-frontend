// import React, { useState, useEffect, forwardRef } from "react";
// import { X } from "lucide-react";
// import clsx from "@/lib/utils"; // your cn/clsx utility

// const ToastProvider = ({ children }) => <>{children}</>; // placeholder for context if needed

// const ToastViewport = forwardRef(({ className, children, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={clsx(
//       "fixed top-0 right-0 z-[100] flex flex-col p-4 space-y-2 max-w-sm",
//       className
//     )}
//     {...props}
//   >
//     {children}
//   </div>
// ));
// ToastViewport.displayName = "ToastViewport";

// const Toast = forwardRef(({ className, variant = "default", children, onClose, ...props }, ref) => (
//   <div
//     ref={ref}
//     className={clsx(
//       "group relative flex items-center justify-between p-4 rounded-md shadow-lg border",
//       variant === "destructive" ? "bg-red-600 text-white border-red-700" : "bg-white text-black border-gray-200",
//       className
//     )}
//     {...props}
//   >
//     {children}
//     {onClose && (
//       <button
//         onClick={onClose}
//         className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-900"
//       >
//         <X className="w-4 h-4" />
//       </button>
//     )}
//   </div>
// ));
// Toast.displayName = "Toast";

// const ToastClose = ({ className, onClick, ...props }) => (
//   <button
//     onClick={onClick}
//     className={clsx(
//       "absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-900",
//       className
//     )}
//     {...props}
//   >
//     <X className="w-4 h-4" />
//   </button>
// );

// const ToastTitle = forwardRef(({ className, children, ...props }, ref) => (
//   <div ref={ref} className={clsx("font-semibold text-sm", className)} {...props}>
//     {children}
//   </div>
// ));
// ToastTitle.displayName = "ToastTitle";

// const ToastDescription = forwardRef(({ className, children, ...props }, ref) => (
//   <div ref={ref} className={clsx("text-sm text-gray-600", className)} {...props}>
//     {children}
//   </div>
// ));
// ToastDescription.displayName = "ToastDescription";

// export {
//   ToastProvider,
//   ToastViewport,
//   Toast,
//   ToastTitle,
//   ToastDescription,
//   ToastClose
// };
import React, { useState, useEffect, forwardRef } from "react";
import { X } from "lucide-react";
import clsx from "@/lib/utils"; // your cn/clsx utility

// ToastProvider is a placeholder for context if needed
const ToastProvider = ({ children }) => <>{children}</>;

// ToastViewport: container for all toasts
const ToastViewport = forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={clsx(
      "fixed top-0 right-0 z-[100] flex flex-col p-4 space-y-2 max-w-sm",
      className
    )}
    {...props} // safe to spread
  >
    {children}
  </div>
));
ToastViewport.displayName = "ToastViewport";

// Toast component
const Toast = forwardRef(({ className, variant = "default", children, onClose, ...props }, ref) => {
  // Remove unsupported props to avoid warnings
  const { onOpenChange, ...safeProps } = props;

  return (
    <div
      ref={ref}
      className={clsx(
        "group relative flex items-center justify-between p-4 rounded-md shadow-lg border",
        variant === "destructive"
          ? "bg-red-600 text-white border-red-700"
          : "bg-white text-black border-gray-200",
        className
      )}
      {...safeProps} // only safe props are passed to div
    >
      {children}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-900"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
});
Toast.displayName = "Toast";

// ToastClose button (optional)
const ToastClose = ({ className, onClick, ...props }) => (
  <button
    onClick={onClick}
    className={clsx(
      "absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-900",
      className
    )}
    {...props}
  >
    <X className="w-4 h-4" />
  </button>
);

// ToastTitle
const ToastTitle = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={clsx("font-semibold text-sm", className)} {...props}>
    {children}
  </div>
));
ToastTitle.displayName = "ToastTitle";

// ToastDescription
const ToastDescription = forwardRef(({ className, children, ...props }, ref) => (
  <div ref={ref} className={clsx("text-sm text-gray-600", className)} {...props}>
    {children}
  </div>
));
ToastDescription.displayName = "ToastDescription";

export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose
};
