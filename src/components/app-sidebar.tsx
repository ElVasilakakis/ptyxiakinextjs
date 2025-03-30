import * as React from "react"
import {
  AudioWaveform,
  Bot,
  Command,
  Cpu,
  GalleryVerticalEnd,
  MapIcon,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { SearchForm } from "./search-form"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"


const session = await getServerSession(authOptions);
// This is sample data.
const data = {
  user: {
    name:  `${session?.user?.username}`,
    email: `${session?.user?.email}`,
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  projects: [
    {
      name: "Lands",
      url: "#",
      icon: MapIcon,
    },
    {
      name: "Devices",
      url: "#",
      icon: Bot,
    },
    {
      name: "Sensors",
      url: "#",
      icon: Cpu,
    },
  ],
  navMain: [
    {
      title: "Lands",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Settings",
          url: "#",
        },
        {
          title: "Other",
          url: "#",
        },
      ],
    },
    {
      title: "Devices",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Settings",
          url: "#",
        },
        {
          title: "More",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Metrics",
          url: "#",
        }
      ],
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
        <SearchForm/>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
