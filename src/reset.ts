//Zürücksetzen der Anwendung
export const resetApplication = (
    inputText: HTMLInputElement,
    phoneButtons: HTMLDivElement,
    generateTextQRBtn: HTMLButtonElement,
    qrCodeContainer: HTMLDivElement,
    resetBtn: HTMLButtonElement
) => {
    inputText.value = "";
    phoneButtons.classList.add("hidden");
    generateTextQRBtn.classList.add("hidden");
    qrCodeContainer.innerHTML = "";
    resetBtn.classList.add("hidden");
    qrCodeContainer.classList.remove("qr-visible");
};