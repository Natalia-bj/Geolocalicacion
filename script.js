// Inicializar el mapa en Burgos
var map = L.map('map').setView([40.697276266621294, -3.649161889887422], 6);

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
    },
    "Catedral del Leon" : {
        lat: 42.59944444, lon: -5.56666667,
        descripcion: "La catedral de Santa María de Regla de León es un templo de culto católico, sede episcopal de la diócesis de León"
    },
    "Catedral de Salamanca":{
        lat: 40.96069, lon: -5.666,
        descripcion: " Es un importante monumento histórico y religioso en España, destacando por su rica historia y su impresionante arquitectura"
    },
    "Monasterio Avila":{
        lat: 40.6505, lon: - 4.6889,
        descripcion: "Edificio de estilo gótico fundada en 1480 por los Reyes Católicos"
    },
    "Cristo del Otero":{  //palencia
        lat: 42.0283, lon:  -4.52944,
        descripcion: "Escultura que representa a Jesucristo en actitud bendiciente creada por Victorio Macho"
    },
    "Monumento a Colon":{ //valladolid
        lat: 41.64444444, lon:  -4.7275,
        descripcion: "Inaugurado en 1905, es una escultura monumental que rinde homenaje al navegante Cristóbal Colón y se encuentra en la Plaza de Colón."
    },
    "Concatedral de Soria":{
        lat: 41.76604, lon:  -2.459038,
        descripcion: " Templo cristiano de estilo románico ubicado en la ciudad de Soria. Desde 1959 acumula el título de concatedral."
    },
    "Catedral de Zamora":{
        lat: 41.498889, lon:  -5.754444,
        descripcion: "La Catedral de Zamora, dedicada al Salvador, es un destacado ejemplo del arte románico en España y un símbolo de la ciudad, conocida por su impresionante cúpula gallonada. "
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
            .bindPopup(`<b>${address}</b>`)
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
