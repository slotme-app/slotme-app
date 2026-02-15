package com.slotme.marketing.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SitemapController {

    @Value("${app.base-url:https://slotme.ai}")
    private String baseUrl;

    @GetMapping(value = "/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap() {
        String xml = """
                <?xml version="1.0" encoding="UTF-8"?>
                <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                        xmlns:xhtml="http://www.w3.org/1999/xhtml">
                  <url>
                    <loc>%1$s/</loc>
                    <xhtml:link rel="alternate" hreflang="en" href="%1$s/" />
                    <xhtml:link rel="alternate" hreflang="ru" href="%1$s/ru" />
                    <xhtml:link rel="alternate" hreflang="pl" href="%1$s/pl" />
                    <changefreq>weekly</changefreq>
                    <priority>1.0</priority>
                  </url>
                  <url>
                    <loc>%1$s/ru</loc>
                    <xhtml:link rel="alternate" hreflang="en" href="%1$s/" />
                    <xhtml:link rel="alternate" hreflang="ru" href="%1$s/ru" />
                    <xhtml:link rel="alternate" hreflang="pl" href="%1$s/pl" />
                    <changefreq>weekly</changefreq>
                    <priority>0.9</priority>
                  </url>
                  <url>
                    <loc>%1$s/pl</loc>
                    <xhtml:link rel="alternate" hreflang="en" href="%1$s/" />
                    <xhtml:link rel="alternate" hreflang="ru" href="%1$s/ru" />
                    <xhtml:link rel="alternate" hreflang="pl" href="%1$s/pl" />
                    <changefreq>weekly</changefreq>
                    <priority>0.9</priority>
                  </url>
                </urlset>
                """.formatted(baseUrl);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_XML)
                .body(xml);
    }
}
