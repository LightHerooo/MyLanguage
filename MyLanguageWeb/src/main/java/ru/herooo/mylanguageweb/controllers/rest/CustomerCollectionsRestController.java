package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.LongResponse;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionAddMoreRequestDTO;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionRequestDTO;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerCollectionService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;
import ru.herooo.mylanguageweb.services.WordInCollectionService;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/customer_collections")
public class CustomerCollectionsRestController {

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;

    private final CustomerCollectionService CUSTOMER_COLLECTION_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;
    private final WordInCollectionService WORD_IN_COLLECTION_SERVICE;
    private final LangService LANG_SERVICE;

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public CustomerCollectionsRestController(CustomersRestController customersRestController,
                                             LangsRestController langsRestController,
                                             CustomerCollectionService customerCollectionService,
                                             CustomerService customerService,
                                             WordInCollectionService wordInCollectionService,
                                             LangService langService,
                                             CustomerCollectionMapping customerCollectionMapping,
                                             StringUtils stringUtils) {
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;

        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_IN_COLLECTION_SERVICE = wordInCollectionService;
        this.LANG_SERVICE = langService;

        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
        this.STRING_UTILS = stringUtils;
    }

    @GetMapping("/by_customer_id")
    public ResponseEntity<?> findAllByCustomerId(
            @RequestParam("id") Long id) {
        List<CustomerCollection> collections = CUSTOMER_COLLECTION_SERVICE.findAllByCustomerOrderById(id);
        if (collections != null && collections.size() > 0) {
            List<CustomerCollectionResponseDTO> collectionsDTO =
                    collections.stream().map(CUSTOMER_COLLECTION_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(collectionsDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "У пользователя нет коллекций.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/count_by_customer_id_and_lang_code")
    public ResponseEntity<?> countByCustomerIdAndLangCode(@RequestParam("customer_id") Long customerId,
                                                          @RequestParam(required = false,
                                                                  value = "lang_code") String langCode) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findById(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (STRING_UTILS.isNotStringVoid(langCode)) {
            response = LANGS_REST_CONTROLLER.findByCode(langCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        Customer customer = CUSTOMER_SERVICE.findById(customerId);
        Lang lang = LANG_SERVICE.findByCode(langCode);

        long countOfCollections = CUSTOMER_COLLECTION_SERVICE.countByCustomerAndLang(customer, lang);
        LongResponse longResponse = new LongResponse(countOfCollections);
        return ResponseEntity.ok(longResponse);
    }

    @GetMapping("/count_by_customer_id")
    public ResponseEntity<?> countByCustomerId(@RequestParam("customer_id") Long customerId) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findById(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findById(customerId);

        long numberOfCollections = CUSTOMER_COLLECTION_SERVICE.countByCustomer(customer);
        LongResponse longResponse = new LongResponse(numberOfCollections);
        return ResponseEntity.ok(longResponse);
    }

    @PostMapping("/copy_by_key")
    public ResponseEntity<?> copyByKey(HttpServletRequest request,
                                       @RequestBody CustomerCollectionRequestDTO dto) {
        // Проверяем AuthCode
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем, нет ли уже такой коллекции у пользователя
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        response = findByCustomerIdAndTitle(customer.getId(), dto.getTitle());
        if (response.getStatusCode() == HttpStatus.OK) {
            return response;
        }

        response = findByKey(dto.getKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем количество слов в коллекции, которую хотим скопировать
        long numberOfWords = WORD_IN_COLLECTION_SERVICE.countByCustomerCollectionKey(dto.getKey());
        if (numberOfWords == 0) {
            CustomResponseMessage message = new CustomResponseMessage(1, "В указанной коллекции нет слов.");
            return ResponseEntity.badRequest().body(message);
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.cloneByKey(dto);
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
    public ResponseEntity<?> add(HttpServletRequest request, @RequestBody CustomerCollectionRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем язык
        String langCode = dto.getLangCode();
        if (STRING_UTILS.isNotStringVoid(langCode)) {
            response = LANGS_REST_CONTROLLER.findByCode(langCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        // Проверяем, нет ли у пользователя коллекции с таким названием
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        response = findByCustomerIdAndTitle(customer.getId(), dto.getTitle());
        if (response.getStatusCode() == HttpStatus.OK) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "У вас уже есть коллекция с таким названием.");
            return ResponseEntity.badRequest().body(message);
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

    @PostMapping("/add_several")
    public ResponseEntity<?> addMore(HttpServletRequest request,
                                     @RequestBody CustomerCollectionAddMoreRequestDTO dto) {
        // Проверяем AuthCode
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем количество (должно быть > 0)
        if (dto.getCustomerCollections().length == 0) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Коллекции не указаны.");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем, нет ли повторных названий коллекций
        Set<String> titles =
                Arrays.stream(dto.getCustomerCollections())
                        .map(collection -> collection.getTitle().toLowerCase().trim())
                        .collect(Collectors.toSet());
        if (titles.size() != dto.getCustomerCollections().length) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Названия коллекций не могут повторяться.");
            return ResponseEntity.badRequest().body(message);
        }

        // Добавляем коллекции
        List<CustomerCollectionRequestDTO> badRequestDTOs = new ArrayList<>();
        for (CustomerCollectionRequestDTO requestDTO: dto.getCustomerCollections()) {
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
                    String.format("Добавлено %d из %d коллекций.\nНе добавлены: [%s]",
                            dto.getCustomerCollections().length,
                            dto.getCustomerCollections().length - badRequestDTOs.size(),
                            badTitles));
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    String.format("Добавлено %d из %d коллекций",
                            dto.getCustomerCollections().length,
                            dto.getCustomerCollections().length));
            return ResponseEntity.ok(message);
        }
    }

    @GetMapping("/find/by_key")
    public ResponseEntity<?> findByKey(
            @RequestParam("key") String key) {
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.findByKey(key);
        if (collection != null) {
            CustomerCollectionResponseDTO collectionDTO =
                    CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(collectionDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Коллекция с указанным ключом не существует.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_customer_id_and_key")
    public ResponseEntity<?> findByCustomerIdAndKey(@RequestParam("customer_id") Long customerId,
                                                    @RequestParam("key") String key) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findById(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = findByKey(key);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findById(customerId);
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

    @GetMapping("/find/by_customer_id_and_title")
    public ResponseEntity<?> findByCustomerIdAndTitle(@RequestParam("customer_id") Long id,
                                                      @RequestParam("title") String title)
    {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findById(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findById(id);
        CustomerCollection customerCollection =
                CUSTOMER_COLLECTION_SERVICE.findByCustomerAndTitleIgnoreCase(customer, title);
        if (customerCollection != null) {
            CustomerCollectionResponseDTO dto = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(customerCollection);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Коллекция с названием '%s' у данного пользователя не найдена.", title));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/validate/before_crud")
    public ResponseEntity<?> validateBeforeCrud(HttpServletRequest request,
                                                @RequestBody CustomerCollectionRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Преобразуем строку
        String title = STRING_UTILS.getClearString(dto.getTitle());
        dto.setTitle(title);

        return ResponseEntity.ok(dto);
    }
}
