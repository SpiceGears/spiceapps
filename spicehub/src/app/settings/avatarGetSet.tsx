'use client';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useRef } from 'react'
import { getBackendUrl } from '../serveractions/backend-url';
import { toast } from 'sonner';
import { getCookie } from 'typescript-cookie';
import { UserInfo } from '@/models/User';

const AvatarGetSet = (props: {user: UserInfo | null}) => {
  const avatarInput = useRef<HTMLInputElement | null>(null);
  
  async function deleteAvatar() {
    const backend = await getBackendUrl();
    if (!backend) 
    {
        toast("Error", {description:"SpiceHub is offline"});
        throw new Error("Backend is not set!")
    }
    const at = getCookie("accessToken");
    if (!at) 
    {
        toast("Error", {description:"An unknown error occured, login again"});
        throw new Error("access token is not set!")
    }
    const res = await fetch(`${backend}/api/user/${props.user?.id}/avatar`, 
        {
            method: 'POST',
            headers: {Authorization: at,}
        })
    
  }
  
  
  return (
      <div className="space-y-4">
          <Label htmlFor="avatar">Avatar</Label>
          <Input id="avatar" type="file" accept=".jpeg,.jpg,image/jpeg" ref={avatarInput}/>
          <p className="text-sm">Avatar musi być w formacie .jpeg albo .jpg</p>
          <span className="inline space-x-2">
              <Button className="">Ustaw avatar</Button>
              <Button className="" variant={"destructive"}>Usuń avatar</Button>
          </span>
      </div>
  )
}

export default AvatarGetSet