import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  const { theme } = useTheme();

  const lightLogo = "https://www.solvart.net/wp-content/uploads/2025/11/Nabdh_logo_light_mode.png";
  const darkLogo = "https://www.solvart.net/wp-content/uploads/2025/11/Nabdh_logo_dark_mode.png";

  const logoSrc = theme === 'dark' ? darkLogo : lightLogo;

  return (
    <img src={logoSrc} alt="Nabdh Logo" className={className} />
  );
};

export default Logo;
