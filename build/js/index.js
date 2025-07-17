const API_BASE = 'https://mueangchon1.onrender.com';

const namesUl = document.getElementById('names-ul');
const booksUl = document.getElementById('books-ul');
const loadingDiv = document.getElementById('loading');
const errorDiv = document.getElementById('error');
const searchInput = document.getElementById('search-input');

window.addEventListener('DOMContentLoaded', () => {
  fetchUsers();
  fetchBooks();

  searchInput.addEventListener('input', handleSearch);
});

async function fetchUsers() {
  loadingDiv.style.display = 'block';
  try {
    const res = await fetch(`${API_BASE}/users`, {
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) {
      renderUsers(data.users || []);
    } else {
      showError(data.error || 'เกิดข้อผิดพลาดในการโหลดผู้ใช้');
    }
  } catch (err) {
    showError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
  } finally {
    loadingDiv.style.display = 'none';
  }
}

async function fetchBooks() {
  loadingDiv.style.display = 'block';
  try {
    const res = await fetch(`${API_BASE}/books`, {
      credentials: 'include'
    });

    const data = await res.json();
    if (res.ok) {
      renderBooks(data.books || []);
    } else {
      showError(data.error || 'เกิดข้อผิดพลาดในการโหลดหนังสือ');
    }
  } catch (err) {
    showError('ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์');
  } finally {
    loadingDiv.style.display = 'none';
  }
}

function renderUsers(users) {
  namesUl.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.name} (${user.username})`;
    namesUl.appendChild(li);
  });
}

let allBooks = []; // เก็บไว้สำหรับค้นหา

function renderBooks(books) {
  allBooks = books;
  showFilteredBooks(books);
}

function showFilteredBooks(books) {
  booksUl.innerHTML = '';
  books.forEach(book => {
    const li = document.createElement('li');
    li.textContent = `📖 ${book.title} (${book.bookId})`;
    booksUl.appendChild(li);
  });
}

function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = allBooks.filter(book =>
    book.title.toLowerCase().includes(query) ||
    book.bookId.toLowerCase().includes(query)
  );
  showFilteredBooks(filtered);
}

function showError(message) {
  errorDiv.textContent = message;
  Swal.fire({
    icon: 'error',
    title: 'ผิดพลาด',
    text: message
  });
}
