declare module "lucide-react" {
  import type { ComponentType, SVGProps } from "react";

  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    color?: string;
    className?: string;
  }

  export type LucideIcon = ComponentType<LucideProps>;

  export const Activity: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Bug: LucideIcon;
  export const Calendar: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const ChevronDown: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ChevronRight: LucideIcon;
  export const Clock: LucideIcon;
  export const Edit: LucideIcon;
  export const ExternalLink: LucideIcon;
  export const Eye: LucideIcon;
  export const FileText: LucideIcon;
  export const Filter: LucideIcon;
  export const FolderKanban: LucideIcon;
  export const Hash: LucideIcon;
  export const Inbox: LucideIcon;
  export const Layers: LucideIcon;
  export const LayoutDashboard: LucideIcon;
  export const ListTodo: LucideIcon;
  export const Lock: LucideIcon;
  export const Mail: LucideIcon;
  export const Menu: LucideIcon;
  export const MessageSquare: LucideIcon;
  export const MoreHorizontal: LucideIcon;
  export const MoreVertical: LucideIcon;
  export const Paperclip: LucideIcon;
  export const Phone: LucideIcon;
  export const Plus: LucideIcon;
  export const RefreshCw: LucideIcon;
  export const Search: LucideIcon;
  export const Send: LucideIcon;
  export const Shield: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Tag: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const Trash2: LucideIcon;
  export const User: LucideIcon;
  export const UserCheck: LucideIcon;
  export const UserPlus: LucideIcon;
  export const Users: LucideIcon;
  export const X: LucideIcon;

  const icons: Record<string, LucideIcon>;
  export default icons;
}

