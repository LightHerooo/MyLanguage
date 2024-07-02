package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.request.WordInCollectionAddRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.EntityAuthKeyRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.EntityIdRequestDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.WordInCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.wordincollection.response.WordInCollectionResponseDTO;
import ru.herooo.mylanguageweb.services.*;

import java.util.List;

@RestController
@RequestMapping("/api/words_in_collection")
public class WordsInCollectionRestController {

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final CustomerCollectionsRestController CUSTOMER_COLLECTIONS_REST_CONTROLLER;
    private final WordsRestController WORDS_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;

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
            LangsRestController langsRestController,

            CustomerService customerService,
            WordService wordService,
            CustomerCollectionService customerCollectionService,
            WordInCollectionService wordInCollectionService,

            WordInCollectionMapping wordInCollectionMapping) {
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.CUSTOMER_COLLECTIONS_REST_CONTROLLER = customerCollectionsRestController;
        this.WORDS_REST_CONTROLLER = wordsRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;

        this.CUSTOMER_SERVICE = customerService;
        this.WORD_SERVICE = wordService;
        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.WORD_IN_COLLECTION_SERVICE = wordInCollectionService;

        this.WORD_IN_COLLECTION_MAPPING = wordInCollectionMapping;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAll(
            @RequestParam("customer_collection_id") Long customerCollectionId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "number_of_items", required = false, defaultValue = "0") Long numberOfItems,
            @RequestParam(value = "last_word_in_collection_id_on_previous_page", required = false, defaultValue = "0")
                Long lastWordInCollectionIdOnPreviousPage) {
        // Проверяем существование коллекции
        ResponseEntity<?> response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.find(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем активность языка коллекции
        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.validateIsLangActive(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (numberOfItems == null || numberOfItems < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(1, "Количество записей не должно быть отприцательным.");
            return ResponseEntity.badRequest().body(message);
        }

        if (lastWordInCollectionIdOnPreviousPage == null || lastWordInCollectionIdOnPreviousPage < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(2,
                    "ID последнего слова в коллекции предыдущей страницы не должен быть отрицательным. " +
                            "Если вы хотите отобразить первую страницу, укажите ID = 0.");
            return ResponseEntity.badRequest().body(message);
        }

        List<WordInCollection> wordsInCollection = WORD_IN_COLLECTION_SERVICE.
                findAll(customerCollectionId, title, numberOfItems, lastWordInCollectionIdOnPreviousPage);
        if (wordsInCollection != null && wordsInCollection.size() > 0) {
            List<WordInCollectionResponseDTO> wordsDTO =
                    wordsInCollection.stream().map(WORD_IN_COLLECTION_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(wordsDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(5,
                    "Слова в коллекции по указанным фильтрам не найдены.");
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
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Указанного слова нет в коллекции");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/word_in_collection")
    public ResponseEntity<?> find(@RequestParam("word_id") Long wordId,
                                  @RequestParam("customer_collection_id") Long customerCollectionId) {
        ResponseEntity<?> response = WORDS_REST_CONTROLLER.find(wordId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.find(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Word word = WORD_SERVICE.find(wordId);
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(customerCollectionId);
        WordInCollection wordInCollection =
                WORD_IN_COLLECTION_SERVICE.find(word, collection);
        if (wordInCollection != null) {
            WordInCollectionResponseDTO dto = WORD_IN_COLLECTION_MAPPING
                    .mapToResponseDTO(wordInCollection);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Указанного слова нет в коллекции.");
            return ResponseEntity.badRequest().body(message);
        }
    }
    


    @PostMapping("/add")
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @RequestBody WordInCollectionAddRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeAdd(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE.add(dto);
        if (wordInCollection != null) {
            WordInCollectionResponseDTO responseDTO = WORD_IN_COLLECTION_MAPPING.mapToResponseDTO(wordInCollection);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                    "Произошла ошибка при добавлении слова в коллекцию.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/validate/before_add")
    public ResponseEntity<?> validateBeforeAdd(HttpServletRequest request,
                                               @RequestBody WordInCollectionAddRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(dto.getAuthKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем существование коллекции
        long customerCollectionId = dto.getCustomerCollectionId();
        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.find(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем существование слова
        long wordId = dto.getWordId();
        response = WORDS_REST_CONTROLLER.find(wordId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем активность языка
        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.find(customerCollectionId);
        response = LANGS_REST_CONTROLLER.validateIsActiveForIn(customerCollection.getLang().getCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем принадлежность пользователя к коллекции, с которой он хочет взаимодействовать
        Customer authCustomer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.validateIsAuthor(authCustomer.getId(), customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем, совпадает ли язык слова с языком коллекции
        Word word = WORD_SERVICE.find(wordId);
        if (!word.getLang().equals(customerCollection.getLang())) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Язык слова (%s) не совпадает с языком коллекции (%s)",
                            word.getLang().getTitle(), customerCollection.getLang().getTitle()));
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем активность коллекции для автора
        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.validateIsActiveForAuthor(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем наличие слова в коллекции
        response = find(dto.getWordId(), dto.getCustomerCollectionId());
        if (response.getStatusCode() == HttpStatus.OK) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(999, "Это слово уже есть в коллекции.");
            return ResponseEntity.badRequest().body(message);
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Данные для добавления корректны.");
        return ResponseEntity.ok(message);
    }

    @PostMapping("/validate/before_delete")
    public ResponseEntity<?> validateBeforeDelete(HttpServletRequest request,
                                                  @RequestBody EntityIdRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(dto.getAuthKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем существование слова в коллекции
        long wordInCollectionId = dto.getId();
        response = find(wordInCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем принадлежность пользователя к коллекции, с которой он хочет взаимодействовать
        WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE.find(wordInCollectionId);
        CustomerCollection collection = wordInCollection.getCustomerCollection();
        Customer authCustomer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.validateIsAuthor(authCustomer.getId(), collection.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем активность коллекции для автора
        response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.validateIsActiveForAuthor(collection.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Данные для удаления корректны.");
        return ResponseEntity.ok(message);
    }
    


    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(HttpServletRequest request,
                                    @RequestBody EntityIdRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeDelete(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE.find(dto.getId());
        WORD_IN_COLLECTION_SERVICE.delete(wordInCollection);

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                String.format("Слово '%s' успешно удалено из коллекции '%s'.",
                        wordInCollection.getWord().getTitle(), wordInCollection.getCustomerCollection().getTitle()));
        return ResponseEntity.ok(message);
    }

    @DeleteMapping("/delete/all_without_active_status")
    public ResponseEntity<?> deleteAllWithoutActiveStatus(HttpServletRequest request,
                                                          @RequestBody EntityAuthKeyRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        WORD_IN_COLLECTION_SERVICE.deleteAllWithoutActiveStatus();
        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                "Неактивные слова в коллекциях пользователей успешно удалены.");
        return ResponseEntity.ok(message);
    }
}
