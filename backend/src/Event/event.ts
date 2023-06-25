import { ObjectId } from "mongodb";

interface IEvent {
    // creator info
    name: string;
    lastname: string;
    email: string;
    position: string;
    // event info
    title: string;
    description: string;
    targetgroup: string;
    start: number;
    end: number;
    location: string;
    // material info
    microphones: number;
    headsets: number;
    beamer: boolean;
    hdmi: boolean;
    vga: boolean;
    usb: boolean;
    // special info
    notes?: string;

    // backend info
    discordMessageId?: string;
    discordThreadId?: string;
    participants?: ObjectId[]; // the mongodb ids of the participants
}

export default IEvent;
