import { Metadata } from 'next'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watt.com.pk'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `contact@${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'watt.com.pk'}`

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: `Privacy Policy for ${SITE_NAME}. Learn how we collect, use, and protect your personal data.`,
}

const PrivacyPolicyPage = () => {
  return (
    <div className="container mx-auto max-w-4xl py-16 lg:py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Privacy Policy</h1>
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        Last updated: February 28, 2026
      </p>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <p>
          At <strong>{SITE_NAME}</strong>, we are committed to protecting your privacy. This Privacy Policy explains
          how we collect, use, disclose, and safeguard your information when you visit our website
          at <a href={SITE_URL}>{SITE_URL}</a>.
        </p>

        <h2>Information We Collect</h2>
        <h3>Personal Data</h3>
        <p>
          When you register for an account, we may collect personally identifiable information such as:
        </p>
        <ul>
          <li>Name and username</li>
          <li>Email address</li>
          <li>Profile picture (if uploaded)</li>
          <li>Any other information you voluntarily provide</li>
        </ul>

        <h3>Usage Data</h3>
        <p>
          We may automatically collect information about how you access and use the website, including your IP address,
          browser type, operating system, referring URLs, pages visited, and the dates and times of your visits.
        </p>

        <h2>How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Create and manage your account</li>
          <li>Send you administrative communications (e.g., account verification, password reset)</li>
          <li>Respond to your comments and questions</li>
          <li>Analyze usage patterns to improve user experience</li>
          <li>Prevent fraud and enforce our terms</li>
        </ul>

        <h2>Sharing of Information</h2>
        <p>
          We do not sell your personal information. We may share your information only in the following circumstances:
        </p>
        <ul>
          <li><strong>With your consent</strong> — when you authorize sharing</li>
          <li><strong>Service providers</strong> — trusted third-party services that help operate our website (e.g., hosting, analytics)</li>
          <li><strong>Legal requirements</strong> — if required by law, court order, or governmental regulation</li>
        </ul>

        <h2>Data Security</h2>
        <p>
          We use commercially reasonable measures to protect your personal data. However, no method of
          transmission over the Internet is 100% secure. We cannot guarantee absolute security.
        </p>

        <h2>Your Rights</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Request correction of inaccurate data</li>
          <li>Request deletion of your account and personal data</li>
          <li>Withdraw consent at any time</li>
        </ul>

        <h2>Third-Party Links</h2>
        <p>
          Our website may contain links to third-party websites. We are not responsible for the privacy
          practices or content of those sites.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by
          posting the new policy on this page and updating the &quot;Last updated&quot; date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
