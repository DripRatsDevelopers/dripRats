// app/profile/page.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { MAX_SAVED_ADDRESS } from "@/constants/DeliveryConstants";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";
import { auth } from "@/lib/firebase";
import { getInitials } from "@/lib/utils";
import { signOut } from "firebase/auth";
import { Heart, LogIn, LogOut, Truck, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { DeleteAddressDialog } from "./DeleteAddressDialog";
import { EditAddressDialog } from "./EditAddressDialog";

export default function ProfilePage() {
  const router = useRouter();

  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      router.push("/auth/login");
    } catch (error) {
      toast.error("Logout failed", {
        description: `Something went wrong!, ${error}`,
      });
    }
  };
  const { savedAddresses, deleteAddress, totalWishlistItems } = useUser();

  const handleDeleteAddress = (addressId?: string) => {
    if (addressId) deleteAddress(addressId);
  };

  return (
    <div className="max-w-2xl mx-auto p-3 md:p-6 space-y-6">
      <Card>
        <CardHeader className="flex items-center space-x-4 px-3 md:px-6">
          <Avatar className="w-14 h-14">
            <AvatarImage src={user?.photoURL ?? undefined} />
            <AvatarFallback>
              {user?.displayName ? (
                getInitials(user?.displayName)
              ) : (
                <User className="w-6 h-6 cursor-pointer hover:text-gray-400" />
              )}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-md md:text-xl">
              {user?.displayName || "Guest User"}
            </CardTitle>
            <p className="text-xs md:text-sm text-muted-foreground">
              {user?.email || "Sign in to view more features"}
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 px-3 md:px-6">
          <Button
            variant="ghost"
            className="w-full justify-start text-md"
            onClick={() => router.push("/orders")}
          >
            <Truck className="w-6 h-6 mr-2" /> Your Orders
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-md"
            onClick={() => router.push("/wishlist")}
          >
            <Heart className="w-6 h-6 mr-2" /> Wishlist
            {totalWishlistItems > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {totalWishlistItems}
              </span>
            )}
          </Button>
          <Separator />
          {user ? (
            <>
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">
                  Saved Addresses
                </p>
                {savedAddresses?.length ? (
                  savedAddresses.map((address) => (
                    <div
                      key={address.id}
                      className="flex flex-col md:flex-row items-start justify-between border rounded-lg p-2 md:p-4 "
                    >
                      <div className="text-sm w-full md:w-auto">
                        <p>
                          <b>{address?.fullName}</b>
                        </p>
                        <p>
                          {address.houseNumber}, {address.street}
                        </p>
                        <p>
                          {address.city}, {address.state} ,{" "}
                          <b>{address.pincode}</b>
                        </p>
                        <p>
                          Phone: <b>{address?.phone}</b>
                        </p>
                      </div>
                      <div className="flex w-full md:w-auto justify-center md:justify-end gap-2 mt-1">
                        <EditAddressDialog address={address} />
                        <DeleteAddressDialog
                          onConfirm={() => handleDeleteAddress(address?.id)}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="w-full text-muted-foreground text-sm text-center italic">
                    No address saved
                  </p>
                )}
                {savedAddresses &&
                savedAddresses?.length < MAX_SAVED_ADDRESS ? (
                  <EditAddressDialog />
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Maximum 5 addresses saved.
                  </p>
                )}
              </div>{" "}
              <Separator />
            </>
          ) : null}
          {user ? (
            <Button
              onClick={handleLogout}
              variant="destructive"
              className="w-full"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => router.push("/auth/login")}
            >
              <LogIn size={18} className="mr-2" /> Login
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
