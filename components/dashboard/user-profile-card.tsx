"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { GraduationCap, Languages } from "lucide-react";

export function UserProfileCard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </CardHeader>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>User Not Found</CardTitle>
          <p className="text-sm text-muted-foreground">
            Could not load user profile data.
          </p>
        </CardHeader>
      </Card>
    );
  }

  const grade = user.publicMetadata?.grade as number | undefined;
  const language = user.publicMetadata?.language as string | undefined;

  const languageMap: { [key: string]: string } = {
    en: "English",
    si: "Sinhala",
    ta: "Tamil",
  };
  const displayLanguage = language ? languageMap[language] : "Not set";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user.imageUrl}
              alt={user.fullName || "User avatar"}
            />
            <AvatarFallback>{user.fullName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl">{user.fullName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="flex items-center text-base">
            <GraduationCap className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Grade:</span>
            <span className="ml-2 font-semibold text-foreground">
              {grade || "Not set"}
            </span>
          </div>
          <div className="flex items-center mt-2 text-base">
            <Languages className="h-5 w-5 mr-2 flex-shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground">Language:</span>
            <span className="ml-2 font-semibold text-foreground">
              {displayLanguage}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
