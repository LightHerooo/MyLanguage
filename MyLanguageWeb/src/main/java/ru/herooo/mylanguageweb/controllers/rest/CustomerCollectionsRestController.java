package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.types.CustomerCollectionsWithLangStatistic;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.other.LongResponse;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.types.CustomerCollectionsWithLangStatisticResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerCollectionService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;
import ru.herooo.mylanguageweb.services.WordInCollectionService;

import java.util.*;

@RestController
@RequestMapping("/api/customer_collections")
public class CustomerCollectionsRestController {

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;

    private final CustomerCollectionService CUSTOMER_COLLECTION_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;
    private final WordInCollectionService WORD_IN_COLLECTION_SERVICE;

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;

    @Autowired
    public CustomerCollectionsRestController(CustomersRestController customersRestController,
                                             LangsRestController langsRestController,
                                             CustomerCollectionService customerCollectionService,
                                             CustomerService customerService,
                                             WordInCollectionService wordInCollectionService,
                                             CustomerCollectionMapping customerCollectionMapping) {
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;

        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_IN_COLLECTION_SERVICE = wordInCollectionService;

        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
    }

    @GetMapping("/by_customer_id")
    public ResponseEntity<?> getAll(
            @RequestParam("customer_id") Long customerId) {
        List<CustomerCollection> collections = CUSTOMER_COLLECTION_SERVICE.findAll(customerId);
        if (collections != null && collections.size() > 0) {
            List<CustomerCollectionResponseDTO> collectionsDTO =
                    collections.stream().map(CUSTOMER_COLLECTION_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(collectionsDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "У пользователя нет коллекций.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/customer_collections_with_lang_statistics_by_customer_id")
    public ResponseEntity<?> getCustomerCollectionsWithFlagStatistics(@RequestParam("customer_id") Long customerId) {
        List<CustomerCollectionsWithLangStatistic> statistics = CUSTOMER_COLLECTION_SERVICE
                .findCustomerCollectionsWithLangStatistics(customerId);
        if (statistics != null && statistics.size() > 0) {
            List<CustomerCollectionsWithLangStatisticResponseDTO> responseDTOs = statistics
                    .stream()
                    .map(CustomerCollectionsWithLangStatisticResponseDTO::new)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Не удалось получить статистику по коллекциям у пользователя с id = '%d'",
                            customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/copy_by_key")
    public ResponseEntity<?> copyByKey(HttpServletRequest request,
                                       @Valid @RequestBody CustomerCollectionRequestDTO dto,
                                       BindingResult bindingResult) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto, bindingResult);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = find(dto.getKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = validateIsLangActiveInCollection(dto.getKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем количество слов в коллекции, которую хотим скопировать
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(dto.getKey());
        long numberOfWords = WORD_IN_COLLECTION_SERVICE.count(collection.getKey());
        if (numberOfWords == 0) {
            CustomResponseMessage message = new CustomResponseMessage(1, "В указанной коллекции нет слов.");
            return ResponseEntity.badRequest().body(message);
        }

        Customer authCustomer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        collection = CUSTOMER_COLLECTION_SERVICE.copy(collection, dto.getTitle(), authCustomer);
        if (collection != null) {
            CustomerCollectionResponseDTO responseDTO = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    "Произошла ошибка создания коллекции по ключу.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @Valid @RequestBody CustomerCollectionRequestDTO dto,
                                 BindingResult bindingResult) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto, bindingResult);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем язык
        response = LANGS_REST_CONTROLLER.find(dto.getLangCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.add(dto);
        if (collection != null) {
            CustomerCollectionResponseDTO responseDTO = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Произошла ошибка при добавлении коллекции.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(id);
        if (collection != null) {
            CustomerCollectionResponseDTO dto = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Коллекция с id = '%d' не найдена.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_key")
    public ResponseEntity<?> find(
            @RequestParam("key") String key) {
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(key);

        if (collection != null) {
            CustomerCollectionResponseDTO collectionDTO =
                    CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(collectionDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Коллекции с указанным ключом не существует.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_customer_id_and_key")
    public ResponseEntity<?> find(@RequestParam("customer_id") Long customerId,
                                  @RequestParam("key") String key) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = find(key);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.find(customerId);
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.findByCustomerAndKey(customer, key);
        if (collection != null) {
            CustomerCollectionResponseDTO dto = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message =
                    new CustomResponseMessage(1, "Коллекция не принадлежит пользователю.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/validate/before_crud")
    public ResponseEntity<?> validateBeforeCrud(HttpServletRequest request,
                                                @Valid @RequestBody CustomerCollectionRequestDTO dto,
                                                BindingResult bindingResult) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

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

            CustomResponseMessage message = new CustomResponseMessage(1, errorMessage);
            return ResponseEntity.badRequest().body(message);
        }

        if (dto.getId() == 0) {
            // Проверяем язык
            response = LANGS_REST_CONTROLLER.find(dto.getLangCode());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Проверяем язык на активность
            response = LANGS_REST_CONTROLLER.validateIsActive(dto.getLangCode());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        } else {
            CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(dto.getId());
            response = validateIsLangActiveInCollection(collection.getKey());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        // Проверяем наличие коллекции с таким же названием у создающего
        Customer authCustomer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        CustomerCollection collection =
                CUSTOMER_COLLECTION_SERVICE.findByCustomerAndTitle(authCustomer, dto.getTitle());
        if (collection != null && (dto.getId() == 0 || dto.getId() != collection.getId())) {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    "У вас уже есть коллекция с таким названием.");
            return ResponseEntity.badRequest().body(message);
        }

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/validate/is_lang_active_in_collection_by_key")
    public ResponseEntity<?> validateIsLangActiveInCollection(@RequestParam("key") String key) {
        ResponseEntity<?> response = find(key);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(key);
        response = LANGS_REST_CONTROLLER.validateIsActive(collection.getLang().getCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Коллекция недоступна, так как её язык в данный момент неактивен.");
            return ResponseEntity.badRequest().body(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Язык коллекции активен.");
            return ResponseEntity.ok(message);
        }
    }
}
