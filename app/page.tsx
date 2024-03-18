"use client";
import { Hero } from "@/components/Hero";
import { ModeToggle } from "@/components/ModeToggle";
import { Calculator } from "@/components/Calculator";
import Chat from "@/components/Chat";
import { useEffect, useState } from "react";

export default function Home() {
  const [showModeToggle, setShowModeToggle] = useState(false);
  const [activeTab, setActiveTab] = useState("Power Consumption Calculator");

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = (300 * window.innerHeight) / 100;
      setShowModeToggle(window.scrollY > heroHeight);

      const calculatorElement = document.getElementById("calculator");
      const saveEnergyElement = document.getElementById("save-energy");
      const chatElement = document.getElementById("chat");

      if (
        chatElement &&
        chatElement.getBoundingClientRect().top < window.innerHeight
      ) {
        setActiveTab("Chat");
      } else if (
        saveEnergyElement &&
        saveEnergyElement.getBoundingClientRect().top < window.innerHeight
      ) {
        setActiveTab("Save Energy");
      } else if (
        calculatorElement &&
        calculatorElement.getBoundingClientRect().top < window.innerHeight
      ) {
        setActiveTab("Calculator");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <Hero />

      <div className="flex flex-col min-h-screen w-full md:w-2/3">
        <div
          className={`flex justify-between items-center text-center backdrop-blur-3xl z-50 sticky top-10 p-4 px-20 rounded-full ${
            showModeToggle ? "" : "hidden"
          }`}
        >
          <h1 className="text-4xl font-bold text-center">{activeTab}</h1>
          <ModeToggle />
        </div>
        <div className="my-10" id="calculator">
          <Calculator />
        </div>
        <div className={`my-10 ${showModeToggle ? "" : "hidden"}`} id="chat">
          <Chat />
        </div>
      </div>
    </main>
  );
}
