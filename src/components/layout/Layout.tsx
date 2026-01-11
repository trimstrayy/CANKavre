import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SearchProvider } from "@/contexts/SearchContext";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <SearchProvider>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </SearchProvider>
  );
};

export default Layout;
