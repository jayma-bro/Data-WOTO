let $map = document.querySelector('#map')
let $lat = document.querySelector('#latitude')
let $lng = document.querySelector('#longitude')

class LeafletMap {
  constructor () {
    this.map = null
  }
  async load (element) {
    return new Promise((resolve, reject) => {
      $script('https://unpkg.com/leaflet@1.7.1/dist/leaflet.js', () => {
        this.map = L.map(element).setView([46.783, 2.667], 5)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Wings Of The Ocean &copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
        }).addTo(this.map);
        resolve()
      })
    })
  }
}

const initMap = async function () {
  let map = new LeafletMap()
  await map.load($map)
  var popup = L.popup();
  function onMapClick(e) {
    $lat.value = e.latlng.lat.toFixed(7)
    $lng.value = e.latlng.lng.toFixed(7)
    popup
        .setLatLng(e.latlng)
        .setContent("Définir le lieu de dépollution ici")
        .openOn(map.map);
  }
  map.map.on('click', onMapClick);
}

if ($map !== null) {
  initMap()
}
