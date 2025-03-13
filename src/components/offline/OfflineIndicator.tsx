import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { isOnline, getOfflineOperations } from "@/lib/offlineStorage";
import OfflineManager from "./OfflineManager";

const OfflineIndicator: React.FC = () => {
  const [online, setOnline] = useState(isOnline());
  const [pendingOperations, setPendingOperations] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOnlineStatusChange = () => {
      setOnline(navigator.onLine);
      updatePendingOperations();
    };

    window.addEventListener("online", handleOnlineStatusChange);
    window.addEventListener("offline", handleOnlineStatusChange);

    // Check for pending operations periodically
    const interval = setInterval(updatePendingOperations, 30000);

    // Initial check
    updatePendingOperations();

    return () => {
      window.removeEventListener("online", handleOnlineStatusChange);
      window.removeEventListener("offline", handleOnlineStatusChange);
      clearInterval(interval);
    };
  }, []);

  const updatePendingOperations = () => {
    const operations = getOfflineOperations();
    setPendingOperations(operations.filter((op) => !op.synced).length);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => setOpen(true)}
              >
                {online ? (
                  <Wifi className="h-5 w-5 text-green-600" />
                ) : (
                  <WifiOff className="h-5 w-5 text-red-600" />
                )}
                {pendingOperations > 0 && (
                  <Badge
                    variant="secondary"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-blue-100 text-blue-700"
                  >
                    {pendingOperations}
                  </Badge>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>
                {online
                  ? pendingOperations > 0
                    ? `Online - ${pendingOperations} pending operations`
                    : "Online - All data synced"
                  : "Offline Mode - Changes will sync when online"}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <OfflineManager onClose={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default OfflineIndicator;
