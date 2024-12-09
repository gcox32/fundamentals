interface NavItem {
    icon: React.ReactNode;
    label: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}