package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.wordincollection.WordInCollectionCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionRequestDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerCollectionService {
    private final CustomerCollectionCrudRepository CUSTOMER_COLLECTION_CRUD_REPOSITORY;
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final WordInCollectionCrudRepository WORD_IN_COLLECTION_CRUD_REPOSITORY;

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public CustomerCollectionService(CustomerCollectionCrudRepository customerCollectionCrudRepository,
                                     CustomerCrudRepository customerCrudRepository,
                                     WordInCollectionCrudRepository wordInCollectionCrudRepository,
                                     CustomerCollectionMapping customerCollectionMapping,
                                     StringUtils stringUtils) {
        this.CUSTOMER_COLLECTION_CRUD_REPOSITORY = customerCollectionCrudRepository;
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.WORD_IN_COLLECTION_CRUD_REPOSITORY = wordInCollectionCrudRepository;
        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
        this.STRING_UTILS = stringUtils;
    }

    public List<CustomerCollection> findAllByCustomerOrderById(Customer customer) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findAllByCustomerOrderById(customer);
    }

    public List<CustomerCollection> findAllByCustomerOrderById(long customerId) {
        Customer customer = CUSTOMER_CRUD_REPOSITORY.findById(customerId);
        return findAllByCustomerOrderById(customer);
    }

    public CustomerCollection findByKey(String key) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findByKey(key);
    }

    public CustomerCollection findByCustomerAndTitleIgnoreCase(Customer customer, String title) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findByCustomerAndTitleIgnoreCase(customer, title);
    }

    public CustomerCollection add(CustomerCollectionRequestDTO dto) {
        CustomerCollection collection = CUSTOMER_COLLECTION_MAPPING.mapToCustomerCollection(dto);
        return add(collection);
    }

    public CustomerCollection add(CustomerCollection collection) {
        if (collection.getTitle() != null) {
            collection.setTitle(collection.getTitle().trim());
        }

        collection.setKey(STRING_UTILS.getRandomStrEnNum(20));
        collection.setDateOfCreate(LocalDateTime.now());

        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.save(collection);
    }

    public CustomerCollection cloneByKey(CustomerCollectionRequestDTO dto) {
        CustomerCollection newCollection = null;
        CustomerCollection collectionByKey = findByKey(dto.getKey());
        if (collectionByKey != null) {
            newCollection = new CustomerCollection();

            Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthCode(dto.getAuthCode());
            if (dto.getTitle() != null) {
                newCollection.setTitle(dto.getTitle().trim());
            }
            newCollection.setCustomer(customer);
            newCollection.setLang(collectionByKey.getLang());
            newCollection = add(newCollection);

            // Копируем все слова в коллекции
            List<WordInCollection> wordsInCollection =
                    WORD_IN_COLLECTION_CRUD_REPOSITORY.findWordsInCollectionAfterFilter(null,
                            null, null, dto.getKey());
            for (WordInCollection wordInCollection: wordsInCollection) {
                WORD_IN_COLLECTION_CRUD_REPOSITORY.detach(wordInCollection);
                wordInCollection.setId(null);
                wordInCollection.setCustomerCollection(newCollection);
                wordInCollection.setDateOfAdditional(LocalDateTime.now());
                WORD_IN_COLLECTION_CRUD_REPOSITORY.save(wordInCollection);
            }
        }

        return newCollection;
    }

    public long countByCustomer(Customer customer) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.countByCustomer(customer);
    }

    public long countByCustomerAndLang(Customer customer, Lang lang) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.countByCustomerAndLang(customer, lang);
    }

    public CustomerCollection findByCustomerAndKey(Customer customer, String key) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findByCustomerAndKey(customer, key);
    }
}
