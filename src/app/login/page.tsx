
'use client';

import { useState } from 'react';
import { LoginForm } from '@/components/auth/login-form';
import { RegisterForm } from '@/components/auth/register-form';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PascualBetLogo } from '@/components/pascualbet-logo';
import { useI18n } from '@/hooks/use-i18n';
import { LanguageSwitcher } from '@/components/dashboard/language-switcher';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState('login');
  const t = useI18n();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <PascualBetLogo className="w-32 h-auto mb-4" />
           <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">Bienvenido a PascualBet</h1>
              <LanguageSwitcher />
           </div>
          <p className="text-muted-foreground">Tu casino online de confianza.</p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <Card className="bg-card rounded-lg shadow-lg border-0">
                <CardHeader className="text-center pb-4">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">{t('login.logIn')}</TabsTrigger>
                        <TabsTrigger value="register">{t('login.createAccountTitle')}</TabsTrigger>
                    </TabsList>
                </CardHeader>
                <CardContent>
                    <TabsContent value="login">
                        <LoginForm />
                         <div className="text-center mt-6">
                           <p className="text-muted-foreground">
                             {t('login.dontHaveAccount')}{' '}
                             <button onClick={() => setActiveTab('register')} className="font-semibold text-primary hover:underline focus:outline-none">
                               {t('login.register')}
                             </button>
                           </p>
                        </div>
                    </TabsContent>
                    <TabsContent value="register">
                        <RegisterForm />
                         <div className="text-center mt-6">
                            <p className="text-muted-foreground">
                              {t('login.alreadyHaveAccount')}{' '}
                              <button onClick={() => setActiveTab('login')} className="font-semibold text-primary hover:underline focus:outline-none">
                                {t('login.logIn')}
                              </button>
                            </p>
                        </div>
                    </TabsContent>
                </CardContent>
            </Card>
        </Tabs>
      </div>
    </main>
  );
}
