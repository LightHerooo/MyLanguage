package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.entities.WordStatusHistory;
import ru.herooo.mylanguagedb.repositories.wordstatus.WordStatuses;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.wordstatushistory.WordStatusHistoryMapping;
import ru.herooo.mylanguageweb.dto.wordstatushistory.WordStatusHistoryRequestDTO;
import ru.herooo.mylanguageweb.dto.wordstatushistory.WordStatusHistoryResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WordService;
import ru.herooo.mylanguageweb.services.WordStatusHistoryService;
import ru.herooo.mylanguageweb.services.WordStatusService;

import java.util.List;

@RestController
@RequestMapping("/api/word_status_histories")
public class WordStatusHistoriesRestController {

    private final WordsRestController WORDS_REST_CONTROLLER;
    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final WordStatusesRestController WORD_STATUSES_REST_CONTROLLER;

    private final WordService WORD_SERVICE;
    private final WordStatusHistoryService WORD_STATUS_HISTORY_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;

    private final WordStatusHistoryMapping WORD_STATUS_HISTORY_MAPPING;

    @Autowired
    public WordStatusHistoriesRestController(WordsRestController wordsRestController,
                                             CustomersRestController customersRestController,
                                             WordStatusesRestController wordStatusesRestController,
                                             WordService wordService,
                                             WordStatusHistoryService wordStatusHistoryService,
                                             CustomerService customerService,
                                             WordStatusHistoryMapping wordStatusHistoryMapping) {
        this.WORDS_REST_CONTROLLER = wordsRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.WORD_STATUSES_REST_CONTROLLER = wordStatusesRestController;

        this.WORD_SERVICE = wordService;
        this.WORD_STATUS_HISTORY_SERVICE = wordStatusHistoryService;
        this.CUSTOMER_SERVICE = customerService;

        this.WORD_STATUS_HISTORY_MAPPING = wordStatusHistoryMapping;
    }

    @GetMapping("/by_word_id")
    public ResponseEntity<?> getAllByWordId(@RequestParam("word_id") Long wordId) {
        ResponseEntity<?> response = WORDS_REST_CONTROLLER.findById(wordId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Word word = WORD_SERVICE.findById(wordId);
        List<WordStatusHistory> wordStatusHistories =
                WORD_STATUS_HISTORY_SERVICE.findByWordOrderByDateOfStartDesc(word);
        if (wordStatusHistories != null && wordStatusHistories.size() > 0) {
            List<WordStatusHistoryResponseDTO> historyDTOs = wordStatusHistories
                    .stream()
                    .map(WORD_STATUS_HISTORY_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(historyDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "История указанного слова не найдена.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/current_by_word_id")
    public ResponseEntity<?> findCurrentByWordId(@RequestParam("id") Long id) {
        ResponseEntity<?> response = WORDS_REST_CONTROLLER.findById(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Word word = WORD_SERVICE.findById(id);
        WordStatusHistory wordStatusHistory = WORD_STATUS_HISTORY_SERVICE.findCurrentByWord(word);
        if (wordStatusHistory != null) {
            WordStatusHistoryResponseDTO dto = WORD_STATUS_HISTORY_MAPPING.mapToResponseDTO(wordStatusHistory);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Текущий статус у слова с id = '%d' не найден.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/add_word_status_to_words_without_status")
    public ResponseEntity<?> addWordStatusToWordsWithoutStatus(HttpServletRequest request,
                                                               @RequestBody WordStatusHistoryRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(validateAuthCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORD_STATUSES_REST_CONTROLLER.findByCode(dto.getWordStatusCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        if (CUSTOMER_SERVICE.isCustomerSuperUser(customer)) {
            WORD_STATUS_HISTORY_SERVICE.addWordStatusToWordsWithoutStatus(dto.getWordStatusCode());
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Статусы к словам без статуса успешно добавлены.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }
    }
}
