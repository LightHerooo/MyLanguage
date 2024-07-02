package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.*;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatuses;
import ru.herooo.mylanguagedb.entities.word.types.WordsStatistic;
import ru.herooo.mylanguageweb.dto.other.request.entity.EntityAuthKeyRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.edit.s.EntityEditStringByIdRequestDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.dto.other.response.value.LongResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.word.request.WordAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.word.response.WordResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.word.WordMapping;
import ru.herooo.mylanguageweb.dto.entity.wordstatushistory.request.WordStatusHistoryAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.word.types.statistic.WordsStatisticMapping;
import ru.herooo.mylanguageweb.dto.entity.word.types.statistic.WordsStatisticResponseDTO;
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
    private final WordService WORD_SERVICE;

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

    @GetMapping("/get")
    public ResponseEntity<?> getAll(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
            @RequestParam(value = "customer_id", required = false, defaultValue = "0") Long customerId,
            @RequestParam(value = "number_of_items", required = false, defaultValue = "0") Long numberOfItems,
            @RequestParam(value = "last_word_id_on_previous_page", required = false, defaultValue = "0")
            Long lastWordIdOnPreviousPage) {
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

        if (customerId != 0) {
            ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        if (numberOfItems == null || numberOfItems < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(1, "Количество записей не должно быть отрицательным.");
            return ResponseEntity.badRequest().body(message);
        }


        if (lastWordIdOnPreviousPage == null || lastWordIdOnPreviousPage < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(2,
                            "ID последнего слова на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0.");
            return ResponseEntity.badRequest().body(message);
        }

        List<Word> words = WORD_SERVICE.findAll(title, langCode, wordStatusCode, customerId, numberOfItems,
                lastWordIdOnPreviousPage);
        if (words != null && words.size() > 0) {
            List<WordResponseDTO> wordsDTOs = words.stream().map(WORD_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(wordsDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Слова по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/statistic")
    public ResponseEntity<?> getStatistic() {
        List<WordsStatistic> wordsStatistics = WORD_SERVICE.findWordsStatistic();
        if (wordsStatistics != null && wordsStatistics.size() > 0) {
            List<WordsStatisticResponseDTO> responseDTOs = wordsStatistics
                    .stream()
                    .map(WORDS_STATISTIC_MAPPING::mapToResponse)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Не удалось получить статистику слов по статусам слов.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/customer_statistic")
    public ResponseEntity<?> getCustomerStatistic(@RequestParam("customer_id") Long customerId) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<WordsStatistic> wordsStatistics =
                WORD_SERVICE.findWordsCustomerStatistic(customerId);
        if (wordsStatistics != null && wordsStatistics.size() > 0) {
            List<WordsStatisticResponseDTO> responseDTOs = wordsStatistics
                    .stream()
                    .map(WORDS_STATISTIC_MAPPING::mapToResponse)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Не удалось получить статистику слов пользователя с id = '%d' по статусам слов.",
                            customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/count/by_date_of_create")
    public ResponseEntity<?> getCountByDateOfCreate(@RequestParam("date_of_create") String dateOfCreate) {
        LocalDate date = null;
        try {
            date = LocalDate.parse(dateOfCreate);
        } catch (Throwable e) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Введена некорректная дата. Введите дату в формате 'yyyy-MM-dd'.");
            return ResponseEntity.badRequest().body(message);
        }

        long countOfWords = WORD_SERVICE.countByDateOfCreate(date);
        LongResponseDTO longResponseDTO = new LongResponseDTO(countOfWords);
        return ResponseEntity.ok(longResponseDTO);
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
        Word word = WORD_SERVICE.find(id);
        if (word != null) {
            WordResponseDTO wordResponseDTO = WORD_MAPPING.mapToResponseDTO(word);
            return ResponseEntity.ok(wordResponseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                    String.format("Слово с id = '%d' не найдено.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }



    @PostMapping("/add")
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @Valid @RequestBody WordAddRequestDTO dto,
                                 BindingResult bindingResult) {
        ResponseEntity<?> response = validateBeforeAdd(request, dto, bindingResult);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Word word = WORD_SERVICE.add(dto);
        if (word != null) {
            // Добавляем новый статус слова
            WordStatusHistoryAddRequestDTO requestDTO = new WordStatusHistoryAddRequestDTO();
            requestDTO.setWordId(word.getId());
            requestDTO.setWordStatusCode(WordStatuses.NEW.CODE);
            WORD_STATUS_HISTORY_SERVICE.add(requestDTO);

            WordResponseDTO responseDTO = WORD_MAPPING.mapToResponseDTO(word);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Произошла ошибка при добавлении слова.");
            return ResponseEntity.badRequest().body(message);
        }
    }
    @PostMapping("/validate/before_add")
    public ResponseEntity<?> validateBeforeAdd(HttpServletRequest request,
                                               @Valid @RequestBody WordAddRequestDTO dto,
                                               BindingResult bindingResult) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        // Проверяем авторизированного пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(dto.getAuthKey());
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

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2, errorMessage);
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
        List<Word> blockedWords = WORD_SERVICE.findAllWithCurrentTitle(dto.getTitle(),
                WordStatuses.BLOCKED.CODE);
        if (blockedWords.size() > 0) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(4, "Это слово запрещено.");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем, нет ли уже в базе слова с таким же названием и языком
        Lang lang = LANG_SERVICE.find(dto.getLangCode());
        Word word = WORD_SERVICE
                .findFirstByTitleIgnoreCaseAndLang(dto.getTitle(), lang);
        if (word != null) {
            ResponseMessageResponseDTO message;

            WordStatusHistory wordStatusHistory = WORD_STATUS_HISTORY_SERVICE.findCurrent(word.getId());
            if (wordStatusHistory != null
                    && wordStatusHistory.getWordStatus().getId() == WordStatuses.NEW.ID) {
                message = new ResponseMessageResponseDTO(5, "Это слово уже предложено и находится на рассмотрении.");
            } else {
                message = new ResponseMessageResponseDTO(6, "Это слово уже существует.");
            }

            return ResponseEntity.badRequest().body(message);
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Данные для добавления слова корректны.");
        return ResponseEntity.ok(message);
    }



    @PatchMapping("/edit/word_status")
    public ResponseEntity<?> editWordStatus(HttpServletRequest request,
                                            @RequestBody EntityEditStringByIdRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        // Проверяем авторизированного пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(dto.getAuthKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Изменять статус словам может только суперпользователь
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем существование слова
        response = find(dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем статус слова, который будем присваивать
        String wordStatusCode = dto.getValue();
        response = WORD_STATUSES_REST_CONTROLLER.find(wordStatusCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Если слово уже запрещено, то статус можно установить только "Невостребованный"
        Word word = WORD_SERVICE.find(dto.getId());
        List<Word> blockedWords = WORD_SERVICE.findAllWithCurrentTitle(word.getTitle(),
                WordStatuses.BLOCKED.CODE);

        blockedWords = blockedWords
                .stream()
                .filter(w -> w.getId() != dto.getId())
                .toList();

        WordStatus wordStatus = WORD_STATUS_SERVICE.find(wordStatusCode);
        if (blockedWords.size() > 0 && wordStatus.getId() != WordStatuses.UNCLAIMED.ID) {
            WordStatus unclaimedWordStatus = WORD_STATUS_SERVICE.find(WordStatuses.UNCLAIMED);
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(3,
                    String.format("Это слово уже запрещено. Установите этому слову статус '%s'.",
                            unclaimedWordStatus.getTitle()));
            return ResponseEntity.badRequest().body(message);
        }

        // Устанавливаем новый статус слова (если предыдущее != новому)
        WordStatusHistory oldWordStatusHistory = WORD_STATUS_HISTORY_SERVICE.findCurrent(dto.getId());
        if (!wordStatus.equals(oldWordStatusHistory.getWordStatus())) {
            WORD_STATUS_HISTORY_SERVICE.addWordStatusToWord(word.getId(), wordStatus.getCode());

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Статус слова c id = '%d' успешно изменён на '%s'.",
                            word.getId(), wordStatus.getTitle()));
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Слово уже имеет статус '%s'. Выберите другой статус.", wordStatus.getTitle()));
            return ResponseEntity.badRequest().body(message);
        }
    }



    @DeleteMapping("/delete/all_unclaimed")
    public ResponseEntity<?> deleteAllUnclaimed(HttpServletRequest request,
                                                @RequestBody EntityAuthKeyRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (CUSTOMER_SERVICE.isSuperUser(customer)) {
            WORD_SERVICE.deleteAllUnclaimed();
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Все невостребованные слова успешно удалены.");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }
    }
}
