package ru.herooo.mylanguageweb.controllers.error;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.ErrorResponseException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import ru.herooo.mylanguageweb.controllers.ControllerUtils;
import ru.herooo.mylanguageweb.services.CustomerService;

@ControllerAdvice
public class ErrorViewAdvice {
    private final String ERROR_CODE_ATTRIBUTE_NAME = "ERROR_CODE";
    private final String ERROR_MESSAGE_ATTRIBUTE_NAME = "ERROR_MESSAGE";

    private final ControllerUtils CONTROLLER_UTILS;

    @Autowired
    private ErrorViewAdvice(ControllerUtils controllerUtils) {
        this.CONTROLLER_UTILS = controllerUtils;
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

        CONTROLLER_UTILS.setGeneralAttributes(request);
        request.setAttribute(ERROR_CODE_ATTRIBUTE_NAME, statusCode);
        request.setAttribute(ERROR_MESSAGE_ATTRIBUTE_NAME, message);

        return "error";
    }
}
