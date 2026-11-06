import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/professionals",
          "/professionals/*",
          "/blogs",
          "/blogs/*",
          "/services",
          "/services/*",
          "/about",
          "/contact",
          "/gurugram",
          "/gurugram/*",
        ],
        disallow: [
          "/admin",
          "/admin/*",
          "/dashboard",
          "/dashboard/*",
          "/vendor",
          "/vendor/dashboard",
          "/professional/login",
          "/professional/signup",
          "/login",
          "/signup",
          "/api/*",
        ],
      },
    ],
    sitemap: "https://i-vantage.in/sitemap.xml",
  };
}
