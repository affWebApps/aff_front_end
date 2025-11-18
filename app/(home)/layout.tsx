import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full bg-linear-to-b from-orange-50 to-white">
      <Header />
      {/* Add padding-top to prevent content from hiding under fixed header */}
      <main className="min-h-screen pt-20 lg:mt-16">{children}</main>
      <Footer />
    </div>
  );
}
