import { ObjectId } from "mongodb";

interface IEvent {
    // event id
    _id?: ObjectId;
    // creator info
    name: string;
    lastname: string;
    email: string;
    position: string;
    // event info
    title: string;
    description: string;
    targetgroup: string;
    date: string;
    start: string;
    end: string;
    location: string;
    // material info
    microphones: string;
    headsets: string;
    beamer: boolean;
    hdmi: boolean;
    vga: boolean;
    usb: boolean;
    // special info
    notes?: string;

    // backend info
    discordMessageId?: string;
    participantIds?: ObjectId[]; // the mongodb ids of the participants
}

export default IEvent;
