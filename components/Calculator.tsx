/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from "react";
import { BackgroundGradient } from "./ui/background-gradient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import { Meteors } from "./ui/meteors";

const formSchema = z.object({
  houseSize: z.string().min(1).max(1000),
  people: z.string().min(1).max(50),
  devices: z.string().min(1).max(100),
});

export function Calculator() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      houseSize: "0",
      people: "0",
      devices: "0",
    },
  });

  const { watch, handleSubmit } = form;
  const watchedValues = watch(); // Watching all form fields

  // Calculate totalCost dynamically based on watched values
  const houseSize = parseInt(watchedValues.houseSize) || 0;
  const devices = parseInt(watchedValues.devices) || 0;
  const people = parseInt(watchedValues.people) || 0;
  const totalCost = houseSize * 9 + people * 200 + devices * 200;

  return (
    <div className="w-full">
      <BackgroundGradient className="rounded-[22px] w-full p-4 sm:p-10 bg-white dark:bg-zinc-900">
        <div className="flex flex-col md:flex-row justify-between w-full">
          <div className="flex flex-col justify-center items-center mx-auto">
            <img
              className="hidden dark:md:block"
              src="/energy.gif"
              alt="Logo"
              width={500}
            />
            <img
              className="dark:hidden md:block"
              src="/electrolight.gif"
              alt="Logo"
              width={500}
            />
            <h3 className="text-2xl font-bold text-center">{totalCost} kWh</h3>
          </div>
          <Form {...form}>
            <form className="space-y-8 md:w-1/2 w-full">
              <FormField
                control={form.control}
                name="houseSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>House size</FormLabel>
                    <FormControl>
                      <Input placeholder="50m²" {...field} />
                    </FormControl>
                    <FormDescription>
                      What is the size of your house in square meters?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="people"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>People</FormLabel>
                    <FormControl>
                      <Input placeholder="2" {...field} />
                    </FormControl>
                    <FormDescription>
                      How many people live in your household?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="devices"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Devices</FormLabel>
                    <FormControl>
                      <Input placeholder="12" {...field} />
                    </FormControl>
                    <FormDescription>
                      How many devices are in your household?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </BackgroundGradient>
    </div>
  );
}
