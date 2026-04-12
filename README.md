# Anggota :
### 1. Cherish Evangeline (241110597)
### 2. Justin Wisely (241110868)
### 3. Kelvin Kurniawan (241112232)

## Cara Menjalankan Project

Aplikasi ini menggunakan Cloud Database (Supabase), sehingga tidak memerlukan instalasi PostgreSQL lokal atau Docker.

### 1. Setup Backend
- Masuk ke folder `Back-End`.
- `npm install`
- Jalankan server: `node server.js`
- (Tabel database akan otomatis terinisialisasi saat server running).

### 2. Setup Frontend
- Masuk ke folder `Front-End`.
- `npm install`
- Jalankan aplikasi: `npm run dev`


# ide projek kami
# Voyage-AI
Voyage-AI adalah aplikasi web Travel Planner berbasis AI yang menghadirkan perencanaan perjalanan end-to-end secara personal melalui itinerary cerdas, rekomendasi destinasi yang relevan, kontrol anggaran multi-currency, serta insight perjalanan real-time dalam antarmuka modern, interaktif, dan mudah digunakan.


# penjelasan setiap fitur dan timeline nya
### 1. Register 
- Tujuan: membuat akun baru agar user bisa memakai semua fitur personalisasi.
- Data/Input: name, email, password, style, budget, food, travelType, interests, hasPets.
- Alur:
1. User isi form registrasi di frontend.
2. Frontend kirim POST ke endpoint register.
3. Backend cek apakah email sudah terdaftar.
4. Jika belum, password di-hash dengan bcrypt lalu data user disimpan ke database.
5. Sistem mengembalikan respons sukses dan user diarahkan untuk login.
- Hasil: akun baru tersimpan dan siap digunakan untuk login.
- Catatan: setelah register berhasil, user belum otomatis login.
- Timeline: selesai pada 7 April 2026 setelah finalisasi form registrasi, validasi email unik, dan penyimpanan preferensi awal pengguna.

### 2. Login 
- Tujuan: autentikasi user dan memberikan akses ke endpoint terproteksi.
- Data/Input: email dan password.
- Alur:
1. User submit form login.
2. Backend mencari user berdasarkan email.
3. Backend verifikasi password dengan bcrypt compare.
4. Jika valid, backend generate JWT dengan masa aktif 1 hari.
5. Frontend menyimpan token dan data user di localStorage lalu masuk ke aplikasi.
- Hasil: user dapat mengakses fitur yang memerlukan autentikasi.
- Catatan: token bersifat stateless, logout dilakukan dari sisi client.
- Timeline: selesai pada 7 April 2026 setelah autentikasi email/password dan integrasi JWT untuk akses endpoint terproteksi.

### 3. Logout 
- Tujuan: mengakhiri sesi penggunaan akun pada perangkat saat ini.
- Data/Input: tidak ada input form.
- Alur:
1. User klik tombol Logout di sidebar.
2. Frontend menghapus token dan data user dari localStorage.
3. State autentikasi di frontend di-reset.
4. User diarahkan ke halaman login.
- Hasil: sesi lokal berakhir dan aplikasi kembali ke mode non-authenticated.
- Catatan: tidak ada invalidasi token di server (server-side blacklist belum diterapkan).
- Timeline: selesai pada 7 April 2026 setelah implementasi pembersihan token dan reset state autentikasi di frontend.

### 4. Edit Profile 
- Tujuan: memperbarui data profil dasar user.
- Data/Input: name dan email.
- Alur:
1. User membuka halaman Profile.
2. User mengubah data pada form Basic Information.
3. Frontend mengirim PUT ke endpoint update profile dengan bearer token.
4. Backend memperbarui data user di database.
5. Frontend sinkronkan data user terbaru ke state dan localStorage.
- Hasil: profil user terbarui dan tampil konsisten di aplikasi.
- Catatan: form ganti password tersedia sebagai fitur terpisah.
- Timeline: selesai pada 7 April 2026 setelah endpoint update profil dan sinkronisasi data user ke local storage.

### 5. Save Preferences & History 
- Tujuan: menyimpan preferensi perjalanan dan riwayat itinerary user.
- Data/Input:
1. Preferences awal saat registrasi (style, budget, food, travelType, interests, hasPets).
2. Riwayat itinerary dari hasil AI Planner.
- Alur:
1. Saat register, preferensi user disimpan ke database.
2. Saat generate itinerary, hasil plan disimpan sebagai history.
3. Saat halaman planner dibuka, frontend memuat history user.
4. User dapat memilih plan lama atau menghapus plan tertentu.
- Hasil: user memiliki rekam jejak perjalanan yang bisa diakses ulang.
- Catatan: pengelolaan preferensi lanjutan setelah registrasi masih terbatas.
- Timeline: selesai pada 8 April 2026 setelah alur simpan preferensi saat registrasi dan penyimpanan riwayat itinerary ke database.

### 6. AI Itinerary Generator 
- Tujuan: membuat itinerary perjalanan detail secara otomatis dengan AI.
- Data/Input: origin, destination, dates, budget, tripType, vibe.
- Alur:
1. User mengisi parameter perjalanan di halaman AI Planner.
2. Frontend mengirim request generate plan ke backend.
3. Backend menyusun prompt personalisasi berdasarkan input user dan profil.
4. Model AI menghasilkan JSON itinerary (summary, logistics, packing list, itinerary harian).
5. Hasil disimpan ke database dan ditampilkan ke user.
- Hasil: itinerary lengkap siap dipakai serta otomatis masuk ke riwayat trip.
- Catatan: detail biaya bersifat estimasi AI dan dapat bervariasi.
- Timeline: selesai pada 8 April 2026 setelah integrasi model AI untuk itinerary detail dan penyimpanan hasil ke history.

### 7. Destination Recommendation 
- Tujuan: memberi rekomendasi destinasi terbaik sesuai lokasi dan profil user.
- Data/Input: category=destination dan query location.
- Alur:
1. User mencari lokasi pada halaman Recommendations.
2. Frontend memanggil endpoint rekomendasi destination.
3. Backend meminta AI menghasilkan 10 opsi yang relevan.
4. Frontend menampilkan daftar rekomendasi dalam card.
- Hasil: user mendapatkan 10 rekomendasi destinasi personal.
- Catatan: hasil rekomendasi dipengaruhi kualitas prompt dan konteks lokasi.
- Timeline: selesai pada 8 April 2026 setelah endpoint kategori destinasi menghasilkan 10 rekomendasi berbasis lokasi.

### 8. Hotel Recommendation 
- Tujuan: memberi opsi akomodasi yang cocok dengan preferensi user.
- Data/Input: category=hotel dan query location.
- Alur:
1. User memilih tab Hotels.
2. Frontend meminta data rekomendasi hotel ke backend.
3. Backend mengembalikan 10 opsi hotel berbasis AI.
4. UI menampilkan nama, deskripsi, area, estimasi harga, dan alasan kecocokan.
- Hasil: user dapat membandingkan opsi hotel secara cepat.
- Catatan: belum terhubung langsung ke booking engine.
- Timeline: selesai pada 9 April 2026 setelah penyesuaian prompt AI untuk opsi akomodasi sesuai profil pengguna.

### 9. Food Recommendation 
- Tujuan: merekomendasikan kuliner lokal sesuai gaya perjalanan user.
- Data/Input: category=food dan query location.
- Alur:
1. User memilih tab Culinary.
2. Frontend meminta daftar food recommendation.
3. Backend menghasilkan 10 rekomendasi melalui AI.
4. Hasil ditampilkan lengkap dengan estimasi harga dan alasan cocok.
- Hasil: user memperoleh referensi tempat makan untuk perjalanan.
- Catatan: kisaran harga bersifat estimasi.
- Timeline: selesai pada 9 April 2026 setelah aktivasi kategori kuliner dengan keluaran deskripsi dan estimasi harga.

### 10. Photo Spot Recommendation 
- Tujuan: merekomendasikan spot foto menarik di lokasi tujuan.
- Data/Input: category=photospot dan query location.
- Alur:
1. User memilih tab Photo Spots.
2. Frontend memanggil endpoint photospot.
3. Backend meminta AI menghasilkan 10 spot foto.
4. Frontend menampilkan daftar spot dengan deskripsi dan lokasi.
- Hasil: user memiliki daftar tempat foto yang mudah dieksplor.
- Catatan: belum ada integrasi rating/foto crowdsource.
- Timeline: selesai pada 9 April 2026 setelah kategori photospot ditambahkan ke recommendation store dan UI tab.

### 11. Transport Recommendation 
- Tujuan: memberi opsi transportasi terbaik untuk mobilitas di destinasi.
- Data/Input: category=transport dan query location.
- Alur:
1. User memilih tab Transport.
2. Frontend meminta rekomendasi transport ke backend.
3. Backend menghasilkan 10 opsi transport via AI.
4. UI menampilkan detail opsi dan estimasi biaya.
- Hasil: user lebih mudah memilih moda transport yang sesuai budget.
- Catatan: belum ada informasi jadwal realtime transport publik.
- Timeline: selesai pada 9 April 2026 setelah kategori transport aktif dengan hasil rekomendasi per lokasi tujuan.

### 12. Filter 
- Tujuan: menyaring hasil rekomendasi agar sesuai batas harga user.
- Data/Input: maxPrice (all, 20, 100).
- Alur:
1. User memilih opsi filter harga.
2. Frontend memproses data recommendation yang sudah didapat.
3. Item ditampilkan hanya jika memenuhi batas harga.
- Hasil: daftar rekomendasi lebih relevan terhadap budget.
- Catatan: saat ini filter fokus pada harga, belum multi-kriteria.
- Timeline: selesai pada 10 April 2026 setelah penerapan penyaringan harga (all, under 20, under 100) di sisi frontend.

### 13. Sort 
- Tujuan: mengurutkan rekomendasi untuk memudahkan perbandingan.
- Data/Input: sortBy (recommended, asc, desc).
- Alur:
1. User memilih metode pengurutan.
2. Frontend mengurutkan list berdasarkan nilai harga.
3. Hasil langsung diperbarui tanpa refresh halaman.
- Hasil: user dapat melihat opsi termurah atau termahal dengan cepat.
- Catatan: sort saat ini berbasis harga, belum ada sort relevansi/rating.
- Timeline: selesai pada 10 April 2026 setelah fungsi pengurutan harga ascending dan descending stabil di daftar rekomendasi.

### 14. Currency Converter 
- Tujuan: mengonversi nominal antar mata uang untuk estimasi biaya perjalanan.
- Data/Input: amount, from currency, to currency.
- Alur:
1. User memasukkan nominal.
2. User memilih mata uang asal dan tujuan.
3. Frontend mengambil kurs terbaru dari API publik.
4. Nilai konversi dihitung dan ditampilkan otomatis.
- Hasil: user memperoleh estimasi nilai tukar secara cepat.
- Catatan: bergantung pada ketersediaan API kurs eksternal.
- Timeline: selesai pada 10 April 2026 setelah integrasi API nilai tukar publik untuk konversi nominal real-time.

### 15. Translator 
- Tujuan: menerjemahkan teks untuk kebutuhan komunikasi saat traveling.
- Data/Input: text dan targetLanguage.
- Alur:
1. User mengetik teks sumber.
2. User memilih bahasa tujuan.
3. Frontend kirim request translate ke backend.
4. Backend menggunakan AI untuk menghasilkan terjemahan.
5. Hasil ditampilkan di panel output.
- Hasil: teks terjemahan siap dipakai langsung.
- Catatan: pilihan bahasa masih terbatas pada opsi yang tersedia di UI.
- Timeline: selesai pada 10 April 2026 setelah endpoint translate terhubung ke AI backend dengan output terjemahan langsung.

### 16. International Time Checker 
- Tujuan: menampilkan waktu di beberapa zona internasional secara realtime.
- Data/Input: tidak ada input wajib (kota sudah ditentukan default).
- Alur:
1. User membuka tab World Time.
2. Frontend membuat timer pembaruan per detik.
3. Tiap kartu kota menampilkan waktu lokal berdasarkan timezone masing-masing.
- Hasil: user dapat merencanakan komunikasi lintas zona waktu.
- Catatan: daftar kota masih hardcoded, belum custom timezone picker.
- Timeline: selesai pada 11 April 2026 setelah komponen world clock multi-timezone berjalan dengan pembaruan per detik.

### 17. Expense Tracker 
- Tujuan: mencatat dan memantau pengeluaran perjalanan.
- Data/Input: description, amount, currency, category, date.
- Alur:
1. User menambahkan data pengeluaran dari form.
2. Frontend mengirim data ke endpoint expenses.
3. Backend menyimpan data ke database.
4. Frontend menampilkan riwayat transaksi terbaru.
5. Aplikasi menghitung total USD dan distribusi kategori untuk chart.
6. User dapat menghapus transaksi yang tidak diperlukan.
- Hasil: pengeluaran terkelola dengan ringkas dan visualisasi yang jelas.
- Catatan: konversi kurs bersifat realtime dan bisa berbeda dari kurs transaksi aktual.
- Timeline: selesai pada 11 April 2026 setelah CRUD pengeluaran, konversi ke USD, dan visualisasi chart kategori diselesaikan.

### 18. Emergency Info 
- Tujuan: menyediakan nomor darurat lokal dan referensi rumah sakit terdekat.
- Data/Input: koordinat GPS user (lat, lng) bila tersedia.
- Alur:
1. Aplikasi meminta izin geolokasi user.
2. Frontend kirim koordinat ke endpoint emergency.
3. Backend melakukan reverse geocoding untuk mendeteksi region/country.
4. Backend mengembalikan nomor polisi, medis, dan pemadam sesuai negara.
5. Backend juga menghasilkan info rumah sakit utama (dengan fallback jika perlu).
6. Frontend menampilkan tombol cepat telepon dan tautan Google Maps.
- Hasil: user dapat mengakses bantuan darurat lebih cepat di lokasi tujuan.
- Catatan: saat lokasi tidak tersedia, sistem memakai fallback nomor global.
- Timeline: selesai pada 11 April 2026 setelah geolokasi, reverse geocoding, nomor darurat lokal, dan rujukan rumah sakit diaktifkan.

### 19. Fun Fact & Local Insight 
- Tujuan: memberikan insight harian yang personal dan kontekstual.
- Data/Input: profil user + lokasi saat ini (opsional lat/lng).
- Alur:
1. Dashboard mengambil lokasi user jika diizinkan.
2. Backend mengubah koordinat menjadi nama area.
3. Backend memanggil AI untuk menghasilkan greeting, fun fact, local insight, dan daily recommendation.
4. Hasil disimpan sementara di cache frontend untuk efisiensi.
- Hasil: dashboard terasa personal dan informatif setiap kali user membuka aplikasi.
- Catatan: tersedia fallback konten jika AI sedang rate limit.
- Timeline: selesai pada 12 April 2026 setelah dashboard insight berbasis lokasi dan profil user terintegrasi dengan AI.

### 20. Weather Forecast 
- Tujuan: memberi informasi cuaca pada lokasi user untuk keputusan perjalanan cepat.
- Data/Input: koordinat lokasi user (lat, lng).
- Alur:
1. Saat dashboard dibuka, frontend mengambil geolokasi user.
2. Frontend meminta data cuaca ke Open-Meteo.
3. Sistem memetakan weather code menjadi ikon dan deskripsi kondisi.
4. UI menampilkan suhu saat ini dan kondisi cuaca.
- Hasil: user mendapat ringkasan cuaca real-time di dashboard.
- Catatan: implementasi saat ini fokus pada current weather, belum forecast multi-hari.
- Timeline: selesai pada 12 April 2026 setelah integrasi Open-Meteo untuk menampilkan suhu dan kondisi cuaca saat ini.
