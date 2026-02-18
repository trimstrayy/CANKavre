import { FormEvent, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn, LogOut, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSearch } from "@/contexts/SearchContext";
import { useLanguage } from "@/contexts/LanguageContext";
import SearchPanel from "@/components/SearchPanel";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isVisible: isSearchVisible, query, openSearch, closeSearch, performSearch } = useSearch();
  const { t, isNepali } = useLanguage();
  const { user, logout } = useAuth();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    closeSearch();
  }, [location.pathname, closeSearch]);

  useEffect(() => {
    // Prevent background scrolling while the mobile drawer is open.
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isSearchVisible) {
      searchInputRef.current?.focus();
    }
  }, [isSearchVisible]);

  useEffect(() => {
    if (!isSearchVisible) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchVisible, closeSearch]);

  const handleSearchToggle = () => {
    if (isSearchVisible) {
      closeSearch();
    } else {
      openSearch();
    }
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    openSearch();
    performSearch(query);
  };

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("aboutUs"), path: "/about" },
    {
      name: t("committee"),
      path: "/about#committee",
      dropdown: [
        { name: t("currentCommittee"), path: "/about#committee" },
        { name: t("pastCommittees"), path: "/about#past-committees" },
        { name: t("subcommittees"), path: "/about#subcommittees" },
      ]
    },
    { name: t("programs"), path: "/programs" },
    {
      name: t("news"),
      path: "/press-releases",
      dropdown: [
        { name: t("pressReleases"), path: "/press-releases" },
        { name: t("noticeBoard"), path: "/notice" },
        { name: t("events"), path: "/events" },
      ]
    },
    { name: t("eventsGallery"), path: "/events#gallery" },
    { name: t("downloads"), path: "/downloads" },
  ];

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path.split("#")[0]);
  };

  const headerClasses = `sticky top-0 z-50 transition-all duration-300 ${
    isScrolled ? "bg-card/95 backdrop-blur-md shadow-card" : "bg-card"
  }`;

  return (
    <>
      <header className={headerClasses}>
      {/* <div className="bg-gradient-to-r from-primary via-secondary to-accent h-1" /> */}
      <div className="relative overflow-hidden border-b border-border bg-card py-4">
        <div className="absolute inset-x-0 top-3 flex flex-col gap-[0px] -translate-y-1/2">
          <span className="h-2 w-full bg-red-600" />
          <span className="h-2 w-full bg-green-600" />
          <span className="h-2 w-full bg-blue-600" />
        </div>
        <div className="absolute top-0 z-20 container mx-auto px-4 flex justify-start">
          <span className="inline-flex items-center bg-green-600 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-md">
            Lets Build e-Nepal
          </span>
        </div>
      </div>

      <nav className="relative border-b border-border">
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
              <LanguageSwitcher />
              <form
                onSubmit={handleSearchSubmit}
                className={`group flex items-center overflow-hidden rounded-full border border-border bg-card transition-all duration-300 ease-out ${
                  isSearchVisible
                    ? "w-64 pl-3 pr-2 shadow-md shadow-primary/10 md:w-72"
                    : "w-10 pl-0 pr-0"
                }`}
              >
                <button
                  type="button"
                  onClick={handleSearchToggle}
                  className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors group-hover:text-foreground"
                  aria-label={isSearchVisible ? "Close search" : "Open search"}
                >
                  <Search className="h-5 w-5" />
                </button>
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(event) => {
                    performSearch(event.target.value);
                  }}
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  className={`h-10 flex-1 bg-transparent text-sm text-foreground outline-none transition-all duration-300 ease-out ${
                    isSearchVisible ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                  aria-hidden={!isSearchVisible}
                />
              </form>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="hidden md:inline-flex gap-2">
                      <User className="w-4 h-4" />
                      <span className="max-w-[120px] truncate text-sm">{user.fullName || user.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
                      {user.role === 'committee'
                        ? isNepali ? 'समिति सदस्य' : 'Committee'
                        : user.role === 'subcommittee'
                        ? isNepali ? 'उपसमिति' : 'Subcommittee'
                        : isNepali ? 'सदस्य' : 'Member'}
                    </DropdownMenuItem>
                    {user.role === 'committee' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">{isNepali ? 'एडमिन ड्यासबोर्ड' : 'Admin Dashboard'}</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      onClick={() => { logout(); window.location.href = '/'; }}
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {isNepali ? 'लगआउट' : 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link to="/auth" className="hidden md:block">
                  <Button className="bg-primary hover:bg-primary/90">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t("login")}
                  </Button>
                </Link>
              )}

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
        <SearchPanel />
      </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setIsOpen(false)}
      >
        <div
          className={`absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />
        <div className="absolute inset-y-0 right-0 flex h-full w-full justify-end">
          <div
            className={`flex h-full w-[50vw] min-w-[280px] max-w-sm flex-col border-l border-border bg-card px-4 py-6 shadow-2xl transition-transform duration-300 ${
              isOpen ? "translate-x-0" : "translate-x-full"
            }`}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-6 flex items-center justify-between">
              <span className="font-heading text-lg font-semibold text-foreground">{t("menu")}</span>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-border p-2 text-foreground hover:bg-muted"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4">
              <LanguageSwitcher />
            </div>
            <nav className="flex-1 overflow-y-auto">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    {link.dropdown ? (
                      <div className="space-y-1">
                        <p className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          {link.name}
                        </p>
                        <ul className="space-y-1">
                          {link.dropdown.map((item) => (
                            <li key={item.name}>
                              <Link
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`block rounded-lg px-3 py-3 font-medium transition-colors ${
                                  isActive(item.path)
                                    ? "bg-primary/10 text-primary"
                                    : "text-foreground hover:bg-muted"
                                }`}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <Link
                        to={link.path}
                        onClick={() => setIsOpen(false)}
                        className={`block rounded-lg px-3 py-3 font-medium transition-colors ${
                          isActive(link.path)
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
            <div className="mt-6 border-t border-border pt-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 px-2 py-1">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium truncate">{user.fullName || user.email}</span>
                    <span className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {user.role}
                    </span>
                  </div>
                  {user.role === 'committee' && (
                    <Link to="/admin" className="block" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full">
                        {isNepali ? 'एडमिन ड्यासबोर्ड' : 'Admin Dashboard'}
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => { logout(); setIsOpen(false); window.location.href = '/'; }}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    {isNepali ? 'लगआउट' : 'Logout'}
                  </Button>
                </div>
              ) : (
                <Link to="/auth" className="block" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    <LogIn className="w-4 h-4 mr-2" />
                    {t("memberLogin")}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;