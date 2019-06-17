const express = require('express');
//
// for doing axios call without problems
const cors = require('cors');

//for have access to post request res.body
const bodyParser = require('body-parser');

//connecting to dababase
const database = require('./database');

const Students = require('./models/students');
const Campuses = require('./models/campuses');

database.authenticate()
  .then( ()=>{
        console.log("Connected database")
   })
   .catch((err)=>{
       console.log("Error "+ err)
   })


// const initialCampusState = {
//     campuses:[
//         {
//             campusName:"Lehman College",
//             location: '250 Bedford Park Blvd W The Bronx, NY 10468',
//             description: "Lehman College is a senior college of the City University of New York in New York, United States. Founded in 1931 as the Bronx campus of Hunter College, the school became an independent college within CUNY in September 1967.",
//             img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSwhJxE9QqsclsZaZzu_jn1olfPS4jd_ZE61sGgVlkZN0oyRQHUg",
//             campusStudents:[
//                 {
//                     name:"Jeffrey Almanzar",
//                     "gpa": "4.0",
//                     "url":"https://bronxbroncos.com/images/2018/2/28/2018_BCC_BB_17_Jeffery_Almanzar.jpg?width=300",
//                     campusName:"Lehman College"
//                 },
        
//                 {
//                     name:"Asifa Khan",
//                     "gpa": "3.9",
//                     "url":"https://media.licdn.com/dms/image/C4D03AQGxHD7Rte3TLQ/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=566EMNwsEbDTYjd1JLORorJuTeqFtroEZlDEQwpHze0",
//                     campusName:"Lehman College"
//                 }
//             ]
//         },

//         {
//             campusName:"City College",
//             location:"160 Convent Ave, New York, NY 10031",
//             description:"The City College of the City University of New York is a public senior college of the City University of New York in New York City. Located in Hamilton Heights overlooking Harlem in Manhattan, City College's 35-acre Collegiate Gothic campus spans Convent Avenue from 130th to 141st Streets.",
//             img:"",
            
//             campusStudents:[
//                 {
//                     name:"Ismael Almanzar",
//                     "gpa": "3.0",
//                     "url":"",
//                     campusName:"City College"
//                 },
        
//                 {
//                     name:"Jose Peres",
//                     "gpa": "3.8",
//                     "url":"",
//                     campusName:"City College"
//                 }
//             ]
//         }
//     ]
// }

// const initialStudentState ={
//     students :[
//         {
//             name:"Jeffrey Almanzar",
//             "gpa": "4.0",
//             "url":"https://bronxbroncos.com/images/2018/2/28/2018_BCC_BB_17_Jeffery_Almanzar.jpg?width=300",
//             campusName:"Lehman College"
//         },

//         {
//             name:"Asifa Khan",
//             "gpa": "3.9",
//             "url":"https://media.licdn.com/dms/image/C4D03AQGxHD7Rte3TLQ/profile-displayphoto-shrink_800_800/0?e=1565827200&v=beta&t=566EMNwsEbDTYjd1JLORorJuTeqFtroEZlDEQwpHze0",
//             campusName:"Lehman College"
//         }
//     ]

    
// }

// function extractData(arr,type){
//     let container =[];
//     if(type =="students"){

//         for(let i = 0; i < arr.length; i++) {
//             let columnData = arr[i].dataValues;
//             let name = columnData.name;
//             let campus = columnData.campus;
//             let gpa = columnData.gpa;
//             let url = columnData.url;
//             container.push({name, campus,gpa,url})
//         }

//         return container;

//     }else{
//         for(let i = 0; i < campuses.length; i++) {
//             let columnData = arr[i].dataValues;
//             let campusName = columnData.campusname;
//             let location = columnData.location;
//             let description = columnData.description;
//             let img= columnData.img;
//             container.push({campusName, location,description,img})
//         }
//         return container;

//     }
    
    
// }




const app = express();

app.use(cors());
app.use(bodyParser.json())

app.get('/' , (req, res) =>{
    Campuses.findAll({ where: {campusname: 'Lehman '} }).then(project => {
        // project will be the first entry of the Projects table with the title 'aProject' || null
        res.json(project)
      })
})

app.get('/campuses' , (req, res) =>{

    Campuses.findAll()
    .then( (campuses) =>{
        let allCampuses = [];
        for(let i = 0; i < campuses.length; i++) {
            let columnData = campuses[i].dataValues;
            let campusName = columnData.campusname;
            let location = columnData.location;
            let description = columnData.description;
            let img= columnData.img;
            
            allCampuses.push({campusName, location,description,img})
        }
        console.log(allCampuses)
        res.json({campuses : allCampuses});
    })
    .catch((err)=> console.log(err)) 
})

app.get('/students' , (req, res) =>{
    Students.findAll()
    .then( (students) =>{
        let allStudents = [];
        for(let i = 0; i < students.length; i++) {
            let columnData = students[i].dataValues;
            let name = columnData.name;
            let campusName = columnData.campus;
            let gpa = columnData.gpa;
            let url = columnData.url;
            allStudents.push({name, campusName,gpa,url})
        }
        console.log(allStudents)
        res.json({students : allStudents});
    })
    .catch((err)=> console.log(err))

})

app.post('/addStudent' , (req, res) =>{
    console.log(req.body)

        Students.create(req.body)
        .then((student)=>{
            console.log("Student")
            console.log(student)
            Campuses.findAll({ where: {campusname: req.body.campus} }).then(campuses => {
                // project will be the first entry of the Projects table with the title 'aProject' || null
                if(!campuses.length){
                    Campuses.create({campusname: req.body.campus })
                    .then((campus)=>{
                        console.log("Campus added")
        
                    })
                    
                }
            })
            res.send("Jeff added to data base");
        })
        .catch((err)=>{
            console.log(err)
            res.send("Jeff not good");
        })
    
})

app.post('/addCampus' , (req, res) =>{
    Campuses.create(req.body)
        .then((campus)=>{
            console.log("Campus added")
            res.send("Jeff added to data base");
        })
        .catch((err)=>{
            console.log(err)
            res.send("Jeff not good");
        })
   
})

app.put('/editCampus/:id' , (req, res) =>{
    console.log(req.params.id)
    res.json(req.body) 
    Campuses.update({
        campusname: req.body.campusName,
        location:req.body.location,
        img: req.body.img,
        description: req.body.description
        },

    {returning: true, where: {campusname: req.body.preVname} }
    )
    .then((campus)=>{
         console.log("MAde it")
         console.log(req.body)
         res.json(req.body)
    })
    .catch((err) => console.log(err))
})

app.put('/editStudent/:id' , (req, res) =>{

    console.log(req.params.id)
    
    
    Students.update({
            name: req.body.name,
            campus: req.body.campus,
            gpa: req.body.gpa,
            url: req.body.url
        },

    {returning: true, where: {name: req.body.preVname} }
    )
    .then((student)=>{
         console.log("MAde it")
         console.log(req.body)
         res.json(req.body)
    })
    .catch((err) => console.log(err))
       
})

app.get('/showStudent/:id' , (req, res) =>{
    
    res.send("showing a single student page");
})

app.get('/showCampus/:id' , (req, res) =>{
    res.send("showing a single campus page");
})

app.delete('/deleteStudent/:id', (req, res)=>{
    
    Students.destroy({where: {name: req.params.id}})
    .then((deleted)=>{
        res.send(req.params.id + "was deleted") 
    })
})

app.delete('/deleteCampus/:id', (req, res)=>{
    
    Campuses.destroy({where: {campusname: req.params.id}})
    .then((deleted)=>{
        res.send(req.params.id + "was deleted") 
    })
})


app.listen(3000, ()=>{
    console.log("It's running")
})