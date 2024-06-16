class ButtonTriggerWC extends HTMLElement {
  connectedCallback() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    const button = document.createElement("button");
    button.textContent = "Open";
    button.className = "open-stories-button";
    button.onclick = () =>
      this.dispatchEvent(
        new CustomEvent("openStoriesModal", { bubbles: true, composed: true })
      );
    shadowRoot.appendChild(button);

    const style = document.createElement("style");
    style.textContent = `
      .open-stories-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 10px 20px;
        background-color: #007bff;
        color: #fff;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      }
    `;
    shadowRoot.appendChild(style);
  }
}

customElements.define("cachai-stories-trigger", ButtonTriggerWC);

document.body.appendChild(document.createElement("cachai-stories-trigger"));
