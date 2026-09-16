import './globals.css';

export const metadata = {
  title: 'Crown & Cross — Inventory & Stock Management',
  description: 'Private administration portal for managing football jerseys catalog, stock, and live JSON sync.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
