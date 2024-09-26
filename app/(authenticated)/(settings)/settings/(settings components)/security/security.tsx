"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast, useToast } from "@/components/ui/use-toast";
import { updatePassword } from "./forgotpassword";

export default function SecuritySettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleCurrentPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCurrentPassword(event.target.value);
  };

  const handleNewPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const isButtonDisabled = !currentPassword || !newPassword || !confirmPassword;

  const submit = async (data: FormData) => {
    const { error } = await updatePassword(
      currentPassword,
      newPassword,
      confirmPassword
    );
    if (error) {
      toast({
        title: "Error",
        description: error,
      });
    } else {
      toast({
        title: "Success",
        description: "Password updated successfully",
      });
    }
  };

  return (
    <div className="grid gap-6">
      <Card x-chunk="passwordreset">
        <form action={submit}>
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={currentPassword}
              onChange={handleCurrentPasswordChange}
            />
            <Input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </CardContent>
          <CardFooter className="border-t flex justify-end px-6 py-4">
            <Button
              type="submit"
              disabled={isButtonDisabled}
              style={{
                backgroundColor: isButtonDisabled ? "grey" : "",
              }}
            >
              Save
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
