package com.slotme.marketing.controller;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.servlet.LocaleResolver;

import java.time.Year;
import java.util.Locale;

@Controller
public class MarketingController {

    private final LocaleResolver localeResolver;

    public MarketingController(LocaleResolver localeResolver) {
        this.localeResolver = localeResolver;
    }

    @GetMapping("/")
    public String landingDefault(Model model, HttpServletRequest request, HttpServletResponse response) {
        return renderLanding("en", model, request, response);
    }

    @GetMapping("/{lang:en|ru|pl}")
    public String landingWithLang(@PathVariable String lang, Model model, HttpServletRequest request, HttpServletResponse response) {
        return renderLanding(lang, model, request, response);
    }

    private String renderLanding(String lang, Model model, HttpServletRequest request, HttpServletResponse response) {
        Locale locale = Locale.forLanguageTag(lang);
        localeResolver.setLocale(request, response, locale);
        String baseUrl = request.getScheme() + "://" + request.getServerName()
                + (request.getServerPort() != 80 && request.getServerPort() != 443
                   ? ":" + request.getServerPort() : "");
        model.addAttribute("lang", lang);
        model.addAttribute("baseUrl", baseUrl);
        model.addAttribute("currentYear", String.valueOf(Year.now().getValue()));
        return "marketing/landing";
    }
}
