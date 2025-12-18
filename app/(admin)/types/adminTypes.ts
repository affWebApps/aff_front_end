export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  dateJoined: string;
  status: "Active" | "Inactive";
  image: string;
  contact?: string;
  location?: string;
  bio?: string;
  availability?: {
    weekdays: string;
    weekend: string;
  };
  activitySummary?: {
    projectsPosted: number;
    projectsCompleted: number;
    productsListed: number;
    productsSold: number;
  };
  rating?: number;
}

export interface Project {
  id: number;
  title: string;
  clientName: string;
  tailorAssigned: string;
  amount: string;
  deadline: string;
  status: "Completed" | "In Progress" | "Cancelled";
  description?: string;
  requiredSkills?: string[];
  progress?: number;
  milestones?: string;
  clientRating?: number;
  tailorRating?: number;
}
