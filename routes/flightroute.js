const express = require("express");
const {FlightModel} = require("../model/flightmodel");
const {authenticate} = require("../middleware/authentication")

const flightRoute = express.Router();


flightRoute.get("/flights",async(req,res)=>{
    try {
        const flights = await FlightModel.find({});
        if(flights.length != 0){
            res.status(200).send(flights)
        }else{
            res.status(200).send({"msg":"NO flights are available"})
        }
    } catch (error) {
        res.send({"msg":"Some thing went wrong in flights fetch route"})
    }
})

flightRoute.get("/flights/:id",async(req,res)=>{
    let Id = req.params.id;
    try {
        const flight = await FlightModel.find({_id:Id});
        if(flight.length != 0){
            res.status(200).send(flight)
        }else{
            res.status(200).send({"msg":`NO flight is there with the given id ${Id}`})
        }
    } catch (error) {
        res.send({"msg":"Some thing went wrong in flight fetch route"})
    }
})

flightRoute.use(authenticate);

flightRoute.post("/flights",async(req,res)=>{
    const {airline,flightNo,departure,arrival,departureTime,arrivalTime,seats,price} = req.body;

    try {
        let all_data = await FlightModel.find({flightNo});
        if(all_data.length === 0){
            const flight = new FlightModel({airline,flightNo,departure,arrival,departureTime,arrivalTime,seats,price});
            await flight.save()
            res.status(201).send("Flight added to the system")
        }else{
            res.send({"msg":`A flight already exists with the same flightNo: ${flightNo}`});
        }
        
    } catch (error) {
        res.send({"msg":"Some thing went wrong in flight post route"})
    }
});

flightRoute.patch("/flights/:id",async(req,res)=>{
    let Id = req.params.id
    let data = req.body
    try {
        let all_data = await FlightModel.find({_id:Id});
        // console.log(all_data)
        if(all_data.length == 0){
            res.send({"msg":`No flight found with the given id : ${Id}`})
        }else{
            await FlightModel.findByIdAndUpdate({_id:Id},data);
            res.status(201).send(`Flight id of ${Id} detials updated successfully`);
        }
    } catch (error) {
        res.send({"msg":`No flight found with the given id : ${Id}`})
    }
})

flightRoute.put("/flights/:id",async(req,res)=>{
    let Id = req.params.id
    const {airline,flightNo,departure,arrival,departureTime,arrivalTime,seats,price} = req.body
    try {
        let all_data = await FlightModel.find({_id:Id});
        // console.log(all_data)
        if(all_data.length == 0){
            res.send({"msg":`No flight found with the given id : ${Id}`})
        }else{
            if(airline && flightNo && departure && arrival && departureTime && arrivalTime && seats && price){
                await FlightModel.findOneAndReplace({_id:Id},{airline,flightNo,departure,arrival,departureTime,arrivalTime,seats,price});
                res.status(201).send(`Flight id of ${Id} detials updated successfully`);
            }else{
                res.send({"msg":"Please fill all the detials"})
            }
        }
    } catch (error) {
        res.send({"msg":`No flight found with the given id : ${Id}`})
    }
})

flightRoute.delete("/flights/:id",async(req,res)=>{
    let Id = req.params.id;
    try {
        let data = await FlightModel.findOne({_id:Id});
        if(data.length != 0){
            await FlightModel.findByIdAndDelete({_id:Id});
            res.status(202).send(`Flight with id : ${Id} deleted successfully`)
        }else{
            res.send(`There is no flight with the id : ${Id} to Delete`)
        }
    } catch (error) {
        res.send({"msg":"Some thing went wrong in flight delete route"})
    }
})

module.exports={
    flightRoute
}