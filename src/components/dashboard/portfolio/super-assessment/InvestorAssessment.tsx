import Image from 'next/image';
import { SUPER_INVESTORS } from './config';

export default function InvestorAssessment({ selectedInvestor }: { selectedInvestor: string }) {
	return (
        <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar */}
        <div className="md:w-1/4 w-full flex justify-center">
            <Image
                src={`https://assets.letmedemo.com/public/fundamental/investors/${selectedInvestor}.png`}
                alt={`${selectedInvestor} avatar`}
                width={200}
                height={200}
                className="rounded-xl object-cover border border-[var(--border-color)]"
            />
        </div>

        {/* Assessment */}
        <div className="md:w-3/4 w-full">
            <h3 className="text-lg font-semibold mb-2 text-[var(--text)]">
                Assessment from {SUPER_INVESTORS.find(i => i.id === selectedInvestor)?.name}
            </h3>
            <p className="text-[var(--text-secondary)]">
                {/* Placeholder — replace with OpenAI-generated output */}
                This is where the investment philosophy and commentary will be shown based on the selected investor. You can later populate this dynamically using GPT output.
            </p>
        </div>
    </div>
	);
}