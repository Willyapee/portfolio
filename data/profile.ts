export type SocialIcon = "linkedin" | "whatsapp" | "instagram" | "gmail" | "github" | "cv" | "steam";

export type Social = {
  symbol: string;
  label: string;
  href: string;
  icon: SocialIcon;
  change: string;
  side: "left" | "right";
};

export const profile = {
  shortName: "WILLIAM A P",
  fullName: ["WILLIAM ASABHA", "PURNAMADJAJA"],
  role: "Full Stack Developer",
  tagline: "A person who loves making websites, software, and automation.",
  openToWork: true,
};

export const socials: Social[] = [
  { symbol: "$LNKD", label: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/in/william-purnamadjaja-21b13b325/", change: "+4.20%", side: "left" },
  { symbol: "$WA", label: "WhatsApp", icon: "whatsapp", href: "https://wa.me/6281217682424", change: "+1.85%", side: "left" },
  { symbol: "$IG", label: "Instagram", icon: "instagram", href: "https://www.instagram.com/william.purnamadjaja", change: "+2.71%", side: "left" },
  { symbol: "$MAIL", label: "Gmail", icon: "gmail", href: "mailto:william.apurnamadjaja@gmail.com", change: "+3.14%", side: "right" },
  { symbol: "$GH", label: "GitHub", icon: "github", href: "https://github.com/Willyapee", change: "+6.02%", side: "right" },
  { symbol: "$CV", label: "Resume", icon: "cv", href: "/cv.pdf", change: "+9.99%", side: "right" },
];

export const ticker = [
  "TYPESCRIPT", "REACT", "NEXT.JS", "NODE.JS", "PYTHON", "SQL", "TAILWIND", "AUTOMATION", "GIT", "REST API",
];

export const navItems = [
  { id: "about", label: "About" },
  { id: "skill", label: "Skill" },
  { id: "experience", label: "Experience" },
  { id: "project", label: "Project" },
  { id: "contact", label: "Contact" },
];

export const about = {
  kicker: "About · Asset profile",
  title: ["Who is", "Will?"],
  subtitle: "William Asabha Purnamadjaja — ticker $WAP",
  paragraphs: [
    "Hi, I'm William Asabha Purnamadjaja, also known as Will. I'm a third-year Informatics student at Universitas Multimedia Nusantara (UMN). I love making websites, software, and automation.",
    "Outside the code, I love working with people, sharing creativity, and turning ideas into things we build together.",
    "And when I'm not building something, you'll probably find me in a multiplayer game. Feel free to add me on [Steam].",
  ],
  steamUrl: "https://steamcommunity.com/id/your-steam-id",
};

export const stats = {
  ipk: 3.92,
  organization: 7,
  project: 12,
  competition: 2,
};
