'use strict';

var PIN_WIDTH = 40;
var PIN_HEIGHT = 40;

var OFFERS_COUNT = 8;

var OFFERS_TITLES = [
  'Большая квартира',
  'Маленькая квартира',
  'Ограмный красивый дворец',
  'Маленький дворец',
  'Красивый домик',
  'Некрасивый домик',
  'Уютное бунгало',
  'Неуютное бунгало',
];

var TYPES = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var CHECK_TIME = [
  '12:00',
  '13:00',
  '14:00'
];

var FEATURES_ARRAY = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var PHOTOS_ARRAY = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// Для генерации случайных значений в диапозоне
var getRandomFromTo = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var cardTemplate = document.querySelector('#card').content;

// Для значений в случайном порядке которые неповторяются

var compareRandom = function () {
  return Math.random() - 0.5;
};

var getAvatar = function (num) {
  return 'img/avatars/user0' + (num + 1) + '.png';
};

var getPhotos = function () {
  return PHOTOS_ARRAY.sort(compareRandom);
};

var getFeatures = function () {
  FEATURES_ARRAY.sort(compareRandom);
  return FEATURES_ARRAY.slice(0, getRandomFromTo(1, FEATURES_ARRAY.length));
};

var generateOffers = function () {
  var offers = [];
  OFFERS_TITLES.sort(compareRandom); // Для заголовков в рандомном порядке
  for (var i = 0; i < OFFERS_COUNT; i++) {
    var locX = getRandomFromTo(300, 900);
    var locY = getRandomFromTo(150, 500);
    offers.push({
      author: {
        avatar: getAvatar(i)
      },
      offer: {
        title: OFFERS_TITLES[i],
        address: locX + ', ' + locY,
        price: getRandomFromTo(1000, 1000000),
        type: TYPES[getRandomFromTo(0, 2)],
        rooms: getRandomFromTo(1, 5),
        guests: getRandomFromTo(1, 10),
        checkin: CHECK_TIME[getRandomFromTo(0, 2)],
        checkout: CHECK_TIME[getRandomFromTo(0, 2)],
        features: getFeatures(),
        description: '',
        photos: getPhotos()
      },
      location: {
        x: locX,
        y: locY
      }
    });
  }
  return offers;
};

var showMap = function () {
  var mapBlock = document.querySelector('.map');
  mapBlock.classList.remove('map--faded');
};


var renderPins = function (renderingOffer) {
  var pinTemplate = document.querySelector('#pin').content;
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.querySelector('img').src = renderingOffer.author.avatar;
  pinElement.querySelector('img').textContent = renderingOffer.offer.title;


  pinElement.querySelector('.map__pin');
  var pinIcon = pinElement.querySelector('.map__pin');
  pinIcon.querySelector('img').src = renderingOffer.author.avatar;
  pinIcon.style.left = (renderingOffer.location.x + PIN_WIDTH / 2) + 'px';
  pinIcon.style.top = (renderingOffer.location.y + PIN_HEIGHT) + 'px';
  return pinElement;
};

var setupPins = function () {
  var offersArray = generateOffers();
  var fragment = document.createDocumentFragment();
  var similarListElement = document.querySelector('.map__pins');
  for (var n = 0; n < offersArray.length; n++) {
    fragment.appendChild(renderPins(offersArray[n]));
  }
  similarListElement.appendChild(fragment);
};

var renderCard = function (pin) {
  var card = cardTemplate.cloneNode(true);
  var featuresBlock = card.querySelector('.popup__features');
  var photosBlock = card.querySelector('.popup__photos');

  while (featuresBlock.firstChild) {
    featuresBlock.removeChild(featuresBlock.firstChild);
  }

  while (photosBlock.firstChild) {
    photosBlock.removeChild(photosBlock.firstChild);
  }

  for (var i = 0; i < FEATURES_ARRAY; i++) {
    var element = pin.offer.features[i].cloneNode(true);
    featuresBlock.appendChild(element);
  }

  for (var l = 0; l < PHOTOS_ARRAY; l++) {
    var photo = pin.offer.photos[0].cloneNode(true);
    photosBlock.appendChild(photo);
    card.querySelectorAll('.popup__photo')[l].src = PHOTOS_ARRAY;
  }

  card.querySelector('.popup__title').textContent = pin.offer.title;
  card.querySelector('.popup__text--address').textContent = pin.offer.address;
  card.querySelector('.popup__text--price').textContent = pin.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = pin.offer.type;
  card.querySelector('.popup__text--capacity').textContent = pin.offer.rooms + ' комнаты для ' + pin.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + pin.offer.checkin + ', выезд до ' + pin.offer.checkout;
  card.querySelector('.popup__description').textContent = pin.offer.description;
  card.querySelector('.popup__avatar').src = pin.author.avatar;

  return card;
};


showMap();
setupPins();
