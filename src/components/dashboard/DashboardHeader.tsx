import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Bell, Search, Settings, User, Menu, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useI18n } from "@/lib/i18n";
import { LanguageToggle } from "../ui/language-toggle";
import OfflineIndicator from "../offline/OfflineIndicator";

interface DashboardHeaderProps {
  userName?: string;
  userRole?: string;
  notificationCount?: number;
  userAvatar?: string;
  onToggleSidebar?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  userName = "John Doe",
  userRole = "Warehouse Manager",
  notificationCount = 3,
  userAvatar = "https://api.dicebear.com/7.x/avataaars/svg?seed=warehouse",
  onToggleSidebar,
}) => {
  const { language, t } = useI18n();
  const [currentDate, setCurrentDate] = useState(
    format(new Date(), "EEEE, MMMM do yyyy", {
      locale: language === "es" ? es : undefined,
    }),
  );
  const [currentTime, setCurrentTime] = useState(format(new Date(), "h:mm a"));
  const [isMobile, setIsMobile] = useState(false);

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(format(new Date(), "h:mm a"));
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Update date when language changes
  useEffect(() => {
    setCurrentDate(
      format(new Date(), "EEEE, MMMM do yyyy", {
        locale: language === "es" ? es : undefined,
      }),
    );
  }, [language]);

  // Check if mobile view
  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 h-20 px-4 md:px-6 flex items-center justify-between w-full shadow-md sticky top-0 z-10 bg-gradient-to-r from-white to-blue-50">
      <div className="flex items-center space-x-4">
        {onToggleSidebar && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h2 className="text-base md:text-lg font-semibold text-gray-800">
            {currentDate}
          </h2>
          <p className="text-xs md:text-sm text-gray-500">{currentTime}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-6">
        {/* Search - Hide on mobile */}
        <div className="relative hidden md:block w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("action.search")}
            className="pl-8 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>

        {/* Offline Indicator */}
        <OfflineIndicator />

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {notificationCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-[calc(100vw-2rem)] md:w-80"
          >
            <div className="p-2 flex justify-between items-center">
              <h3 className="font-medium">{t("notifications.title")}</h3>
              <Badge variant="secondary">
                {notificationCount} {t("notifications.new")}
              </Badge>
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-[60vh] md:max-h-80 overflow-y-auto">
              <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50">
                <div className="flex gap-3 items-start w-full">
                  <div className="bg-red-100 p-2 rounded-full flex-shrink-0">
                    <Bell className="h-4 w-4 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {t("notifications.temperatureAlert")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("notifications.temperatureDesc")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      10 {t("notifications.timeAgo.minutes")}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50">
                <div className="flex gap-3 items-start w-full">
                  <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">{t("notifications.newOrder")}</p>
                    <p className="text-sm text-gray-500">
                      {t("notifications.newOrderDesc")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      25 {t("notifications.timeAgo.minutes")}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-3 cursor-pointer hover:bg-gray-50">
                <div className="flex gap-3 items-start w-full">
                  <div className="bg-amber-100 p-2 rounded-full flex-shrink-0">
                    <Bell className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {t("notifications.expiringProducts")}
                    </p>
                    <p className="text-sm text-gray-500">
                      {t("notifications.expiringProductsDesc")}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      1 {t("notifications.timeAgo.hour")}
                    </p>
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-2 text-center cursor-pointer">
              <p className="text-sm text-blue-600 w-full">
                {t("notifications.viewAll")}
              </p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Language Toggle */}
        <LanguageToggle />

        {/* Settings */}
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <Settings className="h-5 w-5 text-gray-600" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-3 cursor-pointer">
              <Avatar>
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500">
                  {userRole === "Warehouse Manager"
                    ? t("role.warehouseManager")
                    : userRole}
                </p>
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex items-center gap-2 p-2 md:hidden">
              <Avatar className="h-8 w-8">
                <AvatarImage src={userAvatar} alt={userName} />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{userName}</p>
                <p className="text-xs text-muted-foreground">
                  {userRole === "Warehouse Manager"
                    ? t("role.warehouseManager")
                    : userRole}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="md:hidden" />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>{t("action.profile")}</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>{t("action.settings")}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <span>{t("action.logout")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;
