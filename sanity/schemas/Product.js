export default {
  name: "product",
  type: "document",
  title: "Product",
  fields: [
    {
      name: "name",
      type: "string",
      title: "Name",
    },
    {
      name: "orders",
      type: "array",
      title: "Orders",
      of: [
        {
          type: "reference",
          to: [{ type: "order" }],
        },
      ],
    },
    {
      name: "items",
      type: "array",
      title: "Items",
      of: [
        {
          type: "reference",
          to: [{ type: "item" }],
        },
      ],
    },
  ],
};
