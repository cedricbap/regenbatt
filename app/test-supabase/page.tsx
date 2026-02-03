export default function TestSupabase() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Test Supabase</h1>
      <p>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? "OK" : "NON"}</p>
      <p>KEY: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "OK" : "NON"}</p>
    </main>
  );
}
