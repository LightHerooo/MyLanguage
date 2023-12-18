package ru.herooo.mylanguageweb.controllers;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import ru.herooo.mylanguageweb.controllers.move.Views;
import ru.herooo.mylanguageweb.global.GlobalAttributes;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;
import ru.herooo.mylanguageweb.services.WordService;

@Controller
public class IndexController {

    private final String NUMBER_OF_WORDS_ATTRIBUTE_NAME = "NUMBER_OF_WORDS";
    private final String NUMBER_OF_LANGS_ATTRIBUTE_NAME = "NUMBER_OF_LANGS";

    private final CustomerService CUSTOMER_SERVICE;
    private final WordService WORD_SERVICE;
    private final LangService LANG_SERVICE;

    @Autowired
    public IndexController(CustomerService customerService, WordService wordService, LangService langService)
    {
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_SERVICE = wordService;
        this.LANG_SERVICE = langService;
    }

    @GetMapping()
    public String showIndexPage(HttpServletRequest request, Model model) {
        // Добавляем в аттрибуты название сайта
        GlobalAttributes.addAttributeInModel(model, GlobalAttributes.WEB_APP_NAME);

        // Добавляем авторизированного пользователя
        model.addAttribute(GlobalAttributes.AUTH_CUSTOMER.ATTRIBUTE_NAME, CUSTOMER_SERVICE.findAuth(request));
        model.addAttribute(NUMBER_OF_WORDS_ATTRIBUTE_NAME, WORD_SERVICE.getNumberOfWords());
        model.addAttribute(NUMBER_OF_LANGS_ATTRIBUTE_NAME, LANG_SERVICE.getNumberOfLangs());

        return Views.INDEX.PATH_TO_FILE;
    }
}
