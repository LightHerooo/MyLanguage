package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.*;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.word.Word;
import ru.herooo.mylanguagedb.entities.workout.Workout;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteCustomerCollection;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteLang;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteWorkoutType;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutsCustomerStatistic;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypes;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutRoundStatistic;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutStatistic;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.workout.request.WorkoutAuthKeyRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.request.add.types.WorkoutAddCollectionWorkoutRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.request.add.types.WorkoutAddRandomWordsRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.request.add.WorkoutValidateAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.request.edit.WorkoutEditLongRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.customer_collection.FavouriteCustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.customer_collection.FavouriteCustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.lang.FavouriteLangMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.lang.FavouriteLangResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.workout_type.FavouriteWorkoutTypeMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.workout_type.FavouriteWorkoutTypeResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.customer.WorkoutsCustomerStatisticMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.customer.WorkoutsCustomerStatisticResponseDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.EntityIdRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.value.EntityStringRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.edit.b.EntityEditBooleanByIdRequestDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.dto.other.response.value.DateResponseDTO;
import ru.herooo.mylanguageweb.dto.other.response.value.IntResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.response.WorkoutResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.round.WorkoutRoundStatisticMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.round.WorkoutRoundStatisticResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.workout.WorkoutStatisticMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.workout.WorkoutStatisticResponseDTO;
import ru.herooo.mylanguageweb.services.*;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutsRestController {
    private final long MAX_NUMBER_OF_NOT_OVER_WORKOUTS = 3;
    private final int[] POSSIBLE_DAYS = new int[] {0, 1, 7, 30, 365};

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final WorkoutTypesRestController WORKOUT_TYPES_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;
    private final CustomerCollectionsRestController CUSTOMER_COLLECTIONS_REST_CONTROLLER;

    private final CustomerService CUSTOMER_SERVICE;
    private final WorkoutTypeService WORKOUT_TYPE_SERVICE;
    private final WorkoutService WORKOUT_SERVICE;
    private final WordService WORD_SERVICE;
    private final WorkoutItemService WORKOUT_ITEM_SERVICE;
    private final LangService LANG_SERVICE;
    private final CustomerCollectionService CUSTOMER_COLLECTION_SERVICE;
    private final WordInCollectionService WORD_IN_COLLECTION_SERVICE;

    private final WorkoutMapping WORKOUT_MAPPING;
    private final WorkoutRoundStatisticMapping WORKOUT_ROUND_STATISTIC_MAPPING;
    private final WorkoutStatisticMapping WORKOUT_STATISTIC_MAPPING;
    private final WorkoutsCustomerStatisticMapping WORKOUTS_CUSTOMER_STATISTIC_MAPPING;
    private final FavouriteLangMapping FAVOURITE_LANG_MAPPING;
    private final FavouriteWorkoutTypeMapping FAVOURITE_WORKOUT_TYPE_MAPPING;
    private final FavouriteCustomerCollectionMapping FAVOURITE_CUSTOMER_COLLECTION_MAPPING;


    private final StringUtils STRING_UTILS;

    @Autowired
    public WorkoutsRestController(WorkoutTypesRestController workoutTypesRestController,
                                  CustomersRestController customersRestController,
                                  LangsRestController langsRestController,
                                  @Lazy CustomerCollectionsRestController customerCollectionsRestController,

                                  CustomerService customerService,
                                  WorkoutTypeService workoutTypeService,
                                  WorkoutService workoutService,
                                  WordService wordService,
                                  WorkoutItemService workoutItemService,
                                  LangService langService,
                                  CustomerCollectionService customerCollectionService,
                                  WordInCollectionService wordInCollectionService,

                                  WorkoutMapping workoutMapping,
                                  WorkoutRoundStatisticMapping workoutRoundStatisticMapping,
                                  WorkoutStatisticMapping workoutStatisticMapping,
                                  WorkoutsCustomerStatisticMapping workoutsCustomerStatisticMapping,
                                  FavouriteLangMapping favouriteLangMapping,
                                  FavouriteWorkoutTypeMapping favouriteWorkoutTypeMapping,
                                  FavouriteCustomerCollectionMapping favouriteCustomerCollectionMapping,

                                  StringUtils stringUtils) {
        this.WORKOUT_TYPES_REST_CONTROLLER = workoutTypesRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;
        this.CUSTOMER_COLLECTIONS_REST_CONTROLLER = customerCollectionsRestController;

        this.CUSTOMER_SERVICE = customerService;
        this.WORKOUT_TYPE_SERVICE = workoutTypeService;
        this.WORKOUT_SERVICE = workoutService;
        this.WORD_SERVICE = wordService;
        this.WORKOUT_ITEM_SERVICE = workoutItemService;
        this.LANG_SERVICE = langService;
        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.WORD_IN_COLLECTION_SERVICE = wordInCollectionService;

        this.WORKOUT_MAPPING = workoutMapping;
        this.WORKOUT_ROUND_STATISTIC_MAPPING = workoutRoundStatisticMapping;
        this.WORKOUT_STATISTIC_MAPPING = workoutStatisticMapping;
        this.WORKOUTS_CUSTOMER_STATISTIC_MAPPING = workoutsCustomerStatisticMapping;
        this.FAVOURITE_LANG_MAPPING = favouriteLangMapping;
        this.FAVOURITE_WORKOUT_TYPE_MAPPING = favouriteWorkoutTypeMapping;
        this.FAVOURITE_CUSTOMER_COLLECTION_MAPPING = favouriteCustomerCollectionMapping;

        this.STRING_UTILS = stringUtils;
    }

    @GetMapping("/get/over")
    public ResponseEntity<?> getAllOver(@RequestParam(value = "workout_type_code", required = false) String workoutTypeCode,
                                        @RequestParam(value = "date_of_end_str", required = false) String dateOfEndStr,
                                        @RequestParam(value = "customer_id", required = false, defaultValue = "0") Long customerId) {
        if (workoutTypeCode != null) {
            ResponseEntity<?> response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        LocalDate dateOfEnd = null;
        if (dateOfEndStr != null) {
            try {
                dateOfEnd = LocalDate.parse(dateOfEndStr);
            } catch (Throwable e ){
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                        "Введена некорректная дата. Введите дату в формате 'yyyy-MM-dd'");
                return ResponseEntity.badRequest().body(message);
            }
        }

        if (customerId != 0) {
            ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        List<Workout> workouts = WORKOUT_SERVICE.findAllOver(workoutTypeCode, customerId, dateOfEnd);
        if (workouts != null && workouts.size() > 0) {
            List<WorkoutResponseDTO> workoutResponseDTOs = workouts
                    .stream()
                    .map(WORKOUT_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(workoutResponseDTOs);
        } else {
            String message = "Пользователь не провёл ни одной тренировки";

            if (workoutTypeCode != null) {
                WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(workoutTypeCode);
                if (workoutType != null) {
                    message = String.format("%s в режиме '%s'", message, workoutType.getTitle());
                }
            }

            ResponseMessageResponseDTO messageResponseDTO = new ResponseMessageResponseDTO(1, message);
            return ResponseEntity.badRequest().body(messageResponseDTO);
        }
    }

    @GetMapping("/get/not_over")
    public ResponseEntity<?> getAllNotOver(@RequestParam(value = "workout_type_code", required = false) String workoutTypeCode,
                                           @RequestParam(value = "customer_id", required = false, defaultValue = "0") Long customerId) {
        if (workoutTypeCode != null) {
            ResponseEntity<?> response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<Workout> workouts = WORKOUT_SERVICE.findAllNotOver(workoutTypeCode, customerId);
        if (workouts != null && workouts.size() > 0) {
            List<WorkoutResponseDTO> responseDTOs = workouts
                    .stream()
                    .map(WORKOUT_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(999,
                    String.format("Не удалось найти незавершённые тренировки режима '%s' у пользователя с id = '%d'",
                            workoutTypeCode, customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
        Workout workout = WORKOUT_SERVICE.find(id);
        if (workout != null) {
            WorkoutResponseDTO dto = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Тренировка с id = '%d' не найдена", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/last")
    public ResponseEntity<?> findLast(@RequestParam(value = "workout_type_code", required = false) String workoutTypeCode,
                                      @RequestParam(value = "customer_id", required = false, defaultValue = "0") Long customerId) {
        if (workoutTypeCode != null) {
            ResponseEntity<?> response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
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

        Workout workout = WORKOUT_SERVICE.findLast(customerId, workoutTypeCode);
        if (workout != null) {
            WorkoutResponseDTO dto = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Тренировка с кодом '%s' у пользователя с id = '%d' не найдена",
                            workoutTypeCode, customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/current_round_number")
    public ResponseEntity<?> findCurrentRoundNumber(@RequestParam("id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        int currentRoundNumber = WORKOUT_SERVICE.findCurrentRoundNumber(id);
        if (currentRoundNumber > 0) {
            IntResponseDTO intResponseDTO = new IntResponseDTO(currentRoundNumber);
            return ResponseEntity.ok(intResponseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(999,
                    String.format("Текущий раунд у тренировки с id = '%d' не найден", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/max_round_number")
    public ResponseEntity<?> findMaxRoundNumber(@RequestParam("id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        int maxRoundNumber = WORKOUT_SERVICE.findMaxRoundNumber(id);
        return ResponseEntity.ok(new IntResponseDTO(maxRoundNumber));
    }

    @GetMapping("/find/max_date_of_end")
    public ResponseEntity<?> findMaxDateOfEnd(@RequestParam(value = "workout_type_code", required = false)
                                                    String workoutTypeCode,
                                              @RequestParam(value = "customer_id", required = false, defaultValue = "0")
                                                    Long customerId) {
        if (workoutTypeCode != null) {
            ResponseEntity<?> response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
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

        LocalDate maxDate = WORKOUT_SERVICE.findMaxDateOfEnd(workoutTypeCode, customerId);
        if (maxDate != null) {
            DateResponseDTO dateResponseDTO = new DateResponseDTO(maxDate);
            return ResponseEntity.ok(dateResponseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Не удалось найти максимальную дату окончания тренировки");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/next_date_of_end")
    public ResponseEntity<?> findNextDateOfEnd(@RequestParam(value = "previous_date_of_end_str") String previousDateOfEndStr,
                                               @RequestParam(value = "workout_type_code", required = false)
                                                    String workoutTypeCode,
                                               @RequestParam(value = "customer_id", required = false, defaultValue = "0") Long customerId) {
        LocalDate previousDateOfEnd = null;
        try {
            previousDateOfEnd = LocalDate.parse(previousDateOfEndStr);
        } catch (Throwable e ){
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Введена некорректная дата. Введите дату в формате 'yyyy-MM-dd'");
            return ResponseEntity.badRequest().body(message);
        }

        if (workoutTypeCode != null) {
            ResponseEntity<?> response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
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

        LocalDate nextDate = WORKOUT_SERVICE.findNextDateOfEnd(previousDateOfEnd, workoutTypeCode, customerId);
        if (nextDate != null) {
            DateResponseDTO dateResponseDTO = new DateResponseDTO(nextDate);
            return ResponseEntity.ok(dateResponseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Не удалось найти следующую дату окончания тренировки");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/statistic")
    public ResponseEntity<?> findStatistic(@RequestParam(value = "id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.find(id);
        if (workout != null && workout.getDateOfEnd() == null) {
            ResponseMessageResponseDTO messageResponseDTO = new ResponseMessageResponseDTO(1,
                    "Статистику по тренировке можно получить только после её окончания");
            return ResponseEntity.badRequest().body(messageResponseDTO);
        }

        WorkoutStatistic workoutStatistic = WORKOUT_SERVICE.findStatistic(id);
        if (workoutStatistic != null) {
            WorkoutStatisticResponseDTO dto = WORKOUT_STATISTIC_MAPPING.mapToResponse(workoutStatistic);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO messageResponseDTO = new ResponseMessageResponseDTO(2,
                    String.format("Не удалось получить статистику по тренировке с id = %d", id));
            return ResponseEntity.badRequest().body(messageResponseDTO);
        }
    }

    @GetMapping("/find/customer_statistic")
    public ResponseEntity<?> findCustomerStatistic(@RequestParam(value = "customer_id") Long customerId,
                                                   @RequestParam(value = "workout_type_code", required = false)
                                                       String workoutTypeCode,
                                                   @RequestParam(value = "days", required = false, defaultValue = "0")
                                                       Integer days) {
        ResponseEntity<?> response = validateBeforeFindCustomerStatistic(customerId, workoutTypeCode, days);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutsCustomerStatistic workoutsCustomerStatistic = WORKOUT_SERVICE.findCustomerStatistic(workoutTypeCode, days, customerId);
        if (workoutsCustomerStatistic != null) {
            WorkoutsCustomerStatisticResponseDTO dto = WORKOUTS_CUSTOMER_STATISTIC_MAPPING.mapToResponse(workoutsCustomerStatistic);
            return ResponseEntity.ok(dto);
        } else {
            String message;
            switch (days) {
                case 0 -> message = "Пользователь за всё время не проводил тренировок";
                case 1 -> message = "Пользователь за сегодня не проводил тренировок";
                default -> {
                    String daysStr = STRING_UTILS.createWordWithNewEnding("день", days,
                            "ней",
                            "ня",
                            null,
                            "ней",
                            3);

                    message = String.format("Пользователь за последние %d %s не проводил тренировок", days, daysStr);
                }
            }

            if (workoutTypeCode != null) {
                WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(workoutTypeCode);
                if (workoutType != null) {
                    message = String.format("%s в режиме '%s'", message, workoutType.getTitle());
                }
            }


            ResponseMessageResponseDTO messageResponseDTO = new ResponseMessageResponseDTO(3, message);
            return ResponseEntity.badRequest().body(messageResponseDTO);
        }
    }

    @GetMapping("/find/round_statistic")
    public ResponseEntity<?> findRoundStatistic(@RequestParam("id") Long id,
                                                @RequestParam("round_number") Integer roundNumber) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = validateRoundNumber(id, roundNumber);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutRoundStatistic workoutRoundStatistic = WORKOUT_SERVICE.findRoundStatistic(id, roundNumber);
        if (workoutRoundStatistic != null) {
            WorkoutRoundStatisticResponseDTO dto = WORKOUT_ROUND_STATISTIC_MAPPING.mapToResponse(workoutRoundStatistic);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Не удалось получить статистику по раунду №%d в тренировке с id = '%d'",
                            roundNumber, id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/favourite/lang_in")
    public ResponseEntity<?> findFavouriteLangIn(@RequestParam(value = "customer_id") Long customerId,
                                                 @RequestParam(value = "workout_type_code", required = false)
                                                     String workoutTypeCode,
                                                 @RequestParam(value = "days", required = false, defaultValue = "0")
                                                     Integer days) {
        ResponseEntity<?> response = validateBeforeFindCustomerStatistic(customerId, workoutTypeCode, days);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        FavouriteLang favouriteLangIn = WORKOUT_SERVICE.findFavouriteLangIn(workoutTypeCode, customerId, days);
        if (favouriteLangIn != null) {
            FavouriteLangResponseDTO dto = FAVOURITE_LANG_MAPPING.mapToResponse(favouriteLangIn);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    "Не удалось вычислить любимый входящий язык пользователя");
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/find/favourite/lang_out")
    public ResponseEntity<?> findFavouriteLangOut(@RequestParam(value = "customer_id") Long customerId,
                                                  @RequestParam(value = "workout_type_code", required = false)
                                                    String workoutTypeCode,
                                                  @RequestParam(value = "days", required = false, defaultValue = "0")
                                                      Integer days) {
        ResponseEntity<?> response = validateBeforeFindCustomerStatistic(customerId, workoutTypeCode, days);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        FavouriteLang favouriteLangIn = WORKOUT_SERVICE.findFavouriteLangOut(workoutTypeCode, customerId, days);
        if (favouriteLangIn != null) {
            FavouriteLangResponseDTO dto = FAVOURITE_LANG_MAPPING.mapToResponse(favouriteLangIn);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    "Не удалось вычислить любимый выходящий язык пользователя");
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/find/favourite/workout_type")
    public ResponseEntity<?> findFavouriteWorkoutType(@RequestParam(value = "customer_id") Long customerId,
                                                      @RequestParam(value = "days", required = false, defaultValue = "0")
                                                          Integer days) {
        ResponseEntity<?> response = validateBeforeFindCustomerStatistic(customerId, null, days);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        FavouriteWorkoutType favouriteWorkoutType = WORKOUT_SERVICE.findFavouriteWorkoutType(customerId, days);
        if (favouriteWorkoutType != null) {
            FavouriteWorkoutTypeResponseDTO dto = FAVOURITE_WORKOUT_TYPE_MAPPING.mapToResponse(favouriteWorkoutType);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    "Не удалось вычислить любимый режим тренировки пользователя");
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/find/favourite/customer_collection")
    public ResponseEntity<?> findFavouriteCustomerCollection(@RequestParam(value = "customer_id") Long customerId,
                                                             @RequestParam(value = "workout_type_code", required = false)
                                                                String workoutTypeCode,
                                                             @RequestParam(value = "days", required = false, defaultValue = "0")
                                                                 Integer days) {
        ResponseEntity<?> response = validateBeforeFindCustomerStatistic(customerId, workoutTypeCode, days);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        FavouriteCustomerCollection favouriteCustomerCollection = WORKOUT_SERVICE.findFavouriteCustomerCollection(
                workoutTypeCode, customerId, days);
        if (favouriteCustomerCollection != null) {
            FavouriteCustomerCollectionResponseDTO dto = FAVOURITE_CUSTOMER_COLLECTION_MAPPING.mapToResponse(favouriteCustomerCollection);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    "Не удалось вычислить любимую коллекцию пользователя");
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/exists/by_auth_key")
    public ResponseEntity<?> isExistsByAuthKey(@RequestParam("auth_key") String authKey) {
        Workout workout = WORKOUT_SERVICE.findByAuthKey(authKey);
        if (workout != null) {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1, "Код валиден");
            return ResponseEntity.ok(crm);
        } else {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1, "Недействительный код тренировки");
            return ResponseEntity.badRequest().body(crm);
        }
    }

    @GetMapping("/validate/is_over")
    public ResponseEntity<?> validateIsOver(@RequestParam("id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.find(id);
        if (workout.getDateOfEnd() != null) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Тренировка завершена");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Тренировка не завершена");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/is_not_over")
    public ResponseEntity<?> validateIsNotOver(@RequestParam("id") Long id) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.find(id);
        if (workout.getDateOfEnd() == null) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Тренировка не завершена");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Тренировка завершена");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/is_author")
    public ResponseEntity<?> validateIsAuthor(@RequestParam("customer_id") Long customerId,
                                              @RequestParam("workout_id") Long workoutId) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.find(customerId);
        Workout workout = WORKOUT_SERVICE.find(workoutId);
        if (customer.equals(workout.getCustomer())) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Коллекция принадлежит вам");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Коллекция не принадлежит вам");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/round_number")
    public ResponseEntity<?> validateRoundNumber(
            @RequestParam("id") Long id,
            @RequestParam(value = "round_number", required = false, defaultValue = "0") Integer roundNumber) {
        ResponseEntity<?> response = find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (roundNumber == null || roundNumber < 0) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Номер раунда не должен быть отрицательным");
            return ResponseEntity.badRequest().body(message);
        }

        long maxRoundNumber = WORKOUT_SERVICE.findMaxRoundNumber(id);
        if (roundNumber > maxRoundNumber) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                    String.format("Максимальное значение раунда искомой тренировки - '%d'", maxRoundNumber));
            return ResponseEntity.badRequest().body(message);
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Номер раунда корректен");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/before_find/customer_statistic")
    public ResponseEntity<?> validateBeforeFindCustomerStatistic(@RequestParam(value = "customer_id") Long customerId,
                                                                 @RequestParam(value = "workout_type_code", required = false)
                                                                         String workoutTypeCode,
                                                                 @RequestParam(value = "days", required = false, defaultValue = "0")
                                                                             Integer days) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (workoutTypeCode != null) {
            response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        if (days < 0) {
            ResponseMessageResponseDTO messageResponseDTO = new ResponseMessageResponseDTO(1,
                    "Количество дней не должно быть отрицательным. Если вы хотите вывести статистику за всё время, " +
                            "игнорируйте этот параметр или введите 0");
            return ResponseEntity.badRequest().body(messageResponseDTO);
        } else if (IntStream.of(POSSIBLE_DAYS).noneMatch(x -> x == days)) {
            String possibleDaysStr = Arrays.stream(POSSIBLE_DAYS)
                    .mapToObj(String::valueOf)
                    .collect(Collectors.joining(", "));

            ResponseMessageResponseDTO messageResponseDTO = new ResponseMessageResponseDTO(2,
                    String.format("Некорректное количество дней. Разрешенные значения: [%s]", possibleDaysStr));
            return ResponseEntity.badRequest().body(messageResponseDTO);
        }

        ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1, "Данные корректны");
        return ResponseEntity.ok(responseDTO);
    }
    @GetMapping("/validate/number_of_not_over_workouts")
    public ResponseEntity<?> validateNumberOfNotOverWorkouts(@RequestParam("workout_type_code") String workoutTypeCode,
                                                             @RequestParam("customer_id") Long customerId) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(workoutTypeCode);
        long countNotOver = WORKOUT_SERVICE.countNotOver(workoutTypeCode, customerId);
        if (countNotOver < MAX_NUMBER_OF_NOT_OVER_WORKOUTS) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Количество тренировок корректно (%d из %d) в режиме '%s'",
                            countNotOver, MAX_NUMBER_OF_NOT_OVER_WORKOUTS, workoutType.getTitle()));
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Достигнуто максимальное количество незавершённых тренировок (%d из %d) в режиме '%s'",
                            countNotOver, MAX_NUMBER_OF_NOT_OVER_WORKOUTS, workoutType.getTitle()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/number_of_words/by_workout_type_code")
    public ResponseEntity<?> validateNumberOfWordsByWorkoutTypeCode(@RequestParam("workout_type_code") String workoutTypeCode,
                                                                    @RequestParam("number_of_words") Long numberOfWords) {
        ResponseEntity<?> response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем количество слов по пришедшему режиму тренировки
        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(workoutTypeCode);
        if (workoutType.getId() == WorkoutTypes.RANDOM_WORDS.ID) {
            final List<Long> POSSIBLE_NUMBER_OF_WORDS_VALUES = Arrays.asList(
                10L, 20L, 30L, 40L, 50L, 60L, 70L, 80L, 90L, 100L);

            boolean isNumberOfWordsPossible = POSSIBLE_NUMBER_OF_WORDS_VALUES
                    .stream()
                    .anyMatch(number -> number.equals(numberOfWords));
            if (!isNumberOfWordsPossible) {
                List<String> possibleNumbers = POSSIBLE_NUMBER_OF_WORDS_VALUES
                        .stream()
                        .map(Object::toString)
                        .toList();

                String possibleNumbersStr = String.join(", ", possibleNumbers);
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                        String.format("В режиме '%s' разрешено количество из следующих значений: [%s]",
                                workoutType.getTitle(), possibleNumbersStr));
                return ResponseEntity.badRequest().body(message);
            }
        } else if (workoutType.getId() == WorkoutTypes.COLLECTION_WORKOUT.ID) {
            final long MIN_NUMBER_OF_WORDS = 10;
            if (numberOfWords < MIN_NUMBER_OF_WORDS) {
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                        String.format("Минимальное количество слов в режиме '%s' - %d",
                                workoutType.getTitle(), MIN_NUMBER_OF_WORDS));
                return ResponseEntity.badRequest().body(message);
            }
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                String.format("Количество слов корректно (%d)", numberOfWords));
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/number_of_words/by_lang_in_code")
    public ResponseEntity<?> validateNumberOfWordsByLangInCode(@RequestParam("lang_in_code") String langInCode,
                                                               @RequestParam("number_of_words") Long numberOfWords) {
        ResponseEntity<?> response = LANGS_REST_CONTROLLER.find(langInCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Количество слов по конкретному языку должно быть больше минимального количества
        long count = WORD_SERVICE.countByLangCode(langInCode);
        if (count < numberOfWords) {
            Lang langIn = LANG_SERVICE.find(langInCode);

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(3, String.format(
                    "В языке '%s' недостаточно слов для генерации (в наличии: %d, указанное количество: %d)",
                    langIn.getTitle(), count, numberOfWords));
            return ResponseEntity.badRequest().body(message);
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                String.format("Количество слов корректно (%d)", numberOfWords));
        return ResponseEntity.ok(message);
    }



    @PostMapping("/add/random_words")
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @RequestBody WorkoutAddRandomWordsRequestDTO dto) {
        // Проверяем данные о тренировке перед добавлением
        WorkoutValidateAddRequestDTO validateAddRequestDTO = new WorkoutValidateAddRequestDTO();
        validateAddRequestDTO.setWorkoutTypeCode(WorkoutTypes.RANDOM_WORDS.CODE);
        validateAddRequestDTO.setLangInCode(dto.getLangInCode());
        validateAddRequestDTO.setLangOutCode(dto.getLangOutCode());
        validateAddRequestDTO.setNumberOfWords(dto.getNumberOfWords());
        validateAddRequestDTO.setAuthKey(dto.getAuthKey());

        ResponseEntity<?> response = validateBeforeAdd(request, validateAddRequestDTO);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }
        dto.setAuthKey(validateAddRequestDTO.getAuthKey());


        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        Workout workout = WORKOUT_SERVICE.add(dto);
        if (workout != null) {
            List<Word> randomWords = WORD_SERVICE.findAllRandom(
                    workout.getLangIn().getCode(), workout.getNumberOfWords());

            boolean areItemsCreated = WORKOUT_ITEM_SERVICE.addByWords(workout, randomWords);
            if (areItemsCreated) {
                WorkoutResponseDTO responseDTO = WORKOUT_MAPPING.mapToResponseDTO(workout);
                return ResponseEntity.ok(responseDTO);
            } else {
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                        "Произошла ошибка на этапе создания слов в тренировке");
                return ResponseEntity.badRequest().body(message);
            }
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                    "Произошла ошибка при создании тренировки");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/add/collection_workout")
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @RequestBody WorkoutAddCollectionWorkoutRequestDTO dto) {
        // Проверяем коллекцию перед созданием тренировки
        EntityIdRequestDTO entityIdRequestDTO = new EntityIdRequestDTO();
        entityIdRequestDTO.setId(dto.getCustomerCollectionId());
        entityIdRequestDTO.setAuthKey(dto.getAuthKey());

        ResponseEntity<?> response = CUSTOMER_COLLECTIONS_REST_CONTROLLER.validateBeforeAddWorkout(request, entityIdRequestDTO);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }
        dto.setAuthKey(entityIdRequestDTO.getAuthKey());

        // Проверяем данные о тренировке перед созданием тренировки
        long customerCollectionId = dto.getCustomerCollectionId();
        CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.find(customerCollectionId);

        WorkoutValidateAddRequestDTO validateAddRequestDTO = new WorkoutValidateAddRequestDTO();
        validateAddRequestDTO.setWorkoutTypeCode(WorkoutTypes.COLLECTION_WORKOUT.CODE);
        validateAddRequestDTO.setLangInCode(customerCollection.getLang().getCode());
        validateAddRequestDTO.setLangOutCode(dto.getLangOutCode());
        validateAddRequestDTO.setNumberOfWords(WORD_IN_COLLECTION_SERVICE.count(customerCollection.getId()));
        validateAddRequestDTO.setAuthKey(dto.getAuthKey());

        response = validateBeforeAdd(request, validateAddRequestDTO);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }
        dto.setAuthKey(validateAddRequestDTO.getAuthKey());

        Workout workout = WORKOUT_SERVICE.add(dto);
        if (workout != null) {
            List<WordInCollection> wordsInCollection = WORD_IN_COLLECTION_SERVICE.findAll(
                    customerCollectionId, null);

            boolean areItemsCreated = WORKOUT_ITEM_SERVICE.addByWordsInCollection(workout, wordsInCollection);
            if (areItemsCreated) {
                WorkoutResponseDTO responseDTO = WORKOUT_MAPPING.mapToResponseDTO(workout);
                return ResponseEntity.ok(responseDTO);
            } else {
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                        "Произошла ошибка на этапе создания слов в тренировке");
                return ResponseEntity.badRequest().body(message);
            }
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                    "Произошла ошибка при создании тренировки");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/validate/before_add")
    public ResponseEntity<?> validateBeforeAdd(HttpServletRequest request,
                                               @RequestBody WorkoutValidateAddRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        // Проверяем пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем режим тренировки на доступность
        String workoutTypeCode = dto.getWorkoutTypeCode();
        response = WORKOUT_TYPES_REST_CONTROLLER.validateIsPrepared(workoutTypeCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Неактивный режим тренировки можно запустить, если пользователь - суперюзер
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            response = WORKOUT_TYPES_REST_CONTROLLER.validateIsActive(workoutTypeCode);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        // Проверяем на максимальное количество тренировок
        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(workoutTypeCode);
        response = validateNumberOfNotOverWorkouts(workoutType.getCode(), customer.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем поддержку пары языков
        String langInCode = dto.getLangInCode();
        String langOutCode = dto.getLangOutCode();
        response = LANGS_REST_CONTROLLER.validateCoupleOfLanguages(langInCode, langOutCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем на минимальное количество слов (на основе режима тренировки)
        long numberOfWords = dto.getNumberOfWords();
        response = validateNumberOfWordsByWorkoutTypeCode(workoutTypeCode, numberOfWords);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем на минимальное количество слов (на основе входящего языка)
        response = validateNumberOfWordsByLangInCode(langInCode, numberOfWords);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                "Данные для добавления тренировки корректны");
        return ResponseEntity.ok(message);
    }

    // Проверка по id (для безобидных изменений)
    @PostMapping("/validate/before_edit/by_id")
    public ResponseEntity<?> validateBeforeEditById(HttpServletRequest request,
                                                    @RequestBody EntityIdRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        // Проверяем пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем, владеет ли тренировкой пользователь
        long workoutId = dto.getId();
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        response = this.validateIsAuthor(customer.getId(), workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Тренировка не должна быть завершена
        response = validateIsNotOver(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                "Данные для изменения тренировки корректны");
        return ResponseEntity.ok(message);
    }

    // Проверка по authKey (для критических изменений)
    @PostMapping("/validate/before_edit/by_auth_key")
    public ResponseEntity<?> validateBeforeEditByAuthKey(HttpServletRequest request,
                                                         @RequestBody WorkoutAuthKeyRequestDTO dto) {
        String validateCustomerAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getCustomerAuthKey());
        dto.setCustomerAuthKey(validateCustomerAuthKey);

        // Проверяем пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(validateCustomerAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        String validateWorkoutAuthKey = WORKOUT_SERVICE.validateAuthKey(request, dto.getWorkoutAuthKey());
        dto.setWorkoutAuthKey(validateWorkoutAuthKey);

        // Проверяем тренировку
        response = isExistsByAuthKey(validateWorkoutAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем, владеет ли тренировкой пользователь
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateCustomerAuthKey);
        Workout workout = WORKOUT_SERVICE.findByAuthKey(validateWorkoutAuthKey);
        response = this.validateIsAuthor(customer.getId(), workout.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Тренировка не должна быть завершена
        response = validateIsNotOver(workout.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                "Данные для изменения тренировки корректны");
        return ResponseEntity.ok(message);
    }

    @PostMapping("/validate/before_delete")
    public ResponseEntity<?> validateBeforeDelete(HttpServletRequest request,
                                                  @RequestBody EntityIdRequestDTO dto) {
        return this.validateBeforeEditById(request, dto);
    }



    @PatchMapping("/edit/current_milliseconds")
    public ResponseEntity<?> setCurrentMilliseconds(HttpServletRequest request,
                                                    @RequestBody WorkoutEditLongRequestDTO dto) {
        // Проверяем тренировку перед её изменением
        WorkoutAuthKeyRequestDTO authKeyRequestDTO = new WorkoutAuthKeyRequestDTO();
        authKeyRequestDTO.setCustomerAuthKey(dto.getCustomerAuthKey());
        authKeyRequestDTO.setWorkoutAuthKey(dto.getWorkoutAuthKey());

        ResponseEntity<?> response = validateBeforeEditByAuthKey(request, authKeyRequestDTO);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }
        dto.setCustomerAuthKey(authKeyRequestDTO.getCustomerAuthKey());
        dto.setWorkoutAuthKey(authKeyRequestDTO.getWorkoutAuthKey());

        long currentMilliseconds = dto.getValue();
        if (currentMilliseconds < 0) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Количество миллисекунд не должно быть отрицательным");
            return ResponseEntity.badRequest().body(message);
        }

        Workout workout = WORKOUT_SERVICE.findByAuthKey(dto.getWorkoutAuthKey());
        workout = WORKOUT_SERVICE.editCurrentMilliseconds(workout, currentMilliseconds);
        if (workout != null) {
            WorkoutResponseDTO responseDTO = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(3,
                    "Не удалось установить текущее время");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/close")
    public ResponseEntity<?> close(HttpServletRequest request,
                                   @RequestBody EntityIdRequestDTO dto) {
        // Проверяем тренировку перед её изменением
        ResponseEntity<?> response = validateBeforeEditById(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Перед завершением тренировки, мы должны установить ответы к вопросам, которые не были отвечены
        long workoutId = dto.getId();
        List<WorkoutItem> workoutItemsWithoutAnswer = WORKOUT_ITEM_SERVICE.findAll(
                workoutId, false, 0);
        if (workoutItemsWithoutAnswer != null && workoutItemsWithoutAnswer.size() > 0) {
            for (WorkoutItem workoutItem: workoutItemsWithoutAnswer) {
                WORKOUT_ITEM_SERVICE.setAnswer(workoutItem, null, false);
            }
        }

        Workout workout = WORKOUT_SERVICE.find(workoutId);
        workout = WORKOUT_SERVICE.close(workout);
        if (workout != null) {
            WorkoutResponseDTO responseDTO = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Не удалось завершить тренировку");
            return ResponseEntity.badRequest().body(message);
        }
    }



    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(HttpServletRequest request,
                                    @RequestBody EntityIdRequestDTO dto) {
        // Проверяем тренировку перед удалением
        ResponseEntity<?> response = validateBeforeDelete(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.find(dto.getId());
        WORKOUT_SERVICE.delete(workout);

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Тренировка успешно удалена");
        return ResponseEntity.ok(message);
    }
}
