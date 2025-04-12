import {
  ClipboardListIcon,
  Cpu,
  DatabaseIcon,
  FileIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  MapPinHouse,
  SearchIcon,
  SettingsIcon,
  Thermometer,
} from "lucide-react"
const sidebarData = {
    navMain: [
      {
        title: "Dashboard",
        url: "/app/dashboard",
        icon: LayoutDashboardIcon,
      },
      {
        title: "Lands",
        url: "/app/lands",
        icon: MapPinHouse,
      },
      {
        title: "Devices",
        url: "/app/devices",
        icon: Cpu,
      },
      {
        title: "Sensors",
        url: "/app/sensors",
        icon: Thermometer,
      },
    ],
  
    navSecondary: [
      {
        title: "Settings",
        url: "#",
        icon: SettingsIcon,
      },
      {
        title: "Get Help",
        url: "#",
        icon: HelpCircleIcon,
      },
      {
        title: "Search",
        url: "#",
        icon: SearchIcon,
      },
    ],
    documents: [
      {
        name: "Data Library",
        url: "#",
        icon: DatabaseIcon,
      },
      {
        name: "Reports",
        url: "#",
        icon: ClipboardListIcon,
      },
      {
        name: "Word Assistant",
        url: "#",
        icon: FileIcon,
      },
    ],
}

export default sidebarData;