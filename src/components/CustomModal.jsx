
import { Modal } from 'react-bootstrap';

const CustomModal = ({ children, open, onClose }) => {
    return (
        <Modal show={open} onHide={onClose} centered>
            <Modal.Header closeButton>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <button className="btn btn-danger" onClick={onClose}>Закрыть</button>
            </Modal.Footer>
        </Modal>
    );
};

export { CustomModal };
