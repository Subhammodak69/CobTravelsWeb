import { useEffect } from "react";

const SITE_URL = "https://gantabyaa.com";
const DEFAULT_IMAGE = "https://gantabyaa.com/gantabyaa_og.png";

function ensureMetaTag(selector, attributes) {
  let tag = document.head.querySelector(selector);
  if (!tag) {
    tag = document.createElement("meta");
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });

  if (attributes.property === "og:image") {
    tag.setAttribute("data-testid", "og-image");
  }

  if (attributes.name === "twitter:image") {
    tag.setAttribute("data-testid", "twitter-image");
  }

  return tag;
}

function ensureLinkTag(relValue, attributes) {
  let tag = document.head.querySelector(`link[rel="${relValue}"]`);
  if (!tag) {
    tag = document.createElement("link");
    document.head.appendChild(tag);
  }
  Object.entries(attributes).forEach(([key, value]) => {
    tag.setAttribute(key, value);
  });
  return tag;
}

export default function Seo({
  title = "Gantabyaa | India Tour Packages & Travel Experiences",
  description = "Gantabyaa designs personalized holiday packages, domestic and international tours, and travel experiences across India and beyond.",
  path = "/",
  image = DEFAULT_IMAGE,
  type = "website",
  robots = "index,follow",
  schema,
}) {
  const canonicalUrl = new URL(path.startsWith("/") ? path : `/${path}`, SITE_URL).toString();

  useEffect(() => {
    document.title = title;

    ensureMetaTag('meta[name="description"]', {
      name: "description",
      content: description,
    });

    ensureMetaTag('meta[name="robots"]', {
      name: "robots",
      content: robots,
    });

    ensureMetaTag('meta[property="og:type"]', {
      property: "og:type",
      content: type,
    });
    ensureMetaTag('meta[property="og:site_name"]', {
      property: "og:site_name",
      content: "Gantabyaa",
    });
    ensureMetaTag('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    ensureMetaTag('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    ensureMetaTag('meta[property="og:url"]', {
      property: "og:url",
      content: canonicalUrl,
    });
    ensureMetaTag('meta[property="og:image"]', {
      property: "og:image",
      content: image,
    });

    ensureMetaTag('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    ensureMetaTag('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    ensureMetaTag('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    ensureMetaTag('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: image,
    });

    ensureLinkTag("canonical", {
      rel: "canonical",
      href: canonicalUrl,
    });
  }, [canonicalUrl, description, image, robots, title, type]);

  useEffect(() => {
    if (!schema) return undefined;

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, [schema]);

  return null;
}
