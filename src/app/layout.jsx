import "./globals.scss";

import { CookiesProvider } from "next-client-cookies/server";

export const metadata = {
  title: "Login Pro-skill",
  description: "Login Pro-skill",
};

export default function RootLayout({ children }) {
  return (
    <CookiesProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </CookiesProvider>
  );
}
