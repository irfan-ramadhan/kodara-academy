const navLinks = document.querySelectorAll('[data-view-link]');
const galleryView = document.querySelector('.gallery-view');
const registrationView = document.querySelector('.registration-view');
const mainNav = document.querySelector('.main-nav');
const menuToggle = document.querySelector('.menu-toggle');
const form = document.getElementById('registration-form');
const resultPanel = document.getElementById('result-panel');
const resultList = document.getElementById('result-list');
const toast = document.getElementById('toast');
let toastTimer;

function showView(viewName) {
  const showRegistration = viewName === 'daftar';
  galleryView.hidden = showRegistration;
  registrationView.hidden = !showRegistration;
  galleryView.classList.toggle('is-visible', !showRegistration);
  registrationView.classList.toggle('is-visible', showRegistration);

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle(
      'active',
      link.dataset.viewLink === (showRegistration ? 'daftar' : 'galeri')
    );
  });

  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  if (showRegistration) {
    document.getElementById('nik').focus({ preventScroll: true });
  }
}

// Navigasi galeri <-> pendaftaran.
navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const target = link.dataset.viewLink;
    if (!target) return;
    event.preventDefault();
    showView(target);
  });
});

// Menu navigasi untuk layar kecil.
menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

// NIK hanya menerima angka, maksimal 16 digit.
document.getElementById('nik').addEventListener('input', event => {
  event.target.value = event.target.value.replace(/\D/g, '').slice(0, 16);
});

// Nomor HP boleh diawali + dan mengandung spasi atau tanda hubung.
document.getElementById('hp').addEventListener('input', event => {
  event.target.value = event.target.value.replace(/[^\d+\s-]/g, '').slice(0, 15);
});

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

const fieldLabels = {
  nik: 'NIK',
  nama: 'Nama lengkap',
  gender: 'Jenis kelamin',
  hp: 'Nomor HP',
  alamat: 'Alamat lengkap',
  bahasa: 'Bahasa pemrograman diminati'
};

form.addEventListener('submit', event => {
  event.preventDefault();

  // Validasi semua kolom wajib, termasuk persetujuan.
  if (!form.reportValidity()) {
    showToast('Periksa kembali data yang wajib diisi.');
    return;
  }

  // NIK harus tepat 16 digit.
  const nikInput = document.getElementById('nik');
  const nik = nikInput.value.trim();
  if (!/^\d{16}$/.test(nik)) {
    nikInput.setCustomValidity('NIK harus terdiri dari tepat 16 digit angka.');
    nikInput.reportValidity();
    nikInput.setCustomValidity('');
    return;
  }

  // Nomor HP minimal 9 digit.
  const hpInput = document.getElementById('hp');
  const phone = hpInput.value.trim();
  if (phone.replace(/\D/g, '').length < 9) {
    hpInput.setCustomValidity('Nomor HP minimal terdiri dari 9 angka.');
    hpInput.reportValidity();
    hpInput.setCustomValidity('');
    return;
  }

  // Dialog konfirmasi yang diminta.
  const confirmed = window.confirm('Apakah Anda sudah yakin untuk menyimpan?');

  // Jika memilih Tidak/Cancel, jangan tampilkan hasil.
  if (!confirmed) {
    showToast('Pendaftaran belum disimpan. Silakan periksa data kembali.');
    return;
  }

  // Ambil nilai isian form setelah pengguna memilih Ya/OK.
  const values = Object.fromEntries(new FormData(form).entries());
  values.gender = document.getElementById('gender').value;
  values.bahasa = document.getElementById('bahasa').value;

  // Tampilkan hasil sesuai data yang diisi.
  resultList.replaceChildren();

  Object.entries(fieldLabels).forEach(([key, label]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');

    term.textContent = label;
    description.textContent = values[key] || '—';

    row.append(term, description);
    resultList.append(row);
  });

  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  showToast('Data pendaftaran berhasil ditampilkan.');
});

// Tombol Edit Data.
document.getElementById('edit-button').addEventListener('click', () => {
  resultPanel.hidden = true;
  document.getElementById('nama').focus();
  form.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Tombol Cetak Hasil.
document.getElementById('print-button').addEventListener('click', () => window.print());
