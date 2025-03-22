"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/store';
import { useAuth } from '@/lib/api';
import { Pen, BookOpen } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, setUser } = useAuthStore();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <BookOpen className="h-6 w-6" />
          <span className="font-bold text-xl">Blog</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link href="/posts/new">
                <Button variant="ghost">
                  <Pen className="h-4 w-4 mr-2" />
                  Nouveau Post
                </Button>
              </Link>
              <span className="text-muted-foreground">
                {user?.name}
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Connexion</Button>
              </Link>
              <Link href="/signup">
                <Button>S&apos;inscrire</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}