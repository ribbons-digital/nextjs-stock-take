export default {
  name: "item",
  type: "document",
  title: "Item",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "quantity",
      type: "number",
      title: "Quantity",
    },
    {
      name: "cost",
      type: "number",
      title: "Cost",
    },
    {
      name: "inProduct",
      type: "array",
      title: "In Product",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
    },
  ],
};
