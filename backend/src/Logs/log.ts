export default interface ILog {
    name: string;
    date: string;
    time: string;
    type: LogType;
    // CheckIn && CheckOut
    aulaClosed: boolean; // ob die Aula abgeschlossen wurde
    windowsClosed: boolean; // ob die Fenster geschlossen wurden
    regieClosed: boolean; // ob die Regie abgeschlossen wurde
    backStageClosed: boolean; // ob die Backstage abgeschlossen wurde
    beamerOff: boolean; // ob der Beamer ausgeschaltet wurde
    lightsOff: boolean; // ob das Licht ausgeschaltet wurde
    curtainOpen: boolean; // ob der Vorhang auf ist
    canvasOpen: boolean; // ob die Leinwand hochgefahren wurde
    mainOff: boolean; // ob der Hauptschalter ausgeschaltet wurde
    anlageOff: boolean; // ob die Anlage (IPad) ausgeschaltet wurde
    ipadPower: boolean; // IPad am Strom angeschlossen
    laptopPower: boolean; // Laptop am Strom angeschlossen
    cabelNice: boolean; // Kabel aufgeräumt
    aulaClean: boolean; // Aula aufgeräumt
    notes: string; // Notizen, Sonstiges
}

export interface IIssue {
    name: string;
    date: string;
    time: string;
    type: LogType;
    // Misstand
    text: string; // Beschreibung des Misstandes
    reason: string; // der Auslöser für den Misstand
    status: boolean; // ob der Misstand behoben wurde
}

type LogType = "CheckIn" | "CheckOut";
