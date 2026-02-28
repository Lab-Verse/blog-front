import { Metadata } from 'next'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watt.com.pk'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `contact@${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'watt.com.pk'}`

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: `Terms of Service for ${SITE_NAME}. Read the terms governing the use of our platform.`,
}

const TermsOfServicePage = () => {
  return (
    <div className="container mx-auto max-w-4xl py-16 lg:py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Terms of Service</h1>
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        Last updated: February 28, 2026
      </p>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <p>
          Welcome to <strong>{SITE_NAME}</strong>. By accessing or using our website at{' '}
          <a href={SITE_URL}>{SITE_URL}</a>, you agree to be bound by these Terms of Service.
          If you do not agree, please do not use our services.
        </p>

        <h2>1. Account Registration</h2>
        <p>
          To access certain features, you may need to create an account. You agree to:
        </p>
        <ul>
          <li>Provide accurate and complete information during registration</li>
          <li>Keep your login credentials secure and confidential</li>
          <li>Accept responsibility for all activity under your account</li>
          <li>Notify us immediately of any unauthorized use of your account</li>
        </ul>
        <p>
          New accounts are subject to admin approval before activation.
        </p>

        <h2>2. User Content</h2>
        <p>
          You retain ownership of the content you submit (posts, comments, media). By submitting content,
          you grant {SITE_NAME} a non-exclusive, worldwide, royalty-free license to use, display, and
          distribute your content on the platform.
        </p>
        <p>You agree not to post content that:</p>
        <ul>
          <li>Is unlawful, harmful, threatening, abusive, or harassing</li>
          <li>Infringes on copyrights, trademarks, or other intellectual property rights</li>
          <li>Contains viruses, malware, or other harmful code</li>
          <li>Is spam, unsolicited advertising, or promotional material</li>
          <li>Impersonates another person or entity</li>
        </ul>

        <h2>3. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the service for any illegal purpose</li>
          <li>Attempt to gain unauthorized access to any part of the system</li>
          <li>Interfere with the proper functioning of the service</li>
          <li>Scrape, crawl, or collect data without our written consent</li>
          <li>Create multiple accounts to circumvent restrictions</li>
        </ul>

        <h2>4. Intellectual Property</h2>
        <p>
          The {SITE_NAME} name, logo, website design, and original content are the property of {SITE_NAME}
          and are protected by copyright and intellectual property laws. You may not reproduce, distribute,
          or create derivative works without our written permission.
        </p>

        <h2>5. Termination</h2>
        <p>
          We reserve the right to suspend or terminate your account at any time, with or without cause,
          and with or without notice. Upon termination, your right to use the service ceases immediately.
        </p>

        <h2>6. Disclaimer of Warranties</h2>
        <p>
          The service is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind,
          either express or implied. We do not guarantee that the service will be uninterrupted, secure, or error-free.
        </p>

        <h2>7. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, {SITE_NAME} shall not be liable for any indirect,
          incidental, special, or consequential damages arising from your use of the service.
        </p>

        <h2>8. Changes to Terms</h2>
        <p>
          We may modify these terms at any time. Continued use of the service after changes
          constitutes acceptance of the updated terms.
        </p>

        <h2>9. Contact</h2>
        <p>
          For questions about these Terms of Service, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  )
}

export default TermsOfServicePage
