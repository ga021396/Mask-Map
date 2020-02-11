var crd;

function showDate() {
  var d = new Date();
  var year = d.getFullYear();
  var month = d.getMonth() + 1;
  var day = d.getUTCDate();

  var weekday = new Array(7);
  weekday[0] = "Sunday";
  weekday[1] = "Monday";
  weekday[2] = "Tuesday";
  weekday[3] = "Wednesday";
  weekday[4] = "Thursday";
  weekday[5] = "Friday";
  weekday[6] = "Saturday";

  var n = weekday[d.getDay()];

  document.getElementsByClassName(
    "day"
  )[0].innerHTML = `${year}-${month}-${day}`;
  document.getElementsByClassName("whichWeek")[0].innerHTML = n;

  if (n === "Monday" || n === "Wednesday" || n === "Friday") {
    document.getElementsByClassName("tip")[0].innerHTML =
      "身分證末一碼" +
      '<span style="color:#C80000;padding:0 4px;">基數</span>' +
      "字號者可購買口罩";
  } else if (n === "Tuesday" || n === "Thursday" || n === "Saturday") {
    document.getElementsByClassName("tip")[0].innerHTML =
      "身分證末一碼" +
      '<span style="color:#C80000;padding:0 4px;">偶數</span>' +
      "字號者可購買口罩";
  } else {
    document.getElementsByClassName("tip")[0].innerHTML =
      "今天大家都可以買口罩";
  }
}

showDate();

function error(err) {
  console.log(err);
}

var options = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 0
};

var map = L.map("map", {
  center: [25.04207, 121.543482],
  zoom: 16
});
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var greenIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
var redIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var blueIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

var markers = new L.MarkerClusterGroup().addTo(map);

var xhr = new XMLHttpRequest();
xhr.open(
  "get",
  "https://raw.githubusercontent.com/kiang/pharmacies/master/json/points.json"
);
xhr.send();
xhr.onload = function() {
  var data = JSON.parse(xhr.responseText).features;
  for (let i = 0; data.length > i; i++) {
    var mask;
    if (data[i].properties.mask_adult == 0) {
      mask = redIcon;
    } else {
      mask = greenIcon;
    }
    markers.addLayer(
      L.marker(
        [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]],
        { icon: mask }
      ).bindPopup(
        "<h1>" +
          data[i].properties.name +
          "</h1>" +
          "<p>成人口罩數量" +
          data[i].properties.mask_adult +
          "</p>"
      )
    );
  }

  map.addLayer(markers);
};

function getMyLocation() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      var myLoc;
      myLoc = pos.coords;
      markers
        .addLayer(
          L.marker([myLoc.latitude, myLoc.longitude], {
            icon: blueIcon
          }).bindPopup("<h1>" + "</h1>" + "<p>my position" + "</p>")
        )
        .openPopup();
      map.addLayer(markers);
      map.setView([myLoc.latitude, myLoc.longitude]);
    },
    error,
    options
  );
}

document
  .getElementsByClassName("icon")[0]
  .addEventListener("click", getMyLocation);

