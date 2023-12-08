package ru.herooo.mylanguageweb.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;

@Controller
public class IndexController {
    private String appName;

    @Autowired
    public IndexController(@Qualifier("appName") String appName) {
        this.appName = appName;
    }

    @GetMapping()
    public String show() {
        return "index";
    }

    @ModelAttribute("appName")
    public String getAppName() {
        return appName;
    }
}
