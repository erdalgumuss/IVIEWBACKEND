.
├── config
│   ├── db.ts
│   └── playground-4.mongodb.js
├── controllers
│   ├── adminController.ts
│   ├── applicationController.ts
│   ├── interviewController.ts
│   ├── questionController.ts
│   └── videoController.ts
├── middlewares
│   ├── auth.ts
│   ├── errorHandlers.ts
│   └── upload.ts
├── models
│   ├── Admin.ts
│   ├── Application.ts
│   ├── Interview.ts
│   └── Question.ts
├── routes
│   ├── adminRoutes.ts
│   ├── applicationRoutes.ts
│   ├── interviewRoutes.ts
│   ├── questionRoutes.ts
│   └── videoRoutes.ts
├── server.ts
└── uploads



1. Admin işlevleri:
-Giriş yapıyor.
-Mülakat oluşturuyor
-Mülakatları düzenleyebiliyor ve silebiliyor. 
-Mülakatlara veritabanından soruları ekleyip çıkarabiliyor.
-Mülakatlara onay ya da red verebiliyor.
2. Aday işlevler:
-Link ile başvuru yapıp gerekli verileri girebiliyor.
3. Mülakatlar için işlevler:
-Başlık
-Sorular
-Oluşturulma Tarihi
-Son başvuru tarihi
-Kim tarafından oluşturuldu
4. Sorular:
- Soru başlığı
-Süre 
5. Başvurular için işlevler:
-Başvuru ID
-Mülakat ID
-İsim Soyisim
-Mail
-Numara
-video url
-Başvuru tarihi
-Başvuru Durumu

UPDATE

Controller fonksiyonları ayrıldı
Admin tokeni oluşturularak tüm testler token varken ve yokken olarak yapıldı
 1. Video Yüklendi
 2. Soru Eklendi
 3. Sorular Listelendi
 4. Sorular Güncellendi 
 5. Soru Silindi
 6. Mülakat Oluşturuldu
 7. Mülakatlar Listelendi
 8. Mülakat Güncellendi
 9. Mülakat Silindi
10. Mülakata Girildi

Hata görünmüyor şimdilik...


