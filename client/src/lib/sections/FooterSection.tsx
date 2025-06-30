import { Section, Component, Element } from "@shared/schema";
import { cn } from "@/lib/utils";
import ComponentControls from "../controls/ComponentControls";

interface FooterSectionProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  selectedElementId: string | null;
  onSelectElement: (elementId: string | null) => void;
}

export default function FooterSection({
  section,
  onUpdate,
  selectedElementId,
  onSelectElement,
}: FooterSectionProps) {
  // Find the footer component
  const footerComponent = section.components.find(
    (component) => component.type === "Footer"
  );

  if (!footerComponent) {
    return (
      <div className="p-8 text-center bg-gray-800 text-white">
        <h3 className="text-lg font-medium mb-2">Footer Section</h3>
        <p className="text-gray-300 mb-4">No footer component found</p>
        {section.editable !== "locked-components" && (
          <button
            className="px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 transition-colors"
            onClick={() => {
              // Add a default footer component
              const newComponent: Component = {
                id: Date.now(),
                type: "Footer",
                editable: "editable",
                elements: [
                  {
                    id: Date.now() + 1,
                    type: "Logo",
                    properties: {
                      text: "StoreFront",
                      logoUrl: "",
                    },
                  },
                  {
                    id: Date.now() + 2,
                    type: "Text",
                    properties: {
                      text: "Quality products for your everyday needs. Fast shipping and excellent customer service.",
                    },
                  },
                  {
                    id: Date.now() + 3,
                    type: "Links",
                    properties: {
                      title: "Quick Links",
                      links: [
                        { text: "Home", url: "#" },
                        { text: "Products", url: "#" },
                        { text: "About Us", url: "#" },
                        { text: "Contact", url: "#" },
                      ],
                    },
                  },
                  {
                    id: Date.now() + 4,
                    type: "Links",
                    properties: {
                      title: "Customer Service",
                      links: [
                        { text: "FAQ", url: "#" },
                        { text: "Shipping Policy", url: "#" },
                        { text: "Returns & Refunds", url: "#" },
                        { text: "Privacy Policy", url: "#" },
                      ],
                    },
                  },
                  {
                    id: Date.now() + 5,
                    type: "SocialLinks",
                    properties: {
                      title: "Connect With Us",
                      links: [
                        { platform: "facebook", url: "#" },
                        { platform: "twitter", url: "#" },
                        { platform: "instagram", url: "#" },
                        { platform: "linkedin", url: "#" },
                      ],
                    },
                  },
                  {
                    id: Date.now() + 6,
                    type: "Copyright",
                    properties: {
                      text: "© 2023 StoreFront. All rights reserved.",
                    },
                  },
                ],
              };

              onUpdate({
                ...section,
                components: [...section.components, newComponent],
              });
            }}
          >
            Add Footer Component
          </button>
        )}
      </div>
    );
  }

  // Get elements from the footer component
  const logo = footerComponent.elements.find((el) => el.type === "Logo");
  const description = footerComponent.elements.find(
    (el) => el.type === "Text"
  );
  const quickLinks = footerComponent.elements.find(
    (el) => el.type === "Links" && el.properties?.title === "Quick Links"
  );
  const customerService = footerComponent.elements.find(
    (el) => el.type === "Links" && el.properties?.title === "Customer Service"
  );
  const socialLinks = footerComponent.elements.find(
    (el) => el.type === "SocialLinks"
  );
  const copyright = footerComponent.elements.find(
    (el) => el.type === "Copyright"
  );

  return (
    <div
      className={cn(
        "relative",
        selectedElementId === `component-${section.id}-${footerComponent.id}` &&
          "outline outline-2 outline-blue-400"
      )}
      onClick={(e) => {
        e.stopPropagation();
        onSelectElement(`component-${section.id}-${footerComponent.id}`);
      }}
    >
      {/* Component toolbar */}
      {section.editable !== "locked-edit" && footerComponent.editable !== "locked-edit" && (
        <ComponentControls
          component={footerComponent}
          section={section}
          onUpdate={(updatedComponent) => {
            const updatedComponents = section.components.map((comp) =>
              comp.id === footerComponent.id ? updatedComponent : comp
            );
            onUpdate({
              ...section,
              components: updatedComponents,
            });
          }}
          isLocked={section.editable === "locked-components" || footerComponent.editable === "locked-replacing"}
        />
      )}

      <footer className="bg-gray-800 text-white py-10 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">
              {logo?.properties?.text || "StoreFront"}
            </h3>
            <p className="text-gray-400 text-sm">
              {description?.properties?.text ||
                "Quality products for your everyday needs. Fast shipping and excellent customer service."}
            </p>
          </div>

          <div>
            <h4 className="font-medium mb-4">
              {quickLinks?.properties?.title || "Quick Links"}
            </h4>
            <ul className="space-y-2 text-gray-400">
              {quickLinks?.properties?.links?.map(
                (link: { text: string; url: string }, index: number) => (
                  <li key={index}>
                    <a href={link.url} className="hover:text-white">
                      {link.text}
                    </a>
                  </li>
                )
              ) || (
                <>
                  <li>
                    <a href="#" className="hover:text-white">
                      Home
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Products
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      About Us
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contact
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">
              {customerService?.properties?.title || "Customer Service"}
            </h4>
            <ul className="space-y-2 text-gray-400">
              {customerService?.properties?.links?.map(
                (link: { text: string; url: string }, index: number) => (
                  <li key={index}>
                    <a href={link.url} className="hover:text-white">
                      {link.text}
                    </a>
                  </li>
                )
              ) || (
                <>
                  <li>
                    <a href="#" className="hover:text-white">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Shipping Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Returns & Refunds
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">
              {socialLinks?.properties?.title || "Connect With Us"}
            </h4>
            <div className="flex space-x-4 mb-4">
              {socialLinks?.properties?.links?.map(
                (
                  link: { platform: string; url: string },
                  index: number
                ) => (
                  <a
                    key={index}
                    href={link.url}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 0C4.477 0 0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.879V12.89h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.989C16.343 19.129 20 14.99 20 10c0-5.523-4.477-10-10-10z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                )
              ) || (
                <>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.002 4.872A5.12 5.12 0 0 0 4.876 10a5.12 5.12 0 0 0 5.126 5.128A5.12 5.12 0 0 0 15.13 10a5.12 5.12 0 0 0-5.127-5.128zm0 8.462A3.34 3.34 0 0 1 6.67 10a3.337 3.337 0 0 1 3.333-3.334A3.337 3.337 0 0 1 13.335 10a3.34 3.34 0 0 1-3.333 3.334zm6.532-8.671c0 .664-.535 1.196-1.195 1.196a1.196 1.196 0 1 1 1.196-1.196zm3.396 1.213c-.076-1.602-.442-3.02-1.615-4.19C17.145.516 15.727.15 14.125.07c-1.65-.093-6.6-.093-8.25 0-1.597.076-3.016.442-4.19 1.611C.51 2.851.151 4.27.07 5.871c-.093 1.652-.093 6.601 0 8.253.076 1.602.442 3.02 1.615 4.19 1.174 1.17 2.588 1.535 4.19 1.616 1.65.093 6.6.093 8.25 0 1.602-.076 3.02-.442 4.19-1.616 1.169-1.17 1.534-2.588 1.615-4.19.093-1.652.093-6.596 0-8.248zm-2.133 10.02a3.375 3.375 0 0 1-1.9 1.9c-1.316.523-4.44.402-5.896.402-1.457 0-4.585.116-5.896-.402a3.375 3.375 0 0 1-1.9-1.9c-.523-1.316-.402-4.44-.402-5.896 0-1.457-.116-4.585.402-5.896a3.375 3.375 0 0 1 1.9-1.9c1.316-.523 4.44-.402 5.896-.402 1.457 0 4.585-.116 5.896.402a3.375 3.375 0 0 1 1.9 1.9c.523 1.316.402 4.44.402 5.896 0 1.457.121 4.585-.402 5.896z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-400 hover:text-white">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.78 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" />
                    </svg>
                  </a>
                </>
              )}
            </div>
            <p className="text-gray-400 text-sm">
              Sign up for our newsletter to receive updates and special offers.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          {copyright?.properties?.text || "© 2023 StoreFront. All rights reserved."}
        </div>
      </footer>
    </div>
  );
}
