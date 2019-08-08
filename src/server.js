const express = require("express");

// for doing axios call without problems
const cors = require("cors");

//for have access to post request res.body
const bodyParser = require("body-parser");

//connecting to dababase
const database = require("./database");

const Students = require("./models/students");
const Campuses = require("./models/campuses");

database
  .authenticate()
  .then(() => {
    console.log("Connected database");
  })
  .catch(err => {
    console.log("Error " + err);
  });

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  Campuses.findAll({ where: { campusname: "Lehman " } }).then(project => {
    // project will be the first entry of the Projects table with the title 'aProject' || null
    res.json(project);
  });
});

app.get("/campuses", (req, res) => {
  Campuses.findAll()
    .then(campuses => {
      let allCampuses = [];
      for (let i = 0; i < campuses.length; i++) {
        let columnData = campuses[i].dataValues;
        let campusName = columnData.campusname;
        let location = columnData.location;
        let description = columnData.description;
        let img = columnData.img;

        allCampuses.push({ campusName, location, description, img });
      }
      
      res.json({ campuses: allCampuses });
    })
    .catch(err => console.log(err));
});

app.get("/students", (req, res) => {
  Students.findAll()
    .then(students => {
      let allStudents = [];
      for (let i = 0; i < students.length; i++) {
        let columnData = students[i].dataValues;
        let name = columnData.name;
        let campusName = columnData.campus;
        let gpa = columnData.gpa;
        let url = columnData.url;
        allStudents.push({ name, campusName, gpa, url });
      }
      res.json({ students: allStudents });
    })
    .catch(err => console.log(err));
});

app.post("/addStudent", (req, res) => {

  Students.create(req.body)
    .then(student => {
      Campuses.findAll({ where: { campusname: req.body.campus } }).then(
        campuses => {
          // project will be the first entry of the Projects table with the title 'aProject' || null
          if (!campuses.length) {
            Campuses.create({ campusname: req.body.campus }).then(campus => {
              console.log("Campus added");
            });
          }
        }
      );
      res.send("Jeff added to data base");
    })
    .catch(err => {
      console.log(err);
      res.send("Jeff not good");
    });
});

app.post("/addCampus", (req, res) => {
  Campuses.create(req.body)
    .then(campus => {
      console.log("Campus added");
      res.send("Jeff added to data base");
    })
    .catch(err => {
      console.log(err);
      res.send("Jeff not good");
    });
});

app.put("/editCampus/:id", (req, res) => {
  console.log(req.params.id);
  res.json(req.body);
  Campuses.update(
    {
      campusname: req.body.campusName,
      location: req.body.location,
      img: req.body.img,
      description: req.body.description
    },

    { returning: true, where: { campusname: req.body.preVname } }
  )
    .then(campus => {
      console.log("MAde it");
      console.log(req.body);
      res.json(req.body);
    })
    .catch(err => console.log(err));
});

app.put("/editStudent/:id", (req, res) => {
  console.log(req.params.id);

  Students.update(
    {
      name: req.body.name,
      campus: req.body.campus,
      gpa: req.body.gpa,
      url: req.body.url
    },

    { returning: true, where: { name: req.body.preVname } }
  )
    .then(student => {
      console.log("MAde it");
      console.log(req.body);
      res.json(req.body);
    })
    .catch(err => console.log(err));
});

app.get("/showStudent/:id", (req, res) => {
  res.send("showing a single student page");
});

app.get("/showCampus/:id", (req, res) => {
  res.send("showing a single campus page");
});

app.delete("/deleteStudent/:id", (req, res) => {
  Students.destroy({ where: { name: req.params.id } }).then(deleted => {
    res.send(req.params.id + "was deleted");
  });
});

app.delete("/deleteCampus/:id", (req, res) => {
  Campuses.destroy({ where: { campusname: req.params.id } }).then(deleted => {
    res.send(req.params.id + "was deleted");
  });
});

app.listen(3000, () => {
  console.log("It's running");
});
