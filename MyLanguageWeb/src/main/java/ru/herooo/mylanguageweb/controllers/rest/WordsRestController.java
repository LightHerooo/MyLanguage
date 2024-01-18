package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
import java.time.LocalDateTime;
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

    @GetMapping("/customer_words_filtered_pagination")
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

    @PostMapping
    public ResponseEntity<?> add(HttpServletRequest request, @RequestBody WordRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
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

    @PostMapping("/add_several")
    public ResponseEntity<?> addSeveral(HttpServletRequest request, @RequestBody WordAddMoreRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (dto.getWords().length == 0) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Слова не указаны.");
            return ResponseEntity.badRequest().body(message);
        }

        Set<String> titles =
                Arrays.stream(dto.getWords())
                        .map(word -> word.getTitle().toLowerCase().trim() +
                                word.getLangCode() +
                                word.getPartOfSpeechCode())
                        .collect(Collectors.toSet());
        if (titles.size() != dto.getWords().length) {
            CustomResponseMessage message = new CustomResponseMessage(2, "Язык и часть речи" +
                    " в словах с одинаковым названием не должны повторяться.");
            return ResponseEntity.badRequest().body(message);
        }

        List<WordRequestDTO> badRequestDTOs = new ArrayList<>();
        for (WordRequestDTO requestDTO: dto.getWords()) {
            requestDTO.setAuthCode(dto.getAuthCode());
            response = add(request, requestDTO);
            if (response.getStatusCode() != HttpStatus.OK) {
                badRequestDTOs.add(requestDTO);
            }
        }

        if (badRequestDTOs.size() > 0) {
            StringBuilder badTitlesBuilder = new StringBuilder();
            badRequestDTOs.forEach(brd -> badTitlesBuilder.append(brd.getTitle()).append(", "));
            String badTitles = badTitlesBuilder.toString();
            badTitles = badTitles.substring(0, badTitles.length() - 2);

            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Добавлено %d из %d слов.\nНе добавлены: [%s].",
                            dto.getWords().length,
                            dto.getWords().length - badRequestDTOs.size(),
                            badTitles));
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    String.format("Добавлено %d из %d слов.",
                            dto.getWords().length,
                            dto.getWords().length));
            return ResponseEntity.ok(message);
        }
    }

    @PatchMapping("/edit")
    public ResponseEntity<?> edit(HttpServletRequest request, @RequestBody WordRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
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

    @GetMapping("/find/by_title_and_lang_code_and_part_of_speech_code")
    public ResponseEntity<?> findByTitleAndLangCodeAndPartOfSpeechCode(@RequestParam("title") String title,
                                                                       @RequestParam("lang_code") String langCode,
                                                                       @RequestParam("part_of_speech_code") String partOfSpeechCode) {
        ResponseEntity<?> response = PARTS_OF_SPEECH_REST_CONTROLLER.findByCode(partOfSpeechCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = LANGS_REST_CONTROLLER.findByCode(langCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        PartOfSpeech partOfSpeech = PART_OF_SPEECH_SERVICE.findByCode(partOfSpeechCode);
        Lang lang = LANG_SERVICE.findByCode(langCode);
        Word word = WORD_SERVICE.findFirstByTitleIgnoreCaseAndLangAndPartOfSpeech(title, lang, partOfSpeech);
        if (word != null) {
            WordResponseDTO dto = WORD_MAPPING.mapToResponseDTO(word);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Слова '%s' с языком '%s' и частью речи '%s' не существует.",
                            title, langCode, partOfSpeechCode));
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
    public ResponseEntity<?> validateBeforeCrud(HttpServletRequest request, @RequestBody WordRequestDTO dto) {
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

        // Преобразуем строку
        String title = STRING_UTILS.getClearString(dto.getTitle());
        dto.setTitle(title);

        // Ищем похожее слово в БД
        response = validateIsItPossibleToAddWord(dto.getTitle(), dto.getLangCode(), dto.getPartOfSpeechCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            if (dto.getId() != 0) {
                // Ищем слово напрямую, если хотим изменить
                PartOfSpeech partOfSpeech = PART_OF_SPEECH_SERVICE.findByCode(dto.getPartOfSpeechCode());
                Lang lang = LANG_SERVICE.findByCode(dto.getLangCode());
                Word word = WORD_SERVICE
                        .findFirstByTitleIgnoreCaseAndLangAndPartOfSpeech(dto.getTitle(), lang, partOfSpeech);

                // Если id найденного слова не равно входящему, выводим BadRequest
                if (word.getId() != dto.getId()) {
                    return response;
                }
            } else {
                return response;
            }
        }

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/validate/is_it_possible_to_add_word")
    public ResponseEntity<?> validateIsItPossibleToAddWord(@RequestParam("title") String title,
                                                           @RequestParam("lang_code") String langCode,
                                                           @RequestParam("part_of_speech_code") String partOfSpeechCode) {

        // Если хотя бы одно слово с искомым названием заблокировано, нужно запретить его добавлять
        long countOfBlockedWords =
                WORD_SERVICE.countWordsWithCurrentStatusByTitleAndWordStatusCode(title, WordStatuses.BLOCKED.CODE);
        if (countOfBlockedWords > 0) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Это слово запрещено.");
            return ResponseEntity.badRequest().body(message);
        }

        ResponseEntity<?> response = findByTitleAndLangCodeAndPartOfSpeechCode(title, langCode, partOfSpeechCode);
        if (response.getStatusCode() == HttpStatus.OK) {
            CustomResponseMessage message = new CustomResponseMessage(2, "Это слово уже существует.");
            return ResponseEntity.badRequest().body(message);
        } else {
            CustomResponseMessage message = (CustomResponseMessage) response.getBody();
            return ResponseEntity.ok(message);
        }
    }
}
