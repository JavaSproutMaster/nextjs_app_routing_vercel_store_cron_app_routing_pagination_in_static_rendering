import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "../components/Footer";
import AuthContext from "./AuthContext";
import Header from "./Header";
import { Metadata } from "next";
import ShowProfilePannel from "./components/headerClient/ShowProfilePannel";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/auth";
import FullModal from "./components/FullModal";
import SearchResult from "./search/SearchResult";
import MobileMenuBar from "./components/headerClient/MobileMenuBar";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.allfreechips.com"),
  title: "AllFreeChips",
  description:
    "AllFreeChips is the biggest community with over 30,038+ active members bringing the best online casino bonuses. Latest casino bonus codes of 2022",
  icons: ["/favicon.ico"],
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <div className="bg-white text-sky-700 dark:bg-zinc-800 dark:text-white">
          <AuthContext>
            <Header />
            <div className="content" id="afc-main">
              {children}
            </div>

            <ShowProfilePannel session={session} />
            <MobileMenuBar />
            <FullModal>
              <SearchResult />
            </FullModal>
          </AuthContext>
          <Footer />
        </div>
        <Analytics />
        <SpeedInsights />
        <script src="/adv-scroll-sidebar.js" async />
      </body>
    </html>
  );
}
