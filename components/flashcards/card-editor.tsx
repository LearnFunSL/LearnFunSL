"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/types/flashcards";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Wand2, Save, Trash2 } from "lucide-react";
import { AiExtractDialog } from "./ai-extract-dialog";

const cardSchema = z.object({
  front_text: z.string().min(1, "Front text is required"),
  back_text: z.string().min(1, "Back text is required"),
});

interface CardEditorProps {
  selectedCard: Card | null;
  onSave: (data: z.infer<typeof cardSchema>) => void;
  onDelete: () => void;
  onExtract: (cards: Array<{ front_text: string; back_text: string }>) => void;
  isLoading: boolean;
}

export function CardEditor({
  selectedCard,
  onSave,
  onDelete,
  onExtract,
  isLoading,
}: CardEditorProps) {
  const form = useForm<z.infer<typeof cardSchema>>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      front_text: "",
      back_text: "",
    },
  });

  useEffect(() => {
    if (selectedCard) {
      form.reset({
        front_text: selectedCard.front_text,
        back_text: selectedCard.back_text,
      });
    } else {
      form.reset({ front_text: "", back_text: "" });
    }
  }, [selectedCard, form]);

  const onSubmit = (values: z.infer<typeof cardSchema>) => {
    onSave(values);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-sm h-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 h-full flex flex-col"
        >
          <div className="grid grid-cols-1 gap-6 flex-grow">
            <FormField
              control={form.control}
              name="front_text"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Front</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the question or term..."
                      {...field}
                      className="flex-grow resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="back_text"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Back</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the answer or definition..."
                      {...field}
                      className="flex-grow resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              <AiExtractDialog onExtract={onExtract}>
                <Button type="button" variant="outline" size="sm">
                  <Wand2 className="mr-2 h-4 w-4" />
                  AI Extract
                </Button>
              </AiExtractDialog>
            </div>
            <div className="flex gap-2">
              {selectedCard && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={onDelete}
                  disabled={isLoading}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
              <Button type="submit" size="sm" disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Card"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
