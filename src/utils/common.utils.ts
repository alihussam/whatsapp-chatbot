export function replaceEverythingExceptNumbers(text: string) {
	return text.replace(/\D/g, '');
}

/**
 * Add hours in date
 *
 * @param param0 - Function params
 * @returns Add hours in date
 */
export function addHoursInDate({ date, hours }: { date: Date; hours: number }) {
	const finalDate = date;
	finalDate.setTime(finalDate.getTime() + hours * 60 * 60 * 1000);
	return finalDate;
}
