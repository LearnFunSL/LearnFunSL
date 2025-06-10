"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PlusCircle } from "lucide-react";

const deckSchema = z.object({
  name: z.string().min(1, "Deck name is required").max(100),
  subject: z.string().max(100).optional(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format"),
});

const PRESET_COLORS = [
  "#3B82F6",
  "#EF4444",
  "#10B981",
  "#F97316",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
  "#F59E0B",
];

interface CreateDeckDialogProps {
  children: React.ReactNode;
  onDeckCreated: (deck: z.infer<typeof deckSchema>) => void;
  isLoading: boolean;
}

export function CreateDeckDialog({
  children,
  onDeckCreated,
  isLoading,
}: CreateDeckDialogProps) {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof deckSchema>>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      name: "",
      subject: "",
      color: PRESET_COLORS[0],
    },
  });

  const onSubmit = (values: z.infer<typeof deckSchema>) => {
    onDeckCreated(values);
    setIsOpen(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Deck</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Chapter 5: Photosynthesis"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Biology" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deck Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      {PRESET_COLORS.map((color) => (
                        <button
                          type="button"
                          key={color}
                          className="w-8 h-8 rounded-full border-2 transition-transform transform hover:scale-110"
                          style={{
                            backgroundColor: color,
                            borderColor:
                              field.value === color
                                ? "hsl(var(--primary))"
                                : "transparent",
                          }}
                          onClick={() => field.onChange(color)}
                        />
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Deck"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
