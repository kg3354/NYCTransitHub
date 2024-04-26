document.addEventListener('DOMContentLoaded', function() {
    const statusDisplay = document.getElementById('service-alerts-status');

    async function fetchServiceAlerts() {
        const url = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fsubway-alerts.json';
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Alerts data:', data); 
            displayServiceAlerts(data);
            
        } catch (error) {
            statusDisplay.innerHTML = `Failed to load data: ${error.message}`;
        }
    }    
    
    function displayServiceAlerts(alertsData) {
        statusDisplay.innerHTML = ''; 
    
        if (Array.isArray(alertsData) && alertsData.length > 0) {
            alertsData.forEach((alert) => {
                const div = document.createElement('div');
                div.className = 'service-alert-entry';
                div.style.backgroundColor = '#f4f4f4'; 
                div.style.border = '1px solid #ddd';
                div.style.borderRadius = '5px';
                div.style.padding = '10px'; 
    
                div.innerHTML = `
                    <h2>${alert.title}</h2>
                    <p>${alert.description}</p>
                    <p>Updated At: ${alert.updatedAt}</p>
                `;
                statusDisplay.appendChild(div);
            });
        } else {
            statusDisplay.innerHTML = 'No active alerts.';
        }
    }

    fetchServiceAlerts();
});
