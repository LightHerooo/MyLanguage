package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguageutils.http.HttpJsonResponse;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryError;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangsResult;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangsUtils;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.services.LangService;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/langs")
public class LangsRestController {
    private final LangService LANG_SERVICE;
    private final LangMapping LANG_MAPPING;
    private final YandexLangsUtils YANDEX_LANGS_UTILS;

    @Autowired
    public LangsRestController(LangService langService,
                               LangMapping langMapping,
                               YandexLangsUtils yandexLangsUtils) {
        this.LANG_SERVICE = langService;
        this.LANG_MAPPING = langMapping;
        this.YANDEX_LANGS_UTILS = yandexLangsUtils;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<Lang> langs = LANG_SERVICE.findAll();
        if (langs != null && langs.size() > 0) {
            List<LangResponseDTO> responseDTOs = langs.stream().map(LANG_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Языки не найдены.");
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
                    .getLangsIn(langOut.getCodeForTranslate());

            List<Lang> result = new ArrayList<>();
            for (Lang lang: langs) {
                for (String langCode: yandexLangsIn) {
                    if (lang.getCodeForTranslate().equals(langCode)) {
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
                    .getLangsOut(langIn.getCodeForTranslate());

            List<Lang> result = new ArrayList<>();
            for (Lang lang: langs) {
                for (String langCode: yandexLangsOut) {
                    if (lang.getCodeForTranslate().equals(langCode)) {
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

        Lang langIn = LANG_SERVICE.find(langInCode);
        Lang langOut = LANG_SERVICE.find(langOutCode);
        response = tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult yandexLangsResult) {
            boolean isCorrect = yandexLangsResult.areCoupleLangsSupported(
                    langIn.getCodeForTranslate(), langOut.getCodeForTranslate());
            if (isCorrect) {
                CustomResponseMessage message = new CustomResponseMessage(1,
                        String.format("Пара языков '%s' - '%s' поддерживается.",
                                langIn.getTitle(), langOut.getTitle()));
                return ResponseEntity.ok(message);
            } else {
                CustomResponseMessage message = new CustomResponseMessage(1,
                        String.format("Пара языков '%s' - '%s' не поддерживается.",
                                langIn.getTitle(), langOut.getTitle()));
                return ResponseEntity.badRequest().body(message);
            }
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Неизвестная ошибка обращения к API.");
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
