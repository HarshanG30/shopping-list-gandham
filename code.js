const form = document.getElementById('add-item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('shopping-list');
const clearBtn = document.getElementById('clear-all');
const searchBar = document.getElementById('search-bar');
let editMode = false;

document.addEventListener('DOMContentLoaded', displayItems);

// Display items from local storage
function displayItems() {
    const items = getItemsFromStorage();
    items.forEach(item => addItemToDOM(item));
    toggleUI();
}

// Add item
form.addEventListener('submit', e => {
    e.preventDefault();
    const newItem = itemInput.value.trim();

    if (!newItem) {
        alert('Please enter an item');
        return;
    }

    if (editMode) {
        const itemToEdit = document.querySelector('.edit-mode');
        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        editMode = false;
    } else if (itemExists(newItem)) {
        alert('Item already exists');
        return;
    }

    addItemToDOM(newItem);
    addItemToStorage(newItem);

    itemInput.value = '';
    toggleUI();
});

// Add item to DOM
function addItemToDOM(item) {
    const li = document.createElement('li');
    li.textContent = item;
    const deleteBtn = createDeleteButton();
    li.appendChild(deleteBtn);
    itemList.appendChild(li);
}

// Create delete button
function createDeleteButton() {
    const button = document.createElement('button');
    button.className = 'btn-delete';
    button.innerHTML = '<i class="fa-solid fa-trash"></i>';
    return button;
}

// Delete item
itemList.addEventListener('click', e => {
    if (e.target.closest('.btn-delete')) {
        const item = e.target.closest('li');
        removeItem(item);
    } else {
        setEditMode(e.target.closest('li'));
    }
});

// Set edit mode
function setEditMode(item) {
    editMode = true;
    itemInput.value = item.textContent.trim();
    item.classList.add('edit-mode');
}

// Check if item exists
function itemExists(item) {
    const items = getItemsFromStorage();
    return items.includes(item);
}

// Remove item
function removeItem(item) {
    if (confirm('Are you sure you want to remove this item?')) {
        removeItemFromStorage(item.textContent.trim());
        item.remove();
        toggleUI();
    }
}

// Remove item from storage
function removeItemFromStorage(item) {
    let items = getItemsFromStorage();
    items = items.filter(i => i !== item);
    localStorage.setItem('items', JSON.stringify(items));
}

// Clear all items
clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all items?')) {
        itemList.innerHTML = '';
        localStorage.removeItem('items');
        toggleUI();
    }
});

// Filter items
searchBar.addEventListener('input', e => {
    const searchText = e.target.value.toLowerCase();
    document.querySelectorAll('#shopping-list li').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(searchText) ? 'flex' : 'none';
    });
});

// Get items from storage
function getItemsFromStorage() {
    return localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];
}

// Add item to storage
function addItemToStorage(item) {
    const items = getItemsFromStorage();
    items.push(item);
    localStorage.setItem('items', JSON.stringify(items));
}

// Toggle UI based on item count
function toggleUI() {
    if (itemList.children.length === 0) {
        clearBtn.style.display = 'none';
        searchBar.style.display = 'none';
    } else {
        clearBtn.style.display = 'block';
        searchBar.style.display = 'block';
    }
}
