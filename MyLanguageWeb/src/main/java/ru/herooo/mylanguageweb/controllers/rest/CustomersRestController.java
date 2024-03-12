package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerCollection;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguagedb.repositories.lang.Langs;
import ru.herooo.mylanguageweb.dto.other.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerEntryRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerRequestDTO;
import ru.herooo.mylanguageweb.dto.entity.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerCollectionService;
import ru.herooo.mylanguageweb.services.CustomerRoleService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;

import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomersRestController {
    private final CustomerRolesRestController CUSTOMER_ROLES_REST_CONTROLLER;

    private final CustomerService CUSTOMER_SERVICE;
    private final CustomerCollectionService CUSTOMER_COLLECTION_SERVICE;
    private final LangService LANG_SERVICE;
    private final CustomerRoleService CUSTOMER_ROLE_SERVICE;


    private final CustomerMapping CUSTOMER_MAPPING;

    @Autowired
    public CustomersRestController(CustomerRolesRestController customerRolesRestController,

                                   CustomerService customerService,
                                   CustomerCollectionService customerCollectionService,
                                   LangService langService,
                                   CustomerRoleService customerRoleService,

                                   CustomerMapping customerMapping) {
        this.CUSTOMER_ROLES_REST_CONTROLLER = customerRolesRestController;

        this.CUSTOMER_SERVICE = customerService;
        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.LANG_SERVICE = langService;
        this.CUSTOMER_ROLE_SERVICE = customerRoleService;

        this.CUSTOMER_MAPPING = customerMapping;
    }

    @GetMapping("/filtered_pagination")
    public ResponseEntity<?> getAll(@RequestParam("number_of_items") Long numberOfItems,
                                    @RequestParam(value = "nickname", required = false) String nickname,
                                    @RequestParam(value = "customer_role_code",
                                            required = false) String customerRoleCode,
                                    @RequestParam(value = "last_customer_id_on_previous_page",
                                            required = false, defaultValue = "0") Long lastCustomerIdOnPreviousPage) {
        if (numberOfItems == null || numberOfItems <= 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(1, "Количество записей должно быть больше 0.");
            return ResponseEntity.badRequest().body(message);
        }

        if (lastCustomerIdOnPreviousPage == null || lastCustomerIdOnPreviousPage < 0) {
            CustomResponseMessage message =
                    new CustomResponseMessage(2,
                            "ID последнего пользователя на предыдущей странице не должен быть отрицательным. " +
                                    "Если вы хотите отобразить первую страницу, укажите ID = 0.");
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
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Пользователи по указанным фильтрам не найдены.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid CustomerRequestDTO customerRequestDTO,
                                      BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder builder = new StringBuilder();
            for (ObjectError error: bindingResult.getAllErrors()) {
                builder.append(error.getDefaultMessage());
                break;
            }

            CustomResponseMessage message = new CustomResponseMessage(1, builder.toString());
            return ResponseEntity.badRequest().body(message);
        }

        // Чистим никнейм от лишних пробелов
        if (customerRequestDTO.getNickname() != null) {
            customerRequestDTO.setNickname(customerRequestDTO.getNickname().trim());
        }

        // Ищем похожий никнейм
        ResponseEntity<?> response = findExistsByNickname(customerRequestDTO.getNickname());
        if (response.getStatusCode() == HttpStatus.OK) {
            CustomResponseMessage message = (CustomResponseMessage) response.getBody();
            return ResponseEntity.badRequest().body(message);
        }

        // Ищем похожий email
        response = findExistsByEmail(customerRequestDTO.getEmail());
        if (response.getStatusCode() == HttpStatus.OK) {
            CustomResponseMessage message = (CustomResponseMessage) response.getBody();
            return ResponseEntity.badRequest().body(message);
        }

        // Ищем похожий логин
        response = findExistsByLogin(customerRequestDTO.getLogin());
        if (response.getStatusCode() == HttpStatus.OK) {
            CustomResponseMessage message = (CustomResponseMessage) response.getBody();
            return ResponseEntity.badRequest().body(message);
        }

        Customer customer = CUSTOMER_SERVICE.register(customerRequestDTO);
        if (customer != null) {
            CustomerCollection collection = new CustomerCollection();
            collection.setTitle("Английские слова");
            collection.setCustomer(customer);
            collection.setLang(LANG_SERVICE.find(Langs.EN));
            CUSTOMER_COLLECTION_SERVICE.add(collection);

            collection = new CustomerCollection();
            collection.setTitle("Русские слова");
            collection.setCustomer(customer);
            collection.setLang(LANG_SERVICE.find(Langs.RU));
            CUSTOMER_COLLECTION_SERVICE.add(collection);

            CustomerResponseDTO dto = CUSTOMER_MAPPING.mapToResponseDTO(customer);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(1,
                    "Произошла ошибка регистрации пользователя.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PostMapping("/entry")
    public ResponseEntity<?> entry(@RequestBody @Valid CustomerEntryRequestDTO customerEntryRequestDTO,
                                   BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            StringBuilder builder = new StringBuilder();
            for (ObjectError error: bindingResult.getAllErrors()) {
                builder.append(error.getDefaultMessage());
                break;
            }

            CustomResponseMessage message = new CustomResponseMessage(1, builder.toString());
            return ResponseEntity.badRequest().body(message);
        }

        Customer customer = CUSTOMER_SERVICE.entry(customerEntryRequestDTO);
        if (customer != null) {
            CustomerResponseDTO dto = CUSTOMER_MAPPING.mapToResponseDTO(customer);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2, "Неправильный логин или пароль.");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @PatchMapping("/change_role")
    public ResponseEntity<?> changeRole(HttpServletRequest request,
                                        @RequestBody CustomerRequestDTO dto) {
        String validateAuthCode = CUSTOMER_SERVICE.validateAuthCode(request, dto.getAuthCode());
        dto.setAuthCode(validateAuthCode);

        ResponseEntity<?> response = findExistsByAuthCode(dto.getAuthCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Менять роль может только администратор
        Customer authCustomer = CUSTOMER_SERVICE.findByAuthCode(dto.getAuthCode());
        if (!CUSTOMER_SERVICE.isAdmin(authCustomer)) {
            CustomResponseMessage message = new CustomResponseMessage(1, "У вас недостаточно прав.");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверяем существование пользователя, которому будем изменять роль
        response = find(dto.getId());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        // Нельзя изменить себе же роль
        Customer changedCustomer = CUSTOMER_SERVICE.find(dto.getId());
        if (authCustomer.equals(changedCustomer)) {
            CustomResponseMessage message = new CustomResponseMessage(2,
                    "Нельзя изменить роль своему пользователю.");
            return ResponseEntity.badRequest().body(message);
        }

        // Проверям роль, которую хотим присвоить
        response = CUSTOMER_ROLES_REST_CONTROLLER.findByCode(dto.getRoleCode());
        if (response.getStatusCode() != HttpStatus.OK) {
            return response;
        }

        CustomerRole newRole = CUSTOMER_ROLE_SERVICE.find(dto.getRoleCode());
        changedCustomer = CUSTOMER_SERVICE.changeRole(changedCustomer, newRole);
        if (changedCustomer != null) {
            CustomerResponseDTO responseDTO = CUSTOMER_MAPPING.mapToResponseDTO(changedCustomer);
            return ResponseEntity.ok(responseDTO);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(3,
                    String.format("Не удалось изменить роль пользователя с id = '%d'.", dto.getId()));
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
            CustomResponseMessage message = new CustomResponseMessage(1,
                    String.format("Пользователя с id = '%s' не найдено.", id));
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/exists/by_login")
    public ResponseEntity<?> findExistsByLogin(@RequestParam("login") String login) {
        Customer customer = CUSTOMER_SERVICE.findByLogin(login);
        if (customer != null) {
            CustomResponseMessage crm = new CustomResponseMessage(1, "Этот логин уже занят.");
            return ResponseEntity.ok(crm);
        } else {
            CustomResponseMessage crm = new CustomResponseMessage(1,
                    String.format("Пользователя с логином '%s' не существует.", login));
            return ResponseEntity.badRequest().body(crm);
        }
    }

    @GetMapping("/find/exists/by_email")
    public ResponseEntity<?> findExistsByEmail(@RequestParam("email") String email) {
        Customer customer = CUSTOMER_SERVICE.findByEmail(email);
        if (customer != null) {
            CustomResponseMessage crm = new CustomResponseMessage(1, "Эта почта уже занята.");
            return ResponseEntity.ok(crm);
        } else {
            CustomResponseMessage crm = new CustomResponseMessage(1,
                    String.format("Пользователя с электронной почтой '%s' не существует.", email));
            return ResponseEntity.badRequest().body(crm);
        }
    }

    @GetMapping("/find/exists/by_nickname")
    public ResponseEntity<?> findExistsByNickname(@RequestParam("nickname") String nickname) {
        Customer customer = CUSTOMER_SERVICE.findByNickname(nickname);
        if (customer != null) {
            CustomResponseMessage crm = new CustomResponseMessage(1, "Этот никнейм уже занят.");
            return ResponseEntity.ok(crm);
        } else {
            CustomResponseMessage crm = new CustomResponseMessage(1,
                    String.format("Пользователя с никнеймом '%s' не существует.", nickname));
            return ResponseEntity.badRequest().body(crm);
        }
    }

    @GetMapping("/find/exists/by_auth_code")
    public ResponseEntity<?> findExistsByAuthCode(@RequestParam("auth_code") String authCode) {
        Customer customer = CUSTOMER_SERVICE.findByAuthCode(authCode);
        if (customer != null) {
            CustomResponseMessage crm = new CustomResponseMessage(1, "Код подтверждён.");
            return ResponseEntity.ok(crm);
        } else {
            CustomResponseMessage crm = new CustomResponseMessage(1, "Недействительный код авторизации.");
            return ResponseEntity.badRequest().body(crm);
        }
    }
}
