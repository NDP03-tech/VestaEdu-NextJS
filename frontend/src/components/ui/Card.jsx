import React from "react";

export const Card = ({ children, className = "", hover = false, ...props }) => {
  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${
        hover ? "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-5 border-b border-slate-100 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-5 ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-5 border-t border-slate-100 bg-slate-50/50 ${className}`} {...props}>
      {children}
    </div>
  );
};

