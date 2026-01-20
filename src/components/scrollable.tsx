import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useDirection } from '@radix-ui/react-direction'

export default function DemoSheet() {
  const direction = useDirection()

  const faqSections = [
    {
      title: 'Account Management',
      content:
        'Navigate to the registration page, provide the required information, and verify your email address. You can sign up using your email or through social media platforms.',
    },
    {
      title: 'Payment and Billing',
      content:
        'We accept all major credit cards, PayPal, and bank transfers. If you face issues, check your payment details or contact our support team.',
    },
    {
      title: 'Subscription Plans',
      content:
        'Choose a plan that fits your needs. Upgrade, downgrade, or cancel at any time from the subscription settings page in your account.',
    },
    {
      title: 'Technical Support',
      content:
        'Our support team is available 24/7 via live chat or email. Check our Help Center for troubleshooting guides and tips.',
    },
    {
      title: 'Privacy and Security',
      content:
        'Your data is encrypted and stored securely. We comply with GDPR and other privacy regulations to protect your information.',
    },
    {
      title: 'Feature Requests',
      content:
        'Got ideas for new features? Submit your request via the feedback form in the app or reach out to us directly.',
    },
    {
      title: 'Refund Policy',
      content:
        "If you're not satisfied with your purchase, you can request a refund within 14 days. Please review our refund policy for more details.",
    },
    {
      title: 'Mobile App Support',
      content:
        'Our platform is fully compatible with iOS and Android devices. Download our app from the App Store or Google Play.',
    },
    {
      title: 'User Roles and Permissions',
      content:
        'Admins can assign roles and permissions to other users. These roles determine the level of access within the platform.',
    },
  ]

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open Sheet
      </SheetTrigger>
      <SheetContent className="p-0 flex flex-col" dir={direction}>
        <SheetHeader className="py-4 px-5 border-b border-border">
          <SheetTitle>Quick Help</SheetTitle>
          <SheetDescription>Frequently Asked Questions(FAQ)</SheetDescription>
        </SheetHeader>
        <div className="py-0 px-5 grow overflow-hidden flex-1">
          <ScrollArea className="text-sm h-full pe-3 -me-3">
            <div className="space-y-4 [&_h3]:font-semibold [&_h3]:text-foreground">
              {faqSections.map((faq, index) => (
                <div key={index} className="text-accent-foreground space-y-1">
                  <h3>{faq.title}</h3>
                  <p>{faq.content}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
        <SheetFooter className="py-4 px-5 border-t border-border">
          <SheetClose render={<Button variant="outline" />}>Cancel</SheetClose>
          <SheetClose render={<Button type="submit" />}>
            Submit Feedback
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
