package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Word;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.LongResponse;
import ru.herooo.mylanguageweb.dto.wordincollection.WordInCollectionMapping;
import ru.herooo.mylanguageweb.dto.wordincollection.WordInCollectionRequestDTO;
import ru.herooo.mylanguageweb.dto.wordincollection.WordInCollectionResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerCollectionService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WordInCollectionService;
import ru.herooo.mylanguageweb.services.WordService;

import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/words_in_collection")
public class WordsInCollectionRestController {

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;
    private final PartsOfSpeechRestController PARTS_OF_SPEECH_REST_CONTROLLER;
    private final CustomerCollectionsRestController CUSTOMER_COLLECTIONS_REST_CONTROLLER;
    private final WordsRestController WORDS_REST_CONTROLLER;

    private final CustomerService CUSTOMER_SERVICE;
    private final WordService WORD_SERVICE;
    private final CustomerCollectionService CUSTOMER_COLLECTION_SERVICE;
    private final WordInCollectionService WORD_IN_COLLECTION_SERVICE;

    private final WordInCollectionMapping WORD_IN_COLLECTION_MAPPING;

    @Autowired
    public WordsInCollectionRestController(
            CustomersRestController customersRestController,
            LangsRestController langsRestController,
            PartsOfSpeechRestController partsOfSpeechRestController,
           CustomerCollectionsRestController customerCollectionsRestController,
           WordsRestController wordsRestController,
           CustomerService customerService,
           WordService wordService,
           CustomerCollectionService customerCollectionService,
           WordInCollectionService wordInCollectionService,
            WordInCollectionMapping wordInCollectionMapping) {
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;
        this.PARTS_OF_SPEECH_REST_CONTROLLER = partsOfSpeechRestController;
        this.CUSTOMER_COLLECTIONS_REST_CONTROLLER = customerCollectionsRestController;
        this.WORDS_REST_CONTROLLER = wordsRestController;

        this.CUSTOMER_SERVICE = customerService;
        this.WORD_SERVICE = wordService;
        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.WORD_IN_COLLECTION_SERVICE = wordInCollectionService;

        this.WORD_IN_COLLECTION_MAPPING = wordInCollectionMapping;
    }
    @GetMapping("/filtered")
    public ResponseEntity<?> getFilteredInCollection(
            @RequestParam("customer_collection_key") String customerCollectionKey,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode) {
        ResponseEntity<?> responseAfterValidateParameters =
                validateBeforeFilter(customerCollectionKey, langCode, partOfSpeechCode);
        if (responseAfterValidateParameters.getStatusCode() != HttpStatus.OK) {
            return responseAfterValidateParameters;
        }

        List<WordInCollection> wordsInCollection = WORD_IN_COLLECTION_SERVICE.findWordsInCollectionAfterFilter
                (title, langCode, partOfSpeechCode, customerCollectionKey);
        if (wordsInCollection != null && wordsInCollection.size() > 0) {
            List<WordInCollectionResponseDTO> wordsDTO =
                    wordsInCollection.stream().map(WORD_IN_COLLECTION_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(wordsDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    "Слова в коллекции по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/filtered_pagination")
    public ResponseEntity<?> getFilteredInCollectionPagination(
            @RequestParam("customer_collection_key") String customerCollectionKey,
            @RequestParam(value = "number_of_words") Long numberOfWords,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode,
            @RequestParam(value = "last_word_in_collection_id_on_previous_page", required = false, defaultValue = "0")
                Long lastWordInCollectionIdOnPreviousPage) {
        ResponseEntity<?> responseAfterValidateParameters =
                validateBeforeFilter(customerCollectionKey, langCode, partOfSpeechCode);
        if (responseAfterValidateParameters.getStatusCode() != HttpStatus.OK) {
            return responseAfterValidateParameters;
        }

        if (numberOfWords == null || numberOfWords <= 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(3, "Количество слов должно быть больше 0.");
            return ResponseEntity.badRequest().body(message);
        }

        if (lastWordInCollectionIdOnPreviousPage == null || lastWordInCollectionIdOnPreviousPage < 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(4,
                    "ID последнего слова в коллекции предыдущей страницы не должен быть отрицательным. " +
                            "Если вы хотите отобразить первую страницу, укажите ID = 0.");
            return ResponseEntity.badRequest().body(message);
        }

        List<WordInCollection> wordsInCollection = WORD_IN_COLLECTION_SERVICE.
                findWordsInCollectionAfterFilterWithPagination(title, langCode, partOfSpeechCode, customerCollectionKey,
                        numberOfWords, lastWordInCollectionIdOnPreviousPage);
        if (wordsInCollection != null && wordsInCollection.size() > 0) {
            List<WordInCollectionResponseDTO> wordsDTO =
                    wordsInCollection.stream().map(WORD_IN_COLLECTION_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(wordsDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(5,
                    "Слова в коллекции по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/count_by_collection_key")
    public ResponseEntity<?> countByCollectionKey(@ModelAttribute("collection_key") String collectionKey) {
        long countOfWords = WORD_IN_COLLECTION_SERVICE.countByCustomerCollectionKey(collectionKey);

        LongResponse longResponse = new LongResponse(countOfWords);
        return ResponseEntity.ok(longResponse);
    }

    @PostMapping
    public ResponseEntity<?> add(HttpServletRequest request, @RequestBody WordInCollectionRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем код слова
        response = WORDS_REST_CONTROLLER.findById(dto.getWordId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Word word = WORD_SERVICE.findById(dto.getWordId());
        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.findByKey(dto.getCustomerCollectionKey());

        response = validateCustomerCollectionAndWordLangs(dto.getCustomerCollectionKey(), dto.getWordId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE
                .findByWordAndCustomerCollection(word, customerCollection);
        if (wordInCollection == null) {
            wordInCollection = WORD_IN_COLLECTION_SERVICE.add(word, customerCollection);
            WordInCollectionResponseDTO responseDTO = WORD_IN_COLLECTION_MAPPING.mapToResponseDTO(wordInCollection);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Такое слово уже есть в коллекции.");
            return ResponseEntity.badRequest().body(message);
        }

    }

    @DeleteMapping
    public ResponseEntity<?> delete(HttpServletRequest request, @RequestBody WordInCollectionRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = findById(dto.getId());
        if (response.getStatusCode() == HttpStatus.OK) {
            WORD_IN_COLLECTION_SERVICE.deleteById(dto.getId());
        }

        return response;
    }

    @DeleteMapping("/delete_inactive_words_in_collections")
    public ResponseEntity<?> deleteInactiveWordsInCollection(HttpServletRequest request,
                                                             @ModelAttribute("auth_code") String authCode) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, authCode);
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(validateAuthCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findByAuthCode(validateAuthCode);
        if (CUSTOMER_SERVICE.isCustomerSuperUser(customer)) {
            WORD_IN_COLLECTION_SERVICE.deleteInactiveWordsInCollection();
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Неактивные слова успешно удалены из коллекций пользователей.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> findById(@RequestParam("id") Long id) {
        WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE.findById(id);
        if (wordInCollection != null) {
            WordInCollectionResponseDTO dto = WORD_IN_COLLECTION_MAPPING.mapToResponseDTO(wordInCollection);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Слово в коллекции с id = '%s' не найдено.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_collection_key_and_word_id")
    public ResponseEntity<?> findByCollectionKeyAndWordId(@RequestParam("collection_key") String collectionKey,
                                                          @RequestParam("word_id") Long wordId) {
        ResponseEntity<?> response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.findByKey(collectionKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORDS_REST_CONTROLLER.findById(wordId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Word word = WORD_SERVICE.findById(wordId);
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.findByKey(collectionKey);
        WordInCollection wordInCollection =
                WORD_IN_COLLECTION_SERVICE.findByWordAndCustomerCollection(word, collection);
        if (wordInCollection != null) {
            WordInCollectionResponseDTO dto = WORD_IN_COLLECTION_MAPPING
                    .mapToResponseDTO(wordInCollection);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Указанного слова в коллекции не существует.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/before_filter")
    public ResponseEntity<?> validateBeforeFilter(
            @RequestParam("customer_collection_key") String customerCollectionKey,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "part_of_speech_code", required = false) String partOfSpeechCode) {
        ResponseEntity<?> response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.findByKey(customerCollectionKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (langCode != null) {
            response = LANGS_REST_CONTROLLER.findByCode(langCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        if (partOfSpeechCode != null) {
            response = PARTS_OF_SPEECH_REST_CONTROLLER.findByCode(partOfSpeechCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Параметры для фильтрации корректны.");
        return ResponseEntity.ok(message);
    }

    @PostMapping("/validate/before_crud")
    public ResponseEntity<?> validateBeforeCrud(HttpServletRequest request, @RequestBody WordInCollectionRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Если мы хотим изменить/удалить слово
        if (dto.getId() != 0) {
            WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE.findById(dto.getId());
            dto = WORD_IN_COLLECTION_MAPPING.mapToRequestDTO(dto, wordInCollection);
        }

        // Проверяем принадлежность пользователя к коллекции, с которой он хочет взаимодействовать
        Customer authCustomer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.
                findByCustomerIdAndKey(authCustomer.getId(), dto.getCustomerCollectionKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Данные корректны.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/customer_collection_and_word_langs")
    public ResponseEntity<?> validateCustomerCollectionAndWordLangs(
            @RequestParam("customer_collection_key") String customerCollectionKey,
            @RequestParam("word_id") Long wordId) {
        ResponseEntity<?> response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.findByKey(customerCollectionKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORDS_REST_CONTROLLER.findById(wordId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.findByKey(customerCollectionKey);
        if (customerCollection.getLang() == null) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Слово подходит под коллекцию, так как она не имеет языка.");
            return ResponseEntity.ok(message);
        }

        Word word = WORD_SERVICE.findById(wordId);
        if (word.getLang().equals(customerCollection.getLang())) {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    String.format("Языки слова и коллекции совпадают (%s).", customerCollection.getLang().getCode()));
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(3,
                    String.format("Язык слова (%s) не совпадает с языком коллекции (%s)",
                            word.getLang().getCode(), customerCollection.getLang().getCode()));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
