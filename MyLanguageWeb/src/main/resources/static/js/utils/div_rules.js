import {
    DIV_TEXT_ERROR_MESSAGE_STANDARD
} from "../css/css_main_classes.js";

/*
    Отображение предупреждений (правил) при ошибках отдельным DIV элементом
    Указывайте ID будущего элемента и ID его родителя (для генерации внутри него)
*/

// Получение или создание предупреждения (правила).
export function getOrCreateRule(id) {
    let divRule= document.getElementById(id);
    if (divRule == null) {
        // Если предупреждения (правила) нет, генерируем новое
        divRule = document.createElement("div");
        divRule.id = id;
        divRule.classList.add(DIV_TEXT_ERROR_MESSAGE_STANDARD);
    }

    return divRule;
}

// Изменение статуса предупреждения (правила). Добавление/удаление элемента с родительского контейнера.
export function changeRuleStatus(divRuleElement, divRuleParentId, isRuleCorrect) {
    // Получаем родителя предупреждения (правила).
    let divRuleParent = document.getElementById(divRuleParentId);
    if (divRuleParent != null) {
        // Получаем старое предупреждение (правило).
        let oldDivRule = document.getElementById(divRuleElement.id);
        if (!isRuleCorrect && oldDivRule == null) {
            // Если предупреждения (правила) не было и правило не соблюдено, добавляем к родителю.
            divRuleParent.appendChild(divRuleElement);
        } else if (isRuleCorrect && oldDivRule != null) {
            // Если предупреждения (правила) есть, но правило соблюдено, удаляем.
            divRuleParent.removeChild(divRuleElement);
        }
    }
}

// Установка сообщения предупреждению (правилу).
export function setMessageInRule(divRuleElement, text) {
    if (divRuleElement != null) {
        if (text != null && text.length > 0) {
            divRuleElement.textContent = text;
        } else {
            divRuleElement.textContent = "Некорректный ввод.";
        }
    }
}