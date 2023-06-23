'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputTemp = document.querySelector('.form__input--temp');
const inputClimb = document.querySelector('.form__input--climb');

class Workout {
  date = new Date();
  id = (Date.now() + '').slice(-10)

  constructor(coords, distance, duration) {
    this.coords = coords;
    this.distance = distance; // km
    this.duration = duration; // min
  }
}

class Running extends Workout {

  constructor(coords, distance, duration, temp) {
    super(coords, distance, duration);
    this.temp = temp;
    this.calculatePace();
  }

  calculatePace() {
    // min/km
    this.pace = this.duration / this.distance;
  }
}

class Cycling extends Workout {

  constructor(coords, distance, duration, climb) {
    super(coords, distance, duration);
    this.climb = climb;
    this.calculateSpeed();
  }

  calculateSpeed() {
    // km/h
    this.pace = this.distance / this.duration / 60;
  }
}

const running = new Running([50, 39], 7, 40, 170)
const cycling = new Cycling([50, 39], 37, 80, 370)
console.log(running, cycling);

const timeInMs = Date.now();
console.log(timeInMs);

class App {

  #map
  #mapEvent

  constructor() {
    this._getPosition();

    form.addEventListener('submit', this._newWorkout.bind(this));


    inputType.addEventListener('change', this._toggleClimbField)
  }

  _getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this._loadMap.bind(this), function() {
          alert('Что то пошло не так!')
        }
      )
    }
  }

  _loadMap(position) {
      const {latitude} = position.coords;
      const {longitude} = position.coords;

      const coords = [latitude, longitude];

      console.log(`https://www.google.com/maps/@${latitude},${longitude},15z`);

      console.log(this);
      this.#map = L.map('map').setView(coords, 13);

      L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.#map);

      // Обработка клика на карте
      this.#map.on('click', this._showForm.bind(this))
  }

  _showForm(e) {
    this.#mapEvent = e;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _toggleClimbField() {
    inputClimb.closest('.form__row').classList.toggle('form__row--hidden');
    inputTemp.closest('.form__row').classList.toggle('form__row--hidden');
  }

  _newWorkout(e) {
    e.preventDefault();

    // Очистка поледанныхй ввода
    inputDistance.value = inputDuration.value = inputTemp.value = inputClimb.value = '';

    // Отображение маркера
    const {lat, lng} = this.#mapEvent.latlng;

    L.marker([lat, lng])
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minHeight: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'running-popup',
        }))
      .setPopupContent('Тренеровка')
      .openPopup();
  }
}

const app = new App();
