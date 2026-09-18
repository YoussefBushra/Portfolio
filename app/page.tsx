import { ProfileApp } from "@/components/layout/ProfileApp";
import { CommandPalette } from "@/components/system/CommandPalette";
import { TechProvider } from "@/components/system/TechContext";

export default function Home() {
  return (
    <TechProvider>
      <CommandPalette />
      <ProfileApp />
    </TechProvider>
  );
}
