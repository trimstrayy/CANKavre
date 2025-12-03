import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    {
      name: "Committee",
      path: "/about#committee",
      dropdown: [
        { name: "Current Committee", path: "/about#committee" },
        { name: "Past Committees", path: "/about#past-committees" },
        { name: "Subcommittees", path: "/about#subcommittees" },
      ]
    },
    { name: "Programs", path: "/programs" },
    {
      name: "News",
      path: "/press-releases",
      dropdown: [
        { name: "Press Releases", path: "/press-releases" },
        { name: "Notice Board", path: "/notice" },
        { name: "Events", path: "/events" },
      ]
    },
    { name: "Gallery", path: "/events#gallery" },
    { name: "Downloads", path: "/downloads" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path.split("#")[0]);
  };

  const headerClasses = `sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-card/95 backdrop-blur-md shadow-card" : "bg-card"
    }`;

  return (
    <header className={headerClasses}>
      {/* Top Bar: left quarter reserved for pill, right side keeps three stripes */}
      <div className="relative">
        <div className="container mx-auto px-6">
          <div className="flex flex-col">
            <div className="flex items-start">
              {/* Left 25%: space for the green bubble */}
              <div className="hidden sm:flex w-1/4 item item-leftac ">
                <div className="flex-1">
                  <div className="h-2 bg-red-600 w-full" />
                  <div className="h-2 bg-green-600 w-full" />
                  <div className="h-2 bg-blue-600 w-full" />
                </div>
                <div className="absolute -top-1 left-0">
                  <div className="inline-block bg-green-600 text-white px-4 py-1 rounded-sm text-sm font-semibold shadow-md">
                    Let's Build e-Nepal
                  </div>
                </div>
              </div>

              {/* Right 75%: the triple stripe */}
              <div className="flex-1 relatives">
                <div className="h-2 bg-red-600 w-full absolute" />
                <div className="h-2 bg-green-600 w-full absolute top-2" />
                <div className="h-2 bg-blue-600 w-full absolute top-4" />
              </div>
            </div>

            {/* Mobile pill duplication */}
            <div className="sm:hidden mt-3">
              <div className="inline-block bg-green-600 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-md">
                Let's Build e-Nepal
              </div>
            </div>

            {/* Contact row below the stripes */}
            <div className="flex items-center justify-between py-2 text-can-white text-sm">
              {/* <div className="flex items-center gap-4">
                <span className="hidden md:block">📧 cankavre@gmail.com</span>
                <span className="hidden md:block">📞 +977-0000000000</span>
              </div> */}
              {/* <div className="flex items-center gap-3">
                <Link
                  to="/auth"
                  className="flex items-center gap-1 hover:text-can-white/80 transition-colors"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Member Login</span>
                </Link>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <nav className="border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-primary via-secondary to-accent p-0.5">
                <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                  <img src="/CANKavre_Logo.jpeg" alt="CAN Kavre logo" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading font-bold text-foreground text-lg leading-tight">
                  CAN Federation
                </h1>
                <p className="text-xs text-muted-foreground">Kavre Branch</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                link.dropdown ? (
                  <DropdownMenu key={link.name}>
                    <DropdownMenuTrigger asChild>
                      <button className={`px-4 py-2 rounded-lg font-medium flex items-center gap-1 transition-colors ${isActive(link.path)
                        ? "bg-primary/10 text-primary"
                        : "text-foreground hover:bg-muted"
                        }`}>
                        {link.name}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48">
                      {link.dropdown.map((item) => (
                        <DropdownMenuItem key={item.name} asChild>
                          <Link to={item.path} className="cursor-pointer">
                            {item.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${isActive(link.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                      }`}
                  >
                    {link.name}
                  </Link>
                )
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <Search className="w-5 h-5" />
              </Button>
              <Link to="/auth" className="hidden md:block">
                <Button className="bg-primary hover:bg-primary/90">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <div className={`lg:hidden border-b border-border overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}>
        <div className="container mx-auto px-4 py-4 space-y-1 bg-card">
          {navLinks.map((link) => (
            link.dropdown ? (
              <div key={link.name} className="space-y-1">
                <div className="px-4 py-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {link.name}
                </div>
                {link.dropdown.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(item.path)
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-muted"
                      }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            ) : (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${isActive(link.path)
                  ? "bg-primary/10 text-primary"
                  : "text-foreground hover:bg-muted"
                  }`}
              >
                {link.name}
              </Link>
            )
          ))}
          <div className="pt-4 border-t border-border">
            <Link to="/auth" className="block">
              <Button className="w-full bg-primary hover:bg-primary/90">
                <LogIn className="w-4 h-4 mr-2" />
                Member Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;