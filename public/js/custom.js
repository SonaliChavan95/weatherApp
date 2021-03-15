document.addEventListener('DOMContentLoaded', () => {
  // Handler for .ready() called.

  document.querySelector('#city-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const url = form.action;
    const data = { city: form.getElementsByTagName('input')[0].value };
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    });

    const weatherInfo = await response.json();
    let message;
    if (response.status === 200) {
      document.title = weatherInfo.city;
      message = weatherInfo.data;
    } else {
      message = weatherInfo.message;
    }

    document.getElementById('single-results').innerHTML = message;
    return weatherInfo;
  });

  document.querySelector('#cities-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const url = form.action;
    const selectElement = document.getElementById('cities');
    const selectedValues = Array.from(selectElement.selectedOptions)
      .map((option) => option.value);
    const data = { cities: selectedValues };
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    });
    const weatherInfo = await response.json();
    document.title = 'My Weather App';
    document.getElementById('multiple-results').innerHTML = weatherInfo.data;
    return weatherInfo;
  });

  function openTab(evt, cityName) {
    // Declare all variables
    let i;

    // Get all elements with class="tabcontent" and hide them
    const tabcontent = document.getElementsByClassName('tabcontent');
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = 'none';
    }

    // Get all elements with class="tablinks" and remove the class "active"
    const tablinks = document.getElementsByClassName('tablinks');
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(' active', '');
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(cityName).style.display = 'block';
    evt.currentTarget.className += ' active';
  }

  document.querySelectorAll('.tablinks').forEach(item => {
    item.addEventListener('click', event => {
      openTab(event, event.target.dataset.tab);
    });
  });

  function trigger() {
    document.querySelector('.tablinks').click();
  }

  trigger();
});
