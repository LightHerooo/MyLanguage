package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.repositories.CustomerCrudRepository;
import ru.herooo.mylanguageweb.dto.CustomResponseMessage;
import ru.herooo.mylanguageweb.services.CustomerService;

@RestController
@RequestMapping("/api/customers")
public class CustomersRestController {

    private final CustomerService CUSTOMER_SERVICE;

    // Возвращать CustomerInfoDTO

    @Autowired
    public CustomersRestController(CustomerService customerService) {
        this.CUSTOMER_SERVICE = customerService;
    }

    @GetMapping("/exists/by_login")
    public ResponseEntity<?> isCustomerLoginExists(@RequestParam("login") String login) {
        Customer customer = CUSTOMER_SERVICE.findByLogin(login);
        if (customer == null) {
            CustomResponseMessage crm = new CustomResponseMessage(1,
                    String.format("Пользователя с логином '%s' не существует.", login));
            return ResponseEntity.badRequest().body(crm);
        } else {
            CustomResponseMessage crm = new CustomResponseMessage(1,
                    String.format("Логин '%s' уже используется.", login));
            return ResponseEntity.ok(crm);
        }
    }

    @GetMapping("/exists/by_email")
    public ResponseEntity<?> isCustomerEmailExists(@RequestParam("email") String email) {
        Customer customer = CUSTOMER_SERVICE.findByEmail(email);
        if (customer == null) {
            CustomResponseMessage crm = new CustomResponseMessage(1,
                    String.format("Почта '%s' не использовалась при регистрации.", email));
            return ResponseEntity.badRequest().body(crm);
        } else {
            CustomResponseMessage crm = new CustomResponseMessage(1,
                    String.format("Почта '%s' уже используется.", email));
            return ResponseEntity.ok(crm);
        }
    }

    @GetMapping("/exists/by_nickname")
    public ResponseEntity<?> isCustomerNicknameExists(@RequestParam("nickname") String nickname) {
        Customer customer = CUSTOMER_SERVICE.findByNickname(nickname);
        if (customer == null) {
            CustomResponseMessage crm = new CustomResponseMessage(1,
                    String.format("Пользователя с никнеймом '%s' не существует.", nickname));
            return ResponseEntity.badRequest().body(crm);
        } else {
            CustomResponseMessage crm = new CustomResponseMessage(1,
                    String.format("Никнейм '%s' уже используется.", nickname));
            return ResponseEntity.ok(crm);
        }
    }
}
