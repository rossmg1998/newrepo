const jwt = require("jsonwebtoken")
require("dotenv").config()
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
  let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li>'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" /></a>'
        grid += '<div class="namePrice">'
        grid += '<hr />'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
};

/* **************************************
* Build the details view HTML
* ************************************ */
Util.buildDetailedGrid = function (itemDetail) {
  let detailGrid = '';

  if (itemDetail) {
    detailGrid += '<ul id="inv-display">';
    detailGrid += '<li>';
    detailGrid += '<div class="vehicle-content">';
    detailGrid += '<div class="vehicle-image">';
    detailGrid += `<img src="${itemDetail.inv_image}" alt="${itemDetail.inv_make} ${itemDetail.inv_model}" />`;
    detailGrid += '</div>';
    detailGrid += '<div class="vehicle-description">';
    detailGrid += `<h2>${itemDetail.inv_make} ${itemDetail.inv_model} ${itemDetail.inv_year}</h2>`;
    detailGrid += `<p><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(itemDetail.inv_price)}</p>`;
    detailGrid += `<p><strong>Description:</strong> ${itemDetail.inv_description}</p>`;
    detailGrid += `<p><strong>Miles:</strong> ${new Intl.NumberFormat('en-US').format(itemDetail.inv_miles)}</p>`;
    detailGrid += `<p><strong>Color:</strong> ${itemDetail.inv_color}</p>`;
    detailGrid += '</div>';
    detailGrid += '</div>';
    detailGrid += '</li>';
    detailGrid += '</ul>';
  } else {
    detailGrid += '<p class="notice">Sorry, the requested vehicle details could not be found.</p>';
  }

  return detailGrid;
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {

    if (req.cookies.jwt) {
        jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => { // replace secretKey with your actual secret key
            if (err) {
                req.flash("notice", "Invalid token.");
                return res.redirect("/account/login");
            } else {
                if (decoded.account_type === 'Employee' || decoded.account_type === 'Admin') {
                    next();
                } else {
                    req.flash("notice", "You do not have permission to access the inventory management page.");
                    return res.redirect("/account/");
                }
            }
        });
    } else {
        req.flash("notice", "No token provided.");
        return res.redirect("/account/login");
    }
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

module.exports = Util