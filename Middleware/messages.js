const errorMessages = {
    template: {
        authorizationError: "Yetkilendirme hatası",
        permissionError: "Geçersiz yetki",
        validationError: "Doğrulama hatası",
        unknownError: "Bilinmeyen hata",
        operationError: "İşlem hatası",
        operationSuccess: "İşlem başarılı",
    },
    global: {
        serverError: "Sunucu hatası",
        enterNumericPrice: "Lütfen rakam kullanarak bir fiyat girin.",
        enterAdultCount: "Lütfen yetişkin sayısı için bir sayı girin.",
        enterChildCount: "Lütfen çocuk sayısı için bir sayı girin.",
        enterNation: "Lütfen bir uyruk girin.",
        enterGender: "Lütfen bir cinsiyet girin.",
        enterAddress: "Lütfen bir adres girin.",
        enterName: "Lütfen bir isim girin.",
        enterTCKN: "Lütfen bir TCKN girin.",
        enterDOB: "Lütfen bir doğum tarihi girin.",
        enterJob: "Lütfen bir iş girin.",
        enterSalary: "Lütfen bir maaş girin.",
        enterJobStartDate: "Lütfen geçerli bir işe başlama tarihi girin.",
        enterJobDescription: "Lütfen iş açıklaması girin.",
        enterNumbericPrice: "Lütfen bir fiyat girin.",
        enterAdultCount: "Lütfen yetişkin sayısı girin.",
        enterChildCount: "Lütfen çocuk sayısı girin.",
        enterBooleanIsPaid: "Lütfen ödeme durumu için bir boolean değeri girin.",
        enterValidDate: "Lütfen geçerli bir tarih girin.",
        enterValidCheckDate: "Lütfen tarihleri (YYYY-MM-DD) formatında girin ve giriş tarihinin çıkış tarihinin sonrası olmamasına dikkat edin.",
    },
    validate: {
        enterValidEmail: "Lütfen geçerli bir e-posta adresi girin.",
        enterValidPhone: "Lütfen geçerli bir telefon numarası girin.",
    },
    room: {
        enterUnusedRoomNumber: "Lütfen kullanılmayan bir oda numarası girin.",
        enterRoomName: "Lütfen bir oda ismi girin.",
        selectValidRoom: "Lütfen geçerli bir oda seçin.",
        enterValidStatus: "Lütfen geçerli bir bakım durumu girin.",
    },
    customer: {
        selectValidCustomer: "Lütfen geçerli bir müşteri seçin.",
    },
    reservation: {
        selectValidReservation: "Lütfen geçerli bir rezervasyon seçin.",
        reservationNotFound: "Rezervasyon bulunamadı.",
        enterRoomOrReservationId: "Lütfen bir oda veya rezervasyon id girin.",
        dateConflict: "Seçilen tarihler başka bir rezervasyon ile çakışıyor.",
    },
    employee: {
        selectValidEmployee: "Lütfen geçerli bir çalışan seçin.",
        enterValidPassword: "Lütfen geçerli bir şifre girin.",
        enterUniqueEmail: "Bu e-posta adresi zaten kullanımda.",
        selectValidEmployee: "Lütfen geçerli bir çalışan seçin.",
    },
    item: {
        itemNotFound: "Öğe bulunamadı.",
        selectValidItem: "Lütfen geçerli bir öğe seçin.",
    }
}

const successMessages = {
    room: {
        roomCreated: "Oda oluşturuldu.",
        roomDeleted: "Oda silindi.",
        roomEdited: "Oda düzenlendi.",
        roomSended: "Oda gönderildi.",
        allRoomsSended: "Tüm odalar gönderildi.",
        roomStatusEdited: "Oda durumu güncellendi."
    },
    customer: {
        customerCreated: "Müşteri oluşturuldu.",
        customerDeleted: "Müşteri silindi.",
        customerEdited: "Müşteri düzenlendi.",
        customerSended: "Müşteri gönderildi.",
        allCustomersSended: "Tüm müşteriler gönderildi.",
    },
    item: {
        itemSended: "Öğe gönderildi.",
    },
    employee: {
        employeeCreated: "Çalışan oluşturuldu.",
        employeeDeleted: "Çalışan silindi.",
        employeeEdited: "Çalışan düzenlendi.",
        employeeSended: "Çalışan gönderildi.",
        allEmployeesSended: "Tüm çalışanlar gönderildi.",
    },
    reservation: {
        reservationCreated: "Rezervasyon oluşturuldu.",
        reservationDeleted: "Rezervasyon silindi.",
        reservationEdited: "Rezervasyon düzenlendi.",
        reservationSended: "Rezervasyon gönderildi.",
        allReservationsSended: "Tüm rezervasyonlar gönderildi.",
    }
}

module.exports = { errorMessages, successMessages };