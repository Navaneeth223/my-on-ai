import axios from "axios";
import * as cheerio from "cheerio";

import { scrapePage } from "@/lib/scraper";
import type { SearchResult } from "@/types";

const TIMEOUT = 5000;

export async function searchWeb(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    return [];
  }

  try {
    const [instantAnswer, htmlSearch] = await Promise.allSettled([
      axios.get("https://api.duckduckgo.com/", {
        params: {
          q: query,
          format: "json",
          no_html: 1,
          skip_disambig: 1,
        },
        timeout: TIMEOUT,
      }),
      axios.get<string>("https://duckduckgo.com/html/", {
        params: { q: query },
        timeout: TIMEOUT,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        },
        responseType: "text",
      }),
    ]);

    const results: SearchResult[] = [];

    if (instantAnswer.status === "fulfilled") {
      const data = instantAnswer.value.data as {
        AbstractText?: string;
        AbstractURL?: string;
        Heading?: string;
      };

      if (data.AbstractText && data.AbstractURL) {
        const scraped = await scrapePage(data.AbstractURL);
        results.push({
          title: data.Heading || "Instant Answer",
          url: data.AbstractURL,
          snippet: data.AbstractText,
          content: scraped.content,
        });
      }
    }

    if (htmlSearch.status === "fulfilled") {
      const $ = cheerio.load(htmlSearch.value.data);
      const organic = $(".result")
        .slice(0, 3)
        .map((_, element) => {
          const title = $(element).find(".result__title").text().trim();
          const snippet = $(element).find(".result__snippet").text().trim();
          const url =
            $(element).find(".result__url").attr("href") ||
            $(element).find(".result__title a").attr("href") ||
            "";

          return { title, snippet, url };
        })
        .get()
        .filter((item) => item.url.startsWith("http"));

      const scrapedPages = await Promise.all(
        organic.map(async (result) => {
          const scraped = await scrapePage(result.url);
          return {
            title: result.title || scraped.title,
            url: result.url,
            snippet: result.snippet || scraped.description,
            content: scraped.content,
          } satisfies SearchResult;
        }),
      );

      for (const result of scrapedPages) {
        if (!results.some((existing) => existing.url === result.url)) {
          results.push(result);
        }
      }
    }

    return results.slice(0, 3);
  } catch {
    return [];
  }
}
