package ru.herooo.mylanguageweb.dto.entity.customerrole;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import ru.herooo.mylanguagedb.entities.CustomerRole;
import ru.herooo.mylanguageweb.dto.entity.color.ColorMapping;
import ru.herooo.mylanguageweb.dto.entity.color.response.ColorResponseDTO;
import ru.herooo.mylanguageweb.dto.entity.customerrole.response.CustomerRoleResponseDTO;

@Service
public class CustomerRoleMapping {

    private final ColorMapping COLOR_MAPPING;

    @Autowired
    public CustomerRoleMapping(ColorMapping colorMapping) {
        this.COLOR_MAPPING = colorMapping;
    }

    public CustomerRoleResponseDTO mapToResponseDTO(CustomerRole customerRole) {
        CustomerRoleResponseDTO dto = new CustomerRoleResponseDTO();

        dto.setId(customerRole.getId());
        dto.setTitle(customerRole.getTitle());
        dto.setPathToImage(customerRole.getPathToImage());
        dto.setCode(customerRole.getCode());
        dto.setDescription(customerRole.getDescription());

        if (customerRole.getColor() != null) {
            ColorResponseDTO color = COLOR_MAPPING.mapToResponseDTO(customerRole.getColor());
            dto.setColor(color);
        }

        return dto;
    }
}
