import "./globals.css";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export const metadata = {
  title: {
    template: "%s | Brett Rawlins",
    default: "Brett Rawlins - Full Stack Developer",
  },
  description:
    "A full-stack software engineer's journey through web technologies, learning, and building new things.",
  keywords: [
    "web development",
    "full-stack",
    "javascript",
    "react",
    "nextjs",
    "blog",
  ],
  authors: [{ name: "Brett Rawlins" }],
  creator: "Brett Rawlins",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <SiteHeader />
        <main className="flex-grow">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
