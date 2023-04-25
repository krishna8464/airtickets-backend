const express = require("express");
const {BookingModel} = require("../model/bookingmodel");
const {UserModel} = require("../model/usermodel");
const {FlightModel} = require("../model/flightmodel")
const {authenticate} = require("../middleware/authentication")

const bookingRoute = express.Router();

bookingRoute.use(authenticate)

bookingRoute.get("/dashboard",async(req,res)=>{
    try {
        all_data = await BookingModel.find({});
        res.send(all_data)
        } catch (error) {
        res.send({"msg":"some thing went wrong in the booking route"})
    }
})

bookingRoute.post("/booking",async(req,res)=>{
    let userid = req.body.userid;
    let flight_id = req.body.flight_id;
    try {
    let user  = await UserModel.findOne({_id:userid});
    let flight = await FlightModel.findOne({_id:flight_id});
        let obj = {
            user : user,
	        flight : flight
        }
        const booking = new BookingModel(obj);
        await booking.save();
        res.status(201).send("Booking Successfull")
    } catch (error) {
        console.log(error)
        res.send("something went wrong in booking route")
    }
})




module.exports={
    bookingRoute
}