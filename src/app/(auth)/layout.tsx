import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div style={{ padding: '0px 10px'}}>
      {children}
    </div>
  );
}
