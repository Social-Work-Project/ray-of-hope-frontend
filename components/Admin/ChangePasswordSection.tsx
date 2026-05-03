"use client"
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthService } from "@/services/authService";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

export const editPasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current Password cannot be empty"),
    newPassword: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type PasswordFormValues = z.infer<typeof editPasswordSchema>;

const ChangePasswordSection = () => {
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: {isSubmitting, errors },
    reset,
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(editPasswordSchema),
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: PasswordFormValues) => {
    try {
      const apiData = {
        old_password: data.currentPassword,
        new_password: data.newPassword,
        confirm_password: data.confirmPassword,
      };

      const response = await AuthService.changeUserPassword(apiData) as any;
      reset();
      toast.success(response.message || "Password changed successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    }
  };

  return (
    <Card className="w-fit md:w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-primary" />
          <CardTitle className="text-lg">Password</CardTitle>
        </div>
        <CardDescription>Change your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <div className="relative">
            <Input
              id="current-password"
              type={showPassword ? "text" : "password"}
              {...register("currentPassword")}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            </div>
             {errors.currentPassword && (
              <p className="text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
         
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <div className="relative">
            <Input
              id="new-password"
              type={showPassword ? "text" : "password"}
              {...register("newPassword")}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            </div>
             {errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
             <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              id="confirm-password"
              {...register("confirmPassword")}
              className="pr-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
            </div>
             {errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button className="bg-indigo-950/90 text-gray-200 py-5 px-3 rounded-lg cursor-pointer hover:bg-indigo-800" disabled={isSubmitting} type="submit">Update Password</Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ChangePasswordSection;
