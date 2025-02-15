// app/page.js
import Link from 'next/link';
import { Button } from '~/components/ui/button';
import { ArrowRight, CheckCircle, Rocket } from 'lucide-react'; // Icons - install: `npm install lucide-react`
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card" // Shadcn Card
import { HomeNavbar } from './HomeNavbar';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50">
      <HomeNavbar/>
      <main className="flex-1 overflow-y-auto overflow-x-hidden mx-16 mt-32 xl:mt-48">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Uncomplicate Your Support. Get <span className="text-primary">Resolvely.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
          Stop struggling with messy support systems. <span className="text-primary">Resolvely</span> offers a <span className="text-primary">compact yet powerful platform</span> that simplifies your workflows, so you can <span className="text-primary">focus on what matters most:</span> your customers.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg" className="shiny-button">
                Get Started <Rocket className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/features">
              <Button variant="outline" size="lg">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="mb-24 xl:mx-48">
          <h2 className="text-3xl font-semibold mb-12 text-center">Empowering Features for Your Support Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
              <div className="mb-4"><CheckCircle className="h-8 w-8 text-primary" /></div>
              <h3 className="text-xl font-semibold mb-2">Unified Ticket Inbox</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Manage all your support channels in a single, organized inbox. No more missed requests or scattered conversations.</p>
            </div>
            {/* Feature 2 */}
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
              <div className="mb-4"><CheckCircle className="h-8 w-8 text-primary" /></div>
              <h3 className="text-xl font-semibold mb-2">Automation & Workflows</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Automate repetitive tasks like ticket assignment, routing, and notifications to boost team efficiency.</p>
            </div>
            {/* Feature 3 */}
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
              <div className="mb-4"><CheckCircle className="h-8 w-8 text-primary" /></div>
              <h3 className="text-xl font-semibold mb-2">Collaboration Tools</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Enable real-time collaboration with shared inboxes, internal notes, and agent collision detection.</p>
            </div>
            {/* Feature 4 */}
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
              <div className="mb-4"><CheckCircle className="h-8 w-8 text-primary" /></div>
              <h3 className="text-xl font-semibold mb-2">Reporting & Analytics</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Track key metrics, identify trends, and gain actionable insights to improve your support performance.</p>
            </div>
            {/* Feature 5 */}
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
              <div className="mb-4"><CheckCircle className="h-8 w-8 text-primary" /></div>
              <h3 className="text-xl font-semibold mb-2">Knowledge Base (Coming Soon)</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Empower customers to resolve issues themselves with a self-service knowledge base (Coming Soon!).</p>
            </div>
            {/* Feature 6 */}
            <div className="p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-700">
              <div className="mb-4"><CheckCircle className="h-8 w-8 text-primary" /></div>
              <h3 className="text-xl font-semibold mb-2">Multi-Channel Support</h3>
              <p className="text-zinc-500 dark:text-zinc-400">Connect with your customers wherever they are - email, chat, social media, and more.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-24">
          <h2 className="text-3xl font-semibold mb-12 text-center">Flexible Pricing Plans to Scale with You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center max-w-5xl mx-auto">
            {/* Pricing Card - Basic */}
            <Card className="h-96">
              <CardHeader className='py-4'>
                <CardTitle className="text-2xl font-bold">Basic</CardTitle>
                <CardDescription style={{marginBottom: "20px"}}>For individuals and small teams.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 py-2 flex flex-col justify-between h-64">
                <div className="text-4xl font-bold">$19<span className="text-sm text-zinc-500 dark:text-zinc-400">/month</span></div>
                <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Up to 3 Users</li>
                  <li>Core Features</li>
                  <li>Basic Reporting</li>
                  <li>Email Support</li>
                </ul>
                <Button className="w-full shiny-button">Choose Basic</Button>
              </CardContent>
            </Card>
            {/* Pricing Card - Pro */}
            <Card className="h-96">
              <CardHeader className="py-4">
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <CardDescription>For growing businesses seeking advanced features.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 py-2 flex flex-col justify-between h-64">
                <div className="text-4xl font-bold">$49<span className="text-sm text-zinc-500 dark:text-zinc-400">/month</span></div>
                <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Up to 10 Users</li>
                  <li>Advanced Features</li>
                  <li>Automated Workflows</li>
                  <li>Priority Support</li>
                </ul>
                <Button className="w-full shiny-button relative" style={{bottom: "0px"}}>Choose Pro</Button>
              </CardContent>
            </Card>
            {/* Pricing Card - Enterprise */}
            <Card className="h-96">
              <CardHeader className="py-4">
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <CardDescription>For large organizations with custom needs.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 px-6 py-2 flex flex-col justify-between h-64">
                <div className="text-4xl font-bold">Custom</div>
                <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Unlimited Users</li>
                  <li>Full Feature Set</li>
                  <li>Dedicated Support</li>
                  <li>Custom SLA</li>
                </ul>
                <Button variant="outline" className="w-full">Contact Us</Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center pb-24">
          <h2 className="text-3xl font-semibold mb-8">Ready for <span className="text-primary">Simpler Support?</span></h2>
          <p className="text-lg text-zinc-500 dark:text-zinc-400 mb-12 max-w-xl mx-auto">
            Ready to <span className="text-primary">uncomplicate your support?</span> Start your free trial today and experience how <span className="text-primary">Resolvely simplifies ticket management</span> from day one.
          </p>
          <Link href="/auth/signup">
            <Button size="lg" className="shiny-button">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>

      </main>

      <footer className="py-12 border-t flex justify-center border-zinc-200 dark:border-zinc-800 text-center text-zinc-500 dark:text-zinc-400">
        <div className="max-w-screen-xl px-6">
          &copy; {new Date().getFullYear()} Resolvely. All rights reserved.  |  <Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>  |  <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}