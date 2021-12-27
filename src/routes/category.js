const express = require("express");
const categoryRoutes = new express.Router();
const Category = require("../models/Category");
const slugify = require("slugify");
const createSubCategories = require("../utilities/categoryUtils");
const auth = require("../middleware/auth");

categoryRoutes.get("/",async (req,res)=>{
try{
   const categories = await Category.find({});
   const categoryList = createSubCategories(categories)
   res.send({categories:categoryList});
}
catch(error){
    console.log(error)
 res.status(400).send(error);
}
});
categoryRoutes.post("/update",auth, async (req, res) => {
  try{
    console.log("dd",req.body)
    // const {_id,name ,parentId} = req.body;
    const itemsTobeUpdated = req.body;
    const updatedCategories = [];
    // if(name instanceof Array){
        for (let i = 0; i < itemsTobeUpdated.length; i++) {
          const category = {
            name: itemsTobeUpdated[i].name,
          };
          if (itemsTobeUpdated[i].parentId !== "") {
            category.parentId =itemsTobeUpdated[i].parentId;
          }
          const updatedCategory = await Category.findOneAndUpdate(   { _id: itemsTobeUpdated[i]._id }, category,{new:true});
          updatedCategories.push(updatedCategory)
        }
    //       const updatedCategory = await Category.findOneAndUpdate(
    //         { _id: _id[i] },
    //         category,
    //         { new: true }
    //       );
    //       updatedCategories.push(updatedCategory); 
    //     }
    //     console.log("updated if",updatedCategories)
    //     return res.status(201).json({ updateCategories: updatedCategories });
    //   }else {
    //     const category = {
    //       name,
    //     };
    //     if (parentId !== "") {
    //       category.parentId = parentId;
    //     }
    //     const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
    //       new: true,
    //     });
    //     console.log("updated else",updatedCategories)
    //     return res.status(201).json({ updatedCategory });
    //   }


    // if(name instanceof Array){
    //     for (let i = 0; i < name.length; i++) {
    //       const category = {
    //         name: name[i],
    //       };
    //       if (parentId[i] !== "") {
    //         category.parentId = parentId[i];
    //       }
    
    //       const updatedCategory = await Category.findOneAndUpdate(
    //         { _id: _id[i] },
    //         category,
    //         { new: true }
    //       );
    //       updatedCategories.push(updatedCategory); 
    //     }
    //     console.log("updated if",updatedCategories)
    //     return res.status(201).json({ updateCategories: updatedCategories });
    //   }else {
    //     const category = {
    //       name,
    //     };
    //     if (parentId !== "") {
    //       category.parentId = parentId;
    //     }
    //     const updatedCategory = await Category.findOneAndUpdate({ _id }, category, {
    //       new: true,
    //     });
    //     console.log("updated else",updatedCategories)
    //     return res.status(201).json({ updatedCategory });
    //   }
    return res.send({updatedCategories})
  }
  catch(error){
    console.log("Errror",error)
    res.status(400).send(error);
  }
});


categoryRoutes.post("/create",auth, async (req, res) => {
  try{
    const categoryObj = {
        name:req.body.name,
        slug:slugify(req.body.name) 
    }
    if(req.body.parentId){
        categoryObj.parentId = req.body.parentId;
    }
    const cat = new Category(categoryObj);
    await cat.save();
    res.status(201).send({
      category: cat});
  }
  catch(error){
    res.status(400).send(error);
  }
});

categoryRoutes.post("/delete",auth, async (req, res) => {
  try{
      const categoriesToBeDeleted  = req.body;
           console.log("Cat",categoriesToBeDeleted)
           const deletedCategories = [];
         for(let i = 0;i<categoriesToBeDeleted.length;i++){
          const deletedCategory = await Category.findByIdAndDelete({_id:categoriesToBeDeleted[i]._id}).exec();
          deletedCategories.push(deletedCategory);
        }
        res.send({deletedCategories});
  }
  catch(error){
    console.log("error",error)
    res.status(400).send(error);
  }
})
module.exports = categoryRoutes;