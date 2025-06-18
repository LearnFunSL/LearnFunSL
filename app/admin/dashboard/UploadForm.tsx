"use client";

import React, { useEffect, useRef, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";

import { addResource, type FormState } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const initialState: FormState = {
  message: "",
  success: false,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Adding Resource..." : "Add Resource"}
    </Button>
  );
}

export default function UploadForm() {
  const [state, formAction] = useActionState(addResource, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message) {
      if (state.success) {
        toast.success(state.message);
        formRef.current?.reset();
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm"
    >
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" required />
        {state.errors?.title && (
          <p className="text-sm text-red-500">{state.errors.title}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input id="subject" name="subject" required />
          {state.errors?.subject && (
            <p className="text-sm text-red-500">{state.errors.subject}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Input id="grade" name="grade" type="number" required />
          {state.errors?.grade && (
            <p className="text-sm text-red-500">{state.errors.grade}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select name="type" required>
            <SelectTrigger>
              <SelectValue placeholder="Select a type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="textbook">Textbook</SelectItem>
              <SelectItem value="pastpaper">Past Paper</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
          {state.errors?.type && (
            <p className="text-sm text-red-500">{state.errors.type}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="year">Year (Optional)</Label>
          <Input id="year" name="year" type="number" />
          {state.errors?.year && (
            <p className="text-sm text-red-500">{state.errors.year}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="term">Term (Optional)</Label>
          <Input id="term" name="term" type="number" />
          {state.errors?.term && (
            <p className="text-sm text-red-500">{state.errors.term}</p>
          )}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="medium">Medium</Label>
        <Select name="medium" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a medium" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="english">English</SelectItem>
            <SelectItem value="sinhala">Sinhala</SelectItem>
            <SelectItem value="tamil">Tamil</SelectItem>
          </SelectContent>
        </Select>
        {state.errors?.medium && (
          <p className="text-sm text-red-500">{state.errors.medium}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="file_url">File URL</Label>
        <Input id="file_url" name="file_url" type="url" required />
        {state.errors?.file_url && (
          <p className="text-sm text-red-500">{state.errors.file_url}</p>
        )}
      </div>

      <SubmitButton />
    </form>
  );
}
