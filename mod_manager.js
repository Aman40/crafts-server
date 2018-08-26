
/**
 * Handles requests from the manager page. We do this first
 * Responsibilities:
 * -Add/remove categories/subcategories
 * 
 * -Approve items added by providers to make them public
 * -
 */
const express = require('express');
const router = express.Router();
const mysql = require('mysql');

router.use('./add_category', function(){
    /**
     * Receive 
     * 1. A category
     * 2. Subcategories
     * 3. Images for each subcategory
     * The data takes the structure below.
     */
    // {
    //     categories: [
    //         {
    //             category_name: "_name",
    //             subcategories: [
    //                 {
    //                     subcatName: "_name",
    //                     subcatImages: [
    //                         {
    // //Upload the images first, retrieve the imageURIs then run the queries.
    //                             imageURI: "dataString"
    //                         }
    //                     ]
    //                 }
    //             ]
    //         }
    //     ]
    // }
    /**
     * I need an organized way to run db queries inside nested /for/ loops. In the past I've
     * used a system of emitting and catching events, which worked flawlessly for a single
     * for loop. For nested loops... I'm hoping to impress myself.
     * Transactions: Define a series of queries first (insert category, insert subcategories),
     * and run the transaction. If any of the queries fails, all of them are rolled back
     * without commitment. Commitment only happens when all of them run successfully.
     */
    //Insert the following test data into the db
    const testData = {
        categories: [
            {
                name: "Clothes",
                subCats: [
                    {
                        name: "Men",
                        images: [
                            {
                                imageURI: "_imageuri"
                            },
                            {
                                imageURI: "_imageuri2"
                            }
                        ]
                    },
                    {
                        name: "Women",
                        images: [
                            {
                                imageURI: "_imageuri3"
                            },
                            {
                                imageURI: "_imageuri4"
                            }
                        ]
                    }
                ]
            },
            {
                name: "Shoes",
                subCats: [
                    {
                        name: "Men",
                        images: [
                            {
                                imageURI: "_imageur5"
                            },
                            {
                                imageURI: "_imageuri6"
                            }
                        ]
                    },
                    {
                        name: "Women",
                        images: [
                            {
                                imageURI: "_imageuri7"
                            },
                            {
                                imageURI: "_imageuri8"
                            }
                        ]
                    }
                ]
            }
        ]
    }
});
router.use('/delete_category', function(req, res, next){
    //Delete a category and whatever underlies it. Subcats and images
});
router.use('/delete_subcategory', function(req, res, next){
    //Delete subcategories and whatever underlies it. Images.
})
router.use('/delete_subcat_image', function(req, res, next){
    //Delete a subcategory image
})
router.use('/add_subcat_image', function(req, res, next){
    //Add a subcategory image. To replace what was deleted above.
})

/**
 * Next: Editing items added by the providers before submission.
 * This will depend on how the adding of the items in mod_provider is done
 * What we mostly want to edit is the price. 
 * The editing actually happens in the manager client. What we do here is the 
 * submission which shouldn't be any different from the submission in mod_provider.
 * Only difference is the table of submission
 */
router.use('/add_item', function(req, res, next){
    //Adding an item to the items<public> table.
})

module.exports = router;