document.addEventListener('DOMContentLoaded', function() {
    const statusDisplay = document.getElementById('service-alerts-status');

    // ... keep your translations and add any new necessary ones for service alerts

    async function fetchServiceAlerts() {
        const url = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/camsys%2Fall-alerts.json';
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            const data = await response.json();
            displayServiceAlerts(data);
        } catch (error) {
            statusDisplay.innerHTML = `Failed to load data: ${error.message}`;
        }
    }
    
    function displayServiceAlerts(alertsData) {
        statusDisplay.innerHTML = '';  // Clear existing content

        // Here, adapt this to the structure of the service alerts data
        alertsData.forEach((alert) => {
            const div = document.createElement('div');
            div.className = 'service-alert-entry';
            // Update this innerHTML setup according to how the alert data is structured
            div.innerHTML = `
                <h2 data-translate="alertTitle">${alert.title}</h2>
                <p><strong data-translate="description">Description:</strong> ${alert.description}</p>
                <p><strong data-translate="updatedAt">Updated At:</strong> ${alert.updatedAt}</p>
                // Add more elements as needed based on the alert data structure
            `;
            statusDisplay.appendChild(div);
        });

        // Translate the page content after it has been added
        translatePage(document.getElementById('language-selector').value);
    }
    
    function translatePage(language) {
        // Keep the same translation function as before
        // ...
    }

    // Keep the language selector event listener as before
    // ...

    // Initial fetch and display of service alerts
    fetchServiceAlerts();
});
