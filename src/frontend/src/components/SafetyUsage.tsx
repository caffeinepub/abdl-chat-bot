import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Shield, AlertTriangle, Info } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

export function SafetyUsage() {
  return (
    <div className="space-y-4">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-2xl">
          <Shield className="h-6 w-6 text-primary" />
          Safety & Usage Guidelines
        </DialogTitle>
        <DialogDescription>
          Please read these important guidelines before using the chatbot.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Content Policy</AlertTitle>
          <AlertDescription>
            This chatbot is designed for general conversation and assistance. It does not provide
            explicit sexual content, fetish content, or engage in adult roleplay scenarios.
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Request Refusals</AlertTitle>
          <AlertDescription>
            The chatbot may refuse certain requests that violate content policies or platform
            guidelines. If your request is declined, please try rephrasing or asking about a
            different topic.
          </AlertDescription>
        </Alert>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Safe Usage</AlertTitle>
          <AlertDescription>
            This service is provided on the Internet Computer platform, which has strict content
            policies. All interactions are subject to these policies. Please use the chatbot
            responsibly and respectfully.
          </AlertDescription>
        </Alert>

        <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
          <p className="mb-2 font-medium text-foreground">What you can ask about:</p>
          <ul className="list-inside list-disc space-y-1">
            <li>General knowledge and information</li>
            <li>Advice on everyday topics</li>
            <li>Creative writing assistance (within guidelines)</li>
            <li>Problem-solving and brainstorming</li>
            <li>Friendly conversation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
