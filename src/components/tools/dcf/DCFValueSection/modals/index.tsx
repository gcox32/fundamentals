import Modal from '@/components/common/Modal';
import styles from './styles.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DCFAssumption {
  key: string;
  value: string;
  baseValue?: number;
  adjustment?: number;
}

interface DCFAssumptionsModalProps extends ModalProps {
  assumptions: DCFAssumption[];
}

export function WhatIsDCFModal({ isOpen, onClose }: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What is DCF Valuation?">
      <div className={styles.modalContent}>
        <p className={styles.paragraph}>
          Discounted Cash Flow (DCF) valuation estimates a company's current value by projecting its future cash flows and adjusting them for the time value of money. This method helps investors determine if a stock is overvalued or undervalued.
        </p>
        <p className={styles.paragraph}>
          DCF is one of two primary valuation methods, alongside Relative Valuation. We combine both approaches to calculate the most accurate Intrinsic Value for each stock.
        </p>
      </div>
    </Modal>
  );
}

export function HowIsDCFValueCalculatedModal({ isOpen, onClose }: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How is DCF Value Calculated?">
      <div className={styles.modalContent}>
        <div className={styles.step}>
          <h3 className={styles.subtitle}>1. Free Cash Flow Forecasting</h3>
          <p className={styles.paragraph}>
            The DCF Operating Model block shows how we estimate free cash flow. Professional analysts can adjust our algorithm's forecasts for revenue growth, margins, and other key metrics based on their expertise.
          </p>
        </div>

        <div className={styles.step}>
          <h3 className={styles.subtitle}>2. Calculating Present Value</h3>
          <p className={styles.paragraph}>
            After forecasting free cash flow, we discount it using a risk-appropriate rate (customizable in DCF settings). This gives us the present value of the company's future cash flows.
          </p>
        </div>

        <div className={styles.step}>
          <h3 className={styles.subtitle}>3. Calculating the Value of Equity</h3>
          <p className={styles.paragraph}>
            Our algorithm selects either an equity or whole firm valuation model. For whole firm valuation, we adjust for liabilities and assets to determine equity value. These adjustments are detailed in the Capital Structure block.
          </p>
        </div>

        <div className={styles.step}>
          <h3 className={styles.subtitle}>4. Calculating the DCF Value of One Share</h3>
          <p className={styles.paragraph}>
            Finally, we divide the equity value by the number of shares outstanding to determine the DCF value per share.
          </p>
        </div>
      </div>
    </Modal>
  );
}

export function DCFScenariosModal({ isOpen, onClose }: ModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="What are DCF Valuation Scenarios?">
      <div className={styles.modalContent}>
        <p className={styles.paragraph}>
          Since the future is uncertain, a stock's intrinsic value isn't fixed. Different scenarios can lead to vastly different valuations.
        </p>
        <p className={styles.paragraph}>
          We create multiple DCF models for various future scenarios, helping you understand the full range of potential investment outcomes and risks.
        </p>
      </div>
    </Modal>
  );
}

export function DCFAssumptionsModal({ isOpen, onClose, assumptions }: DCFAssumptionsModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="DCF Valuation Assumptions">
      <div className={styles.modalContent}>
        <p className={styles.paragraph}>
          These are the key assumptions used in calculating the DCF value. Growth rates are adjusted based on the selected scenario.
        </p>
        <div className={styles.assumptionsList}>
          {assumptions.map((assumption) => (
            <div key={assumption.key} className={styles.assumption}>
              <div className={styles.assumptionKey}>
                {assumption.key}
                {assumption.baseValue !== undefined && (
                  <span className={styles.assumptionNote}>
                    (Base: {(assumption.baseValue * 100).toFixed(2)}%, 
                    Adjustment: {((assumption.adjustment || 1) * 100).toFixed(0)}%)
                  </span>
                )}
              </div>
              <span className={styles.assumptionValue}>{assumption.value}</span>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
