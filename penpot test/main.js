const generateBtn = document.getElementById("generate-btn");
const output = document.getElementById("output");

generateBtn.addEventListener("click", () => {
  parent.postMessage({ pluginMessage: { type: "get-selection" } }, "*");
});

window.addEventListener("message", async (event) => {
  const message = event.data.pluginMessage;
  if (message && message.type === "selection-data") {
    const vueCode = generateVueComponent(message.selection);
    output.textContent = vueCode;
  }
});

function generateVueComponent(selection) {
  if (!selection || selection.length === 0) return "// No selection";

  const node = selection[0];

  const template = (node.children || []).map(child => {
    if (child.type === "text") {
      return `<p style="color: ${child.fills?.[0]?.color || '#000'}">${child.characters}</p>`;
    } else if (child.type === "rect") {
      return `<div style="width:${child.width}px;height:${child.height}px;background:${child.fills?.[0]?.color || '#ccc'}"></div>`;
    }
    return "<!-- unsupported node -->";
  }).join("\n");

  return `<template>
  <div class="generated-component">
    ${template}
  </div>
</template>

<script setup>
</script>

<style scoped>
.generated-component {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>`;
}