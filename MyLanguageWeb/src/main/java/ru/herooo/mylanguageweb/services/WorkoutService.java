package ru.herooo.mylanguageweb.services;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.workout.Workout;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteCustomerCollection;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteLang;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteWorkoutType;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutsCustomerStatistic;
import ru.herooo.mylanguagedb.repositories.WorkoutCrudRepository;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutRoundStatistic;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutStatistic;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.workout.WorkoutMapping;
import ru.herooo.mylanguageweb.dto.entity.workout.request.add.types.WorkoutAddCollectionWorkoutRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.request.add.types.WorkoutAddRandomWordsRequestDTO;
import ru.herooo.mylanguageweb.projectcookie.ProjectCookies;
import ru.herooo.mylanguageweb.projectcookie.ProjectCookiesUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class WorkoutService {
    private final WorkoutCrudRepository WORKOUT_CRUD_REPOSITORY;

    private final WorkoutMapping WORKOUT_MAPPING;

    private final StringUtils STRING_UTILS;
    private final ProjectCookiesUtils PROJECT_COOKIES_UTILS;

    @Autowired
    public WorkoutService(WorkoutCrudRepository workoutCrudRepository,

                          WorkoutMapping workoutMapping,

                          StringUtils stringUtils,
                          ProjectCookiesUtils projectCookiesUtils) {
        this.WORKOUT_CRUD_REPOSITORY = workoutCrudRepository;

        this.WORKOUT_MAPPING = workoutMapping;

        this.STRING_UTILS = stringUtils;
        this.PROJECT_COOKIES_UTILS = projectCookiesUtils;
    }
    public List<Workout> findAllOver(String workoutTypeCode, Long customerId, LocalDate dateOfEnd) {
        return WORKOUT_CRUD_REPOSITORY.findAllOver(workoutTypeCode, customerId, dateOfEnd);
    }

    public List<Workout> findAllNotOver(String workoutTypeCode, Long customerId) {
        return WORKOUT_CRUD_REPOSITORY.findAllNotOver(workoutTypeCode, customerId);
    }



    public Workout add(Workout workout) {
        workout.setDateOfStart(LocalDateTime.now());
        workout.setCurrentMilliseconds(0);
        workout.setAuthKey(STRING_UTILS.createRandomStrEn(50));

        return WORKOUT_CRUD_REPOSITORY.save(workout);
    }

    public Workout add(WorkoutAddRandomWordsRequestDTO dto) {
        Workout workout = WORKOUT_MAPPING.mapToWorkout(dto);
        return add(workout);
    }

    public Workout add(WorkoutAddCollectionWorkoutRequestDTO dto) {
        Workout workout = WORKOUT_MAPPING.mapToWorkout(dto);
        return add(workout);
    }

    public Workout editCurrentMilliseconds(Workout workout, long currentMilliseconds) {
        Workout result = null;
        if (workout != null) {
            workout.setCurrentMilliseconds(currentMilliseconds);
            result = edit(workout);
        }

        return result;
    }

    public Workout close(Workout workout) {
        Workout result = null;
        if (workout != null) {
            workout.setDateOfEnd(LocalDateTime.now());
            result = edit(workout);
        }

        return result;
    }

    public Workout edit(Workout workout) {
        return WORKOUT_CRUD_REPOSITORY.save(workout);
    }

    public Workout find(Long id) {
        return WORKOUT_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public Workout findByAuthKey(String authKey) {
        return WORKOUT_CRUD_REPOSITORY.findByAuthKey(authKey).orElse(null);
    }

    public Workout findLast(Long customerId, String workoutTypeCode) {
        return WORKOUT_CRUD_REPOSITORY.findLast(
                workoutTypeCode, customerId).orElse(null);
    }



    public WorkoutStatistic findStatistic(Long id) {
        return WORKOUT_CRUD_REPOSITORY.findStatistic(null, 0, id).orElse(null);
    }

    public WorkoutsCustomerStatistic findCustomerStatistic(String workoutTypeCode, Integer days, Long customerId) {
        return WORKOUT_CRUD_REPOSITORY.findCustomerStatistic(workoutTypeCode, days, customerId).orElse(null);
    }

    public WorkoutRoundStatistic findRoundStatistic(Long id, Integer roundNumber) {
        return WORKOUT_CRUD_REPOSITORY.findRoundStatistic(id, roundNumber).orElse(null);
    }

    public FavouriteLang findFavouriteLangIn(String workoutTypeCode, Long customerId, Integer days) {
        return WORKOUT_CRUD_REPOSITORY.findFavouriteLangIn(workoutTypeCode, customerId, days).orElse(null);
    }

    public FavouriteLang findFavouriteLangOut(String workoutTypeCode, Long customerId, Integer days) {
        return WORKOUT_CRUD_REPOSITORY.findFavouriteLangOut(workoutTypeCode, customerId, days).orElse(null);
    }

    public FavouriteWorkoutType findFavouriteWorkoutType(Long customerId, Integer days) {
        return WORKOUT_CRUD_REPOSITORY.findFavouriteWorkoutType(customerId, days).orElse(null);
    }

    public FavouriteCustomerCollection findFavouriteCustomerCollection(String workoutTypeCode, Long customerId, Integer days) {
        return WORKOUT_CRUD_REPOSITORY.findFavouriteCustomerCollection(workoutTypeCode, customerId, days).orElse(null);
    }



    public LocalDate findMaxDateOfEnd(String workoutTypeCode, Long customerId) {
        return WORKOUT_CRUD_REPOSITORY.findMaxDateOfEnd(workoutTypeCode, customerId).orElse(null);
    }

    public LocalDate findNextDateOfEnd(LocalDate previousDateOfEnd, String workoutTypeCode, Long customerId) {
        return WORKOUT_CRUD_REPOSITORY.findNextDateOfEnd(previousDateOfEnd, workoutTypeCode, customerId).orElse(null);
    }

    public String validateAuthKey(HttpServletRequest request, String authKey) {
        String validAuthKey;

        try {
            if (STRING_UTILS.isStringVoid(authKey)) {
                Cookie workoutAuthKey = PROJECT_COOKIES_UTILS.get(request, ProjectCookies.WORKOUT_AUTH_KEY);
                validAuthKey = workoutAuthKey != null
                        ? workoutAuthKey.getValue()
                        : authKey;
            } else {
                validAuthKey = authKey;
            }
        } catch (Throwable e) {
            validAuthKey = authKey;
        }

        return validAuthKey;
    }


    public Long countNotOver(String workoutTypeCode, Long customerId) {
        return WORKOUT_CRUD_REPOSITORY.countNotOver(workoutTypeCode, customerId).orElse(0L);
    }

    public Integer findCurrentRoundNumber(Long id) {
        return WORKOUT_CRUD_REPOSITORY.findCurrentRoundNumber(id).orElse(0);
    }

    public Integer findMaxRoundNumber(Long id) {
        return WORKOUT_CRUD_REPOSITORY.findMaxRoundNumber(id).orElse(0);
    }



    public void delete(Workout workout) {
        WORKOUT_CRUD_REPOSITORY.delete(workout);
    }
}
