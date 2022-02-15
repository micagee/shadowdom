const ClassName = "mmm-pear";

const HTML = `
<div>
    <div>
        <img src="./assets/banana1.jpg" />
    </div>
    <div>
        <span>Hallo,</span>
        <span>Pear!</span>
    </div>
</div>
`;


class Pear extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = HTML;
    }
}

window.customElements.define(ClassName, Pear);