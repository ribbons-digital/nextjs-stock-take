import type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
} from "sanity-codegen";

export type {
  SanityReference,
  SanityKeyedReference,
  SanityAsset,
  SanityImage,
  SanityFile,
  SanityGeoPoint,
  SanityBlock,
  SanityDocument,
  SanityImageCrop,
  SanityImageHotspot,
  SanityKeyed,
  SanityImageAsset,
  SanityImageMetadata,
  SanityImageDimensions,
  SanityImagePalette,
  SanityImagePaletteSwatch,
};

/**
 * Product
 *
 *
 */
export interface Product extends SanityDocument {
  _type: "product";

  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Orders — `array`
   *
   *
   */
  orders?: Array<SanityKeyedReference<Order>>;

  /**
   * Items — `array`
   *
   *
   */
  items?: Array<SanityKeyedReference<Item>>;
}

/**
 * Item
 *
 *
 */
export interface Item extends SanityDocument {
  _type: "item";

  /**
   * Name — `string`
   *
   *
   */
  name?: string;

  /**
   * Quantity — `number`
   *
   *
   */
  quantity?: number;

  /**
   * Cost — `number`
   *
   *
   */
  cost?: number;

  /**
   * In Product — `array`
   *
   *
   */
  inProduct?: Array<SanityKeyedReference<Product>>;
}

/**
 * Order
 *
 *
 */
export interface Order extends SanityDocument {
  _type: "order";

  /**
   * Order Number — `string`
   *
   *
   */
  orderNumber?: string;

  /**
   * Ordered Items — `array`
   *
   *
   */
  orderedItems?: Array<
    SanityKeyed<{
      /**
       * Ordered Item — `reference`
       *
       *
       */
      orderedItem?: SanityReference<Product>;

      /**
       * Quantity — `number`
       *
       *
       */
      quantity?: number;

      /**
       * Note — `string`
       *
       *
       */
      note?: string;
    }>
  >;

  /**
   * Date — `date`
   *
   *
   */
  date?: string;
}

export type Documents = Product | Item | Order;
