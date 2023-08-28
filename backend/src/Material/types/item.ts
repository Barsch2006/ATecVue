import { Checklist } from "./checklist";

export type ItemCondition = "fine" | "defect" | "broken";

export default interface IItem {
  name: string;
  condition: ItemCondition;
  take_checklist: Checklist;
  back_checklist: Checklist;
  location: string;
}
