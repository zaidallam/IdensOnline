import {
  Settings,
  LayoutGrid,
  Calendar,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/",
          label: "Schedule",
          icon: Calendar,
          submenus: []
        }
      ]
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/settings",
          label: "Settings",
          icon: Settings
        }
      ]
    }
  ];
}
