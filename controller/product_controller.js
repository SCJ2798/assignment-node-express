const { Router } = require("express");
const { isEndUserAuthorized } = require("../middleware/auth_middleware");
const ProductRepository = require('../repository/product_repository');
const app = Router();


app.post('/',isEndUserAuthorized,async (req,res,next) => {
    try {
        const {name,price,quantity} = req.body;
        const result = await ProductRepository.addProduct(name,price,quantity);
        res.status(200).json({
            msg:"OK",
            data:result
        });
    } catch (error) {
        next(error);
    }
});

app.get('/',isEndUserAuthorized,async (req,res,next) => {
    try {
        const {page,limit} = req.query;
        const result = await ProductRepository.getProducts({page,limit});
        res.status(200).json({
            msg:"OK",
            data:result
        });
    } catch (error) {
        next(error);
    }
});

app.get('/:uuid',isEndUserAuthorized,async (req,res,next) => {  
    try {
        const {uuid} = req.params;
        const result = await ProductRepository.getProductByUuid(uuid)
        res.status(200).json({
            msg:"OK",
            data:result
        });

    } catch (error) {
        next(error);
    }
});

app.put('/:uuid',isEndUserAuthorized,async (req,res,next) => {
    try {
        const {uuid} = req.params;
        const result = await ProductRepository.updateProduct(uuid,{...req.body});
        res.status(200).json({
            msg:"OK",
            data:result
        });
    } catch (error) {
        next(error);
    }
});

app.delete('/:uuid',isEndUserAuthorized,async (req,res,next) => {  
    try {
        const {uuid} = req.params;
        const result = await ProductRepository.deleteProduct(uuid)
        res.status(200).json({
            msg:"OK",
            data:result
        });

    } catch (error) {
        next(error);
    }
});


module.exports = app;