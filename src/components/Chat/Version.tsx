export const Version = () => {
  const version = document.querySelector('meta[name=version]')?.getAttribute('content')
  return <div id="version" style={{ color: 'transparent', position: 'absolute', right: '5px', bottom: '5px' }}>
    {version}
  </div>
}