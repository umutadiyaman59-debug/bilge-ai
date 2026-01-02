# Bilge - Türkiye'nin İlk Yerli Yapay Zeka Asistanı

<div align="center">
  <img src="public/icons/icon.svg" alt="Bilge Logo" width="120" height="120">

  **Türkçe Yapay Zeka Sohbet Uygulaması**

  [Demo](#demo) | [Özellikler](#özellikler) | [Kurulum](#kurulum) | [API Yapılandırması](#api-yapılandırması)
</div>

---

## Hakkında

Bilge, ChatGPT benzeri modern bir yapay zeka sohbet uygulamasıdır. Türk kullanıcıları için özelleştirilmiş, hızlı, güvenli ve kullanıcı dostu bir deneyim sunar.

## Özellikler

### Temel Özellikler
- **Gerçek Zamanlı Streaming**: Claude API ile anlık yanıtlar
- **Çoklu Sohbet Desteği**: Birden fazla sohbet oluşturup yönetin
- **Sohbet Geçmişi**: Tüm konuşmalarınız yerel olarak saklanır
- **Türkçe/İngilizce Destek**: Çift dil desteği

### Kullanıcı Deneyimi
- **Koyu/Açık Mod**: Göz yormayan tema seçenekleri
- **Mobil Uyumlu**: PWA desteği ile her cihazda çalışır
- **Hızlı ve Akıcı**: Optimize edilmiş performans
- **Yazma Göstergesi**: Bilge'nin yanıt verdiğini görün

### Veri Yönetimi
- **PDF Dışa Aktarma**: Sohbetlerinizi PDF olarak kaydedin
- **JSON Dışa Aktarma**: Tüm verilerinizi yedekleyin
- **Yerel Depolama**: Verileriniz tarayıcınızda güvenle saklanır

## Teknolojiler

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui
- **AI Backend**: Claude API (Anthropic)
- **PWA**: Service Worker, Manifest

## Kurulum

### Gereksinimler
- Node.js 18+
- npm veya yarn

### Adımlar

```bash
# 1. Bağımlılıkları yükleyin
npm install

# 2. Geliştirme sunucusunu başlatın
npm run dev

# 3. Tarayıcıda açın
# http://localhost:8080
```

### Üretim Build

```bash
# Üretim için derleyin
npm run build

# Önizleme
npm run preview
```

## API Yapılandırması

Bilge, Claude API kullanır. API anahtarınızı yapılandırmak için:

1. [Anthropic Console](https://console.anthropic.com/settings/keys) adresinden API anahtarı alın
2. Uygulamada **Ayarlar** > **API Anahtarı** bölümüne gidin
3. Anahtarınızı girin ve "Kaydet ve Test Et" butonuna tıklayın

> **Not**: API anahtarınız olmadan uygulama demo modunda çalışır.

## Proje Yapısı

```
src/
├── components/
│   ├── chat/           # Sohbet bileşenleri
│   │   ├── ChatArea.tsx
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   ├── ChatMessage.tsx
│   │   ├── ChatSidebar.tsx
│   │   └── ...
│   ├── modals/         # Modal bileşenleri
│   │   ├── OnboardingModal.tsx
│   │   └── SettingsModal.tsx
│   └── ui/             # shadcn/ui bileşenleri
├── contexts/           # React Context'leri
├── hooks/              # Custom Hook'lar
├── pages/              # Sayfa bileşenleri
├── services/           # API servisleri
├── types/              # TypeScript tipleri
└── lib/                # Yardımcı fonksiyonlar
```

## Özelleştirme

### Tema Renkleri
`src/index.css` dosyasında CSS değişkenlerini düzenleyin:

```css
:root {
  --primary: 220 13% 18%;
  --background: 0 0% 100%;
  /* ... */
}
```

### Sistem Promptu
`src/services/claude-api.ts` dosyasında `DEFAULT_SYSTEM_PROMPT` değişkenini düzenleyin.

## Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## Lisans

MIT License - Detaylar için [LICENSE](LICENSE) dosyasına bakın.

---

<div align="center">
  <strong>Bilge</strong> - Türkiye'nin Yapay Zeka Asistanı
  <br>
  Made with love in Turkey
</div>
