
const { sequelize } = require("../models");
const { 
    Product
 } = require("../models");

module.exports.addProduct = (name,price,quantity) => {
    
    return new Promise(async(resolve,reject) => {
        const dbTransaction = await sequelize.transaction();
        try {
            const newProduct = await Product.create(
                {
                    name:name,
                    price:price,
                    quantity:quantity    
                },{
                    transaction:dbTransaction
            });
            await dbTransaction.commit();
            resolve(newProduct);
        } catch (error) {
            console.log(error);
            await dbTransaction.rollback();
            console.log("PRODUCT RECORD: ROLL BACKED");
            reject(error);
        }
    });
}
module.exports.getProducts = ({page=0,limit=10}) => {
    return new Promise(async(resolve,reject) => {
        try {
            const offset = parseInt(page) * parseInt(limit);
            let [count,records] = await Promise.all([
                Product.count(),
                Product.findAll({
                    attributes:[
                        'uuid',
                        'name',
                        'price',
                        'quantity',
                    ],
                    order:[['createdAt', 'DESC']],
                    limit:parseInt(limit),
                    offset:offset,
                })
            ])
            resolve({count,records});
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
module.exports.getProductByUuid = (uuid) => {
    return new Promise(async(resolve,reject) => {
        try {
            let record = await Product.findAll({
                attributes:[
                    'uuid',
                    'name',
                    'price',
                    'quantity',
                ],
                where:{ uuid:uuid }
            })
            resolve(record);
        } catch (error) {
            console.log(error);
            reject(error);
        }
    });
}
module.exports.updateProduct = (uuid,updatedData) => {
    return new Promise(async(resolve,reject) => {
        const dbTransaction = await sequelize.transaction();
        try {
            let result = await Product.update(updatedData,{
                where:{
                    uuid:uuid
                },
                transaction:dbTransaction
            });
            console.log(result)
            await dbTransaction.commit();
            resolve("UPDATED");
        } catch (error) {
            console.log(error);
            await dbTransaction.rollback();
            console.log("PRODUCT UPDATED:RECORD ROLL BACKED");
            reject(error);
        }
    });
}
module.exports.deleteProduct = (uuid) => {
    return new Promise(async(resolve,reject) => {
        const dbTransaction = await sequelize.transaction();
        try {
            await Product.destroy({
                where:{
                    uuid:uuid
                },
                transaction:dbTransaction
            });
            await dbTransaction.commit();
            resolve("DELETED");
        } catch (error) {
            console.log(error);
            await dbTransaction.rollback();
            console.log("PRODUCT DELETE:RECORD ROLL BACKED");
            reject(error);
        }
    });
}









