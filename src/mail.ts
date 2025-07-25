import { fetchQRCode, createDownloadableQRCode } from './qr-service';

// E-Mail Link generieren
export const generateEmailQRCodeLink = (email: string, subject?: string, body?: string): string => {
    let link = `mailto:${email}`;
    const params = [];
    
    if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
    if (body) params.push(`body=${encodeURIComponent(body)}`);
    
    if (params.length > 0) {
        link += `?${params.join('&')}`;
    }
    
    return link;
};

// Prüfen ob Eingabe eine E-Mail-Adresse ist
export const isValidEmail = (input: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(input);
};

// Prüfen ob Eingabe eine URL ist
export const isValidURL = (input: string): boolean => {
    try {
        new URL(input);
        return true;
    } catch {
        return input.startsWith('http://') || input.startsWith('https://') || input.startsWith('www.');
    }
};

// QR-Code für Text/URL/E-Mail anzeigen
export const displayTextQRCode = async (data: string, container: HTMLElement) => {
    try {
        const qrCodeUrl = await fetchQRCode(data);
        
        if (qrCodeUrl) {
            let description = 'Text';
            if (isValidEmail(data)) {
                description = 'E-Mail';
            } else if (isValidURL(data)) {
                description = 'URL';
            }
            
            const filename = `qrcode-${description.toLowerCase()}.png`;
            
            container.innerHTML = `
                <img src="${qrCodeUrl}" alt="QR Code für ${description}" class="mb-2">
                <p>QR-Code für ${description}</p>
                <button class="download-btn" data-link="${data}" data-filename="${filename}">📥 QR-Code herunterladen</button>
            `;
            container.classList.add("qr-visible");
            
            // Download-Event hinzufügen
            const downloadBtn = container.querySelector('.download-btn') as HTMLButtonElement;
            downloadBtn.addEventListener('click', async () => {
                await createDownloadableQRCode(data, filename);
            });
        }
    } catch (error) {
        console.error("Fehler beim Anzeigen des QR-Codes:", error);
        container.innerHTML = `<p>Fehler beim Generieren des QR-Codes</p>`;
    }
};

// E-Mail QR-Code mit benutzerdefinierten Parametern erstellen
export const displayEmailQRCode = async (email: string, subject: string, body: string, container: HTMLElement) => {
    const emailLink = generateEmailQRCodeLink(email, subject, body);
    await displayTextQRCode(emailLink, container);
};
