'use client';

import { useState } from "react";
import AppearanceCard from "./AppearanceCard";

type AppearanceSelectorProps = {
  initialTheme: 'light' | 'dark';
};

export default function AppearanceSelector({ initialTheme }: AppearanceSelectorProps) {
  const [selectedTheme, setSelectedTheme ] = useState(initialTheme);


  return (
    <section className="flex gap-2">
      <AppearanceCard theme='light' isSelected={selectedTheme ==='light'} onClick={() => setSelectedTheme('light')}/>
      <AppearanceCard theme='dark' isSelected={selectedTheme==='dark'} onClick={() => setSelectedTheme('dark')}/>
    </section>
  );
}