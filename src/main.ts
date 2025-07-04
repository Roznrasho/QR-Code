import './style.css'
const inputText = document.getElementById("inputText") as HTMLInputElement;
const whatsappBtn = document.getElementById("whatsappBtn") as HTMLButtonElement;
const callBtn = document.getElementById("callBtn") as HTMLButtonElement;
const generateTextQRBtn = document.getElementById("generateTextQRBtn") as HTMLButtonElement;
const qrCodeContainer = document.getElementById("qrCodeContainer") as HTMLDivElement;
const phoneButtons = document.getElementById("phoneButtons") as HTMLDivElement;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement;

// QR-Code Link generieren (Telefonnummer)
const generateQRCodeLink = (phoneNumber: string, useWhatsApp: boolean): string => {
    // Wenn useWhatsApp true ist, generiere einen WhatsApp-Link, ansonsten einen Telefon-Link
    return useWhatsApp ? `https://wa.me/${phoneNumber}` : `tel:${phoneNumber}`;
};

// QR-Code abrufen
const fetchQRCode = async (data: string): Promise<string> => {
    try {
        // API-URL für den QR-Code-Generator mit den übergebenen Daten
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
        // Abrufen des QR-Codes von der API
        const response = await fetch(apiUrl);
        // Wenn die Antwort nicht OK ist, eine Fehlermeldung werfen
        if (!response.ok) throw new Error("Fehler beim Abrufen des QR-Codes");
        // Rückgabe der API-URL
        return apiUrl;
    } catch (error) {
        // Fehler im Fehlerfall in der Konsole ausgeben
        console.error("Fehler:", error);
        // Rückgabe eines leeren Strings im Fehlerfall
        return "";
    }
};

// Buttons je nach Eingabetyp anzeigen
inputText.addEventListener("input", () => {
    // Bereinigen des Eingabewerts
    const inputValue = inputText.value.trim();
    // Entfernen aller nicht-numerischen Zeichen aus dem Eingabewert
    const phoneNumber = inputValue.replace(/\D/g, "");

    // Wenn die Telefonnummer mindestens 5 Zeichen lang ist, zeige die Telefon-Buttons an
    if (phoneNumber.length >= 5) {
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
