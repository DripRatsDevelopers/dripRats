"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApiRequest } from "@/lib/apiClient";
import { ShipmentTrackingData } from "@/types/Order";
import { Check, Copy, Loader2 } from "lucide-react";
import { useState } from "react";

export function ShipmentTrackingModal({ shipmentId }: { shipmentId: string }) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { data, loading } = useApiRequest({
    url: `/api/order/track-order?shipment_id=${shipmentId}`,
    skip: !shipmentId,
  });
  const trackingData: ShipmentTrackingData | null = data;

  const handleCopy = () => {
    if (trackingData?.awb_code) {
      navigator.clipboard.writeText(trackingData.awb_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">View Detailed Shipment Status</Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Shipment Tracking</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="animate-spin h-5 w-5 text-muted-foreground" />
          </div>
        ) : trackingData ? (
          <div className="space-y-3">
            {trackingData.awb_code ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Tracking ID</p>
                  <p className="font-medium">{trackingData.awb_code}</p>
                </div>

                <Button variant="ghost" size="icon" onClick={handleCopy}>
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ) : null}

            {trackingData.courier_name ? (
              <div>
                <p className="text-sm text-muted-foreground">Courier</p>
                <p className="font-medium">{trackingData.courier_name}</p>
              </div>
            ) : null}

            {trackingData?.tracking_data &&
            trackingData?.tracking_data?.shipment_track_activities?.length >
              0 ? (
              <div className="border-l-2 border-muted pl-4 space-y-3 mt-4 max-h-72 overflow-y-auto">
                {trackingData.tracking_data.shipment_track_activities.map(
                  (activity, index: number) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-3 top-1.5 w-2 h-2 rounded-full bg-green-500" />
                      {activity.activity ? (
                        <p className="text-sm font-medium">
                          {activity.activity}
                        </p>
                      ) : null}
                      {activity.location ? (
                        <p className="text-xs text-muted-foreground">
                          {activity.location}
                        </p>
                      ) : null}
                      {activity.date ? (
                        <p className="text-xs text-muted-foreground">
                          {activity.date}
                        </p>
                      ) : null}
                    </div>
                  )
                )}
              </div>
            ) : (
              <p className="text-muted-foreground text-sm italic">
                Tracking info will appear once the courier picks it up.
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic">
            Failed to load tracking info.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
