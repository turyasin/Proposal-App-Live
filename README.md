# Proposal App (Tekliflendirme Uygulaması)

Bu modül, savunma sanayi ve elektromekanik sistemler için maliyetlendirme ve teklif hazırlama süreçlerini yönetmek üzere tasarlanmıştır.

## Mimari

### Backend (Motor)
- **Teknoloji:** Python (FastAPI)
- **Konum:** `./backend`
- **Amaç:** Maliyet hesaplama algoritmaları, Excel/PDF işleme, Veritabanı yönetimi.
- **Kurulum:**
  ```bash
  cd backend
  pip install -r requirements.txt
  uvicorn main:app --reload
  ```

### Frontend (Arayüz)
- **Teknoloji:** React (Vite)
- **Konum:** `./frontend`
- **Tasarım:** Premium Dark Mode, Glassmorphism, Responsive.
- **Amaç:** Kullanıcı etkileşimi, dinamik formlar, görsel raporlama.
- **Kurulum:**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```

## Özellikler (Planlanan)
- Ürün Ağacı (BOM) Yönetimi
- Dinamik Maliyet Hesaplama (İşçilik, Malzeme, Genel Giderler)
- Savunma Sanayi Standartlarına Uygun Raporlama
- AI Destekli Doküman Analizi (Gereksinim Dokümanları için)
