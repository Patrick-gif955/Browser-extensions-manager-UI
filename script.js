'use strict';
document.querySelector('.img').addEventListener('click', function () {
  document.querySelector('body').classList.toggle('light-mode');
});

let extensionsData = [];

let currentFilter = 'all';

function fetchExtensions() {
  fetch('data.json')
    .then(response => {
      return response.json();
    })
    .then(data => {
      console.log('Extensions loaded:', data);
      extensionsData = data;
      renderExtensions();
    })
    .catch(error => {
      console.error('Error loading extensions data:', error);
    });
}

function createExtensionCard(extension) {
  const div = document.createElement('div');
  div.className = 'div';

  div.setAttribute('data-id', extension.id);

  div.setAttribute('data-status', extension.isActive ? 'active' : 'inactive');

  div.innerHTML = `<div class = "header">
  <img src="${extension.logo}" alt ="${extension.name} Logo" />
  <div class="main">
  <h4>${extension.name}</h4>
  <p>${extension.description}</p>
  </div>
  </div>
  <div class="footer">
  <button class = "remove-btn"}"> Remove</button>
  <div class = "toggle">
  <input type = "checkbox" name = "checkbox" id = "checkbox${extension.id}" ${
    extension.isActive ? 'checked' : ''
  }/>
  <label for="checkbox${extension.id}" class="slider"></label>
  </div>
  </div>
  `;
  return div;
}

function renderExtensions() {
  const container = document.querySelector('.container');
  container.innerHTML = '';

  let filteredExtensions = extensionsData;
  if (currentFilter === 'active') {
    filteredExtensions = extensionsData.filter(ext => ext.isActive);
  } else if (currentFilter === 'inactive') {
    filteredExtensions = extensionsData.filter(ext => ext.isActive === false);
  }

  filteredExtensions.forEach(extension => {
    const card = createExtensionCard(extension);
    container.appendChild(card);
  });

  attachEventListeners();
}

function attachEventListeners() {
  const removeButtons = document.querySelectorAll('.remove-btn');
  removeButtons.forEach(button => {
    button.addEventListener('click', function (e) {
      const card = e.target.closest('.div');
      const extensionId = parseInt(card.getAttribute('data-id'));

      removeExtension(extensionId);
    });
  });

  const toggleInputs = document.querySelectorAll(
    '.toggle input[type="checkbox"]'
  );
  toggleInputs.forEach(input => {
    input.addEventListener('change', function (e) {
      const card = e.target.closest('.div');
      const extensionId = parseInt(card.getAttribute('data-id'));

      toggleExtensionStatus(extensionId, e.target.checked);
    });
  });
}

function removeExtension(id) {
  const index = extensionsData.findIndex(ext => ext.id === id);

  if (index !== -1) {
    extensionsData.splice(index, 1);

    renderExtensions();
  }
}

function toggleExtensionStatus(id, isActive) {
  const extension = extensionsData.find(ext => ext.id === id);

  if (extension) {
    extension.isActive = isActive;

    const card = document.querySelector(`.div[data-id="${id}"]`);
    if (card) {
      card.setAttribute('data-status', isActive ? 'active' : 'inactive');
    }

    if (currentFilter !== 'all') {
      renderExtensions();
    }
  }
}

const filterButtons = document.querySelectorAll('.hero .btn button');

filterButtons.forEach(button => {
  button.addEventListener('click', function () {
    filterButtons.forEach(btn => btn.classList.remove('btn-active'));

    this.classList.add('btn-active');

    const filterText = this.textContent.trim().toLowerCase();
    currentFilter = filterText;

    renderExtensions();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  fetchExtensions();

  document.querySelector('.hero .btn button').classList.add('btn-active');
});
