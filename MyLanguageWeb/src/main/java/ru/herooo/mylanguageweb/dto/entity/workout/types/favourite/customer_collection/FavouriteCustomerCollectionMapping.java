package ru.herooo.mylanguageweb.dto.entity.workout.types.favourite.customer_collection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.workout.types.favourite.FavouriteCustomerCollection;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.response.CustomerCollectionResponseDTO;

@Service
public class FavouriteCustomerCollectionMapping {
    private final CustomerCollectionCrudRepository CUSTOMER_COLLECTION_CRUD_REPOSITORY;

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;

    @Autowired
    public FavouriteCustomerCollectionMapping(CustomerCollectionCrudRepository customerCollectionCrudRepository,

                                              CustomerCollectionMapping customerCollectionMapping) {
        this.CUSTOMER_COLLECTION_CRUD_REPOSITORY = customerCollectionCrudRepository;

        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
    }

    public FavouriteCustomerCollectionResponseDTO mapToResponse(FavouriteCustomerCollection favouriteCustomerCollection) {
        FavouriteCustomerCollectionResponseDTO dto = new FavouriteCustomerCollectionResponseDTO();

        long customerCollectionId = favouriteCustomerCollection.getCustomerCollectionId().orElse(0L);
        if (customerCollectionId > 0) {
            CustomerCollection customerCollection = CUSTOMER_COLLECTION_CRUD_REPOSITORY
                    .findById(customerCollectionId).orElse(null);
            if (customerCollection != null) {
                CustomerCollectionResponseDTO customerCollectionResponseDTO = CUSTOMER_COLLECTION_MAPPING
                        .mapToResponseDTO(customerCollection);
                dto.setCustomerCollection(customerCollectionResponseDTO);
            }
        }

        dto.setNumberOfWorkouts(favouriteCustomerCollection.getNumberOfWorkouts().orElse(0L));

        return dto;
    }
}
