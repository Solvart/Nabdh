import React from 'react';

interface AvatarProps {
  name: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, className }) => {
  const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.trim().split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className={`w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
