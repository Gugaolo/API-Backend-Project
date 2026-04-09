const endpoints = [
  'POST /api/auth/register',
  'POST /api/auth/login',
  'GET /api/weather?city=Ljubljana',
  'GET /api/favorites',
  'POST /api/favorites',
  'PUT /api/favorites/:id',
  'DELETE /api/favorites/:id',
];

export default function HomePage() {
  return (
    <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px' }}>
      <h1 style={{ marginTop: 0 }}>Weather Favorites API</h1>
      <p>
        Minimal Next.js App Router project focused on REST API endpoints for authentication, weather lookup,
        and protected favorites CRUD.
      </p>

      <h2>Available Endpoints</h2>
      <ul>
        {endpoints.map((endpoint) => (
          <li key={endpoint}>
            <code>{endpoint}</code>
          </li>
        ))}
      </ul>

      <p>
        Protected favorites routes require an <code>Authorization: Bearer &lt;token&gt;</code> header when
        testing in Postman.
      </p>
    </main>
  );
}
