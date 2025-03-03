// app/page.js
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { ArrowRight, CheckCircle, Rocket } from "lucide-react"; // Icons - install: `npm install lucide-react`
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"; // Shadcn Card
import { HomeNavbar } from "./HomeNavbar";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
      <HomeNavbar />
      <main className="mx-16 mt-32 flex-1 overflow-y-auto overflow-x-hidden xl:mt-48">
        {/* Hero Section */}
        <section className="mb-24 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            Uncomplicate Your Support. Get{" "}
            <span className="text-primary">Resolvely.</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-500 dark:text-zinc-400 md:text-xl">
            Stop struggling with messy support systems.{" "}
            <span className="text-primary">Resolvely</span> offers a{" "}
            <span className="text-primary">compact yet powerful platform</span>{" "}
            that simplifies your workflows, so you can{" "}
            <span className="text-primary">focus on what matters most:</span>{" "}
            your customers.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/auth/signup">
              <Button size="lg">
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
          <h2 className="mb-12 text-center text-3xl font-semibold">
            Empowering Features for Your Support Team
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Unified Ticket Inbox
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Manage all your support channels in a single, organized inbox.
                No more missed requests or scattered conversations.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Automation & Workflows
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Automate repetitive tasks like ticket assignment, routing, and
                notifications to boost team efficiency.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Collaboration Tools
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Enable real-time collaboration with shared inboxes, internal
                notes, and agent collision detection.
              </p>
            </div>
            {/* Feature 4 */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Reporting & Analytics
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Track key metrics, identify trends, and gain actionable insights
                to improve your support performance.
              </p>
            </div>
            {/* Feature 5 */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Knowledge Base (Coming Soon)
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Empower customers to resolve issues themselves with a
                self-service knowledge base (Coming Soon!).
              </p>
            </div>
            {/* Feature 6 */}
            <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-md dark:border-zinc-700 dark:bg-zinc-800">
              <div className="mb-4">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">
                Multi-Channel Support
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Connect with your customers wherever they are - email, chat,
                social media, and more.
              </p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="mb-24">
          <h2 className="mb-12 text-center text-3xl font-semibold">
            Flexible Pricing Plans to Scale with You
          </h2>
          <div className="mx-auto grid max-w-5xl grid-cols-1 justify-center gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Pricing Card - Basic */}
            <Card className="h-96">
              <CardHeader className="py-4">
                <CardTitle className="text-2xl font-bold">Basic</CardTitle>
                <CardDescription style={{ marginBottom: "20px" }}>
                  For individuals and small teams.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-64 flex-col justify-between space-y-4 px-6 py-2">
                <div className="text-4xl font-bold">
                  $19
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    /month
                  </span>
                </div>
                <ul className="list-inside list-disc space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Up to 3 Users</li>
                  <li>Core Features</li>
                  <li>Basic Reporting</li>
                  <li>Email Support</li>
                </ul>
                <Button className="w-full">Choose Basic</Button>
              </CardContent>
            </Card>
            {/* Pricing Card - Pro */}
            <Card className="h-96">
              <CardHeader className="py-4">
                <CardTitle className="text-2xl font-bold">Pro</CardTitle>
                <CardDescription>
                  For growing businesses seeking advanced features.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-64 flex-col justify-between space-y-4 px-6 py-2">
                <div className="text-4xl font-bold">
                  $49
                  <span className="text-sm text-zinc-500 dark:text-zinc-400">
                    /month
                  </span>
                </div>
                <ul className="list-inside list-disc space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Up to 10 Users</li>
                  <li>Advanced Features</li>
                  <li>Automated Workflows</li>
                  <li>Priority Support</li>
                </ul>
                <Button
                  className="relative w-full"
                  style={{ bottom: "0px" }}
                >
                  Choose Pro
                </Button>
              </CardContent>
            </Card>
            {/* Pricing Card - Enterprise */}
            <Card className="h-96">
              <CardHeader className="py-4">
                <CardTitle className="text-2xl font-bold">Enterprise</CardTitle>
                <CardDescription>
                  For large organizations with custom needs.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-64 flex-col justify-between space-y-4 px-6 py-2">
                <div className="text-4xl font-bold">Custom</div>
                <ul className="list-inside list-disc space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Unlimited Users</li>
                  <li>Full Feature Set</li>
                  <li>Dedicated Support</li>
                  <li>Custom SLA</li>
                </ul>
                <Button variant="outline" className="w-full">
                  Contact Us
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="pb-24 text-center">
          <h2 className="mb-8 text-3xl font-semibold">
            Ready for <span className="text-primary">Simpler Support?</span>
          </h2>
          <p className="mx-auto mb-12 max-w-xl text-lg text-zinc-500 dark:text-zinc-400">
            Ready to{" "}
            <span className="text-primary">uncomplicate your support?</span>{" "}
            Start your free trial today and experience how{" "}
            <span className="text-primary">
              Resolvely simplifies ticket management
            </span>{" "}
            from day one.
          </p>
          <Link href="/auth/signup">
            <Button size="lg">
              Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="flex justify-center border-t border-zinc-200 py-12 text-center text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
        <div className="max-w-screen-xl px-6">
          &copy; {new Date().getFullYear()} Resolvely. All rights reserved. |{" "}
          <Link href="/terms" className="transition-colors hover:text-primary">
            Terms of Service
          </Link>{" "}
          |{" "}
          <Link
            href="/privacy"
            className="transition-colors hover:text-primary"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
