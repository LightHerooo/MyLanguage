package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguagedb.types.CustomerCollectionsStatistic;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionRequestDTO;

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

    public List<CustomerCollection> findAllForAuthor(String title,
                                                     String langCode,
                                                     Long customerId,
                                                     Boolean isActiveForAuthor) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findAllForAuthor(title, langCode, customerId, isActiveForAuthor);
    }

    public long count(Long customerId,
                      Boolean isActiveForAuthor) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.count(customerId, isActiveForAuthor).orElse(0L);
    }

    public List<CustomerCollection> findAllForAuthor(String title,
                                                     String langCode,
                                                     Long customerId,
                                                     Boolean isActiveForAuthor,
                                                     Long numberOfItems,
                                                     Long lastCollectionIdOnPreviousPage) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findAllForAuthor(title, langCode, customerId, isActiveForAuthor, numberOfItems, lastCollectionIdOnPreviousPage);
    }

    public List<CustomerCollectionsStatistic> findStatistics(Long customerId) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findStatistics(customerId);
    }

    public CustomerCollection find(long id) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findById(id).orElse(null);
    }

    public CustomerCollection findByCustomerAndTitle(Customer customer, String title) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findByCustomerAndTitleIgnoreCase(customer, title).orElse(null);
    }

    public CustomerCollection add(CustomerCollectionRequestDTO dto) {
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

    public CustomerCollection changeActivityForAuthor(CustomerCollection collection, boolean isActiveForAuthor) {
        collection.setActiveForAuthor(isActiveForAuthor);
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.save(collection);
    }

    public void delete(CustomerCollection collection) {
        CUSTOMER_COLLECTION_CRUD_REPOSITORY.delete(collection);
    }
}
