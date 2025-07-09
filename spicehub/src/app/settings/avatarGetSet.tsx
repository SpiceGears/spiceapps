'use client';
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useRef, useState } from 'react'
import { getBackendUrl } from '../serveractions/backend-url';
import { toast } from 'sonner';
import { getCookie } from 'typescript-cookie';
import { UserInfo } from '@/models/User';

const AvatarGetSet = (props: {user: UserInfo | null}) => {
  const avatarInput = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  
  async function deleteAvatar() {
    setLoading(true);
    const backend = await getBackendUrl();
    if (!backend) 
    {
        toast("Error", {description:"SpiceHub is offline"});
        setLoading(false);
        throw new Error("Backend is not set!")
    }
    const at = getCookie("accessToken");
    if (!at) 
    {
        toast("Error", {description:"An unknown error occured, login again"});
        setLoading(false);
        throw new Error("access token is not set!")
    }
    const res = await fetch(`${backend}/api/user/${props.user?.id}/avatar`, 
        {
            method: 'DELETE',
            headers: {Authorization: at,}
        })
    if (res.ok) 
    {
        toast("Usunięto avatar.", {description: "Twój awatar został usunięty"})
        setLoading(false);
        return;
    }
    else 
    {
        toast("Error", {description: "Avatar deletion failed: "+await res.text()})
        setLoading(false);
    }
    
  }

  async function setAvatar() 
  {
    setLoading(true);
    const backend = await getBackendUrl();
    if (!backend) 
    {
        toast("Error", {description:"SpiceHub is offline"});
        setLoading(false);
        throw new Error("Backend is not set!")
    }
    const at = getCookie("accessToken");
    if (!at) 
    {
        toast("Error", {description:"An unknown error occured, login again"});
        setLoading(false);
        throw new Error("access token is not set!")
    }

    const file = avatarInput.current?.files?.[0];
    if (!file) {alert("Najpierw wybierz plik!");setLoading(false);return;}
    if (file.type !== "image/jpeg") {alert("Wybrano niepoprawny plik!");setLoading(false);return;}
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${backend}/api/user/${props.user?.id}/avatar`, {
        method: "POST",
        headers: {Authorization: at},
        body: formData
    })

    if (res.ok) 
        {
            toast("Sukces", {description: "Pomyślnie zmieniono awatar, odśwież stronę aby ujrzeć zmiany."})
        }
    else 
    {
        toast("Error", {description: "Cannot set your avatar: "+await res.text()});
    }

    setLoading(false);
  }
  
  
  return (
      <div className="space-y-4">
          <Label htmlFor="avatar">Avatar</Label>
          <Input id="avatar" type="file" accept=".jpeg,.jpg,image/jpeg" ref={avatarInput} maxLength={1}/>
          <p className="text-sm">Avatar musi być w formacie .jpeg albo .jpg</p>
          <span className="inline space-x-2">
              <Button className="" onClick={() => setAvatar()} disabled={loading}>Ustaw avatar</Button>
              <Button className="" variant={"destructive"} onClick={() => deleteAvatar()} disabled={loading}>Usuń avatar</Button>
          </span>
      </div>
  )
}

export default AvatarGetSet