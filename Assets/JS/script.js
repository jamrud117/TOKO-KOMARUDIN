const STORAGE_KEY = "rekening-data";
const container = document.getElementById("rekeningContainer");

const bankInput = document.getElementById("bank");
const ownerInput = document.getElementById("owner");
const numberInput = document.getElementById("number");

let editIndex = null;

/* INIT */
function initData() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(rekeningList || []));
  }
}

function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

/* RENDER */
function renderRekening() {
  const keyword = document.getElementById("searchInput").value.toLowerCase();
  const data = getData();
  container.innerHTML = "";

  data.forEach((rek, i) => {
    const text = `${rek.bank} ${rek.owner} ${rek.number}`.toLowerCase();
    if (!text.includes(keyword)) return;

    container.innerHTML += `
      <div class="col-md-4">
        <div class="card rek-card p-4 text-center">
          <div class="fw-bold text-primary mb-1">${rek.bank}</div>
          <div class="text-muted">${rek.owner}</div>
          <div id="rek${i}" class="rek-number mb-3">${rek.number}</div>

          <div class="d-flex gap-2 justify-content-center">
            <button class="btn btn-primary btn-icon" onclick="copyRek('rek${i}')">
              <i class="bi bi-clipboard"></i>
            </button>
            <button class="btn btn-warning btn-icon" onclick="editRekening(${i})">
              <i class="bi bi-pencil"></i>
            </button>
            <button class="btn btn-danger btn-icon" onclick="hapusRekening(${i})">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
  });
}

/* CRUD */
function tambahRekening() {
  const bank = bankInput.value.trim();
  const owner = ownerInput.value.trim();
  const number = numberInput.value.trim();

  if (!bank || !owner || !number) {
    Swal.fire({
      icon: "error",
      title: "Oops!",
      text: "Semua field wajib diisi",
    });
    return;
  }

  const data = getData();

  if (editIndex !== null) {
    data[editIndex] = { bank, owner, number };
    editIndex = null;
    Swal.fire({
      icon: "success",
      title: "Data diperbarui",
      timer: 1200,
      showConfirmButton: false,
    });
  } else {
    data.push({ bank, owner, number });
    Swal.fire({
      icon: "success",
      title: "Rekening ditambahkan",
      timer: 1200,
      showConfirmButton: false,
    });
  }

  saveData(data);
  resetForm();
  renderRekening();

  bootstrap.Tab.getOrCreateInstance(
    document.querySelector('[data-bs-target="#tabRekening"]'),
  ).show();
}

function editRekening(index) {
  const rek = getData()[index];
  bankInput.value = rek.bank;
  ownerInput.value = rek.owner;
  numberInput.value = rek.number;
  editIndex = index;

  bootstrap.Tab.getOrCreateInstance(
    document.querySelector('[data-bs-target="#tabTambah"]'),
  ).show();
}

function hapusRekening(index) {
  Swal.fire({
    title: "Yakin hapus?",
    text: "Data rekening akan dihapus permanen",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  }).then((res) => {
    if (res.isConfirmed) {
      const data = getData();
      data.splice(index, 1);
      saveData(data);
      renderRekening();
      Swal.fire({
        icon: "success",
        title: "Data dihapus",
        timer: 1200,
        showConfirmButton: false,
      });
    }
  });
}

/* UTIL */
function copyRek(id) {
  navigator.clipboard.writeText(document.getElementById(id).innerText);
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "Nomor rekening disalin",
    showConfirmButton: false,
    timer: 1200,
  });
}

function resetForm() {
  bankInput.value = "";
  ownerInput.value = "";
  numberInput.value = "";
}

initData();
renderRekening();
