import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const planData = {
  personal: { name: 'Personal Plan', price: 10 },
  pro: { name: 'Pro Plan', price: 15 },
  enterprise: { name: 'Enterprise Plan', price: 20 },
};

const CheckoutPage = () => {
  const { planName } = useParams();
  const plan = planData[planName] || { name: 'Unknown Plan', price: 0 };

  const [formData, setFormData] = useState({ name: '', cardNumber: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  // --- NEW: Enhanced handleChange to handle the auto-slash ---
    // --- NEW: handleChange now PREVENTS invalid input in real-time ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let sanitizedValue = value;

    // 1. For name, remove anything that is not a letter or space
    if (name === 'name') {
      sanitizedValue = value.replace(/[^A-Za-z\s]/ig, '');
    }

    // 2. For numeric fields (cardNumber, cvc), remove anything that is not a digit
    if (name === 'cardNumber' || name === 'cvc') {
      sanitizedValue = value.replace(/\D/g, '');
    }

    // 3. For expiry, handle the auto-slash and only allow digits, space, and slash
    if (name === 'expiry') {
      // First, remove any invalid characters
      sanitizedValue = value.replace(/[^0-9\s/]/g, '');

      // Then, auto-add slash after 2 digits
      if (sanitizedValue.length === 2 && formData.expiry.length === 1) {
        sanitizedValue = sanitizedValue + ' / ';
      }
      // Allow deleting the slash and space
      if (sanitizedValue.length === 2 && formData.expiry.length === 5) {
        sanitizedValue = sanitizedValue.slice(0, 2);
      }
    }
    
    // Update the state with the sanitized value
    setFormData({ ...formData, [name]: sanitizedValue });
  };

  // --- NEW: Enhanced validateForm with stricter rules ---
  const validateForm = () => {
    const newErrors = {};

    // 1. Name validation: Only allows letters and spaces
    if (!/^[A-Za-z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces.';
    }

    // 2. Card Number validation (remains the same)
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Card number must be 16 digits.';
    }

    // 3. Expiry Date validation
    if (!/^(0[1-9]|1[0-2])\s\/\s\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = 'Format must be MM / YY.';
    } else {
      // If format is correct, check the year range
      const [month, year] = formData.expiry.split(' / ');
      const fullYear = parseInt('20' + year);
      
      // 3b. Year Range validation
      if (fullYear < 2025 || fullYear > 2030) {
        newErrors.expiry = 'Year must be between 2025 and 2030.';
      }
    }

    // 4. CVC validation: Must be exactly 3 digits
    if (!/^\d{3}$/.test(formData.cvc)) {
      newErrors.cvc = 'CVC must be exactly 3 digits.';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      setIsSuccess(true);
    } else {
      setErrors(formErrors);
    }
  };

  // The rest of the component (JSX) remains the same as before
  if (isSuccess) {
    return (
        <div className="checkout-container">
            <div className="success-message-card">
            <div className="success-icon">✓</div>
            <h2>Congratulations!</h2>
            <p>Your subscription to the <strong>{plan.name}</strong> has been successfully processed.</p>
            <p>Thank you for choosing LeakGuard.</p>
            <Link to="/" className="btn-primary" style={{ marginTop: '24px' }}>
                Back to Home
            </Link>
            </div>
        </div>
    );
  }

  return (
    <div className="checkout-container">
        <div className="checkout-card">
            <div className="order-summary">
                <h2>Order Summary</h2>
                <div className="plan-details">
                    <span>{plan.name}</span>
                    <span className="plan-price">${plan.price.toFixed(2)}/mo</span>
                </div>
                <div className="total-due">
                    <span>Total Due Today</span>
                    <span className="plan-price">${plan.price.toFixed(2)}</span>
                </div>
            </div>

            <div className="payment-form">
                <h2>Payment Details</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Cardholder Name</label>
                        <input id="name" name="name" type="text" className="form-input" placeholder="J. Appleseed" value={formData.name} onChange={handleChange} />
                        {errors.name && <p className="error-text">{errors.name}</p>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="cardNumber">Card Number</label>
                        <input id="cardNumber" name="cardNumber" type="text" className="form-input" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} />
                        {errors.cardNumber && <p className="error-text">{errors.cardNumber}</p>}
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="expiry">Expiry Date</label>
                            <input id="expiry" name="expiry" type="text" className="form-input" placeholder="MM / YY" value={formData.expiry} onChange={handleChange} maxLength="7" />
                            {errors.expiry && <p className="error-text">{errors.expiry}</p>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="cvc">CVC</label>
                            <input id="cvc" name="cvc" type="text" className="form-input" placeholder="123" value={formData.cvc} onChange={handleChange} maxLength="3" />
                            {errors.cvc && <p className="error-text">{errors.cvc}</p>}
                        </div>
                    </div>
                    <button type="submit" className="btn-primary submit-payment-btn">
                        Pay ${plan.price.toFixed(2)}
                    </button>
                </form>
            </div>
        </div>
        <Link to="/pricing" className="back-btn">
          ← Back to Pricing
        </Link>
    </div>
  );
};

export default CheckoutPage;