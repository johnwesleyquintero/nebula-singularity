export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Help & Support</h1>
        
        <div className="space-y-4">
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-2">
              <div>
                <h3 className="font-medium">How do I connect my Amazon seller account?</h3>
                <p className="text-muted-foreground text-sm">
                  Navigate to Settings → API Keys and follow the integration guide.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Where can I view my sales analytics?</h3>
                <p className="text-muted-foreground text-sm">
                  Visit the Dashboard section for real-time sales metrics and trends.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
            <p className="text-muted-foreground mb-4">
              Need further assistance? Our team is available 24/7.
            </p>
            <div className="space-y-2">
              <div>
                <h3 className="font-medium">Email Support</h3>
                <p className="text-muted-foreground text-sm">support@sellsmart-pro.com</p>
              </div>
              <div>
                <h3 className="font-medium">Live Chat</h3>
                <p className="text-muted-foreground text-sm">Available in the bottom-right corner of your dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}