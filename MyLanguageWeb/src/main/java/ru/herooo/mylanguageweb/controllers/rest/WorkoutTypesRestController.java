package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.workouttype.WorkoutTypeMapping;
import ru.herooo.mylanguageweb.dto.workouttype.WorkoutTypeResponseDTO;
import ru.herooo.mylanguageweb.services.WorkoutTypeService;

import java.util.List;

@RestController
@RequestMapping("/api/workout_types")
public class WorkoutTypesRestController {

    private final WorkoutTypeService WORKOUT_TYPE_SERVICE;

    private final WorkoutTypeMapping WORKOUT_TYPE_MAPPING;

    @Autowired
    public WorkoutTypesRestController(WorkoutTypeService workoutTypeService,
                                      WorkoutTypeMapping workoutTypeMapping) {
        this.WORKOUT_TYPE_SERVICE = workoutTypeService;

        this.WORKOUT_TYPE_MAPPING = workoutTypeMapping;
    }

    @GetMapping
    public ResponseEntity<?> getAll() {
        List<WorkoutType> workoutTypes = WORKOUT_TYPE_SERVICE.findAll();
        if (workoutTypes != null && workoutTypes.size() > 0) {
            List<WorkoutTypeResponseDTO> workoutTypeDTOs = workoutTypes
                    .stream()
                    .map(WORKOUT_TYPE_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(workoutTypeDTOs);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1, "Типы тренировок не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> findByCode(@RequestParam("code") String code) {
        WorkoutType workoutType = WORKOUT_TYPE_SERVICE.findByCode(code);
        if (workoutType != null) {
            WorkoutTypeResponseDTO dto = WORKOUT_TYPE_MAPPING.mapToResponseDTO(workoutType);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Режим тренировки с кодом '%s' не найден.", code));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
