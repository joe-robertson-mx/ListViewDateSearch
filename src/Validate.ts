import { ReactChild, createElement } from "react";

export class Validate {
    static validateProps(): ReactChild {

        const errorMessages: string[] = [];
        if (errorMessages.length) {
            return createElement("div", {},
                "Configuration error in widget:",
                errorMessages.map((message, key) => createElement("p", { key }, message))
            );
        }

        return "";
    }
}
