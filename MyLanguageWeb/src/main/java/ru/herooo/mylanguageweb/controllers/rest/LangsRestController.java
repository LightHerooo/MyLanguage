package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguageutils.http.HttpJsonResponse;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryError;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangs;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangsUtils;
import ru.herooo.mylanguageweb.dto.other.request.entity.EntityAuthKeyRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.edit.b.EntityEditBooleanByCodeRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.other.YandexDictionaryLangsResponseDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/langs")
public class LangsRestController {
    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;

    private final LangService LANG_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;

    private final LangMapping LANG_MAPPING;
    private final YandexLangsUtils YANDEX_LANGS_UTILS;

    @Autowired
    public LangsRestController(CustomersRestController customersRestController,

                               LangService langService,
                               CustomerService customerService,

                               LangMapping langMapping,
                               YandexLangsUtils yandexLangsUtils) {
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;

        this.LANG_SERVICE = langService;
        this.CUSTOMER_SERVICE = customerService;

        this.LANG_MAPPING = langMapping;
        this.YANDEX_LANGS_UTILS = yandexLangsUtils;
    }
    @GetMapping("/get")
    public ResponseEntity<?> getAll(@RequestParam(value = "title", required = false) String title,
                                    @RequestParam(value = "is_active_for_in", required = false) Boolean isActiveForIn,
                                    @RequestParam(value = "is_active_for_out", required = false) Boolean isActiveForOut,
                                    @RequestParam(value = "number_of_items", required = false, defaultValue = "0")
                                        Long numberOfItems,
                                    @RequestParam(value = "last_lang_id_on_previous_page", required = false, defaultValue = "0")
                                        Long lastLangIdOnPreviousPage) {
        if (numberOfItems == null || numberOfItems < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(1, "Количество записей не должно быть отрицательным.");
            return ResponseEntity.badRequest().body(message);
        }


        if (lastLangIdOnPreviousPage == null || lastLangIdOnPreviousPage < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(2,
                            "ID последнего языка на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0.");
            return ResponseEntity.badRequest().body(message);
        }

        List<Lang> langs = LANG_SERVICE.findAll(title, isActiveForIn, isActiveForOut, numberOfItems, lastLangIdOnPreviousPage);
        if (langs != null && langs.size() > 0) {
            List<LangResponseDTO> responseDTOs = langs.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Языки по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/get/for_in")
    public ResponseEntity<?> getAllForIn() {
        List<Lang> langs = LANG_SERVICE.findAllForIn(true);
        if (langs != null && langs.size() > 0) {
            List<LangResponseDTO> responseDTOs = langs.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Активных входящих языков не найдено.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/get/for_out")
    public ResponseEntity<?> getAllForOut() {
        List<Lang> langs = LANG_SERVICE.findAllForOut(true);
        if (langs != null && langs.size() > 0) {
            List<LangResponseDTO> responseDTOs = langs.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Активных выходящих языков не найдено.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/get/for_in/by_lang_out_code")
    public ResponseEntity<?> getAllForInByLangOutCode(@RequestParam("lang_out_code") String langOutCode) {
        ResponseEntity<?> response = validateIsActiveForOut(langOutCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = tryToCreateYandexLangs();
        if (response.getBody() instanceof YandexLangs yandexLangs) {
            List<Lang> langs = LANG_SERVICE.findAllForIn(true);

            Lang langOut = LANG_SERVICE.find(langOutCode);
            List<String> langInCodes = yandexLangs.getLangInCodes(langOut.getCode());

            List<Lang> result = new ArrayList<>();
            for (Lang lang: langs) {
                for (String langInCode: langInCodes) {
                    if (lang.getCode().equals(langInCode)) {
                        result.add(lang);
                        break;
                    }
                }
            }

            List<LangResponseDTO> responseDTOs = result.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Неизвестная ошибка обращения к Yandex.API.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/get/for_out/by_lang_in_code")
    public ResponseEntity<?> getAllForOutByLangInCode(@RequestParam("lang_in_code") String langInCode) {
        ResponseEntity<?> response = validateIsActiveForIn(langInCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = tryToCreateYandexLangs();
        if (response.getBody() instanceof YandexLangs yandexLangs) {
            List<Lang> langs = LANG_SERVICE.findAllForOut(true);

            Lang langIn = LANG_SERVICE.find(langInCode);
            List<String> langOutCodes = yandexLangs
                    .getLangOutCodes(langIn.getCode());

            List<Lang> result = new ArrayList<>();
            for (Lang lang: langs) {
                for (String langOutCode: langOutCodes) {
                    if (lang.getCode().equals(langOutCode)) {
                        result.add(lang);
                        break;
                    }
                }
            }

            List<LangResponseDTO> responseDTOs = result.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Неизвестная ошибка обращения к Yandex.API.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/yandex_dictionary_langs")
    public ResponseEntity<?> getYandexLangs() {
        ResponseEntity<?> response = tryToCreateYandexLangs();
        if (response.getBody() instanceof YandexLangs yandexLangs) {
            YandexDictionaryLangsResponseDTO dto = new YandexDictionaryLangsResponseDTO();
            String[] langCodeCouples = yandexLangs.getLangCodeCouples();
            if (langCodeCouples != null && langCodeCouples.length > 0) {
                dto.setLangCodeCouples(langCodeCouples);
            }

            List<String> langCodes = yandexLangs.getLangCodes();
            if (langCodes != null && langCodes.size() > 0) {
                dto.setLangCodes(langCodes.toArray(new String[0]));
            }

            List<String> langInCodes = yandexLangs.getLangInCodes();
            if (langInCodes != null && langInCodes.size() > 0) {
                dto.setLangInCodes(langInCodes.toArray(new String[0]));
            }

            List<String> langOutCodes = yandexLangs.getLangOutCodes();
            if (langOutCodes != null && langOutCodes.size() > 0) {
                dto.setLangOutCodes(langOutCodes.toArray(new String[0]));
            }

            return ResponseEntity.ok(dto);
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Не удалось получить языки Yandex.Dictionary.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> find(@RequestParam("code") String code) {
        Lang lang = LANG_SERVICE.find(code);
        if (lang != null) {
            LangResponseDTO dto = LANG_MAPPING.mapToResponseDTO(lang);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Язык с кодом '%s' не найден.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/before_update")
    public ResponseEntity<?> validateBeforeUpdate(HttpServletRequest request,
                                                  @RequestBody EntityEditBooleanByCodeRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        // Проверяем авторизированного пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(dto.getAuthKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        // Ищем язык
        response = find(dto.getCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Данные для изменения языка корректны.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/is_active_for_in")
    public ResponseEntity<?> validateIsActiveForIn(@RequestParam("code") String code) {
        ResponseEntity<?> response = find(code);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Lang lang = LANG_SERVICE.find(code);
        if (lang.isActiveForIn()) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Язык доступен (входящий).");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Язык недоступен (входящий).");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/is_active_for_out")
    public ResponseEntity<?> validateIsActiveForOut(@RequestParam("code") String code) {
        ResponseEntity<?> response = find(code);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Lang lang = LANG_SERVICE.find(code);
        if (lang.isActiveForOut()) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Язык доступен (выходящий).");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Язык недоступен (выходящий).");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/couple_of_languages")
    public ResponseEntity<?> validateCoupleOfLanguages(@RequestParam("lang_in_code") String langInCode,
                                                       @RequestParam("lang_out_code") String langOutCode) {
        ResponseEntity<?> response = validateIsActiveForIn(langInCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = validateIsActiveForOut(langOutCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Языки не должны повторяться ---
        if (langInCode.equals(langOutCode)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Языки не должны повторяться.");
            return ResponseEntity.badRequest().body(message);
        }
        //---

        Lang langIn = LANG_SERVICE.find(langInCode);
        Lang langOut = LANG_SERVICE.find(langOutCode);
        response = tryToCreateYandexLangs();
        if (response.getBody() instanceof YandexLangs yandexLangs) {
            boolean isCorrect = yandexLangs.checkLangCoupleSupport(
                    langIn.getCode(), langOut.getCode());
            if (isCorrect) {
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                        String.format("Пара языков '%s' - '%s' поддерживается.",
                                langIn.getTitle(), langOut.getTitle()));
                return ResponseEntity.ok(message);
            } else {
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                        String.format("Пара языков '%s' - '%s' не поддерживается.",
                                langIn.getTitle(), langOut.getTitle()));
                return ResponseEntity.badRequest().body(message);
            }
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(3, "Неизвестная ошибка обращения к Yandex.API.");
            return ResponseEntity.badRequest().body(message);
        }
    }



    @PatchMapping("/edit/is_active_for_in")
    public ResponseEntity<?> editIsActiveForIn(HttpServletRequest request,
                                               @RequestBody EntityEditBooleanByCodeRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeUpdate(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Lang lang = LANG_SERVICE.find(dto.getCode());
        lang = LANG_SERVICE.editIsActiveForIn(lang, dto.getValue());
        if (lang != null) {
            LangResponseDTO responseDTO = LANG_MAPPING.mapToResponseDTO(lang);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Не удалось изменить активность на вход у языка с кодом '%s'.", dto.getCode()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/edit/is_active_for_out")
    public ResponseEntity<?> changeActivityForOut(HttpServletRequest request,
                                                  @RequestBody EntityEditBooleanByCodeRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeUpdate(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Lang lang = LANG_SERVICE.find(dto.getCode());
        lang = LANG_SERVICE.editIsActiveForOut(lang, dto.getValue());
        if (lang != null) {
            LangResponseDTO responseDTO = LANG_MAPPING.mapToResponseDTO(lang);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Не удалось изменить активность на выход у языка с кодом '%s'.", dto.getCode()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/turn_on/supported_langs_in")
    public ResponseEntity<?> turnOnSupportedLangsIn(HttpServletRequest request,
                                                    @RequestBody EntityAuthKeyRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        response = tryToCreateYandexLangs();
        if (response.getBody() instanceof YandexLangs yandexLangs) {
            List<Lang> langs = LANG_SERVICE.findAll();
            List<String> langInCodes = yandexLangs.getLangInCodes();
            for (Lang lang: langs) {
                for (String langInCode: langInCodes) {
                    if (lang.getCode().equals(langInCode)) {
                        LANG_SERVICE.editIsActiveForIn(lang, true);
                        break;
                    }
                }
            }

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Входящие поддерживаемые языки успешно включены.");
            return ResponseEntity.ok(message);
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Не удалось получить языки Yandex.Dictionary.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/turn_on/supported_langs_out")
    public ResponseEntity<?> turnOnSupportedLangsOut(HttpServletRequest request,
                                                     @RequestBody EntityAuthKeyRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        response = tryToCreateYandexLangs();
        if (response.getBody() instanceof YandexLangs yandexLangs) {
            List<Lang> langs = LANG_SERVICE.findAll();
            List<String> langOutCodes = yandexLangs.getLangOutCodes();
            for (Lang lang: langs) {
                for (String langOutCode: langOutCodes) {
                    if (lang.getCode().equals(langOutCode)) {
                        LANG_SERVICE.editIsActiveForOut(lang, true);
                        break;
                    }
                }
            }

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Выходящие поддерживаемые языки успешно включены.");
            return ResponseEntity.ok(message);
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Не удалось получить языки Yandex.Dictionary.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/turn_off/unsupported_langs_in")
    public ResponseEntity<?> turnOffUnsupportedLangsIn(HttpServletRequest request,
                                                       @RequestBody EntityAuthKeyRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        response = tryToCreateYandexLangs();
        if (response.getBody() instanceof YandexLangs yandexLangs) {
            List<Lang> langs = LANG_SERVICE.findAll();
            List<String> langInCodes = yandexLangs.getLangInCodes();
            for (Lang lang: langs) {
                boolean isNotSupported = true;
                for (String langInCode: langInCodes) {
                    if (lang.getCode().equals(langInCode)) {
                        isNotSupported = false;
                        break;
                    }
                }

                if (isNotSupported) {
                    LANG_SERVICE.editIsActiveForIn(lang, false);
                }
            }

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Входящие неподдерживаемые языки успешно отключены.");
            return ResponseEntity.ok(message);
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Не удалось получить языки Yandex.Dictionary.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/turn_off/unsupported_langs_out")
    public ResponseEntity<?> turnOffUnsupportedLangsOut(HttpServletRequest request,
                                                        @RequestBody EntityAuthKeyRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        response = tryToCreateYandexLangs();
        if (response.getBody() instanceof YandexLangs yandexLangs) {
            List<Lang> langs = LANG_SERVICE.findAll();
            List<String> langsForOut = yandexLangs.getLangOutCodes();
            for (Lang lang: langs) {
                boolean isNotSupported = true;
                for (String langForOut: langsForOut) {
                    if (lang.getCode().equals(langForOut)) {
                        isNotSupported = false;
                        break;
                    }
                }

                if (isNotSupported) {
                    LANG_SERVICE.editIsActiveForOut(lang, false);
                }
            }

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Выходящие неподдерживаемые языки успешно отключены.");
            return ResponseEntity.ok(message);
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Не удалось получить языки Yandex.Dictionary.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/turn_off/langs_in")
    public ResponseEntity<?> turnOffLangsIn(HttpServletRequest request,
                                            @RequestBody EntityAuthKeyRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        LANG_SERVICE.turnOffLangsIn();

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Входящие языки успешно отключены.");
        return ResponseEntity.ok(message);
    }

    @PatchMapping("/turn_off/langs_out")
    public ResponseEntity<?> turnOffLangsOut(HttpServletRequest request,
                                             @RequestBody EntityAuthKeyRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        LANG_SERVICE.turnOffLangsOut();

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Выходящие языки успешно отключены.");
        return ResponseEntity.ok(message);
    }



    public ResponseEntity<?> tryToCreateYandexLangs() {
        HttpJsonResponse httpJsonResponse = YANDEX_LANGS_UTILS.createHttpJsonResponse();
        if (httpJsonResponse != null) {
            if (httpJsonResponse.getCode() == HttpStatus.OK.value()) {
                YandexLangs yandexLangs = YANDEX_LANGS_UTILS.createYandexLangs(httpJsonResponse);
                if (yandexLangs != null) {
                    return ResponseEntity.ok(yandexLangs);
                } else {
                    ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                            "Не удалось получить результат обращения к Yandex.API.");
                    return ResponseEntity.badRequest().body(message);
                }
            } else {
                YandexDictionaryError error = YANDEX_LANGS_UTILS.createYandexDictionaryError(httpJsonResponse);
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(error.getCode(), error.getMessage());
                return ResponseEntity.badRequest().body(message);
            }
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2, "Не удалось обратиться к Yandex.API.");
            return ResponseEntity.badRequest().body(message);
        }
    }
}
