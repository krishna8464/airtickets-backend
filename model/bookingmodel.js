const mongoose = require("mongoose");

const bookingSchema = mongoose.Schema({
    user : Object,
	 flight : Object
},{
    versionKey:false
})

const BookingModel = mongoose.model("Bookings",bookingSchema);

module.exports={
    BookingModel
}