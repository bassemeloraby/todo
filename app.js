const express = require('express');
const req = require('express/lib/request');
const res = require('express/lib/response');
const mongoose = require('mongoose');
const app = express();
const methodOverride = require('method-override');

const Task = require('./model/tasks');
app.use(methodOverride('_method',{methods:['POST','GET']}));

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/ToDo', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});



//insert //localhost:3000/create/:title
app.post('/create', (req, res) => {
  const firstTask = new Task({ title: req.body.title });
  firstTask.save().then(() => res.redirect('/'));
});
//find//show
app.get('/', (req, res) => {
  Task.find({}, (error, tasks) => {
    if (error) console.log(`there was an error: ${error}`);
    else {
      res.render('todo.ejs', {todotasks: tasks});
    }
  });
});

//delete //localhost:3000/delete/:id
app.delete('/delete/:id', (req, res) => {
  Task.deleteOne({ _id: req.params.id }, (error) => {
    if (error) console.log(`there was an error: ${error}`);
    else {
      res.redirect('/');
    }
  });
});

//update
app.get('/update/:id', (req, res) => {
 const id = req.params.id;
 Task.find({},(error,tasks)=>{
   res.render("todoEdit.ejs",{todotasks: tasks,idTask:id});
 })
});

app.put("/update/:id",(req,res)=>{
  const id = req.params.id;
  Task.findByIdAndUpdate(id,{title: req.body.title}, err=>{
    if(err) return res.send(500,err);
    else res.redirect("/");
  });
})

app.listen(3000, () => console.log('express has started!'));
