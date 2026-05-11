import { HashLink as Link } from 'react-router-hash-link';

export default function Footer() {
  return (
    <>
      <footer className="bg-[var(--ink)] px-16 max-md:px-6 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className='sm:col-span-3 md:col-span-2'>
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
            links={[
              { lable: "Browse Artisans", link: "/search" },
              { lable: "How It Works", link: "/home#how-it-works" },
            ]}
          />

          {/* Artisans */}
          <FooterColumn
            title="Artisans"
            links={[
              { lable: "Join as Artisan", link: "/auth" },
              { lable: "Success Stories", link: "/home#testimonials" },
            ]}
          />

          {/* Company */}
          <FooterColumn
            title="Company"
            links={[
              { lable: "About Us", link: "/home#about" },
              { lable: "Contact", link: "" },
            ]}
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
function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { lable: string; link: string }[];
}) {
  return (
    <div>
      <h4 className="text-xs font-semibold tracking-[0.2em] uppercase text-white/60 mb-3">
        {title}
      </h4>

      <ul className="flex flex-col gap-2">
        {links.map((link) => (
          <li key={link.lable}>
            <Link
              smooth
              to={link.link}
              className="text-sm text-white/40 hover:text-[var(--clay-light)] transition"
            >
              {link.lable}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
