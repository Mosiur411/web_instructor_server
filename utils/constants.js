const UserRegisterType = new Set(['user','admin'])
const AllowedFileTypes = new Set(['image/png', 'image/webp', 'image/jpg', 'image/jpeg', 'image/tif', 'image/tiff', 'application/pdf', 'text/csv'])

const MaxFileSize = 50 * 1024 * 1024

const Roles = {
  ADMIN: 'admin',
  USER: 'user',
}

const ResultLimit = 10

module.exports = {
  UserRegisterType,
  AllowedFileTypes,
  MaxFileSize,
  Roles
}
