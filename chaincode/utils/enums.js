'use strict';

const PharmaNetOrgs = Object.freeze({
  manufacturer: 'manufacturerMSP',
  distributor: 'distributorMSP',
  retailer: 'retailerMSP',
  transporter: 'transporterMSP',
  consumer: 'consumerMSP'
});

const PharmaNetRoles = Object.freeze({
  Manufacturer: 1,
  Distributor: 2,
  Retailer: 3,
  Transporter: null //No hierarchy key for transporters
});

const ShipmentStatus = Object.freeze({
  inTransit: 'in-transit',
  delivered: 'delivered'
});

module.exports = {
  ...module.exports,
  PharmaNetOrgs,
  PharmaNetRoles,
  ShipmentStatus,
}