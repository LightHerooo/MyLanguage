package ru.herooo.mylanguageweb.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.repositories.CustomerCollectionCrudRepository;
import ru.herooo.mylanguagedb.entities.customer_collection.types.CustomerCollectionsStatistic;
import ru.herooo.mylanguageutils.StringUtils;
import ru.herooo.mylanguageutils.file.FileUtils;
import ru.herooo.mylanguageutils.outsidefolder.OutsideFolders;
import ru.herooo.mylanguageutils.outsidefolder.types.OutsideFolder;
import ru.herooo.mylanguageweb.dto.entity.customercollection.CustomerCollectionMapping;
import ru.herooo.mylanguageweb.dto.entity.customercollection.request.CustomerCollectionAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customercollection.request.CustomerCollectionEditRequestDTO;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CustomerCollectionService {
    private final CustomerCollectionCrudRepository CUSTOMER_COLLECTION_CRUD_REPOSITORY;

    private final CustomerCollectionMapping CUSTOMER_COLLECTION_MAPPING;

    private final FileUtils FILE_UTILS;
    private final StringUtils STRING_UTILS;


    @Autowired
    public CustomerCollectionService(CustomerCollectionCrudRepository customerCollectionCrudRepository,

                                     CustomerCollectionMapping customerCollectionMapping,
                                     FileUtils fileUtils,
                                     StringUtils stringUtils) {
        this.CUSTOMER_COLLECTION_CRUD_REPOSITORY = customerCollectionCrudRepository;

        this.CUSTOMER_COLLECTION_MAPPING = customerCollectionMapping;
        this.FILE_UTILS = fileUtils;
        this.STRING_UTILS = stringUtils;
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

    public CustomerCollection add(CustomerCollection customerCollection) {
        if (customerCollection.getTitle() != null) {
            customerCollection.setTitle(customerCollection.getTitle().trim());
        }

        customerCollection.setDateOfCreate(LocalDateTime.now());
        customerCollection.setActiveForAuthor(true);

        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.save(customerCollection);
    }

    public CustomerCollection edit(CustomerCollection customerCollection, MultipartFile image,
                                   CustomerCollectionEditRequestDTO dto) {
        // Создаём новое изображение (если необходимо)
        File imageFile = null;
        if (image != null && !image.isEmpty()) {
            String fileName = image.getOriginalFilename();
            if (fileName != null) {
                try {
                    OutsideFolder outsideFolder = OutsideFolders.CUSTOMER_COLLECTION_IMAGES.FOLDER;

                    imageFile = outsideFolder.createNewFile(image.getBytes(), fileName);
                    if (imageFile != null && imageFile.exists()) {
                        // Удаляем предыдущую аватарку
                        String oldFileName = FILE_UTILS.getFileName(customerCollection.getPathToImage());
                        if (!STRING_UTILS.isStringVoid(oldFileName)) {
                            outsideFolder.deleteFile(oldFileName);
                        }
                    }
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
        }

        CustomerCollection customerCollectionResult = CUSTOMER_COLLECTION_MAPPING.mapToCustomerCollection(
                customerCollection, imageFile, dto);
        return CUSTOMER_COLLECTION_CRUD_REPOSITORY.save(customerCollectionResult);
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
