// Create a new file named translations.js and include the following:

const translations = {
    header: {
        en: 'MTA Elevator Accessibility Status',
        es: 'Estado de Accesibilidad del Ascensor de la MTA',
        fr: 'État de l'Accessibilité des Ascenseurs MTA',
        // Add more languages as necessary
    },
    // Add more translation keys and values as needed
};


function setLanguage(lang) {
    document.querySelectorAll('[data-translate]').forEach(elem => {
        const key = elem.getAttribute('data-translate');
        elem.textContent = translations[lang][key];
    });
}
