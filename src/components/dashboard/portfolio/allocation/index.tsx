interface AllocationProps {
    weights: Array<{
        ticker: string;
        weight: number;
    }>;
    companyProfiles: any[];
}

export default function Allocation({ weights, companyProfiles }: AllocationProps) {
    return (
        <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Allocation</h2>
        </div>
    );
}