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
import { Dispatch, SetStateAction } from "react";

interface DeleteAddressDialogProps {
  onConfirm: () => void;
  openDeleteModal: boolean;
  setOpenDeleteModal: Dispatch<SetStateAction<boolean>>;
  isAddressUpdating: boolean;
}

export function DeleteAddressDialog({
  onConfirm,
  openDeleteModal,
  setOpenDeleteModal,
  isAddressUpdating,
}: DeleteAddressDialogProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <AlertDialog open={openDeleteModal} onOpenChange={setOpenDeleteModal}>
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
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            {isAddressUpdating ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
