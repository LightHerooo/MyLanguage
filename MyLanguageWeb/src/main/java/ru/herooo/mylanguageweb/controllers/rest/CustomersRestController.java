package ru.herooo.mylanguageweb.controllers.rest;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.repositories.lang.Langs;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.dto.customer.CustomerEntryRequestDTO;
import ru.herooo.mylanguageweb.dto.customer.CustomerMapping;
import ru.herooo.mylanguageweb.dto.customer.CustomerRequestDTO;
import ru.herooo.mylanguageweb.dto.customer.CustomerResponseDTO;
import ru.herooo.mylanguageweb.dto.customercollection.CustomerCollectionRequestDTO;
import ru.herooo.mylanguageweb.services.CustomerCollectionService;
import ru.herooo.mylanguageweb.services.CustomerService;
import ru.herooo.mylanguageweb.services.LangService;

@RestController
@RequestMapping("/api/customers")
public class CustomersRestController {
    private final CustomerService CUSTOMER_SERVICE;
    private final CustomerCollectionService CUSTOMER_COLLECTION_SERVICE;
    private final LangService LANG_SERVICE;

    private final CustomerMapping CUSTOMER_MAPPING;

    @Autowired
    public CustomersRestController(CustomerService customerService,
                                   CustomerCollectionService customerCollectionService,
                                   LangService langService,
                                   CustomerMapping customerMapping) {
        this.CUSTOMER_SERVICE = customerService;
        this.CUSTOMER_COLLECTION_SERVICE = customerCollectionService;
        this.LANG_SERVICE = langService;

        this.CUSTOMER_MAPPING = customerMapping;
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
            CustomerCollectionRequestDTO collectionDTO = new CustomerCollectionRequestDTO();
            collectionDTO.setAuthCode(customer.getAuthCode());
            collectionDTO.setTitle("Общая");
            CUSTOMER_COLLECTION_SERVICE.add(collectionDTO);

            collectionDTO = new CustomerCollectionRequestDTO();
            collectionDTO.setAuthCode(customer.getAuthCode());
            collectionDTO.setTitle("Английские слова");
            collectionDTO.setLangCode(LANG_SERVICE.findById(Langs.EN).getCode());
            CUSTOMER_COLLECTION_SERVICE.add(collectionDTO);

            collectionDTO = new CustomerCollectionRequestDTO();
            collectionDTO.setAuthCode(customer.getAuthCode());
            collectionDTO.setTitle("Русские слова");
            collectionDTO.setLangCode(LANG_SERVICE.findById(Langs.RU).getCode());
            CUSTOMER_COLLECTION_SERVICE.add(collectionDTO);

            CustomerResponseDTO dto = CUSTOMER_MAPPING.mapToResponseDTO(customer);
            return ResponseEntity.ok(dto);
        } else {
            CustomResponseMessage message = new CustomResponseMessage(2,
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

    @GetMapping("/find/by_id")
    public ResponseEntity<?> findById(@RequestParam("id") Long id) {
        Customer customer = CUSTOMER_SERVICE.findById(id);
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
