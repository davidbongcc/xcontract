let knexConfig = require('../../knex/knexfile');
let knex = require('knex')(knexConfig[process.env.NODE_ENV || "development"]);

module.exports = {

    registerDapp : (dappName, abi, contractAddress, cb) => {
        knex.table("dapptable").insert({dappname: dappName, contractaddress:contractAddress, abi: abi})
            .then((data) => {
                console.log(data);
                cb(null, true);
            })
            .catch((err) =>
            {
                cb(err, false);
            });
    },

    checkIfContractIsRegistered : (contractAddress, cb) => {
        knex.table("dapptable").select().where({ contractaddress : contractAddress }).then( (data) => {
                if(data) cb(true, data);
                else cb(false, null);
            })
            .catch( (err) =>
            {
                throw err;
            });
    }

};