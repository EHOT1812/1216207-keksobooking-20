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
  var pinTemplate = document.querySelector('#pin').content;
  var pinElement = pinTemplate.cloneNode(true);
  pinElement.querySelector('.map__pin');
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

  /* обработка событий */
  var makeElementsDisabled = function (array) {
    for (var b = 0; b < array.length; b++) {
      array[i].setAttribute('disabled', 'true');
    }
  };

  var makeElementsActive = function (array) {
    for (var b = 0; b < array.length; b++) {
      array[i].removeAttribute('disabled');
    }
  };

  var adForm = document.querySelector('.ad-form');
  var adFormFieldset = document.querySelectorAll('.ad-form fieldset');
  var mapFiltersSelect = document.querySelectorAll('.map__filters select');
  var mapFeatures = document.querySelector('.map__features');
  var mapPinMain = document.querySelector('.map__pin--main');

  makeElementsDisabled(adFormFieldset);
  makeElementsDisabled(mapFiltersSelect);
  makeElementsDisabled(mapFeatures);


  var activateMap = function () {
    adForm.classList.remove('ad-form--disabled');

    makeElementsActive(adFormFieldset);
    makeElementsActive(mapFiltersSelect);
    makeElementsActive(mapFeatures);

    mapPinMain.removeEventListener('keydown', keyDownHandler);
  };

  mapPinMain.addEventListener('mousedown', function (evt) {
    if (evt.button === 'LEFT_MOUSE_BUTTON') {
      activateMap();
      getAddress();
    }
  });

  var keyDownHandler = function (evt) {
    if (evt.key === 'Enter') {
      activateMap();
      getAddress();
    }
  };

  mapPinMain.addEventListener('keydown', keyDownHandler);
  /* Конец обработки событий */
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
var address = document.querySelector('#address');

var getAddress = function () {
  var locationX = Math.round(getRandomFromTo(0, 1200) - PIN_WIDTH / 2);
  var locationY = Math.round(getRandomFromTo(130, 630) - PIN_HEIGHT);
  address.value = locationX + ', ' + locationY;
};

var roomElements = document.querySelector('#room_number');
var capacityElements = document.querySelector('#capacity');
var FormSubmit = document.querySelector('.ad-form__submit');

var matchingField = function () {
  if (roomElements.value === '1' && capacityElements.value !== '1') {
    capacityElements.setCustomValidity('Только для 1 гостя');
  } else if (roomElements.value === '2' && (capacityElements.value > roomElements.value || capacityElements.value === '0')) {
    capacityElements.setCustomValidity('До 2-х гостей');
  } else if (roomElements.value === '3' && capacityElements.value === '0') {
    capacityElements.setCustomValidity('До 3-х гостей');
  } else if (roomElements.value === '100' && capacityElements.value !== '0') {
    capacityElements.setCustomValidity('Не для гостей');
  } else {
    capacityElements.setCustomValidity('');
  }
};

FormSubmit.addEventListener('click', function () {
  matchingField();
});

renderCard(offersArray[0]);
showMap();
setupPins();
