import {
    CustomerRolesAPI
} from "../../../../api/entity/customer_roles_api.js";

import {
    HttpStatuses
} from "../../../../api/classes/http/http_statuses.js";

import {
    CustomerRoleResponseDTO
} from "../../../../dto/entity/customer_role/response/customer_role_response_dto.js";

import {
    SelectWithImgAbstractElement
} from "../../with_img/abstracts/select_with_img_abstract_element.js";

import {
    ImgSrcs
} from "../../../img_srcs.js";

const _CUSTOMER_ROLES_API = new CustomerRolesAPI();

const _HTTP_STATUSES = new HttpStatuses();
const _IMG_SRCS = new ImgSrcs();

export class SelectElementCustomerRoles extends SelectWithImgAbstractElement {

    constructor(divContainer, select, img, doNeedToCreateFirstOption) {
        super(divContainer, select, img, doNeedToCreateFirstOption);
    }

    async createFirstOption() {
        let option = document.createElement("option");
        option.value = "";
        option.textContent = "Все";

        return option;
    }

    async createOptionsArr() {
        let optionsArr = [];

        let jsonResponse = await _CUSTOMER_ROLES_API.GET.getAll();
        if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
            let json = jsonResponse.getJson();
            for (let i = 0; i < json.length; i++) {
                let customerRole = new CustomerRoleResponseDTO(json[i]);

                let option = document.createElement("option");
                let color = customerRole.getColor();
                if (color) {
                    option.style.color = "#" + color.getHexCode();
                }

                option.value = customerRole.getCode();
                option.textContent = customerRole.getTitle();

                optionsArr.push(option);
            }
        }

        return optionsArr;
    }

    async changeImgSrc() {
        let img = this.getImg();
        if (img) {
            let src;
            let title;
            let customerRoleCode = this.getSelectedValue();
            if (customerRoleCode) {
                let jsonResponse = await _CUSTOMER_ROLES_API.GET.findByCode(customerRoleCode);
                if (jsonResponse.getStatus() === _HTTP_STATUSES.OK) {
                    let customerRole = new CustomerRoleResponseDTO(jsonResponse.getJson());

                    src = customerRole.getPathToImage();
                    title = customerRole.getTitle();
                }
            }

            if (!src) {
                src = _IMG_SRCS.OTHER.EMPTY;
                title = "";
            }

            img.src = src;
            img.title = title;
        }
    }
}