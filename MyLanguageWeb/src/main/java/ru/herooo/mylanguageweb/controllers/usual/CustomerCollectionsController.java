package ru.herooo.mylanguageweb.controllers.usual;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguageutils.outsidefolder.OutsideFolders;
import ru.herooo.mylanguageutils.outsidefolder.types.OutsideFolder;
import ru.herooo.mylanguageweb.controllers.Redirects;
import ru.herooo.mylanguageweb.controllers.usual.utils.ControllerUtils;
import ru.herooo.mylanguageweb.services.CustomerCollectionService;
import ru.herooo.mylanguageweb.services.CustomerService;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

@Controller
@RequestMapping("/customer_collections")
public class CustomerCollectionsController {
    private final String CUSTOMER_COLLECTION_ID_ATTRIBUTE_NAME = "CUSTOMER_COLLECTION_ID";

    private final CustomerService CUSTOMER_SERVICE;
    private final CustomerCollectionService CUSTOMER_COLLECTION_SERVICE;

    private final ControllerUtils CONTROLLER_UTILS;

    public CustomerCollectionsController(CustomerService customerService,
                                         CustomerCollectionService customerCollectionService,

                                         ControllerUtils controllerUtils) {
        this.CUSTOMER_SERVICE = customerService;
        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;

        this.CONTROLLER_UTILS = controllerUtils;
    }

    @GetMapping
    public String showMainPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CUSTOMER_SERVICE.changeDateOfLastVisit(request);

            return "customer_collections/show";
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/add")
    public String showAddPage(HttpServletRequest request) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            CONTROLLER_UTILS.setGeneralAttributes(request);
            CUSTOMER_SERVICE.changeDateOfLastVisit(request);

            return "customer_collections/add";
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/edit/{id}")
    public String showEditPage(HttpServletRequest request,
                               @PathVariable("id") Long id) {
        Customer authCustomer = CUSTOMER_SERVICE.find(request);
        if (authCustomer != null) {
            CustomerCollection customerCollection = CUSTOMER_COLLECTION_SERVICE.find(id);
            if (customerCollection != null) {
                if (authCustomer.equals(customerCollection.getCustomer())) {
                    CONTROLLER_UTILS.setGeneralAttributes(request);
                    CUSTOMER_SERVICE.changeDateOfLastVisit(request);
                    request.setAttribute(CUSTOMER_COLLECTION_ID_ATTRIBUTE_NAME, id);

                    return "customer_collections/edit";
                } else {
                    return Redirects.CUSTOMER_COLLECTIONS.REDIRECT_URL;
                }
            } else {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND);
            }
        } else {
            return Redirects.ENTRY.REDIRECT_URL;
        }
    }

    @GetMapping("/images/{image_name}")
    @ResponseBody
    public ResponseEntity<?> getImage(@PathVariable("image_name") String imageName) {
        OutsideFolder currentFolder = OutsideFolders.CUSTOMER_COLLECTION_IMAGES.FOLDER;

        byte[] bytes = new byte[0];
        File file = currentFolder.getFile(imageName);
        if (file != null && file.exists()) {
            try (FileInputStream fis = new FileInputStream(file.getPath())) {
                bytes = fis.readAllBytes();
            } catch (IOException e) {

            }
        }

        return ResponseEntity.ok(bytes);
    }
}
