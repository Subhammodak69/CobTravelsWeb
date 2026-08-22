import { useState } from "react";

function isVideo(item) {
  return item.type === "video" || /\.(mp4|webm|ogg)(\?|$)/i.test(item.url);
}

export default function PackageGallery({ pack }) {
  const [active, setActive] = useState(0);
  const gallery = (pack.gallery || []).filter((item) => { const url = typeof item === "string" ? item : item?.url; return url && (typeof item === "string" || item.type !== "video") && !/\.(mp4|webm|ogg)(\?|$)/i.test(url); }).map((item) => typeof item === "string" ? { url: item, type: "image" } : item);
  if (!gallery.length) return null;
  const selected = gallery[active] || gallery[0];

  return (
    <section className="gallerySection">
      <div className="sectionHead">
        <div><p className="eyebrow">Through our lens</p><h2>Scenes worth<br /><em>remembering.</em></h2></div>
        <p>Scenes from this journey supplied by Coochbehar Travel.</p>
      </div>
      <div className="gallery">
        {isVideo(selected) ? <video className="mainGalleryImage" src={selected.url} controls /> : <img className="mainGalleryImage" src={selected.url} alt={selected.alt || pack.title + " gallery"} />}
        <div className="galleryRail">
          {gallery.map((item, index) => (
            <button className={index === active ? "active" : ""} onClick={() => setActive(index)} key={item.id || item.url + index} aria-label={`View ${item.alt || "gallery item"}`}>
              {isVideo(item) ? <video src={item.url} muted /> : <img src={item.url} alt={item.alt || ""} />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
