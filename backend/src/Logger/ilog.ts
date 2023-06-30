export default interface ILog {
    type: "CheckIn" | "CheckOut";
    name: string;
    lastname: string;
    position: string;
    contact: string;

    event_name: string;
    event_description: string;
    event_date: string;
    event_time: string;
    event_location: string;

    usage_aula: boolean;
    usage_stage: boolean;
    usage_backstage: boolean;
    usage_regie: boolean;
    usage_chairs: boolean;
    usage_mobile: boolean;

    checklist: {
        doorsClosed: boolean,
        emergencyDoorsClosed: boolean,
        lightsOff: boolean,
        backstageLightsOff: boolean,
        systemOff: boolean,
        lockesClosed: boolean,
    },
}