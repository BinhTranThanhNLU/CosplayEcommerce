import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from '../../model/CartModel';

export const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const updateLocalStorage = (updatedCart: CartItem[]) => {
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleQuantityChange = (index: number, amount: number) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += amount;
    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    }
    updateLocalStorage(updatedCart);
  };

  const handleRemoveItem = (index: number) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    updateLocalStorage(updatedCart);
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: '60px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Giỏ hàng của bạn đang trống</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Hãy chọn cho mình những bộ đồ cosplay thật ưng ý nhé!</p>
        <Link to="/products" style={{ color: '#ff4d4f', fontWeight: 'bold', textDecoration: 'none' }}>
          ← Quay lại danh sách sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', fontSize: '28px' }}>Giỏ Hàng Của Bạn</h1>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
        {/* Danh sách sản phẩm */}
        <div style={{ flex: 2, minWidth: '350px' }}>
          {cartItems.map((item, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              padding: '20px 0',
              gap: '20px'
            }}>
              <img
                src={item.product.imageUrl || '/assets/img/dat-may.jpeg'}
                alt={item.product.name}
                style={{ width: '90px', height: '110px', objectFit: 'cover', borderRadius: '6px' }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 8px 0', fontSize: '18px' }}>{item.product.name}</h3>
                {item.size && <p style={{ margin: '0 0 8px 0', color: '#777', fontSize: '14px' }}>Size: {item.size}</p>}
                <p style={{ margin: '0', color: '#ff4d4f', fontWeight: 'bold' }}>
                  {item.product.price.toLocaleString('vi-VN')} đ
                </p>
              </div>

              {/* Số lượng */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #ccc', borderRadius: '4px', padding: '4px' }}>
                <button onClick={() => handleQuantityChange(index, -1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0 8px' }}>-</button>
                <span style={{ minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(index, 1)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '0 8px' }}>+</button>
              </div>

              <button
                onClick={() => handleRemoveItem(index)}
                style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', fontSize: '14px' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#ff4d4f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#999')}
              >
                Xóa
              </button>
            </div>
          ))}
        </div>

        {/* Thanh toán */}
        <div style={{ flex: 1, minWidth: '280px', border: '1px solid #e0e0e0', padding: '25px', borderRadius: '8px', height: 'fit-content', backgroundColor: '#fafafa' }}>
          <h2 style={{ marginTop: 0, fontSize: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Tóm tắt đơn hàng</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', margin: '20px 0 15px 0' }}>
            <span style={{ color: '#555' }}>Tạm tính:</span>
            <span>{calculateTotal().toLocaleString('vi-VN')} đ</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px', fontWeight: 'bold' }}>
            <span>Tổng tiền:</span>
            <span style={{ color: '#ff4d4f', fontSize: '22px' }}>{calculateTotal().toLocaleString('vi-VN')} đ</span>
          </div>
          <button style={{
            width: '100%',
            padding: '14px',
            backgroundColor: '#ff4d4f',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            TIẾN HÀNH THANH TOÁN
          </button>
        </div>
      </div>
    </div>
  );
};