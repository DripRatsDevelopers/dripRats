"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import AuthForm from "./AuthForm";

interface AuthFormModalProps {
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (isOpen: boolean) => void;
  handleAuthSuccess: () => void;
}

export default function AuthFormModal({
  isAuthModalOpen,
  setIsAuthModalOpen,
  handleAuthSuccess,
}: AuthFormModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
  };

  if (!isAuthModalOpen) {
    return null;
  }

  return (
    <>
      <Dialog open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <DialogContent
          className="sm:max-w-[500px]"
          // onInteractOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">
              {isSignUp ? "Create an Account To Proceed" : "Sign In To Proceed"}
            </DialogTitle>
          </DialogHeader>
          <AuthForm
            isSignUp={isSignUp}
            isModal={true}
            onAuthSuccess={handleAuthSuccess}
            onToggleMode={handleToggleMode}
          />
        </DialogContent>
      </Dialog>
      {isAuthModalOpen && <div className="fixed inset-0 bg-black/50 z-40" />}
    </>
  );
}
