package ru.herooo.mylanguageweb.dto.types.workout.workouts_customer_extra_statistic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.LangCrudRepository;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypeCrudRepository;
import ru.herooo.mylanguagedb.types.WorkoutsCustomerExtraStatistic;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeMapping;
import ru.herooo.mylanguageweb.dto.entity.workouttype.WorkoutTypeResponseDTO;
import ru.herooo.mylanguageweb.dto.types.workout.WorkoutAnswersStatistic;

@Service
public class WorkoutsCustomerExtraStatisticMapping {

    private final LangCrudRepository LANG_CRUD_REPOSITORY;
    private final WorkoutTypeCrudRepository WORKOUT_TYPE_CRUD_REPOSITORY;
    private final CustomerCollectionCrudRepository CUSTOMER_COLLECTION_CRUD_REPOSITORY;
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;

    private final LangMapping LANG_MAPPING;
    private final WorkoutTypeMapping WORKOUT_TYPE_MAPPING;
    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;
    private final CustomerMapping CUSTOMER_MAPPING;

    @Autowired
    public WorkoutsCustomerExtraStatisticMapping(LangCrudRepository langCrudRepository,
                                                 WorkoutTypeCrudRepository workoutTypeCrudRepository,
                                                 CustomerCollectionCrudRepository customerCollectionCrudRepository,
                                                 CustomerCrudRepository customerCrudRepository,

                                                 LangMapping langMapping,
                                                 WorkoutTypeMapping workoutTypeMapping,
                                                 CustomerCollectionMapping customerCollectionMapping,
                                                 CustomerMapping customerMapping) {
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
        this.WORKOUT_TYPE_CRUD_REPOSITORY = workoutTypeCrudRepository;
        this.CUSTOMER_COLLECTION_CRUD_REPOSITORY = customerCollectionCrudRepository;
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;

        this.LANG_MAPPING = langMapping;
        this.WORKOUT_TYPE_MAPPING = workoutTypeMapping;
        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
        this.CUSTOMER_MAPPING = customerMapping;
    }

    public WorkoutsCustomerExtraStatisticResponseDTO mapToResponse(WorkoutsCustomerExtraStatistic workoutsCustomerExtraStatistic) {
        WorkoutsCustomerExtraStatisticResponseDTO dto = new WorkoutsCustomerExtraStatisticResponseDTO();

        dto.setNumberOfMilliseconds(workoutsCustomerExtraStatistic.getNumberOfMilliseconds().orElse(0L));
        dto.setNumberOfWorkouts(workoutsCustomerExtraStatistic.getNumberOfWorkouts().orElse(0L));
        dto.setNumberOfRounds(workoutsCustomerExtraStatistic.getNumberOfRounds().orElse(0L));

        WorkoutAnswersStatistic workoutAnswersStatistic = new WorkoutAnswersStatistic(workoutsCustomerExtraStatistic);
        dto.setWorkoutAnswersStatistic(workoutAnswersStatistic);

        long customerId = workoutsCustomerExtraStatistic.getCustomerId().orElse(0L);
        if (customerId != 0) {
            Customer customer = CUSTOMER_CRUD_REPOSITORY.findById(customerId).orElse(null);
            if (customer != null) {
                CustomerResponseDTO customerResponse = CUSTOMER_MAPPING.mapToResponseDTO(customer);
                dto.setCustomer(customerResponse);
            }
        }

        String langInCode = workoutsCustomerExtraStatistic.getFavouriteLangInCode().orElse(null);
        if (langInCode != null) {
            Lang langIn = LANG_CRUD_REPOSITORY.findByCode(langInCode).orElse(null);
            if (langIn != null) {
                LangResponseDTO langInResponse = LANG_MAPPING.mapToResponseDTO(langIn);
                dto.setFavouriteLangIn(langInResponse);
            }
        }

        String langOutCode = workoutsCustomerExtraStatistic.getFavouriteLangOutCode().orElse(null);
        if (langOutCode != null) {
            Lang langOut = LANG_CRUD_REPOSITORY.findByCode(langOutCode).orElse(null);
            if (langOut != null) {
                LangResponseDTO langOutResponse = LANG_MAPPING.mapToResponseDTO(langOut);
                dto.setFavouriteLangOut(langOutResponse);
            }
        }

        String workoutTypeCode = workoutsCustomerExtraStatistic.getFavouriteWorkoutTypeCode().orElse(null);
        if (workoutTypeCode != null) {
            WorkoutType workoutType = WORKOUT_TYPE_CRUD_REPOSITORY.findByCode(workoutTypeCode).orElse(null);
            if (workoutType != null) {
                WorkoutTypeResponseDTO workoutTypeResponse = WORKOUT_TYPE_MAPPING.mapToResponseDTO(workoutType);
                dto.setFavouriteWorkoutType(workoutTypeResponse);
            }
        }

        long customerCollectionId = workoutsCustomerExtraStatistic.getFavouriteCustomerCollectionId().orElse(0L);
        if (customerCollectionId != 0) {
            CustomerCollection customerCollection = CUSTOMER_COLLECTION_CRUD_REPOSITORY
                    .findById(customerCollectionId).orElse(null);
            if (customerCollection != null) {
                CustomerCollectionResponseDTO customerCollectionResponse =
                        CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(customerCollection);
                dto.setFavouriteCustomerCollection(customerCollectionResponse);
            }
        }

        return dto;
    }
}
