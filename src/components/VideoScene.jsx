import { useState, useEffect, useRef } from 'react'
import { sClick, sCorrect, sWrong, sKawaiiHappy, sKawaiiSad, sEnergy } from '../sounds'
import { COFFEE_TYPES } from '../data/rewards'

export default function VideoScene({ scene, userCoffee, love, onFinish }) {
  const [phase, setPhase] = useState('intro') // intro | ask | response | end
  const [bubble, setBubble] = useState('')
  const [selectedCoffee, setSelectedCoffee] = useState(null)
  const [rewarded, setRewarded] = useState(false)
  const [coffeeReward, setCoffeeReward] = useState(null)
  const videoRef = useRef(null)

  const askText = scene.askCoffee[Math.floor(Math.random() * scene.askCoffee.length)]

  useEffect(() => {
    // Fase 1: reproducir video + intro
    const t1 = setTimeout(() => {
      setBubble(`¡Hola senpai! Esa lección estuvo bien. ✨`)
    }, 500)
    const t2 = setTimeout(() => {
      setPhase('ask')
      setBubble(askText)
      sKawaiiHappy()
    }, 3500)

    // Probabilidad de recompensa de café (40%)
    const t3 = setTimeout(() => {
      if (Math.random() < 0.4) {
        const coffee = COFFEE_TYPES[Math.floor(Math.random() * COFFEE_TYPES.length)]
        setCoffeeReward(coffee)
        setRewarded(true)
        sEnergy()
      }
    }, 4000)

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  const handleGiveCoffee = () => {
    if (userCoffee <= 0) {
      sWrong()
      setBubble('...no tienes café. Lo siento, pero yo pedí primero. 😔')
      setPhase('response')
      setTimeout(() => onFinish({ loveDelta: -5, coffeeDelta: 0 }), 2000)
      return
    }
    sCorrect()
    const bonus = selectedCoffee ? selectedCoffee.loveBonus : 8
    setBubble(scene.happy[Math.floor(Math.random() * scene.happy.length)])
    setPhase('response')
    setTimeout(() => onFinish({ loveDelta: bonus, coffeeDelta: -1 }), 2200)
  }

  const handleRefuse = () => {
    sKawaiiSad()
    setBubble(scene.sad[Math.floor(Math.random() * scene.sad.length)])
    setPhase('response')
    setTimeout(() => onFinish({ loveDelta: -8, coffeeDelta: 0 }), 2200)
  }

  return (
    <div className="vn-overlay">
      <div className="vn-scene">
        <video
          ref={videoRef}
          src={scene.video}
          autoPlay
          muted
          loop
          playsInline
          className="vn-video"
        />
        <div className="vn-vignette" />
      </div>

      {/* Burbuja de diálogo */}
      {bubble && (
        <div className="vn-bubble">
          <div className="vn-bubble-name">{scene.name}</div>
          <p>{bubble}</p>
        </div>
      )}

      {/* Recompensa de café */}
      {rewarded && coffeeReward && phase === 'ask' && (
        <div className="vn-reward-toast">
          🎁 ¡Ganaste un {coffeeReward.emoji} {coffeeReward.name}!
        </div>
      )}

      {/* Opciones */}
      {phase === 'ask' && (
        <div className="vn-choices">
          {userCoffee > 0 ? (
            <>
              {COFFEE_TYPES.map(c => (
                <button
                  key={c.id}
                  className={`vn-choice ${selectedCoffee?.id === c.id ? 'selected' : ''}`}
                  onClick={() => { sClick(); setSelectedCoffee(c) }}
                >
                  {c.emoji} Darle {c.name}
                </button>
              ))}
              <button className="vn-choice give" onClick={handleGiveCoffee}>
                ✅ DAR CAFÉ ({userCoffee} en inventario)
              </button>
              <button className="vn-choice refuse" onClick={handleRefuse}>
                ❌ No darle
              </button>
            </>
          ) : (
            <>
              <p style={{ color: '#fff', textAlign: 'center', fontSize: 13 }}>No tienes café en inventario 😢</p>
              <button className="vn-choice refuse" onClick={handleRefuse}>
                Decirle que no
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
