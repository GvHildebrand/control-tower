'use client'

import { ConversationProvider } from '@elevenlabs/react'
import { VoiceWidget } from './voice-widget'
import { snapshot } from '@/lib/projects'

export function VoiceWidgetWrapper() {
  return (
    <ConversationProvider>
      <VoiceWidget projects={snapshot} />
    </ConversationProvider>
  )
}
