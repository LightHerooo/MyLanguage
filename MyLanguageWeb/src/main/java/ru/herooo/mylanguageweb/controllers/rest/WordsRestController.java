package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.*;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatuses;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.LongResponse;
import ru.herooo.mylanguageweb.dto.word.WordAddMoreRequestDTO;
import ru.herooo.mylanguageweb.dto.word.WordRequestDTO;
import ru.herooo.mylanguageweb.dto.word.WordResponseDTO;
import ru.herooo.mylanguageweb.dto.word.WordMapping;
import ru.herooo.mylanguageweb.dto.wordstatushistory.WordStatusHistoryRequestDTO;
import ru.herooo.mylanguageweb.services.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/words")
public class WordsRestController {
    private final WordStatusesRestController WORD_STATUSES_REST_CONTROLLER;
    private final PartsOfSpeechRestController PARTS_OF_SPEECH_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;
    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;

    private final WordService WORD_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;
    private final WordStatusHistoryService WORD_STATUS_HISTORY_SERVICE;
    private final WordStatusService WORD_STATUS_SERVICE;
    private final PartOfSpeechService PART_OF_SPEECH_SERVICE;
    private final LangService LANG_SERVICE;

    private final WordMapping WORD_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public WordsRestController(
            WordStatusesRestController wordStatusesRestController,
            PartsOfSpeechRestController partsOfSpeechRestController,
            LangsRestController langsRestController,
            CustomersRestController customersRestController,

            WordService wordService,
            CustomerService customerService,
            WordStatusHistoryService wordStatusHistoryService,
            WordStatusService wordStatusService,
            PartOfSpeechService partOfSpeechService,
            LangService langService,

            WordMapping wordMapping,

            StringUtils stringUtils) {
        this.WORD_STATUSES_REST_CONTROLLER = wordStatusesRestController;
        this.PARTS_OF_SPEECH_REST_CONTROLLER = partsOfSpeechRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;

        this.WORD_SERVICE = wordService;
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_STATUS_HISTORY_SERVICE = wordStatusHistoryService;
        this.WORD_STATUS_SERVICE = wordStatusService;
        this.PART_OF_SPEECH_SERVICE = partOfSpeechService;
        this.LANG_SERVICE = langService;

        this.WORD_MAPPING = wordMapping;

        this.STRING_UTILS = stringUtils;
    }

    //todo переделать в @PostMapping
    @GetMapping("/filtered")
    public ResponseEntity<?> getFiltered(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "lang_code", required = false) String langCode) {
        ResponseEntity<?> response = validateBeforeFilter(wordStatusCode, partOfSpeechCode, langCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<Word> wordsAfterFilter = WORD_SERVICE.
                findAfterFilter(title, wordStatusCode, partOfSpeechCode, langCode);
        if (wordsAfterFilter != null && wordsAfterFilter.size() > 0) {
            List<WordResponseDTO> wordsDTO = wordsAfterFilter.stream().map(WORD_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok().body(wordsDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Слова по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/filtered_pagination")
    public ResponseEntity<?> getFilteredPagination(
            @RequestParam("number_of_words") Long numberOfWords,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "last_word_id_on_previous_page", required = false, defaultValue = "0")
            Long lastWordIdOnPreviousPage) {
        ResponseEntity<?> response = validateBeforeFilterPagination(numberOfWords, wordStatusCode, partOfSpeechCode,
                langCode, lastWordIdOnPreviousPage);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<Word> words = WORD_SERVICE.findAfterFilterWithPagination(title, wordStatusCode,
                partOfSpeechCode, langCode, numberOfWords, lastWordIdOnPreviousPage);
        if (words != null && words.size() > 0) {
            List<WordResponseDTO> wordsDTOs = words.stream().map(WORD_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(wordsDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Слова по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/customer_filtered_pagination")
    public ResponseEntity<?> getCustomerWordsFilteredPagination(
            @RequestParam("number_of_words") Long numberOfWords,
            @RequestParam("customer_id") Long customerId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "last_word_id_on_previous_page", required = false, defaultValue = "0")
            Long lastWordIdOnPreviousPage
    ) {
        ResponseEntity<?> response = validateBeforeFilterPagination(numberOfWords, wordStatusCode, partOfSpeechCode,
                langCode, lastWordIdOnPreviousPage);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<Word> words = WORD_SERVICE.findCustomerWordsAfterFilterWithPagination(title, wordStatusCode, partOfSpeechCode, langCode,
                customerId, numberOfWords, lastWordIdOnPreviousPage);
        if (words != null && words.size() > 0) {
            List<WordResponseDTO> wordDTOs = words.stream().map(WORD_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(wordDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Слова по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/count_by_word_status_code")
    public ResponseEntity<?> getCountByWordStatusCode(@RequestParam("word_status_code") String wordStatusCode) {
        long countOfWords = WORD_SERVICE.getNumberOfWordsByWordStatusCode(wordStatusCode);
        LongResponse longResponse = new LongResponse(countOfWords);

        return ResponseEntity.ok(longResponse);
    }

    @GetMapping("/count_by_date_of_create")
    public ResponseEntity<?> getCountByDateOfCreate(@RequestParam("date_of_create") String dateOfCreate) {
        LocalDate date = null;
        try {
            date = LocalDate.parse(dateOfCreate);
        } catch (Throwable e) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Введена некорректная дата. Введите дату в формате 'yyyy-MM-dd'.");
            return ResponseEntity.badRequest().body(message);
        }

        long countOfWords = WORD_SERVICE.getNumberOfWordsByDateOfCreate(date);
        LongResponse longResponse = new LongResponse(countOfWords);
        return ResponseEntity.ok(longResponse);
    }

    @GetMapping("/count_by_customer_id_and_word_status_code")
    public ResponseEntity<?> getCountOfCustomerWordsByWordStatusCode(
            @RequestParam("customer_id") Long customerId,
            @RequestParam("word_status_code") String wordStatusCode) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findById(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORD_STATUSES_REST_CONTROLLER.findByCode(wordStatusCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        long countOfWords = WORD_SERVICE.getNumberOfWordsByCustomerIdAndWordStatusCode(customerId, wordStatusCode);
        LongResponse longResponse = new LongResponse(countOfWords);
        return ResponseEntity.ok(longResponse);
    }

    @PostMapping()
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @Valid @RequestBody WordRequestDTO dto,
                                 BindingResult bindingResult) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto, bindingResult);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Мы не должны сохранять автора слова, если оно от супер-юзера
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        if (customer != null && CUSTOMER_SERVICE.isCustomerSuperUser(customer)) {
            dto.setAuthCode(null);
        }

        Word word = WORD_SERVICE.add(dto);
        if (word != null) {
            // Добавляем новый статус слова
            WordStatusHistoryRequestDTO requestDTO = new WordStatusHistoryRequestDTO();
            requestDTO.setWordId(word.getId());
            WORD_STATUS_HISTORY_SERVICE.add(requestDTO);

            // Добавляем слово
            WordResponseDTO responseDTO = WORD_MAPPING.mapToResponseDTO(word);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Произошла ошибка при добавлении слова.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping()
    public ResponseEntity<?> edit(HttpServletRequest request,
                                  @RequestBody WordRequestDTO dto,
                                  BindingResult bindingResult) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto, bindingResult);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем код статуса слова
        response = WORD_STATUSES_REST_CONTROLLER.findByCode(dto.getWordStatusCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Word word = WORD_SERVICE.findById(dto.getId());
        if (word != null) {
            word = WORD_SERVICE.edit(word, dto);

            // Устанавливаем новый статус слова (если предыдущее != новому)
            WordStatusHistory oldWordStatusHistory = WORD_STATUS_HISTORY_SERVICE.getCurrentWordStatusHistoryToWord(word);
            WordStatus newWordStatus = WORD_STATUS_SERVICE.findByCode(dto.getWordStatusCode());
            if (!newWordStatus.equals(oldWordStatusHistory.getWordStatus())) {
                WORD_STATUS_HISTORY_SERVICE.addWordStatusToWord(word, newWordStatus);
            }

            return ResponseEntity.ok(word);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Произошла ошибка при изменении слова.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @DeleteMapping("/delete_all_unclaimed_words")
    public ResponseEntity<?> deleteAllUnclaimedWords(HttpServletRequest request,
                                                     @ModelAttribute("auth_code") String authCode) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, authCode);
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(validateAuthCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findByAuthCode(validateAuthCode);
        if (CUSTOMER_SERVICE.isCustomerSuperUser(customer)) {
            WORD_SERVICE.deleteAllUnclaimedWords();
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Все невостребованные слова успешно удалены.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> findById(@RequestParam("id") Long id) {
        Word word = WORD_SERVICE.findById(id);
        if (word != null) {
            WordResponseDTO wordResponseDTO = WORD_MAPPING.mapToResponseDTO(word);
            return ResponseEntity.ok(wordResponseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    String.format("Слово с id = '%d' не найдено.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/before_filter")
    public ResponseEntity<?> validateBeforeFilter(
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "lang_code", required = false) String langCode) {
        if (wordStatusCode != null) {
            ResponseEntity<?> response = WORD_STATUSES_REST_CONTROLLER.findByCode(wordStatusCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        if (partOfSpeechCode != null) {
            ResponseEntity<?> response = PARTS_OF_SPEECH_REST_CONTROLLER.findByCode(partOfSpeechCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        if (langCode != null) {
            ResponseEntity<?> response = LANGS_REST_CONTROLLER.findByCode(langCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Параметры для фильтрации корректны.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/before_filter_pagination")
    public ResponseEntity<?> validateBeforeFilterPagination(
            @RequestParam("number_of_words") Long numberOfWords,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "last_word_id_on_previous_page", required = false, defaultValue = "0")
            Long lastWordIdOnPreviousPage
    ) {
        ResponseEntity<?> response = validateBeforeFilter(wordStatusCode, partOfSpeechCode, langCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (numberOfWords == null || numberOfWords <= 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(1, "Количество слов должно быть больше 0.");
            return ResponseEntity.badRequest().body(message);
        }


        if (lastWordIdOnPreviousPage == null || lastWordIdOnPreviousPage < 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(2,
                            "ID последнего слова на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0.");
            return ResponseEntity.badRequest().body(message);
        }

        CustomResponseMessage message = new CustomResponseMessage(1,
                "Параметры для постраничной фильтрации корректны.");
        return ResponseEntity.ok(message);
    }

    @PostMapping("/validate/before_crud")
    public ResponseEntity<?> validateBeforeCrud(HttpServletRequest request,
                                                @Valid @RequestBody WordRequestDTO dto,
                                                BindingResult bindingResult) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Слово может изменять только супер-юзер
        if (dto.getId() != 0) {
            Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
            if (!CUSTOMER_SERVICE.isCustomerSuperUser(customer)) {
                CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
                return ResponseEntity.badRequest().body(message);
            }
        }

        // Проверяем наличие ошибок привязки DTO
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult
                    .getAllErrors()
                    .stream()
                    .findFirst()
                    .get()
                    .getDefaultMessage();

            CustomResponseMessage message = new CustomResponseMessage(2, errorMessage);
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем язык
        response = LANGS_REST_CONTROLLER.findByCode(dto.getLangCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем часть речи
        response = PARTS_OF_SPEECH_REST_CONTROLLER.findByCode(dto.getPartOfSpeechCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем, не запрещено ли слово с таким названием
        List<Word> blockedWords = WORD_SERVICE.findWordsWithCurrentStatusByTitleAndWordStatusCode(dto.getTitle(),
                WordStatuses.BLOCKED.CODE);
        if (dto.getId() == 0 && blockedWords.size() > 0) {
            // Если слово новое, смотрим количество запрещённых слов по указанному названию
            CustomResponseMessage message = new CustomResponseMessage(3, "Это слово запрещено.");
            return ResponseEntity.badRequest().body(message);
        } else if (dto.getId() != 0) {
            // Если слово не новое, удаляем из списка запрещённых слов пришедшее
            blockedWords = blockedWords
                    .stream()
                    .filter(w -> w.getId() != dto.getId())
                    .toList();

            // Проверяем статус слова
            response = WORD_STATUSES_REST_CONTROLLER.findByCode(dto.getWordStatusCode());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Если список запрещённых слов не пуст, то мы можем изменить статус слова только на "Невостребованный"
            WordStatus wordStatus = WORD_STATUS_SERVICE.findByCode(dto.getWordStatusCode());
            if (blockedWords.size() > 0 && wordStatus.getId() != WordStatuses.UNCLAIMED.ID) {
                CustomResponseMessage message = new CustomResponseMessage(4,
                        "Это слово уже запрещено. Ему можно поставить статус 'Невостребованный'.");
                return ResponseEntity.badRequest().body(message);
            }
        }

        // Ищем похожее слово в БД
        Lang lang = LANG_SERVICE.findByCode(dto.getLangCode());
        PartOfSpeech partOfSpeech = PART_OF_SPEECH_SERVICE.findByCode(dto.getPartOfSpeechCode());
        Word word = WORD_SERVICE
                .findFirstByTitleIgnoreCaseAndLangAndPartOfSpeech(dto.getTitle(), lang, partOfSpeech);
        if (word != null && (word.getId() == 0 || word.getId() != dto.getId())) {
            CustomResponseMessage message = new CustomResponseMessage(5, "Это слово уже существует.");
            return ResponseEntity.badRequest().body(message);
        }

        return ResponseEntity.ok(dto);
    }
}
