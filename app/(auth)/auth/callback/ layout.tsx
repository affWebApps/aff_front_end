"use client";

import QueryProvider from "@/providers/query-provider";


export default function CallbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
