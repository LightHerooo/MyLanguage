package ru.herooo.mylanguageweb.controllers.rest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguageweb.dto.entity.customerrole.CustomerRoleMapping;
import ru.herooo.mylanguageweb.dto.entity.customerrole.response.CustomerRoleResponseDTO;
import ru.herooo.mylanguageweb.dto.other.response.ResponseMessageResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerRoleService;

import java.util.List;

@RestController
@RequestMapping("/api/customer_roles")
public class CustomerRolesRestController {
    private final CustomerRoleService CUSTOMER_ROLE_SERVICE;

    private final CustomerRoleMapping CUSTOMER_ROLE_MAPPING;

    @Autowired
    public CustomerRolesRestController(CustomerRoleService customerRoleService,
                                       CustomerRoleMapping customerRoleMapping) {
        this.CUSTOMER_ROLE_SERVICE = customerRoleService;
        this.CUSTOMER_ROLE_MAPPING = customerRoleMapping;
    }

    @GetMapping("/get")
    public ResponseEntity<?> getAll() {
        List<CustomerRole> roles = CUSTOMER_ROLE_SERVICE.findAll();
        if (roles != null && roles.size() > 0) {
            List<CustomerRoleResponseDTO> responseDTOs = roles
                    .stream()
                    .map(CUSTOMER_ROLE_MAPPING::mapToResponseDTO)
                    .toList();
            return ResponseEntity.ok(responseDTOs);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1, "Роли не найдены");
            return ResponseEntity.badRequest().body(message);
        }
    }

    @GetMapping("/find/by_code")
    public ResponseEntity<?> findByCode(@RequestParam("code") String code) {
        CustomerRole role = CUSTOMER_ROLE_SERVICE.find(code);
        if (role != null) {
            CustomerRoleResponseDTO dto = CUSTOMER_ROLE_MAPPING.mapToResponseDTO(role);
            return ResponseEntity.ok(dto);
        } else {
            ResponseMessageResponseDTO message = new ResponseMessageResponseDTO(1,
                    String.format("Роль с кодом '%s' не найдена", code));
            return ResponseEntity.badRequest().body(message);
        }
    }
}
