# Sunucuya hazır site paketi

`aysegul-site-hazir.zip`, https://www.avukataysegulcetinkaya.info/ için derlenmiş yayın dosyalarını içerir. Masaüstü metinleri büyütülmüştür; üst ve alt bölümdeki aç monogramı kaldırılmıştır.

## Plesk ile yükleme

1. ZIP dosyasını bilgisayarınıza indirin.
2. Plesk Dosya Yöneticisi'nde bu alan adının `httpdocs` klasörünü açın ve ZIP'i buraya yükleyin.
3. Arşiv menüsünden ZIP'in içeriğini mevcut `httpdocs` klasörüne çıkarın. Aynı adlı dosyalar için üzerine yazmayı seçin.
4. `index.html`, `assets/`, `images/`, `favicon.svg`, `robots.txt` ve `sitemap.xml` doğrudan `httpdocs` altında bulunmalıdır.
5. Siteyi açıp Ctrl + F5 ile yenileyin.

ZIP'in içinde üst bir proje veya dist klasörü bulunmaz. Sunucuda Node.js çalıştırılması gerekmez. Yeni bir kaynak değişikliği yapıldığında yeniden derleme gerekir; sunucuya doğrudan JSX dosyası yüklemek siteyi güncellemez.

## Doğrulama

- Üretim derlemesi başarılı.
- Derlenmiş dosyalar statik önizlemede 1440 ve 390 px ekranlarda denendi.
- JavaScript hatası ve başarısız kaynak isteği görülmedi; favicon 200 döndürdü.
- Alan adı .info, masaüstü ana açıklama 18 px ve üst/alt monogramın kaldırıldığı doğrulandı.
- ZIP: 68 dosya, 1150640 bayt.
- SHA-256: `62a080868ca12f5a15afc78f9c07785b3c1dfb0888bceee12e96601933d0d463`.
