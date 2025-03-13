import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  BarChart3,
  Boxes,
  ClipboardCheck,
  FileText,
  Home,
  LogOut,
  Package,
  Settings,
  Truck,
  User,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

interface SidebarProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

const Sidebar = ({
  userName = "John Doe",
  userRole = "Warehouse Manager",
  userAvatar = "",
  collapsed = false,
  onToggleCollapse = () => {},
  isMobileOpen = false,
  onMobileClose = () => {},
}: SidebarProps) => {
  const { t } = useI18n();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const navItems = [
    { icon: <Home size={20} />, label: t("sidebar.dashboard"), path: "/" },
    {
      icon: <Boxes size={20} />,
      label: t("sidebar.inventory"),
      path: "/inventory",
    },
    {
      icon: <Package size={20} />,
      label: t("sidebar.spaceAllocation"),
      path: "/space-allocation",
    },
    {
      icon: <ClipboardCheck size={20} />,
      label: t("sidebar.qualityControl"),
      path: "/quality",
    },
    {
      icon: <FileText size={20} />,
      label: t("sidebar.reports"),
      path: "/reports",
    },
    {
      icon: <Truck size={20} />,
      label: t("sidebar.logistics"),
      path: "/logistics",
    },
    {
      icon: <BarChart3 size={20} />,
      label: t("sidebar.analytics"),
      path: "/analytics",
    },
  ];

  // For mobile, we want to render a fixed position sidebar that can be toggled
  if (isMobile) {
    return (
      <div
        className={`fixed inset-0 z-50 transform ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-200 ease-in-out md:hidden`}
      >
        <div
          className="absolute inset-0 bg-black/50"
          onClick={onMobileClose}
        ></div>
        <div className="absolute top-0 left-0 bottom-0 w-[280px] bg-background shadow-xl flex flex-col">
          {/* Header with close button */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
                <Boxes className="text-primary-foreground" size={20} />
              </div>
              <h1 className="text-xl font-bold">{t("sidebar.appName")}</h1>
            </div>
            <Button variant="ghost" size="icon" onClick={onMobileClose}>
              <X size={20} />
            </Button>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
                }
                onClick={onMobileClose}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <Separator />

          {/* Settings */}
          <div className="p-4">
            <NavLink
              to="/settings"
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
              }
              onClick={onMobileClose}
            >
              <Settings size={20} />
              <span>{t("sidebar.settings")}</span>
            </NavLink>
          </div>

          {/* User Profile */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-3 p-2">
              <Avatar>
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>
                  {userName.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="font-medium truncate">{userName}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {userRole === "Warehouse Manager"
                    ? t("role.warehouseManager")
                    : userRole}
                </p>
              </div>
              <Button variant="ghost" size="icon">
                <LogOut size={18} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={`h-full ${collapsed ? "w-[70px]" : "w-[280px]"} bg-background border-r flex flex-col transition-all duration-200 hidden md:flex`}
    >
      {/* Logo and Header */}
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-primary h-8 w-8 rounded-md flex items-center justify-center">
            <Boxes className="text-primary-foreground" size={20} />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold">{t("sidebar.appName")}</h1>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className={collapsed ? "" : ""}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
            }
          >
            {collapsed ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex justify-center w-full">
                      {item.icon}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              <>
                {item.icon}
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <Separator />

      {/* Settings */}
      <div className="p-4">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary" : "hover:bg-muted"}`
          }
        >
          {collapsed ? (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex justify-center w-full">
                    <Settings size={20} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{t("sidebar.settings")}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <>
              <Settings size={20} />
              <span>{t("sidebar.settings")}</span>
            </>
          )}
        </NavLink>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3 p-2">
          <Avatar>
            <AvatarImage src={userAvatar} alt={userName} />
            <AvatarFallback>
              {userName.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="font-medium truncate">{userName}</p>
              <p className="text-sm text-muted-foreground truncate">
                {userRole === "Warehouse Manager"
                  ? t("role.warehouseManager")
                  : userRole}
              </p>
            </div>
          )}
          {!collapsed && (
            <Button variant="ghost" size="icon">
              <LogOut size={18} />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
