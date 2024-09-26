import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import React from "react";

const UnlockUser = () => {
  return (
    <Card x-chunk="aimecard">
      <CardHeader>
        <CardTitle className="text-2xl">Link New Aime Card</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-lg mb-4">Current Access Code:</div>
        <form className="grid gap-4">
          <div className="grid gap-2">
            <Label>Access Code</Label>
            <Input
              name="accessCode"
              type="text"
              placeholder="*******************"
            />
          </div>
          <Button type="submit" className="w-full">
            Link
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default UnlockUser;
