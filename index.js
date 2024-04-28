const express = require('express');
const fs = ('fs');
const path = require('path');
require('dotenv/config');
const stripe = require('stripe')(process.env.SECRET_API);


const port = 3000;
const app = express();

app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");
app.use('/public', express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, '/views'));


app.get('/payment', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'iagoPdaS',
            },
            unit_amount: 2000,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: 'http://localhost:3000/success?token={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:3000?cancel',
    });
  
    res.redirect(303, session.url);
  });
  
  app.get('/success/', async (req, res) => {
    if(req.query.token != null){
        try{
   const session = await stripe.checkout.sessions.retrieve(
    req.query.token
   );
   if(session.payment_status == "paid"){
    //libera produto
    // ou faz um cadastro
    //ou envia um email
    res.send('paid');
   }else{
    res.send("An error occurred, payment not processed");
   }
   }catch(e){
    res.send('fail');
   }
    }else{
    res.send("we need  a token to proceed");
   }
  })

app.get('/',(req,res)=>{
    res.render('index');
});

app.listen(port,()=>{
    process.env.SECRET_API
    console.log('server running')
})