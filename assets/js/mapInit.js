function initializeMap() {
    var mymap = L.map('mapid').setView([40.6942, -73.9866], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data &copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
        maxZoom: 18,
    }).addTo(mymap);
    var marker = L.marker([40.6942, -73.9866]).addTo(mymap);

    // Invalidate size and re-center the map
    mymap.invalidateSize(true); // Passing true to ensure a full invalidation
    mymap.setView([40.6942, -73.9866], 15);
}
