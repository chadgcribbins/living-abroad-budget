import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-base-200 py-6 mt-12 text-sm">
      <div className="container mx-auto px-4 md:px-8 text-center">
        <p>&copy; {new Date().getFullYear()} Living Abroad Budget. All rights reserved.</p>
        <div className="mt-2">
          {/* Placeholder for actual links */}
          <a href="#" className="link link-hover mx-2">Privacy Policy</a>
          <a href="#" className="link link-hover mx-2">Terms of Service</a>
          {/* <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer" className="link link-hover mx-2">GitHub</a> */}
        </div>
        <div className="mt-4 pt-4 border-t border-base-300">
          <p className="font-semibold mb-1">Dev Links:</p>
          <Link href="/dev/demos" className="link link-hover mx-2">Lab (Demos)</Link>
          <Link href="/settings" className="link link-hover mx-2">Settings</Link>
          <Link href="/about" className="link link-hover mx-2">About</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 