import React, { useState } from "react";
import Image from "next/image";
import { Eye, Edit2, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T = Record<string, unknown>> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface TableRow {
  id: string | number;
}

interface ReusableTableProps<T extends TableRow = TableRow> {
  columns: Column<T>[];
  data: T[];
  onView?: (row: T) => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  itemsPerPage?: number;
  showActions?: boolean;
  showCheckbox?: boolean;
  customActionColumn?: (row: T) => React.ReactNode;
}

function ReusableTable<T extends TableRow>({
  columns,
  data,
  onView,
  onEdit,
  onDelete,
  itemsPerPage = 10,
  showActions = true,
  showCheckbox = true,
  customActionColumn,
}: ReusableTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItems, setSelectedItems] = useState<Array<string | number>>(
    []
  );

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = data.slice(startIndex, endIndex);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(currentData.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string | number) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getStatusColor = (status: string) => {
    const normalized = (status || "").toLowerCase();
    switch (normalized) {
      case "published":
      case "in stock":
      case "completed":
        return "bg-green-100 text-green-700";
      case "draft":
      case "low in stock":
      case "in progress":
        return "bg-yellow-100 text-yellow-700";
      case "rejected":
      case "out of stock":
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "proposed":
      case "open to bids":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRowValue = (row: T, key: string): unknown => {
    return (row as Record<string, unknown>)[key];
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* Mobile Card View */}
      <div className="block lg:hidden">
        {currentData.map((row) => (
          <div key={row.id} className="p-4 border-b border-gray-100">
            <div className="flex gap-3">
              {showCheckbox && (
                <input
                  type="checkbox"
                  checked={selectedItems.includes(row.id)}
                  onChange={() => handleSelectItem(row.id)}
                  className="w-4 h-4 mt-1"
                  aria-label={`Select item ${row.id}`}
                />
              )}
              {(() => {
                const imageValue = getRowValue(row, "image");
                return imageValue && typeof imageValue === "string" ? (
                  <div className="relative w-16 h-16 shrink-0">
                    <Image
                      src={imageValue}
                      alt={`Item ${row.id}`}
                      fill
                      className="object-cover rounded"
                      sizes="64px"
                    />
                  </div>
                ) : null;
              })()}
              <div className="flex-1">
                {columns.map((column) => (
                  <div key={column.key} className="mb-2">
                    <span className="text-xs font-medium text-gray-500">
                      {column.label}:{" "}
                    </span>
                    {column.render ? (
                      column.render(row)
                    ) : column.key === "status" ? (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          String(getRowValue(row, column.key))
                        )}`}
                      >
                        {String(getRowValue(row, column.key))}
                      </span>
                    ) : (
                      <span className="text-sm text-gray-700">
                        {String(getRowValue(row, column.key) ?? "")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {showActions && !customActionColumn && (
              <div className="flex gap-3 mt-3 justify-end">
                <button
                  onClick={() => onView && onView(row)}
                  className="text-gray-600 hover:text-gray-800 p-2"
                  aria-label="View item"
                  title="View"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => onEdit && onEdit(row)}
                  className="text-gray-600 hover:text-gray-800 p-2"
                  aria-label="Edit item"
                  title="Edit"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => onDelete && onDelete(row)}
                  className="text-gray-600 hover:text-gray-800 p-2"
                  aria-label="Delete item"
                  title="Delete"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            )}
            {customActionColumn && (
              <div className="mt-3 flex justify-end">
                {customActionColumn(row)}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead className="bg-[#5C4033] text-white">
            <tr>
              {showCheckbox && (
                <th className="p-4 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={
                      selectedItems.length === currentData.length &&
                      currentData.length > 0
                    }
                    className="w-4 h-4"
                    aria-label="Select all items"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="p-4 text-left text-sm font-medium whitespace-nowrap"
                >
                  {column.label}
                </th>
              ))}
              {(showActions || customActionColumn) && (
                <th className="p-4 text-left text-sm font-medium whitespace-nowrap">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, index) => (
              <tr
                key={row.id}
                className={`border-b border-gray-100 hover:bg-gray-50 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                }`}
              >
                {showCheckbox && (
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(row.id)}
                      onChange={() => handleSelectItem(row.id)}
                      className="w-4 h-4"
                      aria-label={`Select item ${row.id}`}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="p-4 text-sm text-gray-700 whitespace-nowrap"
                  >
                    {column.render ? (
                      column.render(row)
                    ) : column.key === "image" &&
                      typeof getRowValue(row, column.key) === "string" ? (
                      <div className="relative w-12 h-12">
                        <Image
                          src={getRowValue(row, column.key) as string}
                          alt={`Item ${row.id}`}
                          fill
                          className="object-cover rounded"
                          sizes="48px"
                        />
                      </div>
                    ) : column.key === "status" ? (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          String(getRowValue(row, column.key))
                        )}`}
                      >
                        {String(getRowValue(row, column.key))}
                      </span>
                    ) : (
                      String(getRowValue(row, column.key))
                    )}
                  </td>
                ))}
                {showActions && !customActionColumn && (
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onView && onView(row)}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="View item"
                        title="View"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit && onEdit(row)}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="Edit item"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => onDelete && onDelete(row)}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="Delete item"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                )}
                {customActionColumn && (
                  <td className="p-4 whitespace-nowrap">
                    {customActionColumn(row)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center p-4 border-t border-gray-200 gap-4">
        <p className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of{" "}
          {data.length} results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            aria-label="Previous page"
            title="Previous"
          >
            <ChevronLeft size={18} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-[#5C4033] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={`Go to page ${i + 1}`}
              aria-current={currentPage === i + 1 ? "page" : undefined}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="p-2 rounded bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
            aria-label="Next page"
            title="Next"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReusableTable;
