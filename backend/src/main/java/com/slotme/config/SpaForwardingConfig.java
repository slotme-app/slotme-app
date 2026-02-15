package com.slotme.config;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardingConfig {

    @GetMapping({
            "/login", "/register", "/password-reset",
            "/admin", "/admin/{path:.*}",
            "/master", "/master/{path:.*}",
            "/invite/{token}"
    })
    public String forwardToSpa() {
        return "forward:/app/index.html";
    }
}
