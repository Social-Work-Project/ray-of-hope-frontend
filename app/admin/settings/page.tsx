"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User } from "lucide-react";
import { toast } from "sonner";
import ChangePasswordSection from "@/components/Admin/ChangePasswordSection";
import AdminGuard from "@/components/Admin/AdminGuard";
import { AdminSidebar } from "@/components/Admin/AdminSidebar";
import { AuthService } from "@/services/authService";

export default function Settings() {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    async function fetchProfile() {
      const res = await AuthService.getProfile() as any;
      console.log("Profile data:", res);
      setProfileData({
        name: res.data.username,
        email: res.data.email,
      });
    }
    fetchProfile();
  }, []);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Your profile has been updated successfully.");
  };

  return (
     <AdminGuard>
        <div className="flex min-h-screen">
            <AdminSidebar />
            <div className="flex-1">
      <div className="md:flex md:flex-col w-full  space-y-6 animate-fade-in">
        <div className="bg-white border-b px-8 py-2 sticky top-0 z-10" style={{ borderColor: 'var(--gray-100)' }}>
            <h2 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Account Settings</h2>
          </div>

        {/* Profile Settings */}
        <div className="px-8 flex flex-col md:flex-row gap-8 bg-(--gray-500) ">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Profile</CardTitle>
            </div>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Username</Label>
                <Input
                  id="name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                />
              </div>
              <Button className="bg-indigo-950/90 text-gray-200 py-5 px-3 rounded-lg cursor-pointer hover:bg-indigo-800" type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>

        {/* Password Settings */}
        <ChangePasswordSection />

        {/* Notification Preferences */}
        {/* <NotificationSection /> */}
      </div>
      </div>
      </div>
      </div>
      </AdminGuard>
  );
}
