package ru.herooo.mylanguageweb.dto.entity.customercollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.LangCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.entity.lang.LangResponseDTO;

@Service
public class CustomerCollectionMapping {
    private final LangCrudRepository LANG_CRUD_REPOSITORY;
    private final CustomerCrudRepository CUSTOMER_CRUD_REPOSITORY;

    private final CustomerMapping CUSTOMER_MAPPING;
    private final LangMapping LANG_MAPPING;

    private final StringUtils STRING_UTILS;

    @Autowired
    public CustomerCollectionMapping(LangCrudRepository langCrudRepository,
                                     CustomerCrudRepository customerCrudRepository,
                                     CustomerMapping customerMapping,
                                     LangMapping langMapping,
                                     StringUtils stringUtils) {
        this.LANG_CRUD_REPOSITORY = langCrudRepository;
        this.CUSTOMER_CRUD_REPOSITORY = customerCrudRepository;

        this.CUSTOMER_MAPPING = customerMapping;
        this.LANG_MAPPING = langMapping;

        this.STRING_UTILS = stringUtils;
    }

    public CustomerCollectionResponseDTO mapToResponseDTO(CustomerCollection customerCollection) {
        CustomerCollectionResponseDTO dto = new CustomerCollectionResponseDTO();
        dto.setId(customerCollection.getId());
        dto.setTitle(customerCollection.getTitle());
        dto.setDateOfCreate(customerCollection.getDateOfCreate());
        dto.setKey(customerCollection.getKey());

        if (customerCollection.getLang() != null) {
            LangResponseDTO lang = LANG_MAPPING.mapToResponseDTO(customerCollection.getLang());
            dto.setLang(lang);
        }

        if (customerCollection.getCustomer() != null) {
            dto.setCustomer(CUSTOMER_MAPPING.mapToResponseDTO(customerCollection.getCustomer()));
        }

        return dto;
    }

    // Маппинг для добавления (все вносимые поля не могут быть изменены)
    public CustomerCollection mapToCustomerCollection(CustomerCollectionRequestDTO dto) {
        CustomerCollection collection = new CustomerCollection();

        String authCode = dto.getAuthCode();
        if (STRING_UTILS.isNotStringVoid(authCode)) {
            Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthCode(authCode).orElse(null);
            collection.setCustomer(customer);
        }

        String langCode = dto.getLangCode();
        if (STRING_UTILS.isNotStringVoid(langCode)) {
            Lang lang = LANG_CRUD_REPOSITORY.findByCode(langCode).orElse(null);
            collection.setLang(lang);
        }

        return mapToCustomerCollection(collection, dto);
    }

    // Маппинг для изменения (все вносимые поля могут быть изменены)
    public CustomerCollection mapToCustomerCollection(CustomerCollection oldCollection,
                                                      CustomerCollectionRequestDTO dto) {
        String title = dto.getTitle();
        if (STRING_UTILS.isNotStringVoid(title)) {
            title = title.trim();
            if (STRING_UTILS.isNotStringVoid(title)) {
                oldCollection.setTitle(title);
            }
        }

        return oldCollection;
    }
}
