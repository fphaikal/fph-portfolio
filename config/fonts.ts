import {
  Instrument_Serif as FontSerif,
  Inter as FontSans,
  JetBrains_Mono as FontMono,
} from "next/font/google";
import localFont from "next/font/local";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const fontSerif = FontSerif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const fontMono = FontMono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const ibrand = localFont({
  src: "../styles/fonts/woff/Ibrand.woff",
  variable: "--font-ibrand",
  weight: "100 900",
});
