import "./globals.scss";

import { CookiesProvider } from "next-client-cookies/server";

export const metadata = {
  title: "Login Pro-skill",
  description: "Login Pro-skill",
};

export default function RootLayout({ children }) {
  return (
    <html>
      <CookiesProvider>
        <body>{children}</body>
      </CookiesProvider>
    </html>
  );
}
