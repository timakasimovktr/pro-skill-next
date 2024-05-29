export const metadata = {
  title: "Dashboard Pro-skill",
  description: "Dashboard Pro-skill",
};

import { CookiesProvider } from "next-client-cookies/server";

export default function RootLayout({ children }) {
  return (
    <CookiesProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </CookiesProvider>
  );
}
