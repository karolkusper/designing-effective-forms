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
        // Ustaw wartość w polu kraju – przyjmujemy, że zmieniasz select na input z datalist (patrz pkt. 4)
        const countryInput = document.getElementById('country');
        countryInput.value = country;
        // Wywołanie funkcji pobierającej kod kierunkowy
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
        // Załóżmy, że korzystamy tylko z pierwszego dopasowania i jednego suffixu
        const countryCode = data[0].idd.root + data[0].idd.suffixes[0];
        // Ustawienie wybranego kodu w polu kierunkowym
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
  
  // Wywołaj funkcję getCountryByIP przy inicjalizacji formularza
  (() => {
    document.addEventListener('click', handleClick);
    fetchAndFillCountries();
    getCountryByIP();
  })();
  



  // Skróty klawiaturowe dla formularza

document.addEventListener('keydown', function(event) {
  // Przechwytuj naciśnięcie klawisza Enter
  // Upewnij się, że focus nie znajduje się w textarea, aby nie przeszkadzać przy wpisywaniu nowej linii
  if (event.key === "Enter" && document.activeElement.tagName !== "TEXTAREA") {
    event.preventDefault(); // zapobiega domyślnej akcji (np. dodaniu nowej linii lub niezamierzonemu przesłaniu formularza)
    document.getElementById('form').submit();
  }
  
  // Skrót: Ctrl+S – wysłanie formularza i zapobieżenie domyślnej akcji zapisu przeglądarki
  if (event.key === "s" && event.ctrlKey) {
    event.preventDefault();
    document.getElementById('form').submit();
  }
  
  // Skrót: Escape – resetowanie formularza
  if (event.key === "Escape") {
    event.preventDefault();
    document.getElementById('form').reset();
  }
});
