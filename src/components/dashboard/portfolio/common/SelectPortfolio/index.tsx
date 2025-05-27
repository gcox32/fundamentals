import styles from "./styles.module.css";
import { Portfolio } from "@/types/portfolio";

interface SelectPortfolioProps {
    portfolios: Portfolio[];
    activePortfolio: Portfolio;
    setActivePortfolio: (portfolio: Portfolio) => void;
    setIsWeightsCalculated?: (isWeightsCalculated: boolean) => void;
    resetStateArrays?: () => Promise<void>;
}

export default function SelectPortfolio({portfolios, activePortfolio, setActivePortfolio, setIsWeightsCalculated, resetStateArrays}: SelectPortfolioProps) {
    
    return (
        <div className={styles.selectContainer}>
            <label htmlFor="portfolio-select" className={styles.selectLabel}>
                Select Portfolio:
            </label>
            <select
                id="portfolio-select"
                className={styles.select}
                value={activePortfolio?.id || ''}
                onChange={(e) => {
                    const selected = portfolios.find(p => p.id === e.target.value);
                    setIsWeightsCalculated?.(false);
                    if (resetStateArrays) {
                        resetStateArrays()
                            .then(() => {
                                setActivePortfolio?.(selected as Portfolio);
                        })
                    } else {
                        setActivePortfolio(selected as Portfolio);
                    }
                }}
            >
                {portfolios.map((portfolio) => (
                    <option key={portfolio.id} value={portfolio.id}>
                        {portfolio.name || 'Unnamed Portfolio'}
                    </option>
                ))}
            </select>
        </div>
    )
};