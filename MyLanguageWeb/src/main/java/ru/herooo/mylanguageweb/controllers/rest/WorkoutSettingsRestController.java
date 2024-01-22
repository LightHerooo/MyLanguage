package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.WorkoutSetting;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypes;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.workoutsetting.WorkoutSettingMapping;
import ru.herooo.mylanguageweb.dto.workoutsetting.WorkoutSettingRequestDTO;
import ru.herooo.mylanguageweb.dto.workoutsetting.WorkoutSettingResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;
import ru.herooo.mylanguageweb.services.WorkoutSettingService;
import ru.herooo.mylanguageweb.services.WorkoutTypeService;

@RestController
@RequestMapping("/api/workout_settings")
public class WorkoutSettingsRestController {
    private final long MIN_NUMBER_OF_WORDS = 10;
    private final long MAX_NUMBER_OF_WORDS = 50;

    private final WorkoutTypesRestController WORKOUT_TYPES_REST_CONTROLLER;
    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;
    private final LangsRestController LANGS_REST_CONTROLLER;

    private final WorkoutTypeService WORKOUT_TYPE_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;
    private final WorkoutSettingService WORKOUT_SETTING_SERVICE;

    private final WorkoutSettingMapping WORKOUT_SETTING_MAPPING;

    @Autowired
    public WorkoutSettingsRestController(WorkoutTypesRestController workoutTypesRestController,
                                         CustomersRestController customersRestController,
                                         LangsRestController langsRestController,

                                         WorkoutTypeService workoutTypeService,
                                         CustomerService customerService,
                                         WorkoutSettingService workoutSettingService,

                                         WorkoutSettingMapping workoutSettingMapping) {
        this.WORKOUT_TYPES_REST_CONTROLLER = workoutTypesRestController;
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;
        this.LANGS_REST_CONTROLLER = langsRestController;

        this.WORKOUT_TYPE_SERVICE = workoutTypeService;
        this.CUSTOMER_SERVICE = customerService;
        this.WORKOUT_SETTING_SERVICE = workoutSettingService;

        this.WORKOUT_SETTING_MAPPING = workoutSettingMapping;
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> findById(@RequestParam("id") Long id) {
        WorkoutSetting workoutSetting = WORKOUT_SETTING_SERVICE.findById(id);
        if (workoutSetting != null) {
            WorkoutSettingResponseDTO dto = WORKOUT_SETTING_MAPPING.mapToResponseDTO(workoutSetting);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Настройки режима тренировки с id = '%d' не найдены.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_workout_type_code_and_customer_id")
    public ResponseEntity<?> findByWorkoutTypeCodeAndCustomerId(
            @RequestParam("workout_type_code") String workoutTypeCode,
            @RequestParam("customer_id") Long customerId) {
        ResponseEntity<?> response = WORKOUT_TYPES_REST_CONTROLLER.findByCode(workoutTypeCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        response = CUSTOMERS_REST_CONTROLLER.findById(customerId);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.findByCode(workoutTypeCode);
        Customer customer = CUSTOMER_SERVICE.findById(customerId);
        WorkoutSetting workoutSetting = WORKOUT_SETTING_SERVICE.findByWorkoutTypeAndCustomer(workoutType, customer);
        if (workoutSetting != null) {
            WorkoutSettingResponseDTO dto = WORKOUT_SETTING_MAPPING.mapToResponseDTO(workoutSetting);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Настройка режима '%s' у пользователя с id = '%d' не найдена.",
                            workoutType.getTitle(),
                            customerId));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/add/random_words")
    public ResponseEntity<?> addRandomWords(HttpServletRequest request,
                                            @RequestBody WorkoutSettingRequestDTO dto) {
        ResponseEntity<?> response = validateRandomWords(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Устанавливает тип тренировки "Случайные слова"
        dto.setWorkoutTypeCode(WorkoutTypes.RANDOM_WORDS.CODE);

        // Создаём настройки режима тренировки для пользователя
        WorkoutSetting workoutSetting = WORKOUT_SETTING_MAPPING.mapToWorkoutSetting(dto);
        workoutSetting = WORKOUT_SETTING_SERVICE.save(workoutSetting);
        if (workoutSetting != null) {
            WorkoutSettingResponseDTO responseDTO = WORKOUT_SETTING_MAPPING.mapToResponseDTO(workoutSetting);
            return ResponseEntity.ok(responseDTO);
        } else {
            WorkoutType workoutType = WORKOUT_TYPE_SERVICE.findByCode(dto.getWorkoutTypeCode());
            CustomResponseMessage message = new CustomResponseMessage(2,
                    String.format("Произошла ошибка при сохранении настроек режима тренировки '%s'.",
                            workoutType.getTitle()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/edit/random_words")
    public ResponseEntity<?> editRandomWords(HttpServletRequest request,
                                             @RequestBody WorkoutSettingRequestDTO dto) {
        ResponseEntity<?> response = validateRandomWords(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutSetting workoutSetting = WORKOUT_SETTING_SERVICE.findById(dto.getId());
        workoutSetting = WORKOUT_SETTING_MAPPING.mapToWorkoutSetting(workoutSetting, dto);
        workoutSetting = WORKOUT_SETTING_SERVICE.save(workoutSetting);
        if (workoutSetting != null) {
            WorkoutSettingResponseDTO responseDTO = WORKOUT_SETTING_MAPPING.mapToResponseDTO(workoutSetting);
            return ResponseEntity.ok(responseDTO);
        } else {
            WorkoutType workoutType = WORKOUT_TYPE_SERVICE.findByCode(dto.getWorkoutTypeCode());
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Произошла ошибка при изменении настроек режима тренировки '%s'.",
                            workoutType.getTitle()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/validate/before_crud")
    public ResponseEntity<?> validateBeforeCrud(HttpServletRequest request,
                                                @RequestBody WorkoutSettingRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем язык, на который будет переводить пользователь
        response = LANGS_REST_CONTROLLER.findByCode(dto.getLangOutCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем соответствие авторизированного пользователя с владельцем настроек
        if (dto.getId() != 0) {
            response = findById(dto.getId());
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }

            WorkoutSetting workoutSetting = WORKOUT_SETTING_SERVICE.findById(dto.getId());
            Customer authCustomer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
            if (!authCustomer.equals(workoutSetting.getCustomer())) {
                CustomResponseMessage message = new CustomResponseMessage(1,
                        "Настройки режима тренировки не принадлежат пользователю.");
                return ResponseEntity.badRequest().body(message);
            }
        }

        CustomResponseMessage message = new CustomResponseMessage(1, "Данные для настроек корректны.");
        return ResponseEntity.ok(message);
    }

    @PostMapping("/validate/randomWords")
    public ResponseEntity<?> validateRandomWords(HttpServletRequest request,
                                                 @RequestBody WorkoutSettingRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeCrud(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем язык, с которого будет переводить пользователь
        response = LANGS_REST_CONTROLLER.findByCode(dto.getLangInCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Проверяем количество слов (в промежутке мин./макс.)
        if (dto.getNumberOfWords() < MIN_NUMBER_OF_WORDS ||
                dto.getNumberOfWords() > MAX_NUMBER_OF_WORDS) {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Количество слов должно быть от %d до %d.",
                            MIN_NUMBER_OF_WORDS, MAX_NUMBER_OF_WORDS));
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем, не одинаковые ли языки
        if (dto.getLangInCode().equals(dto.getLangOutCode())) {
            CustomResponseMessage message = new CustomResponseMessage(2, "Языки не могут быть одинаковыми.");
            return ResponseEntity.badRequest().body(message);
        }


        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.findById(WorkoutTypes.RANDOM_WORDS);
        CustomResponseMessage message = new CustomResponseMessage(1,
                String.format("Данные для режима тренировки '%s' корректны.", workoutType.getTitle()));
        return ResponseEntity.ok(message);
    }
}
