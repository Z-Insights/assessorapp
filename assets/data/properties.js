// FILE: properties.js
// CLASSIFICATION: Asset Intelligence Database
// SOURCE: Extracted from GG 2.0 (21 properties)
// PURPOSE: Single source of truth for property portfolio
const PROPERTIES_DATA = [
{ address: "2480 Prince Michael Drive", city: "Oakville" },
{ address: "116 Deschene Avenue", city: "Hamilton" },
{ address: "136 Gage Avenue South", city: "Hamilton" },
{ address: "157 Albert Street East", city: "Sault Ste. Marie" },
{ address: "311 Huron Street", city: "Sault Ste. Marie" },
{ address: "535 Mohawk Road West", city: "Hamilton" },
{ address: "5 Napier St", city: "St. Catharines" },
{ address: "30 Grace Street", city: "Sault Ste. Marie" },
{ address: "12 Main Street East", city: "Selkirk" },
{ address: "127 Andrew St", city: "Sault Ste. Marie" },
{ address: "305 Huron Street", city: "Sault Ste. Marie" },
{ address: "185 Welland St", city: "Port Colborne" },
{ address: "22 Ferris Ave", city: "Sault Ste. Marie" },
{ address: "380 Park St N", city: "Peterborough" },
{ address: "189 March Street", city: "Sault Ste. Marie" },
{ address: "62 Division St", city: "St. Catharines" },
{ address: "130 York St", city: "St. Catharines" },
{ address: "181 Welland Street", city: "Port Colborne" },
{ address: "128 Belanger Avenue", city: "Timmins" },
{ address: "64 Preston St", city: "Timmins" },
{ address: "227 Maplewood Ave", city: "Hamilton" }
];
// Export for modular consumption
if (typeof module !== 'undefined' && module.exports) {
module.exports = { PROPERTIES_DATA };
}

