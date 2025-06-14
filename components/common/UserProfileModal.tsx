import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { value: "en", label: "English" },
  { value: "ta", label: "Tamil" },
  { value: "si", label: "Sinhala" },
];

const grades = Array.from({ length: 13 }, (_, i) => (i + 1).toString());

export function UserProfileModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { user } = useUser();
  const [grade, setGrade] = useState("");
  const [language, setLanguage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ grade, language }),
      });

      if (response.ok) {
        localStorage.setItem("profileCompleted_learnfunsl", "true");
        await user.reload();
        onClose();
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to update user profile:",
          response.status,
          response.statusText,
          errorData,
        );
        // Optionally, show a toast message to the user about the failure
      }
    } catch (error) {
      console.error("Error submitting user metadata:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Profile</DialogTitle>
          <DialogDescription>
            Please provide a bit more information before you continue.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="grade" className="text-right">
              Grade
            </Label>
            <Select onValueChange={setGrade} value={grade}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select your grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((g) => (
                  <SelectItem key={g} value={g}>
                    Grade {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="language" className="text-right">
              Language
            </Label>
            <Select onValueChange={setLanguage} value={language}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSubmit}
            disabled={!grade || !language || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save and Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
