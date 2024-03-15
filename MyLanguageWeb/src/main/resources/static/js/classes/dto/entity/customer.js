import {
    CustomerRoleResponseDTO
} from "./customer_role/customer_role.js";

import {
    CountryResponseDTO
} from "./country.js";

import {
    FlagElements
} from "../../flag_elements.js";

import {
    CssRoot
} from "../../css/css_root.js";

const _CSS_ROOT = new CssRoot();

const _FLAG_ELEMENTS = new FlagElements();

export class CustomerResponseDTO {
    id;
    nickname;
    role;
    dateOfCreate;
    dateOfLastVisit;
    country;

    constructor(customerJson) {
        if (customerJson) {
            this.id = customerJson["id"];
            this.nickname = customerJson["nickname"];
            this.dateOfCreate = customerJson["date_of_create"];
            this.dateOfLastVisit = customerJson["date_of_last_visit"];

            let role = customerJson["role"];
            if (role) {
                this.role = new CustomerRoleResponseDTO(role);
            }

            let country = customerJson["country"];
            if (country) {
                this.country = new CountryResponseDTO(country);
            }
        }
    }

    createDiv() {
        let div = document.createElement("div");
        div.style.display = "flex";
        div.style.flexDirection = "row";
        div.style.gap = "5px";

        let spanFlag = _FLAG_ELEMENTS.SPAN.create(this.country, false);
        div.appendChild(spanFlag);

        let spanNickname = document.createElement("span");
        spanNickname.style.fontSize = _CSS_ROOT.THIRD_FONT_SIZE;

        // Устанавливаем цвет и жирный шрифт, только если у роли есть цвет ---
        let roleColor = this.role.color;
        if (roleColor) {
            spanNickname.style.fontWeight = "bold";
            spanNickname.style.color = "#" + roleColor.hexCode;
        }
        //---

        spanNickname.textContent = this.nickname;
        div.appendChild(spanNickname);

        return div;
    }
}

export class CustomerRequestDTO {
    id;
    nickname;
    email;
    login;
    password;
    countryCode;
    roleCode;
}