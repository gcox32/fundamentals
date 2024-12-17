import type { CompanyProfile } from "@/types/company";

export const formatPercent = (value?: number) => {
    if (!value) return '--';
    return `${value.toFixed(2)}%`;
};

export const formatNumber = (value?: number) => {
    if (!value) return '--';
    return value.toFixed(2);
};

export const formatPrice = (value?: number) => {
    if (!value) return '--';
    return `$${value.toFixed(2)}`;
};

export const formatDate = (event?: { raw: number; fmt: string } | Array<{ raw: number; fmt: string }>) => {
    if (!event) return '--';
    if (Array.isArray(event)) {
        return event[0] ? new Date(event[0].raw * 1000).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }) : '--';
    }
    return new Date(event.raw * 1000).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

export const formatChange = (change: number) => (
    change >= 0 ? `+${change.toFixed(2)}` : change.toFixed(2)
);

export const formatPercentWithDirection = (percent: number) => (percent >= 0 ? `+${percent.toFixed(2)}%` : `${percent.toFixed(2)}%`);

export const formatAddress = (profile: CompanyProfile) => {
    if (!profile) return '';
    const parts = [
        profile.address,
        profile.city,
        profile.state,
        profile.country
    ].filter(Boolean);
    return parts.join(', ');
};

export const formatEmployees = (employees?: string) => {
    if (!employees) return 'N/A';
    return parseInt(employees).toLocaleString();
};


export const formatNewsDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};