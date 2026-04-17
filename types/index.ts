export interface User {
  id: string
  email: string
  name: string
  token?: string
}

export interface App {
  id: string
  name: string
  ownerId: string
  createdAt: string
}

export interface DeploymentKey {
  id: string
  key: string
  channel: string
  appId: string
  createdAt: string
}

export interface Release {
  id: string
  version: string
  notes?: string
  url: string
  appId: string
  channelId: string
  isMandatory: boolean
  createdAt: string
}
