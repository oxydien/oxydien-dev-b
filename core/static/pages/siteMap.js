import { routeList } from "../../../base/keys/routes.js";

export function SiteMapXml(req, res) {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlSetOpenTag =
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlSetCloseTag = "</urlset>";
  const urlTags = routeList
    .map((route) => {
      const urlOpenTag = "<url>";
      const urlCloseTag = "</url>";
      const locTag = `<loc>${route.path}</loc>`;
      return urlOpenTag + locTag + urlCloseTag;
    })
    .join("");

  const sitemapXml = xmlHeader + urlSetOpenTag + urlTags + urlSetCloseTag;
  res.setHeader("Content-Type", "text/xml");
  res.status(200).send(sitemapXml);
}
