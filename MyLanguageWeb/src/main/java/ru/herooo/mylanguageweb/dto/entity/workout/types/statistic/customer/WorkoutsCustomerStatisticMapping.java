package ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.workout.types.statistic.WorkoutsCustomerStatistic;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.customer.response.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.workout.types.statistic.WorkoutAnswersStatisticResponseDTO;

@Service
public class WorkoutsCustomerStatisticMapping {
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final CustomerMapping CUSTOMER_MAPPING;

    @Autowired
    public WorkoutsCustomerStatisticMapping(CustomerCrudRepository customerCrudRepository,

                                            CustomerMapping customerMapping) {
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;

        this.CUSTOMER_MAPPING = customerMapping;
    }

    public WorkoutsCustomerStatisticResponseDTO mapToResponse(WorkoutsCustomerStatistic workoutsCustomerStatistic) {
        WorkoutsCustomerStatisticResponseDTO dto = new WorkoutsCustomerStatisticResponseDTO();

        long customerId = workoutsCustomerStatistic.getCustomerId().orElse(0L);
        if (customerId != 0) {
            Customer customer = CUSTOMER_CRUD_REPOSITORY.findById(customerId).orElse(null);
            if (customer != null) {
                CustomerResponseDTO customerResponseDTO = CUSTOMER_MAPPING.mapToResponseDTO(customer);
                dto.setCustomer(customerResponseDTO);
            }
        }

        dto.setNumberOfMilliseconds(workoutsCustomerStatistic.getNumberOfMilliseconds().orElse(0L));
        dto.setNumberOfWorkouts(workoutsCustomerStatistic.getNumberOfWorkouts().orElse(0L));
        dto.setNumberOfRounds(workoutsCustomerStatistic.getNumberOfRounds().orElse(0L));

        // Заносим статистику по ответам в отдельный класс
        WorkoutAnswersStatisticResponseDTO workoutAnswersStatisticResponseDTO = new WorkoutAnswersStatisticResponseDTO();
        workoutAnswersStatisticResponseDTO.setNumberOfAnswers(workoutsCustomerStatistic.getNumberOfAnswers().orElse(0L));
        workoutAnswersStatisticResponseDTO.setNumberOfTrueAnswers(workoutsCustomerStatistic.getNumberOfTrueAnswers().orElse(0L));
        workoutAnswersStatisticResponseDTO.setNumberOfFalseAnswers(workoutsCustomerStatistic.getNumberOfFalseAnswers().orElse(0L));
        workoutAnswersStatisticResponseDTO.setSuccessRate(workoutsCustomerStatistic.getSuccessRate().orElse(0.0));

        dto.setWorkoutAnswersStatistic(workoutAnswersStatisticResponseDTO);

        return dto;
    }
}
