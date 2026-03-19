import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-b border-gray-800 bg-gray-950 px-6 py-3 flex gap-3">
      <Link
        to="/"
        className="text-sm font-medium text-gray-300 transition hover:text-white">
        Projects
      </Link>
      <Link
        to="/Home"
        className="text-sm font-medium text-gray-300 transition hover:text-white">
        Home
      </Link>
      <Link
        to="/hello"
        className="text-sm font-medium text-gray-300 transition hover:text-white">
        Hello
      </Link>
    </nav>
  );
}

export default Navbar;
