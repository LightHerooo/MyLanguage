package ru.herooo.mylanguageweb.controllers;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/all_words")
public class AllWordsController {

    private String appName;

    public AllWordsController(@Qualifier("appName") String appName) {
        this.appName = appName;
    }

    @GetMapping()
    public String show() {
        return "all_words";
    }

    @ModelAttribute("appName")
    private String getAppName() {
        return appName;
    }
}
