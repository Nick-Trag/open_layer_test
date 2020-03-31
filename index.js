import 'ol/ol.css';
import { Map, View, Overlay } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/Style';

const map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([23.9, 38.5]),
        zoom: 6
    })
});

const iconFeature = new Feature({
    geometry: new Point(fromLonLat([22.996395, 40.601068])),
    name: 'Home'
});

const iconStyle = new Style({
    image: new Icon({
        anchorOrigin: 'bottom-left',
        anchor: [0.5, 0],
        src: 'map-pin.2b2a3436.png'
    })
});

// iconFeature.setStyle(iconStyle);

const home = new VectorLayer({
    source: new VectorSource({
        features: [
            iconFeature
        ]
    }),
    style: iconStyle
});
map.addLayer(home);


// POPUP BEGIN


let popupElement = document.getElementById('popup');

let popup = new Overlay({
    element: popupElement,
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -25]
});

map.addOverlay(popup);

map.on('click', (event) => {
    let feature = map.forEachFeatureAtPixel(event.pixel, (feature) => {
        return feature;
    });

    if (feature) {
        let coordinates = feature.getGeometry().getCoordinates();

        popup.setPosition(coordinates);
        $(popupElement).popover({
            placement: 'top',
            html: true,
            content: feature.get('name')
        });
        $(popupElement).popover('show');
    }
    else {
        $(popupElement).popover('destroy');
    }
});

map.on('pointermove', (event) => {
    if (event.dragging) {
        $(popupElement).popover('destroy');
    }
    else {
        let pixel = map.getEventPixel(event.originalEvent);
        let hit = map.hasFeatureAtPixel(pixel);
        document.getElementById('map').style.cursor = hit ? 'pointer' : '';
    }
});
