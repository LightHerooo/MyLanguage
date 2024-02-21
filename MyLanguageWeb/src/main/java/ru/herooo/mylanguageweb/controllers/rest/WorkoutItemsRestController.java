package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.WorkoutItem;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryResponse;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryUtils;
import ru.herooo.mylanguageutils.yandexdictionary.dicresult.DicResult;
import ru.herooo.mylanguageutils.yandexdictionary.errorresult.ErrorResult;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.AnswerResultResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.WorkoutItemRequestDTO;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.WorkoutItemMapping;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.WorkoutItemResponseDTO;
import ru.herooo.mylanguageweb.dto.other.LongResponse;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WorkoutItemService;
import ru.herooo.mylanguageweb.services.WorkoutService;

import java.util.List;

@RestController
@RequestMapping("/api/workout_items")
public class WorkoutItemsRestController {
    private final int MAX_NUMBER_OF_POSSIBLE_VALUES = 5;

    private final WorkoutsRestController WORKOUTS_REST_CONTROLLER;
    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;

    private final WorkoutItemService WORKOUT_ITEM_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;

    private final WorkoutItemMapping WORKOUT_ITEM_MAPPING;

    private final YandexDictionaryUtils YANDEX_DICTIONARY_UTILS;

    @Autowired
    public WorkoutItemsRestController(WorkoutsRestController workoutsRestController,
                                      CustomersRestController customersRestController,

                                      WorkoutItemService workoutItemService,
                                      CustomerService customerService,

                                      WorkoutItemMapping workoutItemMapping,

                                      YandexDictionaryUtils yandexDictionaryUtils) {
        this.WORKOUTS_REST_CONTROLLER = workoutsRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;

        this.WORKOUT_ITEM_SERVICE = workoutItemService;
        this.CUSTOMER_SERVICE = customerService;

        this.WORKOUT_ITEM_MAPPING = workoutItemMapping;

        this.YANDEX_DICTIONARY_UTILS = yandexDictionaryUtils;
    }

    @GetMapping("/with_answer_by_workout_id_and_round_number")
    public ResponseEntity<?> getListWithAnswer(@RequestParam("workout_id") Long workoutId,
                                               @RequestParam("round_number") Long roundNumber) {
        ResponseEntity<?> response = WORKOUTS_REST_CONTROLLER.find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUTS_REST_CONTROLLER.validateRoundNumberValue(workoutId, roundNumber);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<WorkoutItem> workoutItems = WORKOUT_ITEM_SERVICE
                .findListWithAnswer(workoutId, roundNumber);
        if (workoutItems != null) {
            if (workoutItems.size() > 0) {
                List<WorkoutItemResponseDTO> responseDTOs = workoutItems
                        .stream()
                        .map(WORKOUT_ITEM_MAPPING::mapToResponseDTO)
                        .toList();
                return ResponseEntity.ok(responseDTOs);
            } else {
                CustomResponseMessage message = new CustomResponseMessage(999, "Ответы не найдены.");
                return ResponseEntity.badRequest().body(message);
            }
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Слова с ответами в тренировке с id = '%d' в раунде №%d не найдены.",
                            workoutId, roundNumber));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/add_to_next_round")
    public ResponseEntity<?> addToNextRound(HttpServletRequest request,
                                            @RequestBody WorkoutItemRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверям, дан ли ответ на вопрос
        WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE.find(dto.getId());
        if (workoutItem.getDateOfSetAnswer() == null) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "На вопрос не был дан ответ.");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем, корректный ли ответ
        if (workoutItem.isCorrect()) {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    "Невозможно добавить слово в следующий раунд, так как на него был дан правильный ответ.");
            return ResponseEntity.badRequest().body(message);
        }

        // Мы должны проверить, нет ли неотвеченных вопросов в прошлом раунде
        int currentRoundNumber = workoutItem.getRoundNumber();
        if (currentRoundNumber > 1) {
            int beforeRoundNumber = currentRoundNumber - 1;
            WorkoutItem workoutItemWithoutAnswer = WORKOUT_ITEM_SERVICE
                    .findFirstWithoutAnswerByWorkoutIdAndRoundNumber(workoutItem.getWorkout().getId(), beforeRoundNumber);
            if (workoutItemWithoutAnswer != null) {
                CustomResponseMessage message = new CustomResponseMessage(3,
                        "В предыдущем раунде ещё есть вопросы без ответа.");
                return ResponseEntity.badRequest().body(message);
            }
        }

        WorkoutItem workoutItemForNextRound = new WorkoutItem();
        workoutItemForNextRound.setWorkout(workoutItem.getWorkout());
        workoutItemForNextRound.setWordTitleQuestion(workoutItem.getWordTitleQuestion());
        workoutItemForNextRound.setRoundNumber(currentRoundNumber + 1);
        workoutItemForNextRound = WORKOUT_ITEM_SERVICE.add(workoutItemForNextRound);
        if (workoutItemForNextRound != null) {
            WorkoutItemResponseDTO responseDTO = WORKOUT_ITEM_MAPPING.mapToResponseDTO(workoutItem);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(4,
                    "Не удалось создать вопрос на следующий раунд.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/set_answer")
    public ResponseEntity<?> setAnswer(HttpServletRequest request,
                                       @RequestBody WorkoutItemRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем, не дан ли ответ на пришедший вопрос
        WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE.find(dto.getId());
        if (workoutItem.getDateOfSetAnswer() != null) {
            CustomResponseMessage message = new CustomResponseMessage(1, "На вопрос уже был дан ответ.");
            return ResponseEntity.badRequest().body(message);
        }

        response = getAnswerToQuestion(dto);
        if (response.getBody() instanceof AnswerResultResponseDTO answerResultResponseDTO) {
            workoutItem.setCorrect(answerResultResponseDTO.getIsCorrect());
            workoutItem = WORKOUT_ITEM_SERVICE.edit(workoutItem, dto);
            if (workoutItem != null) {
                answerResultResponseDTO.setWorkoutItem(WORKOUT_ITEM_MAPPING.mapToResponseDTO(workoutItem));
                return ResponseEntity.ok(answerResultResponseDTO);
            } else {
                CustomResponseMessage message = new CustomResponseMessage(2,
                        "Не удалось сохранить ответ на вопрос.");
                return ResponseEntity.badRequest().body(message);
            }
        } else if (response.getBody() instanceof CustomResponseMessage) {
            return response;
        } else {
            CustomResponseMessage message = new CustomResponseMessage(3, "Неизвестная ошибка обращения к API.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/count_with_answer_by_workout_id_and_round_number")
    public ResponseEntity<?> getCountWithAnswer(
            @RequestParam("workout_id") Long workoutId,
            @RequestParam("round_number") Long roundNumber) {
        ResponseEntity<?> response = WORKOUTS_REST_CONTROLLER.find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUTS_REST_CONTROLLER.validateRoundNumberValue(workoutId, roundNumber);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        long numberOfItems = WORKOUT_ITEM_SERVICE.countWithAnswer(workoutId, roundNumber);
        return ResponseEntity.ok(new LongResponse(numberOfItems));
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
        WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE.find(id);
        if (workoutItem != null) {
            WorkoutItemResponseDTO dto = WORKOUT_ITEM_MAPPING.mapToResponseDTO(workoutItem);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Элемента тренировки с id = '%d' не найдено.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/random_without_answer_by_workout_id_and_round_number")
    public ResponseEntity<?> findRandomWithoutAnswer(
            @RequestParam("workout_id") Long workoutId,
            @RequestParam("round_number") Long roundNumber) {
        ResponseEntity<?> response = WORKOUTS_REST_CONTROLLER.find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUTS_REST_CONTROLLER.validateRoundNumberValue(workoutId, roundNumber);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE
                .findRandomWithoutAnswer(workoutId, roundNumber);
        if (workoutItem != null) {
            WorkoutItemResponseDTO dto = WORKOUT_ITEM_MAPPING.mapToResponseDTO(workoutItem);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(999,
                    String.format("Слово в раунде '%d' тренировки с id = '%d' не найдено.", roundNumber, workoutId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/validate/before_crud")
    public ResponseEntity<?> validateBeforeCrud(HttpServletRequest request,
                                                @RequestBody WorkoutItemRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        // Проверяем авторизированного пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (dto.getId() != 0) {
            response = find(dto.getId());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Тренировка не должна быть завершена
            WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE.find(dto.getId());
            response = WORKOUTS_REST_CONTROLLER.validateIsNotWorkoutEnded(workoutItem.getWorkout().getId());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            // Сравниваем пользователя элемента тренировки с пользователем, который хочет её изменить
            Customer authCustomer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
            if (!workoutItem.getWorkout().getCustomer().equals(authCustomer)) {
                CustomResponseMessage message = new CustomResponseMessage(1,
                        "Разрешено взаимодействовать только с элементами своих тренировок.");
                return ResponseEntity.badRequest().body(message);
            }

            // Проверяем ключ безопасности
            WorkoutRequestDTO workoutRequestDTO = new WorkoutRequestDTO();
            workoutRequestDTO.setId(workoutItem.getWorkout().getId());
            workoutRequestDTO.setSecurityKey(dto.getSecurityKey());
            response = WORKOUTS_REST_CONTROLLER.validateSecurityKey(request, workoutRequestDTO);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Данные корректны.");
        return ResponseEntity.ok(message);
    }

    public ResponseEntity<?> getAnswerToQuestion(@RequestBody WorkoutItemRequestDTO dto) {
        ResponseEntity<?> response = find(dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE.find(dto.getId());

        String word = workoutItem.getWordTitleQuestion();
        String langInCode = workoutItem.getWorkout().getLangIn().getCodeForTranslate();
        String langOutCode = workoutItem.getWorkout().getLangOut().getCodeForTranslate();
        YandexDictionaryResponse dicResponse = YANDEX_DICTIONARY_UTILS.getResponse(word, langInCode, langOutCode);
        if (dicResponse != null) {
            if (dicResponse.getCode() == HttpStatus.OK.value()) {
                DicResult dicResult = YANDEX_DICTIONARY_UTILS.getDicResult(dicResponse);
                if (dicResult != null) {
                    List<String> allTranslates =  dicResult.getAllTranslates();
                    if (allTranslates != null && allTranslates.size() > 0) {
                        boolean isCorrect = allTranslates
                                .stream()
                                .anyMatch(s -> s.equalsIgnoreCase(dto.getWordTitleAnswer()));

                        if (isCorrect) {
                            // Если ответ верный, мы не должны его отображать в других возможных переводах
                            allTranslates = allTranslates
                                    .stream()
                                    .filter(s -> !s.equalsIgnoreCase(dto.getWordTitleAnswer())).toList();
                        }

                        // Режем список до максимально возможного количества
                        if (allTranslates.size() > MAX_NUMBER_OF_POSSIBLE_VALUES) {
                            allTranslates = allTranslates.subList(0, MAX_NUMBER_OF_POSSIBLE_VALUES);
                        }

                        AnswerResultResponseDTO answerResultResponseDTO = new AnswerResultResponseDTO();
                        answerResultResponseDTO.setIsCorrect(isCorrect);
                        answerResultResponseDTO.setPossibleAnswers(allTranslates);
                        return ResponseEntity.ok(answerResultResponseDTO);
                    } else {
                        CustomResponseMessage message = new CustomResponseMessage(1,
                                String.format("Переводы на слово '%s' не найдены.", word));
                        return ResponseEntity.badRequest().body(message);
                    }
                } else {
                    CustomResponseMessage message = new CustomResponseMessage(2,
                            "Не удалось получить результат API.");
                    return ResponseEntity.badRequest().body(message);
                }
            } else {
                ErrorResult errorResult = YANDEX_DICTIONARY_UTILS.getErrorResult(dicResponse);
                CustomResponseMessage message = new CustomResponseMessage(
                        errorResult.getCode(), errorResult.getMessage());
                return ResponseEntity.badRequest().body(message);
            }
        } else {
            CustomResponseMessage message = new CustomResponseMessage(3, "Не удалось обратиться к API.");
            return ResponseEntity.badRequest().body(message);
        }
    }
}
