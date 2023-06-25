export default interface ILog {
    date: string;
    time: string;
    name: string;
    type: "Nutzung" | "Misstand" | "Sonstiges";
    text: string;
}