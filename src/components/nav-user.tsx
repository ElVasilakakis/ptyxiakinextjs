"use client"

import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { signOut } from "next-auth/react"
import { useEffect, useState } from "react"

type SessionUser = {
  user: {
    name: string;
    email: string;
    image?: string;
  } | null;
};
export function NavUser() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const { isMobile } = useSidebar();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await fetch("/api/auth/session");
        if (!res.ok) throw new Error("Failed to fetch user info");
        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserInfo();
  }, []);

  if (!user) return null; // or some loading indicator

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user?.user?.image || "/default-avatar.png"} alt={user?.user?.name || "User"} />
                <AvatarFallback className="rounded-lg">US</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.user?.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user?.user?.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.user?.image || "/default-avatar.png"} alt={user?.user?.name || "User"} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.user?.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user?.user?.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer"
              onClick={() =>
                signOut({
                  redirect: true,
                  callbackUrl: `${window.location.origin}/auth/login`,
                })
              }>
              <LogOutIcon />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
