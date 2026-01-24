import { Metadata } from 'next';
import Client from './client';

export const metadata: Metadata = {
  title: "Wufwuf Jackpot Tracker",
  description: "Track SportPesa Mega Jackpot results, view match outcomes, share predictions with the community, and analyze winning patterns. Free jackpot tracker for Kenya!",
  keywords: [
    "sportpesa jackpot",
    "mega jackpot results",
    "jackpot predictions",
    "sportpesa results",
    "kenya jackpot",
    "jackpot tracker",
    "betting tips kenya",
    "sportpesa mega jackpot",
    "jackpot analysis",
    "football predictions kenya",
    "midweek jackpot",
    "jackpot winners",
  ],
  openGraph: {
    title: "SportPesa Jackpot Tracker: Results, Predictions & Analysis | Wufwuf",
    description: "Never miss a jackpot result! Track SportPesa Mega Jackpot matches, share your predictions, see community picks, and analyze winning patterns on Wufwuf.",
    type: "website",
    url: "https://wufwuf.io/jackpots",
    images: [{
      url: "https://wufwuf.io/og-jackpot.png",
    }],
    siteName: "Wufwuf",
  },
  twitter: {
    card: "summary_large_image",
    title: "SportPesa Jackpot Tracker: Live Results & Predictions",
    description: "Track Mega Jackpot results, share predictions & compete with the community! 🎯 #SportPesa #Jackpot #Kenya #BettingTips #Wufwuf",
    creator: "@Wufwuf",
    images: ["https://wufwuf.io/og-jackpot.png"],
  },
  alternates: {
    canonical: "https://wufwuf.io/jackpots",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      'max-image-preview': "large",
      'max-snippet': -1,
    },
  },
};

export default function JackpotsPage() {
  return <Client />;
}
