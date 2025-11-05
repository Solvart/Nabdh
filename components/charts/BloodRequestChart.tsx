import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions } from 'chart.js';
import { Request } from '../../types';
import { useTheme } from '../../contexts/ThemeContext';
import { useI18n } from '../../contexts/I18nContext';

ChartJS.register(ArcElement, Tooltip, Legend);

const BLOOD_GROUP_COLORS: { [key: string]: string } = {
  'A+': '#e53e3e', 'A-': '#f56565',
  'B+': '#3b82f6', 'B-': '#60a5fa',
  'AB+': '#a855f7', 'AB-': '#c084fc',
  'O+': '#10b981', 'O-': '#34d399',
};

interface BloodRequestChartProps {
  requests: Request[];
}

const BloodRequestChart: React.FC<BloodRequestChartProps> = ({ requests }) => {
    const { theme } = useTheme();
    const { t } = useI18n();

    const requestsByGroup = requests.reduce((acc, req) => {
        acc[req.bloodGroup] = (acc[req.bloodGroup] || 0) + req.quantity;
        return acc;
    }, {} as Record<string, number>);

    const chartLabels = Object.keys(requestsByGroup);
    const chartDataPoints = Object.values(requestsByGroup);
    const backgroundColors = chartLabels.map(group => BLOOD_GROUP_COLORS[group] || '#9ca3af');

    if (requests.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-gray-500 dark:text-gray-400">{t('charts.noData')}</p>
            </div>
        );
    }
    
    const textColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)';

    const options: ChartOptions<'doughnut'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: textColor,
                    boxWidth: 20,
                    padding: 20
                }
            },
             tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed !== null) {
                            label += `${context.parsed} ${t('charts.units')}`;
                        }
                        return label;
                    }
                }
            }
        },
        cutout: '50%',
    };

    const data = {
        labels: chartLabels,
        datasets: [
            {
                label: t('charts.units'),
                data: chartDataPoints,
                backgroundColor: backgroundColors,
                borderColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderWidth: 2,
            },
        ],
    };

    return (
        <div className="h-64 w-full flex justify-center">
            <Doughnut options={options} data={data} />
        </div>
    );
};

export default BloodRequestChart;