import { Metadata } from "next";
import JackpotTracker from "./jackpot-client";

export const metadata: Metadata = {
  title: "Zeqqat - Test Your SportPesa Jackpot Picks Risk Free",
  description:
    "Save your multiple jackpot predictions and see how they perform after the results come out. Free jackpot picks tester for Kenya.",
};

export default function HomePage() {
  return <JackpotTracker />;
}
