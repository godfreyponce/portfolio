import type { MetadataRoute } from "next";

const siteUrl = "https://godfreyponce.dev";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl },
    { url: `${siteUrl}/projects` },
  ];
}
