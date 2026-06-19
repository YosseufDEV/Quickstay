import { Pagination as CNPagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/Components/ui/pagination";

interface PaginationProps {
    page: number;
    beforeAndAfter?: number;
}

const generatePaginationItems = (currentPage: number, beforeAndAfter: number) => {
    const items = [];
    const startPage = Math.max(1, currentPage - beforeAndAfter);
    const endPage = currentPage == 1 ? 3 : currentPage + beforeAndAfter;
    for (let i = startPage; i <= endPage; i++) {
        items.push(
            <PaginationItem key={i}>
                <PaginationLink isActive={i === currentPage} to={i}>
                    {i}
                </PaginationLink>
            </PaginationItem>
        );
    }
    return items;
}

const Pagination = (props: PaginationProps) => {
    const paginationItems = generatePaginationItems(props.page, props.beforeAndAfter || 1);

    return (
        <CNPagination className="mb-15">
            <PaginationContent>
             { props.page > 1 &&
                <PaginationItem>
                    <PaginationPrevious to={props.page-1}/>
                </PaginationItem>
             }
                {paginationItems}
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext to={props.page+1}/>
                </PaginationItem>
            </PaginationContent>
        </CNPagination>
    )
}

export default Pagination;
