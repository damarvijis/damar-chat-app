import { Channel, ChannelTypeEnum, Server } from "@prisma/client"
import { create } from "zustand"

export type ModalType = "createServer" | "invite" | "editServer" | "members" | "createChannel" | "leaveServer" | "deleteServer" | "deleteChannel" | "editChannel" | "messageFile" | "deleteMessage"

type ModalDataType = {
  server?: Server
  channel?: Channel
  channelType?: ChannelTypeEnum
  apiUrl?: string
  query?: Record<string, any>
}

type ModalStoreType = {
  type: ModalType | null
  data: ModalDataType
  isOpen: boolean
  onOpen: (type: ModalType, data?: ModalDataType) => void
  onClose: () => void
}

export const useModal = create<ModalStoreType>((set) => ({
  type: null,
  isOpen: false,
  data: {},
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ isOpen: false, type: null })
}))