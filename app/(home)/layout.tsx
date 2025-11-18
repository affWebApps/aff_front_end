import Header from "../components/Header";
import Footer from "../components/Footer";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </div>
  );
}
