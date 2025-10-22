import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
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
    <div className="cart-container">
      <button
        className="back-home-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <h2 className="cart-title">My Cart</h2>

      {items.length === 0 ? (
        <p className="cart-empty">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-list">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-info">
                  <h3>{item.name}</h3>
                  <p>${item.price.toFixed(2)}</p>

                  <div className="quantity-control">
                    <button
                      className="qty-btn"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item._id,
                            quantity: item.quantity - 1,
                          })
                        )
                      }
                    >
                      −
                    </button>
                    <span className="qty-value">{item.quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() =>
                        dispatch(
                          updateQuantity({
                            id: item._id,
                            quantity: item.quantity + 1,
                          })
                        )
                      }
                    >
                      ＋
                    </button>
                  </div>

                  <p className="cart-item-subtotal">
                    Subtotal: ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  className="remove-btn"
                  onClick={() => dispatch(removeFromCart(item._id))}
                >
                  X
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            {/* Promo code input area */}
            <div className="promo-section">
              <h4>Have a promo code?</h4>
              {!appliedPromo ? (
                <>
                  <div className="promo-input-group">
                    <input
                      type="text"
                      className="promo-input"
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleApplyPromo()}
                    />
                    <button className="apply-promo-btn" onClick={handleApplyPromo}>
                      Apply
                    </button>
                  </div>
                  {errorMessage && <p className="promo-error">{errorMessage}</p>}
                  <p className="promo-hint">Try: SAVE10, SAVE20, or FLAT50</p>
                </>
              ) : (
                <div className="applied-promo">
                  <p className="promo-success">
                    Promo "{appliedPromo.code}" applied!{" "}
                    {appliedPromo.type === "percentage"
                      ? `${appliedPromo.discount}% off`
                      : `$${appliedPromo.discount} off`}
                  </p>
                  <button className="remove-promo-btn" onClick={handleRemovePromo}>
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Subtotal:</span>
                <span>${originalTotal.toFixed(2)}</span>
              </div>
              {appliedPromo && (
                <div className="price-row discount-row">
                  <span>Discount:</span>
                  <span className="discount-amount">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="price-row total-row">
                <span>Total:</span>
                <span className="final-total">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              className="clear-cart-btn"
              onClick={() => dispatch(clearCart())}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;