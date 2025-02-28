import axios from "axios";
import Toast from "../components/Toast";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import ReactLoading from "react-loading";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_PATH = import.meta.env.VITE_API_PATH;

export default function CartPage() {
  const [cart, setCart] = useState({});

  const [isScreenLoading, setIsScreenLoading] = useState(false);

  const getCart = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/v2/api/${API_PATH}/cart`);
      setCart(res.data.data);
    } catch (error) {
      alert("取得購物車列表失敗");
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  // 清空購物車
  const removeCart = async () => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/carts`);
      getCart();
      Toast.fire({
        icon: "success",
        title: "成功清空購物車",
      });
    } catch (error) {
      alert("刪除購物車失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 刪除單一購物車品項
  const removeCartItem = async (cartItem_id) => {
    setIsScreenLoading(true);
    try {
      await axios.delete(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`);

      getCart();
    } catch (error) {
      alert("刪除購物車品項失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  // 調整購物車產品數量
  const updateCartItem = async (cartItem_id, product_id, qty) => {
    setIsScreenLoading(true);
    try {
      await axios.put(`${BASE_URL}/v2/api/${API_PATH}/cart/${cartItem_id}`, {
        data: {
          product_id,
          qty: Number(qty),
        },
      });

      getCart();
    } catch (error) {
      alert("更新購物車品項失敗");
    } finally {
      setIsScreenLoading(false);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    reset,
  } = useForm({ mode: "onTouched" });

  const onSubmit = handleSubmit((data) => {
    console.log(data);
    const { message, ...user } = data;

    const userInfo = {
      data: { user, message },
    };

    checkout(userInfo);
  });

  // 結帳付款
  const checkout = async (data) => {
    setIsScreenLoading(true);
    try {
      await axios.post(`${BASE_URL}/v2/api/${API_PATH}/order`, data);
      reset();
      getCart();
    } catch (error) {
      alert("結帳失敗");
      console.error(error);
    } finally {
      setIsScreenLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="row d-flex justify-content-center">
        {cart.carts?.length > 0 ? (
          <div className="col-md-10">
            <h2 className="text-center my-5">購物車</h2>

            <div className="d-flex">
              <div className="ms-auto mb-3">
                <button
                  className="btn btn-danger"
                  type="button"
                  onClick={removeCart}
                >
                  清空購物車
                </button>
              </div>
            </div>

            <table className="table align-middle">
              <thead>
                <tr>
                  <th width="10%" className="text-center">
                    品項
                  </th>
                  <th width="20%" className="text-center">
                    品名
                  </th>
                  <th width="15%" className="text-center">
                    單價
                  </th>
                  <th
                    width="30%"
                    className="text-center"
                    style={{ width: "200px" }}
                  >
                    數量/單位
                  </th>
                  <th width="15%" className="text-end">
                    總計
                  </th>
                  <th width="10%"></th>
                </tr>
              </thead>

              <tbody>
                {cart.carts?.map((cartItem) => (
                  <tr key={cartItem.id}>
                    <td>
                      <img
                        src={cartItem.product.imageUrl}
                        alt={cartItem.product.title}
                        className="object-fit-cover mx-auto"
                        style={{ height: "200px" }}
                      />
                    </td>
                    <td className="text-center">{cartItem.product.title}</td>
                    <td className="text-center">{cartItem.product.price} 元</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="btn-group me-2" role="group">
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                            onClick={() =>
                              updateCartItem(
                                cartItem.id,
                                cartItem.product_id,
                                cartItem.qty - 1
                              )
                            }
                            disabled={cartItem.qty === 1}
                          >
                            -
                          </button>
                          <span
                            className="btn border border-dark"
                            style={{ width: "50px", cursor: "auto" }}
                          >
                            {cartItem.qty}
                          </span>
                          <button
                            type="button"
                            className="btn btn-outline-dark btn-sm"
                            onClick={() =>
                              updateCartItem(
                                cartItem.id,
                                cartItem.product_id,
                                cartItem.qty + 1
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <span className="input-group-text bg-transparent border-0">
                          {cartItem.product.unit}
                        </span>
                      </div>
                    </td>
                    <td className="text-end">{cartItem.total} 元</td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeCartItem(cartItem.id)}
                      >
                        <i class="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4" className="text-end text-danger fw-bold">
                    總金額：
                  </td>
                  <td
                    className="text-end text-danger fw-bold"
                    style={{ width: "130px" }}
                  >
                    {cart.total} 元
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        ) : (
          <div>
            <p className="my-5 fs-2 text-center">開始購物吧！</p>
            <hr />
          </div>
        )}
      </div>

      <div className="my-5 row justify-content-center">
        <form className="col-md-6" onSubmit={onSubmit}>
          <h2 className="text-center mb-5">填寫預訂資料</h2>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={`form-control ${
                touchedFields.email
                  ? errors.email
                    ? "is-invalid"
                    : "is-valid"
                  : ""
              }`}
              placeholder="請輸入 Email"
              {...register("email", {
                required: "Email 欄位必填",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email 格式錯誤",
                },
              })}
            />

            {errors.email && (
              <div className="invalid-feedback">{errors.email?.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="name" className="form-label">
              收件人姓名
            </label>
            <input
              id="name"
              type="text"
              className={`form-control ${
                touchedFields.name
                  ? errors.name
                    ? "is-invalid"
                    : "is-valid"
                  : ""
              }`}
              placeholder="請輸入姓名"
              {...register("name", {
                required: "姓名欄位必填",
              })}
            />

            {errors.name && (
              <div className="invalid-feedback">{errors.name.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="tel" className="form-label">
              收件人電話
            </label>
            <input
              id="tel"
              type="tel"
              className={`form-control ${
                touchedFields.tel
                  ? errors.tel
                    ? "is-invalid"
                    : "is-valid"
                  : ""
              }`}
              placeholder="請輸入電話"
              {...register("tel", {
                required: "電話欄位必填",
                pattern: {
                  value: /^(0[2-8]\d{7}|09\d{8})$/,
                  message: "電話格式錯誤",
                },
              })}
            />

            {errors.tel && (
              <div className="invalid-feedback">{errors.tel.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="address" className="form-label">
              收件人地址
            </label>
            <input
              id="address"
              type="text"
              className={`form-control ${
                touchedFields.address
                  ? errors.address
                    ? "is-invalid"
                    : "is-valid"
                  : ""
              }`}
              placeholder="請輸入地址"
              {...register("address", {
                required: "地址欄位必填",
              })}
            />

            {errors.address && (
              <div className="invalid-feedback">{errors.address.message}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="message" className="form-label">
              留言
            </label>
            <textarea
              id="message"
              className="form-control"
              cols="30"
              rows="10"
              {...register("message")}
            ></textarea>
          </div>
          <div className="text-end">
            <button
              type="submit"
              className="btn btn-danger"
              disabled={cart.carts?.length <= 0}
            >
              送出訂單
            </button>
          </div>
        </form>
      </div>

      {isScreenLoading && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255,255,255,0.3)",
            zIndex: 999,
          }}
        >
          <ReactLoading type="spin" color="black" width="4rem" height="4rem" />
        </div>
      )}
    </div>
  );
}
