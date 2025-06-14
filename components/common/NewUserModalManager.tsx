"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { UserProfileModal } from "./UserProfileModal";

export function NewUserModalManager({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoaded } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isLoaded && user) {
      const { grade, language } = user.publicMetadata;
      if (!grade || !language) {
        setIsModalOpen(true);
      }
    }
  }, [isLoaded, user]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {children}
      <UserProfileModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
