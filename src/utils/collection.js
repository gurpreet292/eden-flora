const imageTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

export const isImageFile = (file) => imageTypes.has(file.type)
