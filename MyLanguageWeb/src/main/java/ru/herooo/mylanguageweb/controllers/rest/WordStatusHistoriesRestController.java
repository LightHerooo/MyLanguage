package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.WordStatusHistory;
import ru.herooo.mylanguageweb.dto.other.request.entity.value.EntityStringRequestDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.wordstatushistory.WordStatusHistoryMapping;
import ru.herooo.mylanguageweb.dto.entity.wordstatushistory.response.WordStatusHistoryResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WordStatusHistoryService;

import java.util.List;

@RestController
@RequestMapping("/api/word_status_histories")
public class WordStatusHistoriesRestController {

    private final WordsRestController WORDS_REST_CONTROLLER;
    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final WordStatusesRestController WORD_STATUSES_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;

    private final WordStatusHistoryService WORD_STATUS_HISTORY_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;

    private final WordStatusHistoryMapping WORD_STATUS_HISTORY_MAPPING;

    @Autowired
    public WordStatusHistoriesRestController(WordsRestController wordsRestController,
                                             CustomersRestController customersRestController,
                                             WordStatusesRestController wordStatusesRestController,
                                             LangsRestController langsRestController,

                                             WordStatusHistoryService wordStatusHistoryService,
                                             CustomerService customerService,

                                             WordStatusHistoryMapping wordStatusHistoryMapping) {
        this.WORDS_REST_CONTROLLER = wordsRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.WORD_STATUSES_REST_CONTROLLER = wordStatusesRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;

        this.WORD_STATUS_HISTORY_SERVICE = wordStatusHistoryService;
        this.CUSTOMER_SERVICE = customerService;

        this.WORD_STATUS_HISTORY_MAPPING = wordStatusHistoryMapping;
    }

    @GetMapping("/get/words_with_current_status")
    public ResponseEntity<?> getAllWordsWithCurrentStatus(@RequestParam(value = "title", required = false) String title,
                                                          @RequestParam(value = "lang_code", required = false) String langCode,
                                                          @RequestParam(value = "word_status_code", required = false) String wordStatusCode,
                                                          @RequestParam(value = "customer_id", required = false, defaultValue = "0")
                                                              Long customerId,
                                                          @RequestParam(value = "number_of_items", required = false, defaultValue = "0")
                                                              Long numberOfItems,
                                                          @RequestParam(value = "last_word_status_history_id_on_previous_page", required = false, defaultValue = "0")
                                                              Long lastWordStatusHistoryIdOnPreviousPage) {
        if (langCode != null) {
            ResponseEntity<?> response = LANGS_REST_CONTROLLER.find(langCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        if (wordStatusCode != null) {
            ResponseEntity<?> response = WORD_STATUSES_REST_CONTROLLER.find(wordStatusCode);
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
                    new ResponseMessageResponseDTO(1, "Количество записей не должно быть отрицательным");
            return ResponseEntity.badRequest().body(message);
        }


        if (lastWordStatusHistoryIdOnPreviousPage == null || lastWordStatusHistoryIdOnPreviousPage < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(2,
                            "ID последнего слова на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0");
            return ResponseEntity.badRequest().body(message);
        }

        List<WordStatusHistory> wordStatusHistories = WORD_STATUS_HISTORY_SERVICE.findAllWordsWithCurrentStatus(
                title, langCode, wordStatusCode, customerId, numberOfItems, lastWordStatusHistoryIdOnPreviousPage);
        if (wordStatusHistories != null && wordStatusHistories.size() > 0) {
            List<WordStatusHistoryResponseDTO> responseDTOs = wordStatusHistories
                    .stream()
                    .map(WORD_STATUS_HISTORY_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "История слов по указанным фильтрам не найдена");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/get/word_changes_history")
    public ResponseEntity<?> getAllWordChangesHistory(@RequestParam("word_id") Long wordId) {
        ResponseEntity<?> response = WORDS_REST_CONTROLLER.find(wordId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<WordStatusHistory> wordStatusHistories = WORD_STATUS_HISTORY_SERVICE.findAllWordChangesHistory(wordId);
        if (wordStatusHistories != null && wordStatusHistories.size() > 0) {
            List<WordStatusHistoryResponseDTO> responseDTOs = wordStatusHistories
                    .stream()
                    .map(WORD_STATUS_HISTORY_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("История изменений слова с id = '%d' не найдена", wordId));
            return ResponseEntity.badRequest().body(message);
        }
    }



    @PostMapping("/add/word_status_to_words_without_status")
    public ResponseEntity<?> addWordStatusToWordsWithoutStatus(HttpServletRequest request,
                                                               @RequestBody EntityStringRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        String wordStatusCode = dto.getValue();
        response = WORD_STATUSES_REST_CONTROLLER.find(wordStatusCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (CUSTOMER_SERVICE.isSuperUser(customer)) {
            WORD_STATUS_HISTORY_SERVICE.addWordStatusToWordsWithoutStatus(wordStatusCode);
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Статусы к словам без статуса успешно добавлены");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав");
            return ResponseEntity.badRequest().body(message);
        }
    }
}
