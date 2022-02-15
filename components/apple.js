const ClassName = "mmm-apple";

const HTML = `
    <div>
        <span>Hallo,</span>
        <span>Apple!</span>
        <img src="./assets/banana1.jpg" />
    </div>
`;


class Banana extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = HTML;
    }
}

window.customElements.define(ClassName, Apple);