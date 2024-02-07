import * as XLSX from 'xlsx'

/**
 * 表格导出
 * @param {array}  data      数据
 * @param {array}  header    表头，eg:[{ member_id: '会员id' }, { username: '会员名' }]
 * @param {string} fileName  文件名
 * @param {string} bookType  文件类型：xlsx, csv, txt
 * @param {bool}   autoWidth 宽度是否自适应
 */
export function excelExport(
  data,
  header = [],
  fileName = 'export-excel',
  bookType = 'xlsx',
  autoWidth = false
) {
  if (!header.length) {
    header = Object.keys(data[0])
  }

  if (!fileName) {
    fileName = 'export-excel'
  }

  if (!bookType) {
    bookType = 'xlsx'
  }

  // 表头名称，导出字段
  const headerName = []
  const headerField = []
  header.forEach((ihn) => {
    if (typeof ihn === 'string') {
      headerName.push(ihn)
      headerField.push(ihn)
    } else {
      headerName.push(Object.values(ihn)[0])
      headerField.push(Object.keys(ihn)[0])
    }
  })

  // 导出数据
  const xlsxData = []
  xlsxData.push(headerName)
  data.forEach((id) => {
    const rowData = []
    headerField.forEach((ihf) => {
      rowData.push(id[ihf])
    })
    xlsxData.push(rowData)
  })

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.aoa_to_sheet(xlsxData)

  // 设置列宽
  if (autoWidth) {
    const colWidth = xlsxData.map((row) =>
      row.map((val) => {
        if (val == null) {
          return {
            wch: 10
          }
        } else if (val.toString().charCodeAt(0) > 255) {
          return {
            wch: val.toString().length * 2 + 2
          }
        } else {
          return {
            wch: val.toString().length + 3
          }
        }
      })
    )
    const cols = colWidth[0]
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (cols[j]['wch'] < colWidth[i][j]['wch']) {
          cols[j]['wch'] = colWidth[i][j]['wch']
        }
      }
    }
    worksheet['!cols'] = cols
  } else {
    const cols = []
    headerName.forEach((val) => {
      const col = {}
      if (val === null || val === undefined) {
        col.wch = 10
      } else if (val.toString().charCodeAt(0) > 255) {
        col.wch = val.toString().length * 2 + 2
      } else {
        col.wch = val.toString().length + 2
      }
      cols.push(col)
    })
    worksheet['!cols'] = cols
  }

  // 下载文件
  XLSX.utils.book_append_sheet(workbook, worksheet, fileName)
  XLSX.writeFile(workbook, fileName + '.' + bookType)
}
