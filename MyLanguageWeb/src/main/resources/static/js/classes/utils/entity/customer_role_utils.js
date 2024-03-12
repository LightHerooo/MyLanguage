import {
    CustomerRolesAPI
} from "../../api/customer_roles_api.js";

import {
    HttpStatuses
} from "../../http_statuses.js";

import {
    CustomerRoleResponseDTO
} from "../../dto/entity/customer_role/customer_role.js";

import {
    ComboBoxUtils
} from "../combo_box_utils.js";

const _CUSTOMER_ROLES_API = new CustomerRolesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _COMBO_BOX_UTILS = new ComboBoxUtils();

export class CustomerRoleUtils {
    CB_CUSTOMER_ROLES = new CbCustomerRoles();
}

class CbCustomerRoles {
    async prepare(cbCustomerRoles, firstOption){
        if (cbCustomerRoles) {
            cbCustomerRoles.replaceChildren();

            if (firstOption) {
                cbCustomerRoles.appendChild(firstOption);
            }

            let jsonResponse = await _CUSTOMER_ROLES_API.GET.getAll();
            if (jsonResponse.status === _HTTP_STATUSES.OK) {
                let json = jsonResponse.json;
                for (let i = 0; i < json.length; i++) {
                    let customerRole = new CustomerRoleResponseDTO(json[i]);

                    let option = document.createElement("option");
                    let color = customerRole.color;
                    if (color) {
                        option.style.color = "#" + color.hexCode;
                    }
                    option.textContent = customerRole.title;
                    option.id = customerRole.code;

                    cbCustomerRoles.appendChild(option);
                }
            }

            cbCustomerRoles.addEventListener("change", function () {
                let selectedOption = _COMBO_BOX_UTILS.GET_SELECTED_ITEM.byComboBox(cbCustomerRoles);
                cbCustomerRoles.style.backgroundColor = selectedOption.style.color;
            });
        }
    }
}