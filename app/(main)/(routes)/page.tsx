import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs';
import { ModeToggle } from '@/components/toggle-button';
export default function Home() {
  return (
    <div>
      <h1>Discord Clone</h1>
      <UserButton afterSignOutUrl="/" />
      <ModeToggle />
    </div>
  );
}
