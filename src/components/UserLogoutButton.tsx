'use client'
import React from 'react';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { LogOutIcon } from 'lucide-react';

export default function UserLogoutButton() {
  return (
    <span
      className='cursor-pointer'
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/auth/login`,
        })
      }
    >

      Log Out Out
    </span>
  );
}
