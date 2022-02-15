const ClassName = "mmm-cherry";

const HTML = `
<div>
    <div>
        <img src="./assets/cherry.svg" />
    </div>
    <div>
        <span>Hallo,</span>
        <span>Cherry!</span>
    </div>
</div>
`;


class Cherry extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = HTML;
    }
}

window.customElements.define(ClassName, Cherry);