import { defineField, defineType } from "sanity";

export const viewEvent = defineType({
  name: "viewEvent",
  title: "View Event",
  type: "document",
  fields: [
    defineField({
      name: "startup",
      type: "reference",
      to: { type: "startup" },
      readOnly: true,
    }),
  ],
});
