const ClassName = "mmm-plum";

const HTML = `
    <div>
        <span>Hallo,</span>
        <span>Plum!</span>
    </div>
`;


class Plum extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = HTML;
    }
}

window.customElements.define(ClassName, Plum);