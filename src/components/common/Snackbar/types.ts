export interface SnackbarState {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
}