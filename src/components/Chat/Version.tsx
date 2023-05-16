const VERSION = import.meta.env.VITE_VERSION || ''

export const Version = () => {
  return <div id="version" style={{ color: 'transparent', position: 'absolute', right: '5px', bottom: '5px' }}>
    {VERSION}
  </div>
}