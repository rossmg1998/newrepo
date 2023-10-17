const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function (data) {
  if (data.length === 0) {
   return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  const grid = data.map(vehicle => {
   const {
    inv_id,
    inv_make,
    inv_model,
    inv_thumbnail,
    inv_price,
   } = vehicle;

   return `
    <div class="vehicle">
      <li>
        <a href="../../inv/detail/${inv_id}" title="View ${inv_make} ${inv_model} details">
          <img src="${inv_thumbnail}" alt="Image of ${inv_make} ${inv_model} on CSE Motors" />
        </a>
        <div class="namePrice">
          <hr />
          <h2>
            <a href="../../inv/detail/${inv_id}" title="View ${inv_make} ${inv_model} details">
              ${inv_make} ${inv_model}
            </a>
          </h2>
          <span>$${new Intl.NumberFormat('en-US').format(inv_price)}</span>
        </div>
      </li>
    </div>
    `;
  });

  return '<ul id="inv-display">' + '<div class="grid-container">' + grid.join('') + '</div>' + '</ul>';
};


/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailedGrid = async function (data) {
  if (data.length === 0) {
   return '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }

  const grid = data.map(vehicle => {
   const {
    inv_id,
    inv_make,
    inv_model,
    inv_image,
    inv_price,
   } = vehicle;

   return `
    <div class="vehicle">
      <li>
        <div class="vehicle-image">
          <a href="../../inv/detail/${inv_id}" title="View ${inv_make} ${inv_model} details">
            <img src="${inv_image}" alt="Image of ${inv_make} ${inv_model} on CSE Motors" />
          </a>
        </div>
        <div>
          <h2>${inv_make} ${inv_model}</h2>
        </div>
      </li>
    </div>
    `;
  });

  return '<ul id="inv-display">' + grid.join('') + '</ul>';
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util