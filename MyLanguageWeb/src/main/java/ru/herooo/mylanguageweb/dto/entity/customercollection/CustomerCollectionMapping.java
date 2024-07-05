package ru.herooo.mylanguageweb.dto.entity.customercollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.LangCrudRepository;
import ru.herooo.mylanguagedb.repositories.WordInCollectionCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.request.CustomerCollectionAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.request.CustomerCollectionEditRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.response.CustomerCollectionResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.response.LangResponseDTO;

import java.io.File;

@Service
public class CustomerCollectionMapping {
    private final LangCrudRepository LANG_CRUD_REPOSITORY;
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;
    private final WordInCollectionCrudRepository WORD_IN_COLLECTION_CRUD_REPOSITORY;

    private final CustomerMapping CUSTOMER_MAPPING;
    private final LangMapping LANG_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public CustomerCollectionMapping(LangCrudRepository langCrudRepository,
                                     CustomerCrudRepository customerCrudRepository,
                                     WordInCollectionCrudRepository wordInCollectionCrudRepository,

                                     CustomerMapping customerMapping,
                                     LangMapping langMapping,

                                     StringUtils stringUtils) {
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;
        this.WORD_IN_COLLECTION_CRUD_REPOSITORY = wordInCollectionCrudRepository;

        this.CUSTOMER_MAPPING = customerMapping;
        this.LANG_MAPPING = langMapping;

        this.STRING_UTILS = stringUtils;
    }

    public CustomerCollectionResponseDTO mapToResponseDTO(CustomerCollection customerCollection) {
        CustomerCollectionResponseDTO dto = new CustomerCollectionResponseDTO();
        dto.setId(customerCollection.getId());
        dto.setTitle(customerCollection.getTitle());
        dto.setDateOfCreate(customerCollection.getDateOfCreate());
        dto.setIsActiveForAuthor(customerCollection.isActiveForAuthor());
        dto.setPathToImage(customerCollection.getPathToImage());
        dto.setDescription(customerCollection.getDescription());

        long numberOfWords = WORD_IN_COLLECTION_CRUD_REPOSITORY.count(customerCollection.getId()).orElse(0L);
        dto.setNumberOfWords(numberOfWords);

        if (customerCollection.getLang() != null) {
            LangResponseDTO lang = LANG_MAPPING.mapToResponseDTO(customerCollection.getLang());
            dto.setLang(lang);
        }

        if (customerCollection.getCustomer() != null) {
            dto.setCustomer(CUSTOMER_MAPPING.mapToResponseDTO(customerCollection.getCustomer()));
        }

        return dto;
    }

    public CustomerCollection mapToCustomerCollection(CustomerCollectionAddRequestDTO dto) {
        CustomerCollection customerCollection = new CustomerCollection();

        String authKey = dto.getAuthKey();
        if (!STRING_UTILS.isStringVoid(authKey)) {
            Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthKey(authKey).orElse(null);
            customerCollection.setCustomer(customer);
        }

        String langCode = dto.getLangCode();
        if (!STRING_UTILS.isStringVoid(langCode)) {
            Lang lang = LANG_CRUD_REPOSITORY.findByCode(langCode).orElse(null);
            customerCollection.setLang(lang);
        }

        String title = dto.getTitle();
        if (!STRING_UTILS.isStringVoid(title)) {
            title = title.trim();
            if (!STRING_UTILS.isStringVoid(title)) {
                customerCollection.setTitle(title);
            }
        }

        return customerCollection;
    }

    public CustomerCollection mapToCustomerCollection(CustomerCollection customerCollection,
                                                      File imageFile,
                                                      CustomerCollectionEditRequestDTO dto) {
        if (customerCollection != null) {
            if (imageFile != null && imageFile.exists()) {
                customerCollection.setPathToImage("/customer_collections/images/" + imageFile.getName());
            }

            String title = dto.getTitle();
            if (!STRING_UTILS.isStringVoid(title)) {
                title = title.trim();
                customerCollection.setTitle(title);
            }

            boolean isActiveForAuthor = dto.getIsActiveForAuthor();
            customerCollection.setActiveForAuthor(isActiveForAuthor);

            String description = dto.getDescription();
            customerCollection.setDescription(description);
        }

        return customerCollection;
    }
}
