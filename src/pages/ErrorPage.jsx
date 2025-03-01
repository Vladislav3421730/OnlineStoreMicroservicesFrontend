import React from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";

const ErrorPage = () => {
  const error = useRouteError();

  const status = isRouteErrorResponse(error) ? error.status : "Неизвестная ошибка";
  const message = isRouteErrorResponse(error)
    ? error.data?.message || "Что-то пошло не так!"
    : "Произошла неожиданная ошибка.";

  return (
    <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center">
      <h1 className="display-1 text-danger fw-bold animate-error">{status}</h1>
      <h2 className="text-dark">{message}</h2>
      <p className="text-muted">Попробуйте обновить страницу или вернуться на главную.</p>
      <a href="/" className="btn btn-primary mt-3">
        Назад на главную
      </a>
    </div>
  );
};

export { ErrorPage };
