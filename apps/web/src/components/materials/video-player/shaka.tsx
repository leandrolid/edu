'use client'

import { AspectRatio } from '@radix-ui/themes'
import { useEffect, useRef } from 'react'
import 'shaka-player/dist/controls.css'

export function ShakaPlayer({
  manifestUrl,
  thumbnail,
  licenseServer = 'https://widevine-proxy.appspot.com/proxy',
}: {
  manifestUrl: string
  thumbnail: string
  licenseServer?: string
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoContainerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const shaka = require('shaka-player/dist/shaka-player.ui.js')
    let video = videoRef.current
    let videoContainer = videoContainerRef.current
    var player = new shaka.Player(video)
    const ui = new shaka.ui.Overlay(player, videoContainer, video)
    ui.configure({
      controlPanelElements: [
        'play_pause',
        'skip_next',
        'mute',
        'volume',
        'time_and_duration',
        'spacer',
        'overflow_menu',
        'fullscreen',
      ],
      overflowMenuButtons: ['captions', 'quality', 'language', 'playback_rate'],
      contextMenuElements: ['loop', 'statistics'],
      customContextMenu: true,
      addSeekBar: true,
    })
    console.log(ui)
    const controls = ui.getControls()
    controls.getLocalization().changeLocale(['pt-BR'])
    player.configure({
      drm: { servers: { 'com.widevine.alpha': licenseServer } },
    })
    player
      .load(manifestUrl)
      .then(() => {
        console.log('The video has now been loaded!')
      })
      .catch((error: any) => {
        console.error('Error code', error.code, 'object', error)
      })
  }, [])

  return (
    <AspectRatio ref={videoContainerRef} ratio={16 / 9} style={{ width: '100%' }}>
      <video id="video" ref={videoRef} width="100%" poster={thumbnail}></video>
    </AspectRatio>
  )
}
