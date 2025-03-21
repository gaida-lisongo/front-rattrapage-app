import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "HE | Hydraulique et Environnement",
  description: "Plateforme d'examens en ligne de la section Hydraulique et Environnement. Un espace dédié aux étudiants pour passer leurs épreuves de rattrapage dans un environnement numérique sécurisé et professionnel.",
  keywords: [
    "hydraulique",
    "environnement",
    "e-learning",
    "examen en ligne",
    "rattrapage",
    "études supérieures",
    "ingénierie"
  ],
  authors: [{ name: "Section HE" }],
  colorScheme: "light dark",
  creator: "Section Hydraulique et Environnement",
  publisher: "Section HE",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: 'https://he.inbtp.net/public/Views/template/img/favicon.ico',
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0066ff" },
    { media: "(prefers-color-scheme: dark)", color: "#004dc2" }
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link 
          rel="icon" 
          href="https://he.inbtp.net/public/Views/template/img/favicon.ico"
        />
      </head>
      <body className={geistSans.variable}>
        <div className="page-background">
          {children}
        </div>
      </body>
    </html>
  );
}
