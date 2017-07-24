let express = require('express');
let router = express.Router();
let db = require("../public/javascripts/db.js");

router.get("/register", (req, res, next) => {
    res.render('register', {
        // status:"Register your dApp by filling out the form below"
    });
});

router.get("/register/:error", (req,res,next) => {
    let error = req.params.error;
    res.render('register', {
        status: "Error registering dApp: " + error
    });
});

//on submit
router.get('/register/:dappname/:contractaddress', (req,res,next) =>
{
    let dappName = req.params.dappname;
    let contractAddress = req.params.contractaddress;
    //verified
    let abi = data.body.result;
    db.registerDapp(dappName, abi, contractAddress, (err, data) => {
        if(data)
        {
            res.render('register', {
                status:"dApp registration successful"
            });
        }
        else
        {
            res.render('register', {
                status:"dApp already registered or error" + err
            });
        }
    });
});

module.exports = router;
