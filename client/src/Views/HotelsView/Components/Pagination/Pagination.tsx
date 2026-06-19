import { Pagination as CNPagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/Components/ui/pagination";

interface PaginationProps {
    page: number;
}

const Pagination = ({ page }: PaginationProps) => {
    return (
        <CNPagination className="mb-15">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious to="/"/>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink isActive to="/">
                        {page}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink to="/">
                        {page+1}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink to="/">
                        {page+2}
                    </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext to="/"/>
                </PaginationItem>
            </PaginationContent>
        </CNPagination>
    )
}

export default Pagination;
