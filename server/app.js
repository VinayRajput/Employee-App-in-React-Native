const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const configs = require("./configs/keys");
require("./model/employees");

app.use(bodyParser.json());

const Employee = mongoose.model("employee");

mongoose.connect(configs.MONGOURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})

mongoose.connection.dropCollection("connected", () => {
  console.log("connected to mongo")
})

mongoose.connection.on("error", (e) => {
  console.log(`error occurred in mongo connection: ${e}`)
})

app.get("/", (req, res) => {
  res.send(
    "welcome to server"
  )
})

app.post("/deleteEmployee", (req, res) => {

  Employee.findByIdAndDelete(req.body.id)
    .then(data => {
      console.log(data);
      if (!data) {
        return res.json({ delete: false, msg: "No such record found" })
      }
      return res.json({ deleted: true, msg: "Record deleted successfully" });
    })
    .catch(e => console.log(e))
})

app.post("/updateEmployee", (req, res) => {
  const {
    id,
    name,
    email,
    phone,
    picture,
    salary,
    position
  } = req.body;

  //console.log(id)

  Employee.findByIdAndUpdate(id, {
    name,
    email,
    phone,
    picture,
    salary,
    position
  }, { new: true })
    .then(data => {
      res.json(data)
    })
    .catch(e => console.log(e))
})

app.get("/getEmployees", (req, res) => {
  Employee.find()
    .then(data => {
      res.json(data);
    })
    .catch(e => console.log(e))
})

app.post("/createEmployee", (req, res) => {
  console.log(req.body);
  //res.send("posted");
  const {
    name,
    email,
    phone,
    picture,
    salary,
    position
  } = req.body;
  const employee = new Employee({
    name,
    email,
    phone,
    picture,
    salary,
    position
  });
  employee.save()
    .then(data => {
      console.log(data);
      res.json(data);
    })
    .catch(e => console.log(e))

})

app.listen(3000, () => {
  console.log("server is runnig on 3000")
})