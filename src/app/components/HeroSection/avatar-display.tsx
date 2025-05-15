import Image from "next/image"
import { Button } from "../ui/button"

interface AvatarDisplayProps {
  title: string
  description: string
  imageSrc: string
  type: "cartoon" | "comic" | "anime" | "sketch"
}

export function AvatarDisplay({ title, description, imageSrc, type }: AvatarDisplayProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-center">
      <div className="w-full md:w-1/2">
        <div className="relative aspect-square w-full max-w-xs mx-auto">
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={`${type} avatar style`}
            width={400}
            height={400}
            className="rounded-xl shadow-md object-cover"
          />
        </div>
      </div>
      <div className="w-full md:w-1/2 space-y-4">
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <Button variant="outline" className="rounded-full">
          Choose This Style
        </Button>
      </div>
    </div>
  )
}