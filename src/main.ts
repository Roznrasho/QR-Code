import './style.css';
import { isValidPhoneNumber, cleanPhoneNumber, displayPhoneQRCode } from './phone';
import { displayTextQRCode } from './mail';
import { resetApplication } from './reset';

const inputText = document.getElementById("inputText") as HTMLInputElement;
const whatsappBtn = document.getElementById("whatsappBtn") as HTMLButtonElement;
const callBtn = document.getElementById("callBtn") as HTMLButtonElement;
const generateTextQRBtn = document.getElementById("generateTextQRBtn") as HTMLButtonElement;
const qrCodeContainer = document.getElementById("qrCodeContainer") as HTMLDivElement;
const phoneButtons = document.getElementById("phoneButtons") as HTMLDivElement;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;

// Buttons je nach Eingabetyp anzeigen
inputText.addEventListener("input", () => {
    const inputValue = inputText.value.trim();

    // Wenn die Telefonnummer gültig ist, zeige die Telefon-Buttons an
    if (isValidPhoneNumber(inputValue)) {
        phoneButtons.classList.remove("hidden");
        generateTextQRBtn.classList.add("hidden");
    // Wenn der Eingabewert länger als 0 Zeichen ist, zeige den Text-QR-Code-Button an
    } else if (inputValue.length > 0) {
        phoneButtons.classList.add("hidden");
        generateTextQRBtn.classList.remove("hidden");
    // Wenn der Eingabewert leer ist, verstecke alle Buttons
    } else {
        phoneButtons.classList.add("hidden");
        generateTextQRBtn.classList.add("hidden");
    }
    
    // Zeige den Reset-Button an, wenn eine Eingabe erfolgt
    if (inputValue.length > 0) {
        resetBtn.classList.remove("hidden");
    } else {
        resetBtn.classList.add("hidden");
    }
});

// WhatsApp Button
whatsappBtn.addEventListener("click", () => {
    const phoneNumber = cleanPhoneNumber(inputText.value.trim());
    if (!phoneNumber) return;
    displayPhoneQRCode(phoneNumber, true, qrCodeContainer);
});

// Anruf Button
callBtn.addEventListener("click", () => {
    const phoneNumber = cleanPhoneNumber(inputText.value.trim());
    if (!phoneNumber) return;
    displayPhoneQRCode(phoneNumber, false, qrCodeContainer);
});

// QR-Code für URL/Text/E-Mail
generateTextQRBtn.addEventListener("click", () => {
    const inputValue = inputText.value.trim();
    if (!inputValue) return;
    displayTextQRCode(inputValue, qrCodeContainer);
});

// Zurücksetzen Button
resetBtn.addEventListener("click", () => {
    resetApplication(inputText, phoneButtons, generateTextQRBtn, qrCodeContainer, resetBtn);
});
