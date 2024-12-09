// Функция для получения клиентов с сервера
const searchClients = () => {
    const name = document.getElementById('name').value;
    const district = document.getElementById('district').value;
    const plan = document.getElementById('plan').value;
    const status = document.getElementById('status').value;

    fetch(`/clients?name=${name}&district=${district}&plan=${plan}&status=${status}`)
        .then(response => response.json())
        .then(clients => {
            const clientsList = document.getElementById('clients-list');
            clientsList.innerHTML = '';
            clients.forEach(client => {
                const clientDiv = document.createElement('div');
                clientDiv.classList.add('client');
                clientDiv.innerHTML = `
                    <p><strong>Ім'я:</strong> ${client.name}</p>
                    <p><strong>Адреса:</strong> ${client.address}</p>
                    <p><strong>Район:</strong> ${client.district}</p>
                    <p><strong>План:</strong> ${client.plan}</p>
                    <p><strong>Статус:</strong> ${client.status}</p>
                    <button onclick="editClient(${client.id})">Редагувати</button>
                    <button onclick="deleteClient(${client.id})">Видалити</button>
                `;
                clientsList.appendChild(clientDiv);
            });
        });
};

// Функция для сброса фильтра
const resetSearch = () => {
    document.getElementById('name').value = '';
    document.getElementById('district').value = '';
    document.getElementById('plan').value = '';
    document.getElementById('status').value = '';
    searchClients();
};

// Функция для добавления клиента
document.getElementById('add-client-form-submit').addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('new-name').value;
    const address = document.getElementById('new-address').value;
    const district = document.getElementById('new-district').value;
    const plan = document.getElementById('new-plan').value;
    const status = document.getElementById('new-status').value;

    fetch('/clients', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, address, district, plan, status })
    })
    .then(response => response.json())
    .then(data => {
        alert('Клієнт доданий');
        resetSearch();
        toggleAddClientForm();  // Закрыть форму после добавления
    });
});

// Функция для редактирования клиента
const editClient = (id) => {
    const name = prompt("Введіть нове ім'я:");
    const address = prompt("Введіть нову адресу:");
    const district = prompt("Виберіть новий район:", "Київський");
    const plan = prompt("Введіть новий план:");
    const status = prompt("Виберіть новий статус:", "активний");

    fetch(`/clients/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, address, district, plan, status })
    })
    .then(response => response.json())
    .then(data => {
        alert('Клієнт оновлений');
        resetSearch();
    });
};

// Функция для удаления клиента
const deleteClient = (id) => {
    if (confirm("Ви впевнені, що хочете видалити цього клієнта?")) {
        fetch(`/clients/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert('Клієнт видалений');
            resetSearch();
        });
    }
};

// Функция для показа/скрытия формы добавления клиента
const toggleAddClientForm = () => {
    const form = document.getElementById('add-client-form');
    form.style.display = form.style.display === 'none' || form.style.display === '' ? 'flex' : 'none';
};

// Инициализируем поиск при загрузке страницы
document.addEventListener('DOMContentLoaded', searchClients);
