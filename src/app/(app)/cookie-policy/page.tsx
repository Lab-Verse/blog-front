import { Metadata } from 'next'

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || 'TWA Blog'
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://watt.com.pk'
const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || `contact@${process.env.NEXT_PUBLIC_SITE_DOMAIN || 'watt.com.pk'}`

export const metadata: Metadata = {
  title: 'Cookie Policy',
  description: `Cookie Policy for ${SITE_NAME}. Learn how we use cookies and similar technologies.`,
}

const CookiePolicyPage = () => {
  return (
    <div className="container mx-auto max-w-4xl py-16 lg:py-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Cookie Policy</h1>
      <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
        Last updated: February 28, 2026
      </p>

      <div className="prose prose-neutral mt-10 max-w-none dark:prose-invert">
        <p>
          This Cookie Policy explains how <strong>{SITE_NAME}</strong> ({' '}
          <a href={SITE_URL}>{SITE_URL}</a>) uses cookies and similar technologies to recognise
          you when you visit our website.
        </p>

        <h2>What Are Cookies?</h2>
        <p>
          Cookies are small text files that are stored on your device (computer, tablet, or mobile)
          when you visit a website. They are widely used to make websites work efficiently and to
          provide information to the site owners.
        </p>

        <h2>How We Use Cookies</h2>
        <p>We use the following types of cookies:</p>

        <h3>Essential Cookies</h3>
        <p>
          These cookies are necessary for the website to function and cannot be switched off. They
          include:
        </p>
        <ul>
          <li><strong>Authentication tokens</strong> — to keep you logged in during your session</li>
          <li><strong>Session cookies</strong> — to maintain your browsing session</li>
          <li><strong>Security cookies</strong> — to prevent cross-site request forgery</li>
        </ul>

        <h3>Analytics Cookies</h3>
        <p>
          We may use analytics cookies to understand how visitors interact with our website. These
          cookies help us measure traffic, identify popular pages, and improve the user experience.
        </p>

        <h3>Preference Cookies</h3>
        <p>
          These cookies remember your preferences (such as dark mode or language settings) to
          personalise your experience.
        </p>

        <h2>Cookie Details</h2>
        <div className="overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>accessToken</td>
                <td>Authentication — keeps you logged in</td>
                <td>1 day</td>
                <td>Essential</td>
              </tr>
              <tr>
                <td>refreshToken</td>
                <td>Authentication — renews your session</td>
                <td>7 days</td>
                <td>Essential</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2>Managing Cookies</h2>
        <p>
          You can control and manage cookies through your browser settings. Most browsers allow you to:
        </p>
        <ul>
          <li>View what cookies are stored and delete them individually</li>
          <li>Block third-party cookies</li>
          <li>Block cookies from specific sites</li>
          <li>Block all cookies</li>
          <li>Delete all cookies when you close the browser</li>
        </ul>
        <p>
          Please note that blocking essential cookies may prevent you from using certain features
          of the website, such as logging in.
        </p>

        <h2>Third-Party Cookies</h2>
        <p>
          We may use third-party services (such as analytics providers) that set their own cookies.
          We do not control those cookies. Please refer to the respective third-party privacy policies
          for information on their cookies.
        </p>

        <h2>Changes to This Policy</h2>
        <p>
          We may update this Cookie Policy from time to time. Any changes will be posted on this
          page with an updated date.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have questions about our use of cookies, please contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </div>
    </div>
  )
}

export default CookiePolicyPage
