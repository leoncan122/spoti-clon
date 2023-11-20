
import { useState, useEffect, useRef } from 'react'
import { usePlayerStore } from "@/store/PlayerStore"
import { Slider } from '@/components/Slider'


export const Pause = ({ className }) => (
    <svg className={className} role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z"></path></svg>
)

export const Play = ({ className }) => (
    <svg className={className} role="img" height="16" width="16" aria-hidden="true" viewBox="0 0 16 16"><path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z"></path></svg>
)

export const VolumeSilence = () => (
    <svg fill="currentColor" role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volumen apagado" viewBox="0 0 16 16" ><path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z"></path><path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.78-.782l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z"></path></svg>
)

export const Volume = () => (
    <svg fill="currentColor" role="presentation" height="16" width="16" aria-hidden="true" aria-label="Volumen alto" id="volume-icon" viewBox="0 0 16 16"><path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.7l5.8 3.35V2.8l-5.8 3.35zm8.683 4.29V5.56a2.75 2.75 0 0 1 0 4.88z"></path><path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.127v1.55z"></path></svg>
)

const CurrentSong = ({ image, title }) => {
    return (
        <div className={`
        flex items-center gap-5 relative overflow-hidden`}>
            <picture className="w-16 h-16 bg-zing-800 rounded-md shadow-lg overflow-hidden">
                <img src={image} alt={title} />
            </picture>
            <h3 className="font-bold block">{title}</h3>
        </div>
    )
}
const SongControl = ({ audio }) => {
    const [currentTime, setCurrentTime] = useState(0)
    useEffect(() => {
        audio.current.addEventListener('timeupdate', handleTimeUpdate)
        return audio.current.removeEventListener('timepdate', handleTimeUpdate)
    }, [])

    const handleTimeUpdate = () => {
        setCurrentTime(audio.current.currentTime)
    }

    function secondsToHH_MM_SS(time) {
        // return 00:10:09
        if (!time) return `00:00`
        const seconds = Math.floor(time % 60)
        const minutes = Math.floor(time / 60)

        return `${minutes}:${seconds.toString().padStart(2, '0')}`
      }

      const audioDuration = audio?.current?.duration ?? 0
      
    return (
        <div className='flex gap-3 flex-col md:flex-row text-xs'>
            <span className='opacity-50 w-12 text-right'>{secondsToHH_MM_SS(currentTime)}</span>

            <Slider
                defaultValue={[0]}
                max={audio?.current?.duration ?? 0}
                min={0}
                value={[Math.floor(currentTime)]}
                className="w-[400px]"
                onValueChange={(value) => {
                    audio.current.currentTime = value
                }}
            />
            <span className='opacity-50 w-12 text-left'>{secondsToHH_MM_SS(audioDuration)}</span>
        </div>

    )
}
const VolumeControl = () => {
    const { volume, setVolume } = usePlayerStore(state => state)
    const isVolumeSilence = volume < 0.1
    const previousVolumeRef = useRef(volume)

    const handleClickVolumen = () => {
        if (isVolumeSilence) {
            setVolume(previousVolumeRef.current)
        } else {
            previousVolumeRef.current = volume
            setVolume(0)
        }
    }
    return (
        <div className='flex justify-center gap-x-2'>

            <button className="opacity-70 hover:opacity-100 transition" onClick={handleClickVolumen}>
                {isVolumeSilence ? <VolumeSilence /> : <Volume />}
            </button>


            <Slider
                defaultValue={[100]}
                max={100}
                min={0}
                className="w-[100px]"
                onValueChange={(value) => {
                    const [newVolume] = value
                    const volumeValue = newVolume / 100
                    setVolume(volumeValue)
                }}
            />
        </div>
    )
}
export function Player() {
    const { currentMusic, isPlaying, setIsPlaying, setCurrentMusic, volume } = usePlayerStore(state => state)

    const audioRef = useRef()
    const volumeRef = useRef(1)


    useEffect(() => {
        isPlaying
            ? audioRef.current.play()
            : audioRef.current.pause()
    }, [isPlaying])

    useEffect(() => {
        audioRef.current.volume = volume
    }, [volume])

    // useEffect(() => {
    //     const randomFolder = Math.floor(Math.random() * 4)
    //     const randomTrack = Math.floor(Math.random() * 3)
    //     const randomSrc = `/songs/${randomFolder}/0${randomTrack}.mp3`
    //     audioRef.current.src = randomSrc 

    // }, [])

    useEffect(() => {
        const { song, playlist, songs } = currentMusic
        if (song) {
            const src = `/songs/${playlist.id}/0${song.id}.mp3`
            audioRef.current.src = src
            audioRef.current.volume = volumeRef.current
            audioRef.current.play()

        }
    }, [currentMusic])
    const getRandomSong = () => {
        const randomFolder = Math.floor(Math.random() * 4) + 1
        const randomTrack = Math.floor(Math.random() * 3) + 1
        const randomSrc = `/songs/${randomFolder}/0${randomTrack}.mp3`
        audioRef.current.src = randomSrc

        fetch(`/api/get-info-playlist.json?id=${randomFolder}`)
        .then(res => res.json())
        .then(data => {
            const {songs, playlist} = data

            setIsPlaying(true)

            setCurrentMusic({
                songs,
                playlist,
                song: songs[randomTrack]
               })
        })
    }
    const handleClick = () => {
        const { song, playlist, songs } = currentMusic
        if (!song) {
            getRandomSong()
        }
        setIsPlaying(!isPlaying)
    }
    // console.log(isPlaying)
    return (
        <div className="grid items-center md:grid-cols-[1fr_2fr_1fr] justify-between w-full px-4 z-50">
            <div className="">
                <CurrentSong {...currentMusic.song} />
            </div>

            <div className="grid place-content-center gap-4 flex-1">
                <div className='text-center'>
                    <button className="bg-white rounded-full p-2 font-bold text-2xl text-white" onClick={handleClick} >
                        {isPlaying ? <Pause /> : <Play />}
                    </button>
                </div>
                <SongControl audio={audioRef} />
            </div>
            <div className="flex justify-end">
                <VolumeControl />
            </div>

            <audio ref={audioRef} />
        </div>
    )
}