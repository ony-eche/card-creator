export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 text-center text-gray-600">
        <p className="mb-4">
          Made with 💝 by AI Card Creator
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <a href="#" className="hover:text-purple-600">Privacy Policy</a>
          <a href="#" className="hover:text-purple-600">Terms of Service</a>
          <a href="#" className="hover:text-purple-600">Contact</a>
        </div>
        <p className="mt-4 text-xs">
          © 2026 AI Card Creator. All rights reserved.
        </p>
      </div>
    </footer>
  );
}