export default interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    position: 'left' | 'right';
    children: React.ReactNode;
}