package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguageweb.dto.other.request.entity.edit.b.EntityEditBooleanByCodeRequestDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.value.EntityBooleanRequestDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeMapping;
import ru.herooo.mylanguageweb.dto.entity.workouttype.response.WorkoutTypeResponseDTO;
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

    @GetMapping("/get")
    public ResponseEntity<?> getAll(@RequestParam(value = "title", required = false) String title,
                                    @RequestParam(value = "is_prepared", required = false) Boolean isPrepared,
                                    @RequestParam(value = "is_active", required = false) Boolean isActive,
                                    @RequestParam(value = "number_of_items", required = false, defaultValue = "0")
                                        Long numberOfItems,
                                    @RequestParam(value = "last_workout_type_id_on_previous_page", required = false, defaultValue = "0")
                                        Long lastWorkoutTypeIdOnPreviousPage) {
        if (numberOfItems == null || numberOfItems < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(1, "Количество записей не должно быть отрицательным");
            return ResponseEntity.badRequest().body(message);
        }


        if (lastWorkoutTypeIdOnPreviousPage == null || lastWorkoutTypeIdOnPreviousPage < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(2,
                            "ID последнего режима тренировки на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0");
            return ResponseEntity.badRequest().body(message);
        }

        List<WorkoutType> workoutTypes = WORKOUT_TYPE_SERVICE.findAll(title, isPrepared, isActive, numberOfItems,
                lastWorkoutTypeIdOnPreviousPage);
        if (workoutTypes != null && workoutTypes.size() > 0) {
            List<WorkoutTypeResponseDTO> workoutTypeDTOs = workoutTypes
                    .stream()
                    .map(WORKOUT_TYPE_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(workoutTypeDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Режимы тренировок по указанным фильтрам не найдены");
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
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Режим тренировки с кодом '%s' не найден", code));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/validate/is_prepared")
    public ResponseEntity<?> validateIsPrepared(@RequestParam("code") String code) {
        ResponseEntity<?> response = find(code);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(code);
        if (workoutType.getPrepared()) {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    String.format("Режим тренировки '%s' подготовлен для тренировок", workoutType.getTitle()));
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    String.format("Режим тренировки '%s' не подготовлен для тренировок", workoutType.getTitle()));
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }

    @GetMapping("/validate/is_active")
    public ResponseEntity<?> validateIsActive(@RequestParam("code") String code) {
        ResponseEntity<?> response = find(code);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(code);
        if (workoutType.getActive()) {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    String.format("Режим тренировки '%s' активен для тренировок", workoutType.getTitle()));
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO responseDTO = new ResponseMessageResponseDTO(1,
                    String.format("Режим тренировки '%s' неактивен для тренировок", workoutType.getTitle()));
            return ResponseEntity.badRequest().body(responseDTO);
        }
    }



    @PatchMapping("/edit/is_active")
    public ResponseEntity<?> editIsActive(HttpServletRequest request,
                                          @RequestBody EntityEditBooleanByCodeRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Менять статус режимов тренировок могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав");
            return ResponseEntity.badRequest().body(message);
        }

        String workoutTypeCode = dto.getCode();
        response = find(workoutTypeCode);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.find(workoutTypeCode);
        workoutType = WORKOUT_TYPE_SERVICE.editIsActive(workoutType, dto.getValue());
        if (workoutType != null) {
            WorkoutTypeResponseDTO responseDTO = WORKOUT_TYPE_MAPPING.mapToResponseDTO(workoutType);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Произошла ошибка при изменении статуса активности режима тренировки");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/switch/all")
    public ResponseEntity<?> switchAll(HttpServletRequest request,
                                       @RequestBody EntityBooleanRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        ResponseEntity<?> response = CUSTOMERS_REST_CONTROLLER.isExistsByAuthKey(validateAuthKey);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Переключать режимамы тренировок могут только суперпользователи
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(validateAuthKey);
        if (!CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав");
            return ResponseEntity.badRequest().body(message);
        }

        boolean isActive = dto.getValue();
        WORKOUT_TYPE_SERVICE.switchWorkoutTypes(isActive);

        String messageStr = isActive
                ? "Все режимы тренировок успешно включены"
                : "Все режимы тренировок успешно отключены";

        ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, messageStr);
        return ResponseEntity.ok(message);
    }
}
