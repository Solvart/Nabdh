import React from 'react';
import { Award, Droplet, Repeat, Shield, Star, LucideProps } from 'lucide-react';

const iconMap: { [key: string]: React.FC<LucideProps> } = {
  Award,
  Droplet,
  Repeat,
  Shield,
  Star,
};

interface BadgeIconProps extends LucideProps {
  name: string;
}

const BadgeIcon: React.FC<BadgeIconProps> = ({ name, ...props }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null; // Or a default icon
  return <IconComponent {...props} />;
};

export default BadgeIcon;
