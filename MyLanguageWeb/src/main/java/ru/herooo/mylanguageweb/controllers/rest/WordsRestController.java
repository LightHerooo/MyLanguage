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
import ru.herooo.mylanguagedb.types.WordsStatistic;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.other.LongResponse;
import ru.herooo.mylanguageweb.dto.entity.word.WordRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.word.WordResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.word.WordMapping;
import ru.herooo.mylanguageweb.dto.entity.wordstatushistory.WordStatusHistoryRequestDTO;
import ru.herooo.mylanguageweb.dto.types.words_with_status_statistic.WordsStatisticMapping;
import ru.herooo.mylanguageweb.dto.types.words_with_status_statistic.WordsStatisticResponseDTO;
import ru.herooo.mylanguageweb.services.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/words")
public class WordsRestController {
    private final WordStatusesRestController WORD_STATUSES_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;
    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;

    private final CustomerService CUSTOMER_SERVICE;
    private final WordStatusHistoryService WORD_STATUS_HISTORY_SERVICE;
    private final WordStatusService WORD_STATUS_SERVICE;
    private final LangService LANG_SERVICE;
    private WordService WORD_SERVICE;

    private final WordMapping WORD_MAPPING;
    private final WordsStatisticMapping WORDS_STATISTIC_MAPPING;

    @Autowired
    public WordsRestController(
            WordStatusesRestController wordStatusesRestController,
            LangsRestController langsRestController,
            CustomersRestController customersRestController,

            WordService wordService,
            CustomerService customerService,
            WordStatusHistoryService wordStatusHistoryService,
            WordStatusService wordStatusService,
            LangService langService,

            WordMapping wordMapping,
            WordsStatisticMapping wordsStatisticMapping) {
        this.WORD_STATUSES_REST_CONTROLLER = wordStatusesRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;

        this.WORD_SERVICE = wordService;
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_STATUS_HISTORY_SERVICE = wordStatusHistoryService;
        this.WORD_STATUS_SERVICE = wordStatusService;
        this.LANG_SERVICE = langService;

        this.WORD_MAPPING = wordMapping;
        this.WORDS_STATISTIC_MAPPING = wordsStatisticMapping;
    }
    @GetMapping("/filtered_pagination")
    public ResponseEntity<?> getAll(
            @RequestParam("number_of_words") Long numberOfWords,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "last_word_id_on_previous_page", required = false, defaultValue = "0")
            Long lastWordIdOnPreviousPage) {
        ResponseEntity<?> response = validateBeforeFilter(numberOfWords, wordStatusCode,
                langCode, lastWordIdOnPreviousPage);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<Word> words = WORD_SERVICE.findAll(title, wordStatusCode,
                langCode, numberOfWords, lastWordIdOnPreviousPage);
        if (words != null && words.size() > 0) {
            List<WordResponseDTO> wordsDTOs = words.stream().map(WORD_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(wordsDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Слова по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/customer_filtered_pagination")
    public ResponseEntity<?> getAll(
            @RequestParam("number_of_words") Long numberOfWords,
            @RequestParam("customer_id") Long customerId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "last_word_id_on_previous_page", required = false, defaultValue = "0")
            Long lastWordIdOnPreviousPage
    ) {
        ResponseEntity<?> response = validateBeforeFilter(numberOfWords, wordStatusCode,
                langCode, lastWordIdOnPreviousPage);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<Word> words = WORD_SERVICE.findAllCustomer(title, wordStatusCode, langCode,
                customerId, numberOfWords, lastWordIdOnPreviousPage);
        if (words != null && words.size() > 0) {
            List<WordResponseDTO> wordDTOs = words.stream().map(WORD_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(wordDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Слова по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<?> getStatistics() {
        List<WordsStatistic> wordsStatistics = WORD_SERVICE.findWordsStatistics();
        if (wordsStatistics != null && wordsStatistics.size() > 0) {
            List<WordsStatisticResponseDTO> responseDTOs = wordsStatistics
                    .stream()
                    .map(WORDS_STATISTIC_MAPPING::mapToResponse)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Не удалось получить статистику слов по статусам слов.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/statistics_by_customer_id")
    public ResponseEntity<?> getStatistics(@RequestParam("customer_id") Long customerId) {
        List<WordsStatistic> wordsStatistics =
                WORD_SERVICE.findWordsStatistics(customerId);
        if (wordsStatistics != null && wordsStatistics.size() > 0) {
            List<WordsStatisticResponseDTO> responseDTOs = wordsStatistics
                    .stream()
                    .map(WORDS_STATISTIC_MAPPING::mapToResponse)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Не удалось получить статистику слов пользователя с id = '%d' по статусам слов.",
                            customerId));
            return ResponseEntity.badRequest().body(message);
        }
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

        long countOfWords = WORD_SERVICE.count(date);
        LongResponse longResponse = new LongResponse(countOfWords);
        return ResponseEntity.ok(longResponse);
    }

    @PostMapping()
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @Valid @RequestBody WordRequestDTO dto,
                                 BindingResult bindingResult) {
        ResponseEntity<?> response = validateBeforeAdd(request, dto, bindingResult);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
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

    @PatchMapping("/change_word_status")
    public ResponseEntity<?> changeWordStatus(HttpServletRequest request,
                                              @RequestBody WordRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        // Проверяем авторизированного пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Изменять статус словам может только суперпользователь
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем существование слова
        response = find(dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем статус слова, который будем присваивать
        String wordStatusCode = dto.getWordStatusCode();
        response = WORD_STATUSES_REST_CONTROLLER.find(wordStatusCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Если слово уже запрещено, то статус можно установить только "Невостребованный"
        Word word = WORD_SERVICE.findById(dto.getId());
        List<Word> blockedWords = WORD_SERVICE.findListByTitleInDifferentLangs(word.getTitle(),
                WordStatuses.BLOCKED.CODE);

        blockedWords = blockedWords
                .stream()
                .filter(w -> w.getId() != dto.getId())
                .toList();

        WordStatus wordStatus = WORD_STATUS_SERVICE.find(wordStatusCode);
        if (blockedWords.size() > 0 && wordStatus.getId() != WordStatuses.UNCLAIMED.ID) {
            WordStatus unclaimedWordStatus = WORD_STATUS_SERVICE.find(WordStatuses.UNCLAIMED);
            CustomResponseMessage message = new CustomResponseMessage(3,
                    String.format("Это слово уже запрещено. Установите этому слову статус '%s'.",
                            unclaimedWordStatus.getTitle()));
            return ResponseEntity.badRequest().body(message);
        }

        // Устанавливаем новый статус слова (если предыдущее != новому)
        WordStatusHistory oldWordStatusHistory = WORD_STATUS_HISTORY_SERVICE.findCurrent(dto.getId());
        WordStatus newWordStatus = WORD_STATUS_SERVICE.find(dto.getWordStatusCode());
        if (!newWordStatus.equals(oldWordStatusHistory.getWordStatus())) {
            WORD_STATUS_HISTORY_SERVICE.addWordStatusToWord(word.getId(), newWordStatus.getCode());

            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Статус слова c id = '%d' успешно изменён на '%s'.",
                            word.getId(), newWordStatus.getTitle()));
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Слово уже имеет статус '%s'. Выберите другой статус.", newWordStatus.getTitle()));
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
        if (CUSTOMER_SERVICE.isSuperUser(customer)) {
            WORD_SERVICE.deleteAllUnclaimed();
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Все невостребованные слова успешно удалены.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
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
            @RequestParam(value = "lang_code", required = false) String langCode) {
        if (wordStatusCode != null) {
            ResponseEntity<?> response = WORD_STATUSES_REST_CONTROLLER.find(wordStatusCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        if (langCode != null) {
            ResponseEntity<?> response = LANGS_REST_CONTROLLER.find(langCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            response = LANGS_REST_CONTROLLER.validateIsActiveForIn(langCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Параметры для фильтрации корректны.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/before_filter_pagination")
    public ResponseEntity<?> validateBeforeFilter(
            @RequestParam("number_of_words") Long numberOfWords,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "last_word_id_on_previous_page", required = false, defaultValue = "0")
            Long lastWordIdOnPreviousPage
    ) {
        ResponseEntity<?> response = validateBeforeFilter(wordStatusCode, langCode);
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

    @PostMapping("/validate/before_add")
    public ResponseEntity<?> validateBeforeAdd(HttpServletRequest request,
                                               @Valid @RequestBody WordRequestDTO dto,
                                               BindingResult bindingResult) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        // Проверяем авторизированного пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
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
        response = LANGS_REST_CONTROLLER.find(dto.getLangCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем язык на активность
        response = LANGS_REST_CONTROLLER.validateIsActiveForIn(dto.getLangCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем, не запрещено ли слово
        List<Word> blockedWords = WORD_SERVICE.findListByTitleInDifferentLangs(dto.getTitle(),
                WordStatuses.BLOCKED.CODE);
        if (blockedWords.size() > 0) {
            CustomResponseMessage message = new CustomResponseMessage(4, "Это слово запрещено.");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем, нет ли уже в базе слова с таким же названием и языком
        Lang lang = LANG_SERVICE.find(dto.getLangCode());
        Word word = WORD_SERVICE
                .findFirstByTitleIgnoreCaseAndLang(dto.getTitle(), lang);
        if (word != null) {
            CustomResponseMessage message = new CustomResponseMessage(5, "Это слово уже существует.");
            return ResponseEntity.badRequest().body(message);
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Данные для добавления слова корректны.");
        return ResponseEntity.ok(message);
    }
}
