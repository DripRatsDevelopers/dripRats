"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/lib/mediaUtils";
import { Trash2 } from "lucide-react";

interface DeleteAddressDialogProps {
  onConfirm: () => void;
}

export function DeleteAddressDialog({ onConfirm }: DeleteAddressDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {!isMobile ? (
          <Button size="icon" variant="ghost" className="hidden md:flex">
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        ) : (
          <Button variant="outline" className="md:hidden flex">
            <Trash2 className="w-4 h-4 text-red-500" />
            Delete
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This address will be permanently deleted and cannot be recovered.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-500 hover:bg-red-600"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
