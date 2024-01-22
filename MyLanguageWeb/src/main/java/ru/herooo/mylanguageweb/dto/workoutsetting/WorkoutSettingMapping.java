package ru.herooo.mylanguageweb.dto.workoutsetting;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.WorkoutSetting;
import ru.herooo.mylanguagedb.entities.WorkoutType;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.lang.LangCrudRepository;
import ru.herooo.mylanguagedb.repositories.workouttype.WorkoutTypeCrudRepository;
import ru.herooo.mylanguageweb.dto.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.lang.LangResponseDTO;
import ru.herooo.mylanguageweb.dto.workouttype.WorkoutTypeMapping;
import ru.herooo.mylanguageweb.dto.workouttype.WorkoutTypeResponseDTO;

@Service
public class WorkoutSettingMapping {

    private final WorkoutTypeCrudRepository WORKOUT_TYPE_CRUD_REPOSITORY;
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final LangCrudRepository LANG_CRUD_REPOSITORY;

    private final WorkoutTypeMapping WORKOUT_TYPE_MAPPING;
    private final CustomerMapping CUSTOMER_MAPPING;
    private final LangMapping LANG_MAPPING;
    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;

    @Autowired
    public WorkoutSettingMapping(WorkoutTypeCrudRepository workoutTypeCrudRepository,
                                 CustomerCrudRepository customerCrudRepository,
                                 LangCrudRepository langCrudRepository,

                                 WorkoutTypeMapping workoutTypeMapping,
                                 CustomerMapping customerMapping,
                                 LangMapping langMapping,
                                 CustomerCollectionMapping customerCollectionMapping) {
        this.WORKOUT_TYPE_CRUD_REPOSITORY = workoutTypeCrudRepository;
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.LANG_CRUD_REPOSITORY = langCrudRepository;

        this.WORKOUT_TYPE_MAPPING = workoutTypeMapping;
        this.CUSTOMER_MAPPING = customerMapping;
        this.LANG_MAPPING = langMapping;
        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
    }

    public WorkoutSettingResponseDTO mapToResponseDTO(WorkoutSetting workoutSetting) {
        WorkoutSettingResponseDTO dto = new WorkoutSettingResponseDTO();
        dto.setId(workoutSetting.getId());
        dto.setNumberOfWords(workoutSetting.getNumberOfWords());

        if (workoutSetting.getWorkoutType() != null) {
            WorkoutTypeResponseDTO workoutType = WORKOUT_TYPE_MAPPING.mapToResponseDTO(workoutSetting.getWorkoutType());
            dto.setWorkoutType(workoutType);
        }

        if (workoutSetting.getCustomer() != null) {
            CustomerResponseDTO customer = CUSTOMER_MAPPING.mapToResponseDTO(workoutSetting.getCustomer());
            dto.setCustomer(customer);
        }

        if (workoutSetting.getLangOut() != null) {
            LangResponseDTO langOut = LANG_MAPPING.mapToResponseDTO(workoutSetting.getLangOut());
            dto.setLangOut(langOut);
        }

        if (workoutSetting.getLangIn() != null) {
            LangResponseDTO langIn = LANG_MAPPING.mapToResponseDTO(workoutSetting.getLangIn());
            dto.setLangIn(langIn);
        }

        if (workoutSetting.getCustomerCollection() != null) {
            CustomerCollectionResponseDTO customerCollection =
                    CUSTOMER_COLLECTION_MAPPING.mapToResponseDTO(workoutSetting.getCustomerCollection());
            dto.setCustomerCollection(customerCollection);
        }

        return dto;
    }

    public WorkoutSetting mapToWorkoutSetting(WorkoutSetting oldWorkoutSetting, WorkoutSettingRequestDTO dto) {
        Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthCode(dto.getAuthCode());
        oldWorkoutSetting.setCustomer(customer);

        Lang langIn = LANG_CRUD_REPOSITORY.findByCode(dto.getLangInCode());
        oldWorkoutSetting.setLangIn(langIn);

        Lang langOut = LANG_CRUD_REPOSITORY.findByCode(dto.getLangOutCode());
        oldWorkoutSetting.setLangOut(langOut);

        oldWorkoutSetting.setNumberOfWords(dto.getNumberOfWords());

        return oldWorkoutSetting;
    }

    public WorkoutSetting mapToWorkoutSetting(WorkoutSettingRequestDTO dto) {
        WorkoutSetting workoutSetting = new WorkoutSetting();

        WorkoutType workoutType = WORKOUT_TYPE_CRUD_REPOSITORY.findByCode(dto.getWorkoutTypeCode());
        workoutSetting.setWorkoutType(workoutType);

        return mapToWorkoutSetting(workoutSetting, dto);
    }
}
