window.onload = () =>{ 
 
}
var map;
var markers = [];
var infoWindow;

function initMap() {
    var losAngeles = {
        lat: 34.0522,
        lng: -118.2437
        };
    map = new google.maps.Map(document.getElementById('map'), {
      center: losAngeles,
      zoom: 11,
      mapTypeId: 'roadmap', 
    
    });      
    infoWindow = new google.maps.InfoWindow();
    searchStores();      
    getWeather();
  }

  function displayStore(stores){
    var stringHtml = '';
    
    for(var [i,store] of stores.entries()){
      
      var phone = store.phoneNumber;
      var address = store.addressLines;
      stringHtml+= `
          <div class="store-container">
          <div class = "store-back">
            <div class="store-info-container">                   
              <div class="store-address">
                <span>${address[0]}</span>
                <span>${address[1]}</span> 
              </div>
                  <div class="store-phone-number">${[phone]}</div>  
              </div>  
                             
                <div class="store-number-container">
                  <div class="store-number">
                    ${i+1}
                  </div>
                  </div>
              </div>
          </div>      
      `
           
      document.querySelector('.stores-list').innerHTML = stringHtml;
    }
  }

    function showStores(stores){
      var bounds = new google.maps.LatLngBounds();
      for(var [i,store] of stores.entries()){
        var address = store.addressLines[0];
        var name = store.name;
        var phone = store.phoneNumber;
        var openStatus = store.openStatusText;
        var latlng = new google.maps.LatLng(
          store.coordinates.latitude,
          store.coordinates.longitude);
        checkMarkers(address,name,latlng,i+1,phone,openStatus);
        bounds.extend(latlng);
      }
      map.fitBounds(bounds);
  }

    function checkMarkers(address,name,latlng,i,phone,openStatus){
      var html = '<font size = "3"><b>' + name + '</b></font> <br/><br/>'+openStatus+'<br/><br/> <i class="fas fa-map-marked-alt"></i><a href="https://www.google.com/maps/place/Los+Angeles,+CA,+USA/@34.0201613,-118.6919205,10z/data=!3m1!4b1!4m5!3m4!1s0x80c2c75ddc27da13:0xe22fdf6f254608f4!8m2!3d34.0522342!4d-118.2436849" target = "_blank">' + address + '</a><br/><br/> <i class="fas fa-phone-square-alt"></i> ' + phone;
          var marker = new google.maps.Marker({
            map: map,
            position: latlng,
            label : i.toString()
          });
          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.setContent(html);
            infoWindow.open(map, marker);
          });
          markers.push(marker);
}



function setOnClickListener(){
  var storeEl  = document.querySelectorAll('.store-container');
  storeEl.forEach(function(curr,index){
    curr.addEventListener('click',function(){
      new google.maps.event.trigger(markers[index],'click');
    });

  });
}

function searchStores(){
  var zip = document.getElementById('zipcode').value;
  var foundStores = [];
  if(zip){
    for(var store of stores)    {
      if(zip == store.address.postalCode.substr(0,5)){
        foundStores.push(store);
      }
    }
  }
  else{
    foundStores = stores;
  }
  clearMarker();
  displayStore(foundStores);
  showStores(foundStores);
  setOnClickListener();
} 

function clearMarker(){
  infoWindow.close();
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  markers.length = 0;
}

function getWeather(){
  fetch('https://cors-anywhere.herokuapp.com/https://www.metaweather.com/api/location/2487956/')
            .then(result => {
                // console.log(result);
                return result.json();
            })
            .then(data => {
                const today = data.consolidated_weather[0];
                const state = today.weather_state_name;
                const temp = today.the_temp;
                
                document.querySelector('#state').innerHTML = `State : ${state}`;
                document.querySelector('#temp ').innerHTML = `Temperature : ${temp}&#8451`;
            })
            .catch(error => console.log(error));
}

addEventListener('keypress',(event) => {

  if (event.keyCode === 13){
    searchStores();
  }
});