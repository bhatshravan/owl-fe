import { Link } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-background">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div className="text-xl font-bold">Owl FE</div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/news">News</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
