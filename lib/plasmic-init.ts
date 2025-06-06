import { initPlasmicLoader } from "@plasmicapp/loader-react";

export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: process.env.NEXT_PUBLIC_PLASMIC_PROJECT_ID || "dstores-default", 
      token: process.env.NEXT_PUBLIC_PLASMIC_PUBLIC_TOKEN || "default-token"
    }
  ],
  // Fetches the latest revisions, whether or not they were unpublished!
  // Disable for production to ensure you render only published changes.
  preview: process.env.NODE_ENV !== 'production',
});

// Register any custom code components here
// PLASMIC.registerComponent(MyCustomComponent, {
//   name: "MyCustomComponent", 
//   props: {
//     children: "slot",
//     className: "string"
//   }
// }); 