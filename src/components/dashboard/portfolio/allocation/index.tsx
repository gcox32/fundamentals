import { CompanyOutlook } from "@/types/company";
import SectorDistribution from "./SectorDistribution";
import StyleDistribution from "./StyleDistribution";

interface AllocationProps {
    companyOutlooks: CompanyOutlook[];
    weights: Array<{
        ticker: string;
        weight: number;
    }>;
}

export default function Allocation({ companyOutlooks, weights }: AllocationProps) {
    const companyProfiles = companyOutlooks.map(outlook => outlook.profile);
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">Allocation</h2>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
                <SectorDistribution companyProfiles={companyProfiles} weights={weights} />
                <StyleDistribution companyOutlooks={companyOutlooks} weights={weights} />
            </div>
        </div>
    );
}