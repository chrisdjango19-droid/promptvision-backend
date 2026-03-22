const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Route pour vérifier que le serveur tourne
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'PromptVision Backend' });
});

// Route pour créer la session de paiement Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: 'TON_ID_DE_PRIX_STRIPE', // L'Agent doit le remplacer ou j'ajouterai la variable plus tard
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });
    res.json({ id: session.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Servir le fichier index.html par défaut
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));