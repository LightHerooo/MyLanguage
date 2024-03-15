package ru.herooo.mylanguageweb.services;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Workout;
import ru.herooo.mylanguagedb.repositories.WorkoutCrudRepository;
import ru.herooo.mylanguagedb.types.WorkoutRoundStatistic;
import ru.herooo.mylanguagedb.types.WorkoutStatistic;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutRequestDTO;
import ru.herooo.mylanguageweb.global.GlobalCookieUtils;
import ru.herooo.mylanguageweb.global.GlobalCookies;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class WorkoutService {
    private final WorkoutCrudRepository WORKOUT_CRUD_REPOSITORY;

    private final WorkoutMapping WORKOUT_MAPPING;

    private final StringUtils STRING_UTILS;
    private final GlobalCookieUtils GLOBAL_COOKIE_UTILS;

    @Autowired
    public WorkoutService(WorkoutCrudRepository workoutCrudRepository,
                          WorkoutMapping workoutMapping,
                          StringUtils stringUtils,
                          GlobalCookieUtils globalCookieUtils) {
        this.WORKOUT_CRUD_REPOSITORY = workoutCrudRepository;

        this.WORKOUT_MAPPING = workoutMapping;

        this.STRING_UTILS = stringUtils;
        this.GLOBAL_COOKIE_UTILS = globalCookieUtils;
    }

    public Workout add(Workout workout) {
        workout.setDateOfStart(LocalDateTime.now());

        workout.setActive(false);
        workout.setDateOfChangeActivity(LocalDateTime.now());
        workout.setCurrentMilliseconds(0);
        workout.setSecurityKey(STRING_UTILS.getRandomStrEn(50));

        return WORKOUT_CRUD_REPOSITORY.save(workout);
    }

    public Workout add(WorkoutRequestDTO dto) {
        Workout workout = WORKOUT_MAPPING.mapToWorkout(dto);
        return add(workout);
    }

    public Workout changeActivity(Workout workout) {
        Workout result = null;
        if (workout != null) {
            workout.setActive(!workout.isActive());
            workout.setDateOfChangeActivity(LocalDateTime.now());
            result = edit(workout);
        }

        return result;
    }

    public Workout close(Workout workout) {
        Workout result = null;
        if (workout != null) {
            workout.setDateOfEnd(LocalDateTime.now());
            workout.setActive(false);
            workout.setDateOfChangeActivity(LocalDateTime.now());
            result = edit(workout);
        }

        return result;
    }

    public Workout edit(Workout workout) {
        return WORKOUT_CRUD_REPOSITORY.save(workout);
    }

    public void delete(Workout workout) {
        WORKOUT_CRUD_REPOSITORY.delete(workout);
    }

    public long findCurrentRoundNumber(Long workoutId) {
        return WORKOUT_CRUD_REPOSITORY.findCurrentRoundNumber(workoutId).orElse(0L);
    }

    public long findMaxRoundNumber(Long workoutId) {
        return WORKOUT_CRUD_REPOSITORY.findMaxRoundNumber(workoutId).orElse(0L);
    }

    public Workout find(long id) {
        return WORKOUT_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public Workout findLast(Long customerId, String workoutTypeCode) {
        return WORKOUT_CRUD_REPOSITORY.findLast(
                customerId, workoutTypeCode).orElse(null);
    }

    public Workout findLastInactive(Long customerId) {
        return WORKOUT_CRUD_REPOSITORY.findLastInactive(customerId).orElse(null);
    }

    public WorkoutStatistic findWorkoutStatistic(Long workoutId) {
        return WORKOUT_CRUD_REPOSITORY.findWorkoutStatistic(workoutId).orElse(null);
    }

    public WorkoutRoundStatistic findRoundStatistic(Long workoutId, Long roundNumber) {
        return WORKOUT_CRUD_REPOSITORY.findRoundStatistic(workoutId, roundNumber).orElse(null);
    }

    public List<Workout> findListNotOver(Long customerId, String workoutTypeCode, Boolean isActive) {
        return WORKOUT_CRUD_REPOSITORY.findListNotOver(customerId, workoutTypeCode, isActive);
    }

    public String validateSecurityKey(HttpServletRequest request, String securityKey) {
        String validSecurityKey = securityKey;

        try {
            if (STRING_UTILS.isStringVoid(validSecurityKey)) {
                // Проверяем авторизацию пользователя через куки
                validSecurityKey = GLOBAL_COOKIE_UTILS.getCookieInHttpRequest(
                        request, GlobalCookies.WORKOUT_SECURITY_KEY).getValue();
            }
        } catch (Throwable e) { }

        return validSecurityKey;
    }

    public void repairNotOver(Long customerId, String workoutTypeCode) {
        WORKOUT_CRUD_REPOSITORY.repairNotOverWorkouts(customerId, workoutTypeCode);
    }

    public long countNotOver(Long customerId, String workoutTypeCode, Boolean isActive) {
        return WORKOUT_CRUD_REPOSITORY.countNotOver(customerId, workoutTypeCode, isActive);
    }
}
