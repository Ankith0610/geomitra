import { getSiteConfig } from "./site-config.js";

function renderInstructions(instructions) {
    const list = document.getElementById("instructionsList");

    if (!list) {
        return;
    }

    list.innerHTML = "";

    instructions.forEach((instruction, index) => {
        const item = document.createElement("li");
        const prefix = document.createElement("strong");
        prefix.textContent = `${index + 1}. `;
        item.appendChild(prefix);
        item.appendChild(document.createTextNode(instruction));
        list.appendChild(item);
    });
}

try {
    const config = await getSiteConfig();
    renderInstructions(config.instructions);
} catch (error) {
    console.error("Unable to load dynamic instructions:", error);
}
