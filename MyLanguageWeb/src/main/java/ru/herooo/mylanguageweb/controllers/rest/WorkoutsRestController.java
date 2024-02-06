package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.*;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypes;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.workout.WorkoutRequestDTO;
import ru.herooo.mylanguageweb.dto.workout.WorkoutResponseDTO;
import ru.herooo.mylanguageweb.services.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutsRestController {
    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final WorkoutTypesRestController WORKOUT_TYPES_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;

    private final CustomerService CUSTOMER_SERVICE;
    private final WorkoutTypeService WORKOUT_TYPE_SERVICE;
    private final WorkoutService WORKOUT_SERVICE;
    private final WordService WORD_SERVICE;
    private final WorkoutItemService WORKOUT_ITEM_SERVICE;


    private final WorkoutMapping WORKOUT_MAPPING;

    @Autowired
    public WorkoutsRestController(WorkoutTypesRestController workoutTypesRestController,
                                  CustomersRestController customersRestController,
                                  LangsRestController langsRestController,

                                  CustomerService customerService,
                                  WorkoutTypeService workoutTypeService,
                                  WorkoutService workoutService,
                                  WordService wordService,
                                  WorkoutItemService workoutItemService,

                                  WorkoutMapping workoutMapping) {
        this.WORKOUT_TYPES_REST_CONTROLLER = workoutTypesRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;

        this.CUSTOMER_SERVICE = customerService;
        this.WORKOUT_TYPE_SERVICE = workoutTypeService;
        this.WORKOUT_SERVICE = workoutService;
        this.WORD_SERVICE = wordService;
        this.WORKOUT_ITEM_SERVICE = workoutItemService;

        this.WORKOUT_MAPPING = workoutMapping;
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> findById(@RequestParam("id") Long id) {
        Workout workout = WORKOUT_SERVICE.findById(id);
        if (workout != null) {
            WorkoutResponseDTO dto = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Тренировка с id = '%d' не найдена.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/last_by_customer_id_and_workout_type_code")
    public ResponseEntity<?> findLastByCustomerId(@RequestParam("customer_id") Long customerId,
                                                  @RequestParam("workout_type_code") String workoutTypeCode) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findById(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUT_TYPES_REST_CONTROLLER.findByCode(workoutTypeCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findById(customerId);
        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.findByCode(workoutTypeCode);
        Workout workout = WORKOUT_SERVICE.findLastByCustomerAndWorkoutType(customer, workoutType);
        if (workout != null) {
            WorkoutResponseDTO dto = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Тренировка типа '%s' у пользователя с id = '%d' не найдена.",
                            workoutType.getTitle(), customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping
    public ResponseEntity<?> add(HttpServletRequest request,
                                 @RequestBody WorkoutRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.add(dto);
        if (workout != null) {
            response = tryToCreateWorkoutItems(workout);
            if (response.getStatusCode() == HttpStatus.OK) {
                WorkoutResponseDTO responseDTO = WORKOUT_MAPPING.mapToResponseDTO(workout);
                return ResponseEntity.ok(responseDTO);
            } else {
                WORKOUT_SERVICE.delete(workout);
                return response;
            }
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Произошла ошибка при создании тренировки.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/validate/before_crud")
    public ResponseEntity<?> validateBeforeCrud(HttpServletRequest request,
                                                @RequestBody WorkoutRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        // Проверяем пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем исходящий язык
        response = LANGS_REST_CONTROLLER.findByCode(dto.getLangOutCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем количество слов
        long numberOfWords = dto.getNumberOfWords();
        if (numberOfWords <= 0) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Количество слов должно быть больше 0.");
            return ResponseEntity.badRequest().body(message);
        }

        return validateByWorkoutType(dto);
    }

    private ResponseEntity<?> validateByWorkoutType(WorkoutRequestDTO dto) {
        // Проверяем тип тренировки. От него будем отталкиваться, какие проверки проводить
        ResponseEntity<?> response = WORKOUT_TYPES_REST_CONTROLLER.findByCode(dto.getWorkoutTypeCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.findByCode(dto.getWorkoutTypeCode());
        if (!workoutType.getActive()) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Режим тренировки '%s' недоступен.", workoutType.getTitle()));
            return ResponseEntity.badRequest().body(message);
        }


        boolean isTypePrepared = false;
        if (workoutType.getId() == WorkoutTypes.RANDOM_WORDS.ID) {
            // Режим "Случайные слова"

            // Проверяем входящий язык
            response = LANGS_REST_CONTROLLER.findByCode(dto.getLangInCode());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Проверяем количество (повторно, дополнительные условия)
            final long[] POSSIBLE_NUMBER_OF_WORDS_VALUES = new long[]{10, 20, 30, 40, 50};
            boolean isNumberOfWordsPossible = Arrays.stream(POSSIBLE_NUMBER_OF_WORDS_VALUES)
                    .anyMatch(number -> number == dto.getNumberOfWords());
            if (!isNumberOfWordsPossible) {
                StringBuilder possibleValuesStrBuilder = new StringBuilder();
                possibleValuesStrBuilder.append("[");
                for (int i = 0; i < POSSIBLE_NUMBER_OF_WORDS_VALUES.length; i++) {
                    possibleValuesStrBuilder.append(POSSIBLE_NUMBER_OF_WORDS_VALUES[i]);
                    if (i < POSSIBLE_NUMBER_OF_WORDS_VALUES.length - 1) {
                        possibleValuesStrBuilder.append(", ");
                    }
                }
                possibleValuesStrBuilder.append("]");
                CustomResponseMessage message = new CustomResponseMessage(2,
                        String.format("В режиме '%s' разрешено количество из следующих значений: %s.",
                                workoutType.getTitle(), possibleValuesStrBuilder));
                return ResponseEntity.badRequest().body(message);
            }

            isTypePrepared = true;
        }

        if (isTypePrepared) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Данные для режима '%s' корректны.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(3,
                    String.format("Режим '%s' не подготовлен.", workoutType.getTitle()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    private ResponseEntity<?> tryToCreateWorkoutItems(Workout workout) {
        boolean areItemsCreated = false;
        if (workout.getWorkoutType().getId() == WorkoutTypes.RANDOM_WORDS.ID) {
            List<Word> randomWords = WORD_SERVICE.findRandomByLangCodeAndCount(
                    workout.getLangIn().getCode(), workout.getNumberOfWords());

            for (Word word: randomWords) {
                WorkoutItem workoutItem = new WorkoutItem();
                workoutItem.setWorkout(workout);
                workoutItem.setWordTitleRequest(word.getTitle());

                WORKOUT_ITEM_SERVICE.add(workoutItem);
            }

            areItemsCreated = true;
        }

        if (areItemsCreated) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                String.format("Слова для тренировки режима '%s' успешно сгенерированы.",
                        workout.getWorkoutType().getTitle()));
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Не удалось сгенерировать слова для тренировки режима '%s'.",
                            workout.getWorkoutType().getTitle()));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
