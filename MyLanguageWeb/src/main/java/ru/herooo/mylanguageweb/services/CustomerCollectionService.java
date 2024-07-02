package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguagedb.entities.customer_collection.types.CustomerCollectionsStatistic;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.request.CustomerCollectionAddRequestDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerCollectionService {
    private final CustomerCollectionCrudRepository CUSTOMER_COLLECTION_CRUD_REPOSITORY;

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;

    @Autowired
    public CustomerCollectionService(CustomerCollectionCrudRepository customerCollectionCrudRepository,
                                     CustomerCollectionMapping customerCollectionMapping) {
        this.CUSTOMER_COLLECTION_CRUD_REPOSITORY = customerCollectionCrudRepository;
        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
    }

    public List<CustomerCollection> findAll(String title,
                                            String langCode,
                                            Boolean isActiveForAuthor,
                                            Long customerId,
                                            Long numberOfItems,
                                            Long lastCustomerCollectionIdOnPreviousPage) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findAll(
                title, langCode, isActiveForAuthor, customerId, numberOfItems, lastCustomerCollectionIdOnPreviousPage);
    }

    public List<CustomerCollection> findAll(String title,
                                            String langCode,
                                            Boolean isActiveForAuthor,
                                            Long customerId) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findAll(
                langCode, title, isActiveForAuthor, customerId, 0L, 0L);
    }

    public List<CustomerCollectionsStatistic> findCustomerStatistic(Long customerId) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findCustomerStatistic(customerId);
    }



    public CustomerCollection find(Long id) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public CustomerCollection findByCustomerAndTitle(Customer customer, String title) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findByCustomerAndTitleIgnoreCase(customer, title).orElse(null);
    }

    public CustomerCollection add(CustomerCollectionAddRequestDTO dto) {
        CustomerCollection collection = CUSTOMER_COLLECTION_MAPPING.mapToCustomerCollection(dto);
        return add(collection);
    }

    public CustomerCollection add(CustomerCollection collection) {
        if (collection.getTitle() != null) {
            collection.setTitle(collection.getTitle().trim());
        }

        collection.setDateOfCreate(LocalDateTime.now());
        collection.setActiveForAuthor(true);

        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.save(collection);
    }

    public CustomerCollection editIsActiveForAuthor(CustomerCollection collection, boolean isActiveForAuthor) {
        collection.setActiveForAuthor(isActiveForAuthor);
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.save(collection);
    }



    public long count(Boolean isActiveForAuthor,
                      Long customerId) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.countForAuthor(isActiveForAuthor, customerId).orElse(0L);
    }



    public void delete(CustomerCollection collection) {
        CUSTOMER_COLLECTION_CRUD_REPOSITORY.delete(collection);
    }
}
