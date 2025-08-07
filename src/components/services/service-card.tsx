
"use client";

import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ThumbsUp, MessageSquare, Share2, MoreHorizontal } from "lucide-react";

type ServiceCardProps = {
  userName: string;
  userAvatar: string;
  time: string;
  title: string;
  description: string;
  imageUrl: string;
  imageHint?: string;
  likes: number;
  comments: number;
  shares: number;
};

export function ServiceCard({
  userName,
  userAvatar,
  time,
  title,
  description,
  imageUrl,
  imageHint,
  likes,
  comments,
  shares,
}: ServiceCardProps) {
  return (
    <Card className="rounded-2xl overflow-hidden shadow-sm">
      <CardHeader className="p-4 flex flex-row items-center gap-3">
        <Avatar>
          <AvatarImage src={userAvatar} alt={userName} data-ai-hint="logo emblem"/>
          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <p className="font-semibold">{userName}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-5 w-5" />
          <span className="sr-only">Opsi</span>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="px-4 pb-4">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="relative w-full aspect-video bg-muted">
            <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            data-ai-hint={imageHint}
            />
        </div>
      </CardContent>
      <CardFooter className="p-2 flex flex-col">
        <div className="flex justify-between w-full px-2 py-1 text-sm text-muted-foreground">
          <span>{likes} Suka</span>
          <div className="flex gap-4">
             <span>{comments} Komentar</span>
             <span>{shares} Dibagikan</span>
          </div>
        </div>
        <Separator className="my-1" />
        <div className="w-full grid grid-cols-3 gap-1">
          <Button variant="ghost" className="text-muted-foreground font-semibold">
            <ThumbsUp className="h-5 w-5 mr-2" />
            Suka
          </Button>
           <Button variant="ghost" className="text-muted-foreground font-semibold">
            <MessageSquare className="h-5 w-5 mr-2" />
            Komentar
          </Button>
           <Button variant="ghost" className="text-muted-foreground font-semibold">
            <Share2 className="h-5 w-5 mr-2" />
            Bagikan
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
