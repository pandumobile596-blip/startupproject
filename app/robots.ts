import type { MetadataRoute } from "next";

const BASE_URL = "https://www.landoraapp.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow all crawlers on public pages
        userAgent: "*",
        allow: ["/", "/login", "/signup"],
        // Keep authenticated app routes out of search index
        disallow: [
          "/dashboard",
          "/properties",
          "/tenants",
          "/leases",
          "/payments",
          "/expenses",
          "/reports",
          "/feedback",
          "/api/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
