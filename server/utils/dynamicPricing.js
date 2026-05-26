import Holidays from "date-holidays";

const hd = new Holidays("IN"); // IN = India

export const getDynamicPrice = (basePrice, date) => {
  const d = new Date(date);
  const day = d.getDay(); // 0 = Sunday, 6 = Saturday

  // Check if it's a public holiday in India
  const isHoliday = hd.isHoliday(d);

  // Check if it's a weekend
  const isWeekend = day === 0 || day === 6;

  if (isHoliday) {
    return Math.round(basePrice * 1.5); // 50% surge on holidays
  } else if (isWeekend) {
    return Math.round(basePrice * 1.25); // 25% surge on weekends
  }

  return basePrice; // Normal price on weekdays
};

// Get price for a date range (returns highest applicable price)
export const getPriceForStay = (basePrice, checkInDate, checkOutDate) => {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  let maxMultiplier = 1;

  // Loop through each night of the stay
  const current = new Date(checkIn);
  while (current < checkOut) {
    const day = current.getDay();
    const isHoliday = hd.isHoliday(new Date(current));
    const isWeekend = day === 0 || day === 6;

    if (isHoliday) maxMultiplier = Math.max(maxMultiplier, 1.5);
    else if (isWeekend) maxMultiplier = Math.max(maxMultiplier, 1.25);

    current.setDate(current.getDate() + 1);
  }

  return Math.round(basePrice * maxMultiplier);
};