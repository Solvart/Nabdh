// Fix: Removed self-import of `formatDate` which was causing a conflict with the local declaration.

/**
 * Calculates the age of a person from their date of birth.
 * @param dateOfBirth - The date of birth in 'YYYY-MM-DD' format.
 * @returns The age in years, or 'N/A' if the date is invalid.
 */
export const calculateAge = (dateOfBirth: string): string => {
  if (!dateOfBirth) return 'N/A';
  const birthDate = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return `${age} ans`;
};

/**
 * Checks if a donor is eligible to donate based on their last donation date.
 * Assumes a 3-month (90 days) waiting period.
 * @param lastDonationDate - The ISO string of the last donation date.
 * @returns True if eligible, false otherwise.
 */
export const isEligibleToDonate = (lastDonationDate?: string): boolean => {
  if (!lastDonationDate) {
    return true; // No donation history, so eligible.
  }
  const lastDonation = new Date(lastDonationDate);
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastDonation.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 90; // Donors must wait 90 days.
};

/**
 * Formats an ISO date string to a more readable format (e.g., '15/05/2024').
 * @param isoString - The date string in ISO format.
 * @param locale - The locale code (e.g., 'fr-FR', 'en-US').
 * @returns A formatted date string.
 */
export const formatDate = (isoString: string, locale: string): string => {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString(locale, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

/**
 * Calculates the next possible donation date.
 * @param lastDonationDate - The ISO string of the last donation date.
 * @param locale - The locale code for formatting the output date.
 * @returns A formatted string of the next donation date.
 */
export const getNextDonationDate = (lastDonationDate: string, locale: string): string => {
    const lastDonation = new Date(lastDonationDate);
    const nextDate = new Date(lastDonation);
    nextDate.setDate(nextDate.getDate() + 91); // Can donate on the 91st day
    return formatDate(nextDate.toISOString(), locale);
};

/**
 * Calculates the distance between two geographical points using the Haversine formula.
 * @param lat1 Latitude of the first point.
 * @param lon1 Longitude of the first point.
 * @param lat2 Latitude of the second point.
 * @param lon2 Longitude of the second point.
 * @returns The distance in kilometers, or null if any coordinate is missing.
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number | null => {
    if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
};
