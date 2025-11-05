import React from 'react';
import { useI18n } from '../../contexts/I18nContext';

interface PasswordStrengthIndicatorProps {
  password?: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password = '' }) => {
  const { t } = useI18n();
  
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    if (pass.length >= 8) score++;
    if (pass.match(/[a-z]/)) score++;
    if (pass.match(/[A-Z]/)) score++;
    if (pass.match(/[0-9]/)) score++;
    if (pass.match(/[^a-zA-Z0-9]/)) score++;
    return score;
  };

  const strength = getStrength(password);
  
  const strengthKeys = ['veryWeak', 'weak', 'weak', 'medium', 'strong', 'veryStrong'];
  const colors = ['bg-red-500', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-green-500'];

  const strengthLabel = strength > 0 ? t(`passwordStrength.${strengthKeys[strength]}`) : '';
  const strengthColor = colors[strength];
  
  return (
    <div className="flex items-center mt-2 h-6">
      {password && (
        <>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2 rtl:ml-2 rtl:mr-0">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`} 
              style={{ width: `${(strength / 5) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-600 dark:text-gray-400 w-20 text-right rtl:text-left">{strengthLabel}</span>
        </>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;