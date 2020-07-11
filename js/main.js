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
var cardTemplate = document.querySelector('#card').content;


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
var offersArray = generateOffers();


var setupPins = function () {
  var fragment = document.createDocumentFragment();
  var similarListElement = document.querySelector('.map__pins');
  for (var n = 0; n < offersArray.length; n++) {
    fragment.appendChild(renderPins(offersArray[n]));
  }
  similarListElement.appendChild(fragment);
};

var renderCard = function (item) {
  var fragment = document.createDocumentFragment();
  var card = cardTemplate.querySelector('.popup').cloneNode(true);
  var featuresBlock = card.querySelector('.popup__features');
  var photosBlock = card.querySelector('.popup__photos');

  while (featuresBlock.firstChild) {
    featuresBlock.removeChild(featuresBlock.firstChild);
  }
  while (photosBlock.firstChild) {
    photosBlock.removeChild(photosBlock.firstChild);
  }

  for (var i = 0; i < item.offer.features.length; i++) {
    var featuresList = document.createElement('li');
    featuresList.classList.add('feature', 'feature--' + item.offer.features[i]);
    fragment.appendChild(featuresList);
  }

  for (var l = 0; l < item.offer.photos.length; l++) {
    var pictureList = document.createElement('li');
    var pictureImg = document.createElement('img');
    pictureImg.width = '40';
    pictureImg.height = '40';
    pictureList.appendChild(pictureImg);
    fragment.appendChild(pictureList);
  }
  document.querySelector('.map').insertBefore(card, document.querySelector('.map__filters-container'));

  card.querySelector('.popup__title').textContent = item.offer.title;
  card.querySelector('.popup__text--address').textContent = item.offer.address;
  card.querySelector('.popup__text--price').textContent = item.offer.price + '₽/ночь';
  card.querySelector('.popup__type').textContent = item.offer.type;
  card.querySelector('.popup__text--capacity').textContent = item.offer.rooms + ' комнаты для ' + item.offer.guests + ' гостей';
  card.querySelector('.popup__text--time').textContent = 'Заезд после ' + item.offer.checkin + ', выезд до ' + item.offer.checkout;
  card.querySelector('.popup__description').textContent = item.offer.description;
  card.querySelector('.popup__avatar').src = item.author.avatar;

  return card;
};


renderCard(offersArray[0]);
showMap();
setupPins();
