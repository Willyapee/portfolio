import { FaFileArrowDown, FaGithub, FaInstagram, FaLinkedinIn, FaSteam, FaWhatsapp } from "react-icons/fa6";
import { SiGmail } from "react-icons/si";
import type { SocialIcon as IconName } from "@/data/profile";

const ICONS = {
  linkedin: FaLinkedinIn,
  whatsapp: FaWhatsapp,
  instagram: FaInstagram,
  gmail: SiGmail,
  github: FaGithub,
  cv: FaFileArrowDown,
  steam: FaSteam,
} as const;

export default function SocialIcon({ name, className }: { name: IconName; className?: string }) {
  const Icon = ICONS[name];
  return <Icon className={className} aria-hidden="true" focusable="false" />;
}
