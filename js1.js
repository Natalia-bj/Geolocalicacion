// Inicializar el mapa en Burgos
var map = L.map('map').setView([42.3408, -3.70447], 30);

// Añadir la capa de OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Base de datos local de monumentos
var monumentos = {
    "Catedral de Burgos": {
        lat: 42.3408, lon: -3.70447,
        descripcion: "La Catedral de Burgos es una obra maestra del gótico español y Patrimonio de la Humanidad por la UNESCO."
    },
    "Acueducto de Segovia": {
        lat: 40.9481, lon: -4.1184,
        descripcion: "El Acueducto de Segovia es una obra maestra de la ingeniería romana con más de 2.000 años de historia."
    }
};

function searchLocation() {
    var address = document.getElementById('address').value.trim();

    if (address === "") {
        alert("Por favor, introduce una dirección.");
        return;
    }

    // Si la ubicación está en la base de datos, usamos sus coordenadas y descripción
    if (monumentos[address]) {
        var monumento = monumentos[address];

        map.setView([monumento.lat, monumento.lon], 15);

        L.marker([monumento.lat, monumento.lon]).addTo(map)
            .bindPopup(`<b>${address}</b><br>${monumento.descripcion}`)
            .openPopup();

        document.getElementById('info').innerHTML = `<h3>${address}</h3><p>${monumento.descripcion}</p>`;

    } else {
        // Si no está en la base de datos, buscamos en OpenStreetMap
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${address}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    var lat = parseFloat(data[0].lat);
                    var lon = parseFloat(data[0].lon);

                    map.setView([lat, lon], 15);

                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`<b>${address}</b><br>Ubicación encontrada, pero no tenemos información detallada.`)
                        .openPopup();

                    document.getElementById('info').innerHTML = `<h3>${address}</h3><p>No hay información disponible sobre este lugar.</p>`;
                } else {
                    alert('Ubicación no encontrada.');
                }
            })
            .catch(error => {
                console.error("Error en la búsqueda:", error);
                alert("Hubo un problema con la búsqueda.");
            });
    }
}
