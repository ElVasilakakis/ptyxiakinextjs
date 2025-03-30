'use client'
import React from 'react';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';

export default function UserLogoutButton() {
  return (
    <Button
      variant="destructive"
      className='cursor-pointer'
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/auth/login`,
        })
      }
    >
      Sign Out
    </Button>
  );
}
