import {
    AAbstractElement
} from "../../abstracts/a_abstract_element.js";

import {
    SpanElementCustomer
} from "../../../span/entity/customer/span_element_customer.js";

import {
    UrlPaths
} from "../../../../url/path/url_paths.js";

import {
    RuleTypes
} from "../../../span/elements/rule/rule_types.js";

import {
    EventNames
} from "../../../event_names.js";

const _URL_PATHS = new UrlPaths();
const _RULE_TYPES = new RuleTypes();
const _EVENT_NAMES = new EventNames();

export class AElementCustomer extends AAbstractElement {
    #customerResponseDTO;

    constructor(a) {
        super(a);
    }

    setCustomerResponseDTO(customerResponseDTOObj) {
        this.#customerResponseDTO = customerResponseDTOObj;
    }

    async fill() {
        await super.fill();

        let a = this.getA();
        let customerResponseDTO = this.#customerResponseDTO;
        if (a && customerResponseDTO) {
            a.style.textDecoration = "none";

            this.changeHref(`${_URL_PATHS.CUSTOMERS.INFO.createFullPath()}/${customerResponseDTO.getId()}`);
        }
    }

    async tryToCreateContent() {
        let span;

        let customerResponseDTO = this.#customerResponseDTO;
        if (customerResponseDTO) {
            let spanElementCustomer = new SpanElementCustomer(null);
            spanElementCustomer.setCustomerResponseDTO(customerResponseDTO);

            await spanElementCustomer.prepare();
            await spanElementCustomer.fill();

            // Устанавливаем color + underline с соответствующим роли цветом, вешаем события ---
            let spanNickname = spanElementCustomer.getSpanNickname();
            if (spanNickname) {
                let role = customerResponseDTO.getRole();
                if (role) {
                    let color = role.getColor();
                    let colorStyle = color
                        ? `#${color.getHexCode()}`
                        : "black";

                    spanNickname.style.color = colorStyle;
                    spanNickname.style.textDecoration = `${colorStyle} underline`;

                    spanNickname.addEventListener(_EVENT_NAMES.MOUSE.MOUSEOVER, function() {
                        spanNickname.style.color = "blue";
                        spanNickname.style.textDecoration = "blue underline";
                    })
                    spanNickname.addEventListener(_EVENT_NAMES.MOUSE.MOUSEOUT, function() {
                        spanNickname.style.color = colorStyle;
                        spanNickname.style.textDecoration = `${colorStyle} underline`;
                    })
                }
            }
            //---

            span = spanElementCustomer.getSpan();
        } else {
            this.showRule(_RULE_TYPES.ERROR, "Пользователь не указан");
        }

        return span;
    }
}