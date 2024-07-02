package ru.herooo.mylanguageweb.controllers.error;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.resource.NoResourceFoundException;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.controllers.common.ControllerUtils;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;

@ControllerAdvice
public class ErrorController {
    private final String ERROR_CODE_ATTRIBUTE_NAME = "ERROR_CODE";
    private final String ERROR_MESSAGE_ATTRIBUTE_NAME = "ERROR_MESSAGE";

    private final ControllerUtils CONTROLLER_UTILS;
    private final StringUtils STRING_UTILS;

    @Autowired
    private ErrorController(ControllerUtils controllerUtils,
                            StringUtils stringUtils) {
        this.CONTROLLER_UTILS = controllerUtils;
        this.STRING_UTILS = stringUtils;
    }

    // Страница не найдена
    @ExceptionHandler(NoResourceFoundException.class)
    public String catchNoResourceFoundException(HttpServletRequest request,
                                                HttpServletResponse response,
                                                NoResourceFoundException exception) {
        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(
                exception.getStatusCode().value(), exception.getMessage());
        return showErrorPage(request, response, message);
    }

    // Ошибка преобразования типов
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public String catchMethodArgumentTypeMismatchException(HttpServletRequest request,
                                                           HttpServletResponse response,
                                                           MethodArgumentTypeMismatchException exception) {
        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(404, exception.getMessage());
        return showErrorPage(request, response, message);
    }

    // Ошибка, вызванная конструкцией throw new ResponseStatusException(HttpStatusCode)
    @ExceptionHandler(ResponseStatusException.class)
    public String catchResponseStatusException(HttpServletRequest request,
                                               HttpServletResponse response,
                                               ResponseStatusException exception) {
        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(
                exception.getStatusCode().value(), exception.getMessage());
        return showErrorPage(request, response, message);
    }

    // Остальные ошибки
    @ExceptionHandler(Throwable.class)
    public String catchThrowable(HttpServletRequest request,
                                 HttpServletResponse response,
                                 Throwable exception) {
        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(600, exception.getMessage());
        return showErrorPage(request, response, message);
    }

    private String showErrorPage(HttpServletRequest request,
                                 HttpServletResponse response,
                                 ResponseMessageResponseDTO message) {
        // Получаем код ошибки
        int errorCode = message.getId();
        if (errorCode <= 0) {
            errorCode = 500;
        }

        // Генерируем более понятное сообщение об ошибке
        String errorText = message.getMessage();
        switch (errorCode) {
            case 404 -> errorText = "Страница не найдена";
        }

        // Если сообщение пустое, ошибка неизвестная
        if (STRING_UTILS.isStringVoid(errorText)) {
            errorText = "Неизвестная ошибка";
        }

        CONTROLLER_UTILS.setGeneralAttributes(request);
        request.setAttribute(ERROR_CODE_ATTRIBUTE_NAME, errorCode);
        request.setAttribute(ERROR_MESSAGE_ATTRIBUTE_NAME, errorText);
        response.setStatus(errorCode);

        return "error";
    }
}
