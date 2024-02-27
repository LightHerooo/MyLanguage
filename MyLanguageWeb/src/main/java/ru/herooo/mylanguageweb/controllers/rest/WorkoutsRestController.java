package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.*;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypes;
import ru.herooo.mylanguagedb.types.WorkoutRoundStatistic;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.other.LongResponse;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutResponseDTO;
import ru.herooo.mylanguageweb.dto.types.WorkoutRoundStatisticResponseDTO;
import ru.herooo.mylanguageweb.services.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/workouts")
public class WorkoutsRestController {
    private final long MAX_NUMBER_OF_NOT_OVER_WORKOUTS = 3;
    private final long MIN_NUMBER_OF_WORDS = 10;

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final WorkoutTypesRestController WORKOUT_TYPES_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;

    private final CustomerService CUSTOMER_SERVICE;
    private final WorkoutTypeService WORKOUT_TYPE_SERVICE;
    private final WorkoutService WORKOUT_SERVICE;
    private final WordService WORD_SERVICE;
    private final WorkoutItemService WORKOUT_ITEM_SERVICE;
    private final LangService LANG_SERVICE;


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
                                  LangService langService,

                                  WorkoutMapping workoutMapping) {
        this.WORKOUT_TYPES_REST_CONTROLLER = workoutTypesRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;

        this.CUSTOMER_SERVICE = customerService;
        this.WORKOUT_TYPE_SERVICE = workoutTypeService;
        this.WORKOUT_SERVICE = workoutService;
        this.WORD_SERVICE = wordService;
        this.WORKOUT_ITEM_SERVICE = workoutItemService;
        this.LANG_SERVICE = langService;

        this.WORKOUT_MAPPING = workoutMapping;
    }

    @GetMapping("/not_over")
    public ResponseEntity<?> getNotOver(@RequestParam("customer_id") Long customerId,
                                        @RequestParam("workout_type_code") String workoutTypeCode,
                                        @RequestParam("is_active") Boolean isActive) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<Workout> workouts = WORKOUT_SERVICE.findListNotOver(customerId, workoutTypeCode, isActive);
        if (workouts != null && workouts.size() > 0) {
            List<WorkoutResponseDTO> responseDTOs = workouts
                    .stream()
                    .map(WORKOUT_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(999,
                    String.format("Не удалось найти незавершённые тренировки режима '%s' у пользователя с id = '%d'.",
                            workoutTypeCode, customerId));
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

        // Проверяем, что у пользователя нет более 3-х незавершённых тренировок
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        long countNotOver = WORKOUT_SERVICE.countNotOver(customer.getId(), dto.getWorkoutTypeCode(), true);
        if (countNotOver >= MAX_NUMBER_OF_NOT_OVER_WORKOUTS) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Достигнуто максимальное количество незавершённых тренировок (%d).",
                            MAX_NUMBER_OF_NOT_OVER_WORKOUTS));
            return ResponseEntity.badRequest().body(message);
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
            CustomResponseMessage message = new CustomResponseMessage(2,
                    "Произошла ошибка при создании тренировки.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/change_activity")
    public ResponseEntity<?> changeActivity(HttpServletRequest request,
                                            @RequestBody WorkoutRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.find(dto.getId());
        workout = WORKOUT_SERVICE.changeActivity(workout);
        if (workout != null) {
            WorkoutResponseDTO responseDTO = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Не удалось именить статус активности тренировке с id = '%d'", dto.getId()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/close")
    public ResponseEntity<?> close(HttpServletRequest request,
                                   @RequestBody WorkoutRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = validateSecurityKey(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Мы должны установить неправильные ответы словам, на которые не даны ответы (при их наличии)
        List<WorkoutItem> workoutItemsWithoutAnswer = WORKOUT_ITEM_SERVICE.findListWithoutAnswer(dto.getId());
        if (workoutItemsWithoutAnswer != null && workoutItemsWithoutAnswer.size() > 0) {
            for (WorkoutItem itemWithoutAnswer: workoutItemsWithoutAnswer) {
                itemWithoutAnswer.setCorrect(false);
                WORKOUT_ITEM_SERVICE.edit(itemWithoutAnswer);
            }
        }

        Workout workout = WORKOUT_SERVICE.find(dto.getId());
        workout = WORKOUT_SERVICE.close(workout);
        if (workout != null) {
            WorkoutResponseDTO responseDTO = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Не удалось закончить тренировку.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/set_current_milliseconds")
    public ResponseEntity<?> setCurrentMilliseconds(HttpServletRequest request,
                                                    @RequestBody WorkoutRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = validateSecurityKey(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (dto.getCurrentMilliseconds() < 0) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Текущее время не должно быть отрицательным.");
            return ResponseEntity.badRequest().body(message);
        }

        Workout workout = WORKOUT_SERVICE.find(dto.getId());
        workout.setCurrentMilliseconds(dto.getCurrentMilliseconds());

        workout = WORKOUT_SERVICE.edit(workout);
        if (workout != null) {
            WorkoutResponseDTO responseDTO = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(3,
                    "Не удалось установить текущее время.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/repair_not_over")
    public ResponseEntity<?> repairNotOver(HttpServletRequest request,
                                           @RequestBody WorkoutRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        // Проверяем пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUT_TYPES_REST_CONTROLLER.find(dto.getWorkoutTypeCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        WORKOUT_SERVICE.repairNotOver(customer.getId(), dto.getWorkoutTypeCode());

        CustomResponseMessage message = new CustomResponseMessage(1,
                "Поврежденные тренировки успешно восстановлены.");
        return ResponseEntity.ok(message);
    }


    @DeleteMapping
    public ResponseEntity<?> delete(HttpServletRequest request,
                                    @RequestBody WorkoutRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.find(dto.getId());
        WORKOUT_SERVICE.delete(workout);

        CustomResponseMessage message = new CustomResponseMessage(1, "Тренировка успешно удалена.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
        Workout workout = WORKOUT_SERVICE.find(id);
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
    public ResponseEntity<?> findLast(@RequestParam("customer_id") Long customerId,
                                      @RequestParam("workout_type_code")
                                                                        String workoutTypeCode) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUT_TYPES_REST_CONTROLLER.find(workoutTypeCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.findLast(customerId, workoutTypeCode);
        if (workout != null) {
            WorkoutResponseDTO dto = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Тренировка с кодом '%s' у пользователя с id = '%d' не найдена.",
                            workoutTypeCode, customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/last_inactive_by_customer_id")
    public ResponseEntity<?> findLastInactive(@RequestParam("customer_id") Long customerId) {
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.find(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.findLastInactive(customerId);
        if (workout != null) {
            WorkoutResponseDTO dto = WORKOUT_MAPPING.mapToResponseDTO(workout);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Последняя неактивная тренировка у пользователя с id = '%d' не найдена.", customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/current_round_number_by_workout_id")
    public ResponseEntity<?> findCurrentRoundNumber(@RequestParam("workout_id") Long workoutId) {
        ResponseEntity<?> response = find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        long currentRoundNumber = WORKOUT_SERVICE.findCurrentRoundNumber(workoutId);
        if (currentRoundNumber > 0) {
            LongResponse longResponse = new LongResponse(currentRoundNumber);
            return ResponseEntity.ok(longResponse);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(999,
                    String.format("Текущий раунд у тренировки с id = '%d' не найден.", workoutId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/round_statistic_by_workout_id_and_round_number")
    public ResponseEntity<?> findRoundStatistic(
            @RequestParam("workout_id") Long workoutId,
            @RequestParam("round_number") Long roundNumber) {
        ResponseEntity<?> response = find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = validateRoundNumberValue(workoutId, roundNumber);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutRoundStatistic workoutRoundStatistic =
                WORKOUT_SERVICE.findRoundStatistic(workoutId, roundNumber);
        if (workoutRoundStatistic != null) {
            WorkoutRoundStatisticResponseDTO dto = new WorkoutRoundStatisticResponseDTO(workoutRoundStatistic);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(3,
                    String.format("Не удалось получить статистику по раунду №%d в тренировке с id = '%d'",
                            roundNumber, workoutId));
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

        if (dto.getId() == 0) {
            // Проверяем начальный язык
            response = LANGS_REST_CONTROLLER.find(dto.getLangInCode());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Проверяем начальный язык на доступность
            response = LANGS_REST_CONTROLLER.validateIsActive(dto.getLangInCode());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Проверяем конечный язык
            response = LANGS_REST_CONTROLLER.find(dto.getLangOutCode());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Проверяем конечный язык на доступность
            response = LANGS_REST_CONTROLLER.validateIsActive(dto.getLangOutCode());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Проверяем количество слов
            long numberOfWords = dto.getNumberOfWords();
            if (numberOfWords < MIN_NUMBER_OF_WORDS) {
                CustomResponseMessage message = new CustomResponseMessage(1,
                        String.format("Количество слов должно быть не менее %d.", MIN_NUMBER_OF_WORDS));
                return ResponseEntity.badRequest().body(message);
            }

            return validateWorkoutType(dto);
        } else {
            response = find(dto.getId());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Тренировка не должна быть завершена
            response = validateIsNotWorkoutEnded(dto.getId());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Проверяем, владеет ли тренировкой пользователь
            Workout workout = WORKOUT_SERVICE.find(dto.getId());
            Customer authCustomer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
            if (!authCustomer.equals(workout.getCustomer())) {
                CustomResponseMessage message = new CustomResponseMessage(2,
                        "Разрешено взаимодействовать только со своими тренировками.");
                return ResponseEntity.badRequest().body(message);
            }
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Данные корректны.");
        return ResponseEntity.ok(message);
    }

    @GetMapping("/validate/is_not_workout_ended")
    public ResponseEntity<?> validateIsNotWorkoutEnded(@RequestParam("workout_id") Long workoutId) {
        ResponseEntity<?> response = find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.find(workoutId);
        if (workout.getDateOfEnd() == null) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Тренировка не завершена.");
            return ResponseEntity.ok(message);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Тренировка завершена.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/round_number_value_by_workout_id_and_round_number")
    public ResponseEntity<?> validateRoundNumberValue(
            @RequestParam("workout_id") Long workoutId,
            @RequestParam("roundNumber") Long roundNumber) {
        ResponseEntity<?> response = find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (roundNumber == null || roundNumber <= 0) {
            CustomResponseMessage message = new CustomResponseMessage(1, "Номер раунда должен быть больше 0.");
            return ResponseEntity.badRequest().body(message);
        }

        long maxRoundNumber = WORKOUT_SERVICE.findMaxRoundNumber(workoutId);
        if (roundNumber > maxRoundNumber) {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    String.format("Максимальное значение раунда искомой тренировки - '%d'", maxRoundNumber));
            return ResponseEntity.badRequest().body(message);
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Номер раунда корректен.");
        return ResponseEntity.ok(message);
    }

    public ResponseEntity<?> validateSecurityKey(HttpServletRequest request, WorkoutRequestDTO dto) {
        ResponseEntity<?> response = find(dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Workout workout = WORKOUT_SERVICE.find(dto.getId());
        String validateSecurityKey = WORKOUT_SERVICE.validateSecurityKey(request, dto.getSecurityKey());;
        dto.setSecurityKey(validateSecurityKey);
        if (!workout.getSecurityKey().equals(validateSecurityKey)) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Ключ безопасности не совпадает с ключом тренировки.");
            return ResponseEntity.badRequest().body(message);
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Ключ безопасности валиден.");
        return ResponseEntity.ok(message);
    }

    private ResponseEntity<?> validateWorkoutType(WorkoutRequestDTO dto) {
        // Проверяем тип тренировки. От него будем отталкиваться, какие проверки проводить
        ResponseEntity<?> response = WORKOUT_TYPES_REST_CONTROLLER.find(dto.getWorkoutTypeCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(dto.getWorkoutTypeCode());
        if (!workoutType.getActive()) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Режим тренировки '%s' недоступен.", workoutType.getTitle()));
            return ResponseEntity.badRequest().body(message);
        }

        // Флаг проверки подготовленности режима
        boolean isTypePrepared = false;

        // Режим "Случайные слова"
        if (workoutType.getId() == WorkoutTypes.RANDOM_WORDS.ID) {
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

            // Количество слов должно быть больше или равно тому, какое вообще существует под конкретным языком
            long count = WORD_SERVICE.countByLangCode(dto.getLangInCode());
            if (count < MIN_NUMBER_OF_WORDS) {
                Lang langIn = LANG_SERVICE.find(dto.getLangInCode());

                CustomResponseMessage message = new CustomResponseMessage(3, String.format(
                        "В языке '%s' недостаточно слов для генерации (в наличии: %d, разрешённый минимум: %d).",
                        langIn.getTitle(), count, MIN_NUMBER_OF_WORDS));
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
        // Флаг проверки успешности генерации слов тренировки
        boolean areItemsCreated = false;

        // Режим "Случайные слова"
        if (workout.getWorkoutType().getId() == WorkoutTypes.RANDOM_WORDS.ID) {
            List<Word> randomWords = WORD_SERVICE.findListRandom(
                    workout.getLangIn().getCode(), workout.getNumberOfWords());

            for (Word word: randomWords) {
                WorkoutItem workoutItem = new WorkoutItem();
                workoutItem.setWorkout(workout);
                workoutItem.setWordTitleQuestion(word.getTitle());

                workoutItem = WORKOUT_ITEM_SERVICE.add(workoutItem);
                areItemsCreated = workoutItem != null;
                if (!areItemsCreated) {
                    break;
                }
            }
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
