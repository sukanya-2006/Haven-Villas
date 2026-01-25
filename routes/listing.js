const express =  require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");  //requiring the listing model
const path = require("path");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js"); 
const ListingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../CloudConfig.js");
const upload = multer({ storage });


//Index and Create Routes - show all listings and create new listings
router.route("/")
.get( wrapAsync(ListingController.index))
.post( 
    isLoggedIn,
    // validateListing,
    upload.single('listing[image][url]'),
    wrapAsync (ListingController.createListing)
);
// .post( upload.single('listing[image][url]'), (req, res) => {
//     res.send(req.file);
// });

//New Route
router.get("/new", isLoggedIn, ListingController.renderNewForm);


//Show, Update and Delete Routes - show, update and delete a particular listing
router.route("/:id")
.get(wrapAsync(ListingController.showListing ))
    .put( 
    isLoggedIn,
    isOwner,
    validateListing,
    upload.single('listing[image][url]'),
    wrapAsync(ListingController.updateListing)
)
.delete(
    isLoggedIn,
    isOwner,
    wrapAsync( ListingController.destroyListing)
)


//Edit Route - to edit a listing
router.get(
    "/:id/edit", 
    isLoggedIn,
    isOwner,
    wrapAsync (ListingController.renderEditForm)
);

module.exports = router;
