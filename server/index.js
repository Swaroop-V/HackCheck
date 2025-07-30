const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { request } = require('https');

const app = express();
app.use(cors());
app.use(express.json());


app.post('/api/check-password', async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ leaked: false, message: 'Password is required' });
  }

  try {
    const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
    const prefix = sha1.substring(0, 5);
    const suffix = sha1.substring(5);

    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    const data = await response.text();

    const found = data.split('\n').some(line => {
      const [hashSuffix] = line.split(':');
      return hashSuffix.trim().toUpperCase() === suffix;
    });

    res.json({
      leaked: found,
      message: found ? ' Password has been leaked!' : 'Password is safe.',
    });
  } catch (err) {
    console.error('Error occurred while checking password:', err); // Already there
        res.status(500).json({
            leaked: false,
            message: `Server Error: ${err.message}`,
        });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
