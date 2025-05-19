import clsx from "clsx";
import styles from "./styles.module.css";

type Snapshot = {
  label: string;
  data?: {
    value: number;
    valueText: string;
  };
};

type FearGreedInfoPanelProps = {
  data: {
    value: string;
    previous?: { value: number; valueText: string };
    oneWeekAgo?: { value: number; valueText: string };
    oneMonthAgo?: { value: number; valueText: string };
    oneYearAgo?: { value: number; valueText: string };
  };
};

const getColorFromSentiment = (text: string) => {
  if (/extreme fear/i.test(text)) return "bg-red-200 text-red-800";
  if (/fear/i.test(text)) return "bg-orange-200 text-orange-800";
  if (/neutral/i.test(text)) return "bg-gray-200 text-gray-800";
  if (/greed/i.test(text)) return "bg-emerald-200 text-emerald-800";
  return "bg-gray-200 text-gray-800";
};

export default function FearGreedInfoPanel({ data }: FearGreedInfoPanelProps) {
  const snapshots: Snapshot[] = [
    { label: "Previous close", data: data.previous },
    { label: "1 week ago", data: data.oneWeekAgo },
    { label: "1 month ago", data: data.oneMonthAgo },
    { label: "1 year ago", data: data.oneYearAgo },
  ];

  return (
    <div className="flex flex-col gap-4 py-2 pr-4 min-w-[200px]">
      {snapshots.map(({ label, data }, i) => {
        if (!data) return null;

        const sentiment = data.valueText;
        const colorClass = getColorFromSentiment(sentiment);

        return (
          <div key={i} className="flex items-center justify-between">
            <div className="flex flex-col text-sm w-full flex-nowrap relative">
              <span className="text-gray-500">{label}</span>
              <div className={`font-semibold relative flex-shrink-0 ${styles.fearGreedInfoLabel}`}>{sentiment}</div>
            </div>

            <div className="bg-white relative z-10 top-[10px] px-4">
              <span
                className={clsx(
                  "rounded-full px-2 py-2 text-sm font-semibold min-w-[36px] text-center flex-shrink-0",
                  colorClass
                )}
              >
                {data.value}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
