package ru.herooo.mylanguageweb.dto.customer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.Customer;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguageweb.dto.customerrole.CustomerRoleMapping;
import ru.herooo.mylanguageweb.dto.customerrole.CustomerRoleResponseDTO;
import ru.herooo.mylanguageweb.services.CustomerRoleService;

@Service
public class CustomerMapping {

    private final CustomerRoleService CUSTOMER_ROLE_SERVICE;
    private final CustomerRoleMapping CUSTOMER_ROLE_MAPPING;

    @Autowired
    public CustomerMapping(CustomerRoleService customerRoleService,
                           CustomerRoleMapping customerRoleMapping) {
        this.CUSTOMER_ROLE_SERVICE = customerRoleService;
        this.CUSTOMER_ROLE_MAPPING = customerRoleMapping;
    }

    public Customer mapToCustomer(Customer oldCustomer, CustomerRequestDTO dto) {
        if (dto.getNickname() != null) {
            oldCustomer.setNickname(dto.getNickname().trim());
        }

        oldCustomer.setEmail(dto.getEmail());
        oldCustomer.setLogin(dto.getLogin());
        oldCustomer.setPassword(dto.getPassword());

        CustomerRole role = CUSTOMER_ROLE_SERVICE.findByCode(dto.getRoleCode());
        oldCustomer.setRole(role);

        return oldCustomer;
    }

    public Customer mapToCustomer(CustomerRequestDTO dto) {
        return mapToCustomer(new Customer(), dto);
    }

    public CustomerResponseDTO mapToResponseDTO(Customer customer) {
        CustomerResponseDTO dto = new CustomerResponseDTO();
        dto.setId(customer.getId());
        dto.setNickname(customer.getNickname());
        dto.setDateOfCreate(customer.getDateOfCreate());
        dto.setDateOfLastVisit(customer.getDateOfLastVisit());

        if (customer.getRole() != null) {
            CustomerRoleResponseDTO role = CUSTOMER_ROLE_MAPPING.mapToResponseDTO(customer.getRole());
            dto.setRole(role);
        }

        return dto;
    }
}
