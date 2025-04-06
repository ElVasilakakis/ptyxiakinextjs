import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"

export function SearchLands({ ...props }: React.ComponentProps<"form">) {
  return (
    <form {...props} className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
        <Label htmlFor="search" className="sr-only">
        Search
        </Label>
        <SidebarInput
        id="search"
        placeholder="Search lands..."
        className="pl-8 py-[18px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
  

    </form>
  )
}
