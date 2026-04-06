import axios from "axios";
import * as cheerio from "cheerio";

import { isValidUrl } from "@/lib/utils";

export interface ScrapedPage {
  title: string;
  description: string;
  content: string;
  url: string;
}

export async function scrapePage(url: string): Promise<ScrapedPage> {
  if (!isValidUrl(url)) {
    return {
      title: "",
      description: "",
      content: "",
      url,
    };
  }

  try {
    const response = await axios.get<string>(url, {
      timeout: 5000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
      },
      responseType: "text",
    });

    const $ = cheerio.load(response.data);
    $("script, style, nav, footer, noscript, iframe, form, aside, .ads, .advertisement").remove();

    const title = $("title").first().text().trim();
    const description =
      $('meta[name="description"]').attr("content")?.trim() ||
      $('meta[property="og:description"]').attr("content")?.trim() ||
      "";

    const content = $("main, article, body")
      .first()
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 8000);

    return {
      title,
      description,
      content,
      url,
    };
  } catch {
    return {
      title: "",
      description: "",
      content: "",
      url,
    };
  }
}
