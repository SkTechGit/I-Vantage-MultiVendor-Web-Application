import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blogs", "/blogs/*", "/about", "/services", "/contact"],
        disallow: ["/admin", "/admin/*", "/login", "/signup", "/api/*"],
      },
    ],
    sitemap: "https://i-vantage.in/sitemap.xml",
  };
}
