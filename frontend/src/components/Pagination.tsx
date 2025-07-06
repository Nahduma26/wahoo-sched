import type { MouseEvent } from "react";


interface PaginationProps {
    coursesPerPage: number;
    totalCourses: number;
    setCurrentPage: (page: number) => void;
    currentPage: number;
}

export default function Pagination({
    coursesPerPage,
    totalCourses,
    setCurrentPage,
    currentPage,
} : PaginationProps) {
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalCourses / coursesPerPage); i++) {
        pageNumbers.push(i);
    }

    const paginate = (pageNumber: number, e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setCurrentPage(pageNumber);
    };
    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map((number) => (
                    <li key={number} className="page-item">
                        <a
                            href="!#"
                            onClick={(e) => paginate(number, e)}
                            className={`page-link ${currentPage === number ? 'active' : ''}`}
                        >
                            {number}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}