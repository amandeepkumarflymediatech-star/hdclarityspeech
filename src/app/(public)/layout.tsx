import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthProvider from "@/components/providers/AuthProvider";
import DiscountPopup from "@/components/common/DiscountPopup";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <DiscountPopup />
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </AuthProvider>
  );
}

