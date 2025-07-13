// QR-Code abrufen
export const fetchQRCode = async (data: string): Promise<string> => {
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

// QR-Code als downloadbaren Blob erstellen
export const createDownloadableQRCode = async (data: string, filename: string = 'qrcode.png'): Promise<string> => {
    try {
        const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
        const response = await fetch(apiUrl);
        
        if (!response.ok) throw new Error("Fehler beim Abrufen des QR-Codes");
        
        // Bild als Blob herunterladen
        const blob = await response.blob();
        
        // Blob-URL erstellen
        const blobUrl = URL.createObjectURL(blob);
        
        // Download-Link erstellen und automatisch klicken
        const downloadLink = document.createElement('a');
        downloadLink.href = blobUrl;
        downloadLink.download = filename;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        // Blob-URL nach kurzer Zeit freigeben
        setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
        
        return apiUrl; // Für die Anzeige zurückgeben
    } catch (error) {
        console.error("Fehler beim Download:", error);
        return "";
    }
};
