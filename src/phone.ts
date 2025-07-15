import { fetchQRCode, createDownloadableQRCode } from './qr-service';

// QR-Code Link generieren (Telefonnummer)
export const generatePhoneQRCodeLink = (phoneNumber: string, useWhatsApp: boolean): string => {
    // Wenn useWhatsApp true ist, generiere einen WhatsApp-Link, ansonsten einen Telefon-Link
    return useWhatsApp ? `https://wa.me/${phoneNumber}` : `tel:${phoneNumber}`;
};

// Telefonnummer validieren und bereinigen
export const cleanPhoneNumber = (input: string): string => {
    return input.replace(/\D/g, "");
};

// Prüfen ob Eingabe eine gültige Telefonnummer ist
export const isValidPhoneNumber = (input: string): boolean => {
    const cleanNumber = cleanPhoneNumber(input);
    return cleanNumber.length >= 5;
};

// QR-Code für Telefonnummer anzeigen
export const displayPhoneQRCode = async (phoneNumber: string, useWhatsApp: boolean, container: HTMLElement) => {
    try {
        const link = generatePhoneQRCodeLink(phoneNumber, useWhatsApp);
        const qrCodeUrl = await fetchQRCode(link);
        
        if (qrCodeUrl) {
            const linkType = useWhatsApp ? 'WhatsApp' : 'Anruf';
            const filename = `qrcode-${linkType.toLowerCase()}-${phoneNumber}.png`;
            
            container.innerHTML = `
                <img src="${qrCodeUrl}" alt="QR Code für ${linkType}" class="mb-2">
                <p>QR-Code für ${linkType}</p>
                <button class="download-btn" data-link="${link}" data-filename="${filename}">📥 QR-Code herunterladen</button>
            `;
            container.classList.add("qr-visible");
            
            // Download-Event hinzufügen
            const downloadBtn = container.querySelector('.download-btn') as HTMLButtonElement;
            downloadBtn.addEventListener('click', async () => {
                await createDownloadableQRCode(link, filename);
            });
        }
    } catch (error) {
        console.error("Fehler beim Anzeigen des QR-Codes:", error);
        container.innerHTML = `<p>Fehler beim Generieren des QR-Codes</p>`;
    }
};
