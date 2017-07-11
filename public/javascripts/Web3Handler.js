let request = require("superagent");
let Web3 = require("web3");
let web3 = new Web3();

//TODO refactor
module.exports = {

    checkIfContractIsVerified : (contractAddress, cb) =>
    {
        let etherScanApi = "http://api.etherscan.io/api?module=contract&action=getabi&address=";

        request.get(etherScanApi + contractAddress, (error, data) =>
        {
            if(error)
            {
                cb(error, null);
                throw error;
            }
            else
            {
                cb(null, data);
            }
        });
    },
    //TODO handle payable functions in here
    extractAbiFunctions : (abi) =>
    {
        let functionObjects = {};
        let functionArray = [];
        let isPayableFunctionArray = [];

        for(i=0; i < abi.length; i++)
        {
            if(abi[i].type == "function")
            {
                functionArray.push(abi[i]);
                isPayableFunctionArray.push(isPayable(abi[i]));
            }
        }

        functionObjects.functionsInContract = functionArray;
        functionObjects.isPayable = isPayableFunctionArray;

        return functionObjects;
    },

    getContractFunctionNamesAndParams : (abiFunctions) =>
    {
        let nameAndParamObj = {};
        let functionNameFields = [];
        let functionParamFields = [];
        let readOnlyParamInputs = [];

        for(i=0; i < abiFunctions.functionsInContract.length; i++)
        {
            let functionName = abiFunctions.functionsInContract[i].name;
            let functionParams = JSON.stringify(abiFunctions.functionsInContract[i].inputs[0]);
            //create jade elements for each function with name and param
            functionNameFields.push(functionName);
            if(abiFunctions.isPayable[i] == true)
            {
                if(functionParams != null)
                {
                    readOnlyParamInputs.push(false);
                    functionParamFields.push(functionParams + ',{"name":"value","type":"uint256"}');
                }
                else
                {
                    readOnlyParamInputs.push(false);
                    functionParamFields.push('{"name":"value","type":"uint256"}');
                }
            }
            else
            {
                if(functionParams != null)
                {
                    readOnlyParamInputs.push(false);
                    functionParamFields.push(functionParams);
                }
                else
                {
                    readOnlyParamInputs.push(false);
                    functionParamFields.push(null);
                }
            }
        }

        nameAndParamObj.names = functionNameFields;
        nameAndParamObj.params = functionParamFields;
        nameAndParamObj.readOnly = readOnlyParamInputs;

        return nameAndParamObj;
    },

    //TODO add value as a param to payable function, find a way to make a call too instead of tx for some funcs
    executeContractFunction : (contract, functionName, params) =>
    {
         //must use bracket notation as function name is passed as a string
         if(params == null)
         {
             contract[functionName]( (err, data) =>
             {
                 if(err) throw err;
             });
         }
         else
         {
             contract[functionName](params, (err, data) =>
             {
                 if(err) throw err;
             });
         }
    },

    callContractFunction : (contract, functionName, params, callback) =>
    {
        //must use bracket notation as function name is passed as a string
        if(params == null)
        {
            contract.call()[functionName]( (err, data) =>
            {
                //TODO make sure error is thrown when using a call incorrectly (when should use a transaction)
                if(err)
                {
                    callback(false);
                    throw err;
                }
                alert("here is the response from web3: " + data);
                callback(true);
            });
        }
        else
        {
            contract.call()[functionName](params, (err, data) =>
            {
                if(err)
                {
                    callback(false);
                    throw err;
                }
                alert("here is the response from web3: " + data);
                callback(true);
            });
        }
    },

    checkAddressValidity : (address) =>
    {
        return web3.isAddress(address);
    }
};

function isPayable(abi)
{
    if(typeof abi.payable != 'undefined')
    {
        if(abi.payable == true)
        {
            return true;
        }
    }
    return false;
}