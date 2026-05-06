export default function Footer() {
  return (
    <>
      <footer className="bg-[var(--ink)] px-16 max-md:px-6 py-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="font-playfair text-3xl font-black text-white">
              Hunar<span className="text-[var(--clay-light)]">Hub</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-white/45 max-w-xs">
              Connecting skilled local artisans with customers who value
              handcrafted quality. Built with MERN. Powered by community.
            </p>
          </div>

          {/* Platform */}
          <FooterColumn
            title="Platform"
            links={["Browse Artisans", "Categories", "How It Works", "Pricing"]}
          />

          {/* Artisans */}
          <FooterColumn
            title="Artisans"
            links={[
              "Join as Artisan",
              "Verification",
              "Earnings Guide",
              "Success Stories",
            ]}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={["About Us", "Blog", "Privacy Policy", "Contact"]}
          />
        </div>
      </footer>

      {/* Bottom Bar */}
      <div className="bg-[var(--ink)] border-t border-white/5 px-6 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-center">
        <div className="text-xs text-white/25 text-center">
          © 2026 HunarHub. Empowering artisans, one skill at a time.
        </div>
      </div>
    </>
  );
}

/* Reusable Column Component */
function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60 mb-6">
        {title}
      </h4>

      <ul className="flex flex-col gap-3">
        {links.map((link) => (
          <li key={link}>
            <a
              href="#"
              className="text-sm text-white/40 hover:text-[var(--clay-light)] transition"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
