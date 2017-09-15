let request = require("superagent");
let Web3 = require("web3");
let web3 = new Web3();

module.exports = {

    checkIfContractIsVerified: (contractAddress, cb) =>
    {
        let etherScanApi = "http://api.etherscan.io/api?module=contract&action=getabi&address=";

        request.get(etherScanApi + contractAddress, (error, data) => {
            if (error) {
                cb(error, null);
                throw error;
            }
            else {
                cb(null, data);
            }
        });
    },
    
    //TODO handle payable functions in here
    extractAbiFunctions: (abi) => {
        let functionObjects = {};
        let functionArray = [];
        let isPayableFunctionArray = [];

        for (i = 0; i < abi.length; i++) {
            if (abi[i].type == "function") {
                functionArray.push(abi[i]);
                isPayableFunctionArray.push(isPayable(abi[i]));
            }
        }

        functionObjects.functionsInContract = functionArray;
        functionObjects.isPayable = isPayableFunctionArray;

        return functionObjects;
    },

    getContractFunctionNamesAndParams: (abiFunctions) =>
    {
        let nameAndParamObj = {};
        let functionNameFields = [];
        let functionParamFields = [];
        let readOnlyParamInputs = [];

        for (i = 0; i < abiFunctions.functionsInContract.length; i++)
        {
            let functionName = abiFunctions.functionsInContract[i].name;
            //create jade elements for each function with name and param
            functionNameFields.push(functionName);
            if (abiFunctions.isPayable[i] == true)
                let functionName = abiFunc.name;
            let functionParams = [];

            for (input of abiFunc.inputs) functionParams.push(JSON.stringify(input));

            //create jade elements for each function with name and param
            functionNameFields.push(functionName);
            functionParamFields.push(functionParams);

            //if there are no params then set the input to readonly
            if (functionParams.length == 0)
            {
                readOnlyParamInputs.push(false);
                functionParamFields.push('{"name":"value","type":"uint256"}');
            }
            else
            {
                readOnlyParamInputs.push(false);
                functionParamFields.push(null);
            }
        }

        nameAndParamObj.names = functionNameFields;
        nameAndParamObj.params = functionParamFields;
        nameAndParamObj.readOnly = readOnlyParamInputs;

        return nameAndParamObj;
    },

    //TODO add value as a param to payable function, find a way to make a call too instead of tx for some funcs
    executeContractFunction: (contract, functionName, params, cb) => {
        contract[functionName](params, (err, data) => {
            if (err) throw err;
            cb(data);
        });
    },

    checkIfPayable: (abi, functionName) => {
        return abi[functionName]["payable"];
    },

    checkAddressValidity: (address) => {
        return web3.isAddress(address);
    }

};
