// Convert to sarcastic case
function convertToSarcastic() {
  const input = document.getElementById('inputText').value;
  let result = '';

  for (let i = 0; i < input.length; i++) {
    result += i % 2 === 0
      ? input[i].toLowerCase()
      : input[i].toUpperCase();
  }

  const outputField = document.getElementById('outputText');
  outputField.value = result;

  updateTextColor();
}

// Update text color
function updateTextColor() {
  const color = document.getElementById('colorPicker').value;
  document.getElementById('outputText').style.color = color;
}

// Copy to clipboard
function copyToClipboard() {
  const output = document.getElementById('outputText');
  output.select();
  output.setSelectionRange(0, 99999); // Mobile compatibility

  navigator.clipboard.writeText(output.value)
    .then(() => alert("Copied to clipboard!"))
    .catch(() => alert("Failed to copy."));
}

// Event listeners
document.getElementById('convertBtn').addEventListener('click', convertToSarcastic);
document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
document.getElementById('colorPicker').addEventListener('change', updateTextColor);
