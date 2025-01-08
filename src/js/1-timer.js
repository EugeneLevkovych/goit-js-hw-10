import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const dateTimePicker = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysSpan = document.querySelector('[data-days]');
const hoursSpan = document.querySelector('[data-hours]');
const minutesSpan = document.querySelector('[data-minutes]');
const secondsSpan = document.querySelector('[data-seconds]');

// Змінна для збереження обраної дати
let userSelectedDate = null;
let timerInterval = null;

startButton.disabled = true;

// Flatpickr
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    if (selectedDate <= new Date()) {
      startButton.disabled = true;
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
      });
    } else {
      userSelectedDate = selectedDate;
      startButton.disabled = false;
      iziToast.success({ title: 'Success', message: 'Valid date selected!' });
      // console.log(selectedDate);
    }
  },
};

flatpickr(dateTimePicker, options);

function addZero(value) {
  return String(value).padStart(2, '0');
}

function updateTimerInterface({ days, hours, minutes, seconds }) {
  daysSpan.textContent = addZero(days);
  hoursSpan.textContent = addZero(hours);
  minutesSpan.textContent = addZero(minutes);
  secondsSpan.textContent = addZero(seconds);
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

startButton.addEventListener('click', () => {
  if (!userSelectedDate) return;

  startButton.disabled = true;
  dateTimePicker.disabled = true;

  timerInterval = setInterval(() => {
    const currentTime = new Date();
    const timeRemaining = userSelectedDate - currentTime;

    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      iziToast.success({ title: 'Timer', message: 'Time is up!' });
      dateTimePicker.disabled = false;
      return;
    }

    const timeComponents = convertMs(timeRemaining);
    updateTimerInterface(timeComponents);
  }, 1000);
});

startButton.disabled = true;
// console.dir(startButton);
//--------------------------------REPIN-TIMER----------------------------------------
// const timer = {
//   deadLine: new Date('2025-01-09T20:53:00'),
//   intervalId: null,
//   elements: {
//     days: document.querySelector('[data-days]'),
//     hours: document.querySelector('[data-hours]'),
//     minutes: document.querySelector('[data-minutes]'),
//     seconds: document.querySelector('[data-seconds]'),
//   },
//   start() {
//     this.intervalId = setInterval(() => {
//       const diff = this.deadLine - Date.now();

//       if (diff <= 0) {
//         this.stop();
//         return;
//       }

//       const timeComponents = this.getTimeComponents(diff);
//       this.elements.days.textContent = this.pad(timeComponents.days);
//       this.elements.hours.textContent = this.pad(timeComponents.hours);
//       this.elements.minutes.textContent = this.pad(timeComponents.minutes);
//       this.elements.seconds.textContent = this.pad(timeComponents.seconds);
//     }, 1000);
//   },
//   stop() {
//     clearInterval(this.intervalId);
//   },
//   getTimeComponents(diff) {
//     const days = Math.floor(diff / 1000 / 60 / 60 / 24);
//     const hours = Math.floor((diff / 1000 / 60 / 60) % 24);
//     const minutes = Math.floor((diff / 1000 / 60) % 60);
//     const seconds = Math.floor((diff / 1000) % 60);
//     return {
//       days,
//       hours,
//       minutes,
//       seconds,
//     };
//   },
//   pad(value) {
//     return String(value).padStart(2, '0');
//   },
// };
// timer.start();

// document.addEventListener('click', () => {
//   timer.stop();
// });
