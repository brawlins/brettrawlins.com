export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 border-t border-gray-700 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-300">
            © {currentYear} Brett Rawlins. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
