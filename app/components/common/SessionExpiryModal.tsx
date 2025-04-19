"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCheckoutSession } from "@/hooks/useCheckoutSession";
import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
  isExpired: boolean;
  isSessionInvalid: boolean;
};

export const SessionExpiredModal = ({ isExpired, isSessionInvalid }: Props) => {
  const router = useRouter();
  const { clearCheckoutSession } = useCheckoutSession();
  useEffect(() => {
    if (isExpired || isSessionInvalid) {
      clearCheckoutSession();
      const timeout = setTimeout(() => {
        router.replace("/cart");
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [isExpired, isSessionInvalid, router]);

  return (
    <Dialog open={isExpired || isSessionInvalid}>
      <DialogContent className="text-center max-w-sm">
        <div className="flex justify-center">
          <AlertTriangle className="text-red-500" height={50} width={50} />
        </div>
        <DialogHeader>
          <DialogTitle className="text-red-500 text-center">
            {isExpired ? <>Session Expired</> : null}
            {isSessionInvalid ? <>Session Invalid</> : null}
          </DialogTitle>
        </DialogHeader>

        <p>
          {isSessionInvalid ? <>Session is Invalid.</> : null}
          {isExpired ? <>Your checkout session has expired.</> : null}
          Redirecting to cart…
        </p>
      </DialogContent>
    </Dialog>
  );
};
