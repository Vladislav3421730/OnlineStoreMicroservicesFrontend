
const ErrorForbidden = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100 bg-light text-center">
          <h1 className="display-1 text-danger fw-bold animate-error">403</h1>
          <h2 className="text-dark">Вход запрещён</h2>
          <p className="text-muted">Попробуйте обновить страницу или вернуться на главную.</p>
          <a href="/" className="btn btn-primary mt-3">
            Назад на главную
          </a>
        </div>
      );
}

export {ErrorForbidden}