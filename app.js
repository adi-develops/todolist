const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const mongoose = require("mongoose")
const _ = require("lodash")

const date = require(__dirname + "/date.js")    // Imported from date.js
// console.log(date())
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
mongoose.connect("mongodb+srv://admin-aditya:test123@cluster0.dbd4dwc.mongodb.net/todolistDB")

// Old way of storing data
// const items = [];
// const workItems = [];

const todayDate = date.getDate();     // To get the date

const itemSchema = new mongoose.Schema({
    name: String
})

const Item = mongoose.model("Item", itemSchema)

const item1 = new Item({
    name: "Welcome to your Todo List"
})

const item2 = new Item({
    name: "Click + to add an item"
})

const item3 = new Item({
    name: "<-- Hit this to delete an item>"
})

const defaultItems = [item1, item2, item3]

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
})

const List = mongoose.model("List", listSchema)

app.get('/', (req, res) => {

    Item.find((err, foundItems) => {
        if (foundItems.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err)
                }
                else {
                    console.log("Items added successfully!")
                }
            })
            res.redirect("/")
        }
        else {
            res.render('list', { listTitle: todayDate, newListItems: foundItems });
        }
    })
})

app.post("/", (req, res) => {
    const itemName = req.body.newItem
    const listName = req.body.list
    // console.log(listName == todayDate)
    const item = new Item({
        name: itemName
    })

    if(listName === todayDate){
        item.save()     // Shortcut instead of using insert methods
        res.redirect("/")
    }
    else{
        List.findOne({name: listName}, (err, foundList)=>{
            if(!err){
                // console.log(foundList)
                foundList.items.push(item)
                foundList.save()
                res.redirect("/" + listName)
            }
        })
    }
})

app.post("/delete", (req, res)=>{
    const checkedItemId = req.body.check
    const listName = req.body.list
    // console.log(listName)
    // console.log(todayDate)
    
    if(listName === todayDate){
        // console.log("I am here")
        Item.findByIdAndDelete(checkedItemId, (err)=>{
            if(!err){
                // console.log("Deleted Successfully checked item")
                res.redirect("/")
            }
        })
    }
    else{
        // console.log("Why am I here")
        List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, (err, foundList)=>{
            if(!err){
                res.redirect("/" + listName)
            }
        })
    }
})

app.get("/:customListName", (req, res)=>{
    const customListName = _.capitalize(req.params.customListName)
    // console.log(customListName)
    List.findOne({name: customListName}, (err, foundList)=>{
        if(!err){
            if(!foundList){
                // console.log("List does not exists")
                
                const list = new List({
                    name: customListName,
                    items: defaultItems
                })
                list.save()
                res.redirect("/" + customListName)
            }
            else{
                res.render("list", {listTitle: customListName, newListItems: foundList.items})
            }
        }
    })

    
})

app.get("/about", (req, res) => {
    res.render('about')
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))