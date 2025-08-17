interface PaginationProps {
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
    setPageSize: (size: number) => void;
    pageSize: number;
}

export default function Pagination({ currentPage, totalPages, setPage, setPageSize, pageSize }: PaginationProps) {
    const handlePageChange = (page: number) => {
        if (page >= 0 && page < totalPages) {
            setPage(page);
        }
    };

    const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPageSize(Number(event.target.value));
        setPage(0);
    };

    return (
        <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 0}>
                Previous
            </button>
            <span>Page {currentPage + 1} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage >= totalPages - 1}>
                Next
            </button>
            <select value={pageSize} onChange={handlePageSizeChange}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
            </select>
        </div>
    );
}