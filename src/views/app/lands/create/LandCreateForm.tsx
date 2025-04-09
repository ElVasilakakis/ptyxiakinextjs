"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { ColorPicker } from "@/components/ui/color-picker" // You might need to implement this
import { MapPicker } from "@/components/ui/map-picker" // You might need to implement this

const formSchema = z.object({
  landName: z.string().min(2, {
    message: "Land name must be at least 2 characters.",
  }),
  location: z.any().optional(), // You might want to define a more specific schema for location
  color: z.string().optional(),
  enabled: z.boolean().default(true),
})

export function LandForm({ onSubmit, initialData }) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      landName: "",
      location: null,
      color: "#4CAF50", // Default green color
      enabled: true,
    },
  })

  const handleSubmit = (data) => {
    onSubmit(data);
    console.log(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
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
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                {/* This is a placeholder. You'll need to implement a proper location picker */}
                <MapPicker 
                  value={field.value} 
                  onChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                Select the location of your land on the map
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
                {/* This is a placeholder. You'll need to implement a proper color picker */}
                <ColorPicker 
                  value={field.value} 
                  onChange={field.onChange}
                />
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
        
        <Button type="submit">Save Land</Button>
      </form>
    </Form>
  )
}
