# Av. Ayşegül Çetinkaya — Avukatlık & Hukuki Danışmanlık

Kullanıcının sağladığı mevcut `index.html` içeriği temel alınarak hazırlanan Türkçe, mobil uyumlu avukatlık sitesi. React ve Vite kullanır. Fontlar ve görseller yereldir; sayfanın görüntülenmesi harici bir CDN gerektirmez.

## Geliştirme

Node.js 24 ve npm ile:

```sh
cd /workspace/GPTtest
npm ci
npm run dev
```

## Derleme ve yayına alma

```sh
npm run build
npm run preview
```

`dist/` klasörünün **içindeki tüm dosya ve klasörleri** mevcut web sunucusunun belge köküne (genellikle `public_html/`) yükleyin. `index.html`, `assets/`, `images/` ve diğer dosyaları birlikte taşıyın. Eski sitenizi önce yedekleyin. Uygulama kök alan adı için yapılandırılmıştır; alt dizinde yayımlama için Vite `base` ayarı ve mutlak görsel bağlantıları uyarlanmalıdır. Sunucu tarafı uygulama veya gizli anahtar gerektirmez. Bu çalışma mevcut canlı siteyi değiştirmez.

## İçerik ve özellikler

- İletişim bilgileri, altı çalışma alanı ve sorular: `src/content.js`.
- Sayfa bölümleri ve etkileşimler: `src/App.jsx`.
- Tasarım ve ekran uyarlamaları: `src/styles.css`.
- Arama motoru ve sosyal paylaşım verileri: `index.html`, `public/robots.txt`, `public/sitemap.xml`.
- Telefon, e-posta, harita ve WhatsApp doğrudan bağlantıları.
- Randevu penceresi konu ve isteğe bağlı notu kodlayarak WhatsApp’ta açar. Mesajı kullanıcı WhatsApp üzerinden gönderir; randevu ofis teyidiyle kesinleşir. Sitede arka uç, e-posta gönderimi veya randevu veritabanı yoktur.
- Notlar sitede kalıcı saklanmaz; reklam/analitik çerezi kullanılmaz.
- Ana görsel bu tasarım için üretilmiş temsili bir adalet heykelidir; avukatı veya gerçek ofisi göstermez. Gerçek portre dosyası ekli HTML ile birlikte paylaşılmadığından kullanılmamıştır.

İçerikte eğitim, kıdem, başarı oranı veya kullanıcı tarafından paylaşılmamış mesleki unvan eklenmemiştir.

## Kontroller

```sh
npm test
```

Testler Chromium kullanır. Bulut ortamında `/usr/bin/chromium` mevcuttur; farklı bir konum için `CHROMIUM_PATH` tanımlayın. Playwright, test sunucusunu 5174 portunda otomatik başlatır. İletişim bilgileri, çalışma alanı pencereleri, konu aktarımı, WhatsApp mesaj kodlaması, klavye odağı, mobil gezinme, ekran taşmaları, yerel kaynaklar ve otomatik WCAG A/AA kontrolleri kapsanır. Otomatik erişilebilirlik kontrolü, tüm manuel erişilebilirlik gereksinimlerinin karşılandığı anlamına gelmez.

## Bulut ortamı

Mevcut `/workspace/GPTtest` checkout’unu kullanın. Her görev zaten yalıtılmış bir ortamda çalışır; kullanıcı özellikle istemedikçe ek Git worktree oluşturmayın. Kurulum için `npm ci`, geliştirme için `npm run dev`, doğrulama için `npm run build` ve `npm test` yeterlidir.
