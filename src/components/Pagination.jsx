import { Pagination } from "react-bootstrap";

const CustomPagination = ({ handlePageChange, currentPage, totalPages }) => {
    return (
        totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0} />
                    {currentPage > 2 && (
                        <>
                            <Pagination.Item onClick={() => handlePageChange(0)}>1</Pagination.Item>
                            {currentPage > 3 && <Pagination.Ellipsis />}
                        </>
                    )}
                    {Array.from({ length: totalPages }, (_, index) => index)
                        .filter((index) => index >= currentPage - 2 && index <= currentPage + 2)
                        .map((index) => (
                            <Pagination.Item key={index} active={index === currentPage} onClick={() => handlePageChange(index)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    {currentPage < totalPages - 3 && (
                        <>
                            <Pagination.Ellipsis />
                            <Pagination.Item onClick={() => handlePageChange(totalPages - 1)}>{totalPages}</Pagination.Item>
                        </>
                    )}
                    <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages - 1} />
                </Pagination>
            </div>
        )
    );
};

export { CustomPagination };
