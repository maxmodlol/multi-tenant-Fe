import { Button } from "@explore/components/ui/button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-between gap-2 mt-6">
      <Button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        variant="outline"
        size="md"
      >
        السابق
      </Button>
      <div className=" flex gap-2">
        {pages.map((page) => (
          <Button
            key={page}
            onClick={() => onPageChange(page)}
            variant={page === currentPage ? "primary" : "outline"}
            size="sm"
            className="!rounded-full "
          >
            {page}
          </Button>
        ))}
      </div>

      <Button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        variant="outline"
        size="md"
      >
        التالي
      </Button>
    </div>
  );
}
