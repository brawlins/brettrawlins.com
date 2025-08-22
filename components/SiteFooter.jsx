export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600">
            © {currentYear} Brett Rawlins. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
