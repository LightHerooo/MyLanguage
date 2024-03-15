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
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangsResult;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangsUtils;
import ru.herooo.mylanguageweb.dto.entity.lang.LangRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.YandexDictionaryLangsResponseDTO;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;
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
    @GetMapping("/filtered")
    public ResponseEntity<?> getAll(@RequestParam(value = "title", required = false) String title) {
        List<Lang> langs = LANG_SERVICE.findAll(title);
        if (langs != null && langs.size() > 0) {
            List<LangResponseDTO> responseDTOs = langs.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Языки по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/for_in")
    public ResponseEntity<?> getAllForIn() {
        List<Lang> langs = LANG_SERVICE.findAllForIn(true);
        if (langs != null && langs.size() > 0) {
            List<LangResponseDTO> responseDTOs = langs.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Активных входящих языков не найдено.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/for_out")
    public ResponseEntity<?> getAllForOut() {
        List<Lang> langs = LANG_SERVICE.findAllForOut(true);
        if (langs != null && langs.size() > 0) {
            List<LangResponseDTO> responseDTOs = langs.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Активных выходящих языков не найдено.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/for_in_by_lang_out_code")
    public ResponseEntity<?> getAllForIn(@RequestParam("lang_out_code") String langOutCode) {
        ResponseEntity<?> response = validateIsActiveForOut(langOutCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult yandexLangsResult) {
            List<Lang> langs = LANG_SERVICE.findAllForIn(true);

            Lang langOut = LANG_SERVICE.find(langOutCode);
            List<String> yandexLangsIn = yandexLangsResult
                    .getLangsIn(langOut.getCode());

            List<Lang> result = new ArrayList<>();
            for (Lang lang: langs) {
                for (String langCode: yandexLangsIn) {
                    if (lang.getCode().equals(langCode)) {
                        result.add(lang);
                        break;
                    }
                }
            }

            List<LangResponseDTO> responseDTOs = result.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Неизвестная ошибка обращения к API.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/for_out_by_lang_in_code")
    public ResponseEntity<?> getAllForOut(@RequestParam("lang_in_code") String langInCode) {
        ResponseEntity<?> response = validateIsActiveForIn(langInCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult yandexLangsResult) {
            List<Lang> langs = LANG_SERVICE.findAllForOut(true);

            Lang langIn = LANG_SERVICE.find(langInCode);
            List<String> yandexLangsOut = yandexLangsResult
                    .getLangsOut(langIn.getCode());

            List<Lang> result = new ArrayList<>();
            for (Lang lang: langs) {
                for (String langCode: yandexLangsOut) {
                    if (lang.getCode().equals(langCode)) {
                        result.add(lang);
                        break;
                    }
                }
            }

            List<LangResponseDTO> responseDTOs = result.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Неизвестная ошибка обращения к API.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/yandex_dictionary_langs")
    public ResponseEntity<?> getYandexLangs() {
        ResponseEntity<?> response = tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult result) {
            YandexDictionaryLangsResponseDTO dto = new YandexDictionaryLangsResponseDTO();
            dto.setLangCouples(result.getLangs());
            dto.setAllLangs(result.getAllLangs().toArray(new String[0]));
            dto.setLangsIn(result.getLangsIn().toArray(new String[0]));
            dto.setLangsOut(result.getLangsOut().toArray(new String[0]));

            return ResponseEntity.ok(dto);
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Не удалось получить языки Yandex.Dictionary.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/change_activity_for_in")
    public ResponseEntity<?> changeActivityForIn(HttpServletRequest request, @RequestBody LangRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeUpdate(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Lang lang = LANG_SERVICE.find(dto.getCode());
        lang = LANG_SERVICE.changeActivityForIn(lang, dto.getIsActiveForIn());
        if (lang != null) {
            LangResponseDTO responseDTO = LANG_MAPPING.mapToResponseDTO(lang);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Не удалось изменить активность на вход у языка с кодом '%s'.", dto.getCode()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/change_activity_for_out")
    public ResponseEntity<?> changeActivityForOut(HttpServletRequest request, @RequestBody LangRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeUpdate(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Lang lang = LANG_SERVICE.find(dto.getCode());
        lang = LANG_SERVICE.changeActivityForOut(lang, dto.getIsActiveForOut());
        if (lang != null) {
            LangResponseDTO responseDTO = LANG_MAPPING.mapToResponseDTO(lang);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Не удалось изменить активность на выход у языка с кодом '%s'.", dto.getCode()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/on_langs_supported_for_in")
    public ResponseEntity<?> onLangsSupportedForIn(HttpServletRequest request,
                                                   @ModelAttribute("auth_code") String authCode) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, authCode);
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(validateAuthCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(validateAuthCode);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        response = tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult result) {
            List<Lang> langs = LANG_SERVICE.findAll(null);
            List<String> langsForIn = result.getLangsIn();
            for (Lang lang: langs) {
                for (String langForIn: langsForIn) {
                    if (lang.getCode().equals(langForIn)) {
                        LANG_SERVICE.changeActivityForIn(lang, true);
                        break;
                    }
                }
            }

            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Входные поддерживаемые языки успешно включены.");
            return ResponseEntity.ok(message);
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Не удалось получить языки Yandex.Dictionary.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/on_langs_supported_for_out")
    public ResponseEntity<?> onLangsSupportedForOut(HttpServletRequest request,
                                                    @ModelAttribute("auth_code") String authCode) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, authCode);
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(validateAuthCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(validateAuthCode);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        response = tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult result) {
            List<Lang> langs = LANG_SERVICE.findAll(null);
            List<String> langsForOut = result.getLangsOut();
            for (Lang lang: langs) {
                for (String langForOut: langsForOut) {
                    if (lang.getCode().equals(langForOut)) {
                        LANG_SERVICE.changeActivityForOut(lang, true);
                        break;
                    }
                }
            }

            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Выходные поддерживаемые языки успешно включены.");
            return ResponseEntity.ok(message);
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Не удалось получить языки Yandex.Dictionary.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/off_langs_doesnt_supported_for_in")
    public ResponseEntity<?> offLangsDoesntSupportedForIn(HttpServletRequest request,
                                                          @ModelAttribute("auth_code") String authCode) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, authCode);
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(validateAuthCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(validateAuthCode);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        response = tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult result) {
            List<Lang> langs = LANG_SERVICE.findAll(null);
            List<String> langsForIn = result.getLangsIn();
            for (Lang lang: langs) {
                boolean doesntSupported = true;
                for (String langForIn: langsForIn) {
                    if (lang.getCode().equals(langForIn)) {
                        doesntSupported = false;
                        break;
                    }
                }

                if (doesntSupported) {
                    LANG_SERVICE.changeActivityForIn(lang, false);
                }
            }

            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Входные неподдерживаемые языки успешно отключены.");
            return ResponseEntity.ok(message);
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Не удалось получить языки Yandex.Dictionary.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/off_langs_doesnt_supported_for_out")
    public ResponseEntity<?> offLangsDoesntSupportedForOut(HttpServletRequest request,
                                                           @ModelAttribute("auth_code") String authCode) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, authCode);
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(validateAuthCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(validateAuthCode);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        response = tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult result) {
            List<Lang> langs = LANG_SERVICE.findAll(null);
            List<String> langsForOut = result.getLangsOut();
            for (Lang lang: langs) {
                boolean doesntSupported = true;
                for (String langForOut: langsForOut) {
                    if (lang.getCode().equals(langForOut)) {
                        doesntSupported = false;
                        break;
                    }
                }

                if (doesntSupported) {
                    LANG_SERVICE.changeActivityForOut(lang, false);
                }
            }

            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Выходные неподдерживаемые языки успешно отключены.");
            return ResponseEntity.ok(message);
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
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
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Язык с кодом '%s' не найден.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/before_update")
    public ResponseEntity<?> validateBeforeUpdate(HttpServletRequest request, @RequestBody LangRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        // Проверяем авторизированного пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с языками могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        // Ищем язык
        response = find(dto.getCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Данные для изменения языка корректны.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/is_active_for_in_by_code")
    public ResponseEntity<?> validateIsActiveForIn(@RequestParam("code") String code) {
        ResponseEntity<?> response = find(code);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Lang lang = LANG_SERVICE.find(code);
        if (lang.isActiveForIn()) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Язык доступен (входящий).");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Язык недоступен (входящий).");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/is_active_for_out_by_code")
    public ResponseEntity<?> validateIsActiveForOut(@RequestParam("code") String code) {
        ResponseEntity<?> response = find(code);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Lang lang = LANG_SERVICE.find(code);
        if (lang.isActiveForOut()) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Язык доступен (выходящий).");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Язык недоступен (выходящий).");
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
            CustomResponseMessage message = new CustomResponseMessage(1, "Языки не должны повторяться.");
            return ResponseEntity.badRequest().body(message);
        }
        //---

        Lang langIn = LANG_SERVICE.find(langInCode);
        Lang langOut = LANG_SERVICE.find(langOutCode);
        response = tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult yandexLangsResult) {
            boolean isCorrect = yandexLangsResult.areCoupleLangsSupported(
                    langIn.getCode(), langOut.getCode());
            if (isCorrect) {
                CustomResponseMessage message = new CustomResponseMessage(1,
                        String.format("Пара языков '%s' - '%s' поддерживается.",
                                langIn.getTitle(), langOut.getTitle()));
                return ResponseEntity.ok(message);
            } else {
                CustomResponseMessage message = new CustomResponseMessage(2,
                        String.format("Пара языков '%s' - '%s' не поддерживается.",
                                langIn.getTitle(), langOut.getTitle()));
                return ResponseEntity.badRequest().body(message);
            }
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(3, "Неизвестная ошибка обращения к API.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    public ResponseEntity<?> tryToGetYandexLangsResult() {
        HttpJsonResponse jsonResponse = YANDEX_LANGS_UTILS.getHttpJsonResponse();
        if (jsonResponse != null) {
            if (jsonResponse.getCode() == HttpStatus.OK.value()) {
                YandexLangsResult result = YANDEX_LANGS_UTILS.getYandexLangsResult(jsonResponse);
                if (result != null) {
                    return ResponseEntity.ok(result);
                } else {
                    CustomResponseMessage message = new CustomResponseMessage(1,
                            "Не удалось получить результат обращения к API.");
                    return ResponseEntity.badRequest().body(message);
                }
            } else {
                YandexDictionaryError error = YANDEX_LANGS_UTILS.getYandexLangsError(jsonResponse);
                CustomResponseMessage message = new CustomResponseMessage(error.getCode(), error.getMessage());
                return ResponseEntity.badRequest().body(message);
            }
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2, "Не удалось обратиться к API.");
            return ResponseEntity.badRequest().body(message);
        }
    }
}
