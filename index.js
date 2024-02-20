import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [
  { id: 1, title: "Buy milk" },
  { id: 2, title: "Finish homework" },
];
const db=new pg.Client({
  user:"postgres",
  host:"localhost",
  database:"permalist",
  password:"KRISH2004",
  port:5432
});
db.connect();
app.get("/", async(req, res) => {
  res.render("main.ejs");
});
const days=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
days.forEach((day)=>{
  app.get(`/${day}`,async(req,res)=>{
    const result=await db.query("SELECT * FROM items WHERE day=$1 ORDER BY id ASC",[day]);
    items=result.rows;
    res.render("index.ejs",{
      listTitle:day,
      listItems:items,
    }); 
  });
  
  app.post("/add", async(req, res) => {
    const item = req.body.newItem;
    const day=req.body.day;
    const Id=items.length+1;
    console.log(req.body.day);
    await db.query("INSERT INTO items (title, day) VALUES ($1, $2)", [item, day]);
    res.redirect(`/${day}`);
  });
  
  app.post("/edit", async(req, res) => {
    const item=req.body.updatedItemTitle;
    const Id=req.body.updatedItemId;
    const day=req.body.day;
    db.query("UPDATE items SET title= ($1) WHERE id=$2 AND day=$3",[item,Id,day]);
    res.redirect(`/${day}`);
  });
  
  app.post("/delete",async (req, res) => {
    const Id=req.body.deleteItemId;
    const day=req.body.day;
    await db.query("DELETE FROM items WHERE id=$1",[Id]);
    res.redirect(`/${day}`);
  });
})
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
