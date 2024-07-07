package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.customer_collection.CustomerCollection;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguagedb.entities.Lang;
import ru.herooo.mylanguageutils.file.MimeTypeWithSize;
import ru.herooo.mylanguageutils.file.filesize.FileSize;
import ru.herooo.mylanguageutils.file.filesize.FileSizeUnits;
import ru.herooo.mylanguageutils.file.mimetype.ImageMimeTypes;
import ru.herooo.mylanguageweb.controllers.usual.utils.ControllerUtils;
import ru.herooo.mylanguageweb.dto.entity.customer.*;
import ru.herooo.mylanguageweb.dto.entity.customer.request.edit.CustomerEditPasswordRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.request.edit.CustomerEditRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.request.CustomerAddRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.response.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.other.request.entity.edit.s.EntityEditStringByIdRequestDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerCollectionService;
import ru.herooo.mylanguageweb.services.CustomerRoleService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomersRestController {
    private final MimeTypeWithSize[] ACCEPTED_MIME_TYPES_WITH_SIZE_FOR_AVATAR = new MimeTypeWithSize[] {
            new MimeTypeWithSize(ImageMimeTypes.PNG.MIME_TYPE, new FileSize(FileSizeUnits.MB, 5)),
            new MimeTypeWithSize(ImageMimeTypes.JPG.MIME_TYPE, new FileSize(FileSizeUnits.MB, 5)),
            new MimeTypeWithSize(ImageMimeTypes.JPEG.MIME_TYPE, new FileSize(FileSizeUnits.MB, 5)),
            new MimeTypeWithSize(ImageMimeTypes.GIF.MIME_TYPE, new FileSize(FileSizeUnits.MB, 1)),
    };

    private final CustomerRolesRestController CUSTOMER_ROLES_REST_CONTROLLER;
    private final CountriesRestController COUNTRIES_REST_CONTROLLER;

    private final CustomerService CUSTOMER_SERVICE;
    private final CustomerCollectionService CUSTOMER_COLLECTION_SERVICE;
    private final LangService LANG_SERVICE;
    private final CustomerRoleService CUSTOMER_ROLE_SERVICE;

    private final ControllerUtils CONTROLLER_UTILS;

    private final CustomerMapping CUSTOMER_MAPPING;

    @Autowired
    public CustomersRestController(CustomerRolesRestController customerRolesRestController,
                                   CountriesRestController countriesRestController,

                                   CustomerService customerService,
                                   CustomerCollectionService customerCollectionService,
                                   LangService langService,
                                   CustomerRoleService customerRoleService,

                                   ControllerUtils controllerUtils,

                                   CustomerMapping customerMapping) {
        this.CUSTOMER_ROLES_REST_CONTROLLER = customerRolesRestController;
        this.COUNTRIES_REST_CONTROLLER = countriesRestController;

        this.CUSTOMER_SERVICE = customerService;
        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.LANG_SERVICE = langService;
        this.CUSTOMER_ROLE_SERVICE = customerRoleService;

        this.CONTROLLER_UTILS = controllerUtils;

        this.CUSTOMER_MAPPING = customerMapping;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAll(@RequestParam(value = "nickname", required = false) String nickname,
                                    @RequestParam(value = "customer_role_code", required = false) String customerRoleCode,
                                    @RequestParam(value = "number_of_items", required = false, defaultValue = "0")
                                        Long numberOfItems,
                                    @RequestParam(value = "last_customer_id_on_previous_page", required = false, defaultValue = "0")
                                        Long lastCustomerIdOnPreviousPage) {
        if (numberOfItems == null || numberOfItems < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(1, "Количество записей не должно быть отрицательным");
            return ResponseEntity.badRequest().body(message);
        }

        if (lastCustomerIdOnPreviousPage == null || lastCustomerIdOnPreviousPage < 0) {
            ResponseMessageResponseDTO message =
                    new ResponseMessageResponseDTO(2,
                            "ID последнего пользователя на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0");
            return ResponseEntity.badRequest().body(message);
        }

        List<Customer> customers = CUSTOMER_SERVICE.getAll(
                nickname, customerRoleCode, numberOfItems, lastCustomerIdOnPreviousPage);
        if (customers != null && customers.size() > 0) {
            List<CustomerResponseDTO> responseDTOs = customers
                    .stream()
                    .map(CUSTOMER_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Пользователи по указанным фильтрам не найдены");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_id")
    public ResponseEntity<?> find(@RequestParam("id") Long id) {
        Customer customer = CUSTOMER_SERVICE.find(id);
        if (customer != null) {
            CustomerResponseDTO dto = CUSTOMER_MAPPING.mapToResponseDTO(customer);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Пользователя с id = '%s' не найдено", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_nickname")
    public ResponseEntity<?> find(@RequestParam("nickname") String nickname) {
        Customer customer = CUSTOMER_SERVICE.findByNickname(nickname);
        if (customer != null) {
            CustomerResponseDTO dto = CUSTOMER_MAPPING.mapToResponseDTO(customer);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1,
                    String.format("Пользователя с никнеймом '%s' не существует", nickname));
            return ResponseEntity.badRequest().body(crm);
        }
    }

    @GetMapping("/exists/by_nickname")
    public ResponseEntity<?> isExistsByNickname(@RequestParam("nickname") String nickname) {
        Customer customer = CUSTOMER_SERVICE.findByNickname(nickname);
        if (customer != null) {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1, "Этот никнейм уже занят");
            return ResponseEntity.ok(crm);
        } else {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1,
                    String.format("Пользователя с никнеймом '%s' не существует", nickname));
            return ResponseEntity.badRequest().body(crm);
        }
    }

    @GetMapping("/exists/by_login")
    public ResponseEntity<?> isExistsByLogin(@RequestParam("login") String login) {
        Customer customer = CUSTOMER_SERVICE.findByLogin(login);
        if (customer != null) {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1, "Этот логин уже занят");
            return ResponseEntity.ok(crm);
        } else {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1,
                    String.format("Пользователя с логином '%s' не существует", login));
            return ResponseEntity.badRequest().body(crm);
        }
    }

    @GetMapping("/exists/by_email")
    public ResponseEntity<?> isExistsByEmail(@RequestParam("email") String email) {
        Customer customer = CUSTOMER_SERVICE.findByEmail(email);
        if (customer != null) {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1, "Эта почта уже занята");
            return ResponseEntity.ok(crm);
        } else {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1,
                    String.format("Пользователя с электронной почтой '%s' не существует", email));
            return ResponseEntity.badRequest().body(crm);
        }
    }

    @GetMapping("/exists/by_auth_key")
    public ResponseEntity<?> isExistsByAuthKey(@RequestParam("auth_key") String authKey) {
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(authKey);
        if (customer != null) {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1, "Код валиден");
            return ResponseEntity.ok(crm);
        } else {
            ResponseMessageResponseDTO crm = new ResponseMessageResponseDTO(1, "Недействительный код авторизации");
            return ResponseEntity.badRequest().body(crm);
        }
    }

    @GetMapping("/validate/is_super_user")
    public ResponseEntity<?> validateIsSuperUser(@RequestParam("id") Long id) {
        ResponseEntity<?> response = this.find(id);
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.find(id);
        if (CUSTOMER_SERVICE.isSuperUser(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Пользователь - суперюзер");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Пользователь не является суперюзером");
            return ResponseEntity.badRequest().body(message);
        }
    }



    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid CustomerAddRequestDTO customerAddRequestDTO,
                                      BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult
                    .getAllErrors()
                    .stream()
                    .findFirst()
                    .get()
                    .getDefaultMessage();

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, errorMessage);
            return ResponseEntity.badRequest().body(message);
        }

        // Чистим никнейм от лишних пробелов
        if (customerAddRequestDTO.getNickname() != null) {
            customerAddRequestDTO.setNickname(customerAddRequestDTO.getNickname().trim());
        }

        // Ищем похожий никнейм
        ResponseEntity<?> response = isExistsByNickname(customerAddRequestDTO.getNickname());
        if (response.getStatusCode() == HttpStatus.OK) {
            ResponseMessageResponseDTO message = (ResponseMessageResponseDTO) response.getBody();
            return ResponseEntity.badRequest().body(message);
        }

        // Ищем похожую почту
        response = isExistsByEmail(customerAddRequestDTO.getEmail());
        if (response.getStatusCode() == HttpStatus.OK) {
            ResponseMessageResponseDTO message = (ResponseMessageResponseDTO) response.getBody();
            return ResponseEntity.badRequest().body(message);
        }

        // Ищем похожий логин
        response = isExistsByLogin(customerAddRequestDTO.getLogin());
        if (response.getStatusCode() == HttpStatus.OK) {
            ResponseMessageResponseDTO message = (ResponseMessageResponseDTO) response.getBody();
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем существования страны
        response = COUNTRIES_REST_CONTROLLER.find(customerAddRequestDTO.getCountryCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        Customer customer = CUSTOMER_SERVICE.add(customerAddRequestDTO);
        if (customer != null) {
            // Создаём коллекции активных языков
            List<Lang> langs = LANG_SERVICE.findAllForIn(true);
            if (langs != null && langs.size() > 0) {
                for (Lang lang: langs) {
                    CustomerCollection collection = new CustomerCollection();
                    collection.setCustomer(customer);
                    collection.setTitle(String.format("Коллекция (%s)", lang.getTitle()));
                    collection.setLang(lang);

                    CUSTOMER_COLLECTION_SERVICE.add(collection);
                }
            }

            CustomerResponseDTO dto = CUSTOMER_MAPPING.mapToResponseDTO(customer);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    "Произошла ошибка регистрации пользователя");
            return ResponseEntity.badRequest().body(message);
        }
    }



    @PatchMapping("/edit")
    public ResponseEntity<?> edit(HttpServletRequest request,
                                  @RequestPart(name = "avatar", required = false) MultipartFile avatar,
                                  @RequestPart("customer") @Valid CustomerEditRequestDTO dto,
                                  BindingResult bindingResult) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> response = isExistsByAuthKey(dto.getAuthKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult
                    .getAllErrors()
                    .stream()
                    .findFirst()
                    .get()
                    .getDefaultMessage();

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, errorMessage);
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем пришедший файл на корректность
        if (avatar != null) {
            response = CONTROLLER_UTILS.checkMultipartFile(avatar, ACCEPTED_MIME_TYPES_WITH_SIZE_FOR_AVATAR);
            if (response.getStatusCode() != HttpStatus.OK) {
                return response;
            }
        }

        // Проверяем никнейм (если пользователь тот же, не выдаём ошибку)
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        response = isExistsByNickname(dto.getNickname());
        if (response.getStatusCode() == HttpStatus.OK) {
            Customer customerByNickname = CUSTOMER_SERVICE.findByNickname(dto.getNickname());
            if (!customer.equals(customerByNickname)) {
                ResponseMessageResponseDTO message = (ResponseMessageResponseDTO) response.getBody();
                return ResponseEntity.badRequest().body(message);
            }
        }

        // Проверяем страну
        response = COUNTRIES_REST_CONTROLLER.find(dto.getCountryCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        customer = CUSTOMER_SERVICE.edit(customer, avatar, dto);
        if (customer != null) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Данные пользователя успешно изменены");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(5, "Произошла ошибка изменения данных пользователя");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/edit/password")
    public ResponseEntity<?> editPassword(HttpServletRequest request,
                                          HttpServletResponse response,
                                          @RequestBody @Valid CustomerEditPasswordRequestDTO dto,
                                          BindingResult bindingResult) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> responseEntity = isExistsByAuthKey(dto.getAuthKey());
        if (responseEntity.getStatusCode() != HttpStatus.OK) {
            return responseEntity;
        }

        if (bindingResult.hasErrors()) {
            String errorMessage = bindingResult
                    .getAllErrors()
                    .stream()
                    .findFirst()
                    .get()
                    .getDefaultMessage();

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, errorMessage);
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем старый пароль на корректность
        Customer customer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        if (!customer.getPassword().equals(dto.getOldPassword())) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2, "Неправильный старый пароль");
            return ResponseEntity.badRequest().body(message);
        }

        customer = CUSTOMER_SERVICE.editPassword(customer, dto.getNewPassword());
        if (customer != null) {
            // Обновляем куки
            CUSTOMER_SERVICE.entry(response, customer);

            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Пароль успешно изменён");
            return ResponseEntity.ok(message);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(3, "Произошла ошибка изменения пароля");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/edit/role")
    public ResponseEntity<?> editRole(HttpServletRequest request,
                                      @RequestBody EntityEditStringByIdRequestDTO dto) {
        String validateAuthKey = CUSTOMER_SERVICE.validateAuthKey(request, dto.getAuthKey());
        dto.setAuthKey(validateAuthKey);

        ResponseEntity<?> response = isExistsByAuthKey(dto.getAuthKey());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Менять роль может только администратор
        Customer authCustomer = CUSTOMER_SERVICE.findByAuthKey(dto.getAuthKey());
        if (!CUSTOMER_SERVICE.isAdmin(authCustomer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "У вас недостаточно прав");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем существование пользователя, которому будем изменять роль
        response = find(dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Нельзя изменить себе же роль
        Customer customer = CUSTOMER_SERVICE.find(dto.getId());
        if (authCustomer.equals(customer)) {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(2,
                    "Нельзя изменить роль своему пользователю");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверям роль, которую хотим присвоить
        response = CUSTOMER_ROLES_REST_CONTROLLER.findByCode(dto.getValue());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerRole newCustomerRole = CUSTOMER_ROLE_SERVICE.find(dto.getValue());
        customer = CUSTOMER_SERVICE.editRole(customer, newCustomerRole);
        if (customer != null) {
            CustomerResponseDTO responseDTO = CUSTOMER_MAPPING.mapToResponseDTO(customer);
            return ResponseEntity.ok(responseDTO);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(3,
                    String.format("Не удалось изменить роль пользователя с id = '%d'", dto.getId()));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
