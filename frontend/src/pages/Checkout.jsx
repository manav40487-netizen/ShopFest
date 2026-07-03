import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });
  const [showBypassConfirm, setShowBypassConfirm] = useState(false); // ← ADDED

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handlePayment = async () => {
    try {
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        toast.info('Razorpay unavailable. Use Bypass & Place Order button to test.');
        return; // ← clean return, no dead code after
      }

      const options = {
        key: orderData.key || 'rzp_test_dummykey123',
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Shopfest',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          if (verifyRes.ok) {
            const saveOrderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({
                items: cartItems,
                totalAmount: totalPrice,
                address,
                paymentId: response.razorpay_payment_id
              })
            });
            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate('/ordersuccess');
            } else {
              toast.error('Order saving failed');
            }
          } else {
            toast.error('Payment verification failed ❌');
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },
        theme: { color: '#f97316' }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment init error', error);
      toast.error('Payment initialization error. Check console for details.');
    }
  };

  const bypassPayment = async () => {
    const saveOrderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems,
        totalAmount: totalPrice,
        address,
        paymentId: 'bypass_txn_' + Date.now()
      })
    });
    if (saveOrderRes.ok) {
      dispatch(clearCart());
      navigate('/ordersuccess');
    } else {
      const err = await saveOrderRes.json().catch(() => ({}));
      toast.error(err.message || 'Placing bypass order failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      toast.warning('Please login first');
      navigate('/login');
      return;
    }
    handlePayment();
  };

  const handleBypass = (e) => {
    e && e.preventDefault();
    if (!user) {
      toast.warning('Please login first');
      navigate('/login');
      return;
    }
    setShowBypassConfirm(true);
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="shipping-form">
          <h3>Shipping Address</h3>
          <input type="text" placeholder="Full Name" required value={address.fullName} onChange={(e) => setAddress({...address, fullName: e.target.value})} />
          <input type="text" placeholder="Street" required value={address.street} onChange={(e) => setAddress({...address, street: e.target.value})} />
          <input type="text" placeholder="City" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} />
          <input type="text" placeholder="Postal Code" required value={address.postalCode} onChange={(e) => setAddress({...address, postalCode: e.target.value})} />
          <input type="text" placeholder="Country" required value={address.country} onChange={(e) => setAddress({...address, country: e.target.value})} />

          <div className="checkout-summary">
            <h4>Total to Pay: ₹{totalPrice.toFixed(2)}</h4>

            {/* ← BYPASS CONFIRMATION UI ADDED HERE */}
            {showBypassConfirm && (
              <div style={{
                background: '#1f1f23',
                border: '1px solid #f97316',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px',
                textAlign: 'center'
              }}>
                <p style={{ color: '#fff', marginBottom: '12px' }}>
                  ⚠️ Bypass payment and place test order?
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button className="btn" type="button" onClick={() => { setShowBypassConfirm(false); bypassPayment(); }}>
                    Yes, Place Order
                  </button>
                  <button className="btn btn-secondary" type="button" onClick={() => setShowBypassConfirm(false)}>
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div style={{display: 'flex', gap: '8px'}}>
              <button type="submit" className="btn">Pay Now</button>
              <button type="button" onClick={handleBypass} className="btn btn-secondary">Bypass & Place Order</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;