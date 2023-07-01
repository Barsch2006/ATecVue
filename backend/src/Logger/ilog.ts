export default interface ILog {
    type: "CheckIn" | "CheckOut",
    technician: {
        name: "",
        position: "",
        contact: "",
    },
    eventinfo: {
        name: "",
        description: "",
        date: "",
        time: "",
        location: "",
        url: ""
    },
    usage: {
        // anlage
        regie: false,
        mobile: false,
        // bühne
        stage: false,
        backstage: false,
        // stühle und tische
        chairs: false,
        tables: false,
        elements: false
    },
    checklist: {
        doorsClosed: false,
        emergencyDoorsClosed: false,
        regieClosed: false,
        lightsOff: false,
        beamerOff: false,
        clear: false,
        regie: false,
        powerOn: false,
        powerOff: false,
        stage: false,
        backstage: false,
        chairs: false,
        tables: false,
    },
    issues: "",
}
