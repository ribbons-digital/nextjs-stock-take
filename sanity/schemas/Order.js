export default {
  name: "order",
  type: "document",
  title: "Order",
  fields: [
    {
      name: "orderNumber",
      title: "Order Number",
      type: "string",
    },
    {
      name: "orderedItems",
      title: "Ordered Items",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "orderedItem",
              type: "reference",
              title: "Ordered Item",
              to: [{ type: "product" }],
            },
            {
              name: "quantity",
              type: "number",
              title: "Quantity",
            },
            {
              name: "note",
              type: "string",
              title: "Note",
            },
          ],
        },
      ],
    },

    {
      name: "date",
      type: "date",
      title: "Date",
    },
  ],
};
