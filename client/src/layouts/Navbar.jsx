import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="border-b border-border bg-base px-6 py-3 flex gap-3">
      <Link
        to="/"
        className="text-sm font-medium text-subtle transition hover:text-heading">
        Projects
      </Link>
      <Link
        to="/Home"
        className="text-sm font-medium text-subtle transition hover:text-heading">
        Home
      </Link>
      <Link
        to="/hello"
        className="text-sm font-medium text-subtle transition hover:text-heading">
        Hello
      </Link>
    </nav>
  );
}

export default Navbar;
