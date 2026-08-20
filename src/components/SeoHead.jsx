import { useEffect } from "react";
import { SITE_URL } from "../seo/site";

function upsert(selector, tag, attributes) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement(tag);
    document.head.appendChild(node);
  }
  Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
}

export default function SeoHead({ title, description, path, noindex = false, structuredData }) {
  useEffect(() => {
    document.title = title;
    const canonical = `${SITE_URL}${path}`;
    upsert('meta[name="description"]', "meta", { name: "description", content: description });
    upsert('link[rel="canonical"]', "link", { rel: "canonical", href: canonical });
    upsert('meta[property="og:title"]', "meta", { property: "og:title", content: title });
    upsert('meta[property="og:description"]', "meta", { property: "og:description", content: description });
    upsert('meta[property="og:url"]', "meta", { property: "og:url", content: canonical });
    upsert('meta[property="og:type"]', "meta", { property: "og:type", content: "website" });
    upsert('meta[name="twitter:card"]', "meta", { name: "twitter:card", content: "summary" });
    upsert('meta[name="robots"]', "meta", { name: "robots", content: noindex ? "noindex,follow" : "index,follow" });
    let jsonLd = document.head.querySelector('script[data-reussimaths-seo="jsonld"]');
    if (structuredData) {
      if (!jsonLd) {
        jsonLd = document.createElement("script");
        jsonLd.type = "application/ld+json";
        jsonLd.dataset.reussimathsSeo = "jsonld";
        document.head.appendChild(jsonLd);
      }
      jsonLd.textContent = JSON.stringify(structuredData);
    } else {
      jsonLd?.remove();
    }
  }, [title, description, path, noindex, structuredData]);
  return null;
}
