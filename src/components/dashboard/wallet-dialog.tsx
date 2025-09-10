
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';
import { ScrollArea } from '../ui/scroll-area';

interface WalletDialogProps {
  balance: number;
  onBalanceChange: (amount: number, type: 'deposit' | 'withdraw') => void;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };


export function WalletDialog({ balance, onBalanceChange, onClose }: WalletDialogProps) {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState<number | ''>(0);
  const [promoCode, setPromoCode] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleAmountChange = (value: string) => {
    setError('');
    const num = parseInt(value.replace(/\D/g, ''), 10);
    setAmount(isNaN(num) ? '' : num);
  };
  
  const setPresetAmount = (preset: number) => {
    setError('');
    setAmount(preset);
  };

  const handleDeposit = () => {
    if (typeof amount !== 'number' || amount <= 0) {
      setError('Por favor, introduce un monto válido para depositar.');
      return;
    }
    if (amount < 10000) {
      setError('El monto mínimo de depósito es de $10,000.');
      return;
    }
     if (amount > 4000000) {
      setError('El monto máximo de depósito es de $4,000,000.');
      return;
    }
    setError('');
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  };
  
  const handleWithdraw = () => {
    if (balance < 20000) {
       setError(`No puedes retirar. Tu saldo es inferior a ${formatCurrency(20000)}.`);
       return;
    }
    if (typeof amount !== 'number' || amount <= 0) {
      setError('Por favor, introduce un monto válido para retirar.');
      return;
    }
    if (amount > balance) {
        setError('No puedes retirar más de tu saldo actual.');
        return;
    }
     if (amount < 20000) {
      setError(`El monto mínimo de retiro es de ${formatCurrency(20000)}.`);
      return;
    }
     setError('');
     onBalanceChange(-amount, 'withdraw');
     onClose();
  };

  const presetAmounts = [40000, 80000, 200000, 400000];
  const banks = ["BANCO DE BOGOTA", "BANCOLOMBIA", "DAVIVIENDA", "BANCO AGRARIO", "NEQUI", "DAVIPLATA"];

  return (
    <DialogContent className="max-w-md flex flex-col h-[90vh] sm:h-auto">
      <DialogHeader>
        <DialogTitle className="text-center text-2xl">Billetera</DialogTitle>
      </DialogHeader>
      <Tabs value={activeTab} onValueChange={(value) => {
          setActiveTab(value as 'deposit' | 'withdraw');
          setAmount(0);
          setError('');
        }} className="w-full flex flex-col flex-1 min-h-0">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="deposit">Depositar</TabsTrigger>
          <TabsTrigger value="withdraw">Retirar</TabsTrigger>
        </TabsList>
            <TabsContent value="deposit" className="flex-1 overflow-hidden mt-0">
             <ScrollArea className="h-full">
              <div className="space-y-4 py-4 pr-4">
                <div className="space-y-2">
                  <Label htmlFor="amount-deposit">Monto</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input 
                        id="amount-deposit" 
                        type="text"
                        value={amount === '' ? '' : new Intl.NumberFormat('es-CO').format(amount)}
                        onChange={(e) => handleAmountChange(e.target.value)} 
                        className="pl-6 pr-24 h-12 text-lg"
                        placeholder="0.00"
                    />
                    <div className="absolute right-1 top-1/2 -translate-y-1/2">
                        <Select defaultValue="nequi">
                          <SelectTrigger className="w-[80px] bg-transparent border-0">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nequi">Nequi</SelectItem>
                            <SelectItem value="pse">PSE</SelectItem>
                            <SelectItem value="bancolombia">Bancolombia</SelectItem>
                          </SelectContent>
                        </Select>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Monto mínimo de depósito: {formatCurrency(10000)}</p>
                  <p className="text-xs text-muted-foreground">Monto máximo de depósito: {formatCurrency(4000000)}</p>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {presetAmounts.map(p => (
                        <Button key={p} variant="outline" onClick={() => setPresetAmount(p)}>
                            {formatCurrency(p)}
                        </Button>
                    ))}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="promo-code">¿Tienes un código promocional?</Label>
                    <Input 
                        id="promo-code"
                        placeholder="Introduce el código de bonificación"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                    />
                </div>
                {error && (
                     <Alert variant="destructive" className="text-xs">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                <Button onClick={handleDeposit} className="w-full h-12 bg-green-600 hover:bg-green-700 text-white text-lg">Depositar</Button>
              </div>
              </ScrollArea>
            </TabsContent>
            <TabsContent value="withdraw" className="flex-1 overflow-hidden mt-0">
                <ScrollArea className="h-full">
               <div className="space-y-4 py-4 pr-4">
                  <div className="p-4 rounded-md bg-secondary text-center mb-4">
                    <p className="text-muted-foreground">Saldo Disponible para Retirar</p>
                    <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de cuenta</Label>
                     <Select defaultValue="ahorros">
                        <SelectTrigger className="h-12 bg-input">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ahorros">Ahorros</SelectItem>
                            <SelectItem value="corriente">Corriente</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>

                   <div className="space-y-2">
                    <Label htmlFor="account-number">Número de cuenta bancaria</Label>
                    <Input id="account-number" placeholder="Introduce el número de cuenta" className="h-12 bg-input"/>
                  </div>

                  <div className="space-y-2">
                    <Label>Seleccionar banco</Label>
                     <Select defaultValue="banco-de-bogota">
                        <SelectTrigger className="h-12 bg-input">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           {banks.map(bank => (
                               <SelectItem key={bank} value={bank.toLowerCase().replace(/ /g, '-')}>{bank}</SelectItem>
                           ))}
                        </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount-withdraw">Monto de retiro</Label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                        <Input 
                            id="amount-withdraw" 
                            type="text"
                            value={amount === '' ? '' : new Intl.NumberFormat('es-CO').format(amount)}
                            onChange={(e) => handleAmountChange(e.target.value)}
                            className="pl-6 h-12 text-lg"
                            placeholder="0"
                        />
                    </div>
                  </div>
                   <div className="text-xs text-muted-foreground space-y-1">
                     <p>Monto mínimo de retiro: {formatCurrency(20000)}</p>
                     <p>Monto máximo de retiro: {formatCurrency(balance)}</p>
                   </div>
                  
                    <div className="text-xs text-muted-foreground space-y-2 bg-secondary/30 p-3 rounded-md">
                        <p className="font-bold">Para avanzar con el retiro, ten en cuenta:</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>La cuenta debe estar verificada.</li>
                            <li>Debes haber apostado el 100% de todos tus depósitos para poder procesar el retiro.</li>
                            <li>Máximo se podrán realizar 3 retiros por día.</li>
                            <li>Si realizas tu retiro a través de Efecty, recibirás el código al número de WhatsApp registrado.</li>
                            <li>Si el monto solicitado es igual o mayor a 48 UVT definido para el...</li>
                        </ul>
                    </div>

                  {error && (
                     <Alert variant="destructive" className="text-xs mt-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                  <Button onClick={handleWithdraw} className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-lg">Transferir</Button>
               </div>
               </ScrollArea>
            </TabsContent>
      </Tabs>
    </DialogContent>
  );
}
