package com.slotme.marketing.controller;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.Year;

@Controller
public class MarketingController {

    @GetMapping("/")
    public String landingDefault(Model model, HttpServletRequest request) {
        return renderLanding("en", model, request);
    }

    @GetMapping("/{lang:en|ru|pl}")
    public String landingWithLang(@PathVariable String lang, Model model, HttpServletRequest request) {
        return renderLanding(lang, model, request);
    }

    private String renderLanding(String lang, Model model, HttpServletRequest request) {
        model.addAttribute("lang", lang);
        model.addAttribute("currentYear", Year.now().getValue());
        return "marketing/landing";
    }
}
