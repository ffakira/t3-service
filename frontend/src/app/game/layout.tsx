import React from "react";
import SideNavbar from "@/components/SideNavbar/SideNavbar";

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <div>
      <SideNavbar />
      {children}
    </div>
  );
}
