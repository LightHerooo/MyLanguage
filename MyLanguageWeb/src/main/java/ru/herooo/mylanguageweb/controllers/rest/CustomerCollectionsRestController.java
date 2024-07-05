package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.herooo.mylanguagedb.entities.*;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.entities.customer_collection.types.CustomerCollectionsStatistic;
import ru.herooo.mylanguagedb.entities.workout.Workout;
import ru.herooo.mylanguageutils.file.MimeTypeWithSize;
import ru.herooo.mylanguageutils.file.filesize.FileSize;
import ru.herooo.mylanguageutils.file.filesize.FileSizeUnits;
import ru.herooo.mylanguageutils.file.mimetype.ImageMimeTypes;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangs;
import ru.herooo.mylanguageweb.controllers.common.ControllerUtils;
import ru.herooo.mylanguageweb.dto.entity.customercollection.request.CustomerCollectionEditRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.EntityIdRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.edit.b.EntityEditBooleanByIdRequestDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.request.CustomerCollectionAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.response.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.other.response.value.LongResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.types.statistic.CustomerCollectionsStatisticMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.types.statistic.CustomerCollectionsStatisticResponseDTO;
import ru.herooo.mylanguageweb.services.*;

import java.util.*;

@RestController
@RequestMapping("/api/customer_collections")
public class CustomerCollectionsRestController {
    private final MimeTypeWithSize[] ACCEPTED_MIME_TYPES_WITH_SIZE_FOR_IMAGE = new MimeTypeWithSize[] {
            new MimeTypeWithSize(ImageMimeTypes.PNG.MIME_TYPE, new FileSize(FileSizeUnits.MB, 5)),
            new MimeTypeWithSize(ImageMimeTypes.JPG.MIME_TYPE, new FileSize(FileSizeUnits.MB, 5)),
            new MimeTypeWithSize(ImageMimeTypes.JPEG.MIME_TYPE, new FileSize(FileSizeUnits.MB, 5)),
            new MimeTypeWithSize(ImageMimeTypes.GIF.MIME_TYPE, new FileSize(FileSizeUnits.MB, 1)),
    };

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;
    private final WorkoutsRestController WORKOUTS_REST_CONTROLLER;

    private final CustomerCollectionService CUSTOMER_COLLECTION_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;
    private final WordInCollectionService WORD_IN_COLLECTION_SERVICE;
    private final WorkoutService WORKOUT_SERVICE;
    private final WorkoutItemService WORKOUT_ITEM_SERVICE;
    private final WordService WORD_SERVICE;
    private final LangService LANG_SERVICE;

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;
    private final CustomerCollectionsStatisticMapping CUSTOMER_COLLECTIONS_WITH_LANG_STATISTIC_MAPPING;

    private final ControllerUtils CONTROLLER_UTILS;

    @Autowired
    public CustomerCollectionsRestController(CustomersRestController customersRestController,
                                             LangsRestController langsRestController,
                                             @Lazy WorkoutsRestController workoutsRestController,

                                             CustomerCollectionService customerCollectionService,
                                             CustomerService customerService,
                                             WordInCollectionService wordInCollectionService,
                                             WorkoutService workoutService,
                                             WorkoutItemService workoutItemService,
                                             WordService wordService,
                                             LangService langService,

                                             CustomerCollectionMapping customerCollectionMapping,
                                             CustomerCollectionsStatisticMapping customerCollectionsStatisticMapping,
                                             ControllerUtils controllerUtils) {
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;
        this.WORKOUTS_REST_CONTROLLER = workoutsRestController;

        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.CUSTOMER_SERVICE = customerService;
        this.WORD_IN_COLLECTION_SERVICE = wordInCollectionService;
        this.WORKOUT_SERVICE = workoutService;
        this.WORKOUT_ITEM_SERVICE = workoutItemService;
        this.WORD_SERVICE = wordService;
        this.LANG_SERVICE = langService;

        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
        this.CUSTOMER_COLLECTIONS_WITH_LANG_STATISTIC_MAPPING = customerCollectionsStatisticMapping;
        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAll(
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "is_active_for_author", required = false) Boolean isActiveForAuthor,
            @RequestParam(value = "customer_id", required = false, defaultValue = "0") Long customerId,
            @RequestParam(value = "number_of_items", required = false, defaultValue = "0") Long numberOfItems,
            @RequestParam(value = "last_customer_collection_id_on_previous_page", required = false, defaultValue = "0")
            Long lastCustomerCollectionIdOnPreviousPage) {
        if (langCode != null) {
            ResponseEntity<?> response = LANGS_REST_CONTROLLER.find(langCode);
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
                    new ResponseMessageResponseDTO(2, "Количество записей не должно быть отрицательным");
            return ResponseEntity.badRequest().body(message);
        }


        if (lastCustomerCollectionIdOnPreviousPage == null || lastCustomerCollectionIdOnPreviousPage < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(3,
                            "ID последней коллекции на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0");
            return ResponseEntity.badRequest().body(message);
        }

        List<CustomerCollection> collections = CUSTOMER_COLLECTION_SERVICE.findAll(
                title, langCode, isActiveForAuthor, customerId, numberOfItems, lastCustomerCollectionIdOnPreviousPage);
        if (collections != null && collections.size() > 0) {
            List<CustomerCollectionResponseDTO> collectionsDTO =
                    collections.stream().map(CUSTOMER_COLLECTION_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(collectionsDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Коллекции по указанным фильтрам не найдены");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/get/for_author/by_lang_out_code")
    public ResponseEntity<?> getAllForAuthorByLangOutCode(@RequestParam("lang_out_code") String langOutCode,
                                                          @RequestParam("customer_id") Long customerId) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = LANGS_REST_CONTROLLER.validateIsActiveForOut(langOutCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = LANGS_REST_CONTROLLER.tryToCreateYandexLangs();
        if (response.getBody() instanceof YandexLangs yandexLangs) {
            List<CustomerCollection> collections = CUSTOMER_COLLECTION_SERVICE.findAll(
                    null,null, true, customerId);

            Lang langOut = LANG_SERVICE.find(langOutCode);
            List<String> langInCodes = yandexLangs
                    .getLangInCodes(langOut.getCode());

            List<CustomerCollection> result = new ArrayList<>();
            for (CustomerCollection collection: collections) {
                for (String langInCode: langInCodes) {
                    if (collection.getLang().getCode().equals(langInCode)) {
                        result.add(collection);
                        break;
                    }
                }
            }

            List<CustomerCollectionResponseDTO> responseDTOs = result
                    .stream()
                    .map(CUSTOMER_COLLECTION_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Неизвестная ошибка обращения к API");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/customer_statistic")
    public ResponseEntity<?> getCustomerStatistic(@RequestParam("customer_id") Long customerId) {
        List<CustomerCollectionsStatistic> statistics = CUSTOMER_COLLECTION_SERVICE.findCustomerStatistic(customerId);
        if (statistics != null && statistics.size() > 0) {
            List<CustomerCollectionsStatisticResponseDTO> responseDTOs = statistics
                    .stream()
                    .map(CUSTOMER_COLLECTIONS_WITH_LANG_STATISTIC_MAPPING::mapToResponse)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Не удалось получить статистику по коллекциям у пользователя с id = '%d'",
                            customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/count/for_author")
    public ResponseEntity<?> getCountForAuthor(@RequestParam("is_active_for_author") Boolean isActiveForAuthor,
                                               @RequestParam("customer_id") Long customerId) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        long numberOfCollections = CUSTOMER_COLLECTION_SERVICE.count(isActiveForAuthor, customerId);
        return ResponseEntity.ok(new LongResponseDTO(numberOfCollections));
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(id);
        if (collection != null) {
            CustomerCollectionResponseDTO dto = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Коллекция с id = '%d' не найдена", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_customer_and_title")
    public ResponseEntity<?> findByCustomerAndTitle(@RequestParam("customer_id") Long customerId,
                                                    @RequestParam("title") String title) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.find(customerId);
        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.findByCustomerAndTitle(customer, title);
        if (customerCollection != null) {
            CustomerCollectionResponseDTO responseDTO = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(customerCollection);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    String.format("Коллекции с названием '%s' у пользователя не существует", title));
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/exists/by_customer_and_title")
    public ResponseEntity<?> isExistsByCustomerAndTitle(@RequestParam("customer_id") Long customerId,
                                                        @RequestParam("title") String title) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }
        
        Customer customer = CUSTOMER_SERVICE.find(customerId);
        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.findByCustomerAndTitle(customer, title);
        if (customerCollection != null) {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1, 
                    "У вас уже есть коллекция с таким названием");
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    String.format("Коллекции с названием '%s' у пользователя не существует", title));
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }
            
    @GetMapping("/validate/is_author")
    public ResponseEntity<?> validateIsAuthor(@RequestParam("customer_id") Long customerId,
                                              @RequestParam("customer_collection_id") Long customerCollectionId) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = find(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.find(customerId);
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(customerCollectionId);
        if (customer.equals(collection.getCustomer())) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Коллекция принадлежит пользователю");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Коллекция не принадлежит пользователю");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/is_lang_active")
    public ResponseEntity<?> validateIsLangActive(@RequestParam("id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(id);
        response = LANGS_REST_CONTROLLER.validateIsActiveForIn(collection.getLang().getCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Коллекция недоступна, так как её язык в данный момент неактивен");
            return ResponseEntity.badRequest().body(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Язык коллекции активен");
            return ResponseEntity.ok(message);
        }
    }

    @GetMapping("/validate/is_active_for_author")
    public ResponseEntity<?> validateIsActiveForAuthor(@RequestParam("id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(id);
        if (collection.isActiveForAuthor()) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Коллекция активна для автора");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Коллекция неактивна для автора");
            return ResponseEntity.badRequest().body(message);
        }
    }




    @PostMapping("/add")
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @Valid @RequestBody CustomerCollectionAddRequestDTO dto,
                                 BindingResult bindingResult) {
        ResponseEntity<?> response = validateBeforeAdd(request, dto, bindingResult);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.add(dto);
        if (collection != null) {
            CustomerCollectionResponseDTO responseDTO = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Произошла ошибка при добавлении коллекции");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/add/by_workout")
    public ResponseEntity<?> addByWorkout(HttpServletRequest request,
                                          @RequestBody EntityIdRequestDTO dto,
                                          BindingResult bindingResult) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Ищем тренировку
        long workoutId = dto.getId();
        response = WORKOUTS_REST_CONTROLLER.find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Тренировка должна быть завершена
        Workout workout = WORKOUT_SERVICE.find(workoutId);
        response = WORKOUTS_REST_CONTROLLER.validateIsOver(workout.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Создаём коллекцию на основе тренировки
        CustomerCollectionAddRequestDTO collectionRequestDTO = new CustomerCollectionAddRequestDTO();

        WorkoutType workoutType = workout.getWorkoutType();
        String title = workoutType != null
                ? String.format("%s (%d)", workout.getWorkoutType().getTitle(), workoutId)
                : String.format("Коллекция (%d)", workoutId);
        collectionRequestDTO.setTitle(title);

        Lang lang = workout.getLangIn();
        if (lang != null) {
            collectionRequestDTO.setLangCode(lang.getCode());
        }

        collectionRequestDTO.setAuthKey(validateAuthKey);

        response = add(request, collectionRequestDTO, bindingResult);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        } else if (response.getBody() instanceof CustomerCollectionResponseDTO responseDTO) {
            CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(responseDTO.getId());

            // Ищем слова в тренировке в первом раунде
            List<WorkoutItem> workoutItems = WORKOUT_ITEM_SERVICE.findAll(
                    workoutId, true, 1);
            if (workoutItems != null && workoutItems.size() > 0) {
                for (WorkoutItem workoutItem: workoutItems) {
                    Word word = WORD_SERVICE.findFirstByTitleIgnoreCaseAndLang(
                            workoutItem.getQuestion(), lang);
                    if (word != null) {
                        // Создаём слово в коллекции
                        WordInCollection wordInCollection = new WordInCollection();
                        wordInCollection.setCustomerCollection(collection);
                        wordInCollection.setWord(word);
                        WORD_IN_COLLECTION_SERVICE.add(wordInCollection);
                    }
                }

                return ResponseEntity.ok(responseDTO);
            } else {
                CUSTOMER_COLLECTION_SERVICE.delete(collection);

                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                        "Не удалось получить слова из тренировки");
                return ResponseEntity.badRequest().body(message);
            }
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                    "Неизвестная ошибка создания коллекции по коду тренировки");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/validate/before_add")
    public ResponseEntity<?> validateBeforeAdd(HttpServletRequest request,
                                               @Valid @RequestBody CustomerCollectionAddRequestDTO dto,
                                               BindingResult bindingResult) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(dto.getAuthKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем наличие ошибок привязки DTO
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult
                    .getAllErrors()
                    .stream()
                    .findAny()
                    .get()
                    .getDefaultMessage();

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, errorMessage);
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

        // Проверяем наличие коллекции с таким же названием у создающего
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        response = this.isExistsByCustomerAndTitle(customer.getId(), dto.getTitle());
        if (response.getStatusCode() == HttpStatus.OK) {
            ResponseMessageResponseDTO message = (ResponseMessageResponseDTO) response.getBody();
            return ResponseEntity.badRequest().body(message);
        }

        CustomerCollection collection =
                CUSTOMER_COLLECTION_SERVICE.findByCustomerAndTitle(customer, dto.getTitle());
        if (collection != null) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                    "У вас уже есть коллекция с таким названием");
            return ResponseEntity.badRequest().body(message);
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                "Данные для добавления коллекции корректны");
        return ResponseEntity.ok(message);
    }

    @PostMapping("/validate/before_add/workout")
    public ResponseEntity<?> validateBeforeAddWorkout(HttpServletRequest request,
                                                      @RequestBody EntityIdRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        // Проверяем пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем существование коллекции
        long customerCollectionId = dto.getId();
        response = find(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Коллекция должна принадлежать пользователю
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        response = validateIsAuthor(customer.getId(), customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Коллекция должна быть активна для пользователя
        response = validateIsActiveForAuthor(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                "Коллекция для использования в тренировке корректна");
        return ResponseEntity.ok(message);
    }


    @PatchMapping("/edit")
    public ResponseEntity<?> edit(HttpServletRequest request,
                                  @RequestPart(name = "image", required = false) MultipartFile image,
                                  @RequestPart("customer_collection") @Valid CustomerCollectionEditRequestDTO dto,
                                  BindingResult bindingResult) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(dto.getAuthKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем наличие ошибок привязки DTO
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult
                    .getAllErrors()
                    .stream()
                    .findAny()
                    .get()
                    .getDefaultMessage();

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, errorMessage);
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем коллекцию
        long customerCollectionId = dto.getId();
        response = this.find(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Коллекция должна принадлежать пользователю
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        response = this.validateIsAuthor(customer.getId(), customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем пришедший файл на корректность
        if (image != null) {
            response = CONTROLLER_UTILS.checkMultipartFile(image, ACCEPTED_MIME_TYPES_WITH_SIZE_FOR_IMAGE);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        // Проверяем название (если коллекция та же, не выдаем ошибку)
        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.find(customerCollectionId);
        response = this.isExistsByCustomerAndTitle(customer.getId(), dto.getTitle());
        if (response.getStatusCode() == HttpStatus.OK) {
            CustomerCollection customerCollectionByTitle = CUSTOMER_COLLECTION_SERVICE.findByCustomerAndTitle(
                    customer, dto.getTitle());
            if (!customerCollection.equals(customerCollectionByTitle)) {
                ResponseMessageResponseDTO message = (ResponseMessageResponseDTO) response.getBody();
                return ResponseEntity.badRequest().body(message);
            }
        }

        customerCollection = CUSTOMER_COLLECTION_SERVICE.edit(customerCollection, image, dto);
        if (customerCollection != null) {
            // Мы дожны удалить некоторые слова из коллекции (при необходимости)
            boolean doNeedToDeleteAllWords = dto.getDoNeedToDeleteAllWords();
            Long[] excludedWordInCollectionIds = dto.getExcludedWordInCollectionIds();
            if (doNeedToDeleteAllWords) {
                // Удаляем все слова из коллекции
                WORD_IN_COLLECTION_SERVICE.deleteAllByCustomerCollection(customerCollectionId, excludedWordInCollectionIds);
            } else {
                // Удаляем слова-исключения из коллекции
                if (excludedWordInCollectionIds != null) {
                    for (Long id: excludedWordInCollectionIds) {
                        WordInCollection wordInCollection = WORD_IN_COLLECTION_SERVICE.find(id);
                        if (wordInCollection != null) {
                            WORD_IN_COLLECTION_SERVICE.delete(wordInCollection);
                        }
                    }
                }
            }

            CustomerCollectionResponseDTO responseDTO = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(customerCollection);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(2,
                    "Произошла ошибка изменения коллекции");
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @PatchMapping("/edit/is_active_for_author")
    public ResponseEntity<?> editIsActiveForAuthor(HttpServletRequest request,
                                                   @RequestBody EntityEditBooleanByIdRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(dto.getAuthKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем существование коллекции
        response = find(dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Коллекция должна принадлежать пользователю
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        response = validateIsAuthor(customer.getId(), dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(dto.getId());
        collection = CUSTOMER_COLLECTION_SERVICE.editIsActiveForAuthor(collection, dto.getValue());
        if (collection != null) {
            CustomerCollectionResponseDTO responseDTO = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Произошла ошибка изменения статуса активности для автора");
            return ResponseEntity.badRequest().body(message);
        }
    }



    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(HttpServletRequest request,
                                    @RequestBody EntityIdRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем коллекцию
        long customerCollectionId = dto.getId();
        response = find(customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Коллекция должна принадлежать пользователю
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        response = validateIsAuthor(customer.getId(), customerCollectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.find(customerCollectionId);
        CUSTOMER_COLLECTION_SERVICE.delete(customerCollection);

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Коллекция успешно удалена");
        return ResponseEntity.ok(message);
    }
}
