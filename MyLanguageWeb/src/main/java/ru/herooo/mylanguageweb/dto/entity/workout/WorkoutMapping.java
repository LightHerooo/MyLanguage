package ru.herooo.mylanguageweb.dto.entity.workout;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.*;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.workout.Workout;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.LangCrudRepository;
import ru.herooo.mylanguagedb.repositories.WordInCollectionCrudRepository;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypeCrudRepository;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypes;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.customer.response.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.response.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.request.add.types.WorkoutAddCollectionWorkoutRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.request.add.types.WorkoutAddRandomWordsRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.response.WorkoutResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeMapping;
import ru.herooo.mylanguageweb.dto.entity.workouttype.response.WorkoutTypeResponseDTO;

@Service
public class WorkoutMapping {
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final WorkoutTypeCrudRepository WORKOUT_TYPE_CRUD_REPOSITORY;
    private final LangCrudRepository LANG_CRUD_REPOSITORY;
    private final CustomerCollectionCrudRepository CUSTOMER_COLLECTION_CRUD_REPOSITORY;
    private final WordInCollectionCrudRepository WORD_IN_COLLECTION_CRUD_REPOSITORY;

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
                          WordInCollectionCrudRepository wordInCollectionCrudRepository,

                          CustomerMapping customerMapping,
                          WorkoutTypeMapping workoutTypeMapping,
                          LangMapping langMapping,
                          CustomerCollectionMapping customerCollectionMapping,
                          StringUtils stringUtils) {
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.WORKOUT_TYPE_CRUD_REPOSITORY = workoutTypeCrudRepository;
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
        this.CUSTOMER_COLLECTION_CRUD_REPOSITORY = customerCollectionCrudRepository;
        this.WORD_IN_COLLECTION_CRUD_REPOSITORY = wordInCollectionCrudRepository;

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

    public Workout mapToWorkout(WorkoutAddRandomWordsRequestDTO dto) {
        Workout workout = new Workout();

        String authKey = dto.getAuthKey();
        if (!STRING_UTILS.isStringVoid(authKey)) {
            Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthKey(authKey).orElse(null);
            workout.setCustomer(customer);
        }

        String langInCode = dto.getLangInCode();
        if (!STRING_UTILS.isStringVoid(langInCode)) {
            Lang langIn = LANG_CRUD_REPOSITORY.findByCode(langInCode).orElse(null);
            workout.setLangIn(langIn);
        }

        String langOutCode = dto.getLangOutCode();
        if (!STRING_UTILS.isStringVoid(langOutCode)) {
            Lang langOut = LANG_CRUD_REPOSITORY.findByCode(langOutCode).orElse(null);
            workout.setLangOut(langOut);
        }

        long numberOfWords = dto.getNumberOfWords();
        if (numberOfWords > 0) {
            workout.setNumberOfWords(numberOfWords);
        }

        WorkoutType workoutType = WORKOUT_TYPE_CRUD_REPOSITORY
                .findByCode(WorkoutTypes.RANDOM_WORDS.CODE).orElse(null);
        workout.setWorkoutType(workoutType);

        return workout;
    }

    public Workout mapToWorkout(WorkoutAddCollectionWorkoutRequestDTO dto) {
        Workout workout = new Workout();

        String authKey = dto.getAuthKey();
        if (!STRING_UTILS.isStringVoid(authKey)) {
            Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthKey(authKey).orElse(null);
            workout.setCustomer(customer);
        }

        String langOutCode = dto.getLangOutCode();
        if (!STRING_UTILS.isStringVoid(langOutCode)) {
            Lang langOut = LANG_CRUD_REPOSITORY.findByCode(langOutCode).orElse(null);
            workout.setLangOut(langOut);
        }

        WorkoutType workoutType = WORKOUT_TYPE_CRUD_REPOSITORY
                .findByCode(WorkoutTypes.COLLECTION_WORKOUT.CODE).orElse(null);
        workout.setWorkoutType(workoutType);

        long customerCollectionId = dto.getCustomerCollectionId();
        CustomerCollection customerCollection = CUSTOMER_COLLECTION_CRUD_REPOSITORY.findById(
                customerCollectionId).orElse(null);
        if (customerCollection != null) {
            String langInCode = customerCollection.getLang().getCode();
            if (!STRING_UTILS.isStringVoid(langInCode)) {
                Lang langIn = LANG_CRUD_REPOSITORY.findByCode(langInCode).orElse(null);
                workout.setLangIn(langIn);
            }

            long numberOfWords = WORD_IN_COLLECTION_CRUD_REPOSITORY.count(customerCollectionId).orElse(0L);
            if (numberOfWords > 0) {
                workout.setNumberOfWords(numberOfWords);
            }

            workout.setCustomerCollection(customerCollection);
        }

        return workout;
    }
}
