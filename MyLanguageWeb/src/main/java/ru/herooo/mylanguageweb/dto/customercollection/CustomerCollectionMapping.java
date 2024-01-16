package ru.herooo.mylanguageweb.dto.customercollection;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguagedb.repositories.lang.LangCrudRepository;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageweb.dto.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.lang.LangMapping;
import ru.herooo.mylanguageweb.dto.lang.LangResponseDTO;

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

    public CustomerCollection mapToCustomerCollection(CustomerCollection oldCollection,
                                                      CustomerCollectionRequestDTO dto) {
        oldCollection.setTitle(dto.getTitle().trim());

        Customer customer = CUSTOMER_CRUD_REPOSITORY.findByAuthCode(dto.getAuthCode());
        oldCollection.setCustomer(customer);

        Lang lang = LANG_CRUD_REPOSITORY.findByCode(dto.getLangCode());
        oldCollection.setLang(lang);

        return oldCollection;
    }

    public CustomerCollection mapToCustomerCollection(CustomerCollectionRequestDTO dto) {
        return mapToCustomerCollection(new CustomerCollection(), dto);
    }
}
