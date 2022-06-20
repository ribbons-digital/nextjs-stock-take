import sanityClient from "@sanity/client";

export const sanity = sanityClient({
  apiVersion: "v2022-05-20",
  projectId: "j1gbmfk5",
  dataset: "production",
  useCdn: false,
  token: process.env.NEXT_PUBLIC_SANITY_STUDIO_TOKEN,
});
