import { META } from "../../../components/ui/meta.ts";

import { EXTENDED_COMPONENTS } from "./extended-catalog.ts";

export const SANDBOX_COMPONENTS = [
  {
    id: "colors",
    title: "Colors",
    caption: "The five shared colors with hex labels.",
  },
  ...EXTENDED_COMPONENTS,
  ...META.map(({ id, title, caption }) => ({ id, title, caption })),
  {
    id: "callout",
    title: "Callout",
    caption: "Highlighted messages with semantic tones and clear headings.",
  },
  {
    id: "buttons",
    title: "Buttons",
    caption: "Variants, extra-small/small sizes, and disabled/loading states.",
  },
  {
    id: "inputs",
    title: "Inputs",
    caption: "Labeled fields with validation and disabled states.",
  },
  {
    id: "badges",
    title: "Badges",
    caption: "Custom labels and semantic tones, plus project status indicators.",
  },
  {
    id: "notices",
    title: "Notices",
    caption: "Success, information, and recoverable errors.",
  },
  {
    id: "dialog",
    title: "Dialog",
    caption: "A focus-managed overlay with the shared project form.",
  },
  {
    id: "switches",
    title: "Switches",
    caption: "Accessible toggles for boolean preferences.",
  },
  {
    id: "tabs",
    title: "Tabs",
    caption: "Keyboard navigation between related views.",
  },
  {
    id: "data-states",
    title: "Data States",
    caption: "Loading, empty, unavailable, and retry states.",
  },
].sort((a, b) => a.title.localeCompare(b.title, "en"));
