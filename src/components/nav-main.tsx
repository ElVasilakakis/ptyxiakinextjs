"use client"

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter, usePathname } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-blue-950 text-white duration-200 ease-linear hover:bg-blue-900 hover:text-white active:bg-blue-250 active:text-white cursor-pointer"
            >
              <DropdownMenu>
                <DropdownMenuTrigger onClick={(e) => e.stopPropagation()} className="flex flex-row gap-2 items-center w-full cursor-pointer">
               
                  <PlusCircleIcon size={18} />
                  <span>Quick Add</span>
                
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Device</DropdownMenuItem>
                  <DropdownMenuItem>Sensor</DropdownMenuItem>
                  <DropdownMenuItem>Land</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </SidebarMenuButton>
            <Button
              size="icon"
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = pathname === item.url
            return(
              <SidebarMenuItem key={item.title}  >
                <SidebarMenuButton 
                  tooltip={item.title}
                  className={`cursor-pointer ${isActive ? "bg-zinc-950 text-white hover:bg-zinc-800 hover:text-white" : "text-gray-700 hover:bg-zinc-100"}`}
                  onClick={() => router.push(item.url)}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
