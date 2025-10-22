import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  removeFromCart,
} from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/CartPage.css";

// Promo code list
const PROMO_CODES = {
  "SAVE10": { discount: 10, type: "percentage" },
  "SAVE20": { discount: 20, type: "percentage" },
  "FLAT50": { discount: 50, type: "fixed" },
};

const CartPage = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Promo code state
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  // Calculate original total
  const originalTotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Calculate discount amount
  const discount = appliedPromo
    ? appliedPromo.type === "percentage"
      ? (originalTotal * appliedPromo.discount) / 100
      : appliedPromo.discount
    : 0;

  // Calculate final price
  const finalTotal = Math.max(0, originalTotal - discount);

  // Apply promo code
  const handleApplyPromo = () => {
    const trimmedCode = promoCode.trim().toUpperCase();

    // Validation: cannot be empty
    if (!trimmedCode) {
      setErrorMessage("Please enter a promo code");
      return;
    }

    // Validation: check if promo code exists
    if (!PROMO_CODES[trimmedCode]) {
      setErrorMessage("Invalid promo code");
      return;
    }

    // Apply promo code
    setAppliedPromo({
      code: trimmedCode,
      ...PROMO_CODES[trimmedCode],
    });
    setErrorMessage("");
    setPromoCode("");
  };

  // Remove promo code
  const handleRemovePromo = () => {
    setAppliedPromo(null);
    setPromoCode("");
    setErrorMessage("");
  };

  return (
    <div className="cart-page">
      <div className="cart-main-content">
        <button className="back-home-btn" onClick={() => navigate("/")}>
          Back to Home
        </button>

        <h1 className="cart-page-title">Shopping Cart ({items.length})</h1>

        {items.length === 0 ? (
          <div className="cart-empty-state">
            <p>Your cart is empty.</p>
            <button className="continue-shopping-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-items-list">
            {items.map((item) => (
              <div key={item._id} className="cart-product-item">
                <img src={item.image} alt={item.name} className="cart-product-image" />
                <div className="cart-product-details">
                  <h3 className="cart-product-name">{item.name}</h3>
                  <p className="cart-product-price">${item.price.toFixed(2)}</p>

                  <div className="cart-quantity-control">
                    <button
                      className="qty-decrease"
                      onClick={() =>
                        dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input type="number" className="qty-input" value={item.quantity} readOnly />
                    <button
                      className="qty-increase"
                      onClick={() =>
                        dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() => dispatch(removeFromCart(item._id))}
                  >
                    Remove
                  </button>
                </div>
                <div className="cart-product-subtotal">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="cart-sidebar">
          <div className="cart-summary-box">
            <h3 className="summary-title">Order Summary</h3>

            <div className="promo-code-section">
              <label>Apply Discount Code</label>
              {!appliedPromo ? (
                <>
                  <div className="promo-input-wrapper">
                    <input
                      type="text"
                      className="promo-code-input"
                      placeholder="20 DOLLAR OFF"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleApplyPromo()}
                    />
                    <button className="promo-apply-btn" onClick={handleApplyPromo}>
                      Apply
                    </button>
                  </div>
                  {errorMessage && <p className="promo-error-msg">{errorMessage}</p>}
                  <p className="promo-hint-text">Available: SAVE10, SAVE20, FLAT50</p>
                </>
              ) : (
                <div className="promo-applied">
                  <p className="promo-applied-text">
                    Code "{appliedPromo.code}" applied{" "}
                    ({appliedPromo.type === "percentage"
                      ? `${appliedPromo.discount}% off`
                      : `$${appliedPromo.discount} off`})
                  </p>
                  <button className="promo-remove-btn" onClick={handleRemovePromo}>
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="price-summary">
              <div className="price-line">
                <span>Subtotal</span>
                <span>${originalTotal.toFixed(2)}</span>
              </div>
              <div className="price-line">
                <span>Tax</span>
                <span>${(originalTotal * 0.1).toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="price-line discount-line">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="price-line total-line">
                <span>Estimated Total</span>
                <span>${(finalTotal + originalTotal * 0.1).toFixed(2)}</span>
              </div>
            </div>

            <button className="checkout-btn">Continue to checkout</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;