'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { checkForThreat } from '@/actions/threat-detection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertCircle, Bot, Shield, Siren, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  result: undefined,
  error: undefined,
  message: undefined,
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full sm:w-auto">
            {pending ? 'Analyzing...' : <> <Shield className="mr-2 h-4 w-4" /> Analyze Activity </>}
        </Button>
    );
}

export default function ThreatDetectionForm({ userRole }: { userRole: string }) {
  const [state, formAction] = useFormState(checkForThreat, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.error) {
        toast({
            title: "Error",
            description: state.error,
            variant: "destructive",
        })
    }
  }, [state.error, toast])

  return (
    <div className="grid gap-6">
      <form action={formAction}>
        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Threat Detection</CardTitle>
            <CardDescription>Analyze user behavior patterns to flag suspicious activities in real-time.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="userActivity">User Activity Description</Label>
              <Textarea
                id="userActivity"
                name="userActivity"
                placeholder="e.g., 'Attempted to access financial records at 3 AM from an unrecognized IP address.'"
                required
                rows={3}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
               <div className="space-y-2">
                 <Label htmlFor="userRole">User Role</Label>
                 <Select name="userRole" defaultValue={userRole}>
                   <SelectTrigger id="userRole">
                     <SelectValue placeholder="Select a role" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="user">User</SelectItem>
                     <SelectItem value="admin">Admin</SelectItem>
                     <SelectItem value="guest">Guest</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="accessLevel">Access Level</Label>
                 <Select name="accessLevel" defaultValue="standard">
                   <SelectTrigger id="accessLevel">
                     <SelectValue placeholder="Select access level" />
                   </SelectTrigger>
                   <SelectContent>
                     <SelectItem value="standard">Standard</SelectItem>
                     <SelectItem value="privileged">Privileged</SelectItem>
                     <SelectItem value="restricted">Restricted</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4">
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Bot className="h-4 w-4" />
                <span>Powered by GenAI</span>
             </div>
             <SubmitButton />
          </CardFooter>
        </Card>
      </form>
      
      {state.result && (
        <Card className="bg-card">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Analysis Result</CardTitle>
                <CardDescription>AI assessment of the described activity.</CardDescription>
              </div>
              <Badge variant={state.result.isSuspicious ? 'destructive' : 'default'} className="capitalize text-sm">
                {state.result.isSuspicious ? <Siren className="mr-2 h-4 w-4" /> : <UserCheck className="mr-2 h-4 w-4" />}
                {state.result.threatLevel} Threat
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm md:text-base text-foreground/90">{state.result.explanation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
