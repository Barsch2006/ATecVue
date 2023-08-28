import { ObjectId } from "mongodb";
import { Checklist } from "./checklist";

export interface Use {
  item_id: string; // item code
  take: {
    time: number; // unix timestamp
    checklist: Checklist;
    user_id: ObjectId; // user id
  };
  back: {
    time: number; // unix timestamp
    checklist: Checklist;
  };
}
