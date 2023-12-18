package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.global.GlobalAttributes;
import ru.herooo.mylanguageweb.services.CustomerService;

@Controller
@RequestMapping("/words")
public class WordsController {

    private final CustomerService CUSTOMER_SERVICE;

    @Autowired
    public WordsController(CustomerService customerService)
    {
        this.CUSTOMER_SERVICE = customerService;
    }

    @GetMapping
    public String showWordsPage(HttpServletRequest request, Model model) {
        GlobalAttributes.addAttributeInModel(model, GlobalAttributes.WEB_APP_NAME);
        model.addAttribute(GlobalAttributes.AUTH_CUSTOMER.ATTRIBUTE_NAME, CUSTOMER_SERVICE.findAuth(request));

        return Views.WORDS_SHOW.PATH_TO_FILE;
    }

    @GetMapping("/customer")
    public String showCustomerWordsPage(HttpServletRequest request, Model model) {
        GlobalAttributes.addAttributeInModel(model, GlobalAttributes.WEB_APP_NAME);
        model.addAttribute(GlobalAttributes.AUTH_CUSTOMER.ATTRIBUTE_NAME, CUSTOMER_SERVICE.findAuth(request));

        return null;
    }
}
