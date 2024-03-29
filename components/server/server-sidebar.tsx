import { currentProfile } from "@/lib/current-profile"
import { db } from "@/lib/db"
import { ChannelTypeEnum, MemberRoleEnum } from "@prisma/client"
import { redirect } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ServerHeader } from "./server-header"
import { ServerSearch } from "./server-search"
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ServerSection } from "./server-section"
import { ServerChannel } from "./server-channel"
import { ServerMember } from "./server-member"

type ServerSidebarPropsType = {
  serverId: string
}

const iconMap = {
  [ChannelTypeEnum.TEXT]: <Hash className="mr-2 h-4 w-4" />,
  [ChannelTypeEnum.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
  [ChannelTypeEnum.VIDEO]: <Video className="mr-2 h-4 w-4" />,
}

const roleIconMap = {
  [MemberRoleEnum.GUEST]: null,
  [MemberRoleEnum.MODERATOR]: <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />,
  [MemberRoleEnum.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
}

export const ServerSidebar = async ({ serverId }: ServerSidebarPropsType) => {
  const profile = await currentProfile()

  if (!profile) return redirect("/")

  const server = await db.server.findUnique({
    where: {
      id: serverId
    },
    include: {
      channels: {
        orderBy: { createdAt: "asc" }
      },
      members: {
        include: { profile: true },
        orderBy: { role: "asc" }
      }
    }
  })

  if (!server) return redirect("/")

  const textChannels = server.channels.filter((channel) => channel.type === ChannelTypeEnum.TEXT)
  const audioChannels = server.channels.filter((channel) => channel.type === ChannelTypeEnum.AUDIO)
  const videoChannels = server.channels.filter((channel) => channel.type === ChannelTypeEnum.VIDEO)
  const members = server.members.filter((member) => member.profileId !== profile.id)
  const role = server.members.find(member => member.profileId === profile.id)?.role


  return (
    <div className="flex flex-col h-full text-primary w-full dark:bg-[#2b2d31] bg-[#f2f3f5]">
      <ServerHeader
        server={server}
        role={role}
      />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch data={[
            {
              label: "Text Channels",
              type: "channel",
              data: textChannels?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]
              }))
            },
            {
              label: "Voice Channels",
              type: "channel",
              data: audioChannels?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]
              }))
            },
            {
              label: "Video Channels",
              type: "channel",
              data: videoChannels?.map(channel => ({
                id: channel.id,
                name: channel.name,
                icon: iconMap[channel.type]
              }))
            },
            {
              label: "Members",
              type: "member",
              data: members?.map(member => ({
                id: member.id,
                name: member.profile.name,
                icon: roleIconMap[member.role]
              }))
            },
          ]} />
        </div>
        <Separator className="bg-zinc-200 dark:bg-zinc-700 rounded-md my-2" />
        {!!textChannels.length && (
          <div className="mt-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelTypeEnum.TEXT}
              role={role}
              label="Text Channels"
            />
            <div className="space-y-[2px]">
              {textChannels.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div >
        )}
        {!!audioChannels.length && (
          <div className="mt-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelTypeEnum.AUDIO}
              role={role}
              label="Voice Channels"
            />
            <div className="space-y-[2px]">
              {audioChannels.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div >
        )}
        {!!videoChannels.length && (
          <div className="mt-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelTypeEnum.VIDEO}
              role={role}
              label="Video Channels"
            />
            <div className="space-y-[2px]">
              {videoChannels.map(channel => (
                <ServerChannel
                  key={channel.id}
                  channel={channel}
                  role={role}
                  server={server}
                />
              ))}
            </div>
          </div >
        )}
        {!!members.length && (
          <div className="mt-2">
            <ServerSection
              sectionType="members"
              role={role}
              label="Members"
              server={server}
            />
            <div className="space-y-[2px]">
              {members.map(member => (
                <ServerMember
                  key={member.id}
                  member={member}
                  server={server}
                />
              ))}
            </div>
          </div >
        )}
      </ScrollArea>
    </div>
  )
}