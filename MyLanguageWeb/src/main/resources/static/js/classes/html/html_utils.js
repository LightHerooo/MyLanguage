export class HtmlUtils {
    callEvent(htmlElement, eventName) {
        let event = new Event(eventName);
        htmlElement.dispatchEvent(event);
    }
}