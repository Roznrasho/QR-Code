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
