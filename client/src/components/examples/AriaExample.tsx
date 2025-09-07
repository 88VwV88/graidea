import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { LiveRegion } from '../ui/live-region';
import { useAria } from '../../contexts/AriaContext';

/**
 * Example component demonstrating ARIA implementation
 */
const AriaExample: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { announce } = useAria();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      announce('Form submitted successfully!', 'polite');
    }, 2000);
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setIsSubmitted(false);
    announce('Form reset', 'polite');
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">ARIA System Example</h1>
      
      {/* Live Region for announcements */}
      <LiveRegion
        message={isSubmitted ? 'Form submitted successfully!' : ''}
        priority="polite"
        atomic={true}
        clearAfter={3000}
      />

      {/* Interactive Card Example */}
      <Card interactive ariaLabel="User information card">
        <CardHeader>
          <CardTitle level={2}>User Information</CardTitle>
          <CardDescription>
            This card demonstrates interactive elements with proper ARIA attributes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
              description="This will be displayed on your profile"
            />
            
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              description="We'll use this to send you updates"
            />

            <div className="flex space-x-4">
              <Button
                type="submit"
                loading={isLoading}
                loadingText="Submitting..."
                ariaLabel="Submit user information"
              >
                Submit
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                ariaLabel="Reset form"
              >
                Reset
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Button States Example */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>Button States</CardTitle>
          <CardDescription>
            Examples of different button states with ARIA attributes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button ariaLabel="Primary action button">
              Primary Button
            </Button>
            
            <Button 
              variant="outline" 
              pressed={true}
              ariaLabel="Toggle button (pressed)"
            >
              Toggle (Pressed)
            </Button>
            
            <Button 
              variant="outline" 
              expanded={true}
              ariaLabel="Expandable button (expanded)"
            >
              Expandable (Expanded)
            </Button>
            
            <Button 
              variant="destructive"
              disabled
              ariaLabel="Disabled destructive button"
            >
              Disabled Button
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Form Validation Example */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>Form Validation</CardTitle>
          <CardDescription>
            Example of form validation with proper error handling
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              label="Required Field"
              placeholder="This field is required"
              required
              error="This field is required"
              invalid={true}
            />
            
            <Input
              label="Valid Field"
              placeholder="This field is valid"
              description="This field has no errors"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Testing */}
      <Card>
        <CardHeader>
          <CardTitle level={3}>Accessibility Testing</CardTitle>
          <CardDescription>
            Test the accessibility implementation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={() => {
              if (typeof window !== 'undefined' && (window as any).checkAccessibility) {
                (window as any).checkAccessibility();
              } else {
                console.log('Accessibility testing not available');
              }
            }}
            ariaLabel="Run accessibility tests"
          >
            Run Accessibility Tests
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AriaExample;
