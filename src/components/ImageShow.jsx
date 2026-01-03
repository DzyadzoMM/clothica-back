import React from 'react'

const ImageShow = ({ record }) => {
  const url = record.params.image
  return url ? (
    <img src={`/${url}`} alt="image" style={{ maxWidth: '300px' }} />
  ) : '—'
}

export default ImageShow
