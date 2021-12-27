const createSubCategories = (categories,parentId=null)=>{
    const categoryList = [];
    let filterCategories ;
    if(parentId==null){
        filterCategories = categories.filter(cat=>cat.parentId==undefined);
    }else{
        filterCategories = categories.filter(cat=>cat.parentId==parentId);
    }

    for(let cat of filterCategories){
        categoryList.push({
            _id:cat._id,
            name:cat.name,
            slug:cat.slug,
            parentId:cat.parentId,
            children:createSubCategories(categories,cat._id)
        })
    }
     return categoryList;
}
module.exports = createSubCategories