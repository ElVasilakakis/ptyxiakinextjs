"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();

  // Split the path into segments, filtering out empty values and the "app" segment.
  const pathSegments = pathname.split("/").filter(
    (segment) => segment && segment !== "app"
  );

  // Build breadcrumbs with cumulative paths.
  let cumulativePath = "";
  const breadcrumbs = pathSegments.map((segment) => {
    cumulativePath += `/${segment}`;
    // Capitalize the first letter of each segment for display purposes.
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { label, href: cumulativePath };
  });

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col py-4 px-7 gap-4">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
