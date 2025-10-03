import dayjs from 'dayjs';
import { LocaleConfig } from 'react-native-calendars';

export const getCalendarHeight = (dateString: string) => {
  const date = dayjs(dateString);
  const startOfMonth = date.startOf('month');
  const endOfMonth = date.endOf('month');
  // Get the first day of the first week and last day of the last week
  const startOfFirstWeek = startOfMonth.startOf('week').add(1, 'day'); // Monday as first day
  const endOfLastWeek = endOfMonth.endOf('week').add(1, 'day'); // Sunday as last day
  const numberOfWeeks = Math.ceil(
    endOfLastWeek.diff(startOfFirstWeek, 'day') / 7,
  );
  // Base height per week (approximately 40-50px per week)
  const weekHeight = 55;
  const headerHeight = 0; // Since we hide the header
  return numberOfWeeks * weekHeight + headerHeight;
};

export const configureCalendarLocales = () => {
  LocaleConfig.locales.ua = {
    monthNames: [
      'Січень',
      'Лютий',
      'Березень',
      'Квітень',
      'Травень',
      'Червень',
      'Липень',
      'Серпень',
      'Вересень',
      'Жовтень',
      'Листопад',
      'Грудень',
    ],
    monthNamesShort: [
      'Січ',
      'Лют',
      'Бер',
      'Кві',
      'Тра',
      'Чер',
      'Лип',
      'Сер',
      'Вер',
      'Жов',
      'Лис',
      'Гру',
    ],
    dayNames: [
      'Неділя',
      'Понеділок',
      'Вівторок',
      'Середа',
      'Четвер',
      "П'ятниця",
      'Субота',
    ],
    dayNamesShort: ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    today: 'Сьогодні',
  };
};
