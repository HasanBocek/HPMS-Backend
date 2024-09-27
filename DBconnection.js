const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

function connectMongoServer() {
    console.log("MongoDB bağlantısı kuruluyor...");

    mongoose
        .connect(mongoURI)
        .then(() => {
            console.log("MongoDB bağlantısı başarılı.");
        })
        .catch((err) => {
            console.error("MongoDB bağlantı hatası:", err);
            console.log("2 saniye sonra tekrar denenecek...");
            setTimeout(connectMongoServer, 2000);
        });
}

mongoose.connection.on("connected", () => {
    console.log("MongoDB bağlantısı kuruldu.");
});

mongoose.connection.on("error", (err) => {
    console.error(`MongoDB bağlantı hatası: ${err}`);
});

mongoose.connection.on("disconnected", () => {
    console.log("MongoDB bağlantısı kesildi, tekrar bağlanıyor...");
    connectMongoServer();
});

connectMongoServer();