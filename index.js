import { parse } from "./pkg/markdown_parser.js";

const input = document.getElementById("input");
const output = document.getElementById("output");

function render() {
  output.innerHTML = parse(input.value);
}

input.addEventListener("input", render);
render();
