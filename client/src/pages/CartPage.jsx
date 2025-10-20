import { useSelector, useDispatch } from "react-redux";
import {
  updateQuantity,
  removeFromCart,
  clearCart,
} from "../features/cart/cartSlice";
import { useNavigate } from "react-router-dom";
import "../styles/CartPage.css";

const CartPage = () => {
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-container">
      <button
        className="back-home-btn"
        onClick={() => navigate("/")}
      >
        ← Back to Home
      </button>

      <h2 className="cart-title">🛒 My Cart</h2>

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
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Total: ${total.toFixed(2)}</h3>
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