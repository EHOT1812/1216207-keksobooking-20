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
  var pinTemplate = document.querySelector('template').content;
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.querySelector('.popup__avatar').src = renderingOffer.author.avatar;
  pinElement.querySelector('h3').textContent = renderingOffer.offer.title;
  pinElement.querySelector('.popup__text--address').textContent = renderingOffer.offer.address;
  pinElement.querySelector('.popup__text--price').textContent = renderingOffer.offer.price + ' \u20bd/ночь';
  var getRuType = function (type) {
    if (type === 'flat') {
      return 'Квартира';
    }
    if (type === 'bungalo') {
      return 'Бунгало';
    }
    return 'Дом';
  };

  pinElement.querySelector('h4').textContent = getRuType(renderingOffer.offer.type);

  var elemStr = renderingOffer.offer.rooms + ' комнаты для ' + renderingOffer.offer.guests + ' гостей';
  pinElement.querySelectorAll('p')[2].textContent = elemStr;

  elemStr = 'Заезд после ' + renderingOffer.offer.checkin + ', выезд до ' + renderingOffer.offer.checkout;
  pinElement.querySelectorAll('p')[3].textContent = elemStr;

  var featuresElement = pinElement.querySelector('.popup__features');
  featuresElement.innerHTML = '';
  for (var m = 0; m < renderingOffer.offer.features.length; m++) {
    var featureItem = document.createElement('li');
    featureItem.className = 'popup__feature popup__feature--' + renderingOffer.offer.features[m];
    featuresElement.appendChild(featureItem);
  }

  pinElement.querySelectorAll('p')[4].textContent = renderingOffer.offer.description;

  var photosElement = pinElement.querySelector('.popup__pictures');
  for (var j = 0; j < renderingOffer.offer.photos.length; j++) {
    var popupPhotoItem = pinElement.cloneNode(true);
    popupPhotoItem.src = renderingOffer.offer.photos[j];
    photosElement.appendChild(popupPhotoItem);
  }

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

showMap();
setupPins();
