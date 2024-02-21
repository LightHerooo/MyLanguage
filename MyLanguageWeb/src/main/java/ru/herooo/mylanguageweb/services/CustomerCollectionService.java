package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.entities.WordInCollection;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguagedb.repositories.wordincollection.WordInCollectionCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionRequestDTO;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerCollectionService {
    private final CustomerCollectionCrudRepository CUSTOMER_COLLECTION_CRUD_REPOSITORY;
    private final WordInCollectionCrudRepository WORD_IN_COLLECTION_CRUD_REPOSITORY;

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public CustomerCollectionService(CustomerCollectionCrudRepository customerCollectionCrudRepository,
                                     WordInCollectionCrudRepository wordInCollectionCrudRepository,
                                     CustomerCollectionMapping customerCollectionMapping,
                                     StringUtils stringUtils) {
        this.CUSTOMER_COLLECTION_CRUD_REPOSITORY = customerCollectionCrudRepository;
        this.WORD_IN_COLLECTION_CRUD_REPOSITORY = wordInCollectionCrudRepository;
        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
        this.STRING_UTILS = stringUtils;
    }

    public List<CustomerCollection> findAll(Long customerId) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findAll(customerId);
    }

    public CustomerCollection find(long id) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findById(id);
    }

    public CustomerCollection find(String key) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findByKey(key);
    }

    public CustomerCollection findByCustomerAndTitle(Customer customer, String title) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findByCustomerAndTitleIgnoreCase(customer, title);
    }

    public CustomerCollection findByCustomerAndKey(Customer customer, String key) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.findByCustomerAndKey(customer, key);
    }

    public CustomerCollection add(CustomerCollectionRequestDTO dto) {
        CustomerCollection collection = CUSTOMER_COLLECTION_MAPPING.mapToCustomerCollection(dto);
        return add(collection);
    }

    public CustomerCollection add(CustomerCollection collection) {
        if (collection.getTitle() != null) {
            collection.setTitle(collection.getTitle().trim());
        }

        collection.setKey(STRING_UTILS.getRandomStrEn(20));
        collection.setDateOfCreate(LocalDateTime.now());

        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.save(collection);
    }

    public CustomerCollection copy(CustomerCollection oldCollection, String newTitle, Customer newCustomer) {
        CustomerCollection newCollection = new CustomerCollection();
        newCollection.setTitle(newTitle);
        newCollection.setCustomer(newCustomer);
        newCollection.setLang(oldCollection.getLang());
        newCollection = add(newCollection);

        // Копируем все слова в коллекции
        if (newCollection != null) {
            List<WordInCollection> wordsInCollection = WORD_IN_COLLECTION_CRUD_REPOSITORY
                    .findAll(null, oldCollection.getKey());
            if (wordsInCollection != null && wordsInCollection.size() > 0) {
                for (WordInCollection wordInCollection: wordsInCollection) {
                    WORD_IN_COLLECTION_CRUD_REPOSITORY.detach(wordInCollection);
                    wordInCollection.setId(null);
                    wordInCollection.setCustomerCollection(newCollection);
                    wordInCollection.setDateOfAdditional(LocalDateTime.now());
                    WORD_IN_COLLECTION_CRUD_REPOSITORY.save(wordInCollection);
                }
            }
        }

        return newCollection;
    }

    public long count(Customer customer) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.countByCustomer(customer);
    }

    public long count(Customer customer, Lang lang) {
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.countByCustomerAndLang(customer, lang);
    }
}
