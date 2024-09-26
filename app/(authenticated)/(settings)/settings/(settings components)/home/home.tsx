// Client-side React component
"use client";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { LinkAimeCard } from "@/lib/LinkNewAccessCode";
import { getDaphnisInUseCards } from "@/lib/GetUserAccessCode";
import SettingsSubMenuNavigation from "@/components/navigationbar/settingsnavigation";

const GeneralSettings = () => {
  const { toast } = useToast();
  const [accessCode, setAccessCode] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [currentAccessCode, setCurrentAccessCode] = useState<string | null>(
    null
  );

  useEffect(() => {
    // Fetch current access code when component mounts
    fetchCurrentAccessCode();
  }, []);

  const fetchCurrentAccessCode = async () => {
    try {
      const aimeUser = await getDaphnisInUseCards();
      if (aimeUser) {
        setCurrentAccessCode(aimeUser.accessCode || null);
      }
    } catch (error) {
      console.error("Error fetching access code:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccessCode(value);
    setIsButtonDisabled(value.length !== 20);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    try {
      const result = await LinkAimeCard(formData);
      if (result.success) {
        toast({
          title: "Success",
          description: "Aime Card linked successfully",
        });
        setAccessCode("");
        fetchCurrentAccessCode();
      } else {
        toast({
          title: "Error",
          description: "Failed to link Aime Card",
        });
      }
    } catch (error: any) {
      if (error instanceof Error) {
        if (error.message === "Access Code is already used by another user") {
          toast({
            title: "Error",
            description: "Access Code is already used by another user",
          });
        } else if (
          error.message === "Not in artemis's database, Nice try ^_^"
        ) {
          toast({
            title: "Error",
            description: "Access Code not found in database",
          });
        } else if (
          error.message === "You are currently holding this access code"
        ) {
          toast({
            title: "Error",
            description: "You are currently holding this access code",
          });
          setAccessCode("");
        } else {
          toast({
            title: "Error",
            description: `Failed to link Aime Card: ${error.message}`,
          });
        }
      } else {
        console.error(error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again later.",
        });
      }
    }
  };

  return (
    <Card x-chunk="aimecard">
      <CardHeader>
        <CardTitle className="text-2xl">Link New Aime Card</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-lg mb-4">
          Current Access Code: {currentAccessCode}
        </div>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="accessCode">Access Code</Label>
            <Input
              name="accessCode"
              type="text"
              placeholder="*******************"
              value={accessCode}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isButtonDisabled}>
            Link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export { GeneralSettings };
