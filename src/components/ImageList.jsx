import React from 'react'

const ImageList = ({ record }) => {
  const url = record.params.image
  return url ? (
    <img src={`/${url}`} alt="image" style={{ maxWidth: '100px' }} />
  ) : '—'
}

export default ImageList
