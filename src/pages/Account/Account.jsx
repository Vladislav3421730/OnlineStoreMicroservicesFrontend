import { api } from "../../apiMarket";
import './Account.css'
import '../OrderPage/OrderPage.css'
import { FadeLoader } from "react-spinners";
import { API_IMAGE_BASE_URL, NO_PHOTO_URL } from "../../config";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CustomModal } from "../../components/CustomModal";
import { AccountEditing } from "../../components/AccountEditing";
import { PasswordEditing } from "../../components/PasswordEditing";

const Account = () => {

  const [open, setOpen] = useState(false)
  const [openPassowrd, setOpenPassword] = useState(false);

  const getUserData = async () => {
    const response = await api.get("profile", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    return response.data
  };

  const { data: user, isLoading } = useQuery({
    queryKey: 'user',
    queryFn: () => getUserData()
  })

  const handleLogout = async (redirectValue) => {
    const refreshToken = localStorage.getItem('refreshToken');
    await api.delete("auth/logout", {
      data: { refreshToken }
    });
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")
    window.location.href = redirectValue;
  }

  if (isLoading) {
    return
    <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
      <FadeLoader height={16} radius={6} width={5} />
    </div>
  }

  return (
    <div className="container mt-4">
       <CustomModal open={open} onClose={() => setOpen(false)}>
              <AccountEditing setOpen={setOpen} user={user} logout={()=>handleLogout("/login")}/>
      </CustomModal>
      <CustomModal open={openPassowrd} onClose={() => setOpenPassword(false)}>
              <PasswordEditing setOpen={setOpenPassword} id={user.id} logout={()=>handleLogout("/login")}/>
      </CustomModal>
      <h2>Личный кабинет</h2>
      <div className="d-flex my-3">
        <button onClick={() => handleLogout("/")} className="btn btn-danger">Выйти</button>
        <button onClick={() => setOpen(true)} className="mx-3 btn btn-success">Редактировать профиль</button>
        <button onClick={() => setOpenPassword(true)} className="mx-2 btn btn-primary">Сменить пароль</button>
      </div>
      <p>Имя пользователя: {user.username}</p>
      <p>Email: {user.email}</p>
      <p>Номер телефона: {user.phoneNumber}</p>

      {user.orders.length === 0 ? (
        <h1>У вас пока нет заказов</h1>
      ) :
        (
          <>
            <h3>Ваши заказы:</h3>
            <div className="row">
              {user.orders.map((order) => (
                <div key={order.id} className="col-12 mb-4">
                  <div className="card-body">
                    <h4>Заказ №{order.id}</h4>
                    <p>Дата создания: {order.createdAt}</p>
                    <p className="mb-2 mt-2">Статус
                      <p className={order.status == 'доставлен' ? 'delivered mx-2' : 'status mx-2'} >{order.status}</p>
                    </p>
                    <p>
                      Адрес: {order.address.region}, {order.address.town},{" "}
                      {order.address.exactAddress}
                    </p>
                    <p>Итого: <strong> {order.totalPrice} руб. </strong></p>
                    <h5 className="mb-4">Товары:</h5>
                    <div className="row">
                      {order.orderItems.map((orderItem) => (
                        <div key={orderItem.id} className="col-lg-3 col-md-6">
                          <div
                            className="card mt-2 mb-2"
                            style={{ width: "17.5rem", height: "24rem" }}
                          >
                            <a href={`/products/${orderItem.product.id}`}>
                              {orderItem.product.imageList.length === 0 ? (
                                <img
                                  src={NO_PHOTO_URL}
                                  className="card-img-top"
                                  alt="default"
                                />
                              ) : (
                                <img
                                  src={`${API_IMAGE_BASE_URL}/${orderItem.product.imageList[0].filePath}`}
                                  style={{ width: "17.5rem", height: "16rem" }}
                                  className="card-img-top"
                                  alt={orderItem.product.title}
                                />
                              )
                              }
                            </a>
                            <div className="card-body">
                            <strong>
                                    {orderItem.product.discount > 0 ? (
                                        <>
                                            <span className="text-muted text-decoration-line-through me-2">
                                                {orderItem.product.price} BYN
                                            </span>
                                            <span className="text-danger">
                                                {(orderItem.product.price * (1 - 
                                                    orderItem.product.discount / 100)).toFixed(2)} BYN                                </span>
                                        </>
                                    ) : (
                                        <>
                                            {orderItem.product.price} BYN
                                        </>
                                    )}
                                </strong>
                                <br />
                                <span>{orderItem.product.title}</span>
                                {orderItem.product.discount > 0 && (
                                    <span className="badge bg-success ms-2">-{orderItem.product.discount}%</span>
                                )}
                              <br />
                              {orderItem.product.category}
                              <br />
                              Количество: {orderItem.amount}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

    </div>
  );
};

export { Account };
