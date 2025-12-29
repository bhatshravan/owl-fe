import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

export function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="border-b bg-background">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <div
          className="text-xl font-bold"
          onClick={() => {
            navigate("/");
          }}
        >
          Owl FE
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" asChild>
            <Link to="/news">News</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/news">AutoLogin</Link>
          </Button>

          <Button variant="ghost" asChild>
            <Link to="/positions">Positions</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/holdings">Holdings</Link>
          </Button>
          <Button variant="ghost" asChild>
            <a
              href="https://kite.zerodha.com/connect/login?api_key=kxttmze3myz7kwxi&v=3"
              target="_blank"
            >
              Kite Login
            </a>
          </Button>
          <Button
            asChild
            onClick={() => {
              localStorage.removeItem("Auth");
              window.location.href = "/signin";
            }}
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}
