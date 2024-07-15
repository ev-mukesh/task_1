import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTable, useSortBy, usePagination } from "react-table";

const ProductTable = () => {
  const [Products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filterOptions, setFilterOptions] = useState({});
  const [selectedFilters, setSelectedFilters] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        const products = response.data;
        setProducts(products);

        const options = generateFilterOptions(products);
        setFilterOptions(options);
      })
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  useEffect(() => {
    setFilteredProducts(applyFilters(Products, selectedFilters));
  }, [selectedFilters, Products]);

  //this is for the checkbox options
  const generateFilterOptions = (data) => {
    //genetrate filter options for each col
    const options = {};
    if (data.length === 0) return options;

    Object.keys(data[0]).forEach((key) => {
      if (key !== "name" && key !== "id") {
        // Exclude 'name' column
        options[key] = [...new Set(data.map((item) => item[key]))];
      }
    });

    return options;
  };

  const applyFilters = (data, filters) => {
    return data.filter((item) =>
      Object.keys(filters).every((key) =>
        filters[key].length > 0 ? filters[key].includes(item[key]) : true
      )
    );
  };

  const handleCheckboxChange = (event, key) => {
    const { value, checked } = event.target;
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };
      if (checked) {
        newFilters[key] = [...(newFilters[key] || []), value];
      } else {
        newFilters[key] = newFilters[key].filter((item) => item !== value);
      }
      return newFilters;
    });
  };

  const columns = React.useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return [];

    //extracting the column names
    const colNames = Object.keys(filteredProducts[0]);
    return colNames.map((colName) => ({
      Header: colName.toUpperCase(),
      accessor: colName,
    }));
  }, [filteredProducts]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    state: { pageIndex },
    pageCount,
  } = useTable(
    {
      columns,
      data: filteredProducts,
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <h1 className="text-2xl mx-auto px-4 py-8">Product Table</h1>
      <div className="flex">
        <div className="w-1/4 p-4 bg-gray-200">
          <h2 className="text-xl font-semibold mb-4">Filters</h2>
          {Object.keys(filterOptions).map((key) => (
            <div key={key} className="mb-4">
              <label className="block mb-2 font-bold">
                {key.toUpperCase()}:
              </label>
              {filterOptions[key].map((option) => (
                <div key={option} className="mb-2">
                  <label>
                    <input
                      type="checkbox"
                      value={option}
                      onChange={(e) => handleCheckboxChange(e, key)}
                      className="mr-2"
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="w-3/4 p-4">
          <table
            {...getTableProps()}
            className="w-full bg-white shadow-md rounded my-6"
          >
            <thead>
              {headerGroups.map((headerGroup, index) => (
                <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column, idx) => (
                    <th
                      key={idx}
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      className="px-4 py-2 border-b-2 border-gray-300 text-left text-xs font-semibold uppercase tracking-wider"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row, rowIndex) => {
                prepareRow(row);
                return (
                  <tr
                    key={rowIndex}
                    {...row.getRowProps()}
                    className="hover:bg-gray-100"
                  >
                    {row.cells.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        {...cell.getCellProps()}
                        className="px-4 py-4 border-b border-gray-300"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="text-center">
            <button
              disabled={!canPreviousPage}
              onClick={previousPage}
              className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l ${
                !canPreviousPage && "cursor-not-allowed opacity-50"
              }`}
            >
              Prev
            </button>
            <span>
              {" "}
              {pageIndex + 1} of {pageCount}{" "}
            </span>
            <button
              disabled={!canNextPage}
              onClick={nextPage}
              className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r ${
                !canNextPage && "cursor-not-allowed opacity-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTable;
