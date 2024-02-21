package ru.herooo.mylanguageweb.dto.entity.workout;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.*;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.lang.LangCrudRepository;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypeCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeMapping;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeResponseDTO;

@Service
public class WorkoutMapping {
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final WorkoutTypeCrudRepository WORKOUT_TYPE_CRUD_REPOSITORY;
    private final LangCrudRepository LANG_CRUD_REPOSITORY;
    private final CustomerCollectionCrudRepository CUSTOMER_COLLECTION_CRUD_REPOSITORY;

    private final CustomerMapping CUSTOMER_MAPPING;
    private final WorkoutTypeMapping WORKOUT_TYPE_MAPPING;
    private final LangMapping LANG_MAPPING;
    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public WorkoutMapping(CustomerCrudRepository customerCrudRepository,
                          WorkoutTypeCrudRepository workoutTypeCrudRepository,
                          LangCrudRepository langCrudRepository,
                          CustomerCollectionCrudRepository customerCollectionCrudRepository,

                          CustomerMapping customerMapping,
                          WorkoutTypeMapping workoutTypeMapping,
                          LangMapping langMapping,
                          CustomerCollectionMapping customerCollectionMapping,
                          StringUtils stringUtils) {
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.WORKOUT_TYPE_CRUD_REPOSITORY = workoutTypeCrudRepository;
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
        this.CUSTOMER_COLLECTION_CRUD_REPOSITORY = customerCollectionCrudRepository;

        this.CUSTOMER_MAPPING = customerMapping;
        this.WORKOUT_TYPE_MAPPING = workoutTypeMapping;
        this.LANG_MAPPING = langMapping;
        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;

        this.STRING_UTILS = stringUtils;
    }

    public WorkoutResponseDTO mapToResponseDTO(Workout workout) {
        WorkoutResponseDTO dto = new WorkoutResponseDTO();
        dto.setId(workout.getId());
        dto.setNumberOfWords(workout.getNumberOfWords());
        dto.setDateOfStart(workout.getDateOfStart());
        dto.setDateOfEnd(workout.getDateOfEnd());
        dto.setIsActive(workout.isActive());
        dto.setCurrentMilliseconds(workout.getCurrentMilliseconds());

        if (workout.getCustomer() != null) {
            CustomerResponseDTO customer = CUSTOMER_MAPPING.mapToResponseDTO(workout.getCustomer());
            dto.setCustomer(customer);
        }

        if (workout.getWorkoutType() != null) {
            WorkoutTypeResponseDTO workoutType = WORKOUT_TYPE_MAPPING.mapToResponseDTO(workout.getWorkoutType());
            dto.setWorkoutType(workoutType);
        }

        if (workout.getLangIn() != null) {
            LangResponseDTO langIn = LANG_MAPPING.mapToResponseDTO(workout.getLangIn());
            dto.setLangIn(langIn);
        }

        if (workout.getLangOut() != null) {
            LangResponseDTO langOut = LANG_MAPPING.mapToResponseDTO(workout.getLangOut());
            dto.setLangOut(langOut);
        }

        if (workout.getCustomerCollection() != null) {
            CustomerCollectionResponseDTO customerCollection =
                    CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(workout.getCustomerCollection());
            dto.setCustomerCollection(customerCollection);
        }

        return dto;
    }

    public Workout mapToWorkout(WorkoutRequestDTO dto) {
        Workout workout = new Workout();

        String workoutTypeCode = dto.getWorkoutTypeCode();
        if (STRING_UTILS.isNotStringVoid(workoutTypeCode)) {
            WorkoutType workoutType = WORKOUT_TYPE_CRUD_REPOSITORY.findByCode(workoutTypeCode);
            workout.setWorkoutType(workoutType);
        }

        String authCode = dto.getAuthCode();
        if (STRING_UTILS.isNotStringVoid(authCode)) {
            Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthCode(authCode);
            workout.setCustomer(customer);
        }

        String langInCode = dto.getLangInCode();
        if (STRING_UTILS.isNotStringVoid(langInCode)) {
            Lang langIn = LANG_CRUD_REPOSITORY.findByCode(langInCode);
            workout.setLangIn(langIn);
        }

        String langOutCode = dto.getLangOutCode();
        if (STRING_UTILS.isNotStringVoid(langOutCode)) {
            Lang langOut = LANG_CRUD_REPOSITORY.findByCode(langOutCode);
            workout.setLangOut(langOut);
        }

        long numberOfWords = dto.getNumberOfWords();
        if (numberOfWords > 0) {
            workout.setNumberOfWords(numberOfWords);
        }

        // Не проводим дополнительных проверок, т.к. поле может быть NULL
        CustomerCollection collection = CUSTOMER_COLLECTION_CRUD_REPOSITORY.findByKey(dto.getCollectionKey());
        workout.setCustomerCollection(collection);

        return workout;
    }
}
