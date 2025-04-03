ymaps.ready(function() {
    var map = new ymaps.Map('yandex-map', {
        center: [54.475825, 26.382442],
        zoom: 15
    });
    
    var myPlacemark = new ymaps.Placemark([54.475825, 26.382442], {}, {
        preset: 'islands#redDotIconWithCaption'
    });
    
    map.geoObjects.add(myPlacemark);
    map.controls.remove('geolocationControl');
    map.controls.remove('searchControl');
    map.controls.remove('trafficControl');
    map.controls.remove('typeSelector');
    map.controls.remove('fullscreenControl');
    map.controls.remove('rulerControl');
}); 