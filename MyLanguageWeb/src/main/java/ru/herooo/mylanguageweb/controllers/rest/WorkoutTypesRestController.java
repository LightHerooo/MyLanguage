package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeRequestDTO;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeMapping;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.WorkoutTypeService;

import java.util.List;

@RestController
@RequestMapping("/api/workout_types")
public class WorkoutTypesRestController {

    private final CustomersRestController CUSTOMERS_REST_CONTROLLER;

    private final WorkoutTypeService WORKOUT_TYPE_SERVICE;
    private final CustomerService CUSTOMER_SERVICE;

    private final WorkoutTypeMapping WORKOUT_TYPE_MAPPING;

    @Autowired
    public WorkoutTypesRestController(CustomersRestController customersRestController,

                                      WorkoutTypeService workoutTypeService,
                                      CustomerService customerService,

                                      WorkoutTypeMapping workoutTypeMapping) {
        this.CUSTOMERS_REST_CONTROLLER = customersRestController;

        this.WORKOUT_TYPE_SERVICE = workoutTypeService;
        this.CUSTOMER_SERVICE = customerService;

        this.WORKOUT_TYPE_MAPPING = workoutTypeMapping;
    }

    @GetMapping("/filtered")
    public ResponseEntity<?> getAll(@RequestParam(value = "title", required = false) String title) {
        List<WorkoutType> workoutTypes = WORKOUT_TYPE_SERVICE.findAll(title);
        if (workoutTypes != null && workoutTypes.size() > 0) {
            List<WorkoutTypeResponseDTO> workoutTypeDTOs = workoutTypes
                    .stream()
                    .map(WORKOUT_TYPE_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(workoutTypeDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Типы тренировок по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> find(@RequestParam("code") String code) {
        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(code);
        if (workoutType != null) {
            WorkoutTypeResponseDTO dto = WORKOUT_TYPE_MAPPING.mapToResponseDTO(workoutType);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Режим тренировки с кодом '%s' не найден.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/change_active_status")
    public ResponseEntity<?> changeActiveStatus(HttpServletRequest request,
                                                @RequestBody WorkoutTypeRequestDTO dto) {
        ResponseEntity<?> response = validateBeforeUpdate(request, dto);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(dto.getCode());
        workoutType = WORKOUT_TYPE_SERVICE.changeActiveStatus(workoutType, dto.getIsActive());
        if (workoutType != null) {
            WorkoutTypeResponseDTO responseDTO = WORKOUT_TYPE_MAPPING.mapToResponseDTO(workoutType);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Не удалось изменить статус активности режиму тренировки с кодом '%s'",
                            dto.getCode()));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/validate/before_update")
    public ResponseEntity<?> validateBeforeUpdate(HttpServletRequest request,
                                                  @RequestBody WorkoutTypeRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        // Проверяем пользователя
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Работать с режимами тренировок могут только суперюзеры
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        response = find(dto.getCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomResponseMessage message = new CustomResponseMessage(1,
                "Данные для изменения режима тренировки корректны.");
        return ResponseEntity.ok(message);
    }
}
