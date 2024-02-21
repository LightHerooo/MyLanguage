package ru.herooo.mylanguageweb.controllers.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;

@ControllerAdvice(basePackages = "ru.herooo.mylanguageweb.controllers.rest")
public class ErrorAPIAdvice {
    @ExceptionHandler(Throwable.class)
    public ResponseEntity<CustomResponseMessage> catchAPIExceptions(Throwable e) {
        CustomResponseMessage message = new CustomResponseMessage(600, e.getMessage());
        return new ResponseEntity<>(message, HttpStatus.BAD_REQUEST);
    }
}
