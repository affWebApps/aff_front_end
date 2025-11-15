import Image from "next/image";

export default function Home() {
  return (
    <div className="p-10  flex flex-col gap-5 items-center justify-center">
      <h1>Welcome to the Home Page</h1>
      <Image
        src="/images/home-illustration.svg"
        alt="Home Illustration"
        width={400}
        height={300}
        className="rounded-lg w-full h-auto object-contain"
      />
    </div>
  );
}
