import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import { MarketNews } from '@/types/company';
import OverviewCard from '@/components/dashboard/research/company/DashboardCard/OverviewCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { formatNewsDate } from '@/src/lib/utilities/format';

interface CompanyNewsProps {
    isLoading?: boolean;
    symbol?: string;
}

const ITEMS_PER_PAGE = 5;

export default function CompanyNews({ isLoading: parentLoading, symbol }: CompanyNewsProps) {
    const [currentPage, setCurrentPage] = useState(0);
    const [news, setNews] = useState<MarketNews[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchNews() {
            if (!symbol) return;
            
            setIsLoading(true);
            try {
                const response = await fetch(`/api/research/valuation/market/news?symbol=${symbol}`);
                if (!response.ok) throw new Error('Failed to fetch news');
                const data = await response.json();
                setNews(data);
            } catch (error) {
                console.error('Error fetching news:', error);
                setNews([]);
            } finally {
                setIsLoading(false);
            }
        }

        fetchNews();
    }, [symbol]);

    if (parentLoading || isLoading) {
        return (
            <OverviewCard title="Latest News" isLoading={true}>
                <div className={styles.loading}>Loading news...</div>
            </OverviewCard>
        );
    }

    if (!news || news.length === 0) {
        return (
            <OverviewCard title="Latest News" isLoading={false}>
                <div className={styles.noNews}>No recent news available</div>
            </OverviewCard>
        );
    }

    const totalPages = Math.ceil(news.length / ITEMS_PER_PAGE);
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const paginatedNews = news.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    return (
        <OverviewCard title="Latest News" isLoading={isLoading} className={styles.marginTopTwo}>
            <div className={styles.newsContainer}>
                {paginatedNews.map((item, index) => (
                    <a 
                        key={index} 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className={styles.newsItem}
                    >
                        <div className={styles.newsContent}>
                            <h4 className={styles.newsTitle}>{item.title}</h4>
                            <p className={styles.newsText}>{item.text}</p>
                            <div className={styles.newsMetadata}>
                                <span className={styles.newsSource}>{item.site}</span>
                                <span className={styles.newsDate}>
                                    {formatNewsDate(item.publishedDate)}
                                </span>
                            </div>
                        </div>
                        {item.image && (
                            <div className={styles.newsImageContainer}>
                                <img 
                                    src={item.image} 
                                    alt="" 
                                    className={styles.newsImage}
                                />
                            </div>
                        )}
                    </a>
                ))}
            </div>
            <div className={styles.pagination}>
                <button
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    disabled={currentPage === 0}
                    className={styles.paginationButton}
                >
                    <FaChevronLeft />
                </button>
                <span className={styles.paginationInfo}>
                    Page {currentPage + 1} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage === totalPages - 1}
                    className={styles.paginationButton}
                >
                    <FaChevronRight />
                </button>
            </div>
        </OverviewCard>
    );
} 