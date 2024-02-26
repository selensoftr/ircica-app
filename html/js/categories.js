const dataUrl = 'json_dumps/categories.json'

d3.json(dataUrl, function (data) {
  tableData = Object.values(data)

  var table = new Tabulator('#example-table', {
    height: 800,
    layout: 'fitColumns',
    tooltips: true,
    data: tableData,
    pagination: true,
    paginationSize: 15,
    responsiveLayout: 'collapse',
    columnCalcs: 'both',
    columns: [
      {
        title: 'Grocery Category',
        field: 'name',
        headerFilter: 'input',
        formatter:  linkToDetailView,
        bottomCalc: 'count'
      },
      {
        title: 'Groceries',
        field: 'goods',
        // mutator: linkList,
        formatter: linkListFormatter,
        formatterParams: {
          table: table,
          urlPrefix: '',
          idField: 'grocerist_id',
          nameField: 'name'
        },
        headerFilter: 'input',
        
      },
      {
        title: '# Groceries',
        field: 'good_count',
        bottomCalc: 'sum'
      },
      {
        title: 'Documents',
        field: 'documents',
        mutator: linkList,
        mutatorParams: {
          urlPrefix: '',
          idField: 'grocerist_id',
          nameField: 'name'
        },
        headerFilter: 'input',
        formatter: function (cell) {
          return get_scrollable_cell(this, cell)
        },
        tooltip: true
      },
      {
        title: '# Docs',
        field: 'doc_count',
        bottomCalc: 'sum'
      }
    ]
  })
})
