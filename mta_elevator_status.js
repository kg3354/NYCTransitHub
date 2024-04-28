document.addEventListener('DOMContentLoaded', function() {
    const statusDisplay = document.getElementById('elevator-status');
    const translations = {
        station: {
            en: 'Station',
            es: 'Estación',
            zh: '车站'
        },
        trainLines: {
            en: 'Train Lines',
            es: 'Líneas de Tren',
            zh: '火车线路'
        },
        serving: {
            en: 'Serving',
            es: 'Sirviendo',
            zh: '服务'
        },
        adaCompliant: {
            en: 'ADA Compliant',
            es: 'Cumple con ADA',
            zh: '符合ADA'
        },
        active: {
            en: 'Active',
            es: 'Activo',
            zh: '活跃'
        },
        description: {
            en: 'Description',
            es: 'Descripción',
            zh: '描述'
        },
        busConnections: {
            en: 'Bus Connections',
            es: 'Conexiones de autobús',
            zh: '巴士连接'
        },
        alternativeRoutes: {
            en: 'Alternative Routes',
            es: 'Rutas Alternativas',
            zh: '替代路线'
        },
        yes: {
            en: 'Yes',
            es: 'Sí',
            zh: '是'
        },
        no: {
            en: 'No',
            es: 'No',
            zh: '否'
        },
        none: {
            en: 'None',
            es: 'Ninguno',
            zh: '无'
        }
    };
    

    async function fetchElevatorStatus() {
        const url = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fnyct_ene_equipments.json';
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            displayElevatorStatus(data);
        } catch (error) {
            statusDisplay.innerHTML = `Failed to load data: ${error.message}`;
        }
    }
    
    function displayElevatorStatus(elevatorData) {
        statusDisplay.innerHTML = '';  
    
        elevatorData.forEach((elevator) => {
            const div = document.createElement('div');
            div.className = 'elevator-entry';
            div.innerHTML = `
                <h2 data-translate="station">${elevator.station} - Equipment #${elevator.equipmentno}</h2>
                <p><strong data-translate="trainLines">Train Lines:</strong> ${elevator.trainno}</p>
                <p><strong data-translate="serving">Serving:</strong> ${elevator.serving}</p>
                <p><strong data-translate="adaCompliant">ADA Compliant:</strong> ${elevator.ADA === 'Y' ? '<span data-translate="yes">Yes</span>' : '<span data-translate="no">No</span>'}</p>
                <p><strong data-translate="active">Active:</strong> ${elevator.isactive === 'Y' ? '<span data-translate="yes">Yes</span>' : '<span data-translate="no">No</span>'}</p>
                <p><strong data-translate="description">Description:</strong> ${elevator.shortdescription}</p>
                <p><strong data-translate="busConnections">Bus Connections:</strong> ${elevator.busconnections || '<span data-translate="none">None</span>'}</p>
                <p><strong data-translate="alternativeRoutes">Alternative Routes:</strong> ${elevator.alternativeroute}</p>
            `;
            statusDisplay.appendChild(div);
        });
        translatePage(document.getElementById('language-selector').value);
    }
    
    function translatePage(language) {
        document.querySelectorAll('[data-translate]').forEach((element) => {
            const key = element.getAttribute('data-translate');
            if (translations[key] && translations[key][language]) {
                element.textContent = translations[key][language];
            }
        });
    }

    document.getElementById('language-selector').addEventListener('change', function() {
        translatePage(this.value);
    });

    fetchElevatorStatus();
});