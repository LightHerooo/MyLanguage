package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.*;
import ru.herooo.mylanguagedb.types.CustomerCollectionsStatistic;
import ru.herooo.mylanguageutils.yandexdictionary.yandexlangs.YandexLangsResult;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.other.LongResponse;
import ru.herooo.mylanguageweb.dto.types.customer_collections_with_lang_statistic.CustomerCollectionsStatisticMapping;
import ru.herooo.mylanguageweb.dto.types.customer_collections_with_lang_statistic.CustomerCollectionsStatisticResponseDTO;
import ru.herooo.mylanguageweb.services.*;

import java.util.*;

@RestController
@RequestMapping("/api/customer_collections")
public class CustomerCollectionsRestController {
    private long MIN_NUMBER_OF_WORDS_IN_COLLECTION_FOR_WORKOUT = 10;

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
                                             CustomerCollectionsStatisticMapping customerCollectionsStatisticMapping) {
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
    }
    @GetMapping("/for_author_filtered")
    public ResponseEntity<?> getForAuthorFiltered(
            @RequestParam("customer_id") Long customerId,
            @RequestParam("is_active_for_author") Boolean isActiveForAuthor,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "lang_code", required = false) String langCode) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<CustomerCollection> collections = CUSTOMER_COLLECTION_SERVICE.findAllForAuthor(
                title, langCode, customerId, isActiveForAuthor);
        if (collections != null && collections.size() > 0) {
            List<CustomerCollectionResponseDTO> collectionsDTO =
                    collections.stream().map(CUSTOMER_COLLECTION_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(collectionsDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Коллекции по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/count_for_author")
    public ResponseEntity<?> getCountForAuthor(@RequestParam("customer_id") Long customerId,
                                               @RequestParam("is_active_for_author") Boolean isActiveForAuthor) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        long numberOfCollections = CUSTOMER_COLLECTION_SERVICE.count(customerId, isActiveForAuthor);
        return ResponseEntity.ok(new LongResponse(numberOfCollections));
    }

    @GetMapping("/for_author_filtered_pagination")
    public ResponseEntity<?> getForAuthorFilteredPagination(
            @RequestParam("customer_id") Long customerId,
            @RequestParam("is_active_for_author") Boolean isActiveForAuthor,
            @RequestParam("number_of_items") Long numberOfItems,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "lang_code", required = false) String langCode,
            @RequestParam(value = "last_collection_id_on_previous_page", required = false, defaultValue = "0")
                Long lastCollectionIdOnPreviousPage) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (numberOfItems == null || numberOfItems <= 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(1, "Количество коллекций должно быть больше 0.");
            return ResponseEntity.badRequest().body(message);
        }


        if (lastCollectionIdOnPreviousPage == null || lastCollectionIdOnPreviousPage < 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(2,
                            "ID последней коллекции на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0.");
            return ResponseEntity.badRequest().body(message);
        }

        List<CustomerCollection> collections = CUSTOMER_COLLECTION_SERVICE.findAllForAuthor(
                title, langCode, customerId, isActiveForAuthor, numberOfItems, lastCollectionIdOnPreviousPage);
        if (collections != null && collections.size() > 0) {
            List<CustomerCollectionResponseDTO> collectionsDTO =
                    collections.stream().map(CUSTOMER_COLLECTION_MAPPING::mapToResponseDTO).toList();
            return ResponseEntity.ok(collectionsDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Коллекции по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/for_author_by_lang_out_code")
    public ResponseEntity<?> getForAuthorByLangOutCode(@RequestParam("customer_id") Long customerId,
                                                       @RequestParam("lang_out_code") String langOutCode) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = LANGS_REST_CONTROLLER.validateIsActiveForOut(langOutCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = LANGS_REST_CONTROLLER.tryToGetYandexLangsResult();
        if (response.getBody() instanceof YandexLangsResult yandexLangsResult) {
            List<CustomerCollection> collections = CUSTOMER_COLLECTION_SERVICE.findAllForAuthor(
                    null, null, customerId, true);

            Lang langOut = LANG_SERVICE.find(langOutCode);
            List<String> yandexLangsIn = yandexLangsResult
                    .getLangsIn(langOut.getCode());

            List<CustomerCollection> result = new ArrayList<>();
            for (CustomerCollection collection: collections) {
                for (String langCode: yandexLangsIn) {
                    if (collection.getLang().getCode().equals(langCode)) {
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
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Неизвестная ошибка обращения к API.");
            return ResponseEntity.badRequest().body(message);
        }
     }
    @GetMapping("/statistics_by_customer_id")
    public ResponseEntity<?> getStatistics(@RequestParam("customer_id") Long customerId) {
        List<CustomerCollectionsStatistic> statistics = CUSTOMER_COLLECTION_SERVICE.findStatistics(customerId);
        if (statistics != null && statistics.size() > 0) {
            List<CustomerCollectionsStatisticResponseDTO> responseDTOs = statistics
                    .stream()
                    .map(CUSTOMER_COLLECTIONS_WITH_LANG_STATISTIC_MAPPING::mapToResponse)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Не удалось получить статистику по коллекциям у пользователя с id = '%d'",
                            customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/create_by_workout_id")
    public ResponseEntity<?> createByWorkoutId(HttpServletRequest request,
                                               @RequestBody CustomerCollectionRequestDTO dto,
                                               BindingResult bindingResult) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUTS_REST_CONTROLLER.find(dto.getWorkoutId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Тренировка должна быть завершена
        Workout workout = WORKOUT_SERVICE.find(dto.getWorkoutId());
        response = WORKOUTS_REST_CONTROLLER.validateIsWorkoutEnded(workout.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollectionRequestDTO collectionRequestDTO = new CustomerCollectionRequestDTO();
        collectionRequestDTO.setTitle(String.format("%s (%d)", workout.getWorkoutType().getTitle(), workout.getId()));
        collectionRequestDTO.setLangCode(workout.getLangIn().getCode());
        collectionRequestDTO.setAuthCode(dto.getAuthCode());
        response = add(request, collectionRequestDTO, bindingResult);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        } else if (response.getBody() instanceof CustomerCollectionResponseDTO responseDTO) {
            CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(responseDTO.getId());

            // Ищем слова в тренировке в первом раунде
            List<WorkoutItem> workoutItems = WORKOUT_ITEM_SERVICE.findListWithAnswerInRound(workout.getId(), 1L);
            if (workoutItems != null && workoutItems.size() > 0) {
                for (WorkoutItem workoutItem: workoutItems) {
                    Word word = WORD_SERVICE.findFirstByTitleIgnoreCaseAndLang(
                            workoutItem.getWordTitleQuestion(), workout.getLangIn());
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

                CustomResponseMessage message = new CustomResponseMessage(1,
                        "Не удалось получить слова из тренировки.");
                return ResponseEntity.badRequest().body(message);
            }
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    "Неизвестная ошибка создания коллекции по коду тренировки.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @Valid @RequestBody CustomerCollectionRequestDTO dto,
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
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Произошла ошибка при добавлении коллекции.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/change_activity_for_author")
    public ResponseEntity<?> changeActivityForAuthor(HttpServletRequest request,
                                                     @RequestBody CustomerCollectionRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем существование коллекции
        response = find(dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Коллекция должна принадлежать пользователю
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        response = validateIsAuthor(customer.getId(), dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(dto.getId());
        collection = CUSTOMER_COLLECTION_SERVICE.changeActivityForAuthor(collection, dto.getIsActiveForAuthor());
        if (collection != null) {
            CustomerCollectionResponseDTO responseDTO = CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(collection);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Произошла ошибка изменения статуса активности для автора.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @DeleteMapping
    public ResponseEntity<?> delete(HttpServletRequest request,
                                    @RequestBody CustomerCollectionRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем существование коллекции
        response = find(dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Коллекцией должен владеть пользователь, который хочет её удалить
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        response = validateIsAuthor(customer.getId(), dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(dto.getId());
        CUSTOMER_COLLECTION_SERVICE.delete(collection);

        CustomResponseMessage message = new CustomResponseMessage(1, "Коллекция успешно удалена.");
        return ResponseEntity.ok(message);
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

    @PostMapping("/validate/before_add")
    public ResponseEntity<?> validateBeforeAdd(HttpServletRequest request,
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
                    .findAny()
                    .get()
                    .getDefaultMessage();

            CustomResponseMessage message = new CustomResponseMessage(1, errorMessage);
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
        Customer authCustomer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        CustomerCollection collection =
                CUSTOMER_COLLECTION_SERVICE.findByCustomerAndTitle(authCustomer, dto.getTitle());
        if (collection != null) {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    "У вас уже есть коллекция с таким названием.");
            return ResponseEntity.badRequest().body(message);
        }

        CustomResponseMessage message = new CustomResponseMessage(1,
                "Данные для добавления коллекции корректны.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/is_author")
    public ResponseEntity<?> validateIsAuthor(@RequestParam("customer_id") Long customerId,
                                              @RequestParam("collection_id") Long collectionId) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = find(collectionId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.find(customerId);
        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(collectionId);
        if (customer.equals(collection.getCustomer())) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Коллекция принадлежит пользователю.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Коллекция не принадлежит пользователю.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/is_lang_active_by_id")
    public ResponseEntity<?> validateIsLangActiveById(@RequestParam("id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(id);
        response = LANGS_REST_CONTROLLER.validateIsActiveForIn(collection.getLang().getCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Коллекция недоступна, так как её язык в данный момент неактивен.");
            return ResponseEntity.badRequest().body(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Язык коллекции активен.");
            return ResponseEntity.ok(message);
        }
    }

    @GetMapping("/validate/is_active_for_author_by_id")
    public ResponseEntity<?> validateIsActiveForAuthor(@RequestParam("id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerCollection collection = CUSTOMER_COLLECTION_SERVICE.find(id);
        if (collection.isActiveForAuthor()) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Коллекция активна для автора.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Коллекция неактивна для автора.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/number_of_words_for_workout_by_id")
    public ResponseEntity<?> validateNumberOfWordsForWorkoutById(@RequestParam("id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        long numberOfWords = WORD_IN_COLLECTION_SERVICE.count(id);
        if (numberOfWords < MIN_NUMBER_OF_WORDS_IN_COLLECTION_FOR_WORKOUT) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Количество слов в коллекции для тренировки должно быть не менее %d.",
                            MIN_NUMBER_OF_WORDS_IN_COLLECTION_FOR_WORKOUT));
            return ResponseEntity.badRequest().body(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Слов в коллекции достаточно для тренировки.");
            return ResponseEntity.ok(message);
        }
    }
}
