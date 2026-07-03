import "../styles.css";

export const metadata = {
  title: "KG Phone Store",
  description: "Premium iPhone, Samsung Galaxy, and Google Pixel phones in Rwanda.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
