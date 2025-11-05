import { Badge } from '../types';

export const POINTS_PER_DONATION = 100;

interface BadgeMilestone extends Badge {
    milestone: number; // Number of donations to achieve this badge
}

export const BADGES: BadgeMilestone[] = [
    { 
        id: 'first_donation', 
        nameKey: 'badges.first_donation.name', 
        descriptionKey: 'badges.first_donation.description', 
        icon: 'Droplet', 
        milestone: 1 
    },
    { 
        id: 'regular_donor', 
        nameKey: 'badges.regular_donor.name', 
        descriptionKey: 'badges.regular_donor.description', 
        icon: 'Repeat', 
        milestone: 5 
    },
    { 
        id: 'hero_donor', 
        nameKey: 'badges.hero_donor.name', 
        descriptionKey: 'badges.hero_donor.description', 
        icon: 'Shield', 
        milestone: 10 
    },
    { 
        id: 'lifesaver', 
        nameKey: 'badges.lifesaver.name', 
        descriptionKey: 'badges.lifesaver.description', 
        icon: 'Award', 
        milestone: 25 
    },
    { 
        id: 'legend', 
        nameKey: 'badges.legend.name', 
        descriptionKey: 'badges.legend.description', 
        icon: 'Star', 
        milestone: 50 
    },
];
