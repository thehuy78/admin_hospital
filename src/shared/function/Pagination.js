import DepartmentItem from "../../features/Department/component/DepartmentItem";
import DoctorItem from "../../features/Doctor/component/DoctorItem";


export const renderItem = (currentPage, perPage, data, type) => {
  const indexOfLastOrder = currentPage * perPage;
  const indexOfFirstOrder = indexOfLastOrder - perPage;
  const currentList =
    data && data.length > 0 && data.slice(indexOfFirstOrder, indexOfLastOrder);

  return (
    currentList &&
    currentList.length > 0 &&
    currentList.map((item, index) => {
      if (type === "department") {
        return <DepartmentItem item={item} key={index} />;

      } else if (type === "doctor") {
        return <DoctorItem item={item} key={index} />;

      } else {
        return null; // Handle other cases or provide a fallback if necessary
      }
    })
  );
};


export const renderPagination = (currentPage, totalPages, handleClick) => {
  const pagination = [];
  const maxVisibleButtons = 7;

  const addPage = (page) => {
    pagination.push(
      <button
        key={page}
        onClick={() => handleClick(page)}
        className={
          currentPage === page ? "active button_pagination_active" : ""
        }
      >
        {page}
      </button>
    );
  };

  if (totalPages <= maxVisibleButtons) {
    for (let page = 1; page <= totalPages; page++) {
      addPage(page);
    }
  } else {
    const leftOffset = Math.max(1, currentPage - 2);
    const rightOffset = Math.min(totalPages, currentPage + 2);

    if (currentPage > 3) {
      pagination.push(
        <button key="first" onClick={() => handleClick(1)}>
          1
        </button>
      );
      pagination.push(<span key="ellipsis1">...</span>);
    }

    for (let page = leftOffset; page <= rightOffset; page++) {
      addPage(page);
    }

    if (currentPage < totalPages - 2) {
      pagination.push(<span key="ellipsis2">...</span>);
      pagination.push(
        <button key="last" onClick={() => handleClick(totalPages)}>
          {totalPages}
        </button>
      );
    }
  }

  return pagination;
};
