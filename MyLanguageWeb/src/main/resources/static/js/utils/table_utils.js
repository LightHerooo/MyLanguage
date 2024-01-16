export function setMessageInsideTable(tableHeadElement, tableBodyElement, message, doesTableClear) {
    if (doesTableClear === true) {
        tableBodyElement.replaceChildren();
    }

    let trTableHead = tableHeadElement.children.item(0);
    if (trTableHead != null) {
        let trMessage = document.createElement("tr");
        let tdMessage = document.createElement("td");
        tdMessage.colSpan = trTableHead.childElementCount;
        tdMessage.style.textAlign = "center";
        tdMessage.textContent = message;

        trMessage.appendChild(tdMessage);
        tableBodyElement.appendChild(trMessage);
    }
}

export function findInTableWithTimers(timerWaiterObject, timerFinderObject, functionWaiter, functionFinder) {
    clearTimeout(timerWaiterObject.id);
    clearTimeout(timerFinderObject.id);
    timerWaiterObject.id = setTimeout(function () {
        functionWaiter();
        timerFinderObject.id = setTimeout(functionFinder, 500);
    }, 500);
}