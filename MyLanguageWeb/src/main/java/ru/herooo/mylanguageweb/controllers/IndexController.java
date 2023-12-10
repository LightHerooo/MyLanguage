package ru.herooo.mylanguageweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class IndexController {
    private String webAppName;

    @Autowired
    public IndexController(
            @Qualifier("webAppName") String webAppName) {
        this.webAppName = webAppName;
    }

    @GetMapping()
    public String show(Model model) {
        model.addAttribute("webAppName", webAppName);
        return "index";
    }
}
