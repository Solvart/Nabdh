import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Donation } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface DonationHistoryChartProps {
  donations: Donation[];
}

const DonationHistoryChart: React.FC<DonationHistoryChartProps> = ({ donations }) => {
    const { theme } = useTheme();
    const { t } = useI18n();

    const donationsByYear = donations.reduce((acc, donation) => {
        const year = new Date(donation.date).getFullYear().toString();
        acc[year] = (acc[year] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const sortedYears = Object.keys(donationsByYear).sort((a, b) => parseInt(a) - parseInt(b));
    const chartLabels = sortedYears;
    const chartDataPoints = sortedYears.map(year => donationsByYear[year]);

    if (donations.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">{t('charts.noData')}</p>
            </div>
        );
    }
    
    const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: t('charts.donationHistoryTitle'),
                color: textColor,
                font: { size: 16 }
            },
             tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += `${context.parsed.y} ${t('charts.donationsUnit')}`;
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    color: textColor,
                    stepSize: 1
                },
                grid: {
                    color: gridColor
                }
            },
            x: {
                ticks: {
                    color: textColor,
                },
                 grid: {
                    display: false
                }
            }
        }
    };

    const data = {
        labels: chartLabels,
        datasets: [
            {
                label: t('charts.donationsUnit'),
                data: chartDataPoints,
                backgroundColor: 'rgba(229, 62, 62, 0.6)',
                borderColor: 'rgba(229, 62, 62, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(229, 62, 62, 0.8)',
                hoverBorderColor: 'rgba(229, 62, 62, 1)',
            },
        ],
    };

    return (
        <div className="h-64">
            <Bar options={options} data={data} />
        </div>
    );
};

export default DonationHistoryChart;