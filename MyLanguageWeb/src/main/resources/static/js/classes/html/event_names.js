export class EventNames {
    BUTTON = new EventNamesButton();
    LABEL = new EventNamesLabel();
    A = new EventNamesA();
    SELECT = new EventNamesSelect();
    TEXTAREA = new EventNamesTextarea();
    FORM = new EventNamesForm();

    INPUT = new EventNamesInput();

    MOUSE = new EventNamesMouse();
    KEYBOARD = new EventNamesKeyboard();
}

// События для html элементов ---
class EventNamesButton {
    CLICK = "click";
}

class EventNamesLabel {
    CLICK = "click";
}

class EventNamesA {
    CLICK = "click";
}

class EventNamesSelect {
    CHANGE = "change";
}

class EventNamesTextarea {
    INPUT = "input";
}

class EventNamesForm {
    SUBMIT = "submit";
}
//---


// События для input элементов ---
class EventNamesInput {
    TEXT = new EventNamesInputText();
    PASSWORD = new EventNamesInputPassword();
    CHECKBOX = new EventNamesInputCheckbox();
    FILE = new EventNamesInputFile();
}

class EventNamesInputText {
    INPUT = "input";
}

class EventNamesInputPassword {
    INPUT = "input";
}

class EventNamesInputCheckbox {
    CHANGE = "change";
}

class EventNamesInputFile {
    CHANGE = "change";
}
//---

// События для клавиатуры и мыши ---
class EventNamesMouse {
    MOUSEOVER = "mouseover";
    MOUSEOUT = "mouseout";
}

class EventNamesKeyboard {
    KEYDOWN = "keydown";
}
//---