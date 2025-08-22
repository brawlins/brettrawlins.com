import Link from "next/link";
import Search from "./Search";

export default function SiteHeader() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Site Title */}
          <Link
            href="/"
            className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
          >
            Brett Rawlins
          </Link>

          {/* Center - Search */}
          <div className="hidden md:block">
            <Search />
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link
              href="/blog"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/tags"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Tags
            </Link>
            <Link
              href="/about"
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              About
            </Link>
          </nav>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <Search />
        </div>
      </div>
    </header>
  );
}
