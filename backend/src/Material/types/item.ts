import { Checklist } from "./checklist";

export type ItemCondition = "fine" | "defect" | "broken";

export type ItemCategory = "cabel" | "adapter" | "sound" | "light" | "other";

export default interface IItem {
  name: string;
  condition: ItemCondition;
  take_checklist: Checklist;
  back_checklist: Checklist;
  location: string;
  category: ItemCategory;
}
