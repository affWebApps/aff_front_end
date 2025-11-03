export interface FormData {
  displayName: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  bioTagline: string;
  avatar: File | null;
  garmentTypes: string[];
  fabrics: string[];
  skills: string[];
  availability: boolean;
  pricingType: string;
  baseRate: string;
  currency: string;
  whatsIncluded: string;
  portfolioImages: File[];
} 
 
 export const garmentTypes = [
    "Blouse",
    "Shirts",
    "Polo Shirts",
    "Hoodies",
    "T-Shirts",
    "Sweatshirts",
    "Jackets",
    "Blazers",
    "Trousers",
    "Shorts",
    "Skirts",
    "Jumpsuits",
    "Cultural Attire",
    "Gowns",
    "Playsuits",
  ];

  export const fabricTypes = [
    "Cotton",
    "Linen",
    "Silk",
    "Wool",
    "Denim",
    "Velvet",
    "Organza",
    "Wax Print",
    "Aso-Oke",
    "Chiffon",
    "Krepe",
    "Satin",
    "Leather",
  ];

  export const skillCategories = [
    "Suits",
    "Dresses",
    "Traditional",
    "Embroidery",
    "Uniforms",
    "Casual Wear",
    "Outerwear",
    "Pants",
    "Corporate wear",
    "Children's Clothing",
    "Alterations",
  ];

  export const countryOptions = [
    { value: "Nigeria", label: "Nigeria" },
    { value: "Ghana", label: "Ghana" },
    { value: "Kenya", label: "Kenya" },
    { value: "South Africa", label: "South Africa" },
  ];

   export const pricingOptions = [
    { value: "per-garment", label: "Per garment" },
    { value: "hourly", label: "Hourly" },
  ];

   

    export interface FormDataClient {
      displayName: string;
      firstName: string;
      lastName: string;
      country: string;
      city: string;
      bioTagline: string;
      avatar: File | null;
      garmentTypes: string[];
      fabrics: string[];
    }

    export interface Role {
      id: string;
      title: string;
      description: string;
      image: string;
    }

    export const roles: Role[] = [
      {
        id: "client",
        title: "I'm a Client/Designer",
        description: "Create patterns, export production files.",
        image: "/images/client-designer.jpg",
      },
      {
        id: "tailor",
        title: "I'm a Tailor",
        description: "Get jobs, show your portfolio, get paid.",
        image: "/images/tailor.jpg",
      },
      {
        id: "both",
        title: "I'm Both",
        description: "Do both and switch anytime.",
        image: "/images/both.jpg",
      },
    ];

    export interface FormDataTailor {
      displayName: string;
      firstName: string;
      lastName: string;
      country: string;
      city: string;
      bioTagline: string;
      avatar: File | null;
      skills: string[];
      availability: boolean;
      pricingType: string;
      baseRate: string;
      currency: string;
      whatsIncluded: string;
      portfolioImages: File[];
    }