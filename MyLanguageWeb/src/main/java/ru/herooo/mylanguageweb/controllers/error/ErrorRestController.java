package ru.herooo.mylanguageweb.controllers.error;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;

@RestControllerAdvice(annotations = RestController.class)
@Order(1)
public class ErrorRestController {
    private final Environment ENVIRONMENT;

    @Autowired
    public ErrorRestController(Environment environment) {
        this.ENVIRONMENT = environment;
    }

    // Ошибка превышения максимального размера файла
    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<?> catchErrorResponseException(MaxUploadSizeExceededException e) {
        HttpStatusCode statusCode = e.getStatusCode();

        String maxSize = ENVIRONMENT.getProperty("spring.servlet.multipart.max-file-size");
        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(statusCode.value(),
                String.format("Максимальный размер файлов, разрешенный на сервере - %s", maxSize));

        return new ResponseEntity<>(message, statusCode);
    }

    // Остальные ошибки
    @ExceptionHandler(Throwable.class)
    public ResponseEntity<?> catchThrowable(Throwable e) {
        HttpStatusCode statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        String messageStr = e.getMessage();
        String strForFindIndexOf = ":";
        int colonIndex = messageStr.indexOf(strForFindIndexOf);
        if (colonIndex != -1) {
            messageStr = messageStr.substring(0, colonIndex);
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(statusCode.value(), messageStr);
        return new ResponseEntity<>(message, statusCode);
    }
}
