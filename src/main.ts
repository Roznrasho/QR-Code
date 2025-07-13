import './style.css';
import { isValidPhoneNumber, cleanPhoneNumber, displayPhoneQRCode } from './phone';
import { displayTextQRCode } from './mail';
import { fetchQRCode } from './qr-service';

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
    inputText.value = "";
    phoneButtons.classList.add("hidden");
    generateTextQRBtn.classList.add("hidden");
    qrCodeContainer.innerHTML = "";
    resetBtn.classList.add("hidden");
    qrCodeContainer.classList.remove("qr-visible");
});

// QR-Code anzeigen mit Animation
const displayQRCode = async (data: string) => {
    // Abrufen der QR-Code-URL
    const qrCodeUrl = await fetchQRCode(data);
    
    // Wenn die QR-Code-URL vorhanden ist
    if (qrCodeUrl) {
        // Einfügen des QR-Codes und des Download-Links in den Container
        qrCodeContainer.innerHTML = `
            <img src="${qrCodeUrl}" alt="QR Code" class="mb-2">
            <a href="${qrCodeUrl}" download="qrcode.png" class="text-white underline">📥 QR-Code herunterladen</a>
        `;
        // Hinzufügen der Animation zum QR-Code-Container
        qrCodeContainer.classList.add("qr-visible");
    }
};

// Hilfsfunktion zum Generieren des QR-Code-Links für WhatsApp oder Anruf
function generateQRCodeLink(phoneNumber: string, isWhatsApp: boolean): string {
    if (isWhatsApp) {
        // WhatsApp-Link
        return `https://wa.me/${phoneNumber}`;
    } else {
        // Tel-Link für Anruf
        return `tel:${phoneNumber}`;
    }
}


// WhatsApp Button
whatsappBtn.addEventListener("click", () => {
    const phoneNumber = inputText.value.trim().replace(/\D/g, ""); // Telefonnummer bereinigen
    if (!phoneNumber) return; // Wenn keine Telefonnummer vorhanden ist, nichts tun
    displayQRCode(generateQRCodeLink(phoneNumber, true)); // QR-Code für WhatsApp-Link anzeigen
});

// Anruf Button
callBtn.addEventListener("click", () => { // Event Listener für den Klick auf den Anruf-Button
    const phoneNumber = inputText.value.trim().replace(/\D/g, ""); // Telefonnummer bereinigen, indem alle nicht-numerischen Zeichen entfernt werden
    if (!phoneNumber) return; // Wenn keine Telefonnummer vorhanden ist, nichts tun
    displayQRCode(generateQRCodeLink(phoneNumber, false)); // QR-Code für Anruf-Link anzeigen
});

// QR-Code für URL/Text
generateTextQRBtn.addEventListener("click", () => { // Event Listener für den Klick auf den Text-QR-Code-Button
    const inputValue = inputText.value.trim(); // Eingabewert bereinigen, indem führende und nachfolgende Leerzeichen entfernt werden
    if (!inputValue) return; // Wenn kein Eingabewert vorhanden ist, nichts tun
    displayQRCode(inputValue); // QR-Code für den Eingabewert anzeigen
});

// Zurücksetzen Button
resetBtn.addEventListener("click", () => {
    inputText.value = "";
    phoneButtons.classList.add("hidden");
    generateTextQRBtn.classList.add("hidden");
    qrCodeContainer.innerHTML = "";
    resetBtn.classList.add("hidden");
    qrCodeContainer.classList.remove("qr-visible"); // Entfernt Animation
});
