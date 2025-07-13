// Inline QR-Code Service um Import-Probleme zu vermeiden
const fetchQRCode = async (data: string): Promise<string> => {
    try {
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Fehler beim Abrufen des QR-Codes");
        return apiUrl;
    } catch (error) {
        console.error("Fehler:", error);
        return "";
    }
};

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
            
            container.innerHTML = `
                <img src="${qrCodeUrl}" alt="QR Code für ${description}" class="mb-2">
                <p>QR-Code für ${description}: ${data}</p>
                <a href="${qrCodeUrl}" download="qrcode-${description.toLowerCase()}.png" class="text-white underline">📥 QR-Code herunterladen</a>
            `;
            container.classList.add("qr-visible");
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
