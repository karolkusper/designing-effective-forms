let clickCount = 0;

const countryInput = document.getElementById('country');
const myForm = document.getElementById('form');
const modal = document.getElementById('form-feedback-modal');
const clicksInfo = document.getElementById('click-count');

function handleClick() {
  clickCount++;
  clicksInfo.innerText = clickCount;
}

async function fetchAndFillCountries() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok) {
      throw new Error('Błąd pobierania danych');
    }
    const data = await response.json();
    const countries = data.map(country => country.name.common).sort();
    const countriesList = document.getElementById('countriesList');
    countriesList.innerHTML = countries.map(country => `<option value="${country}">`).join('');
  } catch (error) {
    console.error('Wystąpił błąd:', error);
  }
}

function getCountryByIP() {
  fetch('https://get.geojs.io/v1/ip/geo.json')
    .then(response => response.json())
    .then(data => {
      const country = data.country;
      // Ustaw wartość w polu kraju
      const countryInput = document.getElementById('country');
      countryInput.value = country;
      // Pobierz kod kierunkowy
      getCountryCode(country);
    })
    .catch(error => {
      console.error('Błąd pobierania danych z serwera GeoJS:', error);
    });
}

function getCountryCode(countryName) {
  const apiUrl = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
  fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Błąd pobierania danych');
      }
      return response.json();
    })
    .then(data => {
      // Zakładamy, że korzystamy z pierwszego dopasowania oraz jednego suffixu
      const countryCode = data[0].idd.root + data[0].idd.suffixes[0];
      const countryCodeSelect = document.getElementById('countryCode');
      for (let option of countryCodeSelect.options) {
        if (option.value === countryCode) {
          option.selected = true;
          break;
        }
      }
    })
    .catch(error => {
      console.error('Wystąpił błąd:', error);
    });
}
  
// Dodajemy walidację przy wysłaniu formularza
myForm.addEventListener('submit', function(event) {
  if (!myForm.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
    alert("Formularz zawiera błędy. Proszę poprawić dane.");
  }
  myForm.classList.add('was-validated');
});
  
// Obsługa skrótów klawiaturowych
document.addEventListener('keydown', function(event) {
  // Skrót: Enter (poza textarea)
  if (event.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
    event.preventDefault();
    if (myForm.checkValidity()) {
      if (typeof myForm.requestSubmit === "function") {
        myForm.requestSubmit();
      } else {
        myForm.submit();
      }
    } else {
      alert("Formularz zawiera błędy. Proszę poprawić dane.");
    }
  }
  
  // Skrót: Ctrl+S – wysłanie formularza i zapobieżenie domyślnej akcji zapisu
  if (event.key === "s" && event.ctrlKey) {
    event.preventDefault();
    if (myForm.checkValidity()) {
      if (typeof myForm.requestSubmit === "function") {
        myForm.requestSubmit();
      } else {
        myForm.submit();
      }
    } else {
      alert("Formularz zawiera błędy. Proszę poprawić dane.");
    }
  }
  
  // Skrót: Escape – resetowanie formularza
  if (event.key === "Escape") {
    event.preventDefault();
    myForm.reset();
  }
});
  
// Inicjalizacja funkcji przy starcie
(() => {
  document.addEventListener('click', handleClick);
  fetchAndFillCountries();
  getCountryByIP();
})();
