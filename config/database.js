const mongoose = require("mongoose");

const { DATABASE_URI } = process.env;

exports.connect = () => {
  mongoose
    .connect(DATABASE_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DB connected successful"))
    .catch((e) => {
      console.log("Errors : ", e);
      process.exit(1);
    });
};
