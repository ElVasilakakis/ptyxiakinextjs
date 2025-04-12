'use client'
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import MapPicker from "@/components/ui/map-picker";
import { createLand } from "@/lib/lands/create";

const formSchema = z.object({
  landName: z.string().min(2, {
    message: "Land name must be at least 2 characters.",
  }),
  location: z.any().optional(),
  color: z.string().optional(),
  enabled: z.boolean().default(true),
});

export default function CreateLand() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      landName: "",
      location: null,
      color: "#4CAF50",
      enabled: true,
    },
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await createLand(data);
      
      if (result.success) {
        toast.success(result.message || "Land created successfully!");
        router.push("/app/lands");
      } else {
        toast.error(result.error || "Failed to create land");
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationChange = useCallback((value) => {
    form.setValue("location", value);
  }, [form]);

  if (!isMounted) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Land</CardTitle>
        <CardDescription>You can add your lands here</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="landName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Land Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Farm" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter a descriptive name for your land
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-8 h-8 rounded-md border" 
                        style={{ backgroundColor: field.value || "#4CAF50" }}
                      />
                      <Input 
                        type="color" 
                        value={field.value || "#4CAF50"} 
                        onChange={(e) => field.onChange(e.target.value)}
                        className="w-12 h-8 p-0"
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Choose a color to represent this land
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <MapPicker
                      onChange={handleLocationChange}
                      initialValue={field.value}
                      color={form.watch("color")}
                    />
                  </FormControl>
                  <FormDescription>
                    Select a location on the map. Use point mode for a single location or polygon mode to define an area.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="enabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Enabled
                    </FormLabel>
                    <FormDescription>
                      Toggle to enable or disable this land
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Land"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
