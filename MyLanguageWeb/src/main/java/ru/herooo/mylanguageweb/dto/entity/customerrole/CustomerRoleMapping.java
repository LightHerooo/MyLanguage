package ru.herooo.mylanguageweb.dto.entity.customerrole;

import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.CustomerRole;

@Service
public class CustomerRoleMapping {
    public CustomerRoleResponseDTO mapToResponseDTO(CustomerRole customerRole) {
        CustomerRoleResponseDTO dto = new CustomerRoleResponseDTO();
        dto.setId(customerRole.getId());
        dto.setTitle(customerRole.getTitle());
        dto.setPathToImage(customerRole.getPathToImage());

        return dto;
    }
}
