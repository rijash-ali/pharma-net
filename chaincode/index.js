'use strict';

const { DrugTransferContract } = require('./contracts/drugTransfer.contract');
const { LifeCycleContract }  = require('./contracts/lifecycle.contract');
const { RegistrationContract } = require('./contracts/registration.contract');

module.exports.contracts = [
  DrugTransferContract,
  LifeCycleContract,
  RegistrationContract
];