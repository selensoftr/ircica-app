const dataUrl = "json_dumps/categories.json";
const baseColumnDefinitions = [
  {
    title: "Grocery Category",
    field: "name",
    headerFilter: "input",
    headerFilterFunc: childElementFilter,
    formatter: linkToDetailView,
    bottomCalc: "count",
    minWidth: 200,
  },
  {
    title: "Groceries",
    field: "goods",
    ...linkListColumnSettings,
    formatterParams: {
      scrollable: true,
      urlPrefix: "goods__",
      idField: "id",
      nameField: "value",
    },
  },
  {
    title: "# Groceries",
    field: "good_count",
    bottomCalc: "sum",
  },
  {
    title: "Documents",
    field: "documents",
    ...linkListColumnSettings,
    formatterParams: {
      scrollable: true,
      urlPrefix: "",
      idField: "grocerist_id",
      nameField: "shelfmark",
    },
    headerFilterFuncParams: { nameField: "shelfmark" },
  },
  {
    title: "# Docs",
    field: "doc_count",
    bottomCalc: "sum",
  },
];
// Add minWidth to each column
const columnDefinitions = baseColumnDefinitions.map((column) => ({
  ...column,
  minWidth: 150,
}));

function childElementFilter(headerValue, rowValue, rowData, filterParams) {
  return JSON.stringify(rowData)
    .toLowerCase()
    .includes(headerValue.toLowerCase());
}
d3.json(dataUrl, function (data) {
  data = Object.values(data);

  const hierarchicalData = {};
  const enrichedData = data.map((item) => {
    // Add counts to every category
    const enriched = {
      ...item,
      doc_count: item.documents.length,
      good_count: item.goods.length,
      // There's only one parent category
      part_of:
        item.part_of && item.part_of.length > 0 ? item.part_of[0].value : null,
    };
    // If the item is a main category, initialize it in the hierarchical data structure
    if (enriched.is_main_category) {
      hierarchicalData[enriched.name] = { ...enriched, _children: [] };
    }
    return enriched;
  });

  // Add child categories to their respective main category's _children array
  enrichedData.forEach((item) => {
    if (item.part_of) {
      const parentCategory = item.part_of;
      if (hierarchicalData[parentCategory]) {
        hierarchicalData[parentCategory]._children.push(item);
      } else {
        console.warn("Parent category not found for", item);
      }
    }
  });
  const tableData = Object.values(hierarchicalData);
  const table = new Tabulator("#categories-table", {
    ...commonTableConfig,
    data: tableData,
    dataTree: true,
    columnCalcs: "both",
    columns: columnDefinitions,
  });
});
