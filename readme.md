# Otel Yönetim Sistemi (HOTEL PROPERTY MANAGEMENT SYSTEM)

Bu proje, otel yönetimi için rezervasyon, müşteri, çalışan ve oda yönetimi gibi işlemleri yapan bir uygulama programalama arabirimidir.

## Özellikler

- Müşteri, çalışan, oda ve rezervasyon yönetimi.
- Oda rezervasyonları için tarih kontrolü.
- Rezervasyon, müşteri, çalışan ve oda CRUD işlemleri.

## Teknolojiler

- **Backend:** Node.js, Express.js
- **Veritabanı:** MongoDB, Mongoose

## Kurulum

### Gereksinimler

- Node.js
- MongoDB

### Adımlar

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/HasanBocek/HPMS-Backend.git
   cd HPMS-Backend
   ```
2. Bağımlılıkları yükleyin:
   ```bash
   npm install
   ```
3. MongoDB'yi başlatın ve `.env` dosyasını yapılandırın:
   ```env
   MONGODB_URI=
   SECRET=
   ```
4. Sunucuyu çalıştırın:
   ```bash
   npm start
   ```
5. Projeniz `localhost:4000` adresinde çalışacaktır.

## API Dökümantasyonu

### Response Yapısı

- **Body**
    ```json
    {
        "status": "succes / error / server error / unknown",
        "message": "success_message",
        "error":" [error_messages]",
        "data": "data"
    }
    ```

VERİLER ÖRNEKTİR GERÇEKLİĞİ YOKTUR!

### Item İşlemleri

#### GET `/api/item/:id`

- **Açıklama:** ID'ye sahip veriyi listeler.
- **Path Parametreleri:**
    - `id` (CustomID): Müşterinin ID'si.

- **Response Data:**
    Item Verisi

### Müşteri İşlemleri

#### GET `/api/customer`

- **Açıklama:** Tüm müşterileri listeler.
- **Data:**
    ```json
    [
        {
            "_id": "66f56186c7e96e81b3556d6a",
            "name": "Alva Marvin",
            "tckn": "894-64-3926",
            "address": "6077 Buddy Square Turtle Lake, ND 58575 ",
            "email": "summer.labadie@price.info",
            "gender": "Kadın",
            "phone": 12923306849,
            "nation": "US",
            "note": "",
            "reservations": [
                "8JQP",
                "GPEL",
                "3V9J",
                "FM3Q"
            ],
            "customId": "INUO",
            "__v": 24
        },
    ]
    ```

#### GET `/api/customer/{id}`

- **Açıklama:** ID'ye sahip müşteriyi listeler.
- **Data:**
    Müşteri Verisi

#### POST `/api/customer`

- **Açıklama:** Yeni bir müşteri oluşturur.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "name": "ADSOYAD(str)",
            "tckn": "TCKN(str)",
            "address": "ADRES(str)",
            "email": "EMAIL(str)",
            "gender": "CINSIYET(str)",
            "phone": "TELEFON_NO(int)",
            "nation": "UYRUK_KODU(str)",
            "note": "NOT(gerekli degil)(str)"
        }
        ```
- **Response Data:**
    Müşteri Verisi

#### PUT `/api/customer/{id}`

- **Açıklama:** ID'ye sahip müşteri düzenler.
- **Path Parametreleri:**
    - `id` (CustomID): Müşterinin ID'si.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "name": "ADSOYAD(str)",
            "tckn": "TCKN(str)",
            "address": "ADRES(str)",
            "email": "EMAIL(str)",
            "gender": "CINSIYET(str)",
            "phone": "TELEFON_NO(int)",
            "nation": "UYRUK_KODU(str)",
            "note": "NOT(gerekli degil)(str)"
        }
        ```
- **Response Data:**
    Düzenlenmiş Müşteri Verisi

#### DELETE `/api/customer/{id}`

- **Açıklama:** ID'ye sahip müşteriyi siler.
- **Path Parametreleri:**
    - `id` (CustomID): Müşterinin ID'si.

### Oda İşlemleri

#### GET `/api/room`

- **Açıklama:** Tüm odaları listeler.
- **Data:**
    ```json
    [
        {
            "_id": "66f56198c7e96e81b3556d7b",
            "roomType": {
                "roomName": "Oda 1",
                "price": 400,
                "adults": 2,
                "childs": 0,
                "note": "",
                "_id": "66f56198c7e96e81b3556d7c"
            },
            "roomNumber": 1,
            "note": "",
            "reservations": [
                "8JQP",
                "GPEL",
                "3V9J",
                "FM3Q"
            ],
            "customId": "GVTR",
            "__v": 24
        },
    ]
    ```

#### GET `/api/room?checkInDate=YYYY-MM-DD&checkOutDate=YYYY-MM-DD`

- **Description:** Belirtilen tarihler arasındaki boş odaları listeler.
- **Query Parametreleri:**
    - `checkInDate` (Date[YYYY-MM-DD]): Checkin Tarihi.
    - `checkOutDate` (Date[YYYY-MM-DD]): Checkout Tarihi.
- **Data:**
    Müsait Odaların Verisi

#### GET `/api/room/{id}`

- **Description:** ID'ye sahip odayı listeler.
- **Path Parametreleri:**
    - `id` (CustomID): Odanın ID'si.
- **Data:**
    Oda Verisi

#### POST `/api/room`

- **Açıklama:** Yeni bir oda oluşturur.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "roomNumber": "ODA_NO(int)",
            "roomName": "ODA_ADI(str)",
            "price": "FIYAT(int)",
            "description": "ACIKLAMA(str)",
            "adults": "YETISKIN_SAYISI(int)",
            "childs": "COCUK_SAYISI(int)",
            "note": "NOT(gerekli değil)(str)"
        }
        ```
- **Data:**
    Oda Verisi

#### PUT `/api/room/{id}`

- **Açıklama:** ID'ye sahip odayı düzenler.
- **Path Parametreleri:**
    - `id` (CustomID): Odanın ID'si.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "roomNumber": "ODA_NO(int)",
            "roomName": "ODA_ADI(str)",
            "price": "FIYAT(int)",
            "description": "ACIKLAMA(str)",
            "adults": "YETISKIN_SAYISI(int)",
            "childs": "COCUK_SAYISI(int)",
            "note": "NOT(gerekli degil)(str)"
        }
        ```
- **Data:**
    Düzenlenmiş Oda Verisi

#### DELETE `/api/room/{id}`

- **Açıklama:** ID'ye sahip odayı siler.
- **Path Parametreleri:**
  - `id` (CustomID): Odanın ID'si.

### Rezervasyon İşlemleri

#### GET `/api/reservation`

- **Açıklama:** Tüm rezervasyonları listeler.
- **Data:**
    ```json 
    [
        {
            "_id": "66f563924331f07f2f2fd27e",
            "employee": "ZS24",
            "customers": [
                "INUO"
            ],
            "rooms": [
                "GVTR"
            ],
            "checkin": "2024-10-15",
            "checkout": "2024-10-17",
            "adults": 1,
            "childs": 0,
            "price": 200,
            "note": "",
            "isPaid": true,
            "customId": "8JQP",
            "__v": 0
        },
    ]
    ```

#### GET `/api/reservation/{id}`

- **Açıklama:** ID'ye sahip rezervasyonu listeler.
- **Path Parametreleri:**
    - `id` (CustomID): Rezervasyonun ID'si.
- **Data:**
    Rezervasyon Verisi

#### POST `/api/reservation`

- **Açıklama:** Yeni bir rezervasyon oluşturur.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "customers": "MUSTERI_ID(arr)",
            "rooms": "ODA_ID(arr)",
            "checkin": "CHECKIN-TARIH(YYYY-MM-DD)(str)",
            "checkout": "CHECKOUT_TARIH(YYYY-MM-DD)(str)",
            "adults": "YETISKIN_SAYISI(int)",
            "childs": "COCUK_SAYISI(int)",
            "note": "NOT(gerekli degil)(str)",
            "isPaid": "ODEME_DURUMU(bool)"
        }
        ```
- **Data:**
    Rezervasyon Verisi

#### PUT `/api/reservation/{id}`

- **Açıklama:** ID'ye sahip rezervasyonu düzenler.
- **Path Parametreleri:**
    - `id` (CustomID): Rezervasyonun ID'si.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "customers": "MUSTERI_ID(arr)",
            "rooms": "ODA_ID(arr)",
            "checkin": "CHECKIN-TARIH(YYYY-MM-DD)(str)",
            "checkout": "CHECKOUT_TARIH(YYYY-MM-DD)(str)",
            "adults": "YETISKIN_SAYISI(int)",
            "childs": "COCUK_SAYISI(int)",
            "note": "NOT(gerekli degil)(str)",
            "isPaid": "ODEME_DURUMU(bool)"
        }
        ```
- **Data:**
    Düzenlenmiş Rezervasyon Verisi
        
#### DELETE `/api/reservation/{id}`

- **Açıklama:** ID'ye sahip rezervasyonu siler.
- **Path Parametreleri:**
    - `id` (CustomID): Rezervasyonun ID'si.

### Çalışan İşlemleri

#### GET `/api/employee`

- **Açıklama:** Tüm çalışanları listeler.
- **Data:**
    ```json
    [
        {
            "_id": "66dcaef908e8f025fb182fc8",
            "name": "Hasan Bocek",
            "job": "Dev",
            "salary": 200,
            "jobStartDate": "2024-08-25",
            "jobDescription": "123",
            "contact": {
                "tckn": "11111111111",
                "phone": 5555555555,
                "email": "mail@mail.com",
                "address": "address",
                "_id": "66f68e7349803958ce878cd4"
            },
            "note": "",
            "dob": "2007-09-20",
            "password": "",
            "permissions": [
                "ADMINISTRATOR"
            ],
            "customId": "ZS24"
        }
    ]
    ```

#### GET `/api/employee/{id}`

- **Açıklama:** ID'ye sahip çalışanları listeler.
- **Path Parametreleri:**
    - `id` (CustomID): Çalışan ID'si.
- **Data:**
    Çalışan Verisi

#### POST `/api/employee`

- **Açıklama:** Yeni bir çalışan oluşturur.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "name": "ADSOYAD(str)",
            "job": "IS(str)",
            "salary": "MAAS(int)",
            "jobStartDate": "IS_BASLAMA_TARIHI(str)",
            "jobDescription": "IS_ACIKLAMASI(str)",
            "tckn": "TCKN(str)",
            "phone": "TELEFON_NO(int)",
            "email": "EMAIL(str)",
            "address": "ADRES(str)",
            "dob": "DOGUM_TARIH(YYYY-MM-DD)(str)",
            "password": "SIFRE(str)",
            "permissions": "YETKILER(arr)"
        }
        ```
- **Data:**
    Çalışan Verisi

#### PUT `/api/employee/{id}`

- **Açıklama:** ID'ye sahip çalışanı düzenler.
- **Path Parametreleri:**
    - `id` (CustomID): Çalışanın ID'si.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "name": "ADSOYAD(str)",
            "job": "IS(str)",
            "salary": "MAAS(int)",
            "jobStartDate": "IS_BASLAMA_TARIHI(str)",
            "jobDescription": "IS_ACIKLAMASI(str)",
            "tckn": "TCKN(str)",
            "phone": "TELEFON_NO(int)",
            "email": "EMAIL(str)",
            "address": "ADRES(str)",
            "dob": "DOGUM_TARIH(YYYY-MM-DD)(str)",
            "password": "SIFRE(str)",
            "permissions": "YETKILER(arr)"
        }
        ```
- **Data:**
    Düzenlenmiş Çalışan Verisi
        
#### DELETE `/api/employee/{id}`

- **Açıklama:** ID'ye sahip çalışanı siler.
- **Path Parametreleri:**
    - `id` (CustomID): Çalışanın ID'si.

### Yetkilendirme İşlemleri

#### POST `/auth/login`

- **Açıklama:** Giriş yapar.
- **Request Body:**
    - **Content-Type:** `application/json`
    - **Body:**
        ```json
        {
            "email": "EMAIL(str)",
            "password": "SIFRE(str)"
        }
        ```

#### GET `/auth/logout`

- **Açıklama:** Çıkış yapar.
- **Response:**
    - **Status:** `200 OK`
    - **Headers:**
        - `Location: /login`

## Katkıda Bulunma

- **Pull Request:** Kod üzerinde değişiklik yapmak isterseniz, lütfen bir pull request gönderin.
- **Issue:** Hataları veya geliştirme önerilerinizi Issue olarak bildirin.