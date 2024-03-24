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
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.other.LongResponse;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.WordInCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.WordInCollectionRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.WordInCollectionResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerCollectionService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WordInCollectionService;
import ru.herooo.mylanguageweb.services.WordService;

import java.util.List;

@RestController
@RequestMapping("/api/words_in_collection")
public class WordsInCollectionRestController {

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
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
            CustomerCollectionsRestController customerCollectionsRestController,
            WordsRestController wordsRestController,

            CustomerService customerService,
            WordService wordService,
            CustomerCollectionService customerCollectionService,
            WordInCollectionService wordInCollectionService,

            WordInCollectionMapping wordInCollectionMapping) {
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.CUSTOMER_COLLECTIONS_REST_CONTROLLER = customerCollectionsRestController;
        this.WORDS_REST_CONTROLLER = wordsRestController;

        this.CUSTOMER_SERVICE = customerService;
        this.WORD_SERVICE = wordService;
        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.WORD_IN_COLLECTION_SERVICE = wordInCollectionService;

        this.WORD_IN_COLLECTION_MAPPING = wordInCollectionMapping;
    }

    @GetMapping("/filtered")
    public ResponseEntity<?> getAll(
            @RequestParam("collection_id") Long collectionId,
            @RequestParam(value = "title", required = false) String title) {
        ResponseEntity<?> response = validateBeforeFilter(collectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<WordInCollection> wordsInCollection = WORD_IN_COLLECTION_SERVICE.findAll
                (title, collectionId);
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
    public ResponseEntity<?> getAll(
            @RequestParam("collection_id") Long collectionId,
            @RequestParam(value = "number_of_words") Long numberOfWords,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "last_word_in_collection_id_on_previous_page", required = false, defaultValue = "0")
                Long lastWordInCollectionIdOnPreviousPage) {
        ResponseEntity<?> response = validateBeforeFilter(collectionId, numberOfWords,
                lastWordInCollectionIdOnPreviousPage);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
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
                findAll(title, collectionId, numberOfWords, lastWordInCollectionIdOnPreviousPage);
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

    @GetMapping("/count_by_collection_id")
    public ResponseEntity<?> getCount(@ModelAttribute("collection_id") Long collectionId) {
        long countOfWords = WORD_IN_COLLECTION_SERVICE.count(collectionId);

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
        response = WORDS_REST_CONTROLLER.find(dto.getWordId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем, совпадают ли языки слова и коллекции
        response = validateLangsInWordAndCollection(dto.getWordId(), dto.getCollectionId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Word word = WORD_SERVICE.findById(dto.getWordId());
        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.find(dto.getCollectionId());
        WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE
                .find(word, customerCollection);
        if (wordInCollection != null) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Это слово уже есть в коллекции.");
            return ResponseEntity.badRequest().body(message);
        }

        wordInCollection = WORD_IN_COLLECTION_SERVICE.add(dto);
        if (wordInCollection != null) {
            WordInCollectionResponseDTO responseDTO = WORD_IN_COLLECTION_MAPPING.mapToResponseDTO(wordInCollection);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    "Произошла ошибка при добавлении слова в коллекцию.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> delete(HttpServletRequest request, @RequestBody WordInCollectionRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE.find(dto.getId());
        WORD_IN_COLLECTION_SERVICE.delete(wordInCollection);

        CustomResponseMessage message = new CustomResponseMessage(1,
                String.format("Слово '%s' успешно удалено из коллекции '%s'.",
                        wordInCollection.getWord().getTitle(), wordInCollection.getCustomerCollection().getTitle()));
        return ResponseEntity.ok(message);
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
        if (CUSTOMER_SERVICE.isSuperUser(customer)) {
            WORD_IN_COLLECTION_SERVICE.deleteAllWithoutActiveStatus();
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Неактивные слова в коллекциях пользователей успешно удалены.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
        WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE.find(id);
        if (wordInCollection != null) {
            WordInCollectionResponseDTO dto = WORD_IN_COLLECTION_MAPPING.mapToResponseDTO(wordInCollection);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Слово в коллекции с id = '%s' не найдено.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/word_in_collection")
    public ResponseEntity<?> find(@RequestParam("word_id") Long wordId,
                                  @RequestParam("collection_id") Long collectionId) {
        ResponseEntity<?> response = WORDS_REST_CONTROLLER.find(wordId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.find(collectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Word word = WORD_SERVICE.findById(wordId);
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(collectionId);
        WordInCollection wordInCollection =
                WORD_IN_COLLECTION_SERVICE.find(word, collection);
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
            @RequestParam("collection_id") Long collectionId) {
        ResponseEntity<?> response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.find(collectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.validateIsLangActiveById(collectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Параметры для фильтрации корректны.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/before_filter_pagination")
    public ResponseEntity<?> validateBeforeFilter(
            @RequestParam("collection_id") Long collectionId,
            @RequestParam("number_of_words") Long numberOfWords,
            @RequestParam(value = "last_word_in_collection_id_on_previous_page", required = false, defaultValue = "0")
            Long lastWordInCollectionIdOnPreviousPage) {
        ResponseEntity<?> response = validateBeforeFilter(collectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (numberOfWords == null || numberOfWords <= 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(1, "Количество слов должно быть больше 0.");
            return ResponseEntity.badRequest().body(message);
        }


        if (lastWordInCollectionIdOnPreviousPage == null || lastWordInCollectionIdOnPreviousPage < 0) {
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
    public ResponseEntity<?> validateBeforeCrud(HttpServletRequest request, @RequestBody WordInCollectionRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        long collectionId;
        Customer authCustomer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        if (dto.getId() != 0) {
            // Если слово в коллекции не новое, достаём ключ коллекции из этого слова
            response = find(dto.getId());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE.find(dto.getId());
            collectionId = wordInCollection.getCustomerCollection().getId();
        } else {
            collectionId = dto.getCollectionId();
        }

        // Проверяем принадлежность пользователя к коллекции, с которой он хочет взаимодействовать
        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.
                validateIsAuthor(authCustomer.getId(), collectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Данные корректны.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/langs_in_word_and_collection")
    public ResponseEntity<?> validateLangsInWordAndCollection(
            @RequestParam("word_id") Long wordId,
            @RequestParam("collection_id") Long collectionId) {
        ResponseEntity<?> response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.find(collectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORDS_REST_CONTROLLER.find(wordId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.find(collectionId);
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
