package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.WorkoutItem;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.entities.workout.Workout;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypes;
import ru.herooo.mylanguageutils.http.HttpJsonResponse;
import ru.herooo.mylanguageutils.yandexdictionary.yandexdic.YandexDic;
import ru.herooo.mylanguageutils.yandexdictionary.YandexDictionaryError;
import ru.herooo.mylanguageutils.yandexdictionary.yandexdic.YandexDicUtils;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.request.WorkoutItemIdRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.request.edit.WorkoutItemEditAnswerRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.EntityIdRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.other.AnswerInfoResponseDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.WorkoutItemMapping;
import ru.herooo.mylanguageweb.dto.entity.workoutitem.response.WorkoutItemResponseDTO;
import ru.herooo.mylanguageweb.dto.other.response.value.LongResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WorkoutItemService;
import ru.herooo.mylanguageweb.services.WorkoutService;

import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/workout_items")
public class WorkoutItemsRestController {
    private final int MAX_NUMBER_OF_POSSIBLE_VALUES = 5;

    private final WorkoutsRestController WORKOUTS_REST_CONTROLLER;
    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;

    private final WorkoutItemService WORKOUT_ITEM_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;
    private final WorkoutService WORKOUT_SERVICE;


    private final WorkoutItemMapping WORKOUT_ITEM_MAPPING;

    private final YandexDicUtils DIC_UTILS;

    @Autowired
    public WorkoutItemsRestController(WorkoutsRestController workoutsRestController,
                                      CustomersRestController customersRestController,

                                      WorkoutItemService workoutItemService,
                                      CustomerService customerService,
                                      WorkoutService workoutService,

                                      WorkoutItemMapping workoutItemMapping,

                                      YandexDicUtils yandexDicUtils) {
        this.WORKOUTS_REST_CONTROLLER = workoutsRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;

        this.WORKOUT_ITEM_SERVICE = workoutItemService;
        this.CUSTOMER_SERVICE = customerService;
        this.WORKOUT_SERVICE = workoutService;

        this.WORKOUT_ITEM_MAPPING = workoutItemMapping;

        this.DIC_UTILS = yandexDicUtils;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAll(@RequestParam("workout_id") Long workoutId,
                                    @RequestParam(value = "is_question_with_answer", required = false) Boolean isQuestionWithAnswer,
                                    @RequestParam(value = "round_number", required = false, defaultValue = "0") Integer roundNumber) {
        ResponseEntity<?> response = WORKOUTS_REST_CONTROLLER.find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUTS_REST_CONTROLLER.validateRoundNumber(workoutId, roundNumber);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        List<WorkoutItem> workoutItems = WORKOUT_ITEM_SERVICE.findAll(workoutId, isQuestionWithAnswer, roundNumber);
        if (workoutItems != null && workoutItems.size() > 0) {
            List<WorkoutItemResponseDTO> responseDTOs = workoutItems
                    .stream()
                    .map(WORKOUT_ITEM_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Слова с ответами в тренировке с id = '%d' в раунде №%d не найдены",
                            workoutId, roundNumber));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getCount(
            @RequestParam("workout_id") Long workoutId,
            @RequestParam(value = "is_question_with_answer", required = false) Boolean isQuestionWithAnswer,
            @RequestParam(value = "round_number", required = false, defaultValue = "0") Integer roundNumber) {
        ResponseEntity<?> response = WORKOUTS_REST_CONTROLLER.find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUTS_REST_CONTROLLER.validateRoundNumber(workoutId, roundNumber);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        long numberOfItems = WORKOUT_ITEM_SERVICE.count(workoutId, isQuestionWithAnswer, roundNumber);
        return ResponseEntity.ok(new LongResponseDTO(numberOfItems));
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
        WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE.find(id);
        if (workoutItem != null) {
            WorkoutItemResponseDTO dto = WORKOUT_ITEM_MAPPING.mapToResponseDTO(workoutItem);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Элемента тренировки с id = '%d' не найдено", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/random_without_answer")
    public ResponseEntity<?> findRandomWithoutAnswer(
            @RequestParam("workout_id") Long workoutId,
            @RequestParam("round_number") Integer roundNumber) {
        ResponseEntity<?> response = WORKOUTS_REST_CONTROLLER.find(workoutId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = WORKOUTS_REST_CONTROLLER.validateRoundNumber(workoutId, roundNumber);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE
                .findRandomWithoutAnswer(workoutId, roundNumber);
        if (workoutItem != null) {
            WorkoutItemResponseDTO dto = WORKOUT_ITEM_MAPPING.mapToResponseDTO(workoutItem);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(999,
                    String.format("Слово в раунде '%d' тренировки с id = '%d' не найдено", roundNumber, workoutId));
            return ResponseEntity.badRequest().body(message);
        }
    }



    @PostMapping("/validate/before_edit")
    public ResponseEntity<?> validateBeforeEdit(HttpServletRequest request,
                                                @RequestBody WorkoutItemIdRequestDTO dto) {
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
        response = WORKOUTS_REST_CONTROLLER.isExistsByAuthKey(validateWorkoutAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем элемент тренировки
        long workoutItemId = dto.getId();
        response = find(workoutItemId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Тренировкой должен владеть пользователь
        WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE.find(workoutItemId);
        Workout workout = workoutItem.getWorkout();
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateCustomerAuthKey);
        response = WORKOUTS_REST_CONTROLLER.validateIsAuthor(customer.getId(), workout.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Тренировка не должна быть завершена
        response = WORKOUTS_REST_CONTROLLER.validateIsNotOver(workout.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                "Данные для изменения элемента тренировки корректны");
        return ResponseEntity.ok(message);
    }



    @PatchMapping("/edit/answer")
    public ResponseEntity<?> setAnswer(HttpServletRequest request,
                                       @Valid @RequestBody WorkoutItemEditAnswerRequestDTO dto,
                                       BindingResult bindingResult) {
        // Проверяем элемент тренировки перед его изменением
        WorkoutItemIdRequestDTO workoutItemIdRequestDTO = new WorkoutItemIdRequestDTO();
        workoutItemIdRequestDTO.setId(dto.getId());
        workoutItemIdRequestDTO.setCustomerAuthKey(dto.getCustomerAuthKey());
        workoutItemIdRequestDTO.setWorkoutAuthKey(dto.getWorkoutAuthKey());

        ResponseEntity<?> response = validateBeforeEdit(request, workoutItemIdRequestDTO);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }
        dto.setCustomerAuthKey(workoutItemIdRequestDTO.getCustomerAuthKey());
        dto.setWorkoutAuthKey(workoutItemIdRequestDTO.getWorkoutAuthKey());

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

        // Проверяем, не дан ли ответ
        WorkoutItem workoutItem = WORKOUT_ITEM_SERVICE.find(dto.getId());
        if (workoutItem.getDateOfSetAnswer() != null) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2, "На вопрос уже был дан ответ");
            return ResponseEntity.badRequest().body(message);
        }

        response = tryToCreateAnswerInfoResponseDTO(workoutItem, dto.getAnswer());
        if (response.getBody() instanceof AnswerInfoResponseDTO answerInfoResponseDTO) {
            // Мы должны добавить слово в следующий раунд, если ответ неверный (не для всех режимов)
            boolean isCorrect = answerInfoResponseDTO.getIsCorrect();
            if (!isCorrect) {
                Workout workout = workoutItem.getWorkout();
                if (workout != null) {
                    WorkoutType workoutType = workout.getWorkoutType();
                    if (workoutType != null &&
                            (workoutType.getId() == WorkoutTypes.RANDOM_WORDS.ID
                            || workoutType.getId() == WorkoutTypes.COLLECTION_WORKOUT.ID)) {
                        // Ответ переносится в следующий раунд, если переводы были найдены
                        List<String> possibleAnswers = answerInfoResponseDTO.getPossibleAnswers();
                        if (possibleAnswers != null && possibleAnswers.size() > 0) {
                            WorkoutItem workoutItemToNextRound = WORKOUT_ITEM_SERVICE.copyToNextRound(workoutItem);
                            if (workoutItemToNextRound == null) {
                                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(3,
                                        "Не удалось перенести вопрос в следующий раунд");
                                return ResponseEntity.badRequest().body(message);
                            }
                        }
                    }
                }
            }

            workoutItem = WORKOUT_ITEM_SERVICE.setAnswer(workoutItem, dto.getAnswer(), isCorrect);
            if (workoutItem != null) {
                answerInfoResponseDTO.setWorkoutItem(WORKOUT_ITEM_MAPPING.mapToResponseDTO(workoutItem));
                return ResponseEntity.ok(answerInfoResponseDTO);
            } else {
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(4,
                        "Не удалось сохранить ответ на вопрос");
                return ResponseEntity.badRequest().body(message);
            }
        } else if (response.getBody() instanceof ResponseMessageResponseDTO) {
            return response;
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(5, "Неизвестная ошибка обращения к API");
            return ResponseEntity.badRequest().body(message);
        }
    }



    public ResponseEntity<?> tryToCreateAnswerInfoResponseDTO(WorkoutItem workoutItem, String answer) {
        // Подготавливаем данные для проверки ответа
        String word = workoutItem.getQuestion();
        String langInCode = null;
        String langOutCode = null;

        Workout workout = workoutItem.getWorkout();
        if (workout != null) {
            Lang lang = workout.getLangIn();
            if (lang != null) {
                langInCode = lang.getCode();
            }

            lang = workout.getLangOut();
            if (lang != null) {
                langOutCode = lang.getCode();
            }
        }

        // Проверяем ответ на вопрос
        HttpJsonResponse httpJsonResponse = DIC_UTILS.createHttpJsonResponse(word, langInCode, langOutCode);
        if (httpJsonResponse != null) {
            if (httpJsonResponse.getCode() == HttpStatus.OK.value()) {
                YandexDic yandexDic = DIC_UTILS.createYandexDic(httpJsonResponse);
                if (yandexDic != null) {
                    List<String> allTranslates =  yandexDic.getAllTranslates();
                    if (allTranslates != null && allTranslates.size() > 0) {
                        // Проверяем корректность овтета
                        boolean isCorrect = allTranslates
                                .stream()
                                .anyMatch(s -> s.equalsIgnoreCase(answer));

                        // Если ответ верный, мы не должны его отображать в других возможных переводах
                        if (isCorrect) {
                            allTranslates = allTranslates
                                    .stream()
                                    .filter(s -> !s.equalsIgnoreCase(answer)).toList();
                        }

                        // Уменьшаем список до максимально возможного количества
                        if (allTranslates.size() > MAX_NUMBER_OF_POSSIBLE_VALUES) {
                            allTranslates = allTranslates.subList(0, MAX_NUMBER_OF_POSSIBLE_VALUES);
                        }

                        AnswerInfoResponseDTO answerInfoResponseDTO = new AnswerInfoResponseDTO();
                        answerInfoResponseDTO.setIsCorrect(isCorrect);
                        answerInfoResponseDTO.setPossibleAnswers(allTranslates);
                        if (isCorrect) {
                            String[] correctMessages = new String[]
                                    {"Правильно!", "Верно!", "Молодец!", "Отлично!", "Так держать!"};

                            Random random = new Random();
                            answerInfoResponseDTO.setMessage(
                                    correctMessages[random.nextInt(correctMessages.length)]);
                        } else {
                            String[] incorrectMessages = new String[] {"Неправильно", "Неверно"};

                            Random random = new Random();
                            answerInfoResponseDTO.setMessage(
                                    incorrectMessages[random.nextInt(incorrectMessages.length)]);
                        }

                        return ResponseEntity.ok(answerInfoResponseDTO);
                    } else {
                        AnswerInfoResponseDTO answerInfoResponseDTO = new AnswerInfoResponseDTO();
                        answerInfoResponseDTO.setIsCorrect(false);
                        answerInfoResponseDTO.setMessage("Переводы слова не найдены");
                        return ResponseEntity.badRequest().body(answerInfoResponseDTO);
                    }
                } else {
                    ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                            "Не удалось получить результат обращения к API");
                    return ResponseEntity.badRequest().body(message);
                }
            } else {
                YandexDictionaryError dicError = DIC_UTILS.createYandexDictionaryError(httpJsonResponse);
                ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(
                        dicError.getCode(), dicError.getMessage());
                return ResponseEntity.badRequest().body(message);
            }
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2, "Не удалось обратиться к API");
            return ResponseEntity.badRequest().body(message);
        }
    }
}
