import request from '../util/request'

// 1获取文件夹列表
function getFileListApi(data) {
  return request({
    url: '/pmobile/dynamic/virtualPath/listFile',
    data
  })
}

// 2新增文件夹
function addFolderApi(data) {
  return request({
    url: '/pmobile/dynamic/virtualPath/add-file.json',
    data
  })
}

// 4获取全部文件夹
function getAllFoldersApi(data) {
  return request({
    url: '/pmobile/dynamic/virtualPath/listAllFile',
    data
  })
}

// 6删除文件|文件夹
function delFileApi(data) {
  return request({
    url: '/pmobile/dynamic/virtualPath/del-file.json',
    data
  })
}

// 8下载数据
function downloadDataApi(data) {
  return request({
    url: '/pmobile/dynamic/virtualPath/download-file.json',
    responseType: 'blob',
    data
  })
}

// 9文件夹移动
function fileMoveApi(data) {
  return request({
    url: '/pmobile/dynamic/virtualPath/move-file.json',
    data
  })
}

export {
  getFileListApi, // 1获取文件夹列表
  addFolderApi, // 2新增文件夹
  getAllFoldersApi, // 4获取全部文件夹
  delFileApi, // 6删除文件|文件夹
  downloadDataApi, // 8下载数据
  fileMoveApi // 9文件夹移动
}
