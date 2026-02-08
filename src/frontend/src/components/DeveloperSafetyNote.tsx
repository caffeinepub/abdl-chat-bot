import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

export function DeveloperSafetyNote() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-between text-xs">
          <span className="text-muted-foreground">Developer Note</span>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Alert variant="destructive" className="mt-2">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Security Warning: API Key Exposure</AlertTitle>
          <AlertDescription className="space-y-2 text-sm">
            <p>
              <strong>CRITICAL:</strong> An API key was shared in the project request. This key is
              now compromised and must be immediately revoked and rotated.
            </p>
            <p>
              <strong>Best Practices:</strong>
            </p>
            <ul className="list-inside list-disc space-y-1 pl-2">
              <li>Never paste API keys, tokens, or secrets into chat interfaces</li>
              <li>Never commit secrets to version control (use .env files and .gitignore)</li>
              <li>Store secrets securely using environment variables or secret management services</li>
              <li>Rotate compromised credentials immediately</li>
              <li>Use backend services to proxy API calls and keep keys server-side</li>
            </ul>
            <p className="mt-2 text-xs">
              This application does not use or store the provided key. All chat functionality is
              handled by the backend canister on the Internet Computer.
            </p>
          </AlertDescription>
        </Alert>
      </CollapsibleContent>
    </Collapsible>
  );
}
