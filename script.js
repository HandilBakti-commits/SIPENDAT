const { jsPDF } = window.jspdf;

document.addEventListener('DOMContentLoaded', () => {
    // Show section
    window.showSection = (sectionId) => {
        document.querySelectorAll('section').forEach(section => {
            section.classList.add('hidden');
            section.classList.remove('active');
        });
        document.getElementById(sectionId).classList.remove('hidden');
        document.getElementById(sectionId).classList.add('active');
    };

    // RT Login
    document.getElementById('rt-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('rt-username').value;
        const password = document.getElementById('rt-password').value;
        const rtNumber = username.replace('rt', '');

        const response = await fetch('/rt-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, rtNumber })
        });

        if (response.ok) {
            document.getElementById('rt-login-form').classList.add('hidden');
            document.getElementById('report-form').classList.remove('hidden');
        } else {
            alert('Login gagal. Username atau password salah.');
        }
    });

    // Disaster Report Submission
    document.getElementById('disaster-report-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('rt-username').value;
        const rtNumber = username.replace('rt', '');
        const report = {
            rtNumber: `RT ${rtNumber}`,
            disasterType: document.getElementById('disaster-type').value,
            affectedHouses: document.getElementById('affected-houses').value,
            affectedFamilies: document.getElementById('affected-families').value,
            date: document.getElementById('report-date').value // Ambil tanggal dari input date
        };

        const response = await fetch('/submit-report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(report)
        });

        if (response.ok) {
            alert('Laporan berhasil diupload!');
            document.getElementById('disaster-report-form').reset();
        } else {
            alert('Gagal mengupload laporan.');
        }
    });

    // Kelurahan Login
    document.getElementById('kelurahan-login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('kelurahan-username').value;
        const password = document.getElementById('kelurahan-password').value;

        const response = await fetch('/kelurahan-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            document.getElementById('kelurahan-login-form').classList.add('hidden');
            document.getElementById('report-download').classList.remove('hidden');
        } else {
            alert('Login gagal. Username atau password salah.');
        }
    });

    // Download PDF
    document.getElementById('download-pdf').addEventListener('click', async () => {
        const response = await fetch('/get-reports');
        const reports = await response.json();

        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });

        doc.setFont('times');
        doc.setFontSize(12);
        doc.text('Laporan Bencana Kelurahan Handil Bakti', 10, 20);

        let y = 30;
        reports.forEach(report => {
            doc.rect(10, y - 5, 190, 35); // Kotak yang lebih besar untuk menampung semua data
            doc.text(`RT: ${report.rtNumber}`, 15, y);
            doc.text(`Jenis Bencana: ${report.disasterType}`, 15, y + 7);
            doc.text(`Jumlah Rumah Terdampak: ${report.affectedHouses}`, 15, y + 14);
            doc.text(`Jumlah KK Terdampak: ${report.affectedFamilies}`, 15, y + 21);
            doc.text(`Tanggal: ${report.date}`, 15, y + 28); // Tanggal di dalam kotak
            y += 45; // Jarak antar laporan diperbesar
            if (y > 200) {
                doc.addPage();
                y = 30;
            }
        });

        doc.save('laporan_bencana.pdf');
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("emergency-fund-form");
    const result = document.getElementById("result");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const income = parseFloat(document.getElementById("income").value);
        const expenses = parseFloat(document.getElementById("expenses").value);
        const familyMembers = parseInt(document.getElementById("family-members").value);

        if (isNaN(income) || isNaN(expenses) || isNaN(familyMembers) || familyMembers <= 0) {
            result.textContent = "Mohon masukkan nilai yang valid.";
            return;
        }

        const perOrang = (income - expenses) * familyMembers;

        if (perOrang < 0) {
            result.textContent = "Pengeluaran melebihi pendapatan. Tidak ada dana aman.";
        } else {
            result.textContent = `Dana darurat minimal yang disarankan adalah Rp ${perOrang.toLocaleString("id-ID")}.`;
        }
    });
});
let multiplier;
if (jumlahKK == 1) {
    multiplier = 3;
} else if (jumlahKK == 2 || (jumlahKK >= 3 && jumlahKK <= 4)) {
    multiplier = 6;
} else if (jumlahKK > 4) {
    multiplier = 12;
}