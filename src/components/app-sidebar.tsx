import * as React from "react"
import { Cable, Cpu, GalleryVerticalEnd, MapPin, Minus, Plus, Thermometer } from "lucide-react"
import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SearchForm } from "./search-form"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"


const session = await getServerSession(authOptions);
// This is sample data.
const data = {
  navMain: [
    {
      title: "Lands",
      url: "#",
      icon: MapPin,
      items: [
        {
          title: "All",
          url: "#",
        },
        {
          title: "Create",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      title: "Devices",
      url: "#",
      icon: Cpu,
      items: [
        {
          title: "All",
          url: "#",
          isActive: true,
        },
        {
          title: "Create",
          url: "#",
        },
        {
          title: "Connect",
          url: "#",
        },
      ],
    },
    {
      title: "Sensors",
      url: "#",
      icon: Thermometer,
      items: [
        {
          title: "All",
          url: "#",
          isActive: true,
        },
        {
          title: "Create",
          url: "#",
        },
        {
          title: "Connect",
          url: "#",
        },
        {
          title: "Metrics",
          url: "#",
        }
      ],
    },
  ],
};


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Iot.io</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
          {data.navMain.map((item, index) => (
            <Collapsible key={item.title} defaultOpen={index === 1} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton>
                    {item.icon && <item.icon className="mr-2" />} {/* Render the icon */}
                    {item.title}{" "}
                    <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                    <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                {item.items?.length ? (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild isActive={subItem.isActive}>
                            <a href={subItem.url}>{subItem.title}</a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                ) : null}
              </SidebarMenuItem>
            </Collapsible>
          ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
