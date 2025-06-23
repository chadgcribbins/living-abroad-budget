import Link from 'next/link';

const Header = () => {
  return (
    <header className="bg-base-200 py-4 shadow-md">
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-primary">
          Living Abroad Budget
        </Link>
        <nav>
          {/* Placeholder for future navigation links */}
          {/* <Link href="/about" className="btn btn-ghost">About</Link>
          <Link href="/contact" className="btn btn-ghost">Contact</Link> */}
        </nav>
      </div>
    </header>
  );
};

export default Header; 