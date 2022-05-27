/* libraries */
const help = require("../help")
const express = require("express");
const ejs = require('ejs');
const router = express.Router();
const mysqlDB = require('../database/databaseAccessLayer')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Add your Secret Key Here


const { append } = require("express/lib/response");


/* express */
const app = express();
app.use(express.json())


//for payment 
app.engine('html', require('ejs').renderFile);
// app.use(express.static(path.join(__dirname, './views')));

router.get("/checkout_1", help.buyerAuthorized, async(req, res) => {
    let buyer_id = req.session.buyer.buyer_id
    let cartQuantity = await mysqlDB.getCartItemsLength(buyer_id)
    let cartItems = await mysqlDB.getCartItemsByBuyer(buyer_id)
    let subtotal = 0
    for (let cartItem of cartItems) {
        subtotal = subtotal + (parseInt(cartItem.product_quantity) * parseInt(cartItem.product_price))
    }
    res.render("checkout/checkout_1", { err: null, buyer_id, cartItems, cartQuantity, subtotal })
})





router.get("/checkout_confirmation", help.buyerAuthorized, async(req, res) => {
    let buyer_id = req.session.buyer.buyer_id
    let cartQuantity = await mysqlDB.getCartItemsLength(buyer_id)
    res.render("checkout/checkout_confirmation", { cartQuantity })
})


router.post("/checkout_confirmation", help.buyerAuthorized, async(req, res) => {
    let buyer_id = req.session.buyer.buyer_id
    let cartItems = await mysqlDB.getCartItemsByBuyer(buyer_id)
    let cart_id = await mysqlDB.getCartIdByBuyerId(buyer_id)
    let cartQuantity = await mysqlDB.getCartItemsLength(buyer_id)

    let deliveryfee = req.body.delivery
    let deliveryAddress = req.body.deliveryAddress
    let postalCode = req.body.postalCode
    let province = req.body.province
    let city = req.body.city

    let totalAmount = req.body.totalAmount

    let fullAddress = `${deliveryAddress}, ${city}, ${province} ${postalCode}`

    let subtotal = 0
    for (let cartItem of cartItems) {
        subtotal = subtotal + (parseInt(cartItem.product_quantity) * parseInt(cartItem.product_price))
    }

    let deliveryDays = 0
    if (parseInt(deliveryfee) === 10) {
        deliveryDays = 10
    } else if (parseInt(deliveryfee) === 20) {
        deliveryDays = 5
    }

    //=========for email======
    async function autoEmailSent(order_id) {
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MY_EMAIL,
                pass: process.env.MY_PASS
            }
        });

        var mailOptions = {
            from: process.env.MY_EMAIL,
            to: req.body.email,
            subject: 'Order Confirmation',
            html: `<div style="background-color: rgba(238, 193, 149, 0.19);  text-align: center; padding-top:50px; padding-bottom:30px; max-with:60%; font-size:18px">
            <h1 style="color: #e3974f;">L<span style="color: #c3d99d;">O</span>CALSCOOP</h1>
            <h3>Thank You For Supporting Local Business</h3>
            
            <h4>Order Detail:</h4>
            <table style="width: 400px; height: 200px; border:4px double #e3974f;margin-left:auto;margin-right:auto;">
                <tr>
                    <th style="padding-right: 80px;  margin-left:60px; text-align:left;">Order Confirmation</th>
                    <th style="text-align:right;">#` + order_id + `</th>
                </tr>
                <tr>
                    <td style="padding-right: 80px;  margin-left:60px; text-align:left;">Purchased Iterm(` + cartQuantity + `)</td>
                    <td style="text-align:right;">$` + subtotal.toFixed(2) + `</td>
                </tr>
                <tr>
                    <td style="padding-right: 80px;  margin-left:60px; text-align:left;">Shipping Fee</td>
                    <td style="text-align:right;">$` + parseInt(deliveryfee).toFixed(2) + `</td>
                </tr>
                <tr>
                    <td style="padding-right: 80px; margin-left:60px; text-align:left;">Sales Tax</td>
                    <td style="text-align:right;">$` + (subtotal * 0.12).toFixed(2) + `</td>
                </tr>
                <tr>
                    <th style="padding-right: 80px;  margin-left:60px; text-align:left;">TOTAL</th>
                    <th style="text-align:right;">$` + parseInt(totalAmount).toFixed(2) + `</th>
                </tr>
            </table>
           
    <div>
        <h4>Delivery Address:</h4>` + fullAddress + `
    </div>
    <h4 style="margin-bottom:50px;" >Your order will be delivery in ` + deliveryDays + ` days</h4>
        </div>`
        };

        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

    }

    //==for payment==========

    const stripCartItems = {}
    for (const item in cartItems) {
        const newItem = {}
        newItem.buyer_id = cartItems[item].buyer_id
        newItem.cart_id = cartItems[item].cart_id
        newItem.product_id = cartItems[item].product_id
        newItem.product_name = cartItems[item].product_name
        newItem.product_price = cartItems[item].product_price
        stripCartItems[item] = JSON.stringify(newItem)
    }


    try {
        stripe.customers
            .create({
                name: req.body.name,
                email: req.body.email,
                source: req.body.stripeToken,

            })
            .then(customer =>
                stripe.charges.create({
                    amount: totalAmount * 100,
                    currency: "CAD",
                    customer: customer.id,
                    metadata: {
                        ...stripCartItems,
                        customKey: ":)"
                    }
                })
            )
            // .then(() => res.render("checkout_confirmation.ejs"))
            .then(async(responses) => {

                let stripePaymentId = responses.id

                let order_id = await mysqlDB.createOrderAfterPayment(cart_id, totalAmount, stripePaymentId, fullAddress, deliveryfee)
                console.log("ooooo", order_id)
                await mysqlDB.completeCartAfterOrder(buyer_id)

                await autoEmailSent(order_id)

                res.redirect("/checkout/checkout_confirmation")
            })
            .catch(err => {
                console.log(err)
                res.redirect("/checkout/checkout_1")
            })
    } catch (err) {

        res.send(err);
    }

})




module.exports = router;