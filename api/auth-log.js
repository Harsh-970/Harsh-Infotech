export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method Not Allowed' });
  }

  // Vercel serverless function mockup for authentication logging.
  // Since Vercel uses a read-only file system, we avoid writing to the local CSV file.
  // This simply returns success so the UI login flow can proceed without crashing.
  // We can add logic to send data to a cloud database (like Supabase) here later.
  return res.status(200).json({ ok: true });
}
