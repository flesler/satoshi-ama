const RELEASE = import.meta.env.VITE_RELEASE || ''

export const Release = () => {
  return <div id="release" style={{ color: 'transparent', position: 'absolute', right: '5px', bottom: '5px' }}>
    {RELEASE}
  </div>
}