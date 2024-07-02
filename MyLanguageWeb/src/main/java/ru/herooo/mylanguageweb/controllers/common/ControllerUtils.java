package ru.herooo.mylanguageweb.controllers.common;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguageutils.file.MimeTypeWithSize;
import ru.herooo.mylanguageutils.file.filesize.FileSize;
import ru.herooo.mylanguageutils.file.mimetype.FileMimeTypes;
import ru.herooo.mylanguageutils.file.mimetype.ImageMimeTypes;
import ru.herooo.mylanguageutils.file.mimetype.MimeType;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.customer.response.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerService;

@Component
public class ControllerUtils {
    private final String WEB_APP_NAME_ATTRIBUTE_NAME = "WEB_APP_NAME";
    private final String AUTH_CUSTOMER_ATTRIBUTE_NAME = "AUTH_CUSTOMER";
    private final String IS_SUPER_USER_ATTRIBUTE_NAME = "IS_SUPER_USER";
    private final String IS_ADMIN_ATTRIBUTE_NAME = "IS_ADMIN";
    private final String IS_MODERATOR_ATTRIBUTE_NAME = "IS_MODERATOR";

    private final CustomerService CUSTOMER_SERVICE;
    private final CustomerMapping CUSTOMER_MAPPING;

    @Autowired
    public ControllerUtils(CustomerService customerService,
                           CustomerMapping customerMapping) {
        this.CUSTOMER_SERVICE = customerService;
        this.CUSTOMER_MAPPING = customerMapping;
    }

    public void setGeneralAttributes(HttpServletRequest request) {
        // Название сайта
        request.setAttribute(WEB_APP_NAME_ATTRIBUTE_NAME, "MyLanguage");

        // Авторизированный пользователь
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            CustomerResponseDTO responseDTO = CUSTOMER_MAPPING.mapToResponseDTO(authCustomer);
            request.setAttribute(AUTH_CUSTOMER_ATTRIBUTE_NAME, responseDTO);
        }

        // Пользователь - супер-юзер?
        request.setAttribute(IS_SUPER_USER_ATTRIBUTE_NAME, CUSTOMER_SERVICE.isSuperUser(authCustomer));

        // Пользователь - администратор?
        request.setAttribute(IS_ADMIN_ATTRIBUTE_NAME, CUSTOMER_SERVICE.isAdmin(authCustomer));

        // Пользователь - модератор?
        request.setAttribute(IS_MODERATOR_ATTRIBUTE_NAME, CUSTOMER_SERVICE.isModerator(authCustomer));
    }

    public ResponseEntity<?> checkMultipartFile(MultipartFile multipartFile, MimeTypeWithSize[] acceptedMimeTypesWithSize) {
        if (multipartFile == null || multipartFile.isEmpty()) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Файл пуст.");
            return ResponseEntity.badRequest().body(message);
        }

        if (acceptedMimeTypesWithSize == null || acceptedMimeTypesWithSize.length == 0) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2, "Массив разрешенных MIME-типов пуст.");
            return ResponseEntity.badRequest().body(message);
        }

        // Получаем важные данные из выбранного файла
        String contentType = multipartFile.getContentType();
        long size = multipartFile.getSize();

        // Проверяем, нет ли в массиве разрешенных MIME-типов общего MIME-типа
        boolean isMimeTypeALL = false;
        for (MimeTypeWithSize mimeTypeWithSize: acceptedMimeTypesWithSize) {
            MimeType mimeType = mimeTypeWithSize.getMimeType();
            if (mimeType.getTitle().equals(FileMimeTypes.ALL.MIME_TYPE.getTitle())) {
                isMimeTypeALL = true;

                FileSize fileSize = mimeTypeWithSize.getFileSize();
                if (size > fileSize.getNumberOfBytes()) {
                    ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(3,
                            String.format("Размер файла не должен превышать %s.", fileSize.createSizeStr()));
                    return ResponseEntity.badRequest().body(message);
                }

                break;
            }
        }

        // Проверяем, нет ли в массиве разрешенных MIME-типов общего MIME-типа изображений
        if (!isMimeTypeALL) {
            for (MimeTypeWithSize mimeTypeWithSize: acceptedMimeTypesWithSize) {
                MimeType mimeType = mimeTypeWithSize.getMimeType();
                if (mimeType.getTitle().equals(ImageMimeTypes.ALL.MIME_TYPE.getTitle())) {
                    isMimeTypeALL = true;

                    FileSize fileSize = mimeTypeWithSize.getFileSize();
                    if (size > fileSize.getNumberOfBytes()) {
                        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(3,
                                String.format("Размер изображения не должен превышать %s.", fileSize.createSizeStr()));
                        return ResponseEntity.badRequest().body(message);
                    }

                    break;
                }
            }
        }

        // Если ни один общий MIME-тип не найден, ищем соответствие по формату файла
        if (!isMimeTypeALL) {
            boolean isFormatSupport = false;

            MimeType multipartFileMimeType = new MimeType(multipartFile.getContentType());
            for (MimeTypeWithSize mimeTypeWithSize: acceptedMimeTypesWithSize) {
                MimeType mimeType = mimeTypeWithSize.getMimeType();
                if (mimeType.getFormat().equals(multipartFileMimeType.getFormat())) {
                    isFormatSupport = true;

                    FileSize fileSize = mimeTypeWithSize.getFileSize();
                    if (size > fileSize.getNumberOfBytes()) {
                        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(4,
                                String.format("Размер файла формата %s не должен превышать %s.",
                                        multipartFileMimeType.createFormatStr(), fileSize.createSizeStr()));
                        return ResponseEntity.badRequest().body(message);
                    }

                    break;
                }
            }

            if (!isFormatSupport) {
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(5,
                        String.format("Файл формата %s не поддерживается.", multipartFileMimeType.createFormatStr()));
                return ResponseEntity.badRequest().body(message);
            }
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Файл успешно проверен.");
        return ResponseEntity.ok(message);
    }
}
