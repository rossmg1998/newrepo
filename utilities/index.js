const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  // console.log(data)
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

/* *****************************
 *  Build options for inventory
 * **************************** */
Util.buildOptions = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let options = '<select name="classification_id" id="classification_id">'
  options += "<option>Choose a Classification</option>"
  data.rows.forEach((row) => {
    options += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null && row.classification_id == classification_id
    ) {
      options += " selected "
    }
    options += ">" + row.classification_name + "</option>"
  })
  options += "</select>"
  return options
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
      <li>
      <div class="vehicle">
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
      </div>
      </li>
    `;
  });

  return '<ul id="inv-display">' + grid.join('') + '</ul>';
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
    inv_year,
    inv_description,
    inv_image,
    inv_price,
    inv_miles,
    inv_color,
   } = vehicle;

   return `
      <li>
        <div class="vehicle-content">
        <div class="vehicle-image">
          <a href="../../inv/detail/${inv_id}" title="View ${inv_make} ${inv_model} details">
            <img src="${inv_image}" alt="Image of ${inv_make} ${inv_model} on CSE Motors" />
          </a>
        </div>
        <div class="vehicle-description">
          <h2>${inv_make} ${inv_model} ${inv_year}</h2>
          <p><b>Price: <span>$${new Intl.NumberFormat('en-US').format(inv_price)}</span></b></p>
          <p><b>Description:</b> ${inv_description}</p>
          <p><b>Color:</b> ${inv_color}</p>
          <p><b>Miles:</b> <span>${new Intl.NumberFormat('en-US').format(inv_miles)}</span></p>
        </div>
        </div>
      </li>
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