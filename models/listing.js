const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./reviews.js");
const mongoosePaginate = require("mongoose-paginate-v2");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

image: {
  url: String,
  filename: String,
},

  // image: {
  //   filename: {
  //     type: String,
  //     default: "listingimage",
  //   },
  //   url: {
  //     type: String,
  //     default: "https://unsplash.com/photos/body-of-water-during-golden-hour-oQl0eVYd_n8",
  //     set: (v) =>
  //       v === ""
  //         ? "https://unsplash.com/photos/body-of-water-during-golden-hour-oQl0eVYd_n8"
  //         : v,
  //   },
  // },

  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ],
  owner: 
     {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  }
});
  // coordinates : {
  //    type: [Number],
  //    requires: true
  // }


listingSchema.plugin(mongoosePaginate);

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     type: String,
//     default: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
//     set: (v) =>
//       v === ""
//         ? "https://images.unsplash.com/photo-1507525428034-b723cf961d3e"
//         : v,
//   },
//   price: Number,
//   location: String,
//   country: String,
// });

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
    await Review.deleteMany({_id: {$in: listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

