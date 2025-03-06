import { Metadata } from 'next';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useState } from 'react';

export const metadata: Metadata = {
  title: 'Contact Us | Nebula Suite',
  description: 'Get in touch with the Nebula Suite team. We\'re here to help with your questions and feedback.',
};

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: Implement actual form submission logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      form.reset();
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
      <Card className="p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Name
            </label>
            <Input
              id="name"
              {...form.register('name')}
              aria-describedby="name-error"
              disabled={isSubmitting}
            />
            {form.formState.errors.name && (
              <p className="text-red-500 text-sm mt-1" id="name-error">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...form.register('email')}
              aria-describedby="email-error"
              disabled={isSubmitting}
            />
            {form.formState.errors.email && (
              <p className="text-red-500 text-sm mt-1" id="email-error">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-2">
              Message
            </label>
            <Textarea
              id="message"
              {...form.register('message')}
              rows={5}
              aria-describedby="message-error"
              disabled={isSubmitting}
            />
            {form.formState.errors.message && (
              <p className="text-red-500 text-sm mt-1" id="message-error">
                {form.formState.errors.message.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>

          {submitStatus === 'success' && (
            <p className="text-green-500 text-center">
              Thank you for your message! We'll get back to you soon.
            </p>
          )}

          {submitStatus === 'error' && (
            <p className="text-red-500 text-center">
              There was an error sending your message. Please try again.
            </p>
          )}
        </form>
      </Card>
    </div>
  );
}
