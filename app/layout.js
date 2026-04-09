export const metadata = {
  title: 'Weather Favorites API',
  description: 'Minimal Next.js backend-first demo with JWT auth and favorites CRUD.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'sans-serif', margin: 0, backgroundColor: '#fafafa', color: '#111827' }}>
        {children}
      </body>
    </html>
  );
}
