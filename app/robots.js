export default function robots() {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://reservasi-hotel.vercel.app/sitemap.xml",
    host: "https://reservasi-hotel.vercel.app",
  };
}
