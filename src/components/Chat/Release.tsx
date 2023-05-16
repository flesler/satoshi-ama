import { useOnline } from '@/store/online'

const RELEASE = import.meta.env.VITE_RELEASE || ''

export const Release = () => {
  const { isOnline } = useOnline()
  return <div id="release" style={{ color: 'transparent', position: 'absolute', right: '5px', bottom: '5px', textAlign: 'right' }}>
    {typeof isOnline === 'boolean' && (
      <p>{isOnline ? 'Online' : 'Offline'}</p>
    )}
    {RELEASE && <p>{RELEASE}</p>}
  </div>
}