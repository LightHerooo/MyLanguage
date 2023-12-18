package ru.herooo.mylanguageweb.controllers.error;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import ru.herooo.mylanguageweb.global.GlobalAttributes;
import ru.herooo.mylanguageweb.services.CustomerService;

@ControllerAdvice
public class ErrorViewAdvice {

    private final GlobalAttributes WEB_APP_NAME_GLOBAL_ATTRIBUTE = GlobalAttributes.WEB_APP_NAME;
    private final GlobalAttributes AUTH_CUSTOMER_GLOBAL_ATTRIBUTE = GlobalAttributes.AUTH_CUSTOMER;

    private final String ERROR_CODE_ATTRIBUTE_NAME = "ERROR_CODE";
    private final String ERROR_MESSAGE_ATTRIBUTE_NAME = "ERROR_MESSAGE";

    private final CustomerService CUSTOMER_SERVICE;

    @Autowired
    private ErrorViewAdvice(CustomerService customerService) {
        this.CUSTOMER_SERVICE = customerService;
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public String catchNoResourceFoundException(HttpServletRequest request, NoResourceFoundException exception) {
        int statusCode = exception.getStatusCode().value();
        String message = exception.getMessage();
        return showErrorPage(request, statusCode, message);
    }

    @ExceptionHandler(ErrorResponseException.class)
    public String catchErrorResponseException(HttpServletRequest request, ErrorResponseException exception) {
        int statusCode = exception.getStatusCode().value();
        String message = exception.getMessage();
        return showErrorPage(request, statusCode, message);
    }

    @ExceptionHandler(Throwable.class)
    public String catchThrowableException(HttpServletRequest request, Throwable exception) {
        int statusCode = 500;
        return showErrorPage(request, statusCode, null);
    }

    private String showErrorPage(HttpServletRequest request, int statusCode, String message) {
        switch (statusCode) {
            case 400 -> message = "Некорректный запрос.";
            case 404 -> message = "Страница не найдена.";
            case 500 -> message = "Ошибка на стороне сервера.";
        }

        if (message == null) message = "Неизвестная ошибка";

        request.setAttribute(WEB_APP_NAME_GLOBAL_ATTRIBUTE.ATTRIBUTE_NAME, WEB_APP_NAME_GLOBAL_ATTRIBUTE.ATTRIBUTE_VALUE);
        request.setAttribute(AUTH_CUSTOMER_GLOBAL_ATTRIBUTE.ATTRIBUTE_NAME, CUSTOMER_SERVICE.findAuth(request));
        request.setAttribute(ERROR_CODE_ATTRIBUTE_NAME, statusCode);
        request.setAttribute(ERROR_MESSAGE_ATTRIBUTE_NAME, message);

        return "error";
    }
}
