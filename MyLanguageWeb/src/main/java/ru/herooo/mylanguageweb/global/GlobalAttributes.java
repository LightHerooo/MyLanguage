package ru.herooo.mylanguageweb.global;

import org.springframework.ui.Model;

public enum GlobalAttributes {
    WEB_APP_NAME("WEB_APP_NAME", "MyLanguage"),
    AUTH_CUSTOMER("AUTH_CUSTOMER", null),
    ;

    public final String ATTRIBUTE_NAME;
    public final Object ATTRIBUTE_VALUE;

    GlobalAttributes(String attributeName, Object attributeValue) {
        this.ATTRIBUTE_NAME = attributeName;
        this.ATTRIBUTE_VALUE = attributeValue;
    }

    public static void addAttributeInModel(Model model, GlobalAttributes globalAttribute) {
        model.addAttribute(globalAttribute.ATTRIBUTE_NAME, globalAttribute.ATTRIBUTE_VALUE);
    }
}
